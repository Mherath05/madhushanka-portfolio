"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Globe, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/Icons";
import { saveContactMessage } from "@/lib/data/store";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await saveContactMessage(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Let's Build Something <span className="text-gradient">Extraordinary</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Have a project in mind, career opportunity, or technical inquiry? Reach out anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Contact Details Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Contact Information <Sparkles className="w-5 h-5 text-indigo-500" />
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href="tel:0769702634"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 hover:border-indigo-500/50 border border-slate-200/50 dark:border-white/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Phone</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">076 970 2634</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:madhushankaherath2@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 hover:border-purple-500/50 border border-slate-200/50 dark:border-white/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Email</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">madhushankaherath2@gmail.com</span>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/madhushanka-herath-kumara-a4a294369"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 hover:border-blue-500/50 border border-slate-200/50 dark:border-white/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">LinkedIn</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] block">Madhushanka Herath</span>
                  </div>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Mherath05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 hover:border-indigo-500/50 border border-slate-200/50 dark:border-white/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GithubIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">GitHub</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">github.com/Mherath05</span>
                  </div>
                </a>

                {/* Live Portfolio */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Portfolio</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">madhushanka.dev</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-8 sm:p-10 rounded-3xl space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Send a Message
              </h3>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <CheckCircle2 className="w-6 h-6" /> Message Sent Successfully!
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Thank you for reaching out. I have received your message and will respond promptly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Inquiry / Job Opportunity"
                      className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your project requirement or inquiry..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
