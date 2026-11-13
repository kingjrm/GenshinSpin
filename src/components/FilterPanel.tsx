"use client";

import React from "react";

export interface FilterState {
  rarity: string;
  elements: string[];
  weapons: string[];
  regions: string[];
  gender: "all" | "male" | "female";
  teams: string[];
}

interface FilterPanelProps {
  search: string;
  setSearch: (val: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

const ELEMENT_PILLS = [
  { label: "Anemo",   value: "anemo",   color: "#55ffd4", dot: "●" },
  { label: "Geo",     value: "geo",     color: "#ffd75e", dot: "●" },
  { label: "Electro", value: "electro", color: "#e285ff", dot: "●" },
  { label: "Dendro",  value: "dendro",  color: "#85eb34", dot: "●" },
  { label: "Hydro",   value: "hydro",   color: "#3cd4ff", dot: "●" },
  { label: "Pyro",    value: "pyro",    color: "#ff6040", dot: "●" },
  { label: "Cryo",    value: "cryo",    color: "#9cf5ff", dot: "●" },
];

const REGION_PILLS = [
  { label: "Mondstadt", value: "mondstadt" },
  { label: "Liyue",     value: "liyue" },
  { label: "Inazuma",   value: "inazuma" },
  { label: "Sumeru",    value: "sumeru" },
  { label: "Fontaine",  value: "fontaine" },
  { label: "Natlan",    value: "natlan" },
  { label: "Nod-Krai",  value: "nod-krai" },
  { label: "Snezhnaya", value: "snezhnaya" },
];

const WEAPON_TYPES = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];
const TEAMS = ["Hexerei", "Moonsign"];

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

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
    filters.elements.length > 0 ||
    filters.weapons.length > 0 ||
    filters.regions.length > 0 ||
    filters.gender !== "all" ||
    filters.teams.length > 0;

  return (
    <div className="filter-panel-v2 glass-panel p-5 flex flex-col gap-4 w-full">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider text-muted font-bold">Filters</h3>
        {isFiltered && (
          <button onClick={onResetFilters} className="filter-clear-all-btn">
            ✕ Clear
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="filter-search-wrap">
        <svg
          className="filter-search-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          type="text"
          placeholder="     Search characters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-search-input"
        />
        {search && (
          <button onClick={() => setSearch("")} className="filter-search-clear">&#10005;</button>
        )}
      </div>

      {/* Rarity */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">Rarity</label>
        <div className="flex gap-2">
          {[
            { label: "All", value: "all" },
            { label: "5\u2605", value: "5" },
            { label: "4\u2605", value: "4" },
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

      {/* Element — multi-select */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">
          Element
          {filters.elements.length > 0 && (
            <span className="filter-count-badge">{filters.elements.length}</span>
          )}
        </label>
        <div className="filter-element-grid">
          {ELEMENT_PILLS.map((el) => {
            const isActive = filters.elements.includes(el.value);
            return (
              <button
                key={el.value}
                onClick={() => setFilters({ ...filters, elements: toggleArr(filters.elements, el.value) })}
                className={`filter-element-btn ${isActive ? "active" : ""}`}
                style={
                  isActive
                    ? { background: el.color + "22", borderColor: el.color, color: el.color }
                    : {}
                }
                title={el.label}
              >
                <span style={{ color: el.color, fontSize: "0.65rem" }}>{el.dot}</span>
                <span>{el.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="filter-section-label">Gender</label>
          <div className="filter-weapon-wrap">
            {[
              { label: "All", value: "all" },
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ].map((gender) => (
              <button
                key={gender.value}
                onClick={() => setFilters({ ...filters, gender: gender.value as FilterState["gender"] })}
                className={`filter-weapon-btn ${filters.gender === gender.value ? "active" : ""}`}
              >
                {gender.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weapon — multi-select */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">
          Weapon
          {filters.weapons.length > 0 && (
            <span className="filter-count-badge">{filters.weapons.length}</span>
          )}
        </label>
        <div className="filter-weapon-wrap">
          {WEAPON_TYPES.map((w) => {
            const val = w.toLowerCase();
            const isActive = filters.weapons.includes(val);
            return (
              <button
                key={w}
                onClick={() => setFilters({ ...filters, weapons: toggleArr(filters.weapons, val) })}
                className={`filter-weapon-btn ${isActive ? "active" : ""}`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Region — multi-select */}
      <div className="flex flex-col gap-2">
        <label className="filter-section-label">
          Region
          {filters.regions.length > 0 && (
            <span className="filter-count-badge">{filters.regions.length}</span>
          )}
        </label>
        <div className="filter-region-wrap">
          {REGION_PILLS.map((r) => {
            const isActive = filters.regions.includes(r.value);
            return (
              <button
                key={r.value}
                onClick={() => setFilters({ ...filters, regions: toggleArr(filters.regions, r.value) })}
                className={`filter-region-btn ${isActive ? "active" : ""}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Teams — multi-select */}
        <div className="flex flex-col gap-2">
          <label className="filter-section-label">
            Team
            {filters.teams.length > 0 && (
              <span className="filter-count-badge">{filters.teams.length}</span>
            )}
          </label>
          <div className="filter-region-wrap">
            {TEAMS.map((team) => {
              const isActive = filters.teams.includes(team.toLowerCase());
              return (
                <button
                  key={team}
                  onClick={() => setFilters({ ...filters, teams: toggleArr(filters.teams, team.toLowerCase()) })}
                  className={`filter-region-btn ${isActive ? "active" : ""}`}
                >
                  {team}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
