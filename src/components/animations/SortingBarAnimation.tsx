"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Bar = { id: number; height: number };

const generateRandomArray = (size: number): Bar[] => {
  return Array.from({ length: size }, (_, i) => ({
    id: i + 1, // stable unique IDs for framer-motion layout
    height: Math.floor(Math.random() * 70) + 30, // Random height between 30 and 100
  }));
};

const getBubbleSortStates = (initialArray: Bar[]): Bar[][] => {
  const steps: Bar[][] = [];
  const arr = [...initialArray];
  let n = arr.length;
  let swapped = true;
  
  steps.push([...arr]); // Record initial unsorted state
  
  while (swapped) {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i].height > arr[i + 1].height) {
        // Swap
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
        steps.push([...arr]); // Record state after each swap
      }
    }
    n--;
  }
  return steps;
};

export function SortingBarAnimation() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let currentStep = 0;
    let states: Bar[][] = [];

    const initializeAndSort = () => {
      const newArray = generateRandomArray(8);
      states = getBubbleSortStates(newArray);
      currentStep = 0;
      setBars(states[0]);
    };

    initializeAndSort();

    // Iterate through sorting states to create animation
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < states.length) {
        setBars(states[currentStep]);
      } else {
        // Wait a few ticks at the end before restarting with a new array
        if (currentStep > states.length + 4) {
          initializeAndSort();
        }
      }
    }, 500); // 500ms delay between swaps

    return () => clearInterval(interval);
  }, []);

  // Prevent server-client hydration mismatch due to random array generation
  if (!isClient) {
    return <div className="w-full h-32 flex items-end gap-1.5 p-4 rounded-xl bg-foreground/5 border border-border/30 overflow-hidden relative" />;
  }

  return (
    <div className="w-full h-32 flex items-end gap-1.5 p-4 rounded-xl bg-foreground/5 border border-border/30 overflow-hidden relative group-hover:bg-foreground/10 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-20 pointer-events-none" />
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          layout
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{ height: `${bar.height}%` }}
          className="flex-1 bg-gradient-to-t from-primary/80 to-accent/80 rounded-t-sm shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-shadow duration-300"
        />
      ))}
    </div>
  );
}
