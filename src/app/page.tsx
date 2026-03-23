import { HeroSection } from "@/components/ui/HeroSection";
import { AboutSection } from "@/components/ui/AboutSection";
import { ExperienceSection } from "@/components/ui/ExperienceSection";
import { ProjectsSection } from "@/components/ui/ProjectsSection";
import { OpenSourceProjectsSection } from "@/components/ui/OpenSourceProjectsSection";
import { PersonalProjectsSection } from "@/components/ui/PersonalProjectsSection";
import { SkillsSection } from "@/components/ui/SkillsSection";
import { AchievementsSection } from "@/components/ui/AchievementsSection";
import { DataPipelineGame } from "@/components/game/DataPipelineGame";
import { ContactSection } from "@/components/ui/ContactSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <OpenSourceProjectsSection />
      <PersonalProjectsSection />
      <SkillsSection />
      <AchievementsSection />
      <DataPipelineGame />
      <ContactSection />
    </main>
  );
}
