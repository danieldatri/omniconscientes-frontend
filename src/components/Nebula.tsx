"use client";
import React from "react";
import "@/styles/nebula.css";

export type NebulaProps = {
  className?: string;
  style?: React.CSSProperties;
};

// Detecta si es móvil por user agent y pantalla pequeña
function shouldHideNebula() {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const isMobileUA = /Mobi|Android|iPhone|iPod|Mobile|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth < 600;
  // Oculta solo si es móvil Y pantalla pequeña
  return isMobileUA && isSmallScreen;
}

// Decorative blurred "nebula" background that plays nicely with the starfield.
// Uses theme colors via CSS variables.
export default function Nebula({ className = "absolute inset-0", style }: NebulaProps) {
  if (typeof window === 'undefined') return null;
  if (shouldHideNebula()) return null;
  return (
    <div className={className} style={{ pointerEvents: 'none', zIndex: 2, ...style }}>
      <div className="nebula-wrapper">
        <div className="nebula-blob nebula-a" />
        <div className="nebula-blob nebula-b" />
        <div className="nebula-blob nebula-c" />
      </div>
    </div>
  );
}
