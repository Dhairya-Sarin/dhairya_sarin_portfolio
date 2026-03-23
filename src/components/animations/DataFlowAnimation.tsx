"use client";

import { motion } from "framer-motion";

// Official Snowflake logo SVG path
const SnowflakeLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* 6 arms radiating from center */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          {/* Main arm */}
          <line x1="50" y1="50" x2="50" y2="10" />
          {/* Branch left */}
          <line x1="50" y1="22" x2="38" y2="14" />
          {/* Branch right */}
          <line x1="50" y1="22" x2="62" y2="14" />
          {/* Small branch left */}
          <line x1="50" y1="34" x2="42" y2="28" />
          {/* Small branch right */}
          <line x1="50" y1="34" x2="58" y2="28" />
          {/* Tip dot */}
          <circle cx="50" cy="10" r="2.5" fill="currentColor" />
        </g>
      ))}
      {/* Center dot */}
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </g>
  </svg>
);

export function DataFlowAnimation() {
  return (
    <div className="w-full h-36 flex items-center justify-center rounded-xl bg-foreground/[0.03] border border-border/30 overflow-hidden relative group-hover:bg-foreground/[0.06] transition-colors duration-500">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-500/5 pointer-events-none" />


      {/* 3D rotating Snowflake logo */}
      <div className="relative z-10" style={{ perspective: "400px" }}>
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <SnowflakeLogo className="w-24 h-24 text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]" />
        </motion.div>
      </div>

      {/* Subtle ring pulse */}
      <motion.div
        className="absolute rounded-full border border-sky-400/20"
        animate={{
          width: [60, 90, 60],
          height: [60, 90, 60],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
