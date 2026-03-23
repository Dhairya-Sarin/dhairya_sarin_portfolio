"use client";

import { useEffect, useState, useCallback } from "react";

const ROWS = 7;
const COLS = 7;

type CellState = "empty" | "wall" | "start" | "end" | "visited" | "path";

// Run a BFS on a grid and return the visited order + shortest path
function runBFS(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
): { visited: [number, number][]; path: [number, number][] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: [number, number][] = [];
  const prev = new Map<string, [number, number] | null>();
  const queue: [number, number][] = [start];
  const key = (r: number, c: number) => `${r},${c}`;
  prev.set(key(start[0], start[1]), null);

  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === end[0] && c === end[1]) break;
    visited.push([r, c]);

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !prev.has(key(nr, nc)) && grid[nr][nc] !== "wall") {
        prev.set(key(nr, nc), [r, c]);
        queue.push([nr, nc]);
      }
    }
  }

  // Reconstruct path
  const path: [number, number][] = [];
  let curr: [number, number] | null | undefined = end;
  if (prev.has(key(end[0], end[1]))) {
    while (curr != null) {
      path.unshift(curr);
      curr = prev.get(key(curr[0], curr[1])) ?? null;
    }
  }

  return { visited, path };
}

function generateScenario(): {
  grid: CellState[][];
  start: [number, number];
  end: [number, number];
  visited: [number, number][];
  path: [number, number][];
} {
  const grid: CellState[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => "empty")
  );
  
  // Random start (top-left area) and end (bottom-right area)
  const start: [number, number] = [
    Math.floor(Math.random() * 2),
    Math.floor(Math.random() * 2),
  ];
  const end: [number, number] = [
    ROWS - 1 - Math.floor(Math.random() * 2),
    COLS - 1 - Math.floor(Math.random() * 2),
  ];
  
  grid[start[0]][start[1]] = "start";
  grid[end[0]][end[1]] = "end";
  
  // Place random walls (~20%)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== "empty") continue;
      if (Math.random() < 0.22) {
        grid[r][c] = "wall";
      }
    }
  }

  const { visited, path } = runBFS(grid, start, end);

  // If no path found, clear walls and retry
  if (path.length === 0) {
    return generateScenario();
  }

  return { grid, start, end, visited, path };
}

export function GraphPathAnimation() {
  const [cells, setCells] = useState<CellState[][]>(() =>
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "empty"))
  );
  const [isClient, setIsClient] = useState(false);

  const animate = useCallback(() => {
    const scenario = generateScenario();
    const baseGrid = scenario.grid;
    const { visited, path } = scenario;

    // Reset to initial grid with walls, start, end
    setCells(baseGrid.map(r => [...r]));

    let step = 0;
    const totalVisited = visited.length;
    const totalPath = path.length;

    const interval = setInterval(() => {
      step++;

      if (step <= totalVisited) {
        const [vr, vc] = visited[step - 1];
        setCells(prev => {
          const next = prev.map(r => [...r]);
          if (next[vr][vc] === "empty") next[vr][vc] = "visited";
          return next;
        });
      } else if (step <= totalVisited + totalPath) {
        const pathIdx = step - totalVisited - 1;
        const [pr, pc] = path[pathIdx];
        setCells(prev => {
          const next = prev.map(r => [...r]);
          if (next[pr][pc] !== "start" && next[pr][pc] !== "end") next[pr][pc] = "path";
          return next;
        });
      } else if (step > totalVisited + totalPath + 8) {
        // Hold the final result for 8 ticks then restart
        clearInterval(interval);
        animate(); // Start a new random scenario
      }
    }, 120);

    return interval;
  }, []);

  useEffect(() => {
    setIsClient(true);
    const interval = animate();
    return () => clearInterval(interval);
  }, [animate]);

  if (!isClient) {
    return <div className="w-full h-32 rounded-xl bg-foreground/5 border border-border/30" />;
  }

  return (
    <div className="w-full h-36 flex flex-col items-center justify-center gap-[3px] p-4 rounded-xl bg-foreground/[0.03] border border-border/30 overflow-hidden relative group-hover:bg-foreground/[0.06] transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      {cells.map((row, r) => (
        <div key={r} className="flex gap-[3px] z-10">
          {row.map((cell, c) => {
            let bg = "bg-foreground/[0.06]";
            let extra = "";
            if (cell === "start") { bg = "bg-emerald-400"; extra = "shadow-[0_0_8px_rgba(52,211,153,0.7)] scale-110"; }
            else if (cell === "end") { bg = "bg-rose-400"; extra = "shadow-[0_0_8px_rgba(251,113,133,0.7)] scale-110"; }
            else if (cell === "wall") { bg = "bg-muted-foreground/40"; extra = "rounded-sm"; }
            else if (cell === "path") { bg = "bg-amber-300"; extra = "shadow-[0_0_6px_rgba(252,211,77,0.6)] scale-105"; }
            else if (cell === "visited") { bg = "bg-primary/30"; extra = ""; }
            
            return (
              <div
                key={`${r}-${c}`}
                className={`w-3 h-3 rounded-[2px] transition-all duration-300 ${bg} ${extra}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
