"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Character, charactersData } from "@/data/characters";
import CharacterImage from "./CharacterImage";

interface RosterModalProps {
  selectedNames: Set<string>;
  onToggleCharacter: (name: string) => void;
  onSelectVisible: (names: string[]) => void;
  onDeselectVisible: (names: string[]) => void;
  onResetPool: () => void;
  onClose: () => void;
}

const ELEMENTS = ["All", "Anemo", "Geo", "Electro", "Dendro", "Hydro", "Pyro", "Cryo"];
const ELEMENT_COLORS: Record<string, string> = {
  Anemo: "#55ffd4",
  Geo: "#ffd75e",
  Electro: "#e285ff",
  Dendro: "#85eb34",
  Hydro: "#3cd4ff",
  Pyro: "#ff6040",
  Cryo: "#9cf5ff",
};
const ELEMENT_ICONS: Record<string, string> = {
  Anemo: "🌪️",
  Geo: "⛰️",
  Electro: "⚡",
  Dendro: "🌿",
  Hydro: "💧",
  Pyro: "🔥",
  Cryo: "❄️",
};

export default function RosterModal({
  selectedNames,
  onToggleCharacter,
  onSelectVisible,
  onDeselectVisible,
  onResetPool,
  onClose,
}: RosterModalProps) {
  const [search, setSearch] = useState("");
  const [elementFilter, setElementFilter] = useState("All");
  const [rarityFilter, setRarityFilter] = useState<"all" | "5" | "4">("all");

  const filtered = useMemo(() => {
    return charactersData.filter((c) => {
      if (elementFilter !== "All" && c.element !== elementFilter) return false;
      if (rarityFilter !== "all" && c.rarity !== parseInt(rarityFilter)) return false;
      if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [elementFilter, rarityFilter, search]);

  const selectedCount = selectedNames.size;

  const content = (
    <div
      className="roster-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="roster-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="roster-modal-header">
          <div>
            <h2 className="roster-modal-title">Manage Roster</h2>
            <p className="roster-modal-subtitle">
              {selectedCount} of {charactersData.length} characters active
            </p>
          </div>
          <button onClick={onClose} className="roster-close-btn" aria-label="Close">✕</button>
        </div>

        {/* Controls */}
        <div className="roster-controls">
          {/* Search */}
          <div className="roster-search-wrap">
            <span className="roster-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search characters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="roster-search-input"
            />
            {search && (
              <button onClick={() => setSearch("")} className="roster-search-clear">✕</button>
            )}
          </div>

          {/* Rarity pills */}
          <div className="roster-pill-row">
            {(["all", "5", "4"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className={`roster-pill ${rarityFilter === r ? "active-gold" : ""}`}
              >
                {r === "all" ? "All ★" : r === "5" ? "5★" : "4★"}
              </button>
            ))}
          </div>

          {/* Element pills */}
          <div className="roster-element-row">
            {ELEMENTS.map((el) => (
              <button
                key={el}
                onClick={() => setElementFilter(el)}
                className={`roster-element-pill ${elementFilter === el ? "active" : ""}`}
                style={
                  elementFilter === el && el !== "All"
                    ? { background: ELEMENT_COLORS[el] + "33", borderColor: ELEMENT_COLORS[el], color: ELEMENT_COLORS[el] }
                    : {}
                }
              >
                {el !== "All" ? ELEMENT_ICONS[el] : ""} {el}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="roster-action-row">
            <button onClick={() => onSelectVisible(filtered.map(c => c.name))} className="roster-action-btn gold">
              ✓ Select All Visible ({filtered.length})
            </button>
            <button onClick={() => onDeselectVisible(filtered.map(c => c.name))} className="roster-action-btn">
              ✕ Deselect All Visible
            </button>
            <button onClick={onResetPool} className="roster-action-btn red">
              ↺ Reset to Default
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="roster-grid">
          {filtered.length === 0 ? (
            <div className="roster-empty">
              <span>🔍</span>
              <p>No characters match your filters.</p>
            </div>
          ) : (
            filtered.map((char) => {
              const isActive = selectedNames.has(char.name);
              return (
                <button
                  key={char.name}
                  onClick={() => onToggleCharacter(char.name)}
                  className={`roster-card ${isActive ? "roster-card-active" : "roster-card-inactive"}`}
                  title={`${char.name} — ${isActive ? "Click to remove" : "Click to add"}`}
                >
                  {/* Deselected overlay */}
                  {!isActive && (
                    <div className="roster-card-dim" />
                  )}
                  {/* Remove X badge */}
                  {isActive && (
                    <span className="roster-card-badge active-badge">✓</span>
                  )}
                  {!isActive && (
                    <span className="roster-card-badge inactive-badge">✕</span>
                  )}

                  <CharacterImage
                    name={char.name}
                    src={char.image}
                    element={char.element}
                    rarity={char.rarity}
                    size={56}
                  />
                  <span className="roster-card-name">{char.name}</span>
                  <span
                    className="roster-card-element"
                    style={{ color: ELEMENT_COLORS[char.element] || "#aaa" }}
                  >
                    {char.element !== "None" ? char.element : ""}
                  </span>
                  <span className="roster-card-rarity" style={{ color: char.rarity === 5 ? "var(--rarity-5)" : "var(--rarity-4)" }}>
                    {"★".repeat(char.rarity)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return content;
  return createPortal(content, document.body);
}
