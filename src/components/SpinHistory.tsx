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
    <div className="glass-panel history-panel p-5 flex flex-col w-full h-full">
      <div className="history-header">
        <div>
          <h2 className="history-title">Spin History</h2>
          <p className="history-subtitle">Session Records</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="history-clear-btn"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty-state">
          <span className="history-empty-icon">📜</span>
          <p className="history-empty-title">No spins recorded yet.</p>
          <p className="history-empty-text">Launch the wheel to see your records here.</p>
        </div>
      ) : (
        <div className="history-list overflow-y-auto max-h-[300px] pr-1">
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
                className="history-item"
              >
                <div className="history-left">
                  <span className="history-index">
                    {displayIndex}
                  </span>
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
