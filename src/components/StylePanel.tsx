import { motion } from "framer-motion";
import {
  Camera, Paintbrush, Gamepad2, Droplets, Tv, Skull,
  Zap, Grid3X3, Palette, Box, Star, Moon, Waves, Eye
} from "lucide-react";

interface Style {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const STYLES: Style[] = [
  { id: "realistic", name: "Realistic", icon: <Camera className="w-4 h-4" />, color: "neon-cyan" },
  { id: "abstract", name: "Abstract", icon: <Waves className="w-4 h-4" />, color: "neon-purple" },
  { id: "cartoon", name: "Cartoon", icon: <Gamepad2 className="w-4 h-4" />, color: "neon-green" },
  { id: "watercolor", name: "Watercolor", icon: <Droplets className="w-4 h-4" />, color: "neon-cyan" },
  { id: "retro", name: "Retro", icon: <Tv className="w-4 h-4" />, color: "neon-orange" },
  { id: "negative", name: "Negative", icon: <Skull className="w-4 h-4" />, color: "neon-pink" },
  { id: "cyberpunk", name: "Cyberpunk", icon: <Zap className="w-4 h-4" />, color: "neon-purple" },
  { id: "pixel-art", name: "Pixel Art", icon: <Grid3X3 className="w-4 h-4" />, color: "neon-green" },
  { id: "oil-painting", name: "Oil Painting", icon: <Paintbrush className="w-4 h-4" />, color: "neon-orange" },
  { id: "3d-render", name: "3D Render", icon: <Box className="w-4 h-4" />, color: "neon-cyan" },
  { id: "anime", name: "Anime", icon: <Star className="w-4 h-4" />, color: "neon-pink" },
  { id: "noir", name: "Noir", icon: <Moon className="w-4 h-4" />, color: "neon-cyan" },
  { id: "vaporwave", name: "Vaporwave", icon: <Palette className="w-4 h-4" />, color: "neon-purple" },
  { id: "surrealism", name: "Surrealism", icon: <Eye className="w-4 h-4" />, color: "neon-orange" },
];

interface StylePanelProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
}

const StylePanel = ({ selectedStyle, onStyleChange }: StylePanelProps) => {
  return (
    <div>
      <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-3 block">
        Style Presets
      </label>
      <div className="grid grid-cols-7 sm:grid-cols-7 gap-2">
        {STYLES.map((style, i) => {
          const isSelected = style.id === selectedStyle;
          return (
            <motion.button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all duration-300 ${
                isSelected
                  ? `metal-panel neon-border-cyan bg-primary/10`
                  : "bg-secondary/30 hover:bg-secondary/60 border border-transparent"
              }`}
            >
              <div className={isSelected ? "text-primary" : "text-muted-foreground"}>
                {style.icon}
              </div>
              <span className={`font-mono text-[9px] leading-tight text-center ${
                isSelected ? "text-primary" : "text-muted-foreground"
              }`}>
                {style.name}
              </span>
              {isSelected && (
                <motion.div
                  layoutId="styleIndicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StylePanel;
