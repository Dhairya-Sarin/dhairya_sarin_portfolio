"use client";

import { FadeIn } from "../animations/FadeIn";
import { Briefcase } from "lucide-react";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 relative z-10 w-full flex justify-center bg-card/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn>
          <div className="flex items-center gap-3 mb-16">
            <span className="p-2 glass rounded-lg text-primary border border-primary/20"><Briefcase className="w-5 h-5"/></span>
            <h2 className="text-3xl font-bold">Experience</h2>
          </div>
        </FadeIn>

        <div className="relative pl-6 md:pl-0 border-l border-border md:border-none space-y-16">
          {/* Timeline Node */}
          <FadeIn delay={0.1}>
            <div className="md:grid md:grid-cols-5 gap-8 items-start relative group">
              <div className="hidden md:block absolute left-[19.5%] top-2 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />
              <div className="hidden md:block absolute left-[20%] top-2 bottom-[-64px] border-l border-border/50 group-last:border-none" />
              
              <div className="md:col-span-1 mb-4 md:mb-0">
                <p className="text-sm font-medium text-muted-foreground pt-1 uppercase tracking-wider">2021 — Present</p>
              </div>
              <div className="md:col-span-4 relative glass p-8 rounded-3xl border border-border/30 hover:border-primary/30 transition-all duration-300">
                {/* Mobile timeline dot */}
                <div className="absolute -left-[31px] top-8 w-3 h-3 rounded-full bg-primary ring-4 ring-background md:hidden" />
                
                <h3 className="text-2xl font-bold mb-1">Software Engineer III</h3>
                <h4 className="text-lg text-primary mb-6">Walmart</h4>
                
                <p className="text-muted-foreground mb-6">
                  Driving the unified item setup and management experience across the global catalog. Leading the architecture and modernization of core data infrastructure.
                </p>
                <ul className="space-y-3 text-muted-foreground text-sm list-inside">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Built unified platform syncing <span className="text-foreground">7M+ items</span> globally to downstream systems under 15 mins.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Migrated Content Data Lake to Azure, handling <span className="text-foreground">4M+ records/day</span> and scaling read replicas.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Improved system efficiency by <span className="text-foreground">27%</span> through query optimization.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Facilitated seamless integration for <span className="text-foreground">20+</span> B2B and content partners.</span>
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
