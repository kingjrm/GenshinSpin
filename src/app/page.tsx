"use client";

import React, { useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { charactersData, Character } from "@/data/characters";
import { worldBosses, weeklyBosses, bossesData, Boss, getBossImageUrl } from "@/data/bosses";
import Wheel from "@/components/Wheel";
import BossWheel from "@/components/BossWheel";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import CharacterPool from "@/components/CharacterPool";
import ResultCard from "@/components/ResultCard";
import BossResultCard from "@/components/BossResultCard";
import SpinHistory from "@/components/SpinHistory";
import CharacterImage from "@/components/CharacterImage";
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

  // Boss state variables
  const [bossType, setBossType] = useState<"world" | "weekly" | "both" | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [isBossSpinning, setIsBossSpinning] = useState(false);
  const [showBossResult, setShowBossResult] = useState(false);
  const [showBossBattleOverlay, setShowBossBattleOverlay] = useState(false);

  const activeBosses = useMemo(() => {
    if (bossType === "world") return worldBosses;
    if (bossType === "weekly") return weeklyBosses;
    if (bossType === "both") return bossesData;
    return [];
  }, [bossType]);

  const teamCharacters = useMemo(() => {
    return history.slice(0, 4);
  }, [history]);

  // Automatic intro fade-out effect after 1.5 seconds
  React.useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeIntro(true);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setShowIntro(false);
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

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
      setHistory((prev) => {
        const next = [character, ...prev];
        if (next.length === 4) {
          setShowBossBattleOverlay(true);
        }
        return next;
      });
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
    setSelectedNames(new Set(charactersData.map((c) => c.name)));
    handleResetFilters();
    setResult(null);
    setHistory([]);
    setRemoveAfterSpin(false);
    // Reset boss states
    setBossType(null);
    setSelectedBoss(null);
    setIsBossSpinning(false);
    setShowBossResult(false);
    setShowBossBattleOverlay(false);
  }, [handleResetFilters]);

  const handleSpinAgainBoss = useCallback(() => {
    setSelectedBoss(null);
    setShowBossResult(false);
  }, []);

  const allCharactersSelectedGone = selectedNames.size === 0;
  const promoMessages = [
    "jeumwoo was here!",
    "ria sunget",
    "durp enge welkin sige na",
    "UY PILIPINSS!!!!!",
    "VOTE WISELY",
    "Wishing u luck on 50/50",
    "Snezhnaya na wahhhhh",
  ];

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* IMMERSIVE GACHA GATE INTRO */}
      {showIntro && (
        <div className={`intro-gate-container ${fadeIntro ? "fade-out" : ""}`}>
          <img
            src="/genspin.png"
            alt="Genspin Logo"
            className="intro-logo"
          />
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
              <div className="glass-panel result-empty-state">
                <span className="text-4xl">🎉</span>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                  All characters have been selected!
                </h2>
                <p className="text-sm text-muted">
                  You have spun and removed all 118 characters in the pool. Click below to reload the pool and spin again.
                </p>
                <button
                  onClick={handleResetWheel}
                  className="reset-empty-btn"
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

                  {history.length >= 4 && !showBossBattleOverlay && (
                    <div className="enter-boss-btn-container w-full">
                      <button
                        onClick={() => setShowBossBattleOverlay(true)}
                        className="enter-boss-battle-btn w-full"
                      >
                        ⚔️ Enter Boss Battle ⚔️
                      </button>
                    </div>
                  )}
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

      {/* BOSS BATTLE OVERLAY */}
      {showBossBattleOverlay && history.length >= 4 && typeof document !== "undefined" && createPortal(
        <div className="boss-battle-overlay" onClick={() => setShowBossBattleOverlay(false)}>
          <div className="boss-battle-section glass-panel" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowBossBattleOverlay(false)}
              className="boss-overlay-close-btn"
              aria-label="Close Boss Battle"
            >
              ✕
            </button>

            <div className="boss-battle-header-container">
              <h2 className="boss-title-header">BOSS BATTLE</h2>
              <div className="boss-divider" />
            </div>

            {bossType === null ? (
              <div className="boss-setup">
                <p className="boss-section-desc">Choose Boss Type</p>
                <div className="boss-type-buttons">
                  <button onClick={() => setBossType("world")} className="boss-type-btn">
                    World Boss
                  </button>
                  <button onClick={() => setBossType("weekly")} className="boss-type-btn">
                    Weekly Boss
                  </button>
                  <button onClick={() => setBossType("both")} className="boss-type-btn">
                    Both
                  </button>
                </div>
              </div>
            ) : selectedBoss === null ? (
              <div className="boss-wheel-container">
                <div className="boss-pool-info-bar">
                  <span className="boss-pool-label">
                    Active Pool: {bossType === "world" ? "World Bosses" : bossType === "weekly" ? "Weekly Bosses" : "All Bosses"} ({activeBosses.length})
                  </span>
                  <button onClick={() => setBossType(null)} className="boss-change-pool-btn">
                    Change Pool
                  </button>
                </div>

                <BossWheel
                  activeBosses={activeBosses}
                  onSpinComplete={(boss) => {
                    setSelectedBoss(boss);
                    setShowBossResult(true);
                  }}
                  isSpinning={isBossSpinning}
                  setIsSpinning={setIsBossSpinning}
                />
              </div>
            ) : (
              <div className="boss-matchup-container">
                <div className="matchup-grid">
                  {/* TEAM */}
                  <div className="matchup-team-card glass-panel-inner">
                    <h3 className="matchup-card-title">YOUR TEAM</h3>
                    <div className="matchup-team-portraits">
                      {teamCharacters.map((char) => (
                        <div key={char.name} className="matchup-portrait-item">
                          <CharacterImage
                            name={char.name}
                            src={char.image}
                            element={char.element}
                            rarity={char.rarity}
                            size={76}
                          />
                          <span className="matchup-portrait-name">{char.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="matchup-vs">
                    <span className="matchup-vs-text">VS</span>
                  </div>

                  {/* BOSS */}
                  <div className="matchup-boss-card glass-panel-inner">
                    <h3 className="matchup-card-title">BOSS</h3>
                    <div className="matchup-boss-content">
                      <CharacterImage
                        name={selectedBoss.name}
                        src={getBossImageUrl(selectedBoss, "portrait")}
                        element={selectedBoss.element}
                        rarity={selectedBoss.category === "Weekly Boss" ? 5 : 4}
                        size={84}
                      />
                      <div className="matchup-boss-info">
                        <span className="matchup-boss-name">{selectedBoss.name}</span>
                        <span className="matchup-boss-category" style={{
                          color: selectedBoss.category === "Weekly Boss" ? "var(--rarity-5)" : "var(--rarity-4)"
                        }}>{selectedBoss.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="matchup-actions">
                  <button onClick={handleSpinAgainBoss} className="boss-action-btn spin-again-btn">
                    SPIN AGAIN
                  </button>
                  <button onClick={handleResetWheel} className="boss-action-btn new-team-btn">
                    NEW TEAM
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* GACHA WISH REVEAL CARD OVERLAY */}
      {result && (
        <ResultCard
          character={result}
          onClose={() => setResult(null)}
          onRemoveCharacter={handleRemoveCharacter}
          removeAfterSpinEnabled={removeAfterSpin}
        />
      )}

      {/* BOSS WISH REVEAL CARD OVERLAY */}
      {showBossResult && selectedBoss && (
        <BossResultCard
          boss={selectedBoss}
          onClose={() => setShowBossResult(false)}
        />
      )}
    </main>
  );
}
