import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Zap, Image, Share2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Image Generation",
    description: "Transform text prompts into stunning visuals using state-of-the-art neural models.",
  },
  {
    icon: Image,
    title: "Reference-Based Creation",
    description: "Upload sketches, screenshots, or drawings to guide the AI output.",
  },
  {
    icon: Zap,
    title: "14+ Style Engines",
    description: "From photorealistic to cyberpunk, anime to oil painting — choose your aesthetic.",
  },
  {
    icon: Share2,
    title: "Public Gallery & Sharing",
    description: "Share your creations with public links. Build your portfolio of forged images.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Nav */}
      <header className="relative border-b border-border py-4 px-6">
        <div className="diamond-plate absolute inset-0 opacity-30" />
        <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center neon-border-cyan">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider text-primary neon-glow-cyan">
                FORGE<span className="text-foreground">IMG</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="font-mono text-xs text-muted-foreground hover:text-foreground">
                LOG IN
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="font-display text-[10px] tracking-[0.15em] uppercase bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 metal-panel rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
              NEURAL FORGE ONLINE — v2.4.1
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider leading-tight mb-6">
            <span className="text-primary neon-glow-cyan">FORGE</span>{" "}
            <span className="text-foreground">IMAGES</span>
            <br />
            <span className="text-muted-foreground text-2xl sm:text-3xl lg:text-4xl">
              FROM PURE IMAGINATION
            </span>
          </h2>

          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Industrial-grade AI image generation. Describe what you see in your mind.
            The Forge will bring it to life in seconds.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="font-display text-xs tracking-[0.15em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Start Forging Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="font-mono text-[10px] text-muted-foreground/50 mt-4">
            5 FREE GENERATIONS DAILY • NO CREDIT CARD REQUIRED
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="metal-panel rounded-lg p-6 group hover:neon-border-cyan transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xs tracking-[0.15em] text-foreground mb-2 uppercase">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="font-display text-xl tracking-[0.2em] text-foreground mb-2 uppercase">
            Pricing
          </h3>
          <p className="font-mono text-xs text-muted-foreground">
            START FREE. SCALE WHEN READY.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="metal-panel rounded-lg p-6"
          >
            <div className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1">
              Free Tier
            </div>
            <div className="font-display text-3xl text-foreground mb-4">$0</div>
            <ul className="space-y-2 mb-6">
              {["5 generations per day", "All style engines", "Standard resolution", "Personal gallery"].map((item) => (
                <li key={item} className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth">
              <Button variant="outline" className="w-full font-display text-[10px] tracking-[0.15em] uppercase">
                Get Started
              </Button>
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="metal-panel rounded-lg p-6 neon-border-cyan relative"
          >
            <div className="absolute -top-3 right-4 bg-primary text-primary-foreground font-display text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded-full">
              Popular
            </div>
            <div className="font-display text-xs tracking-[0.2em] text-primary uppercase mb-1">
              Pro Operator
            </div>
            <div className="font-display text-3xl text-foreground mb-4">
              $12<span className="text-lg text-muted-foreground">/mo</span>
            </div>
            <ul className="space-y-2 mb-6">
              {["Unlimited generations", "All style engines", "High resolution output", "Public sharing & links", "Priority queue", "Reference image support"].map((item) => (
                <li key={item} className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth">
              <Button className="w-full font-display text-[10px] tracking-[0.15em] uppercase bg-primary text-primary-foreground hover:bg-primary/90">
                Upgrade to Pro
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground/50">
            FORGEIMG NEURAL IMAGE FOUNDRY © 2026
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/50">
            POWERED BY NANO BANANA
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
