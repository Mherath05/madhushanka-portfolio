"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types";
import { Eye, Play } from "lucide-react";
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from "@/lib/utils";

interface SlideItem {
  type: "image" | "youtube";
  url: string;
  embedUrl?: string | null;
}

interface ProjectCardImageProps {
  project: Project;
  onOpenLightbox: (project: Project, index: number) => void;
}

export function ProjectCardImage({ project, onOpenLightbox }: ProjectCardImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Auto-rotate every 4000ms (4 seconds)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onOpenLightbox(project, currentIndex)}
      className="relative w-full h-56 bg-slate-950 overflow-hidden cursor-pointer group"
    >
      {/* Current Slide Display */}
      {currentSlide.type === "image" ? (
        <Image
          src={currentSlide.url}
          alt={`${project.title} slide ${currentIndex + 1}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={currentSlide.url}
            alt={`${project.title} youtube preview`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90"
          />
          {/* YouTube Overlay Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
            <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 fill-white ml-1" />
            </div>
          </div>
        </div>
      )}

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

      {/* Top Category & Slide Badges */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-indigo-300 backdrop-blur-md border border-white/10">
          {project.category}
        </span>

        {currentSlide.type === "youtube" ? (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-lg">
            <Play className="w-3 h-3 fill-white" /> YouTube Video
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900/80 text-slate-300 backdrop-blur-md border border-white/10">
            {currentIndex + 1} / {slides.length}
          </span>
        )}
      </div>

      {/* Hover Trigger Overlay Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-indigo-950/40 backdrop-blur-sm transition-opacity duration-300">
        <span className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-2xl hover:scale-105 transition-transform">
          <Eye className="w-4 h-4 text-indigo-600" /> Fullscreen View
        </span>
      </div>

      {/* Bottom Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? s.type === "youtube"
                    ? "bg-red-500 w-5"
                    : "bg-indigo-500 w-5"
                  : "bg-white/40 hover:bg-white/70 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
