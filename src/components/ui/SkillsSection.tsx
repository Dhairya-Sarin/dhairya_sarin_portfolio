"use client";

import { FadeIn } from "../animations/FadeIn";
import { Code2 } from "lucide-react";

export function SkillsSection() {
  const codeSkills = ["Python", "Java", "TypeScript", "SQL"];
  const frameworks = ["React", "Next.js", "Spring Boot", "FastAPI"];
  const dataAI = ["Spark", "Airflow", "Kafka", "Data Lakes", "AI/LLMs"];
  const tools = ["Azure", "GCP", "Kubernetes", "Docker", "Git"];

  const renderSkillGroup = (title: string, skills: string[], delay: number) => (
    <FadeIn delay={delay} className="glass p-6 rounded-3xl border border-border/30 hover:border-primary/30 transition-all duration-300">
      <h3 className="text-lg font-medium mb-4 text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span key={skill} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
            {skill}
          </span>
        ))}
      </div>
    </FadeIn>
  );

  return (
    <section id="skills" className="py-24 relative z-10 w-full flex justify-center bg-card/10 border-t border-border/30">
      <div className="container mx-auto px-6 max-w-4xl">
         <FadeIn>
          <div className="flex items-center gap-3 mb-12">
            <span className="p-2 glass rounded-lg text-accent border border-accent/20"><Code2 className="w-5 h-5"/></span>
            <h2 className="text-3xl font-bold">Technical Arsenal</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderSkillGroup("Languages", codeSkills, 0.1)}
          {renderSkillGroup("Data & AI Infrastructure", dataAI, 0.2)}
          {renderSkillGroup("Frameworks & APIs", frameworks, 0.3)}
          {renderSkillGroup("Cloud & DevOps", tools, 0.4)}
        </div>
      </div>
    </section>
  );
}
