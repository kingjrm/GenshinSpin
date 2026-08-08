"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Character } from "@/data/characters";

interface WheelProps {
  activeCharacters: Character[];
  onSpinComplete: (character: Character) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

export default function Wheel({
  activeCharacters,
  onSpinComplete,
  isSpinning,
  setIsSpinning,
}: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tickerWobble, setTickerWobble] = useState(false);
  
  // Animation state refs
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const isSpinningRef = useRef(isSpinning);
  const lastSegmentRef = useRef(-1);

  // Sync ref with prop
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 12; // margin for outline and glow

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const N = activeCharacters.length;
    if (N === 0) {
      // Draw placeholder empty wheel
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(13, 13, 30, 0.6)";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "var(--border-gold-low)";
      ctx.stroke();

      ctx.fillStyle = "var(--text-muted)";
      ctx.font = "14px var(--font-body)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Select 2+ characters to spin", center, center);
      return;
    }

    const anglePerSegment = (Math.PI * 2) / N;
    const currentAngle = angleRef.current;

    // Draw slices
    for (let i = 0; i < N; i++) {
      const char = activeCharacters[i];
      const startAngle = i * anglePerSegment + currentAngle;
      const endAngle = (i + 1) * anglePerSegment + currentAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      // If active character count is high (> 30), use alternating dark stellar shades
      // to keep it looking clean and clean, instead of a rainbow blur.
      if (N > 30) {
        ctx.fillStyle = i % 2 === 0 ? "#111026" : "#171633";
      } else {
        // Semi-transparent element color
        const elementColors: Record<string, string> = {
          Pyro: "rgba(255, 96, 64, 0.45)",
          Hydro: "rgba(60, 212, 255, 0.45)",
          Cryo: "rgba(156, 245, 255, 0.45)",
          Electro: "rgba(226, 133, 255, 0.45)",
          Dendro: "rgba(133, 235, 52, 0.45)",
          Anemo: "rgba(85, 255, 212, 0.45)",
          Geo: "rgba(255, 215, 94, 0.45)",
          None: "rgba(161, 163, 179, 0.45)",
        };
        ctx.fillStyle = elementColors[char.element] || elementColors.None;
      }
      ctx.fill();

      // Draw segment border (subtle gold line)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(195, 158, 74, 0.2)";
      ctx.stroke();

      // Draw text details inside slices if total slice count is reasonable
      if (N <= 36) {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + anglePerSegment / 2);

        // Align details
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        
        // Element specific color for names
        const nameColors: Record<string, string> = {
          Pyro: "#ff8c73",
          Hydro: "#8cd9ff",
          Cryo: "#d1f9ff",
          Electro: "#f0b3ff",
          Dendro: "#b3ff66",
          Anemo: "#80ffd4",
          Geo: "#ffe080",
          None: "#d1d3e0",
        };
        ctx.fillStyle = nameColors[char.element] || "#ffffff";
        
        // Calculate text size based on segment count
        const fontSize = Math.max(10, Math.min(14, 300 / N));
        ctx.font = `bold ${fontSize}px var(--font-body)`;

        // Draw character name
        const textMargin = radius - 15;
        const nameLength = char.name.length;
        let displayName = char.name;
        if (N > 20 && nameLength > 8) {
          displayName = char.name.slice(0, 7) + "..";
        }
        
        ctx.fillText(displayName, textMargin, 0);
        ctx.restore();
      }
    }

    // Draw outer golden ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "var(--border-gold)";
    ctx.stroke();

    // Draw inner hub (glassmorphic golden circle)
    ctx.beginPath();
    ctx.arc(center, center, Math.min(45, radius * 0.25), 0, Math.PI * 2);
    ctx.fillStyle = "var(--bg-panel-solid)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "var(--border-gold)";
    ctx.stroke();

    // Draw metallic grid inside hub
    ctx.beginPath();
    ctx.arc(center, center, Math.min(40, radius * 0.22), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
  }, [activeCharacters]);

  // Keep rotation angle stable but redraw when list of characters changes
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning || activeCharacters.length < 2) return;

    setIsSpinning(true);
    
    const N = activeCharacters.length;
    const anglePerSegment = (Math.PI * 2) / N;

    // Pick a truly random target index
    const targetIndex = Math.floor(Math.random() * N);
    
    // Exact math to land under the pointer (at 3*PI/2)
    const targetCenter = (targetIndex + 0.5) * anglePerSegment;
    let stopAngle = (Math.PI * 1.5) - targetCenter;
    
    // Normalize to positive range [0, 2*PI]
    while (stopAngle < 0) {
      stopAngle += Math.PI * 2;
    }
    while (stopAngle >= Math.PI * 2) {
      stopAngle -= Math.PI * 2;
    }

    // Number of spins for high momentum
    const fullSpins = 6 + Math.floor(Math.random() * 4);
    const finalAngle = angleRef.current + stopAngle + (fullSpins * Math.PI * 2);
    
    angleRef.current = angleRef.current % (Math.PI * 2);
    
    const startAngle = angleRef.current;
    targetAngleRef.current = finalAngle;
    const duration = 5500;
    const startTime = performance.now();

    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      const progress = easeOutCubic(t);
      angleRef.current = startAngle + progress * (finalAngle - startAngle);

      // Determine crossed segment to tick the pointer
      const totalAngleMovement = angleRef.current - Math.PI * 1.5;
      const currentSegment = Math.floor(totalAngleMovement / anglePerSegment);
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
        onSpinComplete(activeCharacters[targetIndex]);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="wheel-wrapper">
      {/* Visual Centerpiece Wrap */}
      <div className="wheel-centerpiece">
        {/* PHYSICAL POINTER AT THE TOP */}
        <div
          className="wheel-pointer"
          style={{
            transform: `translateX(-50%) ${tickerWobble ? "rotate(-15deg)" : "rotate(0deg)"}`,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 32L6 8C5 5.5 6.5 3 9.5 3H22.5C25.5 3 27 5.5 26 8L16 32Z"
              fill="url(#goldGradient)"
              stroke="#0f0f1b"
              strokeWidth="2.5"
            />
            <path
              d="M16 26L10 9H22L16 26Z"
              fill="#fff3cc"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="goldGradient" x1="16" y1="3" x2="16" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fff3cc" />
                <stop offset="50%" stopColor="#d1a63b" />
                <stop offset="100%" stopColor="#8c6c1e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* CANVAS WHEEL */}
        <canvas
          ref={canvasRef}
          width={450}
          height={450}
          style={{
            display: "block",
            maxWidth: "100%",
            height: "auto",
            width: "450px",
            aspectRatio: "1/1",
          }}
        />

        {/* SPIN BUTTON HUB */}
        <button
          onClick={spin}
          disabled={isSpinning || activeCharacters.length < 2}
          className="wheel-spin-btn"
        >
          <span 
            className="text-[14px] font-extrabold uppercase tracking-widest text-gold"
            style={{
              fontFamily: "var(--font-header)",
              textShadow: "0 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            Spin
          </span>
          <span className="text-[9px] text-muted font-bold -mt-0.5">
            {activeCharacters.length} Active
          </span>
        </button>
      </div>

      {activeCharacters.length < 2 && (
        <div className="text-red-400 text-xs font-bold mt-4 animate-pulse">
          ⚠️ Select at least 2 characters to spin!
        </div>
      )}
    </div>
  );
}
