import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Star, Trash2 } from "lucide-react";

interface PromptHistoryEntry {
  id: string;
  prompt: string;
  timestamp: number;
  isFavorite: boolean;
}

interface PromptHistoryProps {
  history: PromptHistoryEntry[];
  onSelectPrompt: (prompt: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const PromptHistory = ({ history, onSelectPrompt, onToggleFavorite, onDelete }: PromptHistoryProps) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filtered = showFavoritesOnly ? history.filter((h) => h.isFavorite) : history;

  if (history.length === 0) return null;

  return (
    <div className="metal-panel rounded-lg overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase">History</span>
        </div>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`p-1 rounded transition-colors ${showFavoritesOnly ? "text-neon-orange" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Star className="w-3.5 h-3.5" fill={showFavoritesOnly ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        {filtered.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-2 flex items-center gap-2 hover:bg-secondary/30 transition-colors group border-b border-border/30 last:border-0"
          >
            <button
              onClick={() => onSelectPrompt(entry.prompt)}
              className="flex-1 text-left font-mono text-xs text-muted-foreground hover:text-foreground truncate transition-colors"
            >
              {entry.prompt}
            </button>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onToggleFavorite(entry.id)} className="p-1 hover:text-neon-orange transition-colors">
                <Star className="w-3 h-3" fill={entry.isFavorite ? "currentColor" : "none"} />
              </button>
              <button onClick={() => onDelete(entry.id)} className="p-1 hover:text-destructive transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PromptHistory;
export type { PromptHistoryEntry };
