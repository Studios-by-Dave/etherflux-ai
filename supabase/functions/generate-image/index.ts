import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { prompt, style, model, referenceImage } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "A text prompt is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    console.log(`Generating image with model hint: ${model}, style: ${style}, hasReference: ${!!referenceImage}`);
    console.log(`Full prompt: ${fullPrompt}`);

    // Build message content - text only or multimodal with reference image
    let userContent: any;
    if (referenceImage) {
      userContent = [
        {
          type: "text",
          text: `Using the provided reference image as inspiration and guidance, generate a new image: ${fullPrompt}`,
        },
        {
          type: "image_url",
          image_url: { url: referenceImage },
        },
      ];
    } else {
      userContent = `Generate an image: ${fullPrompt}`;
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: userContent,
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Image generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content || "";

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ error: "No image was generated. Try a different prompt." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ imageUrl, description: textContent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-image error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
