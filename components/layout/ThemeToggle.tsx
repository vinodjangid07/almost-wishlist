"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "@phosphor-icons/react";

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  size = 16,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] transition shrink-0 cursor-pointer select-none active:scale-95 ${className}`}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun size={size} className="text-[var(--primary)]" />
      ) : (
        <Moon size={size} />
      )}
    </button>
  );
};
