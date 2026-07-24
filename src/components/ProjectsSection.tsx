"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { fetchProjects } from "@/lib/data/store";
import { Search, ExternalLink, FolderGit2, Sparkles } from "lucide-react";
import { GithubIcon, YoutubeIcon } from "@/components/Icons";
import { ProjectModal } from "./ProjectModal";
import { ProjectCardImage } from "./ProjectCardImage";

const CATEGORIES = [
  "All Projects",
  "Web Applications",
  "Mobile Applications",
  "Desktop Applications",
  "Live Projects",
];

export function ProjectsSection() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All Projects");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [initialSlideIndex, setInitialSlideIndex] = useState<number>(0);

  useEffect(() => {
    async function loadProjects() {
      const data = await fetchProjects();
      setProjectsList(data);
    }
    loadProjects();
  }, []);

  const handleOpenLightbox = (project: Project, index: number) => {
    setSelectedProject(project);
    setInitialSlideIndex(index);
  };

  const filteredProjects = projectsList.filter((project) => {
    const matchesCategory =
      activeCategory === "All Projects"
        ? true
        : activeCategory === "Live Projects"
          ? Boolean(project.live_url)
          : project.category === activeCategory;

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            Featured Engineering Work
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Projects & <span className="text-gradient">Case Studies</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Explore web apps, mobile solutions, desktop software, and live production platforms built with modern technology stacks.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                      : "glass-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or tech..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full glass-card text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project: Project) => {
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Auto-rotating 4s Image & Video Carousel */}
                  <ProjectCardImage
                    project={project}
                    onOpenLightbox={handleOpenLightbox}
                  />

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Technologies Tags */}
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-semibold text-indigo-500 border border-slate-200/50 dark:border-white/5">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Live
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                            >
                              <GithubIcon className="w-3.5 h-3.5" /> Code
                            </a>
                          )}
                          {project.youtube_url && (
                            <a
                              href={project.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1"
                            >
                              <YoutubeIcon className="w-3.5 h-3.5" /> Video
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenLightbox(project, 0)}
                          className="text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1"
                        >
                          Details <Sparkles className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 glass-card rounded-3xl">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No projects found matching your filter criteria.
            </p>
          </div>
        )}

        {/* Modal Component */}
        <ProjectModal
          project={selectedProject}
          initialSlideIndex={initialSlideIndex}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}
