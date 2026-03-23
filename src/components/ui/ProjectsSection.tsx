"use client";

import { FadeIn } from "../animations/FadeIn";
import { FolderGit2, ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Content Data Lake",
    description: "Cloud-native data lake architecture migrated to Azure, handling 4M+ records daily. Features robust scaling with read replicas and optimized querying for high-throughput downstream systems.",
    tags: ["Azure", "Spark", "Python", "Data Lake"],
    link: "#",
    github: "#"
  },
  {
    title: "Intelligent Bulk Edit",
    description: "System allowing seamless bulk modifications of catalog items with validation and intelligent conflict resolution. Streamlined B2B operations for 20+ partners.",
    tags: ["Java", "Spring Boot", "React", "State Management"],
    link: "#",
  },
  {
    title: "Task Allocation System",
    description: "Automated distributed task allocation for optimal resource usage. Leveraged AI/ML heuristics for balancing 7M+ items across workers continuously.",
    tags: ["Python", "Airflow", "AI/LLMs", "Microservices"],
    github: "#"
  }
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 relative z-10 w-full flex justify-center">
      <div className="container mx-auto px-6 max-w-5xl">
        <FadeIn>
          <div className="flex items-center gap-3 mb-16">
            <span className="p-2 glass rounded-lg text-primary border border-primary/20"><FolderGit2 className="w-5 h-5"/></span>
            <h2 className="text-3xl font-bold">Featured Projects</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="group relative h-full glass p-6 rounded-3xl border border-border/30 hover:border-primary/50 transition-all duration-300 flex flex-col hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div className="flex gap-3 text-muted-foreground">
                    {project.github && <a href={project.github} className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>}
                    {project.link && <a href={project.link} className="hover:text-primary transition-colors"><ExternalLink className="w-5 h-5" /></a>}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/30">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-foreground/5 text-muted-foreground border border-border/50 group-hover:border-primary/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
