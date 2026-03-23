"use client";

import { FadeIn } from "../animations/FadeIn";
import { Code2 } from "lucide-react";
import { PersonalProjectCard } from "./PersonalProjectCard";
import { DataFlowAnimation } from "../animations/DataFlowAnimation";

const openSourceProjects = [
  {
    title: "Snowflake Data Quality Gate Operator",
    description:
      "A production-ready Apache Airflow provider that loads data from cloud storage into Snowflake with a built-in data quality gate. Bad data is caught before it ever touches production tables.",
    tags: ["Python", "Apache Airflow", "Snowflake", "PyPI", "Open Source"],
    link: "/projects/snowflake-quality-gate",
    github: "https://github.com/Dhairya-Sarin/snowflake-data-quality-gate-operator",
    visual: <DataFlowAnimation />,
  },
];

export function OpenSourceProjectsSection() {
  return (
    <section id="open-source-projects" className="py-24 relative z-10 w-full flex justify-center">
      <div className="container mx-auto px-6 max-w-5xl">
        <FadeIn>
          <div className="flex items-center gap-3 mb-16">
            <span className="p-2 glass rounded-lg text-primary border border-primary/20">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-3xl font-bold text-gradient-primary">Open Source Projects</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openSourceProjects.map((project, index) => (
            <FadeIn key={index} delay={index * 0.2}>
              <PersonalProjectCard {...project} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
