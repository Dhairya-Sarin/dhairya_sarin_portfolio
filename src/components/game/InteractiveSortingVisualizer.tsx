"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Play, Square, Shuffle, Info, FileEdit } from "lucide-react";

type Bar = { id: string; value: number };

const algorithmsInfo = {
  bubble: { name: "Bubble Sort", time: "O(n²)", space: "O(1)", desc: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order." },
  insertion: { name: "Insertion Sort", time: "O(n²)", space: "O(1)", desc: "Builds the final sorted array one item at a time. It works similarly to the way you sort playing cards in your hands." },
  selection: { name: "Selection Sort", time: "O(n²)", space: "O(1)", desc: "Finds the minimum value, swaps it with the value in the first position, and repeats these steps for the remainder of the list." },
  merge: { name: "Merge Sort", time: "O(n log n)", space: "O(n)", desc: "A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves." },
  quick: { name: "Quick Sort", time: "O(n log n)", space: "O(log n)", desc: "Picks an element as pivot and partitions the given array around the picked pivot, placing it in its correct position." },
  bogo: { name: "Bogo Sort", time: "O(n!)", space: "O(1)", desc: "A highly ineffective sorting function based on the generate and test paradigm. It successively generates permutations of its input until it finds one that is sorted. (Limited to 150 steps for safety!)" },
};

type AlgoType = keyof typeof algorithmsInfo;

const generateRandomArray = (size: number): Bar[] => {
  return Array.from({ length: size }, () => ({
    id: Math.random().toString(36).substring(7),
    value: Math.floor(Math.random() * 90) + 10,
  }));
};

const getSortingSteps = (arr: Bar[], algo: AlgoType): Bar[][] => {
  const steps: Bar[][] = [];
  const curr = [...arr];

  // Using a helper swap function guarantees that object IDs are uniquely preserved 
  // and no duplicate references exist in the array (prevents React duplicate key errors from slicing/copying).
  const swap = (i: number, j: number) => {
    const temp = curr[i];
    curr[i] = curr[j];
    curr[j] = temp;
    steps.push([...curr]);
  };

  if (algo === "bubble") {
    let n = curr.length;
    let swapped = true;
    steps.push([...curr]);
    while (swapped) {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        if (curr[i].value > curr[i + 1].value) {
          swap(i, i + 1);
          swapped = true;
        }
      }
      n--;
    }
  } else if (algo === "insertion") {
    steps.push([...curr]);
    for (let i = 1; i < curr.length; i++) {
      let j = i;
      // We physically swap them backwards to keep IDs physically moving for layouts
      while (j > 0 && curr[j - 1].value > curr[j].value) {
        swap(j, j - 1);
        j--;
      }
    }
  } else if (algo === "selection") {
    steps.push([...curr]);
    for (let i = 0; i < curr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < curr.length; j++) {
        if (curr[j].value < curr[minIdx].value) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        swap(i, minIdx);
      }
    }
  } else if (algo === "merge") {
    steps.push([...curr]);
    // In-place merge using swaps keeps IDs entirely stable and eliminates duplicates
    const inPlaceMerge = (left: number, mid: number, right: number) => {
      let i = left;
      let j = mid + 1;
      
      while (i <= mid && j <= right) {
        if (curr[i].value <= curr[j].value) {
          i++;
        } else {
          // curr[j] is smaller, shift it into index i by swapping backwards steadily
          let tempIndex = j;
          while (tempIndex > i) {
            swap(tempIndex, tempIndex - 1);
            tempIndex--;
          }
          i++;
          mid++;
          j++;
        }
      }
    };
    const mergeSort = (left: number, right: number) => {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      inPlaceMerge(left, mid, right);
    };
    mergeSort(0, curr.length - 1);
    
  } else if (algo === "quick") {
    steps.push([...curr]);
    const partition = (low: number, high: number) => {
      let pivot = curr[high].value;
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (curr[j].value < pivot) {
          i++;
          swap(i, j);
        }
      }
      swap(i + 1, high);
      return i + 1;
    };
    const quickSort = (low: number, high: number) => {
      if (low < high) {
        let pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };
    quickSort(0, curr.length - 1);
    
  } else if (algo === "bogo") {
    steps.push([...curr]);
    const isSorted = () => {
      for (let i = 1; i < curr.length; i++) {
        if (curr[i - 1].value > curr[i].value) return false;
      }
      return true;
    };
    let maxTries = 150; 
    while (!isSorted() && maxTries > 0) {
      for (let i = curr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = curr[i];
        curr[i] = curr[j];
        curr[j] = temp;
      }
      steps.push([...curr]); // Just randomly shuffled states
      maxTries--;
    }
    // If it fails to Bogo sort, bubble sort the rest of it for visual completion!
    if (maxTries === 0) {
      let n = curr.length;
      let swapped = true;
      while (swapped) {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
          if (curr[i].value > curr[i + 1].value) {
            swap(i, i + 1);
            swapped = true;
          }
        }
        n--;
      }
    }
  }

  return steps;
};

export function InteractiveSortingVisualizer() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgoType>("bubble");
  const [isSorting, setIsSorting] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setBars(generateRandomArray(15));
  }, []);

  const maxValue = Math.max(...bars.map(b => b.value), 100);

  const startSort = () => {
    if (isSorting) return;
    setIsSorting(true);
    const steps = getSortingSteps(bars, algorithm);
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setBars(steps[currentStep]);
      } else {
        stopSort();
      }
    }, 450); // Slowed down from 150 to 450
  };

  const stopSort = () => {
    setIsSorting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleRandomize = () => {
    stopSort();
    setBars(generateRandomArray(15));
    setCustomInput("");
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    const parts = e.target.value.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parts.length > 0) {
      stopSort();
      setBars(parts.map(val => ({ id: Math.random().toString(36).substring(7), value: val })));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Visualizer Frame */}
      <div className="w-full h-[400px] flex items-end gap-1.5 p-6 rounded-3xl glass border border-border/30 relative shadow-2xl overflow-hidden">
        {bars.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Enter numbers below to visualize.
          </div>
        )}
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            layout
            initial={false}
            transition={{ type: "spring", stiffness: 150, damping: 20 }} // Softer, slower spring
            style={{ height: `${Math.max((bar.value / maxValue) * 100, 5)}%` }} // Ensure min height of 5%
            className="flex-1 min-w-[10px] bg-gradient-to-t from-primary to-accent rounded-t-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] flex justify-center pb-2 relative group"
          >
            {/* Show value on hover or if there are fewer bars */}
            {(bars.length <= 25) && (
              <span className="absolute -top-6 text-xs text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity font-mono">
                {bar.value}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 glass p-6 rounded-3xl border border-border/30">
        
        {/* Controls Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={isSorting ? stopSort : startSort}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              {isSorting ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              {isSorting ? "Stop Animation" : "Start Sorting"}
            </button>
            <button
              onClick={handleRandomize}
              disabled={isSorting}
              className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-foreground/10 hover:border-border/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              Random Array
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(algorithmsInfo) as AlgoType[]).map((algo) => (
              <button
                key={algo}
                disabled={isSorting}
                onClick={() => setAlgorithm(algo)}
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2"> 
              <FileEdit className="w-4 h-4" /> Custom Array (Comma Separated) 
            </label>
            <input
              type="text"
              value={customInput}
              onChange={handleCustomInput}
              disabled={isSorting}
              placeholder="e.g. 5, 23, 7, 90, 42"
              className="w-full bg-background/50 border border-border/30 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all font-mono disabled:opacity-50"
            />
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            <h3 className="font-bold text-lg">{algorithmsInfo[algorithm].name}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
            {algorithmsInfo[algorithm].desc}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</span>
              <span className="font-mono text-foreground bg-foreground/5 px-2 py-1 rounded w-max border border-border/20">
                {algorithmsInfo[algorithm].time}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Space</span>
              <span className="font-mono text-foreground bg-foreground/5 px-2 py-1 rounded w-max border border-border/20">
                {algorithmsInfo[algorithm].space}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
