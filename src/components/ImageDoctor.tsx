import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crop,
  Maximize,
  FileImage,
  Sparkles,
  Upload,
  X,
  Check,
  ArrowRightLeft,
  Layers,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
}

const ASPECT_RATIOS = [
  { label: "1:1", value: "1:1" },
  { label: "4:3", value: "4:3" },
  { label: "16:9", value: "16:9" },
  { label: "3:2", value: "3:2" },
  { label: "9:16", value: "9:16" },
  { label: "Custom", value: "custom" },
];

const TARGET_FORMATS = [
  { ext: ".webp", label: "WebP", desc: "Best for SEO — Google recommended", seoScore: 98 },
  { ext: ".avif", label: "AVIF", desc: "Next-gen — smallest file size", seoScore: 99 },
  { ext: ".png", label: "PNG", desc: "Lossless — transparency support", seoScore: 75 },
  { ext: ".jpg", label: "JPG", desc: "Universal — wide compatibility", seoScore: 70 },
  { ext: ".svg", label: "SVG", desc: "Vector — infinite scaling", seoScore: 95 },
];

const ImageDoctor = () => {
  const [activeTab, setActiveTab] = useState("tools");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFormat, setSelectedFormat] = useState(".webp");
  const [resizeWidth, setResizeWidth] = useState([1024]);
  const [resizeHeight, setResizeHeight] = useState([768]);
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [sharpenLevel, setSharpenLevel] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    const newFiles: UploadedFile[] = Array.from(uploaded).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type,
      extension: "." + f.name.split(".").pop()?.toLowerCase(),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const simulateProcess = () => {
    setIsProcessing(true);
    setProcessComplete(false);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessComplete(true);
      setTimeout(() => setProcessComplete(false), 3000);
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="metal-panel rounded-lg p-4 relative screw-corner">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded bg-neon-green/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-neon-green" />
        </div>
        <div>
          <h3 className="font-display text-xs tracking-[0.15em] text-foreground">IMAGE DOCTOR</h3>
          <p className="font-mono text-[9px] text-muted-foreground">FIX • OPTIMIZE • CONVERT</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-secondary/50 p-0.5 h-auto">
          <TabsTrigger value="tools" className="flex-1 text-[10px] font-display tracking-wider py-1.5 data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green">
            TOOLS
          </TabsTrigger>
          <TabsTrigger value="convert" className="flex-1 text-[10px] font-display tracking-wider py-1.5 data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green">
            CONVERT
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex-1 text-[10px] font-display tracking-wider py-1.5 data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green">
            BULK
          </TabsTrigger>
        </TabsList>

        {/* === TOOLS TAB === */}
        <TabsContent value="tools" className="mt-3 space-y-4">
          {/* Resize */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-display text-[9px] tracking-[0.15em] text-muted-foreground">
              <Maximize className="w-3 h-3" /> RESIZE
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-mono text-[9px] text-muted-foreground/70 block mb-1">WIDTH</span>
                <Slider value={resizeWidth} onValueChange={setResizeWidth} min={64} max={4096} step={1} />
                <span className="font-mono text-[10px] text-primary mt-1 block">{resizeWidth[0]}px</span>
              </div>
              <div>
                <span className="font-mono text-[9px] text-muted-foreground/70 block mb-1">HEIGHT</span>
                <Slider value={resizeHeight} onValueChange={setResizeHeight} min={64} max={4096} step={1} />
                <span className="font-mono text-[10px] text-primary mt-1 block">{resizeHeight[0]}px</span>
              </div>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-display text-[9px] tracking-[0.15em] text-muted-foreground">
              <Move className="w-3 h-3" /> ASPECT RATIO
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ASPECT_RATIOS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setSelectedRatio(r.value)}
                  className={`px-2 py-1.5 rounded text-[10px] font-mono transition-all border ${
                    selectedRatio === r.value
                      ? "bg-neon-green/10 border-neon-green/40 text-neon-green neon-border-cyan"
                      : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary"
                  }`}
                  style={
                    selectedRatio === r.value
                      ? { boxShadow: "0 0 5px hsl(var(--neon-green) / 0.3)" }
                      : {}
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-display text-[9px] tracking-[0.15em] text-muted-foreground">
              <Crop className="w-3 h-3" /> CROP
            </label>
            <div className="h-24 rounded border border-dashed border-border bg-secondary/20 flex items-center justify-center">
              <span className="font-mono text-[9px] text-muted-foreground/60">Drop image or click to select crop area</span>
            </div>
          </div>

          {/* Sharpen / Remove Blur */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-display text-[9px] tracking-[0.15em] text-muted-foreground">
              <Sparkles className="w-3 h-3" /> REMOVE BLUR / SHARPEN
            </label>
            <Slider value={sharpenLevel} onValueChange={setSharpenLevel} min={0} max={100} step={1} />
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-muted-foreground/60">Soft</span>
              <span className="font-mono text-[10px] text-primary">{sharpenLevel[0]}%</span>
              <span className="font-mono text-[9px] text-muted-foreground/60">Ultra Sharp</span>
            </div>
          </div>

          <Button
            onClick={simulateProcess}
            disabled={isProcessing}
            className="w-full bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 font-display text-[10px] tracking-wider h-9"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
                PROCESSING...
              </span>
            ) : processComplete ? (
              <span className="flex items-center gap-2">
                <Check className="w-3 h-3" /> COMPLETE
              </span>
            ) : (
              "APPLY FIXES"
            )}
          </Button>
        </TabsContent>

        {/* === CONVERT TAB === */}
        <TabsContent value="convert" className="mt-3 space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-display text-[9px] tracking-[0.15em] text-muted-foreground">
              <ArrowRightLeft className="w-3 h-3" /> TARGET FORMAT
            </label>
            <div className="space-y-1.5">
              {TARGET_FORMATS.map((fmt) => (
                <button
                  key={fmt.ext}
                  onClick={() => setSelectedFormat(fmt.ext)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-all border ${
                    selectedFormat === fmt.ext
                      ? "bg-neon-green/10 border-neon-green/40"
                      : "bg-secondary/30 border-border hover:bg-secondary/50"
                  }`}
                >
                  <div>
                    <span className={`font-mono text-xs font-bold ${selectedFormat === fmt.ext ? "text-neon-green" : "text-foreground"}`}>
                      {fmt.label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground ml-2">{fmt.desc}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-12 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-neon-green transition-all"
                        style={{ width: `${fmt.seoScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-[8px] text-neon-green">{fmt.seoScore}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Single file upload */}
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-20 rounded border border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center gap-1 hover:bg-secondary/30 transition-colors"
            >
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-[9px] text-muted-foreground">Upload image to convert</span>
            </button>
          </div>

          <Button
            onClick={simulateProcess}
            disabled={isProcessing}
            className="w-full bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 font-display text-[10px] tracking-wider h-9"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
                CONVERTING...
              </span>
            ) : (
              <>
                <FileImage className="w-3 h-3 mr-1" />
                CONVERT TO {selectedFormat.toUpperCase().slice(1)}
              </>
            )}
          </Button>
        </TabsContent>

        {/* === BULK TAB === */}
        <TabsContent value="bulk" className="mt-3 space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-display text-[9px] tracking-[0.15em] text-muted-foreground">
              <Layers className="w-3 h-3" /> BULK FORMAT CONVERSION
            </label>
            <p className="font-mono text-[9px] text-muted-foreground/70">
              Upload multiple images and convert all file extensions in one click.
            </p>
          </div>

          {/* Target format */}
          <div className="flex gap-1.5 flex-wrap">
            {TARGET_FORMATS.map((fmt) => (
              <button
                key={fmt.ext}
                onClick={() => setSelectedFormat(fmt.ext)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all border ${
                  selectedFormat === fmt.ext
                    ? "bg-neon-green/10 border-neon-green/40 text-neon-green"
                    : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          {/* Multi-file upload */}
          <div>
            <input
              ref={bulkInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => bulkInputRef.current?.click()}
              className="w-full h-24 rounded border border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center gap-1.5 hover:bg-secondary/30 transition-colors"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="font-mono text-[9px] text-muted-foreground">Drop files or click — select multiple</span>
              <span className="font-mono text-[8px] text-muted-foreground/50">JPG, PNG, BMP, TIFF, GIF → {selectedFormat.toUpperCase().slice(1)}</span>
            </button>
          </div>

          {/* File list */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 max-h-40 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] text-muted-foreground">{files.length} file{files.length !== 1 ? "s" : ""} queued</span>
                  <button onClick={() => setFiles([])} className="font-mono text-[8px] text-destructive hover:underline">
                    Clear all
                  </button>
                </div>
                {files.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between px-2 py-1.5 rounded bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileImage className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="font-mono text-[9px] text-foreground truncate">{f.name}</span>
                      <span className="font-mono text-[8px] text-muted-foreground/60 shrink-0">{formatFileSize(f.size)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[8px] text-muted-foreground">{f.extension}</span>
                      <span className="text-neon-green text-[8px]">→</span>
                      <span className="font-mono text-[8px] text-neon-green">{selectedFormat}</span>
                      <button onClick={() => removeFile(f.id)} className="ml-1 p-0.5 rounded hover:bg-destructive/20 transition-colors">
                        <X className="w-2.5 h-2.5 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={simulateProcess}
            disabled={isProcessing || files.length === 0}
            className="w-full bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 font-display text-[10px] tracking-wider h-9"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
                CONVERTING {files.length} FILES...
              </span>
            ) : processComplete ? (
              <span className="flex items-center gap-2">
                <Check className="w-3 h-3" /> ALL FILES CONVERTED
              </span>
            ) : (
              <>
                <Layers className="w-3 h-3 mr-1" />
                CONVERT ALL TO {selectedFormat.toUpperCase().slice(1)}
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageDoctor;
