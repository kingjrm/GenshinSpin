"use client";

import React, { useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { charactersData, Character } from "@/data/characters";
import { worldBosses, weeklyBosses, localLegends, bossesData, Boss, getBossImageUrl, getRegionElement } from "@/data/bosses";
import Wheel from "@/components/Wheel";
import BossWheel from "@/components/BossWheel";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import CharacterPool from "@/components/CharacterPool";
import RosterModal from "@/components/RosterModal";
import ResultCard from "@/components/ResultCard";
import BossResultCard from "@/components/BossResultCard";
import SpinHistory, { BossBattleRecord } from "@/components/SpinHistory";
import CharacterImage from "@/components/CharacterImage";
import BackgroundCustomizer from "@/components/BackgroundCustomizer";
import BossTimer from "@/components/BossTimer";
import "./page.css";
import "./mobile.css";

const getLocalDateTimeValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeIntro, setFadeIntro] = useState(false);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(
    () => new Set(charactersData.map((c) => c.name))
  );
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    rarity: "all",
    elements: [],
    weapons: [],
    regions: [],
  });
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [teamSize, setTeamSize] = useState<1 | 2 | 3 | 4>(4);
  const [result, setResult] = useState<Character | null>(null);
  const [history, setHistory] = useState<Character[]>([]);
  const [team, setTeam] = useState<Character[]>([]);
  const [bossBattles, setBossBattles] = useState<BossBattleRecord[]>([]);
  const [removeAfterSpin, setRemoveAfterSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  // Boss state variables
  const [bossType, setBossType] = useState<"world" | "weekly" | "local" | "all" | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [isBossSpinning, setIsBossSpinning] = useState(false);
  const [showBossResult, setShowBossResult] = useState(false);
  const [showBossBattleOverlay, setShowBossBattleOverlay] = useState(false);
  const [challengerName, setChallengerName] = useState("");
  const [challengeDateTime, setChallengeDateTime] = useState("");
  const [isChallengeTimerComplete, setIsChallengeTimerComplete] = useState(false);
  const [challengeElapsedMilliseconds, setChallengeElapsedMilliseconds] = useState(0);

  // Optional boss rules
  const [bossTimeLimit, setBossTimeLimit] = useState<number | null>(null);
  const [weaponReq, setWeaponReq] = useState<"any" | "4star" | "5star">("any");
  const [customTimeMin, setCustomTimeMin] = useState<string>("");
  const [customTimeSec, setCustomTimeSec] = useState<string>("");

  const activeBosses = useMemo(() => {
    if (bossType === "world") return worldBosses;
    if (bossType === "weekly") return weeklyBosses;
    if (bossType === "local") return localLegends;
    if (bossType === "all") return bossesData;
    return [];
  }, [bossType]);

  const teamCharacters = useMemo(() => {
    return team.slice(0, teamSize);
  }, [team, teamSize]);

  // Helper: randomly pick weapon req and time limit
  const pickRules = React.useCallback(() => {
    const weapons = ["any", "4star", "5star"] as const;
    const times = [60, 120, 180, 300] as const;
    setWeaponReq(weapons[Math.floor(Math.random() * weapons.length)]);
    setBossTimeLimit(times[Math.floor(Math.random() * times.length)]);
  }, []);

  // Trigger boss battle overlay once team is full
  React.useEffect(() => {
    if (team.length > 0 && team.length === teamSize) {
      setShowBossBattleOverlay(true);
    }
  }, [team.length, teamSize]);

  // Auto-pick rules whenever a boss is selected
  React.useEffect(() => {
    if (selectedBoss !== null) {
      pickRules();
    }
  }, [selectedBoss, pickRules]);

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

  // Compute filtered characters for the sidebar pool
  const filteredCharacters = useMemo(() => {
    return charactersData.filter((char) => {
      if (search.trim() && !char.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.rarity !== "all" && char.rarity !== parseInt(filters.rarity)) return false;
      if (filters.elements.length > 0 && !filters.elements.includes(char.element.toLowerCase())) return false;
      if (filters.weapons.length > 0 && !filters.weapons.includes(char.weapon.toLowerCase())) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(char.region.toLowerCase())) return false;
      return true;
    });
  }, [search, filters]);

  // Compute active characters drawn on the wheel (filtered + selected)
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

  // Select all filtered characters
  const handleSelectAll = useCallback(() => {
    if (isSpinning) return;
    setSelectedNames((prev) => {
      const next = new Set(prev);
      filteredCharacters.forEach((c) => next.add(c.name));
      return next;
    });
  }, [isSpinning, filteredCharacters]);

  // Deselect all filtered characters
  const handleDeselectAll = useCallback(() => {
    if (isSpinning) return;
    setSelectedNames((prev) => {
      const next = new Set(prev);
      filteredCharacters.forEach((c) => next.delete(c.name));
      return next;
    });
  }, [isSpinning, filteredCharacters]);

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
      elements: [],
      weapons: [],
      regions: [],
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

  // Spin complete handler — NOTE: never call setState inside another setState's updater
  const handleSpinComplete = useCallback(
    (character: Character) => {
      setResult(character);
      setHistory((prev) => [character, ...prev]);
      setTeam((prev) => prev.length < teamSize ? [...prev, character] : prev);
      if (removeAfterSpin) {
        handleRemoveCharacter(character.name);
      }
    },
    [removeAfterSpin, handleRemoveCharacter, teamSize]
  );

  // Clear spin history list
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setBossBattles([]);
    setTeam([]);
  }, []);

  const handleSuccessfulChallenge = useCallback(() => {
    if (!selectedBoss || !challengerName.trim() || !isChallengeTimerComplete) return;

    setBossBattles((prev) => [{
      boss: selectedBoss,
      challengerName: challengerName.trim(),
      dateTime: challengeDateTime,
      outcome: "won",
      team: teamCharacters,
      elapsedMilliseconds: challengeElapsedMilliseconds,
    }, ...prev]);
    setTeam([]);
    setBossType(null);
    setSelectedBoss(null);
    setShowBossResult(false);
    setShowBossBattleOverlay(false);
    setIsChallengeTimerComplete(false);
    setChallengerName("");
  }, [challengeDateTime, challengeElapsedMilliseconds, challengerName, isChallengeTimerComplete, selectedBoss, teamCharacters]);

  const handleFailedChallenge = useCallback(() => {
    if (!selectedBoss || !challengerName.trim() || !isChallengeTimerComplete) return;
    setBossBattles((prev) => [{
      boss: selectedBoss,
      challengerName: challengerName.trim(),
      dateTime: challengeDateTime,
      outcome: "lost",
      team: teamCharacters,
      elapsedMilliseconds: challengeElapsedMilliseconds,
    }, ...prev]);
    setTeam([]);
    setBossType(null);
    setSelectedBoss(null);
    setShowBossResult(false);
    setShowBossBattleOverlay(false);
    setIsChallengeTimerComplete(false);
    setChallengerName("");
  }, [challengeDateTime, challengeElapsedMilliseconds, challengerName, isChallengeTimerComplete, selectedBoss, teamCharacters]);

  // Global reset wheel
  const handleResetWheel = useCallback(() => {
    setSelectedNames(new Set(charactersData.map((c) => c.name)));
    handleResetFilters();
    setResult(null);
    setRemoveAfterSpin(true);
    setTeam([]);
    setShowRosterModal(false);
    // Reset boss states
    setBossType(null);
    setSelectedBoss(null);
    setIsBossSpinning(false);
    setShowBossResult(false);
    setShowBossBattleOverlay(false);
    setChallengerName("");
    setChallengeDateTime("");
    setIsChallengeTimerComplete(false);
    setChallengeElapsedMilliseconds(0);
    setBossTimeLimit(null);
    setWeaponReq("any");
  }, [handleResetFilters]);

  const handleSpinAgainBoss = useCallback(() => {
    setSelectedBoss(null);
    setShowBossResult(false);
  }, []);

  const allCharactersSelectedGone = selectedNames.size === 0;
  const promoMessages = [
    "Kiwich dabest mod",
    "jeumwoo was here!",
    "ria sunget",
    "durp enge welkin sige na",
    "UY PILIPINSS!!!!!",
    "VOTE WISELY",
    "Shawawt Mga Beta Testers: Arquii, Justin Lim, Ponkan 🍊",
    "Wishing u luck on 50/50",
    "Snezhnaya na wahhhhh",
  ];

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <BackgroundCustomizer />
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
          <div className="promo-bar-track" aria-hidden="true">
            <div className="promo-group">
              {promoMessages.map((message) => (
                <span key={`promo-${message}`} className="promo-pill">
                  {message}
                </span>
              ))}
            </div>
            <div className="promo-group" aria-hidden="true">
              {promoMessages.map((message) => (
                <span key={`promo-copy-${message}`} className="promo-pill">
                  {message}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="dashboard-grid">
          {/* COLUMN 1: Filters + Character Pool */}
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
                <span className="text-4xl" style={{ color: "var(--text-gold)" }}>&#10022;</span>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                  All characters have been selected!
                </h2>
                <p className="text-sm text-muted">
                  You have spun and removed all characters in the pool. Click below to reload the pool and spin again.
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

                {/* Controls below the wheel */}
                <div className="flex flex-col gap-4 w-full max-w-[450px]">
                  {/* Manage Roster + Team Size side by side */}
                  <div className="roster-teamsize-row">
                    {/* Manage Roster button */}
                    <button
                      onClick={() => setShowRosterModal(true)}
                      className="manage-roster-btn"
                    >
                      &#9876; Manage Roster
                      <span className="roster-count-badge">{activeCharacters.length}</span>
                    </button>

                    {/* Team Size Selector */}
                    <div className="team-size-inline glass-panel">
                      <div className="team-size-label-col">
                        <span className="team-size-label">Team</span>
                        <span className="team-size-progress">{team.length}/{teamSize}</span>
                      </div>
                      <div className="team-size-buttons-inline">
                        {([1, 2, 3, 4] as const).map((n) => (
                          <button
                            key={n}
                            onClick={() => { setTeamSize(n); setTeam([]); setBossType(null); setSelectedBoss(null); setShowBossBattleOverlay(false); }}
                            className={`team-size-btn ${teamSize === n ? "active" : ""}`}
                            disabled={isSpinning}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

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

                  {team.length >= teamSize && !showBossBattleOverlay && (
                    <div className="enter-boss-btn-container w-full">
                      <button
                        onClick={() => setShowBossBattleOverlay(true)}
                        className="enter-boss-battle-btn w-full"
                      >
                        &#9876; Enter Boss Battle &#9876;
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          {/* COLUMN 3: Spin History & Team Panel */}
          <aside className="sidebar-right">
            {/* RESET — always visible at top of sidebar */}
            <button
              onClick={handleResetWheel}
              className={`master-reset-btn sidebar-reset-btn${history.length > 0 ? " has-history" : ""}`}
              disabled={isSpinning}
              title="Reset wheel settings and active team; keep spin history"
            >
              &#8635; Reset Wheel
            </button>

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

            {/* CURRENT TEAM */}
            {team.length > 0 && (
              <div className="glass-panel p-5 flex flex-col gap-3">
                <h3 className="text-xs uppercase tracking-wider text-muted font-bold">
                  Your Team ({Math.min(team.length, teamSize)}/{teamSize})
                </h3>
                <div className="team-portrait-grid">
                  {team.slice(0, teamSize).map((char, idx) => (
                    <div key={`${char.name}-${idx}`} className="team-portrait-item">
                      <div className="relative">
                        <CharacterImage
                          name={char.name}
                          src={char.image}
                          element={char.element}
                          rarity={char.rarity}
                          size={58}
                        />
                        <button
                          className="team-remove-btn"
                          title={`Remove ${char.name} from team`}
                          onClick={() => {
                            setTeam((prev) => prev.filter((_, i) => i !== idx));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <span className="team-portrait-name">{char.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <SpinHistory bossBattles={bossBattles} onClearHistory={() => setBossBattles([])} />
          </aside>
        </div>

      </div>

      {/* ROSTER MODAL */}
      {showRosterModal && (
        <RosterModal
          selectedNames={selectedNames}
          onToggleCharacter={handleToggleCharacter}
          onSelectVisible={(names) => { if (!isSpinning) setSelectedNames((prev) => { const n = new Set(prev); names.forEach(name => n.add(name)); return n; }); }}
          onDeselectVisible={(names) => { if (!isSpinning) setSelectedNames((prev) => { const n = new Set(prev); names.forEach(name => n.delete(name)); return n; }); }}
          onResetPool={handleResetPool}
          onClose={() => setShowRosterModal(false)}
        />
      )}

      {/* BOSS BATTLE OVERLAY */}
      {showBossBattleOverlay && team.length >= teamSize && typeof document !== "undefined" && createPortal(
        <div className="boss-battle-overlay" onClick={() => setShowBossBattleOverlay(false)}>
          <div className="boss-battle-section glass-panel" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowBossBattleOverlay(false)}
              className="boss-overlay-close-btn"
              aria-label="Close Boss Battle"
            >
              ✕
            </button>

            {/* Watermark */}
            <div className="card-signature">Genspin by Rom</div>

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
                  <button onClick={() => setBossType("local")} className="boss-type-btn">
                    Local Legends
                  </button>
                  <button onClick={() => setBossType("all")} className="boss-type-btn">
                    All
                  </button>
                </div>
              </div>
            ) : selectedBoss === null ? (
              <div className="boss-wheel-container">
                <div className="boss-pool-info-bar">
                  <span className="boss-pool-label">
                    Active Pool: {bossType === "world" ? "World Bosses" : bossType === "weekly" ? "Weekly Bosses" : bossType === "local" ? "Local Legends" : "All Bosses/Legends"} ({activeBosses.length})
                  </span>
                  <button onClick={() => setBossType(null)} className="boss-change-pool-btn">
                    Change Pool
                  </button>
                </div>

                <BossWheel
                  activeBosses={activeBosses}
                  onSpinComplete={(boss) => {
                    setSelectedBoss(boss);
                    setChallengerName("");
                    setChallengeDateTime(getLocalDateTimeValue());
                    setIsChallengeTimerComplete(false);
                    setChallengeElapsedMilliseconds(0);
                    setShowBossResult(true);
                  }}
                  isSpinning={isBossSpinning}
                  setIsSpinning={setIsBossSpinning}
                />
              </div>
            ) : (
              <div className="boss-matchup-container">
                {/* Auto-picked rules display */}
                <div className="boss-rules-row">
                  <div className="boss-rule-display">
                    <span className="boss-rule-display-label">&#9876; Weapon</span>
                    <span
                      className="boss-rule-display-val"
                      style={{
                        color: weaponReq === "5star" ? "var(--rarity-5)"
                          : weaponReq === "4star" ? "var(--rarity-4)"
                          : "var(--text-muted)",
                        borderColor: weaponReq === "5star" ? "var(--rarity-5)"
                          : weaponReq === "4star" ? "var(--rarity-4)"
                          : "rgba(255,255,255,0.12)",
                      }}
                    >
                      {weaponReq === "any" ? "Any" : weaponReq === "4star" ? "4\u2605+" : "5\u2605 Only"}
                    </span>
                  </div>

                  <div className="boss-rule-display">
                    <span className="boss-rule-display-label">&#9201; Time</span>
                    <span className="boss-rule-display-val" style={{ color: "var(--text-gold)", borderColor: "rgba(216,179,106,0.35)" }}>
                      {bossTimeLimit !== null ? (bossTimeLimit < 60 ? `${bossTimeLimit}s` : bossTimeLimit % 60 === 0 ? `${bossTimeLimit / 60}m` : `${Math.floor(bossTimeLimit/60)}m${bossTimeLimit%60}s`) : "--"}
                    </span>
                  </div>

                  {/* Custom time input */}
                  <div className="custom-time-wrap">
                    <span className="custom-time-label">Custom</span>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      placeholder="mm"
                      value={customTimeMin}
                      onChange={(e) => setCustomTimeMin(e.target.value)}
                      className="custom-time-input"
                      title="Minutes"
                    />
                    <span className="custom-time-unit">m</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      placeholder="ss"
                      value={customTimeSec}
                      onChange={(e) => setCustomTimeSec(e.target.value)}
                      className="custom-time-input"
                      title="Seconds"
                    />
                    <span className="custom-time-unit">s</span>
                    <button
                      className="custom-time-apply"
                      onClick={() => {
                        const mins = Math.max(0, parseInt(customTimeMin || "0") || 0);
                        const secs = Math.min(59, Math.max(0, parseInt(customTimeSec || "0") || 0));
                        const totalSec = mins * 60 + secs;
                        if (totalSec > 0) {
                          setBossTimeLimit(totalSec);
                          setCustomTimeMin("");
                          setCustomTimeSec("");
                        }
                      }}
                    >
                      Set
                    </button>
                  </div>

                  <button
                    className="boss-randomize-btn"
                    onClick={pickRules}
                    title="Re-roll rules"
                  >
                    &#9880; Re-roll
                  </button>
                </div>

                {/* Timer display — always shown in matchup, bossTimeLimit is auto-picked */}
                {bossTimeLimit !== null && (
                  <BossTimer
                    key={bossTimeLimit}
                    seconds={bossTimeLimit}
                    onExpire={() => setIsChallengeTimerComplete(true)}
                    onStop={() => setIsChallengeTimerComplete(true)}
                    onReset={() => setIsChallengeTimerComplete(false)}
                    onComplete={setChallengeElapsedMilliseconds}
                  />
                )}


                <div className="matchup-grid">
                  {/* TEAM */}
                  <div className="matchup-team-card glass-panel-inner">
                    <h3 className="matchup-card-title">YOUR TEAM</h3>
                    <div className="matchup-team-portraits">
                      {teamCharacters.map((char, idx) => (
                        <div key={char.name} className="matchup-portrait-item">
                          <div className="relative">
                            <CharacterImage
                              name={char.name}
                              src={char.image}
                              element={char.element}
                              rarity={char.rarity}
                              size={76}
                            />
                            <button
                              className="team-remove-btn"
                              title={`Remove ${char.name}`}
                              onClick={() => setTeam((prev) => prev.filter((_, i) => i !== idx))}
                            >
                              &#10005;
                            </button>
                          </div>
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
                        element={getRegionElement(selectedBoss.region)}
                        rarity={selectedBoss.category === "Weekly Boss" ? 5 : 4}
                        size={84}
                      />
                      <div className="matchup-boss-info">
                        <span className="matchup-boss-name">{selectedBoss.name}</span>
                        <span className="matchup-boss-category" style={{
                          color: selectedBoss.category === "Weekly Boss" ? "var(--rarity-5)" : "var(--rarity-4)"
                        }}>{selectedBoss.category}</span>
                        <span className="matchup-boss-region-badge">{selectedBoss.region}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="matchup-actions">
                  <div className="matchup-action-buttons">
                    <button onClick={handleSpinAgainBoss} className="boss-action-btn spin-again-btn">
                      SPIN AGAIN
                    </button>
                    <button onClick={handleResetWheel} className="boss-action-btn new-team-btn">
                      NEW TEAM
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {isChallengeTimerComplete && selectedBoss && typeof document !== "undefined" && createPortal(
        <div className="challenge-outcome-overlay">
          <div className="challenge-outcome-modal" role="dialog" aria-modal="true" aria-labelledby="challenge-complete-title">
            <span className="history-detail-kicker">Battle record</span>
            <h2 id="challenge-complete-title">Challenge complete?</h2>
            <input
              className="challenge-outcome-name-input"
              type="text"
              value={challengerName}
              onChange={(event) => setChallengerName(event.target.value)}
              placeholder="Enter challenger name"
            />
            <p>Name the challenger before choosing an outcome.</p>
            <div className="challenge-outcome-modal-buttons">
              <button
                className="challenge-outcome-btn challenge-success-btn"
                onClick={handleSuccessfulChallenge}
                disabled={!challengerName.trim()}
              >
                Success
              </button>
              <button
                className="challenge-outcome-btn challenge-failure-btn"
                onClick={handleFailedChallenge}
                disabled={!challengerName.trim()}
              >
                &#10005; Failed
              </button>
            </div>
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
