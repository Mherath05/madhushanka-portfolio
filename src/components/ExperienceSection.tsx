"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Experience } from "@/types";
import { fetchExperiences } from "@/lib/data/store";
import { Briefcase, Calendar, Building2 } from "lucide-react";

export function ExperienceSection() {
  const [experiencesList, setExperiencesList] = useState<Experience[]>([]);

  useEffect(() => {
    async function loadExperiences() {
      const data = await fetchExperiences();
      setExperiencesList(data);
    }
    loadExperiences();
  }, []);

  return (
    <section id="experience" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            Career Progression
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            My professional timeline as a software engineer delivering impact at Rabbit Solutions Pvt Ltd.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-300 dark:to-slate-800 -translate-x-1/2 hidden sm:block" />

          <div className="space-y-12">
            {experiencesList.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative flex flex-col sm:flex-row items-center ${isEven ? "sm:flex-row-reverse" : ""
                    }`}
                >
                  {/* Timeline Center Badge */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 z-20">
                    <Briefcase className="w-5 h-5" />
                  </div>

                  {/* Experience Card */}
                  <div className={`w-full sm:w-[calc(50%-2.5rem)] glass-card p-6 sm:p-8 rounded-3xl space-y-4 ${isEven ? "sm:text-right" : "sm:text-left"
                    }`}>
                    {/* Period Badge */}
                    <div className={`flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider ${isEven ? "sm:justify-end" : "sm:justify-start"
                      }`}>
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                      {exp.is_current && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px]">
                          Present Role
                        </span>
                      )}
                    </div>

                    {/* Role & Company */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <div className={`flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 ${isEven ? "sm:justify-end" : "sm:justify-start"
                        }`}>
                        <Building2 className="w-4 h-4 text-purple-500" />
                        <span>{exp.company}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    <div className={`pt-2 flex flex-wrap gap-2 ${isEven ? "sm:justify-end" : "sm:justify-start"
                      }`}>
                      <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300">
                        React / Next.js
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300">
                        PHP / MySQL
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300">
                        React Native
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
