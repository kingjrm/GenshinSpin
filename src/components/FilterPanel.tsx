"use client";

import React from "react";

export interface FilterState {
  rarity: string; // "all", "5", "4"
  element: string; // "all", elements...
  weapon: string; // "all", weapons...
  region: string; // "all", regions...
}

interface FilterPanelProps {
  search: string;
  setSearch: (val: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export default function FilterPanel({
  search,
  setSearch,
  filters,
  setFilters,
  onResetFilters,
}: FilterPanelProps) {
  const elements = ["All", "Anemo", "Geo", "Electro", "Dendro", "Hydro", "Pyro", "Cryo", "None"];
  const weapons = ["All", "Sword", "Claymore", "Polearm", "Bow", "Catalyst", "None"];
  const regions = [
    "All",
    "Mondstadt",
    "Liyue",
    "Inazuma",
    "Sumeru",
    "Fontaine",
    "Natlan",
    "Snezhnaya",
    "Nod-Krai",
    "None",
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs uppercase tracking-wider text-muted font-bold">Search & Filters</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors text-sm font-bold"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        }}
      >
        {/* Rarity Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-muted font-bold">Rarity</label>
          <select
            value={filters.rarity}
            onChange={(e) => handleFilterChange("rarity", e.target.value)}
            className="w-full text-sm"
          >
            <option value="all">All Rarities</option>
            <option value="5">★ ★ ★ ★ ★ (5 Star)</option>
            <option value="4">★ ★ ★ ★ (4 Star)</option>
          </select>
        </div>

        {/* Element Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-muted font-bold">Element</label>
          <select
            value={filters.element}
            onChange={(e) => handleFilterChange("element", e.target.value)}
            className="w-full text-sm"
          >
            {elements.map((el) => (
              <option key={el} value={el.toLowerCase()}>
                {el}
              </option>
            ))}
          </select>
        </div>

        {/* Weapon Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-muted font-bold">Weapon</label>
          <select
            value={filters.weapon}
            onChange={(e) => handleFilterChange("weapon", e.target.value)}
            className="w-full text-sm"
          >
            {weapons.map((w) => (
              <option key={w} value={w.toLowerCase()}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-muted font-bold">Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange("region", e.target.value)}
            className="w-full text-sm"
          >
            {regions.map((r) => (
              <option key={r} value={r.toLowerCase()}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Reset Filters Button */}
      {(search ||
        filters.rarity !== "all" ||
        filters.element !== "all" ||
        filters.weapon !== "all" ||
        filters.region !== "all") && (
        <button
          onClick={onResetFilters}
          className="text-xs text-gold hover:text-gold-hover underline cursor-pointer self-end transition-all"
        >
          Clear Active Filters
        </button>
      )}
    </div>
  );
}
