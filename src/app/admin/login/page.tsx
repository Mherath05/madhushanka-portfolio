"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      if (!supabase) {
        if (email === "admin@madhushanka.dev" && password === "admin123") {
          localStorage.setItem("admin_auth_demo", "true");
          router.push("/admin/dashboard");
          return;
        }
        setErrorMsg("Supabase credentials not detected. Demo login with: admin@madhushanka.dev / admin123");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">

      {/* Top Bar Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border-slate-200/50 dark:border-white/10 shadow-2xl space-y-6 z-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal Login</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in with your Supabase Admin Credentials
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@madhushanka.dev"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200/50 dark:border-white/10 text-center">
          <Link href="/" className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
            ← Return to Main Portfolio
          </Link>
        </div>

      </div>
    </div>
  );
}
