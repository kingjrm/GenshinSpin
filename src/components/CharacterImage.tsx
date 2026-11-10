"use client";

import React, { useState } from "react";

interface CharacterImageProps {
  name: string;
  src: string;
  element: string;
  rarity: number;
  className?: string;
  size?: number;
  priority?: boolean;
}

const ELEMENT_GRADIENTS: Record<string, string> = {
  Pyro:    "linear-gradient(135deg, #c0392b, #e67e22)",
  Hydro:   "linear-gradient(135deg, #1a6fa8, #2ecc71)",
  Cryo:    "linear-gradient(135deg, #74b9ff, #dfe6e9)",
  Electro: "linear-gradient(135deg, #6c3483, #a569bd)",
  Dendro:  "linear-gradient(135deg, #1e8449, #58d68d)",
  Anemo:   "linear-gradient(135deg, #148f77, #1abc9c)",
  Geo:     "linear-gradient(135deg, #9a7d0a, #d4ac0d)",
  None:    "linear-gradient(135deg, #34495e, #7f8c8d)",
};

const RARITY_BORDER: Record<number, string> = {
  5: "#e0982c",
  4: "#a256e3",
};

export default function CharacterImage({
  name,
  src,
  element,
  rarity,
  className = "",
  size = 80,
}: CharacterImageProps) {
  const [failed, setFailed] = useState(false);

  const gradient = ELEMENT_GRADIENTS[element] || ELEMENT_GRADIENTS.None;
  const border   = RARITY_BORDER[rarity] ?? "#7c7f8a";

  const getInitials = (n: string) => {
    const parts = n.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : n.slice(0, 2).toUpperCase();
  };

  const baseStyle: React.CSSProperties = {
    width:  size,
    height: size,
    minWidth: size,
    borderRadius: "50%",
    border: `2.5px solid ${border}`,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: `0 0 10px ${border}55, 0 4px 12px rgba(0,0,0,0.5)`,
  };

  if (!src || failed) {
    return (
      <div
        className={`select-none ${className}`}
        style={{ ...baseStyle, background: gradient }}
        title={name}
      >
        <span style={{
          fontSize: size * 0.33,
          fontWeight: 800,
          color: element === "Cryo" || element === "Geo" ? "#111" : "#fff",
          fontFamily: "var(--font-header)",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          letterSpacing: "0.02em",
        }}>
          {getInitials(name)}
        </span>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...baseStyle, background: "rgba(10,10,20,0.6)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={() => setFailed(true)}
        loading="lazy"
        crossOrigin="anonymous"
      />
    </div>
  );
}
