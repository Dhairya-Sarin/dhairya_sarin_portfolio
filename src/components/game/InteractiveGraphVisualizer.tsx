"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Trash2, MousePointer2, Navigation2, Sparkles } from "lucide-react";

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

export function InteractiveGraphVisualizer() {
  const [grid, setGrid] = useState<NodeData[][]>([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState<AlgoType>("astar");
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const initialGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    setGrid(initialGrid);
  }, []);

  const createNode = (row: number, col: number): NodeData => ({
    row, col,
    isStart: row === START_INITIAL.row && col === START_INITIAL.col,
    isEnd: row === END_INITIAL.row && col === END_INITIAL.col,
    distance: Infinity, fScore: Infinity,
    isVisited: false, isWall: false, isPath: false, previousNode: null,
  });

  const clearTimeouts = () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  const clearBoard = () => { if (isRunning) return; clearTimeouts(); setGrid(prev => prev.map(row => row.map(node => createNode(node.row, node.col)))); };
  const clearPath = () => { if (isRunning) return; clearTimeouts(); setGrid(prev => prev.map(row => row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, fScore: Infinity, previousNode: null })))); };

  const handleMouseDown = (row: number, col: number) => { if (isRunning) return; setGrid(toggleWall(grid, row, col)); setIsMousePressed(true); };
  const handleMouseEnter = (row: number, col: number) => { if (!isMousePressed || isRunning) return; setGrid(toggleWall(grid, row, col)); };
  const handleMouseUp = () => setIsMousePressed(false);

  const toggleWall = (g: NodeData[][], row: number, col: number) => {
    const newGrid = [...g];
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return newGrid;
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = { ...node, isWall: !node.isWall };
    return newGrid;
  };

  const generateRandomMaze = () => {
    if (isRunning) return;
    clearTimeouts();
    setGrid(prev => prev.map(row => row.map(node => {
      const fresh = createNode(node.row, node.col);
      if (fresh.isStart || fresh.isEnd) return fresh;
      return { ...fresh, isWall: Math.random() < 0.28 };
    })));
  };

  // ---- ALGORITHMS ----
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

  const runAlgorithm = () => {
    if (isRunning) return;
    clearPath();
    setIsRunning(true);
    setTimeout(() => {
      const { visitedNodesInOrder, nodesInShortestPathOrder } = calculate(algorithm);
      animateSearch(visitedNodesInOrder, nodesInShortestPathOrder);
    }, 100);
  };

  const calculate = (algo: AlgoType) => {
    const gc = grid.map(r => r.map(c => ({...c})));
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
    while (cn !== null) { path.unshift({...cn}); cn = cn.previousNode; }
    return { visitedNodesInOrder: visited, nodesInShortestPathOrder: path };
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
          setGrid(prev => { const ng = prev.map(r => [...r]); ng[n.row] = [...ng[n.row]]; ng[n.row][n.col] = { ...ng[n.row][n.col], isVisited: true }; return ng; });
        }
      }, 12 * i));
    }
    // No visited nodes case
    setIsRunning(false);
  };

  const animatePath = (path: NodeData[]) => {
    for (let i = 0; i < path.length; i++) {
      timeoutsRef.current.push(setTimeout(() => {
        const n = path[i];
        if (!n.isStart && !n.isEnd) {
          setGrid(prev => { const ng = prev.map(r => [...r]); ng[n.row] = [...ng[n.row]]; ng[n.row][n.col] = { ...ng[n.row][n.col], isPath: true }; return ng; });
        }
        if (i === path.length - 1) setIsRunning(false);
      }, 35 * i));
    }
    if (path.length === 0) setIsRunning(false);
  };

  // ---- RENDER ----
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Grid */}
      <div
        className="w-full overflow-hidden flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl glass border border-border/30 relative shadow-2xl"
        onMouseLeave={handleMouseUp}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/4 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
        
        {/* Legend */}
        <div className="flex items-center gap-5 mb-4 z-10 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" /> Start</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]" /> End</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-500/60" /> Wall</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-400/50" /> Visited</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.5)]" /> Path</span>
        </div>

        <div className="flex flex-col z-10 select-none touch-none">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((node) => {
                const { row: r, col: c, isStart, isEnd, isWall, isVisited, isPath } = node;

                let cellClasses = "w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] border-[0.5px] border-white/[0.04] transition-all duration-200 cursor-pointer ";

                if (isStart) cellClasses += "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)] rounded-md scale-110 z-20 border-emerald-300/50";
                else if (isEnd) cellClasses += "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.7)] rounded-md scale-110 z-20 border-rose-300/50";
                else if (isPath) cellClasses += "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.6)] rounded-full scale-[0.7] z-10 border-amber-200/40";
                else if (isWall) cellClasses += "bg-slate-500/50 rounded-sm scale-[0.85] border-slate-400/20";
                else if (isVisited) cellClasses += "bg-sky-400/30 rounded-full scale-[0.8] border-sky-300/10";
                else cellClasses += "bg-white/[0.02] hover:bg-white/[0.08]";

                return (
                  <div
                    key={`${r}-${c}`}
                    className={cellClasses}
                    onMouseDown={() => handleMouseDown(r, c)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    onMouseUp={handleMouseUp}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {!isRunning && (
          <div className="absolute bottom-4 right-6 flex items-center gap-2 text-xs text-muted-foreground/60 font-medium animate-pulse z-20">
            <MousePointer2 className="w-3.5 h-3.5" /> Click & drag to draw walls
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 glass p-6 rounded-3xl border border-border/30">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runAlgorithm}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
            >
              <Play className="w-5 h-5 fill-current" />
              {isRunning ? "Running..." : "Start Search"}
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
              Clear All
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(algorithmsInfo) as AlgoType[]).map((algo) => (
              <button
                key={algo}
                disabled={isRunning}
                onClick={() => { clearPath(); setAlgorithm(algo); }}
                className={`px-4 py-2 font-medium text-sm rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  algorithm === algo
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                    : "glass hover:bg-foreground/5 text-muted-foreground border border-transparent hover:border-border/30 hover:text-foreground"
                }`}
              >
                {algorithmsInfo[algo].name}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-2 text-primary">
            <Navigation2 className="w-5 h-5" />
            <h3 className="font-bold text-lg">{algorithmsInfo[algorithm].name}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
            {algorithmsInfo[algorithm].desc}
          </p>
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
        </div>
      </div>
    </div>
  );
}
