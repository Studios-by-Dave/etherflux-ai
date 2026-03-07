import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageReferenceUploadProps {
  referenceImage: string | null;
  onImageChange: (dataUrl: string | null) => void;
}

const MAX_SIZE_MB = 10;

const ImageReferenceUpload = ({ referenceImage, onImageChange }: ImageReferenceUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }, [processFile]);

  return (
    <div className="metal-panel rounded-lg p-4">
      <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-3 block">
        <Pencil className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
        Image Reference (optional)
      </label>

      <AnimatePresence mode="wait">
        {referenceImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-md overflow-hidden border border-border"
          >
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full h-40 object-contain bg-secondary/30"
            />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                onClick={() => onImageChange(null)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-background/70 backdrop-blur-sm px-3 py-1.5">
              <span className="font-mono text-[9px] text-primary tracking-wider">
                REFERENCE LOADED — WILL INFLUENCE OUTPUT
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-md border-2 border-dashed transition-colors
              flex flex-col items-center justify-center gap-2 py-8
              ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/40 hover:bg-secondary/20"
              }
            `}
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              DROP IMAGE OR CLICK TO UPLOAD
            </span>
            <span className="font-mono text-[9px] text-muted-foreground/50">
              Screenshots, scribbles, drawings — up to {MAX_SIZE_MB}MB
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ImageReferenceUpload;
