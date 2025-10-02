"use client";
import Starfield from "./Starfield";
import Nebula from "./Nebula";

export default function VisualEffectsWrapper({ className, style, showNebula }: { className?: string; style?: React.CSSProperties; showNebula?: boolean }) {
  return (
    <>
      <Starfield className={className} style={style} />
      {showNebula && (
        <Nebula className={className + " nebula-fade-in"} style={style} />
      )}
    </>
  );
}
