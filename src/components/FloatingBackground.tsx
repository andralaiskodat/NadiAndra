"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EMOJIS = ["💖", "✨", "🌸", "☁️", "🧸", "🎀", "🎈", "🐥"];

export function FloatingBackground() {
  const [elements, setElements] = useState<{ id: number; emoji: string; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random floating elements only on client side to avoid hydration mismatch
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 20 + 15, // 15px to 35px
      duration: Math.random() * 10 + 15, // 15s to 25s
      delay: Math.random() * -20, // Negative delay so they start at different points
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute opacity-30 dark:opacity-20"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
          }}
          animate={{
            y: ["0%", "-100%", "0%"],
            x: ["0%", "20%", "-20%", "0%"],
            rotate: [0, 45, -45, 0]
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}
