"use client";

import { FadeIn } from "../animations/FadeIn";

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative z-10 w-full flex justify-center">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn>
          <h2 className="text-3xl font-bold mb-8">About Me</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="glass p-8 rounded-3xl border border-border/30 hover:border-primary/20 transition-colors duration-500">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am a Software Engineer focused on building highly scalable <span className="text-foreground">Data Systems</span> and <span className="text-foreground">AI Infrastructure</span>. 
              With a passion for operational excellence and robust pipelines, I design systems that process millions of records daily while keeping efficiency and maintainability at the core.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
