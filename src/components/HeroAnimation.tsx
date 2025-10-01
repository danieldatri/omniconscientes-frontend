"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Starfield from "@/components/Starfield";

export default function HeroAnimation() {
  const contentRef = useRef<HTMLDivElement>(null);
  const almaRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const [showRed, setShowRed] = useState(false);
  const [showLaDel, setShowLaDel] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showOmni, setShowOmni] = useState(false);
  const [almaInit, setAlmaInit] = useState(true);

  useEffect(() => {
    // Asegura que los estilos iniciales se apliquen en el primer frame
    requestAnimationFrame(() => {
      if (almaRef.current) {
        gsap.fromTo(
          almaRef.current,
          { x: "-60vw", opacity: 0 },
          {
            x: "10vw",
            opacity: 0.6, // bajar opacidad máxima de ALMA
            duration: 4,
            ease: "power3.inOut",
            onComplete: () => setShowRed(true),
          }
        );
      }
      // Luego de iniciar la animación, retiramos los estilos iniciales controlados por React
      setAlmaInit(false);
    });
  }, []);

  useEffect(() => {
    if (showRed && redRef.current) {
      gsap.fromTo(
        redRef.current,
        { x: "60vw", opacity: 0 },
        {
          x: "-20vw",
          opacity: 0.6, // bajar opacidad máxima de RED
          duration: 4,
          ease: "power3.inOut",
          onComplete: () => setShowLaDel(true),
        }
      );
    }
  }, [showRed]);

  useEffect(() => {
    if (showLaDel && almaRef.current && redRef.current) {
      gsap.to(almaRef.current, {
        x: "0vw",
        duration: 1.2,
        ease: "power3.inOut"
      });
      gsap.to(redRef.current, {
        x: "0vw",
        duration: 1.2,
        ease: "power3.inOut"
      });
    }
  }, [showLaDel]);

  useEffect(() => {
    if (showLaDel) {
      const timer = setTimeout(() => setShowLogo(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [showLaDel]);

  useEffect(() => {
    if (showLogo) {
      const timer = setTimeout(() => setShowOmni(true), 600);
      return () => clearTimeout(timer);
    }
  }, [showLogo]);

  return (
    <div
      ref={contentRef}
      className="relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ minHeight: "80vh", background: "var(--background)", color: "var(--text)" }}
    >
      <Starfield className="absolute inset-0 w-full h-full" />
      <div className="flex flex-col items-center justify-center w-full h-full" style={{ zIndex: 2 }}>
        <div className="w-full flex justify-center relative omniconscientes-container">
          {showOmni && (
            <span className="omniconscientes-fadein text-center" style={{ color: 'var(--text)', opacity: 0.6, fontSize: 'min(5vw, 3rem)', fontWeight: 700, letterSpacing: '0.12em', display: 'inline-block', userSelect: 'none' }}>
              {"OMNICONSCIENTES".split("").map((char, i) => (
                <span key={i} style={{ opacity: 0, animation: `fadein-char 0.36s cubic-bezier(.4,0,.2,1) forwards`, animationDelay: `${i * 0.14}s` }}>{char}</span>
              ))}
            </span>
          )}
        </div>
        <div className="flex flex-row items-center justify-center w-full relative" style={{ height: "1em", minHeight: '8rem' }}>
          <span
            className="absolute flex flex-row gap-4 items-center w-full justify-center frase-redalma"
            style={{
              top: "50%",
              left: "50%",
              translate: "-50% -50%",
              zIndex: 5,
              whiteSpace: "nowrap",
            }}
          >
            <span
              className={`word-anim`}
              style={{
                color: "var(--text)",
                opacity: showLaDel ? 0.6 : 0,
                transition: showLaDel ? "opacity 1.2s 0.2s" : "opacity 0.2s",
              }}
            >
              LA
            </span>
            <span
              ref={redRef}
              className="word-anim"
              style={{ color: "var(--text)", opacity: showRed ? 0.6 : 0, transition: "opacity 0.8s" }}
            >
              RED
            </span>
            <span
              className={`word-anim`}
              style={{
                color: "var(--text)",
                opacity: showLaDel ? 0.6 : 0,
                transition: showLaDel ? "opacity 1.2s 1s" : "opacity 0.2s",
              }}
            >
              DEL
            </span>
            <span
              ref={almaRef}
              className="word-anim"
              style={
                almaInit
                  ? {
                      color: "var(--text)",
                      opacity: 0,
                      transform: "translateX(-60vw)",
                      transition: "opacity 0.8s",
                    }
                  : { color: "var(--text)", transition: "opacity 0.8s" }
              }
            >
              ALMA
            </span>
          </span>
        </div>
        <div style={{ height: showLogo ? 240 : 0, transition: 'height 0.6s' }} className="w-full flex justify-center pointer-events-none">
          {showLogo && (
            <div className="animate-fade-in" style={{ zIndex: 10 }}>
              <Image src="/logo.svg" alt="Logo" width={220} height={220} priority />
            </div>
          )}
        </div>
      </div>
      <style>{`
        .pointer-trail { display: none; }
        .omniconscientes-container {
          min-height: 3.5em;
          margin-bottom: 2.5rem;
        }
        @media (max-width: 480px) {
          .omniconscientes-container {
            min-height: 0 !important;
            margin-bottom: 0.05rem !important;
          }
          .omniconscientes-fadein {
            font-size: 1.3rem !important;
            margin-bottom: 0 !important;
          }
          .word-anim {
            font-size: 1.5rem !important;
            padding: 0 0.2em;
          }
          .frase-redalma {
            gap: 0.7em !important;
          }
        }
        .word-anim {
          font-size: min(10vw, 7rem);
          font-weight: 800;
          letter-spacing: 0.04em;
          line-height: 1;
          transition: color 0.2s;
        }
        @media (min-width: 640px) {
          .word-anim {
            font-size: min(10vw, 7rem);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes fadein-char {
          from { opacity: 0; transform: translateY(0.7em); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
