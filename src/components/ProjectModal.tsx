"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronLeft, ChevronRight, Layers, Play } from "lucide-react";
import { GithubIcon, YoutubeIcon } from "@/components/Icons";
import Image from "next/image";
import { Project } from "@/types";
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from "@/lib/utils";

interface SlideItem {
  type: "image" | "youtube";
  url: string;
  embedUrl?: string | null;
}

interface ProjectModalProps {
  project: Project | null;
  initialSlideIndex?: number;
  onClose: () => void;
}

export function ProjectModal({ project, initialSlideIndex = 0, onClose }: ProjectModalProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(initialSlideIndex);

  useEffect(() => {
    setActiveSlideIndex(initialSlideIndex);
  }, [initialSlideIndex, project]);

  // Lock background body scroll and hide navigation bar when modal is open
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    };
  }, [project]);

  // Handle keyboard arrow & escape navigation
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevSlide();
      if (e.key === "ArrowRight") handleNextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, activeSlideIndex]);

  if (!project) return null;

  // Prepare slides array (Images 1..N + YouTube Video as final slide)
  const imageSlides: SlideItem[] = (project.images && project.images.length > 0
    ? project.images
    : ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"]
  ).map((url) => ({ type: "image", url }));

  const youtubeEmbedUrl = getYoutubeEmbedUrl(project.youtube_url);
  const youtubeThumbnail = getYoutubeThumbnailUrl(project.youtube_url);

  const slides: SlideItem[] = [...imageSlides];
  if (youtubeEmbedUrl && youtubeThumbnail) {
    slides.push({
      type: "youtube",
      url: youtubeThumbnail,
      embedUrl: youtubeEmbedUrl,
    });
  }

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/10 my-4 flex flex-col max-h-[92vh] transition-colors duration-300 z-[101]"
        >
          {/* Prominent High-Z Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-red-600 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 border border-white/20"
            aria-label="Close full screen modal"
          >
            <X className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Close</span>
          </button>

          {/* Full Screen Media Display (Image or Embed YouTube Video) */}
          <div className="relative w-full h-[45vh] sm:h-[58vh] bg-slate-900 dark:bg-slate-950 overflow-hidden flex items-center justify-center shrink-0">
            {currentSlide.type === "image" ? (
              <div className="relative w-full h-full">
                <Image
                  src={currentSlide.url}
                  alt={`${project.title} full size preview`}
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                {currentSlide.embedUrl ? (
                  <iframe
                    src={`${currentSlide.embedUrl}?autoplay=1`}
                    title={`${project.title} YouTube Video`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-white text-sm">Video Unavailable</div>
                )}
              </div>
            )}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-all backdrop-blur-md border border-white/10 hover:scale-110"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-all backdrop-blur-md border border-white/10 hover:scale-110"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Slide Index Counter & Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeSlideIndex
                      ? s.type === "youtube"
                        ? "bg-red-500 w-6"
                        : "bg-indigo-500 w-6"
                      : "bg-white/40 hover:bg-white/70 w-2"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="text-xs font-semibold text-slate-300 ml-2">
                {activeSlideIndex + 1} / {slides.length}
              </span>
            </div>
          </div>

          {/* Details & Links Footer Drawer */}
          <div className="p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {project.category}
                  </span>
                  {currentSlide.type === "youtube" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/90 text-white flex items-center gap-1">
                      <Play className="w-3 h-3 fill-white" /> Playing YouTube Video
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {project.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <GithubIcon className="w-4 h-4" /> GitHub Code
                  </a>
                )}
                {project.youtube_url && (
                  <a
                    href={project.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-red-500/20 transition-all"
                  >
                    <YoutubeIcon className="w-4 h-4" /> YouTube Channel Link
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" /> Project Details
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-300 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
