"use client";

import { useState } from "react";
import { Lock, Unlock, Send, Clock, KeyRound, CalendarDays, Inbox } from "lucide-react";
import { format, isPast, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const MOCK_CAPSULES = [
  {
    id: 1,
    title: "Untuk kita, 1 tahun lagi",
    message: "Semoga kita masih baik-baik saja dan mengenang ini dengan tertawa! Sehat selalu dan lancar terus rezekinya ya sayang.",
    unlockDate: new Date(Date.now() - 100000000), // Tanggal lampau
  },
  {
    id: 2,
    title: "Harapan Anniversary Kita",
    message: "Ini adalah pesan rahasia yang hanya bisa kamu baca saat anniversary kita. Aku ingin berterima kasih karena kamu selalu sabar mendampingiku.",
    unlockDate: addDays(new Date(), 30), // Tanggal mendatang
  }
];

export default function TimeCapsule() {
  const [capsules, setCapsules] = useState(MOCK_CAPSULES);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [openedCapsuleId, setOpenedCapsuleId] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMessage || !unlockDate) return;

    const newCapsule = {
      id: Date.now(),
      title: newTitle,
      message: newMessage,
      unlockDate: new Date(unlockDate),
    };

    setCapsules([newCapsule, ...capsules]);
    setIsCreating(false);
    setNewTitle("");
    setNewMessage("");
    setUnlockDate("");
  };

  const handleOpenCapsule = (capsule: typeof MOCK_CAPSULES[0]) => {
    if (isPast(capsule.unlockDate)) {
      setOpenedCapsuleId(openedCapsuleId === capsule.id ? null : capsule.id);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-gradient tracking-tight">
          Kapsul Waktu
        </h1>
        <p className="text-base md:text-lg text-(--color-text-secondary) font-bold">
          Kirim pesan rahasia untuk diri kita di masa depan. Pesan akan terkunci rapat hingga tanggal yang kamu pilih tiba.
        </p>
      </div>

      {/* Action Trigger / Form */}
      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full glass-panel border-dashed border-2 border-(--color-accent) p-6 rounded-[2rem] text-(--color-accent-hover) font-black text-lg hover:bg-white/40 transition-colors flex justify-center items-center space-x-2"
        >
          <KeyRound className="w-6 h-6 animate-wobble" />
          <span>Kirim & Kubur Kapsul Baru</span>
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-6 md:p-8 rounded-[2.5rem] space-y-5"
          onSubmit={handleCreate}
        >
          <div className="flex justify-between items-center border-b border-(--color-glass-border) pb-3 mb-2">
            <h3 className="text-xl font-black text-(--color-text-primary)">Kapsul Baru</h3>
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Tutup
            </button>
          </div>

          <div>
            <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1">Judul Kapsul</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm"
              placeholder="mis. Harapan Ulang Tahun Kamu"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1">Isi Pesan Rahasia</label>
            <textarea
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full h-36 bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm resize-none"
              placeholder="Tulis apa yang ingin kamu sampaikan di masa depan..."
            />
          </div>
          <div>
            <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1">Kunci Sampai Tanggal</label>
            <div className="relative">
              <input
                type="date"
                required
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 premium-btn font-black py-4.5 rounded-2xl transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Gembok Kapsul Waktu!</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-6 py-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:opacity-80 transition-opacity"
            >
              Batal
            </button>
          </div>
        </motion.form>
      )}

      {/* Capsules Stack */}
      <div className="space-y-5 mt-10">
        <div className="flex items-center space-x-3 border-b border-(--color-glass-border) pb-3 mb-6">
          <div className="p-2 bg-(--color-bg-secondary) rounded-xl">
            <Inbox className="w-5 h-5 text-(--color-accent-hover)" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-(--color-text-primary)">Kapsul Tersimpan</h3>
        </div>

        {capsules.map((capsule) => {
          const unlocked = isPast(capsule.unlockDate);
          const isOpened = openedCapsuleId === capsule.id;

          return (
            <motion.div
              key={capsule.id}
              layout
              className={`glass-panel rounded-3xl overflow-hidden transition-all duration-300 ${
                unlocked 
                  ? "cursor-pointer hover:bg-white/50 shadow-md" 
                  : "opacity-85 shadow-sm"
              }`}
              onClick={() => handleOpenCapsule(capsule)}
            >
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg md:text-xl font-black text-(--color-text-primary)">
                    {capsule.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs md:text-sm text-(--color-text-secondary) font-bold">
                    <CalendarDays className="w-4 h-4 text-(--color-accent-hover)" />
                    <span>Akan terbuka pada {format(capsule.unlockDate, "dd MMMM yyyy")}</span>
                  </div>
                </div>
                
                {/* Lock state badge */}
                <div 
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                    unlocked 
                      ? "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-600 animate-pulse" 
                      : "bg-amber-100 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-600"
                  }`}
                >
                  {unlocked ? (
                    <Unlock className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Reveal logic */}
              <AnimatePresence>
                {isOpened && unlocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 border-t border-(--color-glass-border) pt-5 bg-white/20 dark:bg-black/5"
                  >
                    <p className="text-(--color-text-primary) whitespace-pre-wrap leading-relaxed font-black text-base md:text-lg italic p-4 bg-white/50 dark:bg-black/10 rounded-2xl border border-white/40 shadow-inner">
                      "{capsule.message}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
