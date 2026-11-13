"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Character } from "@/data/characters";
import CharacterImage from "./CharacterImage";

interface ResultCardProps {
  character: Character | null;
  onClose: () => void;
  onRemoveCharacter: (name: string) => void;
  removeAfterSpinEnabled: boolean;
}

export default function ResultCard({
  character,
  onClose,
  onRemoveCharacter,
  removeAfterSpinEnabled,
}: ResultCardProps) {
  if (!character) return null;

  const elementColors: Record<string, string> = {
    Pyro: "var(--color-pyro)",
    Hydro: "var(--color-hydro)",
    Cryo: "var(--color-cryo)",
    Electro: "var(--color-electro)",
    Dendro: "var(--color-dendro)",
    Anemo: "var(--color-anemo)",
    Geo: "var(--color-geo)",
    None: "var(--color-none)",
  };

  const elementColor = elementColors[character.element] || "var(--color-none)";

  // Stars renderer
  const renderStars = (rarity: number) => {
    return Array.from({ length: rarity }).map((_, i) => (
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
          background: `radial-gradient(circle, ${elementColor} 0%, transparent 70%)`,
        }}
      />

      <div
        className="result-card-container"
        style={{
          background: "radial-gradient(circle at center, rgba(28, 35, 52, 0.98) 0%, rgba(9, 12, 18, 0.98) 100%)",
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.75), 0 0 30px ${elementColor}25, inset 0 0 25px rgba(255,255,255,0.05)`,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card itself
      >
        {/* Sparkle Header */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Winner Reveal</span>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-md">YOU GOT!</h2>
        </div>

        {/* Big Portrait Container */}
        <div 
          className="result-portrait-wrap"
          style={{
            boxShadow: `0 0 30px ${elementColor}40`,
          }}
        >
          <CharacterImage
            name={character.name}
            src={character.image}
            element={character.element}
            rarity={character.rarity}
            size={140}
            priority={true}
          />
        </div>

        {/* Character Title Info */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-wide text-white text-center">{character.name}</h3>
          
          {/* Rarity Stars */}
          <div className="result-stars">{renderStars(character.rarity)}</div>

          {/* Badges Layout */}
          <div className="result-tags">
            <span
              className="element-tag"
              style={{ color: elementColor, borderColor: `${elementColor}40` }}
            >
              {character.element !== "None" ? character.element : "No Element"}
            </span>
            {character.weapon !== "None" && (
              <span className="element-tag text-white/80 border-white/10">
                {character.weapon}
              </span>
            )}
            {character.region !== "None" && (
              <span className="element-tag text-gold/80 border-gold/10">
                {character.region}
              </span>
            )}
          </div>
        </div>

        {/* Removal Indicator */}
        {removeAfterSpinEnabled && (
          <p className="result-remove-notice">
            Removed from the character pool.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="result-btn-confirm"
          >
            Confirm Wish
          </button>
          
          {!removeAfterSpinEnabled && (
            <button
              onClick={() => {
                onRemoveCharacter(character.name);
                onClose();
              }}
              className="result-btn-remove"
            >
              Remove Character from Pool
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return overlay;
  }

  return createPortal(overlay, document.body);
}
