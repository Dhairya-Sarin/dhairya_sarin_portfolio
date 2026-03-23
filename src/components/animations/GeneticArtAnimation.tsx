"use client";

import { useEffect, useRef, useState } from "react";

const W = 120;
const H = 120;
const NUM_POLYGONS = 30;

interface Polygon {
  vertices: { x: number; y: number }[];
  r: number; g: number; b: number; a: number;
}

function randomPoly(): Polygon {
  const cx = Math.random() * W;
  const cy = Math.random() * H;
  return {
    vertices: Array.from({ length: 3 }, () => ({
      x: cx + (Math.random() - 0.5) * 60,
      y: cy + (Math.random() - 0.5) * 60,
    })),
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    a: Math.random() * 0.5 + 0.1,
  };
}

function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

function mutatePoly(p: Polygon): Polygon {
  const np: Polygon = JSON.parse(JSON.stringify(p));
  const r = Math.random();
  if (r < 0.4) {
    const vi = Math.floor(Math.random() * np.vertices.length);
    np.vertices[vi].x = clamp(np.vertices[vi].x + (Math.random() - 0.5) * 20, 0, W);
    np.vertices[vi].y = clamp(np.vertices[vi].y + (Math.random() - 0.5) * 20, 0, H);
  } else if (r < 0.7) {
    np.r = clamp(np.r + Math.floor((Math.random() - 0.5) * 50), 0, 255);
    np.g = clamp(np.g + Math.floor((Math.random() - 0.5) * 50), 0, 255);
    np.b = clamp(np.b + Math.floor((Math.random() - 0.5) * 50), 0, 255);
  } else if (r < 0.9) {
    np.a = clamp(np.a + (Math.random() - 0.5) * 0.2, 0.05, 0.8);
  } else {
    return randomPoly();
  }
  return np;
}

function drawGenome(ctx: CanvasRenderingContext2D, genome: Polygon[]) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  for (const p of genome) {
    ctx.beginPath();
    ctx.moveTo(p.vertices[0].x, p.vertices[0].y);
    for (let i = 1; i < p.vertices.length; i++) {
      ctx.lineTo(p.vertices[i].x, p.vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
    ctx.fill();
  }
}

function computeFitness(ctx: CanvasRenderingContext2D, targetData: Uint8ClampedArray): number {
  const current = ctx.getImageData(0, 0, W, H).data;
  let diff = 0;
  for (let i = 0; i < current.length; i += 4) {
    const dr = current[i] - targetData[i];
    const dg = current[i + 1] - targetData[i + 1];
    const db = current[i + 2] - targetData[i + 2];
    diff += dr * dr + dg * dg + db * db;
  }
  return diff;
}

export function GeneticArtAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gen, setGen] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let animFrame: number | null = null;

    const img = new Image();
    img.src = "/images/girl-pearl-earring.png";

    img.onload = () => {
      if (!running) return;
      
      // Get target pixel data
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = W;
      tmpCanvas.height = H;
      const tmpCtx = tmpCanvas.getContext("2d")!;
      tmpCtx.drawImage(img, 0, 0, W, H);
      const targetData = tmpCtx.getImageData(0, 0, W, H).data;

      // Initialize genome
      let genome = Array.from({ length: NUM_POLYGONS }, randomPoly);
      drawGenome(ctx, genome);
      let bestFit = computeFitness(ctx, targetData);
      let generation = 0;

      const loop = () => {
        if (!running) return;

        // Run 10 mutations per frame
        for (let m = 0; m < 10; m++) {
          const idx = Math.floor(Math.random() * genome.length);
          const newGenome = [...genome];
          newGenome[idx] = mutatePoly(genome[idx]);
          drawGenome(ctx, newGenome);
          const newFit = computeFitness(ctx, targetData);
          if (newFit < bestFit) {
            genome = newGenome;
            bestFit = newFit;
          }
        }

        generation++;
        drawGenome(ctx, genome);
        setGen(generation);
        if (generation < 10000) {
          animFrame = requestAnimationFrame(loop);
        }
      };

      animFrame = requestAnimationFrame(loop);
    };

    // Also handle case where image fails to load
    img.onerror = () => {
      // Draw a placeholder gradient
      if (ctx) {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#888";
        ctx.font = "10px monospace";
        ctx.fillText("Loading...", 30, 60);
      }
    };

    return () => {
      running = false;
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div className="w-full h-36 flex items-center justify-center gap-3 p-3 rounded-xl bg-foreground/[0.03] border border-border/30 overflow-hidden relative group-hover:bg-foreground/[0.06] transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-rose-500/5 pointer-events-none" />
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-lg border border-border/20 z-10"
        style={{ width: 110, height: 110 }}
      />
      <div className="flex flex-col gap-1 z-10">
        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Generation</span>
        <span className="text-lg font-bold font-mono text-primary">{gen}</span>
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
