import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Cpu, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SharedImage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: image, isLoading } = useQuery({
    queryKey: ["shared-image", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("share_slug", slug)
        .eq("is_public", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const imageUrl = image?.image_path
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/generated-images/${image.image_path}`
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center neon-border-cyan">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display text-sm tracking-wider text-primary neon-glow-cyan">
              FORGE<span className="text-foreground">IMG</span>
            </span>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="metal-panel rounded-lg p-20 text-center">
            <span className="font-mono text-xs text-muted-foreground animate-pulse">LOADING FORGED IMAGE...</span>
          </div>
        ) : !image ? (
          <div className="metal-panel rounded-lg p-20 text-center">
            <span className="font-mono text-xs text-muted-foreground">IMAGE NOT FOUND OR NOT PUBLIC</span>
          </div>
        ) : (
          <div className="metal-panel rounded-lg overflow-hidden">
            {imageUrl && (
              <img src={imageUrl} alt={image.prompt} className="w-full object-contain max-h-[70vh]" />
            )}
            <div className="p-4 border-t border-border">
              <p className="font-body text-sm text-foreground mb-1">{image.prompt}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {image.style?.toUpperCase()} • {image.model?.toUpperCase()}
                </span>
                {imageUrl && (
                  <a href={imageUrl} download target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="font-mono text-[10px]">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/auth">
            <Button className="font-display text-[10px] tracking-[0.15em] uppercase bg-primary text-primary-foreground hover:bg-primary/90">
              Create Your Own — Start Free
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SharedImage;
