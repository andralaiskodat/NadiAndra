"use client";
 
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
 
const EMOJIS = ["💖", "✨", "🌸", "☁️", "🧸", "🎀", "🎈", "🐥"];
 
export function FloatingBackground() {
  const [elements, setElements] = useState<{ id: number; emoji: string; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  const [blobs, setBlobs] = useState<{ id: number; color: string; scale: number; x: number; y: number; duration: number }[]>([]);
 
  useEffect(() => {
    // Generate random floating elements only on client side to avoid hydration mismatch
    const newElements = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 24 + 14, // 14px to 38px
      duration: Math.random() * 12 + 18, // 18s to 30s
      delay: Math.random() * -25, // Negative delay so they start at different points
    }));
    setElements(newElements);

    // Dynamic glass blobs that move in the background
    const newBlobs = [
      { id: 1, color: "bg-purple-300/30 dark:bg-purple-800/10", scale: 1.5, x: 20, y: 30, duration: 25 },
      { id: 2, color: "bg-pink-300/25 dark:bg-pink-800/10", scale: 1.8, x: 80, y: 20, duration: 30 },
      { id: 3, color: "bg-teal-200/20 dark:bg-teal-800/10", scale: 1.4, x: 50, y: 70, duration: 28 },
    ];
    setBlobs(newBlobs);
  }, []);
 
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {/* Background blobs for depth */}
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute rounded-full filter blur-[80px] md:blur-[120px] ${blob.color}`}
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: "350px",
            height: "350px",
          }}
          animate={{
            x: ["0%", "15%", "-10%", "0%"],
            y: ["0%", "-20%", "15%", "0%"],
            scale: [blob.scale, blob.scale * 1.2, blob.scale * 0.9, blob.scale],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating emojis */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute opacity-25 dark:opacity-15 select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
          }}
          animate={{
            y: ["0%", "-120vh"],
            x: ["0%", `${Math.sin(el.id) * 30}px`, `${Math.sin(el.id) * -30}px`, "0%"],
            rotate: [0, 90, -90, 360],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}
