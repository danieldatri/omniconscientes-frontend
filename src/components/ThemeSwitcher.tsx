"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ThemeSwitcher: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // evita hydration mismatch

  const isLight = resolvedTheme === "light";
  const toggleTheme = () => setTheme(isLight ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
      style={{
        marginLeft: "1rem",
        background: "var(--surface-alt)",
        color: "var(--text)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "0.3rem 1rem",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background 0.2s"
      }}
    >
      {isLight ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeSwitcher;
