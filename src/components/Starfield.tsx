"use client";
import React, { useEffect, useRef } from "react";

export type StarfieldProps = {
  className?: string;
  style?: React.CSSProperties;
};

export default function Starfield({ className = "absolute inset-0", style }: StarfieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preferences/Device
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const cores = ((navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency) || 4;

    // Dynamic quality
    let quality = prefersReduced ? 0.6 : (isMobile || cores <= 4 ? 0.85 : 1.05);
    const Q_MIN = 0.6, Q_MAX = 1.3;

    // Base config
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
        cctx.fillStyle = val as string;
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

    // Initialize according to area
    addStars(computeTarget(canvas.width / dpr, canvas.height / dpr), canvas.width / dpr, canvas.height / dpr);

    // Shooting stars
    type Shooting = { x:number; y:number; vx:number; vy:number; life:number; maxLife:number };
    const shootings: Shooting[] = [];
    const intervalByQuality = () => rand(cfg.shootMin, cfg.shootMax) / Math.max(0.6, quality);
    let nextShootAt = performance.now() + (prefersReduced ? 9999999 : intervalByQuality());
    let maxActiveShooting = Math.max(1, Math.min(5, Math.round(1 + quality * 3)));

    const spawnShooting = (w: number, h: number) => {
      const side = Math.floor(rand(0, 4)); // 0 top, 1 right, 2 bottom, 3 left
      let x: number, y: number, vx: number, vy: number;
      const speed = rand(500, 900); // px/s
      switch (side) {
        case 0: x = rand(-w*0.2, w*0.8); y = -20; vx = speed * 0.75; vy = speed * 0.75; break;
        case 1: x = w + 20; y = rand(-h*0.2, h*0.8); vx = -speed * 0.75; vy = speed * 0.75; break;
        case 2: x = rand(0.2*w, 1.2*w); y = h + 20; vx = -speed * 0.75; vy = -speed * 0.75; break;
        default: x = -20; y = rand(0.2*h, 1.2*h); vx = speed * 0.75; vy = speed * 0.75; break;
      }
      shootings.push({ x, y, vx, vy, life: 0, maxLife: rand(700, 1400) });
    };

    // Mouse interaction (listen on window to avoid blocking underlying UI)
    const mouse = { x: -9999, y: -9999, active: false };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };
    window.addEventListener('pointermove', onPointerMove);

    // Pause when tab hidden
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
      if (!running) return;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      // Auto quality tuning roughly every ~30 frames
      fpsAccum += dt; fpsCount++;
      if (fpsCount >= 30) {
        const avg = fpsAccum / fpsCount;
        const fps = 1 / Math.max(1e-6, avg);
        if (fps < 50) quality = Math.max(Q_MIN, quality * 0.92);
        else if (fps > 58) quality = Math.min(Q_MAX, quality * 1.05);
        maxActiveShooting = Math.max(1, Math.min(5, Math.round(1 + quality * 3)));
        fpsAccum = 0; fpsCount = 0;
      }

      // Update theme color occasionally
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

      // Adjust number of stars smoothly
      const target = computeTarget(w, h);
      if (stars.length < target) addStars(Math.min(cfg.addBatch, target - stars.length), w, h);
      else if (stars.length > target) removeStars(Math.min(cfg.removeBatch, stars.length - target));

      // Update + draw stars
      const influenceR = 120;
      const pushStrength = 160;
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

        // Spring back
        const ax = (s.ox - s.x) * spring;
        const ay = (s.oy - s.y) * spring;
        s.vx = (s.vx + ax) * friction;
        s.vy = (s.vy + ay) * friction;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Wrap softly
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
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(colorInterval);
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ ...style, zIndex: 1 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />
    </div>
  );
}

