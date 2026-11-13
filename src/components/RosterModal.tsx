"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { charactersData } from "@/data/characters";
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

const RARITY_COLORS: Record<number, string> = {
  5: "#e0982c",
  4: "#a256e3",
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
      className="rm-backdrop"
      onClick={onClose}
    >
      <div
        className="rm-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="rm-header">
          <div className="rm-header-info">
            <h2 className="rm-title">Manage Roster</h2>
            <p className="rm-subtitle">
              <span className="rm-count-badge">{selectedCount}</span>
              &nbsp;of {charactersData.length} characters in pool
            </p>
          </div>
          <button onClick={onClose} className="rm-close-btn" aria-label="Close">
            ✕
          </button>
        </div>

        {/* ── CONTROLS ── */}
        <div className="rm-controls">
          {/* Search */}
          <div className="rm-search-wrap">
            <span className="rm-search-icon"></span>
            <input
              type="text"
              placeholder="Search characters…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rm-search-input"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch("")} className="rm-search-clear">✕</button>
            )}
          </div>

          {/* Filter row: rarity + element */}
          <div className="rm-filter-row">
            {/* Rarity */}
            <div className="rm-pill-group">
              {(["all", "5", "4"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r)}
                  className={`rm-pill ${rarityFilter === r ? "rm-pill-active" : ""}`}
                  style={rarityFilter === r && r !== "all" ? {
                    background: `${RARITY_COLORS[parseInt(r)]}22`,
                    borderColor: RARITY_COLORS[parseInt(r)],
                    color: RARITY_COLORS[parseInt(r)],
                  } : {}}
                >
                  {r === "all" ? "All ★" : `${r}★`}
                </button>
              ))}
            </div>

            <div className="rm-divider" />

            {/* Elements */}
            <div className="rm-pill-group rm-pill-group-wrap">
              {ELEMENTS.map((el) => (
                <button
                  key={el}
                  onClick={() => setElementFilter(el)}
                  className={`rm-pill ${elementFilter === el ? "rm-pill-active" : ""}`}
                  style={elementFilter === el && el !== "All" ? {
                    background: `${ELEMENT_COLORS[el]}22`,
                    borderColor: ELEMENT_COLORS[el],
                    color: ELEMENT_COLORS[el],
                  } : {}}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="rm-action-row">
            <button
              onClick={() => onSelectVisible(filtered.map(c => c.name))}
              className="rm-action-btn rm-btn-gold"
            >
              Select All ({filtered.length})
            </button>
            <button
              onClick={() => onDeselectVisible(filtered.map(c => c.name))}
              className="rm-action-btn"
            >
              ✕ Deselect All
            </button>
            <button onClick={onResetPool} className="rm-action-btn rm-btn-red">
              ↺ Reset to Default
            </button>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="rm-grid">
          {filtered.length === 0 ? (
            <div className="rm-empty">
              <span style={{ fontSize: "2rem" }}>🔍</span>
              <p>No characters match your filters.</p>
            </div>
          ) : (
            filtered.map((char) => {
              const isActive = selectedNames.has(char.name);
              const elColor = ELEMENT_COLORS[char.element] ?? "#aaa";
              const rarColor = RARITY_COLORS[char.rarity] ?? "#7c7f8a";

              return (
                <button
                  key={char.name}
                  onClick={() => onToggleCharacter(char.name)}
                  className={`rm-card ${isActive ? "rm-card-on" : "rm-card-off"}`}
                  title={`${char.name} — ${isActive ? "click to remove" : "click to add"}`}
                  style={{
                    "--el-color": elColor,
                    "--rar-color": rarColor,
                  } as React.CSSProperties}
                >
                  {/* Rarity bar at top */}
                  <div className="rm-card-rarity-bar" style={{ background: rarColor }} />

                  {/* Portrait */}
                  <div className="rm-card-portrait-wrap">
                    <CharacterImage
                      name={char.name}
                      src={char.image}
                      element={char.element}
                      rarity={char.rarity}
                      size={72}
                    />
                    {/* Inactive overlay */}
                    {!isActive && <div className="rm-card-off-overlay" />}
                    {/* Status badge */}
                    <span
                      className={`rm-card-status ${isActive ? "rm-status-on" : "rm-status-off"}`}
                      aria-label={isActive ? "In roster" : "Not in roster"}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {isActive
                          ? <path d="m5 12 4 4L19 6" />
                          : <path d="m7 7 10 10M17 7 7 17" />}
                      </svg>
                    </span>
                  </div>

                  {/* Info */}
                  <div className="rm-card-info">
                    <span className="rm-card-name">{char.name}</span>
                    <span className="rm-card-el" style={{ color: elColor }}>
                      {char.element !== "None" ? char.element : ""}
                    </span>
                  </div>
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
