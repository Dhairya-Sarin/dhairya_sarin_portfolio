"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, MonitorPlay } from "lucide-react";
import { ReactNode } from "react";

interface PersonalProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  visual?: ReactNode;
}

export function PersonalProjectCard({ title, description, tags, link, github, visual }: PersonalProjectCardProps) {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      className="group relative h-full glass p-8 rounded-3xl border border-border/30 hover:border-primary/50 transition-all duration-500 flex flex-col hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/10 overflow-hidden"
    >
      {/* Decorative background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
          <MonitorPlay className="w-6 h-6" />
        </div>
        <div className="flex gap-3 text-muted-foreground">
          {github && <a href={github} className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>}
          {link && <a href={link} className="hover:text-primary transition-colors"><ExternalLink className="w-5 h-5" /></a>}
        </div>
      </div>
      
      {visual && <div className="relative z-10 mb-6">{visual}</div>}
      
      <h3 className="relative z-10 text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
        {title}
      </h3>
      
      <div className="relative z-10 mb-8 flex-grow">
        <p className="text-muted-foreground text-base leading-relaxed">
          {description.split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { opacity: 0.8, y: 0 },
                hover: { opacity: 1, y: -2, color: "var(--foreground)" }
              }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="inline-block mr-1"
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
      
      <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-6 border-t border-border/30">
        {tags.map((tag, i) => (
          <motion.span 
            key={tag} 
            variants={{
              initial: { opacity: 0.8, y: 0 },
              hover: { opacity: 1, y: -2 }
            }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-foreground/5 text-muted-foreground border border-border/50 group-hover:border-primary/30 transition-colors"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
