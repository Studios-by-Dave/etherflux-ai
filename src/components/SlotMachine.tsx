import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

const THEMES = ["Cyberpunk City", "Enchanted Forest", "Space Station", "Underwater Kingdom", "Steampunk Lab", "Crystal Cave", "Neon Tokyo", "Ancient Temple"];
const STYLE_OPTIONS = ["Realistic", "Abstract", "Anime", "Oil Painting", "Pixel Art", "Watercolor", "3D Render", "Noir"];
const PALETTES = ["Neon Glow", "Warm Sunset", "Cool Ocean", "Monochrome", "Pastel Dream", "Fire & Ice", "Forest Green", "Galactic"];
const MODEL_OPTIONS = ["Nano Banana", "Diffusion Core", "HyperReal XL", "DreamPainter", "VectorVision", "StylizeAI"];

const REELS = [
  { label: "THEME", items: THEMES },
  { label: "STYLE", items: STYLE_OPTIONS },
  { label: "PALETTE", items: PALETTES },
  { label: "MODEL", items: MODEL_OPTIONS },
];

interface SlotMachineProps {
  onResult: (result: { theme: string; style: string; palette: string; model: string }) => void;
}

const SlotMachine = ({ onResult }: SlotMachineProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelValues, setReelValues] = useState<number[]>([0, 0, 0, 0]);
  const [stoppedReels, setStoppedReels] = useState<boolean[]>([false, false, false, false]);
  const [leverPulled, setLeverPulled] = useState(false);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setLeverPulled(true);
    setStoppedReels([false, false, false, false]);
    setTimeout(() => setLeverPulled(false), 500);

    const interval = setInterval(() => {
      setReelValues((prev) => prev.map((_, i) => Math.floor(Math.random() * REELS[i].items.length)));
    }, 80);

    // Stop reels one by one
    const delays = [1200, 1800, 2400, 3000];
    const finalValues = REELS.map((reel) => Math.floor(Math.random() * reel.items.length));

    delays.forEach((delay, i) => {
      setTimeout(() => {
        setReelValues((prev) => {
          const next = [...prev];
          next[i] = finalValues[i];
          return next;
        });
        setStoppedReels((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, delay);
    });

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      onResult({
        theme: REELS[0].items[finalValues[0]],
        style: REELS[1].items[finalValues[1]],
        palette: REELS[2].items[finalValues[2]],
        model: REELS[3].items[finalValues[3]],
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isSpinning, onResult]);

  return (
    <div className="metal-panel rounded-lg p-4 relative screw-corner">
      <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-3 block">
        Randomizer
      </label>

      <div className="flex gap-2 mb-4">
        {REELS.map((reel, i) => (
          <div key={reel.label} className="flex-1">
            <div className="font-mono text-[8px] text-muted-foreground text-center mb-1 tracking-wider">
              {reel.label}
            </div>
            <div className="bg-metal-dark rounded border border-border overflow-hidden h-10 flex items-center justify-center relative">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-metal-dark to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-metal-dark to-transparent z-10" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${i}-${reelValues[i]}-${stoppedReels[i]}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: isSpinning && !stoppedReels[i] ? 0.06 : 0.3 }}
                  className={`font-mono text-[10px] text-center px-1 truncate ${
                    stoppedReels[i] ? "text-primary neon-glow-cyan" : "text-foreground"
                  }`}
                >
                  {reel.items[reelValues[i]]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <motion.button
        onClick={spin}
        disabled={isSpinning}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        animate={leverPulled ? { rotateX: [0, 15, 0] } : {}}
        className={`w-full py-3 rounded-lg font-display text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 ${
          isSpinning
            ? "bg-neon-purple/20 text-accent border border-accent/30"
            : "bg-secondary hover:bg-secondary/80 text-foreground border border-border hover:neon-border-purple"
        }`}
      >
        <Dices className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
        {isSpinning ? "SPINNING..." : "PULL LEVER"}
      </motion.button>
    </div>
  );
};

export default SlotMachine;
