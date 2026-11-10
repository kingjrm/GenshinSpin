"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Boss } from "@/data/bosses";

interface BossWheelProps {
  activeBosses: Boss[];
  onSpinComplete: (boss: Boss) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

const REGION_COLORS: Record<string, string> = {
  Mondstadt:  "rgba(85, 255, 212, 0.45)",
  Liyue:      "rgba(255, 215, 94, 0.45)",
  Inazuma:    "rgba(226, 133, 255, 0.45)",
  Sumeru:     "rgba(133, 235, 52, 0.45)",
  Fontaine:   "rgba(60, 212, 255, 0.45)",
  Natlan:     "rgba(255, 96, 64, 0.45)",
  Snezhnaya:  "rgba(156, 245, 255, 0.45)",
  "Nod-Krai": "rgba(161, 163, 179, 0.45)",
  None:       "rgba(161, 163, 179, 0.45)",
};

const REGION_TEXT_COLORS: Record<string, string> = {
  Mondstadt:  "#80ffd4",
  Liyue:      "#ffe080",
  Inazuma:    "#f0b3ff",
  Sumeru:     "#b3ff66",
  Fontaine:   "#8cd9ff",
  Natlan:     "#ff8c73",
  Snezhnaya:  "#d1f9ff",
  "Nod-Krai": "#d1d3e0",
  None:       "#d1d3e0",
};

export default function BossWheel({
  activeBosses,
  onSpinComplete,
  isSpinning,
  setIsSpinning,
}: BossWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tickerWobble, setTickerWobble] = useState(false);

  // Preloaded images map: boss name → HTMLImageElement (or null if failed)
  const imagesRef = useRef<Map<string, HTMLImageElement | null>>(new Map());
  const [imagesReady, setImagesReady] = useState(false);

  // Animation state refs
  const angleRef      = useRef(0);
  const targetAngleRef = useRef(0);
  const isSpinningRef  = useRef(isSpinning);
  const lastSegmentRef = useRef(-1);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  // Preload boss images whenever the boss list changes
  useEffect(() => {
    if (activeBosses.length === 0) return;

    setImagesReady(false);
    const map = new Map<string, HTMLImageElement | null>();
    let loaded = 0;
    const total = activeBosses.length;

    const tryLoad = (boss: Boss) => {
      const filename = (boss as { wikiFilename?: string }).wikiFilename
        || `Enemy_${boss.name.replace(/ /g, "_").replace(/:/g, "").replace(/'/g, "")}.png`;
      const proxyUrl = `/api/boss-image?file=${encodeURIComponent(filename)}`;

      const img = new Image();
      img.onload = () => {
        map.set(boss.name, img);
        loaded++;
        if (loaded === total) { imagesRef.current = map; setImagesReady(true); }
      };
      img.onerror = () => {
        map.set(boss.name, null);
        loaded++;
        if (loaded === total) { imagesRef.current = map; setImagesReady(true); }
      };
      img.src = proxyUrl;
    };

    activeBosses.forEach(tryLoad);

    // Timeout fallback: if images take >4s, just draw with what we have
    const timeout = setTimeout(() => {
      imagesRef.current = map;
      setImagesReady(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [activeBosses]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size   = canvas.width;
    const center = size / 2;
    const radius = center - 12;

    ctx.clearRect(0, 0, size, size);

    const N = activeBosses.length;
    if (N === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20, 26, 38, 0.78)";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(216, 179, 106, 0.3)";
      ctx.stroke();
      ctx.fillStyle = "#9aa3b2";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Select a boss pool to spin", center, center);
      return;
    }

    const anglePerSegment = (Math.PI * 2) / N;
    const currentAngle    = angleRef.current;
    const imgMap          = imagesRef.current;

    // ── Draw slices ──────────────────────────────────────────────────────────
    for (let i = 0; i < N; i++) {
      const boss       = activeBosses[i];
      const startAngle = i * anglePerSegment + currentAngle;
      const endAngle   = (i + 1) * anglePerSegment + currentAngle;
      const midAngle   = startAngle + anglePerSegment / 2;

      // Fill slice
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = N > 30
        ? (i % 2 === 0 ? "#111026" : "#171633")
        : (REGION_COLORS[boss.region] ?? REGION_COLORS.None);
      ctx.fill();

      // Slice border
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(195, 158, 74, 0.2)";
      ctx.stroke();

      // ── Draw boss image in slice ─────────────────────────────────────────
      if (N <= 60) {
        const img = imgMap.get(boss.name);
        if (img) {
          // Position image along the mid-radius of the slice
          const imgRadius = radius * 0.62;
          const imgX = center + Math.cos(midAngle) * imgRadius;
          const imgY = center + Math.sin(midAngle) * imgRadius;
          const imgSize = Math.max(14, Math.min(36, 480 / N));
          const half = imgSize / 2;

          ctx.save();
          ctx.translate(imgX, imgY);

          // Clip to circle for the image
          ctx.beginPath();
          ctx.arc(0, 0, half, 0, Math.PI * 2);
          ctx.clip();

          // Dark bg behind image
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(-half, -half, imgSize, imgSize);

          ctx.drawImage(img, -half, -half, imgSize, imgSize);
          ctx.restore();
        }
      }

      // ── Draw text label ──────────────────────────────────────────────────
      if (N <= 36) {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(midAngle);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = REGION_TEXT_COLORS[boss.region] ?? "#ffffff";

        const fontSize = Math.max(9, Math.min(13, 280 / N));
        ctx.font = `bold ${fontSize}px sans-serif`;

        const textRadius = radius - 15;
        let displayName = boss.name;
        if (N > 15 && boss.name.length > 10) {
          displayName = boss.name.slice(0, 9) + "..";
        }
        ctx.fillText(displayName, textRadius, 0);
        ctx.restore();
      }
    }

    // ── Outer golden ring ────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(216, 179, 106, 0.85)";
    ctx.stroke();

    // ── Hub ──────────────────────────────────────────────────────────────────
    const hubR = Math.min(45, radius * 0.25);
    ctx.beginPath();
    ctx.arc(center, center, hubR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(245, 234, 201, 0.08)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 244, 205, 0.65)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, Math.min(40, radius * 0.22), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 244, 205, 0.16)";
    ctx.fill();
  }, [activeBosses]);

  // Redraw when anything changes
  useEffect(() => {
    drawWheel();
  }, [drawWheel, imagesReady]);

  const spin = () => {
    if (isSpinning || activeBosses.length === 0) return;

    setIsSpinning(true);

    const N = activeBosses.length;
    const anglePerSegment = (Math.PI * 2) / N;
    const targetIndex = Math.floor(Math.random() * N);

    const targetCenter = (targetIndex + 0.5) * anglePerSegment;
    let stopAngle = (Math.PI * 1.5) - targetCenter;
    while (stopAngle < 0)         stopAngle += Math.PI * 2;
    while (stopAngle >= Math.PI * 2) stopAngle -= Math.PI * 2;

    const fullSpins = 6 + Math.floor(Math.random() * 4);
    const finalAngle = angleRef.current + stopAngle + fullSpins * Math.PI * 2;
    angleRef.current = angleRef.current % (Math.PI * 2);
    const startAngle = angleRef.current;
    targetAngleRef.current = finalAngle;

    const duration = 5500;
    const startTime = performance.now();
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      angleRef.current = startAngle + easeOut(t) * (finalAngle - startAngle);

      const totalMovement = angleRef.current - Math.PI * 1.5;
      const currentSegment = Math.floor(totalMovement / anglePerSegment);
      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        setTickerWobble(true);
        setTimeout(() => setTickerWobble(false), 50);
      }

      drawWheel();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        onSpinComplete(activeBosses[targetIndex]);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="wheel-wrapper">
      <div className="wheel-centerpiece">
        {/* POINTER */}
        <div
          className="wheel-pointer"
          style={{ transform: `translateX(-50%) ${tickerWobble ? "rotate(-15deg)" : "rotate(0deg)"}` }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 32L6 8C5 5.5 6.5 3 9.5 3H22.5C25.5 3 27 5.5 26 8L16 32Z"
              fill="url(#goldGradient)" stroke="#0f0f1b" strokeWidth="2.5" />
            <path d="M16 26L10 9H22L16 26Z" fill="#fff3cc" opacity="0.3" />
            <defs>
              <linearGradient id="goldGradient" x1="16" y1="3" x2="16" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#fff3cc" />
                <stop offset="50%"  stopColor="#d1a63b" />
                <stop offset="100%" stopColor="#8c6c1e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* CANVAS */}
        <canvas
          ref={canvasRef}
          width={450}
          height={450}
          style={{ display: "block", maxWidth: "100%", height: "auto", width: "450px", aspectRatio: "1/1" }}
        />

        {/* SPIN BUTTON */}
        <button
          onClick={spin}
          disabled={isSpinning || activeBosses.length === 0}
          className="wheel-spin-btn flex flex-col items-center justify-center"
        >
          <span className="wheel-spin-btn-title">SPIN</span>
          <span className="wheel-spin-btn-subtitle">BOSS</span>
        </button>
      </div>
    </div>
  );
}
