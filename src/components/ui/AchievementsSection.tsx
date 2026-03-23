"use client";

import { FadeIn } from "../animations/FadeIn";
import { Award, Trophy } from "lucide-react";

export function AchievementsSection() {
  return (
    <section id="achievements" className="py-24 relative z-10 w-full flex justify-center">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn>
          <div className="flex items-center gap-3 mb-12">
            <span className="p-2 glass rounded-lg text-primary border border-primary/20"><Award className="w-5 h-5"/></span>
            <h2 className="text-3xl font-bold">Achievements</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn delay={0.1} className="glass p-8 rounded-3xl border border-border/30 hover:border-primary/30 transition-all duration-300 flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">2× Bravo Award</h3>
              <p className="text-muted-foreground text-sm">Recognized for outstanding contribution to the core item setup architecture and resolving critical data sync bottlenecks.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="glass p-8 rounded-3xl border border-border/30 hover:border-primary/30 transition-all duration-300 flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-full text-accent shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Hackathon Top 3</h3>
              <p className="text-muted-foreground text-sm">Developed an innovative AI-driven pipeline optimizer during the company-wide hackathon, competing against 50+ teams.</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
