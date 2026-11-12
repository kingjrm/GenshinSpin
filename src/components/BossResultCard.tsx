"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Boss } from "@/data/bosses";
import BossImage from "./BossImage";

interface BossResultCardProps {
  boss: Boss | null;
  onClose: () => void;
  challengerName: string;
  onChallengerNameChange: (name: string) => void;
  challengeDateTime: string;
}

export default function BossResultCard({
  boss,
  onClose,
  challengerName,
  onChallengerNameChange,
  challengeDateTime,
}: BossResultCardProps) {
  if (!boss) return null;

  const regionColors: Record<string, string> = {
    Mondstadt: "var(--color-anemo)", // Teal/Cyan
    Liyue: "var(--color-geo)",       // Gold/Yellow
    Inazuma: "var(--color-electro)", // Purple
    Sumeru: "var(--color-dendro)",   // Green
    Fontaine: "var(--color-hydro)",  // Blue
    Natlan: "var(--color-pyro)",     // Red/Orange
    Snezhnaya: "var(--color-cryo)",  // Cryo Light Blue
    "Nod-Krai": "var(--color-none)", // Silver/Grey
    None: "var(--color-none)",
  };

  const themeColor = regionColors[boss.region] || "var(--color-none)";
  const rarity = boss.category === "Weekly Boss" ? 5 : 4;

  const renderStars = (starCount: number) => {
    return Array.from({ length: starCount }).map((_, i) => (
      <span key={i} className="text-xl text-gold drop-shadow-[0_0_8px_rgba(224,152,44,0.8)]">
        ★
      </span>
    ));
  };

  const overlay = (
    <div
      className="result-overlay"
      onClick={onClose}
    >
      {/* Radiant Background Gacha Rays */}
      <div 
        className="result-glow"
        style={{
          background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
        }}
      />

      <div
        className="result-card-container"
        style={{
          background: "radial-gradient(circle at center, rgba(28, 35, 52, 0.98) 0%, rgba(9, 12, 18, 0.98) 100%)",
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.75), 0 0 30px ${themeColor}25, inset 0 0 25px rgba(255,255,255,0.05)`,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card itself
      >
        {/* Watermark */}
        <div className="card-signature">Genspin by Rom</div>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Challenge Awaits</span>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-md">BOSS SELECTED!</h2>
        </div>

        {/* Big Portrait Container */}
        <div 
          className="result-portrait-wrap"
          style={{
            boxShadow: `0 0 30px ${themeColor}40`,
          }}
        >
          <BossImage
            boss={boss}
            size={160}
            shape="rect"
          />
        </div>

        {/* Boss Title Info */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-wide text-white text-center">{boss.name}</h3>
          
          {/* Rarity Stars */}
          <div className="result-stars">{renderStars(rarity)}</div>

          {/* Badges Layout */}
          <div className="result-tags">
            <span
              className="element-tag"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              {boss.category}
            </span>
            {boss.region !== "None" && (
              <span className="element-tag text-gold/80 border-gold/10">
                {boss.region}
              </span>
            )}
          </div>
        </div>

        <div className="boss-challenger-form">
          <label htmlFor="challenger-name" className="boss-challenger-label">
            Challenger
          </label>
          <input
            id="challenger-name"
            type="text"
            value={challengerName}
            onChange={(event) => onChallengerNameChange(event.target.value)}
            placeholder="Enter challenger name"
            className="boss-challenger-input"
            autoFocus
          />
          <label htmlFor="challenge-date-time" className="boss-challenger-label">
            Date &amp; time
          </label>
          <input
            id="challenge-date-time"
            type="datetime-local"
            value={challengeDateTime}
            readOnly
            className="boss-challenger-input"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="result-btn-confirm"
          >
            Acknowledge Challenge
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return overlay;
  }

  return createPortal(overlay, document.body);
}
