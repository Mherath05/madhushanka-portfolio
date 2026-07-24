"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Mail, ArrowRight, Code2, Sparkles, Terminal, ShieldCheck } from "lucide-react";
import Image from "next/image";
import myImg from "@/img/my_img.png";
import { fetchProjects, fetchSkills } from "@/lib/data/store";

export function HeroSection() {
  const [projectsCount, setProjectsCount] = useState<number>(4);
  const [skillsCount, setSkillsCount] = useState<number>(28);

  useEffect(() => {
    async function loadRealCounts() {
      const [projs, skls] = await Promise.all([fetchProjects(), fetchSkills()]);
      if (projs && projs.length > 0) setProjectsCount(projs.length);
      if (skls && skls.length > 0) setSkillsCount(skls.length);
    }
    loadRealCounts();
  }, []);

  const dynamicStatistics = [
    { label: "Years Experience", value: "1+", description: "Software Engineering" },
    { label: "Projects Completed", value: `${projectsCount}+`, description: "Web, Mobile & Desktop" },
    { label: "Technologies Mastered", value: `${skillsCount}+`, description: "Full-Stack Tech Stacks" },
    { label: "Client Satisfaction", value: "100%", description: "Quality Driven Deliverables" },
  ];

  const handleDownloadCV = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `Madhushanka Herath - Full Stack Software Engineer Resume\n\nEmail: madhushankaherath2@gmail.com\nPhone: 0769702634\nLinkedIn: https://www.linkedin.com/in/madhushanka-herath-kumara-a4a294369\nGitHub: https://github.com/Mherath05\n\nExperience: Associate Software Engineer at Rabbit Solutions Pvt Ltd.\nSpecializations: PHP, Java, Python, React, Next.js, React Native, Supabase.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Madhushanka_Herath_CV.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for new projects & opportunities
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-medium text-slate-600 dark:text-slate-400">
                Hello, I am
              </h2>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Madhushanka <span className="text-gradient">Herath</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                Full Stack Software Engineer
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Crafting high-performance web applications, cross-platform mobile apps, and intuitive digital experiences with modern JavaScript, TypeScript, React, Next.js, and cloud ecosystems.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#contact"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 group"
              >
                <Mail className="w-4 h-4" />
                Contact Me
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={handleDownloadCV}
                className="px-6 py-3.5 rounded-2xl glass-card text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white font-semibold text-sm flex items-center gap-2 hover:border-indigo-500/50 transition-all duration-300"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                Download CV
              </button>
            </div>

            {/* Quick Tech Pill Tags */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 flex-wrap text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <Code2 className="w-3.5 h-3.5 text-indigo-500" /> Next.js 15
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <Terminal className="w-3.5 h-3.5 text-purple-500" /> React Native
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Supabase
              </span>
            </div>
          </motion.div>

          {/* Right Profile & Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Animated Glow Halo */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 blur-2xl opacity-40 animate-pulse-glow" />

              {/* Profile Glass Frame */}
              <div className="relative w-full h-full rounded-3xl glass-panel p-3 border-white/30 dark:border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src={myImg}
                    alt="Madhushanka Herath Profile"
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Floating Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-white tracking-wide">Madhushanka Herath</h4>
                        <p className="text-xs font-semibold text-indigo-300 mt-0.5">Graduate at Rajarata University of Sri Lanka</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Animated Dynamic Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {dynamicStatistics.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-2xl text-center group hover:scale-[1.03] transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.description}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
