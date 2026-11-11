"use client";

import React from "react";
import { Character } from "@/data/characters";
import CharacterImage from "./CharacterImage";

interface SpinHistoryProps {
  history: Character[];
  onClearHistory: () => void;
}

export default function SpinHistory({ history, onClearHistory }: SpinHistoryProps) {
  // Show last 10 spins, most recent first; index = spin number in session
  const displayed = history.slice(0, 10);

  return (
    <div className="glass-panel history-panel p-5 flex flex-col w-full h-full">
      <div className="history-header">
        <div>
          <h2 className="history-title">Spin History</h2>
          <p className="history-subtitle">Session Records</p>
        </div>
        {history.length > 0 && (
          <button onClick={onClearHistory} className="history-clear-btn">
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty-state">
          <span className="history-empty-icon" style={{ fontFamily: "var(--font-header)", fontSize: "1.5rem", color: "var(--text-gold)", opacity: 0.4 }}>&#9654;</span>
          <p className="history-empty-title">No spins recorded yet.</p>
          <p className="history-empty-text">Launch the wheel to see your records here.</p>
        </div>
      ) : (
        <div className="history-list overflow-y-auto max-h-[300px] pr-1">
          {displayed.map((char, index) => {
            // Spin #1 = most recent, counting up from newest
            const spinNumber = String(index + 1).padStart(2, "0");

            const elementColors: Record<string, string> = {
              Pyro:    "var(--color-pyro)",
              Hydro:   "var(--color-hydro)",
              Cryo:    "var(--color-cryo)",
              Electro: "var(--color-electro)",
              Dendro:  "var(--color-dendro)",
              Anemo:   "var(--color-anemo)",
              Geo:     "var(--color-geo)",
              None:    "var(--color-none)",
            };

            const elementColor = elementColors[char.element] || "var(--color-none)";

            return (
              <div
                key={`${char.name}-${index}`}
                className="history-item"
              >
                <div className="history-left">
                  <span className="history-index">{spinNumber}</span>
                  <CharacterImage
                    name={char.name}
                    src={char.image}
                    element={char.element}
                    rarity={char.rarity}
                    size={28}
                  />
                  <div className="history-text">
                    <p className="history-name">{char.name}</p>
                    <span className="history-element" style={{ color: elementColor }}>
                      {char.element !== "None" ? char.element : "No Element"}
                    </span>
                  </div>
                </div>

                <div className="history-meta">
                  <span className="history-region">
                    {char.region !== "None" ? char.region : "Lore"}
                  </span>
                  <span className="history-rarity">
                    {char.rarity}&#9733;
                  </span>
                </div>
              </div>
            );
          })}
          {history.length > 10 && (
            <p style={{ textAlign: "center", fontSize: "0.65rem", color: "var(--text-muted)", padding: "8px 0" }}>
              +{history.length - 10} more (showing last 10)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
