import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Link as LinkIcon, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  model: string;
  timestamp: number;
  imageUrl?: string;
  shareSlug?: string;
  isPublic?: boolean;
  imagePath?: string;
}

interface ImageGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

const ImageGallery = ({ images, isGenerating }: ImageGalleryProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDownload = (img: GeneratedImage) => {
    if (!img.imageUrl) return;
    const link = document.createElement("a");
    link.href = img.imageUrl;
    link.download = `etherflux-${img.id.slice(0, 8)}.png`;
    link.click();
  };

  const handleShare = async (img: GeneratedImage) => {
    if (!img.shareSlug) return;

    // Toggle public
    const { error } = await supabase
      .from("generated_images")
      .update({ is_public: true })
      .eq("share_slug", img.shareSlug);

    if (error) {
      toast.error("Failed to make image public");
      return;
    }

    const shareUrl = `${window.location.origin}/shared/${img.shareSlug}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedId(img.id);
    toast.success("Share link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (images.length === 0 && !isGenerating) {
    return (
      <div className="metal-panel rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-display text-sm text-muted-foreground tracking-wider">NO IMAGES GENERATED</p>
        <p className="font-mono text-xs text-muted-foreground/60 mt-1">Enter a prompt above to begin forging</p>
      </div>
    );
  }

  return (
    <div>
      <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-3 block">
        Output Gallery — {images.length} image{images.length !== 1 ? "s" : ""}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-lg metal-panel overflow-hidden relative"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="font-mono text-[10px] text-primary animate-pulse">FORGING...</span>
            </div>
            <div className="scanline-overlay absolute inset-0" />
          </motion.div>
        )}

        <AnimatePresence>
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="aspect-square rounded-lg metal-panel overflow-hidden relative group cursor-pointer"
            >
              {img.imageUrl ? (
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20" />
              )}

              {hoveredId === img.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-3"
                >
                  <p className="font-mono text-[10px] text-foreground text-center line-clamp-2">{img.prompt}</p>
                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => handleDownload(img)}
                      className="p-1.5 rounded bg-secondary hover:bg-primary/20 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5 text-foreground" />
                    </button>
                    {img.shareSlug && (
                      <button
                        onClick={() => handleShare(img)}
                        className="p-1.5 rounded bg-secondary hover:bg-primary/20 transition-colors"
                        title="Share"
                      >
                        {copiedId === img.id ? (
                          <Check className="w-3.5 h-3.5 text-neon-green" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 font-mono text-[8px] text-primary">{img.style}</span>
                    <span className="px-1.5 py-0.5 rounded bg-accent/10 font-mono text-[8px] text-accent">{img.model}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageGallery;
export type { GeneratedImage };
