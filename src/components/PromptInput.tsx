import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  onEnhance: () => void;
  isGenerating: boolean;
}

const PromptInput = ({ prompt, onPromptChange, onGenerate, onEnhance, isGenerating }: PromptInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-2 block">
        Prompt Input
      </label>
      <div
        className={`relative metal-panel rounded-lg transition-all duration-500 ${
          isFocused ? "neon-border-cyan" : ""
        }`}
      >
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe the image you want to forge..."
          rows={4}
          className="w-full bg-transparent px-4 pt-4 pb-12 text-foreground font-body text-lg placeholder:text-muted-foreground/50 focus:outline-none resize-none"
        />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <button
            onClick={onEnhance}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary hover:bg-secondary/80 transition-colors group"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-purple group-hover:text-accent transition-colors" />
            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              Enhance
            </span>
          </button>

          <motion.button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-display text-sm tracking-wider transition-all duration-300 ${
              prompt.trim() && !isGenerating
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                FORGING...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                GENERATE
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="mt-2 flex gap-2 flex-wrap">
        {["A futuristic cyberpunk city at sunset", "Watercolor fox in snowy forest", "Retro 80s arcade with neon"].map(
          (example) => (
            <button
              key={example}
              onClick={() => onPromptChange(example)}
              className="px-2 py-1 rounded text-[11px] font-mono text-muted-foreground bg-secondary/50 hover:bg-secondary hover:text-foreground transition-colors truncate max-w-[200px]"
            >
              {example}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PromptInput;
