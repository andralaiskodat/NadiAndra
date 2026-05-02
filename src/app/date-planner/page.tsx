"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CalendarHeart, RefreshCw } from "lucide-react";

const DATE_IDEAS = [
  "Maraton film dengan camilan favorit",
  "Jalan-jalan malam tanpa tujuan",
  "Masak resep baru bersama",
  "Piknik di taman kota",
  "Kunjungi galeri seni atau museum",
  "Malam main game arcade",
  "Melihat bintang di atap",
  "DIY tembikar atau melukis di rumah",
  "Keliling kedai kopi",
  "Bikin tenda selimut",
];

export default function DatePlanner() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string>("Klik untuk pilih kencan!");

  const pickRandomDate = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedDate(null);
    
    let spins = 0;
    const maxSpins = 20;
    const intervalTime = 100;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * DATE_IDEAS.length);
      setCurrentDisplay(DATE_IDEAS[randomIndex]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        setSelectedDate(DATE_IDEAS[randomIndex]);
      }
    }, intervalTime);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-2xl mx-auto text-center">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-(--color-text-primary) tracking-tight">
          Perencana Kencan
        </h1>
        <p className="text-lg text-(--color-text-secondary)">
          Tidak tahu mau ngapain? Biar takdir yang memutuskan.
        </p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[3rem] relative overflow-hidden transform transition-transform hover:scale-[1.02]">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 text-(--color-accent) opacity-20 animate-wobble">
          <CalendarHeart className="w-40 h-40" />
        </div>
        
        <div className="relative z-10 space-y-8 flex flex-col items-center">
          <div className="h-40 flex items-center justify-center p-6 bg-white/40 dark:bg-black/20 rounded-3xl w-full border-2 border-dashed border-(--color-accent)">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDisplay}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`text-2xl md:text-3xl font-black ${
                  selectedDate ? "text-(--color-accent-hover) animate-bounce" : "text-(--color-text-secondary)"
                }`}
              >
                {currentDisplay}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={pickRandomDate}
            disabled={isSpinning}
            className={`
              relative group flex items-center space-x-3 px-8 py-4 rounded-full font-black text-xl
              transition-all duration-300 transform
              ${isSpinning ? "opacity-50 scale-95" : "hover:scale-110 hover:-translate-y-2 hover:shadow-[0_8px_0_0_var(--color-accent-hover)] shadow-[0_4px_0_0_var(--color-accent-hover)] active:translate-y-2 active:shadow-none"}
              bg-(--color-accent) text-(--color-text-primary) border-2 border-(--color-accent-hover)
            `}
          >
            {isSpinning ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6 group-hover:animate-wobble" />
            )}
            <span>{isSpinning ? "Memilih..." : "Pilih Kencan!"}</span>
          </button>
        </div>
      </div>

      <div className="text-left glass-panel p-6 rounded-3xl mt-12">
        <h3 className="text-xl font-bold text-(--color-text-primary) mb-4">Daftar Ide Kencan Kita</h3>
        <ul className="space-y-2">
          {DATE_IDEAS.map((idea, i) => (
            <li key={i} className="flex items-center space-x-3 text-(--color-text-secondary)">
              <div className="w-2 h-2 rounded-full bg-(--color-accent)" />
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
