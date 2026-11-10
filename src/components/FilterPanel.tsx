"use client";

import React from "react";

export interface FilterState {
  rarity: string;
  element: string;
  weapon: string;
  region: string;
}

interface FilterPanelProps {
  search: string;
  setSearch: (val: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

const ELEMENT_PILLS = [
  { label: "All", value: "all", color: "", icon: "✦" },
  { label: "Anemo", value: "anemo", color: "#55ffd4", icon: "🌪️" },
  { label: "Geo", value: "geo", color: "#ffd75e", icon: "⛰️" },
  { label: "Electro", value: "electro", color: "#e285ff", icon: "⚡" },
  { label: "Dendro", value: "dendro", color: "#85eb34", icon: "🌿" },
  { label: "Hydro", value: "hydro", color: "#3cd4ff", icon: "💧" },
  { label: "Pyro", value: "pyro", color: "#ff6040", icon: "🔥" },
  { label: "Cryo", value: "cryo", color: "#9cf5ff", icon: "❄️" },
];

const REGION_PILLS = [
  { label: "All", value: "all" },
  { label: "Mondstadt", value: "mondstadt" },
  { label: "Liyue", value: "liyue" },
  { label: "Inazuma", value: "inazuma" },
  { label: "Sumeru", value: "sumeru" },
  { label: "Fontaine", value: "fontaine" },
  { label: "Natlan", value: "natlan" },
  { label: "Nod-Krai", value: "nod-krai" },
];

export default function FilterPanel({
  search,
  setSearch,
  filters,
  setFilters,
  onResetFilters,
}: FilterPanelProps) {
  const isFiltered =
    search ||
    filters.rarity !== "all" ||
    filters.element !== "all" ||
    filters.weapon !== "all" ||
    filters.region !== "all";

  return (
    <div className="filter-panel-v2 glass-panel p-5 flex flex-col gap-4 w-full">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider text-muted font-bold">Filters</h3>
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="filter-clear-all-btn"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="filter-search-wrap">
        <span className="filter-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search characters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-search-input"
        />
        {search && (
          <button onClick={() => setSearch("")} className="filter-search-clear">✕</button>
        )}
      </div>

      {/* Rarity */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">Rarity</label>
        <div className="flex gap-2">
          {[
            { label: "All", value: "all" },
            { label: "5★", value: "5" },
            { label: "4★", value: "4" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setFilters({ ...filters, rarity: r.value })}
              className={`filter-rarity-btn ${filters.rarity === r.value ? "active" : ""}`}
              style={
                filters.rarity === r.value
                  ? { background: r.value === "5" ? "rgba(224,152,44,0.18)" : r.value === "4" ? "rgba(162,86,227,0.18)" : "rgba(255,255,255,0.08)", borderColor: r.value === "5" ? "#e0982c" : r.value === "4" ? "#a256e3" : "rgba(255,255,255,0.3)" }
                  : {}
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Element */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">Element</label>
        <div className="filter-element-grid">
          {ELEMENT_PILLS.map((el) => {
            const isActive = filters.element === el.value;
            return (
              <button
                key={el.value}
                onClick={() => setFilters({ ...filters, element: el.value })}
                className={`filter-element-btn ${isActive ? "active" : ""}`}
                style={
                  isActive && el.color
                    ? { background: el.color + "22", borderColor: el.color, color: el.color }
                    : isActive
                    ? { background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.3)" }
                    : {}
                }
                title={el.label}
              >
                <span>{el.icon}</span>
                <span>{el.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weapon */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">Weapon</label>
        <div className="filter-weapon-wrap">
          {["All", "Sword", "Claymore", "Polearm", "Bow", "Catalyst"].map((w) => (
            <button
              key={w}
              onClick={() => setFilters({ ...filters, weapon: w.toLowerCase() })}
              className={`filter-weapon-btn ${filters.weapon === w.toLowerCase() ? "active" : ""}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">Region</label>
        <div className="filter-region-wrap">
          {REGION_PILLS.map((r) => (
            <button
              key={r.value}
              onClick={() => setFilters({ ...filters, region: r.value })}
              className={`filter-region-btn ${filters.region === r.value ? "active" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
