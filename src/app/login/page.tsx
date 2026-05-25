"use client";

import { useState } from "react";
import { Heart, KeyRound, ArrowRight, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="w-full max-w-md glass-panel p-8 md:p-10 rounded-[3rem] relative overflow-hidden"
      >
        {/* Floating Heart Background */}
        <div className="absolute -top-12 -right-12 text-purple-300/30 dark:text-purple-600/10 pointer-events-none animate-float-slow">
          <Heart className="w-44 h-44 fill-current" />
        </div>
        <div className="absolute -bottom-12 -left-12 text-pink-300/20 dark:text-pink-600/10 pointer-events-none animate-float-slow" style={{ animationDelay: "2s" }}>
          <Heart className="w-36 h-36 fill-current" />
        </div>

        {/* Brand & Heading */}
        <div className="relative z-10 text-center space-y-3 mb-8 group">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-3xl mb-2 shadow-md border border-white/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gradient tracking-tight">
            Ruang Rahasia Kita
          </h1>
          <p className="text-sm md:text-base text-(--color-text-secondary) font-bold">
            Masuk untuk mengakses seluruh kenangan kita
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="relative z-10 space-y-5">
          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm font-bold text-center animate-wobble"
            >
              {error}
            </motion.div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-black text-(--color-text-secondary) ml-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-(--color-text-secondary) opacity-70">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-(--color-text-primary) font-bold placeholder:text-(--color-text-secondary)/40 focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:border-transparent transition-all shadow-sm"
                placeholder="email@kamudanaku.com"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-black text-(--color-text-secondary) ml-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-(--color-text-secondary) opacity-70">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-(--color-text-primary) font-bold placeholder:text-(--color-text-secondary)/40 focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:border-transparent transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 premium-btn flex items-center justify-center space-x-2 py-4 rounded-2xl font-black text-lg disabled:opacity-50"
          >
            <span>{loading ? "Membuka Ruangan..." : "Masuk"}</span>
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
