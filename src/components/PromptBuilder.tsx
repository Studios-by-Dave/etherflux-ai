import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Wrench } from "lucide-react";

interface BlockOption {
  category: string;
  options: string[];
}

const BLOCKS: BlockOption[] = [
  { category: "Subject", options: ["Portrait", "Landscape", "Animal", "Architecture", "Vehicle", "Fantasy Creature", "Robot", "Food"] },
  { category: "Style", options: ["Photorealistic", "Impressionist", "Minimalist", "Baroque", "Pop Art", "Art Nouveau", "Brutalist"] },
  { category: "Lighting", options: ["Golden Hour", "Studio", "Neon", "Moonlight", "Dramatic", "Soft Ambient", "Backlit", "Volumetric"] },
  { category: "Camera", options: ["Wide Angle", "Macro", "Fisheye", "Tilt Shift", "Telephoto", "Aerial Drone", "Portrait Lens"] },
  { category: "Mood", options: ["Serene", "Epic", "Mysterious", "Joyful", "Melancholic", "Intense", "Dreamy", "Chaotic"] },
];

interface PromptBuilderProps {
  onApplyBlocks: (blocks: Record<string, string>) => void;
}

const PromptBuilder = ({ onApplyBlocks }: PromptBuilderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<Record<string, string>>({});

  const handleSelect = (category: string, option: string) => {
    const updated = { ...selectedBlocks, [category]: option };
    setSelectedBlocks(updated);
  };

  const handleApply = () => {
    onApplyBlocks(selectedBlocks);
  };

  const hasSelections = Object.keys(selectedBlocks).length > 0;

  return (
    <div className="metal-panel rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-neon-purple" />
          <span className="font-display text-xs tracking-wider text-foreground">PROMPT BUILDER</span>
          {hasSelections && (
            <span className="px-1.5 py-0.5 rounded bg-primary/20 font-mono text-[10px] text-primary">
              {Object.keys(selectedBlocks).length} blocks
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="border-t border-border"
        >
          <div className="p-4 space-y-4">
            {BLOCKS.map((block) => (
              <div key={block.category}>
                <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-2 block">
                  {block.category}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {block.options.map((option) => {
                    const isSelected = selectedBlocks[block.category] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(block.category, option)}
                        className={`px-2.5 py-1 rounded text-xs font-body transition-all ${
                          isSelected
                            ? "bg-primary/20 text-primary border border-primary/40"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {hasSelections && (
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div className="font-mono text-[10px] text-muted-foreground">
                  {Object.entries(selectedBlocks).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                </div>
                <button
                  onClick={handleApply}
                  className="px-4 py-1.5 rounded bg-accent/20 text-accent hover:bg-accent/30 font-display text-xs tracking-wider transition-colors"
                >
                  APPLY
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PromptBuilder;
