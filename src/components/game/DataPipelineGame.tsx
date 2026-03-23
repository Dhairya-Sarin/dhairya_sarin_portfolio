"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "../animations/FadeIn";
import { CheckCircle2, RefreshCw, Zap, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type NodeType = "source" | "output" | "straight" | "corner" | "cross" | "empty";
type Rotation = 0 | 90 | 180 | 270;
type Difficulty = "easy" | "medium" | "hard";

interface NodeData {
  id: string;
  row: number;
  col: number;
  type: NodeType;
  rotation: Rotation;
  fixed: boolean;
}

const DIFF_CONFIG = {
  easy: { size: 3, label: "Easy (3x3)" },
  medium: { size: 4, label: "Medium (4x4)" },
  hard: { size: 5, label: "Hard (5x5)" },
};

// Base connections at 0 degrees: [top, right, bottom, left]
const BASE_CONNECTIONS: Record<NodeType, [boolean, boolean, boolean, boolean]> = {
  source: [false, true, false, false],
  output: [false, false, false, true],
  straight: [true, false, true, false],   // vertical
  corner: [true, true, false, false],     // top-right L
  cross: [true, true, true, true],
  empty: [false, false, false, false],
};

function getConnections(type: NodeType, rotation: Rotation): [boolean, boolean, boolean, boolean] {
  const base = BASE_CONNECTIONS[type];
  const shifts = rotation / 90;
  const result = [...base] as [boolean, boolean, boolean, boolean];
  for (let i = 0; i < shifts; i++) {
    const last = result.pop()!;
    result.unshift(last);
  }
  return result;
}

function generateRandomPath(size: number): { row: number, col: number }[] | null {
  const visited = Array(size).fill(false).map(() => Array(size).fill(false));
  const path: { row: number, col: number }[] = [];
  
  function dfs(row: number, col: number): boolean {
    if (row < 0 || row >= size || col < 0 || col >= size || visited[row][col]) return false;
    
    path.push({ row, col });
    visited[row][col] = true;
    
    if (row === size - 1 && col === size - 1) {
      return true; // Reached end
    }
    
    const dirs = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: -1, dc: 0 }
    ];
    // Fisher-Yates shuffle
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    
    for (const d of dirs) {
      if (dfs(row + d.dr, col + d.dc)) return true;
    }
    
    path.pop();
    visited[row][col] = false;
    return false;
  }
  
  if (dfs(0, 0)) return path;
  return null;
}

function generateLevel(size: number): NodeData[] {
  let path = generateRandomPath(size);
  while (!path) { path = generateRandomPath(size); }
  
  const pathSet = new Set(path.map(p => `${p.row},${p.col}`));
  const nodes: NodeData[] = [];
  const rotations: Rotation[] = [0, 90, 180, 270];
  const distractors: NodeType[] = ["straight", "corner", "cross"];
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
       const isStart = (r === 0 && c === 0);
       const isEnd = (r === size - 1 && c === size - 1);
       const isPath = pathSet.has(`${r},${c}`);
       
       let type: NodeType = "empty";
       let rotation: Rotation = 0;
       let fixed = false;
       
       if (isStart) {
          type = "source";
          const next = path![1];
          if (next.col > c) rotation = 0; // expected from base Right
          else if (next.row > r) rotation = 90; // Down
          fixed = true;
       } else if (isEnd) {
          type = "output";
          const prev = path![path!.length - 2];
          if (prev.col < c) rotation = 0; // expected from base Left
          else if (prev.row < r) rotation = 90; // Top
          fixed = true;
       } else if (isPath) {
          const idx = path!.findIndex(p => p.row === r && p.col === c);
          const prev = path![idx - 1];
          const next = path![idx + 1];
          
          const fromTop = prev.row < r || next.row < r;
          const fromBottom = prev.row > r || next.row > r;
          const fromLeft = prev.col < c || next.col < c;
          const fromRight = prev.col > c || next.col > c;
          
          if ((fromTop && fromBottom) || (fromLeft && fromRight)) {
             type = "straight";
          } else {
             type = "corner";
          }
          rotation = rotations[Math.floor(Math.random() * 4)];
       } else {
          type = distractors[Math.floor(Math.random() * 3)];
          rotation = rotations[Math.floor(Math.random() * 4)];
       }
       
       nodes.push({ id: `${r}-${c}`, row: r, col: c, type, rotation, fixed });
    }
  }
  
  return nodes;
}

function getFlowPaths(nodes: NodeData[], size: number) {
  const grid = Array(size).fill(null).map(() => Array(size).fill(null));
  nodes.forEach(n => grid[n.row][n.col] = n);

  const connected = new Set<string>();
  const queue = [{ row: 0, col: 0 }];
  connected.add("0,0");

  let reachedOutput = false;

  while(queue.length > 0) {
    const { row, col } = queue.shift()!;
    const node = grid[row][col];
    if (!node) continue;
    
    if (node.type === "output") {
      reachedOutput = true;
    }

    const [top, right, bottom, left] = getConnections(node.type, node.rotation);

    if (top && row > 0) {
       const neighbor = grid[row - 1][col];
       const nConn = getConnections(neighbor.type, neighbor.rotation);
       if (nConn[2] && !connected.has(`${row - 1},${col}`)) {
         connected.add(`${row - 1},${col}`);
         queue.push({ row: row - 1, col });
       }
    }
    if (right && col < size - 1) {
       const neighbor = grid[row][col + 1];
       const nConn = getConnections(neighbor.type, neighbor.rotation);
       if (nConn[3] && !connected.has(`${row},${col + 1}`)) {
         connected.add(`${row},${col + 1}`);
         queue.push({ row, col: col + 1 });
       }
    }
    if (bottom && row < size - 1) {
       const neighbor = grid[row + 1][col];
       const nConn = getConnections(neighbor.type, neighbor.rotation);
       if (nConn[0] && !connected.has(`${row + 1},${col}`)) {
         connected.add(`${row + 1},${col}`);
         queue.push({ row: row + 1, col });
       }
    }
    if (left && col > 0) {
       const neighbor = grid[row][col - 1];
       const nConn = getConnections(neighbor.type, neighbor.rotation);
       if (nConn[1] && !connected.has(`${row},${col - 1}`)) {
         connected.add(`${row},${col - 1}`);
         queue.push({ row, col: col - 1 });
       }
    }
  }

  return { connected, reachedOutput };
}

const PipeLayout = ({ type, isFlowing }: { type: NodeType, isFlowing: boolean }) => {
  const color = isFlowing ? "bg-primary shadow-[0_0_12px_rgba(59,130,246,0.8)]" : "bg-border/60";
  
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
       {type === "source" && (
          <>
             <div className={cn("absolute w-4 h-4 rounded-full z-10 transition-colors duration-300", isFlowing ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]" : "bg-muted-foreground")} />
             <div className={cn("absolute h-[6px] right-0 w-1/2 top-1/2 -translate-y-1/2 z-0 rounded-r-full transition-colors duration-300", color)} />
          </>
       )}
       {type === "output" && (
          <>
             <div className={cn("absolute w-6 h-6 border-[3px] rounded-sm z-10 font-mono text-[8px] flex items-center justify-center transition-colors duration-300 bg-background", isFlowing ? "border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" : "border-muted-foreground text-muted-foreground")}>DL</div>
             <div className={cn("absolute h-[6px] left-0 w-1/2 top-1/2 -translate-y-1/2 z-0 rounded-l-full transition-colors duration-300", color)} />
          </>
       )}
       {type === "straight" && (
          <div className={cn("absolute w-[6px] h-full left-1/2 -translate-x-1/2 transition-colors duration-300", color)} />
       )}
       {type === "corner" && (
          <>
             <div className={cn("absolute w-[6px] h-1/2 top-0 left-1/2 -translate-x-1/2 rounded-b-full transition-colors duration-300", color)} />
             <div className={cn("absolute h-[6px] w-1/2 right-0 top-1/2 -translate-y-1/2 rounded-l-full transition-colors duration-300", color)} />
             <div className={cn("absolute w-[6px] h-[6px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300", color)} />
          </>
       )}
       {type === "cross" && (
          <>
             <div className={cn("absolute w-[6px] h-full left-1/2 -translate-x-1/2 transition-colors duration-300", color)} />
             <div className={cn("absolute h-[6px] w-full top-1/2 -translate-y-1/2 transition-colors duration-300", color)} />
          </>
       )}
    </div>
  )
}

export function DataPipelineGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [level, setLevel] = useState(1);
  const currentSize = DIFF_CONFIG[difficulty].size;

  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set(["0,0"]));
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNodes(generateLevel(currentSize));
  }, []);

  useEffect(() => {
    if (nodes.length === 0) return;
    const { connected, reachedOutput } = getFlowPaths(nodes, currentSize);
    setConnectedIds(connected);
    if (reachedOutput && !isSuccess) {
      setIsSuccess(true);
    }
  }, [nodes, isSuccess, currentSize]);

  const handleRotate = (index: number) => {
    if (isSuccess) return;
    const newNodes = [...nodes];
    if (newNodes[index].fixed) return;
    
    const currentRot = newNodes[index].rotation;
    newNodes[index].rotation = ((currentRot + 90) % 360) as Rotation;
    setNodes(newNodes);
  };

  const handleReset = () => {
    setNodes(generateLevel(currentSize));
    setIsSuccess(false);
  };

  const handleNextLevel = () => {
    setLevel(l => l + 1);
    setNodes(generateLevel(currentSize));
    setIsSuccess(false);
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    setLevel(1);
    setNodes(generateLevel(DIFF_CONFIG[diff].size));
    setIsSuccess(false);
  };

  if (!mounted || nodes.length === 0) {
    return (
      <section id="system" className="py-24 relative z-10 w-full flex justify-center bg-card/10 border-t border-border/20 min-h-[800px]">
         <div className="container mx-auto px-6 max-w-4xl flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
         </div>
      </section>
    );
  }

  return (
    <section id="system" className="py-24 relative z-10 w-full flex justify-center bg-card/10 border-t border-border/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
            Interactive System Simulation
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Fix the Data Pipeline</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A high-throughput pipeline configuration is scattered. Route the data flow correctly from the API Source to the Data Lake by rotating the connection nodes.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="flex justify-center">
          <div className="glass p-6 md:p-10 rounded-3xl border border-border/30 relative overflow-hidden shadow-2xl shadow-background/50 w-full max-w-3xl">
             
             {/* Header UI */}
             <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                <div className="flex items-center gap-4 bg-background/50 p-1.5 rounded-full border border-border/30">
                  {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
                    <button 
                      key={d} 
                      onClick={() => handleDifficultyChange(d)}
                      className={cn("px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors", difficulty === d ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-transparent text-muted-foreground hover:text-foreground")}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="text-sm font-medium text-muted-foreground bg-background/50 px-4 py-1.5 rounded-full border border-border/30">
                      Level {level}
                   </div>
                   <button onClick={handleReset} className="p-2 glass rounded-full transition-colors text-muted-foreground hover:text-foreground hover:border-primary/50" title="Reroll Level">
                      <RefreshCw className="w-4 h-4" />
                   </button>
                </div>
             </div>

             {/* Legend */}
             <div className="flex justify-center gap-8 mb-8 pb-8 border-b border-border/20">
                 <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
                    <span>Source (API)</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <div className="w-6 h-6 border-2 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)] rounded-sm font-mono text-[8px] flex items-center justify-center bg-background">DL</div>
                    <span>Output (Data Lake)</span>
                 </div>
             </div>

             {/* Game Grid */}
             <div className="flex justify-center w-full">
               <div 
                 className="grid relative z-10 bg-background/50 p-3 rounded-2xl border border-border/20 backdrop-blur-sm transition-all duration-500"
                 style={{ 
                    gridTemplateColumns: `repeat(${currentSize}, minmax(0, 1fr))`, 
                    gap: currentSize === 5 ? '4px' : '8px' 
                 }}
               >
                  {nodes.map((node, index) => {
                    const isConnected = connectedIds.has(`${node.row},${node.col}`);
                    return (
                      <motion.button
                         key={node.id}
                         className={cn(
                            "relative flex items-center justify-center rounded-xl transition-colors duration-300",
                            currentSize === 3 ? "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" : 
                            currentSize === 4 ? "w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20" :
                            "w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16",
                            node.fixed ? "bg-background/20 cursor-default" : "bg-card/40 hover:bg-card hover:border-primary/30 cursor-pointer active:scale-95 border border-border/50 hover:shadow-lg hover:z-20"
                         )}
                         onClick={() => handleRotate(index)}
                      >
                         <motion.div
                            animate={{ rotate: node.rotation }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-full h-full absolute inset-0 content-center"
                         >
                           <PipeLayout type={node.type} isFlowing={isConnected || isSuccess} />
                         </motion.div>
                      </motion.button>
                    );
                  })}
               </div>
             </div>

             {/* Success Overlay */}
             <AnimatePresence>
               {isSuccess && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md rounded-3xl m-1"
                 >
                   <motion.div 
                     initial={{ scale: 0 }} 
                     animate={{ scale: 1 }} 
                     transition={{ type: "spring", delay: 0.2 }}
                     className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                   >
                     <CheckCircle2 className="w-10 h-10" />
                   </motion.div>
                   <h3 className="text-3xl font-bold mb-2 text-foreground">Pipeline Optimally Routed</h3>
                   <div className="text-green-400 font-medium flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-4 py-1.5 rounded-full mb-8">
                     <Zap className="w-4 h-4"/> Efficiency: 100%
                   </div>
                   
                   <div className="flex gap-4">
                     <button 
                       onClick={handleReset}
                       className="px-6 py-3 glass border-border text-foreground font-medium rounded-full hover:bg-border/50 transition-colors"
                     >
                       Replay Level
                     </button>
                     <button 
                       onClick={handleNextLevel}
                       className="px-6 py-3 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-colors shadow-lg shadow-foreground/20 active:scale-95"
                     >
                       Next Level
                     </button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
             
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
