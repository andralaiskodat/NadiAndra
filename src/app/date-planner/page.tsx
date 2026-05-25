"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CalendarHeart, RefreshCw, CheckCircle, HeartHandshake } from "lucide-react";

const DATE_IDEAS = [
  "Maraton film dengan camilan favorit 🍿",
  "Jalan-jalan malam tanpa tujuan 🚗",
  "Masak resep baru bersama 🍳",
  "Piknik di taman kota 🧺",
  "Kunjungi galeri seni atau museum 🎨",
  "Malam main game arcade 👾",
  "Melihat bintang di atap 🌟",
  "DIY tembikar atau melukis di rumah 🏺",
  "Keliling kedai kopi ☕",
  "Bikin tenda selimut di ruang tamu ⛺",
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
    <div className="space-y-12 animate-in fade-in duration-700 max-w-2xl mx-auto pb-10">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-gradient tracking-tight">
          Perencana Kencan
        </h1>
        <p className="text-base md:text-lg text-(--color-text-secondary) font-bold">
          Bingung mau jalan-jalan atau kencan ke mana? Biar takdir manis yang memilihkan!
        </p>
      </div>

      {/* Selector Container */}
      <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden text-center">
        {/* Floating Heart Icon */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 text-(--color-accent) opacity-10 animate-float-slow pointer-events-none">
          <CalendarHeart className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 space-y-8 flex flex-col items-center">
          {/* Output Display Board */}
          <div className="h-44 flex items-center justify-center p-6 bg-white/40 dark:bg-black/15 rounded-[2rem] w-full border-2 border-dashed border-(--color-accent)/60 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDisplay}
                initial={{ opacity: 0, y: 15, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -15, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className={`text-xl md:text-3xl font-black px-4 leading-relaxed ${
                  selectedDate ? "text-gradient animate-pulse font-extrabold scale-105" : "text-(--color-text-secondary)"
                }`}
              >
                {currentDisplay}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={pickRandomDate}
            disabled={isSpinning}
            className="premium-btn group flex items-center space-x-3 px-10 py-4.5 rounded-full font-black text-lg md:text-xl disabled:opacity-50"
          >
            {isSpinning ? (
              <RefreshCw className="w-6 h-6 animate-spin text-(--color-text-primary)" />
            ) : (
              <Sparkles className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-transform text-(--color-text-primary)" />
            )}
            <span className="text-(--color-text-primary)">
              {isSpinning ? "Memilih Takdir..." : "Pilih Acak Kencan!"}
            </span>
          </button>
        </div>
      </div>

      {/* Idea List Panel */}
      <div className="glass-panel p-8 rounded-[2.5rem]">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-(--color-bg-secondary) rounded-2xl border border-(--color-accent)/30">
            <HeartHandshake className="w-6 h-6 text-(--color-accent-hover)" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-(--color-text-primary)">
            Daftar Ide Kencan Kita
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DATE_IDEAS.map((idea, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center space-x-3 bg-white/30 dark:bg-black/10 rounded-2xl p-4 border border-white/20 hover:bg-white/50 transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-(--color-accent-hover) flex-shrink-0" />
              <span className="font-bold text-sm md:text-base text-(--color-text-secondary)">
                {idea}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
