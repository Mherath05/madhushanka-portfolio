"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award, Heart, CheckCircle2, UserCheck } from "lucide-react";

export function AboutSection() {
  const softSkills = [
    "Problem Solving & Analytical Thinking",
    "Team Leadership & Collaboration",
    "Agile & Scrum Methodology",
    "Cross-Functional Communication",
    "Clean Code & Architecture",
    "Continuous Learning & AI Adaptability",
  ];

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            About Me
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Passionate Engineer Driven by <span className="text-gradient">Innovation</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Delivering robust, scalable web and mobile products with precision software engineering.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Professional Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 glass-card p-8 rounded-3xl space-y-6"
          >
            <div className="flex items-center gap-3 text-indigo-500 font-bold text-xl">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3>Professional Summary</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              I am <strong className="text-slate-900 dark:text-white font-semibold">Madhushanka Herath</strong>, an Associate Software Engineer based in Sri Lanka with expertise in designing and engineering high-throughput web portals, cross-platform mobile apps, and custom software systems.
            </p>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Currently engineering applications at <span className="font-semibold text-indigo-600 dark:text-indigo-400">Rabbit Solutions Pvt Ltd</span>, I specialize in full-stack JavaScript/TypeScript development (React, Next.js, React Native), PHP/Laravel backend architecture, SQL database modeling (MySQL/PostgreSQL/Supabase), and integrating AI tools to streamline development lifecycles.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Focus</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Full-Stack Development</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Role</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Associate Software Engineer</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Company</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Rabbit Solutions</span>
              </div>
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 text-purple-500 font-bold text-xl mb-6">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3>Education</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                  <span className="text-xs font-semibold text-purple-500">BSc (Hons) Software Engineering</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Rajarata University of Sri Lanka</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Specialized in Full-Stack Web Development, Data Structures, Algorithms, Software Testing & Security.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> High Academic Standing</span>
              <span>Continuous Learner</span>
            </div>
          </motion.div>

          {/* Soft Skills Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-12 glass-card p-8 rounded-3xl space-y-6"
          >
            <div className="flex items-center gap-3 text-emerald-500 font-bold text-xl">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Heart className="w-6 h-6" />
              </div>
              <h3>Soft Skills & Competencies</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {softSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:border-emerald-500/40 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
