"use client";

import React from "react";
import { Character } from "@/data/characters";
import { Boss } from "@/data/bosses";
import CharacterImage from "./CharacterImage";
import BossImage from "./BossImage";

export interface BossBattleRecord {
  boss: Boss;
  challengerName: string;
  dateTime: string;
  outcome: "won" | "lost";
  team: Character[];
  elapsedMilliseconds: number;
}

interface SpinHistoryProps {
  bossBattles?: BossBattleRecord[];
  onClearHistory: () => void;
}

export default function SpinHistory({ bossBattles = [], onClearHistory }: SpinHistoryProps) {
  const [selectedBattle, setSelectedBattle] = React.useState<BossBattleRecord | null>(null);
  const [showExpanded, setShowExpanded] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [outcomeFilter, setOutcomeFilter] = React.useState<"all" | "won" | "lost">("all");
  const [regionFilter, setRegionFilter] = React.useState("all");

  const regions = Array.from(new Set(bossBattles.map((battle) => battle.boss.region))).sort();
  const filteredBattles = bossBattles.filter((battle) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query
      || battle.boss.name.toLowerCase().includes(query)
      || battle.challengerName.toLowerCase().includes(query);
    const matchesOutcome = outcomeFilter === "all" || battle.outcome === outcomeFilter;
    const matchesRegion = regionFilter === "all" || battle.boss.region === regionFilter;
    return matchesSearch && matchesOutcome && matchesRegion;
  });

  return (
    <div className="glass-panel history-panel p-5 flex flex-col w-full h-full">
      <div className="history-header">
        <div>
          <h2 className="history-title">Battle Record</h2>
          <p className="history-subtitle">Session Records</p>
        </div>
        <div className="history-header-actions">
          {bossBattles.length > 0 && (
            <button
              onClick={() => setShowExpanded(true)}
              className="history-icon-btn history-expand-btn"
              aria-label="Expand battle records"
              title="Expand battle records"
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 3H3v5M3 3l7 7M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7M16 21h5v-5M21 21l-7-7" />
              </svg>
            </button>
          )}
          {bossBattles.length > 0 && (
            <button
              onClick={onClearHistory}
              className="history-icon-btn history-clear-btn"
              aria-label="Clear battle records"
              title="Clear battle records"
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {bossBattles.length === 0 ? (
        <div className="history-empty-state">
          <span className="history-empty-icon" style={{ fontFamily: "var(--font-header)", fontSize: "1.5rem", color: "var(--text-gold)", opacity: 0.4 }}>&#9654;</span>
          <p className="history-empty-title">No battles recorded yet.</p>
          <p className="history-empty-text">Complete a boss battle to see your records here.</p>
        </div>
      ) : (
        <div className="history-list overflow-y-auto max-h-[300px] pr-1">
          {bossBattles.slice(0, 10).map((battle, index) => (
            <button
              key={`${battle.boss.name}-${battle.dateTime}`}
              className="history-item history-battle-item"
              onClick={() => setSelectedBattle(battle)}
              type="button"
            >
              <div className="history-left">
                <span className="history-index">B{String(index + 1).padStart(2, "0")}</span>
                <BossImage boss={battle.boss} size={28} shape="circle" />
                <div className="history-text">
                  <p className="history-name">{battle.boss.name}</p>
                  <span className={`history-element ${battle.outcome === "won" ? "battle-success" : "battle-failure"}`}>
                    {battle.outcome === "won" ? "Success" : "Failed"} · {battle.challengerName}
                  </span>
                </div>
              </div>
              <div className="history-meta">
                <span className="history-region">{new Date(battle.dateTime).toLocaleDateString()}</span>
                <span className="history-rarity">Boss</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {selectedBattle && (
        <div className="history-detail-overlay" onClick={() => setSelectedBattle(null)}>
          <div className="history-detail-card" onClick={(event) => event.stopPropagation()}>
            <button
              className="history-detail-close"
              onClick={() => setSelectedBattle(null)}
              aria-label="Close battle details"
              type="button"
            >
              &#10005;
            </button>
            <span className="history-detail-kicker">Recent Boss Battle</span>
            <BossImage boss={selectedBattle.boss} size={86} shape="rect" />
            <h3 className="history-detail-title">{selectedBattle.boss.name}</h3>
            <p className={`history-detail-outcome ${selectedBattle.outcome === "won" ? "battle-success" : "battle-failure"}`}>
              {selectedBattle.outcome === "won" ? "Success" : "Failed"} · {selectedBattle.challengerName}
            </p>
            <div className="history-detail-stats">
              <span>Cleared in</span>
              <strong>{(selectedBattle.elapsedMilliseconds / 1000).toFixed(3)}s</strong>
              <span>Recorded</span>
              <strong>{new Date(selectedBattle.dateTime).toLocaleString()}</strong>
            </div>
            <div className="history-detail-team">
              <span className="history-detail-team-title">Team used</span>
              <div className="history-detail-team-grid">
                {selectedBattle.team.map((character) => (
                  <div key={character.name} className="history-detail-character">
                    <CharacterImage
                      name={character.name}
                      src={character.image}
                      element={character.element}
                      rarity={character.rarity}
                      size={48}
                    />
                    <span>{character.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showExpanded && (
        <div className="history-expanded-overlay" onClick={() => setShowExpanded(false)}>
          <div className="history-expanded-card" onClick={(event) => event.stopPropagation()}>
            <div className="history-expanded-header">
              <div>
                <span className="history-detail-kicker">Session Records</span>
                <h2>Battle Record</h2>
              </div>
              <button
                className="history-detail-close"
                onClick={() => setShowExpanded(false)}
                aria-label="Close battle records"
                type="button"
              >
                &#10005;
              </button>
            </div>
            <div className="history-filters">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search boss or challenger"
                aria-label="Search battle records"
              />
              <select value={outcomeFilter} onChange={(event) => setOutcomeFilter(event.target.value as "all" | "won" | "lost")}>
                <option value="all">All outcomes</option>
                <option value="won">Success</option>
                <option value="lost">Failed</option>
              </select>
              <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)}>
                <option value="all">All regions</option>
                {regions.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
            </div>
            <div className="history-expanded-list">
              {filteredBattles.length === 0 ? (
                <p className="history-expanded-empty">No battle records match these filters.</p>
              ) : filteredBattles.map((battle, index) => (
                <button
                  key={`${battle.boss.name}-${battle.dateTime}-${index}`}
                  className="history-expanded-row"
                  onClick={() => setSelectedBattle(battle)}
                  type="button"
                >
                  <BossImage boss={battle.boss} size={48} shape="rect" />
                  <div className="history-expanded-main">
                    <strong>{battle.boss.name}</strong>
                    <span>{battle.challengerName} · {battle.boss.region}</span>
                  </div>
                  <span className={`history-expanded-outcome ${battle.outcome === "won" ? "battle-success" : "battle-failure"}`}>
                    {battle.outcome === "won" ? "Success" : "Failed"}
                  </span>
                  <strong className="history-expanded-time">
                    {(battle.elapsedMilliseconds / 1000).toFixed(3)}s
                  </strong>
                  <span className="history-expanded-date">{new Date(battle.dateTime).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
