"use client";

import { useState } from "react";
import { Lock, Unlock, Send, Clock, KeyRound } from "lucide-react";
import { format, isPast, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const MOCK_CAPSULES = [
  {
    id: 1,
    title: "Untuk kita, 1 tahun lagi",
    message: "Semoga kita masih baik-baik saja dan mengenang ini dengan tertawa!",
    unlockDate: new Date(Date.now() - 100000000), // Tanggal lampau
  },
  {
    id: 2,
    title: "Harapan Anniversari Kita",
    message: "Ini adalah pesan rahasia yang hanya bisa kamu baca saat anniversari kita.",
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
    <div className="space-y-12 animate-in fade-in duration-700 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-(--color-text-primary) tracking-tight">
          Kapsul Waktu
        </h1>
        <p className="text-lg text-(--color-text-secondary)">
          Tulis pesan untuk diri kita di masa depan. Akan terkunci sampai tanggal yang dipilih.
        </p>
      </div>

      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full glass-panel border-dashed border-2 border-(--color-accent) p-6 rounded-3xl text-(--color-accent-hover) font-bold text-lg hover:bg-white/50 transition-colors flex justify-center items-center space-x-2"
        >
          <KeyRound className="w-6 h-6" />
          <span>Kubur Kapsul Baru</span>
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-panel p-6 rounded-3xl space-y-4"
          onSubmit={handleCreate}
        >
          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1">Judul</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
              placeholder="mis. Target Tahun Depan"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1">Pesan Rahasia</label>
            <textarea
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full h-32 bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent) resize-none"
              placeholder="Tulis pesan rahasiamu di sini..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1">Tanggal Buka</label>
            <input
              type="date"
              required
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-(--color-accent) hover:bg-(--color-accent-hover) text-(--color-text-primary) font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Kunci Kapsulnya</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:opacity-80 transition-opacity"
            >
              Batal
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4 mt-12">
        <h3 className="text-2xl font-bold text-(--color-text-primary) mb-6">Kapsul Tersimpan</h3>
        {capsules.map((capsule) => {
          const unlocked = isPast(capsule.unlockDate);
          const isOpened = openedCapsuleId === capsule.id;

          return (
            <motion.div
              key={capsule.id}
              layout
              className={`glass-panel rounded-3xl overflow-hidden transition-all duration-300 ${
                unlocked ? "cursor-pointer hover:bg-white/40 border-(--color-accent)" : "opacity-80"
              }`}
              onClick={() => handleOpenCapsule(capsule)}
            >
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-(--color-text-primary)">
                    {capsule.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-(--color-text-secondary) mt-2 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Dibuka pada {format(capsule.unlockDate, "PPP")}</span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl border-2 transition-transform duration-300 ${unlocked ? "bg-(--color-accent) border-(--color-accent-hover) group-hover:rotate-12" : "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:animate-wobble"}`}>
                  {unlocked ? (
                    <Unlock className="w-6 h-6 text-(--color-text-primary)" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isOpened && unlocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 border-t border-(--color-glass-border) mt-4 pt-4"
                  >
                    <p className="text-(--color-text-primary) whitespace-pre-wrap leading-relaxed font-serif text-lg italic">
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
