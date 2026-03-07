import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const { prompt, style, model, referenceImage } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "A text prompt is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get user from auth header if present
    let userId: string | null = null;
    if (authHeader) {
      const supabaseClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await supabaseClient.auth.getUser();
      userId = user?.id ?? null;
    }

    // Build the full prompt with style modifier
    const styleModifiers: Record<string, string> = {
      realistic: "photorealistic, ultra detailed, natural lighting",
      abstract: "abstract art, non-representational, bold shapes and colors",
      cartoon: "cartoon style, cel shaded, vibrant colors",
      watercolor: "watercolor painting, soft edges, wet wash technique",
      retro: "retro vintage style, 1970s aesthetic, film grain",
      negative: "inverted colors, negative image effect, high contrast",
      cyberpunk: "cyberpunk aesthetic, neon lights, futuristic dystopia",
      "pixel-art": "pixel art, 16-bit style, retro game aesthetic",
      "oil-painting": "oil painting, thick brushstrokes, rich textures",
      "3d-render": "3D render, octane render, volumetric lighting",
      anime: "anime style, Japanese animation, detailed cel shading",
      noir: "film noir, black and white, dramatic shadows, high contrast",
      vaporwave: "vaporwave aesthetic, pastel colors, retro digital, glitch art",
      surrealism: "surrealist art, dreamlike, impossible geometry, Salvador Dali inspired",
    };

    const modifier = styleModifiers[style] || "";
    const fullPrompt = modifier ? `${prompt}, ${modifier}` : prompt;

    console.log(`Generating image for user: ${userId}, model: ${model}, style: ${style}`);

    let userContent: any;
    if (referenceImage) {
      userContent = [
        { type: "text", text: `Using the provided reference image as inspiration, generate a new image: ${fullPrompt}` },
        { type: "image_url", image_url: { url: referenceImage } },
      ];
    } else {
      userContent = `Generate an image: ${fullPrompt}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: userContent }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Image generation failed." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "No image was generated. Try a different prompt." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // If user is authenticated, save to storage and database
    let savedPath: string | null = null;
    let dbRecord: any = null;

    if (userId) {
      const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Decode base64 image and upload to storage
      try {
        const base64Match = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
        if (base64Match) {
          const ext = base64Match[1] === "jpeg" ? "jpg" : base64Match[1];
          const base64Data = base64Match[2];
          const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

          const filePath = `${userId}/${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await adminClient.storage
            .from("generated-images")
            .upload(filePath, binaryData, { contentType: `image/${base64Match[1]}`, upsert: false });

          if (uploadError) {
            console.error("Upload error:", uploadError);
          } else {
            savedPath = filePath;

            // Save to database
            const shareSlug = crypto.randomUUID().slice(0, 12);
            const { data: record, error: dbError } = await adminClient
              .from("generated_images")
              .insert({
                user_id: userId,
                prompt,
                style,
                model,
                image_path: filePath,
                share_slug: shareSlug,
              })
              .select()
              .single();

            if (dbError) console.error("DB error:", dbError);
            else dbRecord = record;
          }
        }
      } catch (saveErr) {
        console.error("Save error:", saveErr);
      }
    }

    return new Response(
      JSON.stringify({
        imageUrl,
        savedPath,
        dbRecord,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
