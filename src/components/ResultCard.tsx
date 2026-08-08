"use client";

import React from "react";
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Radiant Background Gacha Rays */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none animate-[pulseGlow_3s_infinite]"
        style={{
          background: `radial-gradient(circle, ${elementColor} 0%, transparent 70%)`,
        }}
      />

      <div
        className="glass-panel relative w-full max-w-sm p-8 text-center flex flex-col items-center gap-6 animate-reveal border border-gold/45"
        style={{
          background: "radial-gradient(circle at center, #1b1a30 0%, #0d0d1e 100%)",
          boxShadow: `0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px ${elementColor}25, inset 0 0 25px rgba(195,158,74,0.15)`,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card itself
      >
        {/* Sparkle Header */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">Gacha Wish Draw</span>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-md">YOU GOT!</h2>
        </div>

        {/* Big Portrait Container */}
        <div 
          className="relative rounded-full p-1 border-2 border-gold/40"
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
          <h3 className="text-2xl font-bold tracking-wide text-white">{character.name}</h3>
          
          {/* Rarity Stars */}
          <div className="flex gap-1 justify-center">{renderStars(character.rarity)}</div>

          {/* Badges Layout */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
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
          <p className="text-xs text-red-400 font-semibold bg-red-950/20 border border-red-500/20 px-3 py-1.5 rounded-md">
            Removed from the character pool.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-md bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-gold/20 cursor-pointer"
            style={{
              boxShadow: "0 4px 14px rgba(195,158,74,0.3)",
            }}
          >
            Confirm Wish
          </button>
          
          {!removeAfterSpinEnabled && (
            <button
              onClick={() => {
                onRemoveCharacter(character.name);
                onClose();
              }}
              className="w-full py-2.5 rounded-md bg-transparent hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 font-bold text-xs tracking-wider transition-all cursor-pointer"
            >
              Remove Character from Pool
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
