"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CharacterImageProps {
  name: string;
  src: string;
  element: string;
  rarity: number;
  className?: string;
  size?: number;
  priority?: boolean;
}

export default function CharacterImage({
  name,
  src,
  element,
  rarity,
  className = "",
  size = 80,
  priority = false,
}: CharacterImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // Extract initials (e.g., "Raiden Shogun" -> "RS", "Albedo" -> "AL")
  const getInitials = (charName: string) => {
    const parts = charName.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return charName.slice(0, 2).toUpperCase();
  };

  const elementColors: Record<string, string> = {
    Pyro: "linear-gradient(135deg, #ff4d4d, #ff9933)",
    Hydro: "linear-gradient(135deg, #3399ff, #33ffff)",
    Cryo: "linear-gradient(135deg, #99ffff, #ffffff)",
    Electro: "linear-gradient(135deg, #cc33ff, #ff66ff)",
    Dendro: "linear-gradient(135deg, #33cc33, #99ff33)",
    Anemo: "linear-gradient(135deg, #00ffcc, #66ffa6)",
    Geo: "linear-gradient(135deg, #ffcc00, #ffaa00)",
    None: "linear-gradient(135deg, #7a7d85, #b0b3b8)",
  };

  const gradient = elementColors[element] || elementColors.None;

  if (!src || failedSrc === src) {
    return (
      <div
        className={`relative flex items-center justify-center select-none font-semibold ${className}`}
        style={{
          width: size,
          height: size,
          background: gradient,
          borderRadius: "50%",
          boxShadow: `0 0 12px rgba(0,0,0,0.4), inset 0 0 10px rgba(255,255,255,0.4)`,
          color: element === "Cryo" || element === "Anemo" ? "#111" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.35,
          fontFamily: "var(--font-header)",
          border: `2px solid ${rarity === 5 ? "var(--rarity-5)" : "var(--rarity-4)"}`,
          textShadow: element === "Cryo" || element === "Anemo" ? "none" : "0 2px 4px rgba(0,0,0,0.6)",
        }}
        title={`${name} (${element})`}
      >
        <span>{getInitials(name)}</span>
        <span
          className="absolute text-[8px] uppercase tracking-wider font-bold"
          style={{
            bottom: size * 0.08,
            fontSize: size * 0.14,
            opacity: 0.8,
            fontFamily: "var(--font-body)",
          }}
        >
          {element !== "None" ? element : ""}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${rarity === 5 ? "var(--rarity-5)" : "var(--rarity-4)"}`,
        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.4), 0 0 8px ${
          rarity === 5 ? "rgba(224, 152, 44, 0.2)" : "rgba(162, 86, 227, 0.2)"
        }`,
        background: "rgba(20, 20, 35, 0.5)",
      }}
    >
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-300"
        onError={() => setFailedSrc(src)}
        priority={priority}
        unoptimized // Allows downloading from CDN directly without sizing queries
      />
    </div>
  );
}
