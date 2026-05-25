"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Image as ImageIcon, Plus, X, Upload, Loader2, CalendarDays, Link as LinkIcon, CheckCircle2, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Album {
  id: string;
  title: string;
  date: string;
  drive_link: string;
  cover_url: string | null;
  created_at: string;
}

export default function PhotoArchive() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAlbums(data);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setDriveLink("");
    setCoverFile(null);
    setCoverPreview(null);
    setErrorMsg("");
    setSuccessMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title || !date || !driveLink) {
      setErrorMsg("Judul, tanggal, dan link Google Drive wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      let cover_url: string | null = null;

      // Upload cover photo if exists
      if (coverFile) {
        const fileExt = coverFile.name.split(".").pop();
        const fileName = `cover-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("album-covers")
          .upload(fileName, coverFile, { upsert: true });

        if (uploadError) throw new Error("Gagal upload foto: " + uploadError.message);

        const { data: urlData } = supabase.storage
          .from("album-covers")
          .getPublicUrl(fileName);

        cover_url = urlData.publicUrl;
      }

      // Save album data to database
      const { error: insertError } = await supabase.from("albums").insert({
        title,
        date,
        drive_link: driveLink,
        cover_url,
      });

      if (insertError) throw new Error("Gagal menyimpan album: " + insertError.message);

      setSuccessMsg("Album berhasil ditambahkan! 🎉");
      await fetchAlbums();

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-gradient tracking-tight">
          Kenangan Kita
        </h1>
        <p className="text-base md:text-lg text-(--color-text-secondary) font-bold max-w-2xl mx-auto">
          Kumpulan momen manis favorit kebersamaan kita. Klik album untuk menjelajahi seluruh foto di Google Drive.
        </p>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass-panel rounded-[2rem] aspect-[4/5] animate-pulse bg-white/20 dark:bg-black/5"
            />
          ))
        ) : (
          albums.map((album, idx) => (
            <motion.a
              key={album.id}
              href={album.drive_link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="group block bg-white/50 dark:bg-black/10 p-4 pb-6 rounded-[2rem] border border-white/50 hover:bg-white/80 transition-all duration-400 shadow-md hover:shadow-xl transform hover:-translate-y-3 hover:scale-[1.02] flex flex-col justify-between"
              style={{
                boxShadow: "0 10px 30px -15px rgba(76, 29, 149, 0.1)"
              }}
            >
              {/* Cover Card Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 border border-black/5">
                {album.cover_url ? (
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-(--color-text-secondary)">
                    <ImageIcon className="w-16 h-16 opacity-30" />
                  </div>
                )}
                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                
                {/* Open drive indicator */}
                <div className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-md text-(--color-text-primary) rounded-full opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-md">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              {/* Polaroid Footer */}
              <div className="pt-5 px-1 space-y-1">
                <h3 className="text-lg font-black text-(--color-text-primary) tracking-tight group-hover:text-(--color-accent-hover) transition-colors truncate">
                  {album.title}
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-(--color-text-secondary) font-bold">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{album.date}</span>
                </div>
              </div>
            </motion.a>
          ))
        )}

        {/* Add Album Card */}
        {!loading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: albums.length * 0.06 }}
            className="group bg-white/30 hover:bg-white/50 border-dashed border-2 border-(--color-accent) rounded-[2rem] aspect-[4/5] flex flex-col items-center justify-center text-(--color-text-secondary) hover:text-(--color-accent-hover) transition-all duration-400 hover:-translate-y-3 hover:scale-[1.02] shadow-sm cursor-pointer p-6"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="p-4 bg-white/60 dark:bg-black/10 rounded-full mb-4 shadow-sm border border-white/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Plus className="w-8 h-8 text-(--color-accent-hover)" />
            </div>
            <span className="font-black text-base">Tambah Album Baru</span>
            <span className="text-xs font-bold opacity-60 mt-1">Simpan link galeri foto kencan</span>
          </motion.button>
        )}
      </div>

      {/* Modal Container */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-50"
              onClick={closeModal}
            />

            {/* Form Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-lg glass-panel rounded-[2.5rem] p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                <button
                  onClick={closeModal}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 transition-colors text-(--color-text-secondary)"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 flex items-center space-x-3">
                  <div className="p-2.5 bg-(--color-bg-secondary) rounded-xl">
                    <Heart className="w-5 h-5 text-(--color-accent-hover) fill-current animate-heartbeat" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-(--color-text-primary)">Album Kenangan Baru</h2>
                    <p className="text-(--color-text-secondary) text-xs font-bold mt-0.5">Unggah sampul dan masukkan link Google Drive album kalian</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Photo Upload Area */}
                  <div>
                    <label className="block text-sm font-black text-(--color-text-secondary) mb-2 ml-1">
                      Foto Cover Album
                    </label>
                    <div
                      className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-(--color-accent)/70 overflow-hidden cursor-pointer hover:bg-white/40 bg-white/20 dark:bg-black/5 transition-colors flex items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-(--color-text-secondary) p-6 text-center">
                          <Upload className="w-8 h-8 text-(--color-accent-hover)" />
                          <span className="text-sm font-bold">Pilih foto cover terbaik</span>
                          <span className="text-xs opacity-60">JPG, PNG, WEBP</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {coverPreview && (
                      <button
                        type="button"
                        onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                        className="mt-2 text-xs font-bold text-red-500 hover:underline ml-1"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>

                  {/* Album Name */}
                  <div>
                    <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1">
                      Judul Album <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="mis. Liburan Bali 2024"
                      className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm"
                    />
                  </div>

                  {/* Album Date */}
                  <div>
                    <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1 flex items-center space-x-1">
                      <CalendarDays className="w-4 h-4 text-(--color-accent-hover)" />
                      <span>Tanggal Kenangan <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="mis. 15 Agustus 2024"
                      className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm"
                    />
                  </div>

                  {/* GDrive Link */}
                  <div>
                    <label className="block text-sm font-black text-(--color-text-secondary) mb-1.5 ml-1 flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4 text-(--color-accent-hover)" />
                      <span>Link Google Drive <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="url"
                      required
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-white/40 dark:bg-black/10 border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-(--color-text-primary) font-bold focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all shadow-sm"
                    />
                  </div>

                  {/* Error & Success Messages */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold text-center"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                    {successMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{successMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions buttons */}
                  <div className="flex space-x-3 pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 premium-btn font-black py-4.5 rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Menyimpan Album...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Simpan Album</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={submitting}
                      className="px-6 py-4.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:opacity-80 transition-opacity disabled:opacity-50"
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
