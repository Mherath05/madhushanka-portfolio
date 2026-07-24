import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Canvas */}
      <AnimatedBackground />

      {/* Floating Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* About Me Section */}
      <AboutSection />

      {/* Skills Bento Grid Section */}
      <SkillsSection />

      {/* Projects Showcase Section */}
      <ProjectsSection />

      {/* Work Experience Section */}
      <ExperienceSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
