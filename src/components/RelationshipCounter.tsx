"use client";

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// For demo purposes, we set a start date. Later this can come from Supabase.
const START_DATE = new Date("2024-06-18T00:00:00"); // Tanggal mulai jadian: 18 Juni 2024

export function RelationshipCounter() {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();
      setTimeTogether({
        days: differenceInDays(now, START_DATE),
        hours: differenceInHours(now, START_DATE) % 24,
        minutes: differenceInMinutes(now, START_DATE) % 60,
        seconds: differenceInSeconds(now, START_DATE) % 60,
      });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: "Hari", value: timeTogether.days },
    { label: "Jam", value: timeTogether.hours },
    { label: "Menit", value: timeTogether.minutes },
    { label: "Detik", value: timeTogether.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.2 }}
      className="glass-panel p-8 md:p-10 rounded-[3rem] text-center space-y-6 relative overflow-hidden"
    >
      <div className="absolute -top-10 -left-10 text-(--color-accent) opacity-10 animate-float-slow">
        <Heart className="w-36 h-36 fill-current" />
      </div>
      <div className="absolute -bottom-10 -right-10 text-(--color-accent) opacity-10 animate-float-slow" style={{ animationDelay: '2.5s' }}>
        <Heart className="w-36 h-36 fill-current" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Heart className="w-6 h-6 text-red-500 fill-current animate-heartbeat" />
          <h2 className="text-2xl md:text-3xl font-black text-gradient">
            Kita Sudah Bersama Selama
          </h2>
          <Heart className="w-6 h-6 text-red-500 fill-current animate-heartbeat" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {timeBlocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 120 }}
              className="bg-white/40 dark:bg-black/10 backdrop-blur-md rounded-3xl p-5 border border-white/40 hover:bg-white/70 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              style={{
                boxShadow: "0 8px 25px -10px rgba(76, 29, 149, 0.08)"
              }}
            >
              <motion.div 
                key={block.value}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-black text-(--color-text-primary) tracking-tight"
              >
                {block.value.toString().padStart(2, "0")}
              </motion.div>
              <div className="text-xs md:text-sm font-black text-(--color-text-secondary) uppercase tracking-widest mt-2">
                {block.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
