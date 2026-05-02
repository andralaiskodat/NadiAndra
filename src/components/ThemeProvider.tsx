"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "purple" | "aqua";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("purple");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("nadiandra-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "purple" ? "aqua" : "purple";
    setTheme(newTheme);
    localStorage.setItem("nadiandra-theme", newTheme);
    
    if (newTheme === "aqua") {
      document.documentElement.setAttribute("data-theme", "aqua");
    } else {
      document.documentElement.removeAttribute("data-theme"); // Default is purple
    }
  };

  if (!mounted) {
    return <div className="min-h-screen" />; // Prevent hydration mismatch
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
