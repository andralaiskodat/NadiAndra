"use client";

import { RelationshipCounter } from "@/components/RelationshipCounter";
import { Camera, CalendarHeart, Clock, Image as ImageIcon, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  { name: "Photo Booth", description: "Foto bareng yang lucu dengan stiker", href: "/photo-booth", icon: Camera },
  { name: "Perencana Kencan", description: "Pilih petualangan kita selanjutnya secara acak", href: "/date-planner", icon: CalendarHeart },
  { name: "Kapsul Waktu", description: "Pesan rahasia untuk masa depan", href: "/time-capsule", icon: Clock },
  { name: "Kenangan Kita", description: "Arsip momen-momen spesial kita", href: "/archive", icon: ImageIcon },
];

export default function Home() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-(--color-text-primary) tracking-tight">
          Selamat Datang di Dunia Kita
        </h1>
        <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
          Tempat spesial hanya untuk kita berdua, menyimpan kenangan, janji, dan cinta kita.
        </p>
      </div>

      <RelationshipCounter />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            >
              <Link
                href={feature.href}
                className="group block glass-panel p-6 rounded-3xl hover:bg-white/60 dark:hover:bg-black/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-4 bg-(--color-bg-secondary) rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm border border-(--color-accent)">
                    <Icon className="w-8 h-8 text-(--color-accent-hover)" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-(--color-text-primary) mb-1 group-hover:text-(--color-accent-hover) transition-colors">
                      {feature.name}
                    </h3>
                    <p className="text-(--color-text-secondary) font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      <div className="text-center mt-12 pb-8">
        <p className="text-(--color-text-secondary) flex items-center justify-center space-x-2">
          <span>Dibuat dengan</span>
          <Heart className="w-4 h-4 text-red-500 fill-current animate-bounce" />
          <span>untuk kita</span>
        </p>
      </div>
    </div>
  );
}
