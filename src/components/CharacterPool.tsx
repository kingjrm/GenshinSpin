"use client";

import React from "react";
import { Character } from "@/data/characters";
import CharacterImage from "./CharacterImage";

interface CharacterPoolProps {
  characters: Character[];
  selectedNames: Set<string>;
  onToggleCharacter: (name: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onResetPool: () => void;
  totalCount: number;
}

export default function CharacterPool({
  characters,
  selectedNames,
  onToggleCharacter,
  onSelectAll,
  onDeselectAll,
  onResetPool,
  totalCount,
}: CharacterPoolProps) {
  const selectedCount = selectedNames.size;

  return (
    <div className="glass-panel p-6 flex flex-col h-full w-full">
      {/* Pool Header Controls */}
      <div className="pool-header">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-gold uppercase tracking-wider">Character Pool</h2>
          <span className="text-xs text-muted font-bold">
            {selectedCount}/{totalCount} Active
          </span>
        </div>
        <div className="capsule-btn-group">
          <button
            onClick={onSelectAll}
            className="capsule-btn capsule-btn-gold"
          >
            Select Visible
          </button>
          <button
            onClick={onDeselectAll}
            className="capsule-btn"
          >
            Clear Visible
          </button>
          <button
            onClick={onResetPool}
            className="capsule-btn"
            style={{ color: "var(--color-pyro)", borderColor: "rgba(255, 96, 64, 0.2)" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Pool List Scroll Area */}
      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted">
          <span className="text-2xl mb-2">🔍</span>
          <p className="text-xs font-semibold">No matches found.</p>
          <p className="text-[10px] mt-1">Try adjusting the filter categories.</p>
        </div>
      ) : (
        <div
          className="overflow-y-auto pr-1"
          style={{
            maxHeight: "380px",
            minHeight: "200px",
          }}
        >
          <div className="pool-list-container">
            {characters.map((char) => {
              const isChecked = selectedNames.has(char.name);

              return (
                <div
                  key={char.name}
                  onClick={() => onToggleCharacter(char.name)}
                  className={`pool-row ${isChecked ? "active" : "inactive"}`}
                >
                  <div className="pool-row-left">
                    <CharacterImage
                      name={char.name}
                      src={char.image}
                      element={char.element}
                      rarity={char.rarity}
                      size={32}
                    />
                    <div className="pool-row-info">
                      <span className="pool-char-name">{char.name}</span>
                      <span className="pool-char-meta">
                        {char.rarity}★ | {char.element !== "None" ? char.element : "No Element"} | {char.weapon !== "None" ? char.weapon : "No Weapon"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent div click
                      onToggleCharacter(char.name);
                    }}
                    className="pool-toggle-btn"
                  >
                    {isChecked ? "Active" : "Disabled"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
