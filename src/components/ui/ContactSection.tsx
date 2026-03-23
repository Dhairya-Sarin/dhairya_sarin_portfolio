"use client";

import { useState } from "react";
import { FadeIn } from "../animations/FadeIn";
import { Mail, Linkedin, Github, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request (swap this out with Formspree or an API route later)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative z-10 w-full flex justify-center border-t border-border/30 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          <FadeIn>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Let's Connect.</h2>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              I'm currently focused on building robust data systems and exploring AI infrastructure. Whether you have an opportunity or just want to say hi, my inbox is always open.
            </p>
            
            <div className="flex gap-4">
              <a href="mailto:contact@example.com" className="p-4 glass rounded-full hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
                <Mail className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-full hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-full hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
                <Github className="w-6 h-6" />
              </a>
            </div>
            
            <div className="mt-24 text-sm font-medium text-muted-foreground/60 hidden md:block">
              <p>© {new Date().getFullYear()} Dhairya Sarin.</p>
              <p className="mt-1">Built deeply with Next.js, Framer Motion & Tailwind.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-border/30 flex flex-col gap-6 relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="space-y-2 relative z-10">
                <label htmlFor="name" className="text-sm font-semibold text-foreground tracking-wide uppercase">Your Name</label>
                <input 
                  id="name"
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-border"
                />
              </div>

              <div className="space-y-2 relative z-10">
                <label htmlFor="email" className="text-sm font-semibold text-foreground tracking-wide uppercase">Your Email</label>
                <input 
                  id="email"
                  type="email" 
                  required
                  placeholder="john@company.com"
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-border"
                />
              </div>

              <div className="space-y-2 relative z-10 mb-2">
                <label htmlFor="message" className="text-sm font-semibold text-foreground tracking-wide uppercase">Message</label>
                <textarea 
                  id="message"
                  required
                  rows={4}
                  placeholder="How can I help you?"
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none hover:border-border"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={cn(
                  "relative z-10 w-full rounded-xl px-6 py-4 font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300",
                  isSubmitted ? "bg-green-500/10 text-green-400 border border-green-500/50" : "bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
                )}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Message Sent Successfully
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 ml-1 mb-0.5" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-12 text-center text-sm font-medium text-muted-foreground/60 md:hidden">
              <p>© {new Date().getFullYear()} Dhairya Sarin.</p>
              <p className="mt-1">Built deeply with Next.js, Framer Motion & Tailwind.</p>
            </div>
          </FadeIn>
          
        </div>
      </div>
    </section>
  );
}
