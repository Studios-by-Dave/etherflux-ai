import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/Header";
import ModelSelector from "@/components/ModelSelector";
import PromptInput from "@/components/PromptInput";
import StylePanel from "@/components/StylePanel";
import PromptBuilder from "@/components/PromptBuilder";
import SlotMachine from "@/components/SlotMachine";
import ImageGallery, { type GeneratedImage } from "@/components/ImageGallery";
import PromptHistory, { type PromptHistoryEntry } from "@/components/PromptHistory";
import ImageDoctor from "@/components/ImageDoctor";
import ImageReferenceUpload from "@/components/ImageReferenceUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const STYLE_MAP: Record<string, string> = {
  "nano-banana": "Nano Banana",
  "diffusion-core": "Diffusion Core",
  "hyperreal-xl": "HyperReal XL",
  "dreampainter": "DreamPainter",
  "vectorvision": "VectorVision",
  "stylize-ai": "StylizeAI",
};

const MODEL_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(STYLE_MAP).map(([k, v]) => [v, k])
);

const Index = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("diffusion-core");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [history, setHistory] = useState<PromptHistoryEntry[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  // Load persisted images on mount
  useEffect(() => {
    if (!user) return;
    const loadImages = async () => {
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Failed to load images:", error);
        return;
      }

      if (data) {
        const mapped: GeneratedImage[] = data.map((row: any) => ({
          id: row.id,
          prompt: row.prompt,
          style: row.style || "",
          model: row.model || "",
          timestamp: new Date(row.created_at).getTime(),
          imageUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/generated-images/${row.image_path}`,
          shareSlug: row.share_slug,
          isPublic: row.is_public,
          imagePath: row.image_path,
        }));
        setImages(mapped);
      }
    };
    loadImages();
  }, [user]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    const historyEntry: PromptHistoryEntry = {
      id: crypto.randomUUID(),
      prompt: prompt.trim(),
      timestamp: Date.now(),
      isFavorite: false,
    };
    setHistory((prev) => [historyEntry, ...prev.slice(0, 19)]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: prompt.trim(),
          style: selectedStyle,
          model: STYLE_MAP[selectedModel] || selectedModel,
          referenceImage: referenceImage || undefined,
        },
      });

      if (error) throw new Error(error.message || "Generation failed");
      if (data?.error) throw new Error(data.error);

      const newImage: GeneratedImage = {
        id: data.dbRecord?.id || crypto.randomUUID(),
        prompt: prompt.trim(),
        style: selectedStyle,
        model: STYLE_MAP[selectedModel] || selectedModel,
        timestamp: Date.now(),
        imageUrl: data.savedPath
          ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/generated-images/${data.savedPath}`
          : data.imageUrl,
        shareSlug: data.dbRecord?.share_slug,
        isPublic: data.dbRecord?.is_public,
        imagePath: data.savedPath,
      };
      setImages((prev) => [newImage, ...prev]);
      toast.success("Image forged successfully!");
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, selectedStyle, isGenerating, referenceImage]);

  const handleEnhance = () => {
    if (!prompt.trim()) return;
    const enhancers = [
      ", highly detailed, 8k resolution, masterpiece quality",
      ", cinematic lighting, dramatic composition, ultra realistic",
      ", professional photography, award winning, stunning detail",
    ];
    setPrompt(prompt + enhancers[Math.floor(Math.random() * enhancers.length)]);
  };

  const handleSlotResult = (result: { theme: string; style: string; palette: string; model: string }) => {
    setPrompt(`${result.theme} in ${result.style} style with ${result.palette} color palette`);
    const modelKey = MODEL_REVERSE[result.model];
    if (modelKey) setSelectedModel(modelKey);
  };

  const handleApplyBlocks = (blocks: Record<string, string>) => {
    setPrompt(Object.values(blocks).join(", ") + " composition");
  };

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)));
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <PromptInput prompt={prompt} onPromptChange={setPrompt} onGenerate={handleGenerate} onEnhance={handleEnhance} isGenerating={isGenerating} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <ImageReferenceUpload referenceImage={referenceImage} onImageChange={setReferenceImage} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}>
              <PromptBuilder onApplyBlocks={handleApplyBlocks} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}>
              <StylePanel selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <ImageGallery images={images} isGenerating={isGenerating} />
            </motion.div>
          </div>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <ImageDoctor />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <SlotMachine onResult={handleSlotResult} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <PromptHistory history={history} onSelectPrompt={setPrompt} onToggleFavorite={handleToggleFavorite} onDelete={handleDeleteHistory} />
            </motion.div>
          </div>
        </div>

        <div className="mt-8 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-muted-foreground">{images.length} IMAGE{images.length !== 1 ? "S" : ""} FORGED</span>
            <span className="font-mono text-[10px] text-muted-foreground">•</span>
            <span className="font-mono text-[10px] text-muted-foreground">MODEL: {STYLE_MAP[selectedModel]?.toUpperCase()}</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/50">FORGEIMG NEURAL IMAGE FOUNDRY © 2026</span>
        </div>
      </main>
    </div>
  );
};

export default Index;
