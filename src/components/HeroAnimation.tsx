"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function HeroAnimation() {
  const contentRef = useRef<HTMLDivElement>(null);
  const almaRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRed, setShowRed] = useState(false);
  const [showLaDel, setShowLaDel] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showOmni, setShowOmni] = useState(false);
  const [almaInit, setAlmaInit] = useState(true);

  // ------ Starfield (canvas) ------
  useEffect(() => {
    const container = contentRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preferencias/Dispositivo
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const cores = ((navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency) || 4;

    // Calidad dinámica
    let quality = prefersReduced ? 0.6 : (isMobile || cores <= 4 ? 0.85 : 1.05);
    const Q_MIN = 0.6, Q_MAX = 1.3;

    // Config base
    const cfg = {
      baseDiv: 8000,
      starMin: 180,
      starMax: 1400,
      addBatch: 60,
      removeBatch: 80,
      shootMin: 2200,
      shootMax: 5200
    };

    // Scale canvas for device pixel ratio
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    type Star = {
      x: number; y: number; ox: number; oy: number; radius: number;
      baseAlpha: number; alpha: number; alphaDir: number; twinkle: number;
      vx: number; vy: number;
    };

    const stars: Star[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const getTextRGB = () => {
      const cs = getComputedStyle(container);
      let val = cs.getPropertyValue('--text').trim();
      if (!val) val = cs.color || 'rgb(255,255,255)';
      const canvasTmp = document.createElement('canvas');
      const cctx = canvasTmp.getContext('2d');
      if (cctx) {
        cctx.fillStyle = val; // usar string tipado en lugar de any
        const normalized = cctx.fillStyle as string;
        const m = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (m) return [parseInt(m[1],10), parseInt(m[2],10), parseInt(m[3],10)] as [number,number,number];
      }
      if (val.startsWith('#')) {
        const hex = val.replace('#','');
        const bigint = parseInt(hex.length === 3 ? hex.split('').map(ch=>ch+ch).join('') : hex, 16);
        return [(bigint>>16)&255, (bigint>>8)&255, bigint&255] as [number,number,number];
      }
      return [255,255,255] as [number,number,number];
    };

    let [tr, tg, tb] = getTextRGB();

    const computeTarget = (w: number, h: number) => {
      const area = w * h;
      const divisor = cfg.baseDiv / quality;
      const target = Math.floor(area / Math.max(2000, divisor));
      return Math.max(cfg.starMin, Math.min(cfg.starMax, target));
    };

    const makeStar = (w: number, h: number): Star => {
      const radius = Math.random() < 0.25 ? rand(1.1, 2.3) : rand(0.35, 1.25);
      const x = Math.random() * w;
      const y = Math.random() * h;
      const baseAlpha = rand(0.35, 0.9);
      const alpha = baseAlpha * rand(0.7, 1.0);
      const alphaDir = Math.random() < 0.5 ? 1 : -1;
      const twinkle = prefersReduced ? rand(0.001, 0.004) : rand(0.003, 0.012);
      return { x, y, ox: x, oy: y, radius, baseAlpha, alpha, alphaDir, twinkle, vx: 0, vy: 0 };
    };

    const addStars = (n: number, w: number, h: number) => {
      for (let i = 0; i < n; i++) stars.push(makeStar(w, h));
    };

    const removeStars = (n: number) => {
      for (let i = 0; i < n && stars.length; i++) {
        const idx = Math.floor(Math.random() * stars.length);
        stars.splice(idx, 1);
      }
    };

    // Inicializa con un objetivo según el área
    addStars(computeTarget(canvas.width / dpr, canvas.height / dpr), canvas.width / dpr, canvas.height / dpr);

    // Shooting stars múltiples
    type Shooting = { x:number; y:number; vx:number; vy:number; life:number; maxLife:number };
    const shootings: Shooting[] = [];
    const intervalByQuality = () => rand(cfg.shootMin, cfg.shootMax) / Math.max(0.6, quality);
    let nextShootAt = performance.now() + (prefersReduced ? 9999999 : intervalByQuality());
    let maxActiveShooting = Math.max(1, Math.min(5, Math.round(1 + quality * 3)));

    const spawnShooting = (w: number, h: number) => {
      const side = Math.floor(rand(0, 4)); // 0 top, 1 right, 2 bottom, 3 left
      let x: number, y: number, vx: number, vy: number; // sin inicializadores redundantes
      const speed = rand(500, 900); // px/s
      switch (side) {
        case 0: x = rand(-w*0.2, w*0.8); y = -20; vx = speed * 0.75; vy = speed * 0.75; break;
        case 1: x = w + 20; y = rand(-h*0.2, h*0.8); vx = -speed * 0.75; vy = speed * 0.75; break;
        case 2: x = rand(0.2*w, 1.2*w); y = h + 20; vx = -speed * 0.75; vy = -speed * 0.75; break;
        default: x = -20; y = rand(0.2*h, 1.2*h); vx = speed * 0.75; vy = speed * 0.75; break;
      }
      shootings.push({ x, y, vx, vy, life: 0, maxLife: rand(700, 1400) });
    };

    // Mouse interaction
    const mouse = { x: -9999, y: -9999, active: false };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left);
      mouse.y = (e.clientY - rect.top);
      mouse.active = true;
    };
    const onPointerLeave = () => { mouse.active = false; };
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    // Pausar cuando no es visible
    let running = true;
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    let rafId = 0;
    let lastTs = performance.now();
    let fpsAccum = 0; let fpsCount = 0;

    const draw = (ts: number) => {
      if (!running) return; // re-scheduleará al volver visible
      const dt = Math.min(0.05, (ts - lastTs) / 1000); // cap delta
      lastTs = ts;

      // Auto-ajuste de calidad cada ~30 frames
      fpsAccum += dt; fpsCount++;
      if (fpsCount >= 30) {
        const avg = fpsAccum / fpsCount; // segundos/frame
        const fps = 1 / Math.max(1e-6, avg);
        if (fps < 50) quality = Math.max(Q_MIN, quality * 0.92);
        else if (fps > 58) quality = Math.min(Q_MAX, quality * 1.05);
        maxActiveShooting = Math.max(1, Math.min(5, Math.round(1 + quality * 3)));
        fpsAccum = 0; fpsCount = 0;
      }

      // Update theme color ocasionalmente
      if (Math.floor(ts / 1000) % 2 === 0) {
        const [r,g,b] = getTextRGB();
        tr = r; tg = g; tb = b;
      }

      // Clear + scale
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Ajustar cantidad objetivo de estrellas sin saltos
      const target = computeTarget(w, h);
      if (stars.length < target) addStars(Math.min(cfg.addBatch, target - stars.length), w, h);
      else if (stars.length > target) removeStars(Math.min(cfg.removeBatch, stars.length - target));

      // Update y draw estrellas
      const influenceR = 120;
      const pushStrength = 160; // higher -> stronger push
      const friction = 0.9;
      const spring = 0.015;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Twinkle
        s.alpha += s.alphaDir * s.twinkle;
        const minA = Math.max(0.12, s.baseAlpha - 0.35);
        const maxA = Math.min(1.0, s.baseAlpha + 0.35);
        if (s.alpha > maxA) { s.alpha = maxA; s.alphaDir = -1; }
        else if (s.alpha < minA) { s.alpha = minA; s.alphaDir = 1; }

        // Mouse push
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceR && dist > 0.001) {
            const f = (1 - dist / influenceR) * (pushStrength * dt);
            s.vx += (dx / dist) * f;
            s.vy += (dy / dist) * f;
          }
        }

        // Spring back to original position
        const ax = (s.ox - s.x) * spring;
        const ay = (s.oy - s.y) * spring;
        s.vx = (s.vx + ax) * friction;
        s.vy = (s.vy + ay) * friction;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Wrap softly (if resized)
        if (s.x < -5) { s.x = w + 5; s.ox = s.x; }
        if (s.x > w + 5) { s.x = -5; s.ox = s.x; }
        if (s.y < -5) { s.y = h + 5; s.oy = s.y; }
        if (s.y > h + 5) { s.y = -5; s.oy = s.y; }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tr},${tg},${tb},${s.alpha})`;
        ctx.fill();
      }

      // Shooting stars
      const now = ts;
      if (!prefersReduced && now >= nextShootAt) {
        const toSpawn = quality > 1.05 && Math.random() < 0.6 ? 2 : 1;
        for (let i = 0; i < toSpawn && shootings.length < maxActiveShooting; i++) spawnShooting(w, h);
        nextShootAt = now + intervalByQuality();
      }

      // Actualizar y dibujar fugaces activas
      for (let i = shootings.length - 1; i >= 0; i--) {
        const sh = shootings[i];
        sh.life += dt * 1000;
        const fade = Math.max(0, 1 - sh.life / sh.maxLife);
        const sx = sh.x, sy = sh.y;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;

        // tail
        const tailLen = 220;
        const ang = Math.atan2(sh.vy, sh.vx);
        const tx = sx - Math.cos(ang) * tailLen;
        const ty = sy - Math.sin(ang) * tailLen;
        const grad = ctx.createLinearGradient(sx, sy, tx, ty);
        grad.addColorStop(0, `rgba(${tr},${tg},${tb},${0.9 * fade})`);
        grad.addColorStop(1, `rgba(${tr},${tg},${tb},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // head
        ctx.beginPath();
        ctx.arc(sx, sy, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tr},${tg},${tb},${0.95 * fade})`;
        ctx.fill();

        if (sh.life >= sh.maxLife || sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          shootings.splice(i, 1);
        }
      }

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    const colorInterval = setInterval(() => {
      const [r,g,b] = getTextRGB();
      [tr, tg, tb] = [r, g, b];
    }, 2000);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(colorInterval);
    };
  }, []);
  // ------ End Starfield ------

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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1, pointerEvents: 'none' }} />
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
