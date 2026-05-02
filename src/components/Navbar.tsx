"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Camera, CalendarHeart, Clock, Image as ImageIcon, Menu, Palette, X, Heart, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Hide navbar on login page
  if (pathname === "/login") return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { name: "Beranda", href: "/", icon: Heart },
    { name: "Photo Booth", href: "/photo-booth", icon: Camera },
    { name: "Perencana Kencan", href: "/date-planner", icon: CalendarHeart },
    { name: "Kapsul Waktu", href: "/time-capsule", icon: Clock },
    { name: "Arsip Foto", href: "/archive", icon: ImageIcon },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 left-0 px-4 py-3">
      <div className="max-w-4xl mx-auto glass-panel rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-(--color-accent-hover) fill-current animate-pulse" />
          <span className="font-bold text-xl tracking-tight hidden sm:block">Nadiandra</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.slice(1).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-(--color-accent-hover) ${
                  isActive ? "text-(--color-accent-hover)" : "text-(--color-text-secondary)"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:block">{link.name}</span>
              </Link>
            );
          })}
          
          <div className="flex items-center space-x-2 border-l pl-4 border-(--color-glass-border)">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
              title="Ganti Tema"
            >
              <Palette className="w-5 h-5 text-(--color-text-primary)" />
            </button>
            <Link
              href="/profile"
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
                pathname === "/profile" ? "text-(--color-accent-hover)" : "text-(--color-text-primary)"
              }`}
              title="Profil"
            >
              <UserCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <button onClick={toggleTheme} className="p-2">
            <Palette className="w-5 h-5 text-(--color-text-primary)" />
          </button>
          <Link href="/profile" className="p-2">
            <UserCircle className={`w-5 h-5 ${pathname === '/profile' ? 'text-(--color-accent-hover)' : 'text-(--color-text-primary)'}`} />
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? <X className="w-6 h-6 text-(--color-text-primary)" /> : <Menu className="w-6 h-6 text-(--color-text-primary)" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 glass-panel rounded-2xl p-4 flex flex-col space-y-2 md:hidden shadow-xl"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    isActive ? "bg-black/5 text-(--color-accent-hover)" : "text-(--color-text-secondary)"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
            
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3 p-3 rounded-xl transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Keluar</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
