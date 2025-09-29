"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const labels = {
  light: "Modo claro",
  dark: "Modo oscuro",
  system: "Seguir sistema",
};

const ThemeSwitcher: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Orden de temas para el toggle
  const themeOrder: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
  const currentTheme = (theme === "light" || theme === "dark" || theme === "system") ? theme : "light";
  const currentIdx = themeOrder.indexOf(currentTheme);
  const nextTheme = themeOrder[(currentIdx + 1) % themeOrder.length];

  const Icon = icons[currentTheme];
  const nextLabel = labels[nextTheme];

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      aria-label={nextLabel}
      title={nextLabel}
      style={{
        marginLeft: "1rem",
        background: "var(--surface-alt)",
        color: "var(--primary)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "0.3rem 1rem",
        cursor: "pointer",
        fontSize: "1.2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, color 0.2s"
      }}
    >
      <Icon size={22} strokeWidth={2} />
    </button>
  );
};

export default ThemeSwitcher;
