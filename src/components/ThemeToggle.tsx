"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("cosmos-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("cosmos-theme", next);

    if (next === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-600"
      title={`Toggle theme (${theme === "dark" ? "Dark" : "Light"})`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-zinc-300" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-800" />
      )}
    </button>
  );
}
