"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/types";
import { fetchSkills } from "@/lib/data/store";
import { Cpu, Layers, Code, Smartphone, Wrench, Bot, CheckCircle } from "lucide-react";

const CATEGORIES = [
  "Languages",
  "Web Development",
  "Mobile Development",
  "Frameworks",
  "Tools",
  "AI Tools",
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Languages": <Code className="w-4 h-4" />,
  "Web Development": <Cpu className="w-4 h-4" />,
  "Mobile Development": <Smartphone className="w-4 h-4" />,
  "Frameworks": <Layers className="w-4 h-4" />,
  "Tools": <Wrench className="w-4 h-4" />,
  "AI Tools": <Bot className="w-4 h-4" />,
};

export function SkillsSection() {
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Languages");

  useEffect(() => {
    async function loadSkills() {
      const data = await fetchSkills();
      setSkillsList(data);
    }
    loadSkills();
  }, []);

  const filteredSkills = skillsList.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Skills & Ecosystem
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Technical <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            A comprehensive overview of programming languages, web & mobile frameworks, tools, and AI copilots I use to build scalable products.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                    : "glass-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {CATEGORY_ICONS[category]}
                {category}
              </button>
            );
          })}
        </div>

        {/* Skills Bento Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredSkills.map((skill: Skill) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={skill.id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-white/10 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                      {skill.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {skill.name}
                  </h3>
                </div>

                {/* Proficiency Bar */}
                <div className="mt-6 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Proficiency</span>
                    <span>{skill.proficiency || 90}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.proficiency || 90}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
