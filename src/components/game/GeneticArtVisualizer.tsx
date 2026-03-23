"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Square, Upload, RotateCcw, Dna, Info, ChevronDown } from "lucide-react";

const CANVAS_W = 200;
const CANVAS_H = 200;
const INITIAL_POLYGONS = 50;

interface Polygon {
  vertices: { x: number; y: number }[];
  r: number; g: number; b: number; a: number;
}

interface LogEntry {
  generation: number;
  fitness: number;
  improvement: boolean;
  mutation: string;
}

function randomPoly(w: number, h: number): Polygon {
  const cx = Math.random() * w;
  const cy = Math.random() * h;
  return {
    vertices: Array.from({ length: 3 }, () => ({
      x: cx + (Math.random() - 0.5) * (w * 0.5),
      y: cy + (Math.random() - 0.5) * (h * 0.5),
    })),
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    a: Math.random() * 0.4 + 0.05,
  };
}

function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

function mutatePoly(p: Polygon, w: number, h: number): { poly: Polygon; desc: string } {
  const np: Polygon = JSON.parse(JSON.stringify(p));
  const r = Math.random();
  let desc = "";
  if (r < 0.4) {
    const vi = Math.floor(Math.random() * np.vertices.length);
    np.vertices[vi].x = clamp(np.vertices[vi].x + (Math.random() - 0.5) * 30, 0, w);
    np.vertices[vi].y = clamp(np.vertices[vi].y + (Math.random() - 0.5) * 30, 0, h);
    desc = `Moved vertex ${vi}`;
  } else if (r < 0.7) {
    np.r = clamp(np.r + Math.floor((Math.random() - 0.5) * 60), 0, 255);
    np.g = clamp(np.g + Math.floor((Math.random() - 0.5) * 60), 0, 255);
    np.b = clamp(np.b + Math.floor((Math.random() - 0.5) * 60), 0, 255);
    desc = `Shifted color → rgb(${np.r},${np.g},${np.b})`;
  } else if (r < 0.9) {
    np.a = clamp(np.a + (Math.random() - 0.5) * 0.15, 0.02, 0.8);
    desc = `Alpha → ${np.a.toFixed(2)}`;
  } else {
    const fresh = randomPoly(w, h);
    desc = "Replaced polygon entirely";
    return { poly: fresh, desc };
  }
  return { poly: np, desc };
}

function drawGenome(ctx: CanvasRenderingContext2D, genome: Polygon[], w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  for (const p of genome) {
    ctx.beginPath();
    ctx.moveTo(p.vertices[0].x, p.vertices[0].y);
    for (let i = 1; i < p.vertices.length; i++) ctx.lineTo(p.vertices[i].x, p.vertices[i].y);
    ctx.closePath();
    ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
    ctx.fill();
  }
}

function computeFitness(ctx: CanvasRenderingContext2D, targetData: Uint8ClampedArray, w: number, h: number): number {
  const current = ctx.getImageData(0, 0, w, h).data;
  let diff = 0;
  const len = current.length;
  for (let i = 0; i < len; i += 4) {
    const dr = current[i] - targetData[i];
    const dg = current[i + 1] - targetData[i + 1];
    const db = current[i + 2] - targetData[i + 2];
    diff += dr * dr + dg * dg + db * db;
  }
  return Math.sqrt(diff / (w * h * 3));
}

export function GeneticArtVisualizer() {
  const evolveCanvasRef = useRef<HTMLCanvasElement>(null);
  const targetCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [currentFitness, setCurrentFitness] = useState(0);
  const [bestFitness, setBestFitness] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
  const [showWriteup, setShowWriteup] = useState(false);
  const [imageName, setImageName] = useState("Girl with a Pearl Earring");

  const stateRef = useRef<{
    genome: Polygon[];
    targetData: Uint8ClampedArray | null;
    bestFitness: number;
    generation: number;
    running: boolean;
    animFrame: number | null;
  }>({
    genome: [],
    targetData: null,
    bestFitness: Infinity,
    generation: 0,
    running: false,
    animFrame: null,
  });

  const loadTargetImage = useCallback((src: string) => {
    const canvas = targetCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
      stateRef.current.targetData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H).data;
    };
  }, []);

  useEffect(() => {
    loadTargetImage("/images/girl-pearl-earring.png");
    // Initialize genome
    stateRef.current.genome = Array.from({ length: INITIAL_POLYGONS }, () => randomPoly(CANVAS_W, CANVAS_H));
    // Initial render
    const canvas = evolveCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      drawGenome(ctx, stateRef.current.genome, CANVAS_W, CANVAS_H);
    }
  }, [loadTargetImage]);

  const startEvolution = useCallback(() => {
    if (stateRef.current.running) return;
    stateRef.current.running = true;
    setIsRunning(true);

    const canvas = evolveCanvasRef.current;
    if (!canvas || !stateRef.current.targetData) return;
    const ctx = canvas.getContext("2d")!;

    // Compute initial fitness if first run
    if (stateRef.current.bestFitness === Infinity) {
      drawGenome(ctx, stateRef.current.genome, CANVAS_W, CANVAS_H);
      stateRef.current.bestFitness = computeFitness(ctx, stateRef.current.targetData, CANVAS_W, CANVAS_H);
      setBestFitness(stateRef.current.bestFitness);
      setCurrentFitness(stateRef.current.bestFitness);
    }

    const loop = () => {
      if (!stateRef.current.running) return;

      const s = stateRef.current;
      // Run multiple mutations per frame for speed
      for (let m = 0; m < 20; m++) {
        const idx = Math.floor(Math.random() * s.genome.length);
        const { poly: mutatedPoly, desc } = mutatePoly(s.genome[idx], CANVAS_W, CANVAS_H);
        const newGenome = [...s.genome];
        newGenome[idx] = mutatedPoly;

        drawGenome(ctx, newGenome, CANVAS_W, CANVAS_H);
        const newFit = computeFitness(ctx, s.targetData!, CANVAS_W, CANVAS_H);

        const improved = newFit < s.bestFitness;
        if (improved) {
          s.genome = newGenome;
          s.bestFitness = newFit;
        }

        s.generation++;

        // Log every 50th generation or on improvements
        if (s.generation % 50 === 0 || improved) {
          const entry: LogEntry = {
            generation: s.generation,
            fitness: improved ? newFit : s.bestFitness,
            improvement: improved,
            mutation: `Polygon #${idx}: ${desc}`,
          };
          setLogs(prev => [entry, ...prev].slice(0, 200));
        }

        if (s.generation % 10 === 0) {
          setFitnessHistory(prev => [...prev, s.bestFitness].slice(-300));
        }
      }

      // Render best genome
      drawGenome(ctx, s.genome, CANVAS_W, CANVAS_H);
      setGeneration(s.generation);
      setCurrentFitness(s.bestFitness);
      setBestFitness(s.bestFitness);

      s.animFrame = requestAnimationFrame(loop);
    };

    stateRef.current.animFrame = requestAnimationFrame(loop);
  }, []);

  const stopEvolution = useCallback(() => {
    stateRef.current.running = false;
    setIsRunning(false);
    if (stateRef.current.animFrame) cancelAnimationFrame(stateRef.current.animFrame);
  }, []);

  const handleReset = useCallback(() => {
    stopEvolution();
    stateRef.current.genome = Array.from({ length: INITIAL_POLYGONS }, () => randomPoly(CANVAS_W, CANVAS_H));
    stateRef.current.bestFitness = Infinity;
    stateRef.current.generation = 0;
    setGeneration(0);
    setCurrentFitness(0);
    setBestFitness(0);
    setLogs([]);
    setFitnessHistory([]);
    const canvas = evolveCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      drawGenome(ctx, stateRef.current.genome, CANVAS_W, CANVAS_H);
    }
  }, [stopEvolution]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopEvolution();
    setImageName(file.name);
    const url = URL.createObjectURL(file);
    loadTargetImage(url);
    handleReset();
  }, [stopEvolution, loadTargetImage, handleReset]);

  // Sparkline SVG
  const sparkline = fitnessHistory.length > 1 ? (() => {
    const max = Math.max(...fitnessHistory);
    const min = Math.min(...fitnessHistory);
    const range = max - min || 1;
    const w = 300;
    const h = 60;
    const points = fitnessHistory.map((v, i) => {
      const x = (i / (fitnessHistory.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#sparkGrad)" />
        <polyline points={points} fill="none" stroke="rgb(59,130,246)" strokeWidth="2" />
      </svg>
    );
  })() : null;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Canvas Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target */}
        <div className="flex flex-col gap-3 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target — {imageName}</span>
          <div className="glass p-3 rounded-2xl border border-border/30 shadow-xl">
            <canvas ref={targetCanvasRef} width={CANVAS_W} height={CANVAS_H} className="rounded-xl w-full max-w-[280px] aspect-square" />
          </div>
        </div>
        {/* Evolving */}
        <div className="flex flex-col gap-3 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Evolved — Gen {generation.toLocaleString()}
          </span>
          <div className="glass p-3 rounded-2xl border border-border/30 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
            <canvas ref={evolveCanvasRef} width={CANVAS_W} height={CANVAS_H} className="rounded-xl w-full max-w-[280px] aspect-square relative z-10" />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-4 rounded-2xl border border-border/30 flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Generation</span>
          <span className="text-2xl font-bold font-mono text-foreground">{generation.toLocaleString()}</span>
        </div>
        <div className="glass p-4 rounded-2xl border border-border/30 flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Fitness (RMSE)</span>
          <span className="text-2xl font-bold font-mono text-primary">{bestFitness.toFixed(2)}</span>
        </div>
        <div className="glass p-4 rounded-2xl border border-border/30 flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Polygons</span>
          <span className="text-2xl font-bold font-mono text-foreground">{INITIAL_POLYGONS}</span>
        </div>
      </div>

      {/* Fitness Chart */}
      {fitnessHistory.length > 1 && (
        <div className="glass p-4 rounded-2xl border border-border/30">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Fitness Over Time (lower is better)</span>
          {sparkline}
        </div>
      )}

      {/* Controls */}
      <div className="glass p-6 rounded-3xl border border-border/30 flex flex-wrap items-center gap-4">
        <button
          onClick={isRunning ? stopEvolution : startEvolution}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          {isRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          {isRunning ? "Pause Evolution" : "Start Evolution"}
        </button>
        <button
          onClick={handleReset}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-foreground/10 border border-border/30 hover:border-border/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <label className="flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-foreground/10 border border-border/30 hover:border-border/50 transition-all font-medium cursor-pointer">
          <Upload className="w-4 h-4" />
          Upload Image
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {/* Generation Log */}
      <div className="glass p-6 rounded-3xl border border-border/30">
        <div className="flex items-center gap-2 mb-4">
          <Dna className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Lineage Log</h3>
          <span className="text-xs text-muted-foreground ml-auto">{logs.length} entries</span>
        </div>
        <div className="max-h-[200px] overflow-y-auto space-y-1 font-mono text-xs scrollbar-thin">
          {logs.length === 0 && <p className="text-muted-foreground text-sm">Start the evolution to see the lineage log.</p>}
          {logs.map((entry, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg ${entry.improvement ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground/60"}`}
            >
              <span className="w-20 shrink-0">Gen {entry.generation}</span>
              <span className="w-20 shrink-0">{entry.fitness.toFixed(2)}</span>
              {entry.improvement && <span className="text-emerald-400 text-[10px] font-bold">▲ IMPROVED</span>}
              <span className="truncate opacity-60">{entry.mutation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Write-up */}
      <div className="glass rounded-3xl border border-border/30 overflow-hidden">
        <button
          onClick={() => setShowWriteup(!showWriteup)}
          className="w-full flex items-center justify-between p-6 hover:bg-foreground/5 transition-colors"
        >
          <div className="flex items-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            <h3 className="font-bold text-lg">How It Works — The Algorithm</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${showWriteup ? "rotate-180" : ""}`} />
        </button>
        {showWriteup && (
          <div className="px-6 pb-6 space-y-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-5">
            <div>
              <h4 className="font-bold text-foreground mb-2 text-base">🧬 Evolutionary Strategy (1+1 ES)</h4>
              <p>
                This implementation uses a <strong className="text-foreground">(1+1) evolutionary strategy</strong>, one of the simplest forms of evolutionary computation. There is a single parent organism (the current best genome of polygons). Each generation, we create one mutant child by randomly modifying one polygon. If the child is fitter than the parent, it replaces it — otherwise it is discarded. This is &quot;survival of the fittest&quot; in its purest form.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-2 text-base">🎯 The Fitness Function</h4>
              <p>
                Fitness is computed as the <strong className="text-foreground">Root Mean Square Error (RMSE)</strong> between the pixel values of the evolving canvas and the target image. For every pixel, we calculate the squared difference for each RGB channel, sum them all, divide by the total number of pixel-channel pairs, and take the square root. A <em>lower</em> RMSE means the polygon canvas more closely resembles the target.
              </p>
              <div className="mt-3 p-3 rounded-xl bg-foreground/5 border border-border/20 font-mono text-xs">
                RMSE = √( Σ (R_target - R_evolved)² + (G_target - G_evolved)² + (B_target - B_evolved)² ) / (W × H × 3) )
              </div>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-2 text-base">🔀 Mutation Operators</h4>
              <p>Each mutation randomly selects one polygon and applies one of these operations:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li><strong className="text-foreground">Vertex Shift (40%)</strong> — Move a random vertex by a small random offset.</li>
                <li><strong className="text-foreground">Color Shift (30%)</strong> — Nudge the RGB values by ±30 per channel.</li>
                <li><strong className="text-foreground">Alpha Shift (20%)</strong> — Adjust the opacity slightly.</li>
                <li><strong className="text-foreground">Full Replacement (10%)</strong> — Replace the polygon entirely with a new random one. This adds &quot;genetic diversity&quot; and prevents stagnation.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-2 text-base">🎨 The Genome</h4>
              <p>
                The genome consists of <strong className="text-foreground">{INITIAL_POLYGONS} semi-transparent triangles</strong>. Each triangle is defined by 3 vertices (x, y), an RGB color, and an alpha (opacity) value. The triangles are rendered in order on a black canvas — later triangles partially occlude earlier ones, which is how the algorithm builds up complex color blends.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-2 text-base">⚡ Why It Works</h4>
              <p>
                Even with such a simple strategy, the algorithm converges because the search space, while vast, is <em>smooth</em> — small mutations to a &quot;good&quot; genome usually produce a genome that is also &quot;pretty good&quot;. Over thousands of generations, this hill-climbing approach steadily reduces the fitness score. Given enough time, remarkably faithful reproductions emerge from pure randomness — a beautiful demonstration of how evolution can create complexity from simplicity.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
