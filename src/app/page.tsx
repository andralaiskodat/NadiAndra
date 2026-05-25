"use client";

import { useEffect, useState } from "react";
import { RelationshipCounter } from "@/components/RelationshipCounter";
import { Camera, CalendarHeart, Clock, Image as ImageIcon, Heart, ListTodo } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

const features = [
  { 
    name: "Photo Booth", 
    description: "Abadikan foto lucu bersama secara instan", 
    href: "/photo-booth", 
    icon: Camera,
    color: "from-pink-400 to-rose-400"
  },
  { 
    name: "Perencana Kencan", 
    description: "Pilih aktivitas kencan seru secara acak", 
    href: "/date-planner", 
    icon: CalendarHeart,
    color: "from-violet-400 to-indigo-400"
  },
  { 
    name: "Kapsul Waktu", 
    description: "Pesan rahasia untuk dibuka di masa depan", 
    href: "/time-capsule", 
    icon: Clock,
    color: "from-amber-400 to-orange-400"
  },
  { 
    name: "Kenangan Kita", 
    description: "Arsip dan galeri foto-foto kencan favorit kita", 
    href: "/archive", 
    icon: ImageIcon,
    color: "from-emerald-400 to-teal-400"
  },
  { 
    name: "Daftar Keinginan", 
    description: "Wujudkan mimpi dan petualangan seru bersama", 
    href: "/bucket-list", 
    icon: ListTodo,
    color: "from-cyan-400 to-blue-400"
  },
];

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [greeting, setGreeting] = useState("Selamat datang di dunia kita");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .limit(2);
        
        if (!error && data) {
          setProfiles(data);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };
    fetchProfiles();

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting("Selamat Pagi, Sayang! ☀️");
    } else if (hour >= 11 && hour < 15) {
      setGreeting("Selamat Siang, Manis! 🌸");
    } else if (hour >= 15 && hour < 18) {
      setGreeting("Selamat Sore, Cantik! 🌇");
    } else {
      setGreeting("Selamat Malam, Cinta! ✨");
    }
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-10">
      {/* Dynamic Greetings & Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-gradient tracking-tight drop-shadow-sm leading-tight">
          {greeting}
        </h1>
        <p className="text-base md:text-lg text-(--color-text-secondary) font-bold max-w-2xl mx-auto">
          Tempat spesial untuk menyimpan kenangan manis, rencana petualangan, dan janji cinta kita.
        </p>
      </div>

      {/* Avatars Connection Display */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        className="flex justify-center items-center py-4"
      >
        <div className="flex items-center space-x-6 md:space-x-10 bg-white/30 backdrop-blur-md rounded-full px-8 py-4 border border-white/40 shadow-sm">
          {/* Partner 1 */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-(--color-accent) bg-white/50 shadow-md flex items-center justify-center">
              {profiles[0]?.avatar_url ? (
                <img src={profiles[0].avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl font-black text-(--color-text-primary)">
                  {profiles[0]?.full_name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <span className="text-xs md:text-sm font-black text-(--color-text-primary)">
              {profiles[0]?.full_name || "Kamu"}
            </span>
          </div>

          {/* Connected Beating Heart */}
          <div className="flex flex-col items-center">
            <Heart className="w-7 h-7 text-rose-500 fill-current animate-heartbeat" />
            <div className="h-0.5 w-12 md:w-16 bg-gradient-to-r from-(--color-accent) to-pink-300 mt-1.5" />
          </div>

          {/* Partner 2 */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-pink-300 bg-white/50 shadow-md flex items-center justify-center">
              {profiles[1]?.avatar_url ? (
                <img src={profiles[1].avatar_url} alt="Partner" className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl font-black text-(--color-text-primary)">
                  {profiles[1]?.full_name?.charAt(0) || "P"}
                </div>
              )}
            </div>
            <span className="text-xs md:text-sm font-black text-(--color-text-primary)">
              {profiles[1]?.full_name || "Pasangan"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Relationship Counter */}
      <RelationshipCounter />

      {/* Grid Menu Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 120 }}
            >
              <Link
                href={feature.href}
                className="group block glass-panel p-6 rounded-[2.5rem] hover:bg-white/60 dark:hover:bg-black/15 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.025]"
              >
                <div className="flex items-center space-x-5">
                  <div className={`p-4 bg-gradient-to-br ${feature.color} text-white rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-md border border-white/20`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-(--color-text-primary) mb-1 group-hover:text-(--color-accent-hover) transition-colors">
                      {feature.name}
                    </h3>
                    <p className="text-sm md:text-base text-(--color-text-secondary) font-bold opacity-80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer message */}
      <div className="text-center mt-12 pb-6">
        <p className="text-xs md:text-sm text-(--color-text-secondary) font-bold flex items-center justify-center space-x-2 opacity-80">
          <span>Dibuat penuh dengan</span>
          <Heart className="w-4 h-4 text-rose-500 fill-current animate-heartbeat" />
          <span>untuk kebahagiaan kita</span>
        </p>
      </div>
    </div>
  );
}
