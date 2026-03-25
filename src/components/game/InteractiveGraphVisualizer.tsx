"use client";

import { useEffect, useState, useRef, useCallback, memo } from "react";
import { Play, Trash2, MousePointer2, Navigation2, Sparkles, LayoutGrid, Square } from "lucide-react";

// --- Config ---
const ROWS = 15;
const COLS = 35;
const START_INITIAL = { row: 7, col: 3 };
const END_INITIAL = { row: 7, col: 31 };

interface NodeData {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  fScore: number;
  previousNode: NodeData | null;
}

const algorithmsInfo = {
  dijkstra: { name: "Dijkstra's", time: "O(V + E log V)", space: "O(V)", desc: "The father of pathfinding algorithms. Guarantees the shortest path using a weighted graph (unweighted here)." },
  astar: { name: "A* Search", time: "O(E)", space: "O(V)", desc: "Arguably the best pathfinding algorithm. Uses heuristics (Manhattan distance) to guarantee the shortest path much faster." },
  bfs: { name: "BFS", time: "O(V + E)", space: "O(V)", desc: "Explores equally in all directions. Unweighted, but guarantees the shortest path." },
  dfs: { name: "DFS", time: "O(V + E)", space: "O(V)", desc: "Explores as far as possible along each branch before backtracking. Does not guarantee shortest path." },
};

type AlgoType = keyof typeof algorithmsInfo;

// --- Helpers ---
const createNode = (row: number, col: number): NodeData => ({
  row, col,
  isStart: row === START_INITIAL.row && col === START_INITIAL.col,
  isEnd: row === END_INITIAL.row && col === END_INITIAL.col,
  distance: Infinity, fScore: Infinity,
  isVisited: false, isWall: false, isPath: false, previousNode: null,
});

const getNeighbors = (node: NodeData, g: NodeData[][]) => {
  const n = [];
  const { col, row } = node;
  if (row > 0) n.push(g[row - 1][col]);
  if (row < ROWS - 1) n.push(g[row + 1][col]);
  if (col > 0) n.push(g[row][col - 1]);
  if (col < COLS - 1) n.push(g[row][col + 1]);
  return n.filter(nb => !nb.isVisited && !nb.isWall);
};

const manhattan = (a: NodeData, b: NodeData) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
const getAllNodes = (g: NodeData[][]) => g.flatMap(r => r);

const calculateAlgorithm = (algo: AlgoType, baseGrid: NodeData[][]) => {
  const gc: NodeData[][] = baseGrid.map(r => r.map(c => ({ ...c, isVisited: false, isPath: false, distance: Infinity, fScore: Infinity, previousNode: null } as NodeData)));
  const startNode = gc[START_INITIAL.row][START_INITIAL.col];
  const endNode = gc[END_INITIAL.row][END_INITIAL.col];
  startNode.distance = 0;
  startNode.fScore = manhattan(startNode, endNode);
  const visited: NodeData[] = [];

  if (algo === "dijkstra" || algo === "astar") {
    const unvisited = getAllNodes(gc);
    while (unvisited.length) {
      unvisited.sort((a, b) => algo === "astar" ? a.fScore - b.fScore : a.distance - b.distance);
      const closest = unvisited.shift()!;
      if (closest.isWall) continue;
      if (closest.distance === Infinity) break;
      closest.isVisited = true;
      visited.push({ ...closest });
      if (closest === endNode) break;
      for (const nb of getNeighbors(closest, gc)) {
        nb.distance = closest.distance + 1;
        nb.previousNode = closest;
        if (algo === "astar") nb.fScore = nb.distance + manhattan(nb, endNode);
      }
    }
  } else if (algo === "bfs") {
    const queue = [startNode]; startNode.isVisited = true;
    while (queue.length) {
      const curr = queue.shift()!;
      visited.push({ ...curr });
      if (curr === endNode) break;
      for (const nb of getNeighbors(curr, gc)) { nb.isVisited = true; nb.previousNode = curr; queue.push(nb); }
    }
  } else if (algo === "dfs") {
    const stack = [startNode];
    while (stack.length) {
      const curr = stack.pop()!;
      if (curr.isVisited) continue;
      curr.isVisited = true;
      visited.push({ ...curr });
      if (curr === endNode) break;
      for (const nb of getNeighbors(curr, gc).reverse()) { nb.previousNode = curr; stack.push(nb); }
    }
  }

  const path: NodeData[] = [];
  let cn: NodeData | null = endNode.isVisited ? endNode : null;
  while (cn !== null) { path.unshift({ ...cn }); cn = cn.previousNode; }
  return { visitedNodesInOrder: visited, nodesInShortestPathOrder: path, endFound: endNode.isVisited };
};

// --- Subcomponent: GraphBoard ---
interface GraphBoardProps {
  baseGrid: NodeData[][];
  algorithm: AlgoType;
  runTrigger: number;
  compact?: boolean;
  onWallToggle?: (row: number, col: number) => void;
  onMouseEnterCell?: (row: number, col: number) => void;
  onMouseUpCell?: () => void;
  onRunningChange?: (isRunning: boolean) => void;
  showTitle?: boolean;
}

const GraphBoard = memo(({
  baseGrid, algorithm, runTrigger, compact = false,
  onWallToggle, onMouseEnterCell, onMouseUpCell, onRunningChange, showTitle = false
}: GraphBoardProps) => {
  const [visualGrid, setVisualGrid] = useState<NodeData[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Sync with base grid when baseGrid changes (user draws walls, etc.)
  useEffect(() => {
    setVisualGrid(baseGrid.map(r => r.map(c => ({ ...c, isPath: false, isVisited: false }))));
  }, [baseGrid]);

  useEffect(() => {
    if (runTrigger > 0) {
      runAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTrigger]);

  const setRunning = (val: boolean) => {
    setIsRunning(val);
    onRunningChange?.(val);
  };

  const clearTimeouts = () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };

  const runAnimation = () => {
    clearTimeouts();
    setVisualGrid(baseGrid.map(r => r.map(c => ({ ...c, isPath: false, isVisited: false })))); // reset paths
    setRunning(true);

    // Slight delay to allow UI to breathe
    setTimeout(() => {
      const { visitedNodesInOrder, nodesInShortestPathOrder } = calculateAlgorithm(algorithm, baseGrid);
      animateSearch(visitedNodesInOrder, nodesInShortestPathOrder);
    }, 100);
  };

  const animateSearch = (visited: NodeData[], path: NodeData[]) => {
    for (let i = 0; i < visited.length; i++) {
      if (i === visited.length - 1) {
        timeoutsRef.current.push(setTimeout(() => animatePath(path), 12 * i));
        return;
      }
      timeoutsRef.current.push(setTimeout(() => {
        const n = visited[i];
        if (!n.isStart && !n.isEnd) {
          setVisualGrid(prev => {
            const ng = prev.map(r => [...r]);
            ng[n.row] = [...ng[n.row]];
            ng[n.row][n.col] = { ...ng[n.row][n.col], isVisited: true };
            return ng;
          });
        }
      }, 12 * i));
    }
    if (visited.length === 0) setRunning(false);
  };

  const animatePath = (path: NodeData[]) => {
    for (let i = 0; i < path.length; i++) {
      timeoutsRef.current.push(setTimeout(() => {
        const n = path[i];
        if (!n.isStart && !n.isEnd) {
          setVisualGrid(prev => {
            const ng = prev.map(r => [...r]);
            ng[n.row] = [...ng[n.row]];
            ng[n.row][n.col] = { ...ng[n.row][n.col], isPath: true };
            return ng;
          });
        }
        if (i === path.length - 1) setRunning(false);
      }, 35 * i));
    }
    if (path.length === 0) setRunning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  if (visualGrid.length === 0) return null;

  return (
    <div className={`flex flex-col items-center justify-center ${compact ? 'p-3' : 'p-4 md:p-6'} rounded-3xl glass border border-border/30 relative shadow-2xl overflow-hidden w-full h-full`} onMouseLeave={onMouseUpCell}>
      {/* Ambient glow */}
      {!compact && (
        <>
          <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-1/3 h-1/4 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
        </>
      )}

      {showTitle && (
        <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-full border border-border/50 shadow-sm backdrop-blur-md">
          <Navigation2 className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold">{algorithmsInfo[algorithm].name}</span>
        </div>
      )}

      <div className="flex flex-col z-10 select-none touch-none scale-100 origin-center transition-transform w-full items-center">
        {visualGrid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((node) => {
              const { row: r, col: c, isStart, isEnd, isWall, isVisited, isPath } = node;

              // Sizing
              let cellClasses = compact
                ? "w-[8px] h-[8px] sm:w-[9px] sm:h-[9px] md:w-[13px] md:h-[13px] xl:w-[14px] xl:h-[14px] "
                : "w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] ";

              cellClasses += "border-[0.5px] border-white/[0.04] transition-all duration-200 cursor-pointer ";

              if (isStart) cellClasses += "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)] rounded-sm scale-110 z-20 border-emerald-300/50";
              else if (isEnd) cellClasses += "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.7)] rounded-sm scale-110 z-20 border-rose-300/50";
              else if (isPath) cellClasses += "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.6)] rounded-sm scale-[0.8] z-10 border-amber-200/40";
              else if (isWall) cellClasses += "bg-slate-500/50 rounded-sm scale-[0.85] border-slate-400/20";
              else if (isVisited) cellClasses += "bg-sky-400/30 rounded-full scale-[0.8] border-sky-300/10";
              else cellClasses += "bg-white/[0.02] hover:bg-white/[0.08]";

              return (
                <div
                  key={`${r}-${c}`}
                  className={cellClasses}
                  onMouseDown={() => onWallToggle?.(r, c)}
                  onMouseEnter={() => onMouseEnterCell?.(r, c)}
                  onMouseUp={onMouseUpCell}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});
GraphBoard.displayName = "GraphBoard";

// --- Main visualizer ---
export function InteractiveGraphVisualizer() {
  const [baseGrid, setBaseGrid] = useState<NodeData[][]>([]);
  const [mode, setMode] = useState<'single' | 'race'>('single');
  const [algorithm, setAlgorithm] = useState<AlgoType>("astar");
  const [runTrigger, setRunTrigger] = useState(0);

  const [isMousePressed, setIsMousePressed] = useState(false);
  const [runningCount, setRunningCount] = useState(0);

  const isRunning = runningCount > 0;

  // Initialize base grid
  useEffect(() => {
    const initialGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    setBaseGrid(initialGrid);
  }, []);

  const clearBoard = () => {
    if (isRunning) return;
    setBaseGrid(prev => prev.map(row => row.map(node => createNode(node.row, node.col))));
  };

  const handleWallToggle = useCallback((row: number, col: number) => {
    if (isRunning) return;
    setBaseGrid(prev => {
      const newGrid = [...prev];
      const node = newGrid[row][col];
      if (node.isStart || node.isEnd) return newGrid;

      // Deep copy row
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = { ...node, isWall: !node.isWall };
      return newGrid;
    });
    setIsMousePressed(true);
  }, [isRunning]);

  const handleMouseEnterCell = useCallback((row: number, col: number) => {
    if (!isMousePressed || isRunning) return;
    setBaseGrid(prev => {
      const newGrid = [...prev];
      const node = newGrid[row][col];
      if (node.isStart || node.isEnd) return newGrid;

      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = { ...node, isWall: !node.isWall };
      return newGrid;
    });
  }, [isMousePressed, isRunning]);

  const handleMouseUpCell = useCallback(() => setIsMousePressed(false), []);

  const generateRandomMaze = () => {
    if (isRunning) return;
    setBaseGrid(prev => prev.map(row => row.map(node => {
      const fresh = createNode(node.row, node.col);
      if (fresh.isStart || fresh.isEnd) return fresh;
      return { ...fresh, isWall: Math.random() < 0.28 };
    })));
  };

  const startAnimation = () => {
    if (isRunning) return;
    setRunTrigger(prev => prev + 1);
  };

  const handleRunningChange = useCallback((running: boolean) => {
    setRunningCount(prev => running ? prev + 1 : Math.max(0, prev - 1));
  }, []);

  const handleModeToggle = (newMode: 'single' | 'race') => {
    if (isRunning || mode === newMode) return;
    setRunTrigger(0);
    clearBoard();
    setMode(newMode);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="glass p-1 rounded-full flex items-center border border-border/30">
          <button
            onClick={() => handleModeToggle('single')}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all ${mode === 'single' ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Square className="w-4 h-4" /> Single
          </button>
          <button
            onClick={() => handleModeToggle('race')}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all ${mode === 'race' ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <LayoutGrid className="w-4 h-4" /> Race Mode
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" /> Start</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]" /> End</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-500/60" /> Wall</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-400/50" /> Visited</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.5)]" /> Path</span>
      </div>

      {/* Board Container */}
      <div className="w-full flex justify-center min-h-[400px]">
        {mode === 'single' ? (
          <div className="w-full max-w-5xl">
            <GraphBoard
              baseGrid={baseGrid}
              algorithm={algorithm}
              runTrigger={runTrigger}
              onWallToggle={handleWallToggle}
              onMouseEnterCell={handleMouseEnterCell}
              onMouseUpCell={handleMouseUpCell}
              onRunningChange={handleRunningChange}
              compact={false}
            />
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {(Object.keys(algorithmsInfo) as AlgoType[]).map((algo) => (
              <div key={algo} className="w-full flex justify-center items-center">
                <GraphBoard
                  baseGrid={baseGrid}
                  algorithm={algo}
                  runTrigger={runTrigger}
                  onWallToggle={handleWallToggle}
                  onMouseEnterCell={handleMouseEnterCell}
                  onMouseUpCell={handleMouseUpCell}
                  onRunningChange={handleRunningChange}
                  compact={true}
                  showTitle={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {!isRunning && mode === 'single' && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 font-medium animate-pulse">
          <MousePointer2 className="w-3.5 h-3.5" /> Click & drag to draw walls
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 glass p-6 rounded-3xl border border-border/30 max-w-6xl mx-auto w-full">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={startAnimation}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
            >
              <Play className="w-5 h-5 fill-current" />
              {isRunning ? "Running..." : mode === 'race' ? "Start Race" : "Start Search"}
            </button>
            <button
              onClick={generateRandomMaze}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-foreground/10 border border-border/30 hover:border-border/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Random Maze
            </button>
            <button
              onClick={clearBoard}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-red-500/10 hover:text-red-400 border border-border/30 hover:border-red-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Clear Layout
            </button>
          </div>

          {mode === 'single' && (
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(algorithmsInfo) as AlgoType[]).map((algo) => (
                <button
                  key={algo}
                  disabled={isRunning}
                  onClick={() => setAlgorithm(algo)}
                  className={`px-4 py-2 font-medium text-sm rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${algorithm === algo
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                      : "glass hover:bg-foreground/5 text-muted-foreground border border-transparent hover:border-border/30 hover:text-foreground"
                    }`}
                >
                  {algorithmsInfo[algo].name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-2 text-primary">
            <Navigation2 className="w-5 h-5" />
            <h3 className="font-bold text-lg">{mode === 'single' ? algorithmsInfo[algorithm].name : "Race Mode"}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
            {mode === 'single'
              ? algorithmsInfo[algorithm].desc
              : "Watch all 4 pathfinding algorithms compete simultaneously on identical mazes to reach the destination first."}
          </p>
          {mode === 'single' && (
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</span>
                <span className="font-mono text-foreground bg-foreground/5 px-2 py-1 rounded w-max border border-border/20 text-sm">
                  {algorithmsInfo[algorithm].time}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Space</span>
                <span className="font-mono text-foreground bg-foreground/5 px-2 py-1 rounded w-max border border-border/20 text-sm">
                  {algorithmsInfo[algorithm].space}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
