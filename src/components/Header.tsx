import { motion } from "framer-motion";
import { Cpu, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="relative border-b border-border py-4 px-6">
      <div className="diamond-plate absolute inset-0 opacity-30" />
      <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center neon-border-cyan">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -inset-1 rounded-lg bg-primary/10 blur-sm -z-10" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider text-primary neon-glow-cyan">
              FORGE<span className="text-foreground">IMG</span>
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
              Neural Image Foundry
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 metal-panel rounded px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground">SYSTEM ONLINE</span>
            </div>
            <div className="metal-panel rounded px-3 py-1.5">
              <span className="font-mono text-xs text-muted-foreground">v2.4.1</span>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="metal-panel rounded px-3 py-1.5 flex items-center gap-2">
                <User className="w-3 h-3 text-primary" />
                <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
