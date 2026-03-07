import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Cpu } from "lucide-react";

interface Model {
  id: string;
  name: string;
  description: string;
  speed: "fast" | "medium" | "slow";
  quality: "standard" | "high" | "ultra";
}

const MODELS: Model[] = [
  { id: "nano-banana", name: "Nano Banana", description: "Experimental fast gen", speed: "fast", quality: "standard" },
  { id: "diffusion-core", name: "Diffusion Core", description: "Stable diffusion engine", speed: "medium", quality: "high" },
  { id: "hyperreal-xl", name: "HyperReal XL", description: "Photorealistic output", speed: "slow", quality: "ultra" },
  { id: "dreampainter", name: "DreamPainter", description: "Artistic & creative", speed: "medium", quality: "high" },
  { id: "vectorvision", name: "VectorVision", description: "Clean vector styles", speed: "fast", quality: "standard" },
  { id: "stylize-ai", name: "StylizeAI", description: "Style transfer expert", speed: "medium", quality: "high" },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  const speedColor = { fast: "text-neon-green", medium: "text-neon-orange", slow: "text-neon-pink" };
  const qualityDots = { standard: 1, high: 2, ultra: 3 };

  return (
    <div className="relative">
      <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-2 block">
        AI Model
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full metal-panel rounded-lg px-4 py-3 flex items-center justify-between hover:neon-border-cyan transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-primary" />
          <div className="text-left">
            <div className="font-display text-sm text-foreground">{selected.name}</div>
            <div className="font-mono text-[10px] text-muted-foreground">{selected.description}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 z-50 glossy-panel rounded-lg border border-border overflow-hidden"
        >
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => { onModelChange(model.id); setIsOpen(false); }}
              className={`w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors ${
                model.id === selectedModel ? "bg-primary/10 border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="text-left">
                <div className="font-display text-sm text-foreground">{model.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{model.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-[10px] ${speedColor[model.speed]}`}>
                  {model.speed.toUpperCase()}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className={`w-1.5 h-1.5 rounded-full ${
                        dot <= qualityDots[model.quality] ? "bg-primary" : "bg-metal-light"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ModelSelector;
