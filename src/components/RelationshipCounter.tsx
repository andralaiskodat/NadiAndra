"use client";

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// For demo purposes, we set a start date. Later this can come from Supabase.
const START_DATE = new Date("2023-01-01T00:00:00"); // Replace with actual date

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
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="glass-panel p-8 rounded-[2.5rem] text-center space-y-6 relative overflow-hidden"
    >
      <div className="absolute -top-10 -left-10 text-(--color-accent) opacity-20 animate-wobble">
        <Heart className="w-32 h-32 fill-current" />
      </div>
      <div className="absolute -bottom-10 -right-10 text-(--color-accent) opacity-20 animate-wobble" style={{ animationDelay: '1s' }}>
        <Heart className="w-32 h-32 fill-current" />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-black text-(--color-text-primary) mb-2">
          Kita sudah bersama selama
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {timeBlocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
              className="bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-3xl p-4 shadow-sm border-2 border-(--color-accent) hover:bg-white/80 transition-colors transform hover:-translate-y-2 hover:scale-105 duration-300"
            >
              <motion.div 
                key={block.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-black text-(--color-text-primary)"
              >
                {block.value.toString().padStart(2, "0")}
              </motion.div>
              <div className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider mt-1">
                {block.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
