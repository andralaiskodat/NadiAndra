"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Image as ImageIcon, Plus, X, Upload, Loader2, CalendarDays, Link as LinkIcon, CheckCircle2 } from "lucide-react";
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

      // Upload foto cover jika ada
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

      // Simpan data album ke database
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-(--color-text-primary) tracking-tight">
          Kenangan Kita
        </h1>
        <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
          Kumpulan momen favorit kita. Klik album untuk melihat semua foto di Google Drive.
        </p>
      </div>

      {/* Grid Album */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass-panel rounded-3xl aspect-square animate-pulse bg-black/5"
            />
          ))
        ) : (
          albums.map((album, idx) => (
            <motion.a
              key={album.id}
              href={album.drive_link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08 }}
              className="group block glass-panel overflow-hidden rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative aspect-square bg-black/10">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{album.title}</h3>
                      <p className="text-white/70 text-sm">{album.date}</p>
                    </div>
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-full group-hover:bg-(--color-accent) group-hover:text-black transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))
        )}

        {/* Tombol Tambah Album */}
        {!loading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: albums.length * 0.08 }}
            className="group glass-panel border-dashed border-2 border-(--color-accent) rounded-3xl aspect-square flex flex-col items-center justify-center text-(--color-text-secondary) hover:text-(--color-accent-hover) hover:bg-white/40 transition-all duration-300 hover:-translate-y-2"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="p-4 bg-black/5 rounded-full mb-4 group-hover:scale-110 group-hover:bg-(--color-accent)/20 transition-all duration-300">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold">Tambah Album Baru</span>
          </motion.button>
        )}
      </div>

      {/* Modal Form Tambah Album */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-lg glass-panel rounded-[2rem] p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Tombol tutup */}
                <button
                  onClick={closeModal}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 transition-colors text-(--color-text-secondary)"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <h2 className="text-2xl font-black text-(--color-text-primary)">Album Baru</h2>
                  <p className="text-(--color-text-secondary) text-sm mt-1">Isi detail album kenangan kita</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Upload Foto Cover */}
                  <div>
                    <label className="block text-sm font-bold text-(--color-text-secondary) mb-2">
                      Foto Cover
                    </label>
                    <div
                      className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-(--color-accent) overflow-hidden cursor-pointer hover:bg-white/20 transition-colors flex items-center justify-center bg-black/5"
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
                          <Upload className="w-8 h-8" />
                          <span className="text-sm font-medium">Klik untuk upload foto cover</span>
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
                        className="mt-2 text-xs text-red-500 hover:underline"
                      >
                        Hapus foto
                      </button>
                    )}
                  </div>

                  {/* Judul */}
                  <div>
                    <label className="block text-sm font-bold text-(--color-text-secondary) mb-1">
                      Judul Album <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="mis. Liburan Bali 2024"
                      className="w-full bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all"
                    />
                  </div>

                  {/* Tanggal */}
                  <div>
                    <label className="block text-sm font-bold text-(--color-text-secondary) mb-1 flex items-center space-x-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>Tanggal <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="mis. 15 Agu 2024 atau Beberapa Waktu"
                      className="w-full bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all"
                    />
                  </div>

                  {/* Link Google Drive */}
                  <div>
                    <label className="block text-sm font-bold text-(--color-text-secondary) mb-1 flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <span>Link Google Drive <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="url"
                      required
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-white/50 dark:bg-black/20 border border-(--color-glass-border) rounded-xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent) transition-all"
                    />
                  </div>

                  {/* Pesan Error / Sukses */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-red-100 text-red-600 border-2 border-red-300 rounded-xl text-sm font-bold text-center"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                    {successMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-green-100 text-green-700 border-2 border-green-300 rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{successMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tombol Submit */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-(--color-accent) hover:bg-(--color-accent-hover) text-(--color-text-primary) font-black py-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Menyimpan...</span>
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
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50"
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
