"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Heart, Eye, Lock, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export function Footer() {
  const [visitorCount, setVisitorCount] = useState<number>(1420);

  useEffect(() => {
    const currentCount = parseInt(localStorage.getItem("visitor_count") || "1420", 10);
    const newCount = currentCount + 1;
    localStorage.setItem("visitor_count", newCount.toString());
    setVisitorCount(newCount);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-slate-200/50 dark:border-white/10 pt-16 pb-8 bg-slate-100/50 dark:bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">

          {/* Left Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base">
                M
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Madhushanka Herath
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Full Stack Software Engineer specializing in modern JavaScript, TypeScript, Next.js 15, PHP, React Native, and AI integrations.
            </p>

            {/* Visitor Counter */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-indigo-500/20 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Visitor Counter: <strong className="text-indigo-600 dark:text-indigo-400">{visitorCount.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#hero" className="hover:text-indigo-500 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-indigo-500 transition-colors">About Me</a></li>
              <li><a href="#skills" className="hover:text-indigo-500 transition-colors">Skills</a></li>
              <li><a href="#projects" className="hover:text-indigo-500 transition-colors">Projects</a></li>
              <li><a href="#experience" className="hover:text-indigo-500 transition-colors">Experience</a></li>
              <li><a href="#contact" className="hover:text-indigo-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Social & Admin Portal */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Connect & Admin
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Mherath05"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/madhushanka-herath-kumara-a4a294369"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href="mailto:madhushankaherath2@gmail.com"
                className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors"
                aria-label="Email Direct"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-indigo-500 text-xs font-medium transition-colors"
              >
                <Lock className="w-3.5 h-3.5" /> Admin Portal Access
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Madhushanka Herath. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl glass-card hover:text-indigo-500 transition-colors flex items-center gap-1"
          >
            Back to Top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
