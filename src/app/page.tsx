"use client";

import React, { useState, useMemo, useCallback } from "react";
import { charactersData, Character } from "@/data/characters";
import Wheel from "@/components/Wheel";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import CharacterPool from "@/components/CharacterPool";
import ResultCard from "@/components/ResultCard";
import SpinHistory from "@/components/SpinHistory";
import "./page.css";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeIntro, setFadeIntro] = useState(false);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(
    () => new Set(charactersData.map((c) => c.name))
  );
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    rarity: "all",
    element: "all",
    weapon: "all",
    region: "all",
  });
  const [result, setResult] = useState<Character | null>(null);
  const [history, setHistory] = useState<Character[]>([]);
  const [removeAfterSpin, setRemoveAfterSpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Compute characters matching search/filter dropdowns
  const filteredCharacters = useMemo(() => {
    return charactersData.filter((char) => {
      // Search filter
      if (search.trim() !== "") {
        const query = search.toLowerCase();
        if (!char.name.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Rarity filter
      if (filters.rarity !== "all") {
        if (char.rarity !== parseInt(filters.rarity)) {
          return false;
        }
      }
      // Element filter
      if (filters.element !== "all") {
        if (char.element.toLowerCase() !== filters.element) {
          return false;
        }
      }
      // Weapon filter
      if (filters.weapon !== "all") {
        if (char.weapon.toLowerCase() !== filters.weapon) {
          return false;
        }
      }
      // Region filter
      if (filters.region !== "all") {
        if (char.region.toLowerCase() !== filters.region) {
          return false;
        }
      }
      return true;
    });
  }, [search, filters]);

  // Compute active characters drawn on the wheel (must be filtered AND selected in pool)
  const activeCharacters = useMemo(() => {
    return filteredCharacters.filter((char) => selectedNames.has(char.name));
  }, [filteredCharacters, selectedNames]);

  // Rarity distribution stats
  const stats = useMemo(() => {
    let fiveStar = 0;
    let fourStar = 0;
    activeCharacters.forEach((char) => {
      if (char.rarity === 5) fiveStar++;
      else if (char.rarity === 4) fourStar++;
    });
    return { fiveStar, fourStar };
  }, [activeCharacters]);

  // Toggles character status in pool
  const handleToggleCharacter = useCallback((name: string) => {
    if (isSpinning) return;
    setSelectedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, [isSpinning]);

  // Select all visible characters matching current filters
  const handleSelectAll = useCallback(() => {
    if (isSpinning) return;
    setSelectedNames((prev) => {
      const next = new Set(prev);
      filteredCharacters.forEach((char) => next.add(char.name));
      return next;
    });
  }, [filteredCharacters, isSpinning]);

  // Deselect all visible characters matching current filters
  const handleDeselectAll = useCallback(() => {
    if (isSpinning) return;
    setSelectedNames((prev) => {
      const next = new Set(prev);
      filteredCharacters.forEach((char) => next.delete(char.name));
      return next;
    });
  }, [filteredCharacters, isSpinning]);

  // Reset the pool to default checked state (all 118 checked)
  const handleResetPool = useCallback(() => {
    if (isSpinning) return;
    setSelectedNames(new Set(charactersData.map((c) => c.name)));
  }, [isSpinning]);

  // Reset all filters to default
  const handleResetFilters = useCallback(() => {
    setSearch("");
    setFilters({
      rarity: "all",
      element: "all",
      weapon: "all",
      region: "all",
    });
  }, []);

  // Remove single character from pool
  const handleRemoveCharacter = useCallback((name: string) => {
    setSelectedNames((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }, []);

  // Spin complete handler
  const handleSpinComplete = useCallback(
    (character: Character) => {
      setResult(character);
      setHistory((prev) => [character, ...prev]);
      if (removeAfterSpin) {
        handleRemoveCharacter(character.name);
      }
    },
    [removeAfterSpin, handleRemoveCharacter]
  );

  // Clear spin history list
  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Global reset wheel
  const handleResetWheel = useCallback(() => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the wheel? This will restore all characters, clear your spin history, and reset all search filters."
    );
    if (confirmReset) {
      setSelectedNames(new Set(charactersData.map((c) => c.name)));
      handleResetFilters();
      setResult(null);
      setHistory([]);
      setRemoveAfterSpin(false);
    }
  }, [handleResetFilters]);

  const allCharactersSelectedGone = selectedNames.size === 0;
  const promoMessages = [
    "jeumwoo was here!",
    "ria sunget",
    "durp enge welkin sige na",
  ];

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* IMMERSIVE GACHA GATE INTRO */}
      {showIntro && (
        <div className={`intro-gate-container ${fadeIntro ? "fade-out" : ""}`}>
          <div className="intro-content">
            <span className="intro-subtitle">Genshin Wish Chamber</span>
            <h1 className="intro-title">Destiny Wheel</h1>
            <p className="intro-desc">
              Summon your fate. Spin the wheel to randomly select from all 118 Genshin Impact characters. Customize active pools, filter by element or weapon type, and compile your history.
            </p>
            <button
              onClick={() => {
                setFadeIntro(true);
                setTimeout(() => setShowIntro(false), 800);
              }}
              className="intro-btn"
            >
              Enter Wish Chamber
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD LAYOUT */}
      <div className="app-container">
        <div className="promo-bar" aria-label="Promotional notification strip">
          <div className="promo-bar-track">
            {[...promoMessages, ...promoMessages].map((message, index) => (
              <span key={`${message}-${index}`} className="promo-pill">
                {message}
              </span>
            ))}
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="dashboard-grid">
          {/* COLUMN 1: Search & Filter and Character Pool */}
          <aside className="sidebar-left">
            <FilterPanel
              search={search}
              setSearch={setSearch}
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetFilters}
            />
            <CharacterPool
              characters={filteredCharacters}
              selectedNames={selectedNames}
              onToggleCharacter={handleToggleCharacter}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onResetPool={handleResetPool}
              totalCount={charactersData.length}
            />
          </aside>

          {/* COLUMN 2: Spin Wheel Centerpiece */}
          <section className="center-area">
            {allCharactersSelectedGone ? (
              /* ALL CHARACTERS SELECTED SCREEN */
              <div className="glass-panel result-empty-state p-10 text-center flex flex-col items-center gap-6 max-w-md w-full animate-fade-in border-red-500/25">
                <span className="text-4xl">🎉</span>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                  All characters have been selected!
                </h2>
                <p className="text-sm text-muted">
                  You have spun and removed all 118 characters in the pool. Click below to reload the pool and spin again.
                </p>
                <button
                  onClick={handleResetWheel}
                  className="px-6 py-3.5 rounded bg-gold text-black font-extrabold tracking-wider text-xs uppercase hover:bg-gold-hover transition-all cursor-pointer shadow-lg shadow-gold/10"
                >
                  Reset Wheel
                </button>
              </div>
            ) : (
              /* ACTIVE WHEEL VIEW */
              <>
                <Wheel
                  activeCharacters={activeCharacters}
                  onSpinComplete={handleSpinComplete}
                  isSpinning={isSpinning}
                  setIsSpinning={setIsSpinning}
                />

                {/* Toggle controls below the wheel */}
                <div className="flex flex-col gap-4 w-full max-w-[450px]">
                  <div className="toggle-card">
                    <div className="toggle-label">
                      <span className="toggle-title">Remove after spin</span>
                      <span className="toggle-desc">Automatically remove selected characters</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={removeAfterSpin}
                        onChange={(e) => setRemoveAfterSpin(e.target.checked)}
                        disabled={isSpinning}
                      />
                      <span className="slider" />
                    </label>
                  </div>

                  <div className="reset-btn-container">
                    <button onClick={handleResetWheel} className="master-reset-btn w-full">
                      Reset Wheel State
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* COLUMN 3: Spin History & Stats Panel */}
          <aside className="sidebar-right">
            <div className="glass-panel p-5 flex flex-col gap-3">
              <h3 className="text-xs uppercase tracking-wider text-muted font-bold">Active Pool Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="text-[10px] text-muted uppercase font-bold">Active</span>
                  <span className="stat-val">{activeCharacters.length}</span>
                </div>
                <div className="stat-item">
                  <span className="text-[10px] text-muted uppercase font-bold">Filtered</span>
                  <span className="stat-val">{filteredCharacters.length}</span>
                </div>
                <div className="stat-item">
                  <span className="text-[10px] text-muted uppercase font-bold">5★ Stars</span>
                  <span className="stat-val text-gold" style={{ color: "var(--rarity-5)" }}>
                    {stats.fiveStar}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="text-[10px] text-muted uppercase font-bold">4★ Stars</span>
                  <span className="stat-val text-purple" style={{ color: "var(--rarity-4)" }}>
                    {stats.fourStar}
                  </span>
                </div>
              </div>
            </div>

            <SpinHistory history={history} onClearHistory={handleClearHistory} />
          </aside>
        </div>
      </div>

      {/* GACHA WISH REVEAL CARD OVERLAY */}
      {result && (
        <ResultCard
          character={result}
          onClose={() => setResult(null)}
          onRemoveCharacter={handleRemoveCharacter}
          removeAfterSpinEnabled={removeAfterSpin}
        />
      )}
    </main>
  );
}
