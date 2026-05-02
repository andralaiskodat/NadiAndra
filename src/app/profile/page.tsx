"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { UserCircle, Camera, Lock, Save, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is not found, handled below

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
      } else {
        // If profile doesn't exist, set empty state
        setProfile({ id: user.id, full_name: "", avatar_url: null });
      }
    } catch (error: any) {
      console.error("Error loading profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setProfileMessage({ text: "", type: "" });
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: profile.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setProfileMessage({ text: "Profil berhasil diperbarui! ✨", type: "success" });
    } catch (error: any) {
      setProfileMessage({ text: error.message, type: "error" });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setProfileMessage({ text: "", type: "" });

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Kamu harus memilih gambar untuk diunggah.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Storage (Make sure 'avatars' bucket exists in Supabase!)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // 3. Update Profile
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: profile?.id,
          avatar_url: publicUrl,
        });

      if (updateError) throw updateError;

      // Update local state
      setProfile((prev) => prev ? { ...prev, avatar_url: publicUrl } : null);
      setProfileMessage({ text: "Avatar diperbarui! Lucu banget! 🌸", type: "success" });

    } catch (error: any) {
      setProfileMessage({ text: "Gagal mengunggah avatar: " + error.message, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "Password tidak cocok!", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: "Password minimal harus 6 karakter.", type: "error" });
      return;
    }

    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setPasswordMessage({ text: "Password berhasil diubah! 🔒", type: "success" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setPasswordMessage({ text: error.message, type: "error" });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-(--color-accent) animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-2xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-(--color-text-primary) tracking-tight">
          Profil Kamu
        </h1>
        <p className="text-lg text-(--color-text-secondary) font-bold">
          Sesuaikan tampilan kamu di ruang rahasia kita.
        </p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" }}
        className="glass-panel p-8 rounded-[3rem] space-y-8"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-(--color-accent) bg-(--color-bg-secondary) flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-20 h-20 text-(--color-accent-hover)" />
              )}
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-3 bg-(--color-accent) rounded-full hover:bg-(--color-accent-hover) transition-transform hover:scale-110 shadow-lg border-2 border-white dark:border-gray-900"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={uploadAvatar}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h2 className="text-2xl font-black text-(--color-text-primary)">{profile?.full_name || "Anonymous Bear"}</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1">Nama Tampilan</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border-2 border-(--color-accent) rounded-2xl px-4 py-3 text-(--color-text-primary) font-bold focus:outline-none focus:ring-4 focus:ring-(--color-accent-hover)/30 transition-all"
              placeholder="Nama panggilan lucumu..."
            />
          </div>

          {profileMessage.text && (
            <div className={`p-4 rounded-2xl border-2 font-bold text-sm text-center flex items-center justify-center space-x-2 ${
              profileMessage.type === "error" 
                ? "bg-red-100 text-red-600 border-red-300 animate-wobble" 
                : "bg-green-100 text-green-700 border-green-300"
            }`}>
              {profileMessage.type === "success" && <CheckCircle2 className="w-5 h-5" />}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-(--color-accent) hover:bg-(--color-accent-hover) text-(--color-text-primary) font-black text-lg py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 border-2 border-(--color-accent-hover)"
          >
            <Save className="w-5 h-5" />
            <span>Simpan Profil</span>
          </button>
        </form>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="glass-panel p-8 rounded-[3rem] space-y-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-(--color-bg-secondary) rounded-2xl border-2 border-(--color-accent)">
            <Lock className="w-6 h-6 text-(--color-accent-hover)" />
          </div>
          <h2 className="text-2xl font-black text-(--color-text-primary)">Keamanan</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1">Password Baru</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border-2 border-(--color-glass-border) rounded-2xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:border-(--color-accent) transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-(--color-text-secondary) mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border-2 border-(--color-glass-border) rounded-2xl px-4 py-3 text-(--color-text-primary) focus:outline-none focus:border-(--color-accent) transition-colors"
              placeholder="••••••••"
            />
          </div>

          {passwordMessage.text && (
            <div className={`p-4 rounded-2xl border-2 font-bold text-sm text-center flex items-center justify-center space-x-2 ${
              passwordMessage.type === "error" 
                ? "bg-red-100 text-red-600 border-red-300 animate-wobble" 
                : "bg-green-100 text-green-700 border-green-300"
            }`}>
              {passwordMessage.type === "success" && <CheckCircle2 className="w-5 h-5" />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-black text-lg py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {passwordLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            <span>Perbarui Password</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
