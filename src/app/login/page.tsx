"use client";

import { useState } from "react";
import { Heart, KeyRound, ArrowRight } from "lucide-react";
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
        // Redirect to home or refresh
        window.location.href = "/";
      }
    } catch (err: any) {
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in duration-700">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-[3rem] relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 text-(--color-accent) opacity-20 animate-float-slow">
          <Heart className="w-40 h-40 fill-current" />
        </div>

        <div className="relative z-10 text-center space-y-2 mb-8 group">
          <div className="inline-flex p-4 bg-(--color-bg-secondary) rounded-3xl mb-2 border-2 border-(--color-accent) group-hover:animate-wobble transition-transform">
            <KeyRound className="w-8 h-8 text-(--color-accent-hover)" />
          </div>
          <h1 className="text-3xl font-black text-(--color-text-primary) tracking-tight">
            Ruang Rahasia Kita
          </h1>
          <p className="text-(--color-text-secondary) font-bold">
            Masuk untuk mengakses kenangan kita
          </p>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 space-y-4">
          {error && (
            <div className="p-4 bg-red-100 text-red-600 rounded-2xl border-2 border-red-300 text-sm font-bold text-center animate-wobble">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-2xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-2xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 group flex items-center justify-center space-x-2 bg-(--color-accent) hover:bg-(--color-accent-hover) text-(--color-text-primary) px-6 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
          >
            <span>{loading ? "Memasuki..." : "Masuk"}</span>
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
