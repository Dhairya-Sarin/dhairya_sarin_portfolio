import { FadeIn } from "@/components/animations/FadeIn";
import { InteractiveGraphVisualizer } from "@/components/game/InteractiveGraphVisualizer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GraphVisualizerPage() {
  return (
    <main className="min-h-screen py-24 relative overflow-hidden flex flex-col">
      {/* Background Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col flex-grow">
        <FadeIn delay={0.1}>
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group w-max">
            <div className="p-2 rounded-full glass group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="font-medium">Back to Portfolio</span>
          </Link>
        </FadeIn>

        <div className="flex flex-col gap-4 mb-12">
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">Graph Search Visualizer</h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Understand pathfinding in computer science. Click and drag on the grid to create impenetrable walls and observe how algorithms navigate to the red target.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.4} className="flex-grow flex flex-col">
          <InteractiveGraphVisualizer />
        </FadeIn>
      </div>
    </main>
  );
}
