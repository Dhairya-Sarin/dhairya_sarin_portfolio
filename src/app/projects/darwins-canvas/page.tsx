import { FadeIn } from "@/components/animations/FadeIn";
import { GeneticArtVisualizer } from "@/components/game/GeneticArtVisualizer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DarwinsCanvasPage() {
  return (
    <main className="min-h-screen py-24 relative overflow-hidden flex flex-col">
      {/* Background blurs */}
      <div className="absolute top-[-5%] left-[10%] w-[35%] h-[35%] bg-amber-500/15 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[10%] w-[35%] h-[35%] bg-rose-500/15 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

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
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">Darwin&apos;s Canvas</h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Watch evolution paint a masterpiece. A genetic algorithm evolves semi-transparent polygons to approximate any image — one mutation at a time.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.4} className="flex-grow flex flex-col">
          <GeneticArtVisualizer />
        </FadeIn>
      </div>
    </main>
  );
}
