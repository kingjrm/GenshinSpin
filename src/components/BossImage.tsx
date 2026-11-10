"use client";

import React, { useState } from "react";
import { Boss, getBossImageUrl, getRegionElement } from "@/data/bosses";

const REGION_GRADIENTS: Record<string, string> = {
  Mondstadt:  "linear-gradient(135deg, #148f77, #1abc9c)",
  Liyue:      "linear-gradient(135deg, #9a7d0a, #d4ac0d)",
  Inazuma:    "linear-gradient(135deg, #6c3483, #a569bd)",
  Sumeru:     "linear-gradient(135deg, #1e8449, #58d68d)",
  Fontaine:   "linear-gradient(135deg, #1a6fa8, #3498db)",
  Natlan:     "linear-gradient(135deg, #c0392b, #e67e22)",
  Snezhnaya:  "linear-gradient(135deg, #74b9ff, #dfe6e9)",
  "Nod-Krai": "linear-gradient(135deg, #34495e, #95a5a6)",
  None:       "linear-gradient(135deg, #2c3e50, #7f8c8d)",
};

const REGION_BORDER: Record<string, string> = {
  Mondstadt:  "#1abc9c",
  Liyue:      "#d4ac0d",
  Inazuma:    "#a569bd",
  Sumeru:     "#58d68d",
  Fontaine:   "#3498db",
  Natlan:     "#e67e22",
  Snezhnaya:  "#9cf5ff",
  "Nod-Krai": "#95a5a6",
  None:       "#7f8c8d",
};

// Get a secondary CDN url (direct static.wikia.nocookie.net)
// Fandom image paths follow the pattern: /X/YY/Filename.png
// We can't predict the hash without knowing it, so we just use Fandom redirect as primary
// and show fallback art on failure
function getSecondaryUrl(boss: Boss): string {
  // Try gi.yatta.moe which sometimes has boss thumbnails via different naming
  const sanitized = boss.name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/ +/g, "_");
  return `https://gi.yatta.moe/assets/UI/monster/UI_MonsterIcon_${sanitized}.png`;
}

interface BossImageProps {
  boss: Boss;
  size?: number;
  shape?: "circle" | "rect";
  className?: string;
}

export default function BossImage({
  boss,
  size = 120,
  shape = "circle",
  className = "",
}: BossImageProps) {
  const [stage, setStage] = useState<"primary" | "secondary" | "fallback">("primary");

  const primaryUrl = getBossImageUrl(boss, "portrait");
  const secondaryUrl = getSecondaryUrl(boss);

  const gradient = REGION_GRADIENTS[boss.region] ?? REGION_GRADIENTS.None;
  const border   = REGION_BORDER[boss.region]    ?? REGION_BORDER.None;
  const element  = getRegionElement(boss.region);

  const borderRadius = shape === "circle" ? "50%" : "14px";

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius,
    border: `2.5px solid ${border}`,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: `0 0 14px ${border}55, 0 4px 16px rgba(0,0,0,0.6)`,
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (stage === "fallback") {
    return (
      <div
        className={`select-none ${className}`}
        style={{ ...baseStyle, background: gradient }}
        title={boss.name}
      >
        <span style={{
          fontSize: size * 0.28,
          fontWeight: 800,
          color: element === "Cryo" || element === "Geo" ? "#111" : "#fff",
          fontFamily: "var(--font-header)",
          textShadow: "0 1px 6px rgba(0,0,0,0.7)",
          letterSpacing: "0.02em",
          textAlign: "center",
          padding: "4px",
          lineHeight: 1.1,
        }}>
          {getInitials(boss.name)}
        </span>
      </div>
    );
  }

  const currentSrc = stage === "primary" ? primaryUrl : secondaryUrl;

  return (
    <div className={className} style={{ ...baseStyle, background: "rgba(10,10,20,0.6)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt={boss.name}
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={() => {
          if (stage === "primary") setStage("secondary");
          else setStage("fallback");
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
