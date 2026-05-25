"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Upload, Loader2, CalendarDays, CheckCircle2, ListTodo, Trash2, Camera, Calendar, ArrowRight, Undo } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface BucketItem {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completed_at: string | null;
  image_url: string | null;
  created_at: string;
}

export default function BucketList() {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  
  // Add item form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Complete item form states
  const [completingItem, setCompletingItem] = useState<BucketItem | null>(null);
  const [completeFile, setCompleteFile] = useState<File | null>(null);
  const [completePreview, setCompletePreview] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bucket_list")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error("Error fetching bucket list:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newTitle) {
      setErrorMsg("Judul wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("bucket_list")
        .insert({
          title: newTitle,
          description: newDesc || null,
          completed: false,
        })
        .select();

      if (error) throw error;

      setIsAddModalOpen(false);
      setNewTitle("");
      setNewDesc("");
      await fetchItems();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menambahkan rencana.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Apakah kamu yakin ingin menghapus rencana ini dari Bucket List?")) return;
    
    try {
      const { error } = await supabase
        .from("bucket_list")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleCompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompleteFile(file);
    setCompletePreview(URL.createObjectURL(file));
  };

  const handleSelesaikanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingItem) return;
    setCompleteError("");
    setCompleting(true);

    try {
      let image_url: string | null = null;

      // Upload souvenir photo if attached
      if (completeFile) {
        const fileExt = completeFile.name.split(".").pop();
        const fileName = `souvenir-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("bucket-list-photos")
          .upload(filePath, completeFile);

        if (uploadError) throw new Error("Gagal mengunggah foto: " + uploadError.message);

        const { data: urlData } = supabase.storage
          .from("bucket-list-photos")
          .getPublicUrl(filePath);

        image_url = urlData.publicUrl;
      }

      // Update in Supabase
      const { error: updateError } = await supabase
        .from("bucket_list")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          image_url,
        })
        .eq("id", completingItem.id);

      if (updateError) throw updateError;

      // Reset states
      setCompletingItem(null);
      setCompleteFile(null);
      setCompletePreview(null);
      await fetchItems();
    } catch (err: any) {
      setCompleteError(err.message || "Terjadi kesalahan.");
    } finally {
      setCompleting(false);
    }
  };

  const handleUndoComplete = async (item: BucketItem) => {
    if (!confirm("Ubah kembali status rencana ini menjadi Belum Selesai?")) return;

    try {
      const { error } = await supabase
        .from("bucket_list")
        .update({
          completed: false,
          completed_at: null,
          image_url: null,
        })
        .eq("id", item.id);

      if (error) throw error;
      await fetchItems();
    } catch (err) {
      console.error("Error undoing item status:", err);
    }
  };

  const pendingItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-gradient tracking-tight">
          Daftar Keinginan Bersama
        </h1>
        <p className="text-base md:text-lg text-(--color-text-secondary) font-bold max-w-2xl mx-auto">
          Mimpi, petualangan, dan hal-hal luar biasa yang ingin kita capai dan wujudkan bersama di masa depan.
        </p>
      </div>

      {/* Tabs and Add Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-(--color-glass-border) pb-4">
        {/* Toggle buttons */}
        <div className="flex bg-white/30 backdrop-blur-md rounded-2xl p-1.5 border border-white/40 shadow-sm">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${
              activeTab === "pending"
                ? "bg-(--color-accent) text-(--color-text-primary) shadow-sm"
                : "text-(--color-text-secondary) hover:text-(--color-accent-hover)"
            }`}
          >
            Rencana Kita ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${
              activeTab === "completed"
                ? "bg-(--color-accent) text-(--color-text-primary) shadow-sm"
                : "text-(--color-text-secondary) hover:text-(--color-accent-hover)"
            }`}
          >
            Sudah Tercapai ({completedItems.length})
          </button>
        </div>

        {/* Add item trigger button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="premium-btn flex items-center space-x-2 px-6 py-3 rounded-2xl font-black text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Mimpi Baru</span>
        </button>
      </div>

      {/* Item Display Grid */}
      <div className="space-y-6">
        {loading ? (
          // Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-panel h-36 rounded-3xl animate-pulse bg-white/20 dark:bg-black/5" />
            ))}
          </div>
        ) : activeTab === "pending" ? (
          pendingItems.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-3xl space-y-3">
              <ListTodo className="w-12 h-12 text-(--color-accent-hover) mx-auto opacity-40 animate-float-slow" />
              <p className="font-black text-lg text-(--color-text-primary)">Belum ada rencana nih!</p>
              <p className="text-sm font-bold text-(--color-text-secondary)">Klik "+ Tambah Mimpi Baru" untuk merancang petualangan baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between space-y-4 hover:shadow-lg hover:scale-[1.01] duration-300"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-(--color-text-primary) tracking-tight">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-(--color-text-secondary) font-bold opacity-80 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setCompletingItem(item)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-xl font-black text-xs hover:bg-emerald-200 hover:scale-105 active:scale-95 transition-all border border-emerald-200 dark:border-emerald-900"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesaikan!</span>
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                      title="Hapus Rencana"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          completedItems.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-3xl space-y-3">
              <Camera className="w-12 h-12 text-(--color-accent-hover) mx-auto opacity-40 animate-float-slow" />
              <p className="font-black text-lg text-(--color-text-primary)">Belum ada memori tercapai</p>
              <p className="text-sm font-bold text-(--color-text-secondary)">Ayo wujudkan rencana-rencana seru kalian berdua!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white/50 dark:bg-black/10 p-4 pb-6 rounded-[2rem] border border-white/50 hover:bg-white/80 transition-all duration-400 shadow-md hover:shadow-xl flex flex-col justify-between"
                  style={{
                    boxShadow: "0 10px 30px -15px rgba(76, 29, 149, 0.1)"
                  }}
                >
                  {/* Polaroid Image */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 border border-black/5">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-(--color-text-secondary)/60 p-4 text-center space-y-1">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 fill-emerald-100" />
                        <span className="text-xs font-black pt-1">Sudah Tercapai!</span>
                      </div>
                    )}
                    {item.completed_at && (
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-xl text-[10px] font-bold flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(item.completed_at), "dd MMM yyyy")}</span>
                      </div>
                    )}
                  </div>

                  {/* Polaroid Footer Info */}
                  <div className="pt-5 px-1 flex flex-col justify-between flex-1">
                    <div className="space-y-1 mb-4">
                      <h3 className="text-base font-black text-(--color-text-primary) tracking-tight group-hover:text-(--color-accent-hover) transition-colors truncate">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-(--color-text-secondary) font-bold opacity-75 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t border-black/5 pt-3">
                      <button
                        onClick={() => handleUndoComplete(item)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-(--color-accent-hover) font-bold text-xs transition-colors"
                        title="Ubah Jadi Belum Selesai"
                      >
                        <Undo className="w-3.5 h-3.5" />
                        <span>Batalkan</span>
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* MODAL 1: ADD BUCKET LIST ITEM */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-[100]"
              onClick={() => setIsAddModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-md glass-panel rounded-[2.5rem] p-8 relative overflow-hidden">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 transition-colors text-(--color-text-secondary)"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 flex items-center space-x-3">
                  <div className="p-2.5 bg-(--color-bg-secondary) rounded-xl">
                    <ListTodo className="w-5 h-5 text-(--color-accent-hover)" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-(--color-text-primary)">Mimpi Baru</h2>
                    <p className="text-(--color-text-secondary) text-xs font-bold mt-0.5">Tulis sesuatu yang ingin diwujudkan bersama</p>
                  </div>
                </div>

                <form onSubmit={handleAddItem} className="space-y-5">
                  <div>
                    <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1">
                      Apa keinginan kita? <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="mis. Liburan ke Pulau Komodo"
                      className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1">
                      Keterangan / Detail (Opsional)
                    </label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Tulis detail singkat atau kenapa kita ingin melakukan ini..."
                      className="w-full h-24 bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold text-center">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 premium-btn font-black py-4.5 rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Menyimpan Rencana...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Simpan Rencana</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-6 py-4.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:opacity-80 transition-opacity"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL 2: UPLOAD COMPLETION PHOTO */}
      <AnimatePresence>
        {completingItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-[100]"
              onClick={() => { setCompletingItem(null); setCompleteFile(null); setCompletePreview(null); }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-md glass-panel rounded-[2.5rem] p-8 relative overflow-hidden">
                <button
                  onClick={() => { setCompletingItem(null); setCompleteFile(null); setCompletePreview(null); }}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 transition-colors text-(--color-text-secondary)"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-(--color-text-primary)">Hore, Tercapai! 🎉</h2>
                    <p className="text-(--color-text-secondary) text-xs font-bold mt-0.5">Mari unggah foto bukti keseruan momen ini</p>
                  </div>
                </div>

                <form onSubmit={handleSelesaikanSubmit} className="space-y-5">
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-500 uppercase tracking-widest mb-1">Mimpi Yang Terwujud:</p>
                    <p className="text-base font-black text-(--color-text-primary)">{completingItem.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-(--color-text-secondary) mb-2 ml-1">
                      Unggah Foto Kenangan (Opsional)
                    </label>
                    <div
                      className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-(--color-accent)/70 overflow-hidden cursor-pointer hover:bg-white/40 bg-white/20 dark:bg-black/5 transition-colors flex items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {completePreview ? (
                        <img
                          src={completePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-(--color-text-secondary) p-6 text-center">
                          <Upload className="w-8 h-8 text-(--color-accent-hover)" />
                          <span className="text-sm font-bold">Pilih foto momen seru</span>
                          <span className="text-xs opacity-60">JPG, PNG, WEBP</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCompleteChange}
                      className="hidden"
                    />
                    {completePreview && (
                      <button
                        type="button"
                        onClick={() => { setCompleteFile(null); setCompletePreview(null); }}
                        className="mt-2 text-xs font-bold text-red-500 hover:underline ml-1"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>

                  {completeError && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold text-center">
                      {completeError}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={completing}
                      className="flex-1 premium-btn font-black py-4.5 rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {completing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Menyelesaikan...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Selesaikan Rencana!</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCompletingItem(null); setCompleteFile(null); setCompletePreview(null); }}
                      className="px-6 py-4.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:opacity-80 transition-opacity"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
