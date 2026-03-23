"use client";

import { FadeIn } from "../animations/FadeIn";
import { Sparkles } from "lucide-react";
import { PersonalProjectCard } from "./PersonalProjectCard";
import { SortingBarAnimation } from "../animations/SortingBarAnimation";
import { GraphPathAnimation } from "../animations/GraphPathAnimation";
import { GeneticArtAnimation } from "../animations/GeneticArtAnimation";

const personalProjects = [
  {
    title: "Darwin's Canvas",
    description: "A genetic algorithm that evolves semi-transparent polygons to approximate any image. Watch evolution paint a masterpiece — one mutation at a time.",
    tags: ["Genetic Algorithm", "Canvas API", "Evolution"],
    link: "/projects/darwins-canvas",
    visual: <GeneticArtAnimation />,
  },
  {
    title: "Graph Algorithm Visualizer",
    description: "An interactive grid to explore common graph search implementations (BFS, DFS, Dijkstra, A*). Draw walls to see how they find paths around obstacles efficiently.",
    tags: ["React", "Algorithms", "Pathfinding"],
    link: "/projects/graph-visualizer",
    visual: <GraphPathAnimation />,
  },
  {
    title: "Sorting Visualizer",
    description: "An interactive code playground to understand how different sorting algorithms work under the hood. Watch arrays get structured in real-time with beautiful animations.",
    tags: ["React", "Framer Motion", "Algorithms"],
    link: "/projects/sorting-visualizer",
    visual: <SortingBarAnimation />,
  }
];

export function PersonalProjectsSection() {
  return (
    <section id="personal-projects" className="py-24 relative z-10 w-full flex justify-center">
      <div className="container mx-auto px-6 max-w-5xl">
        <FadeIn>
          <div className="flex items-center gap-3 mb-16">
            <span className="p-2 glass rounded-lg text-primary border border-primary/20">
              <Sparkles className="w-5 h-5"/>
            </span>
            <h2 className="text-3xl font-bold text-gradient-primary">Personal Projects</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalProjects.map((project, index) => (
            <FadeIn key={index} delay={index * 0.2}>
              <PersonalProjectCard {...project} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
