"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />
      
      {/* Network Graph / Flowing Nodes BG Graphic */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
         <div className="relative w-full max-w-5xl aspect-video border border-border/10 rounded-3xl glass hidden md:flex items-center justify-center">
           <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
              <motion.path 
                d="M 100 200 C 200 200, 300 100, 400 150 S 600 250, 700 150" 
                fill="transparent" 
                stroke="var(--primary)" 
                strokeWidth="2" 
                strokeDasharray="5 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.path 
                d="M 100 250 C 300 300, 500 50, 700 200" 
                fill="transparent" 
                stroke="var(--accent)" 
                strokeWidth="1.5" 
                strokeDasharray="4 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1 }}
              />
              <motion.circle cx="100" cy="200" r="5" fill="var(--accent)" />
              <motion.circle cx="400" cy="150" r="5" fill="var(--primary)" />
              <motion.circle cx="700" cy="150" r="5" fill="var(--accent)" />
              <motion.circle cx="100" cy="250" r="4" fill="var(--primary)" />
              <motion.circle cx="700" cy="200" r="4" fill="var(--accent)" />
           </svg>
         </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border glass mb-8 text-sm font-medium text-muted-foreground">
            <Terminal className="w-4 h-4 text-primary" />
            <span>SDE-III @ Walmart</span>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Dhairya</span>{" "}
            <span className="text-gradient">Sarin</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl font-light">
            Software Engineer specializing in <span className="text-foreground font-medium">Data Systems</span>{" "}
            and <span className="text-foreground font-medium">AI Infrastructure</span>.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center gap-4">
          <button className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2">
            View Projects <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 rounded-full glass border border-border text-foreground font-medium hover:bg-border/50 transition-colors">
            Contact Me
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
