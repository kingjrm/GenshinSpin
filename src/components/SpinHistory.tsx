"use client";

import React from "react";
import { Character } from "@/data/characters";
import CharacterImage from "./CharacterImage";

interface SpinHistoryProps {
  history: Character[];
  onClearHistory: () => void;
}

export default function SpinHistory({ history, onClearHistory }: SpinHistoryProps) {
  return (
    <div className="glass-panel p-6 flex flex-col w-full h-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold/10">
        <div>
          <h2 className="text-lg font-bold text-gold uppercase tracking-wider">Spin History</h2>
          <p className="text-xs text-muted font-semibold mt-0.5">Session Records</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-red-400 hover:text-red-300 font-bold border border-red-500/20 hover:border-red-500/40 bg-red-950/10 hover:bg-red-950/20 px-2 py-1 rounded transition-all cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted">
          <span className="text-2xl mb-2">📜</span>
          <p className="text-xs font-semibold">No spins recorded yet.</p>
          <p className="text-[10px] mt-1 text-muted/80">Launch the wheel to see your records here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1">
          {history.slice(0, 10).map((char, index) => {
            const displayIndex = String(history.length - index).padStart(2, "0");
            
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

            const elementColor = elementColors[char.element] || "var(--color-none)";

            return (
              <div
                key={`${char.name}-${index}`}
                className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 hover:border-gold/10 hover:bg-black/35 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold text-gold/60 w-5">
                    {displayIndex}
                  </span>
                  <CharacterImage
                    name={char.name}
                    src={char.image}
                    element={char.element}
                    rarity={char.rarity}
                    size={28}
                  />
                  <div>
                    <p className="text-xs font-medium text-white">{char.name}</p>
                    <span 
                      className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: elementColor }}
                    >
                      {char.element !== "None" ? char.element : "No Element"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted font-medium bg-white/5 px-1.5 py-0.5 rounded">
                    {char.region !== "None" ? char.region : "Lore"}
                  </span>
                  <span className="text-[10px] text-gold font-bold">
                    {char.rarity}★
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
