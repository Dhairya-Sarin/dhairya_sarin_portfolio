"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const symbols = ["{ }", "< />", "∑", "∫", "λ", "∞", "[]", "=>", "||", "&&", "Δ", "π", "ƒ", "()"];

export function AnimatedBackground() {
  const [elements, setElements] = useState<Array<{ id: number, symbol: string, left: number, top: number, duration: number, delay: number, scale: number }>>([]);

  useEffect(() => {
    // Generate static random positions on client mount to avoid hydration mismatch
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20, // Negative delay so they are animating immediately
      scale: 0.5 + Math.random() * 1
    }));
    setElements(generated);
  }, []);

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.85]">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute text-primary/40 font-mono text-2xl md:text-4xl select-none"
          style={{ left: `${el.left}%`, top: `${el.top}%`, scale: el.scale }}
          animate={{
            y: [0, -70, 0],
            opacity: [0.1, 0.7, 0.1],
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear"
          }}
        >
          {el.symbol}
        </motion.div>
      ))}
      
      {/* Dynamic flowing data lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

      <motion.div 
        className="absolute top-0 left-1/4 w-[2px] h-40 bg-primary/60 blur-[2px]"
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="absolute top-0 right-1/4 w-[3px] h-48 bg-accent/60 blur-[2px]"
        animate={{ top: ['-20%', '120%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 1 }}
      />
    </div>
  );
}
