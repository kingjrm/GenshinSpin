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
  history: Character[];
  bossBattles?: BossBattleRecord[];
  onClearHistory: () => void;
}

export default function SpinHistory({ history, bossBattles = [], onClearHistory }: SpinHistoryProps) {
  const [selectedBattle, setSelectedBattle] = React.useState<BossBattleRecord | null>(null);
  // Show last 10 spins, most recent first; index = spin number in session
  const displayed = history.slice(0, 10);

  return (
    <div className="glass-panel history-panel p-5 flex flex-col w-full h-full">
      <div className="history-header">
        <div>
          <h2 className="history-title">Spin History</h2>
          <p className="history-subtitle">Session Records</p>
        </div>
        {(history.length > 0 || bossBattles.length > 0) && (
          <button onClick={onClearHistory} className="history-clear-btn">
            Clear
          </button>
        )}
      </div>

      {history.length === 0 && bossBattles.length === 0 ? (
        <div className="history-empty-state">
          <span className="history-empty-icon" style={{ fontFamily: "var(--font-header)", fontSize: "1.5rem", color: "var(--text-gold)", opacity: 0.4 }}>&#9654;</span>
          <p className="history-empty-title">No spins recorded yet.</p>
          <p className="history-empty-text">Launch the wheel to see your records here.</p>
        </div>
      ) : (
        <div className="history-list overflow-y-auto max-h-[300px] pr-1">
          {displayed.length > 0 && <p className="history-section-label">Character spins</p>}
          {displayed.map((char, index) => {
            // Spin #1 = most recent, counting up from newest
            const spinNumber = String(index + 1).padStart(2, "0");

            const elementColors: Record<string, string> = {
              Pyro:    "var(--color-pyro)",
              Hydro:   "var(--color-hydro)",
              Cryo:    "var(--color-cryo)",
              Electro: "var(--color-electro)",
              Dendro:  "var(--color-dendro)",
              Anemo:   "var(--color-anemo)",
              Geo:     "var(--color-geo)",
              None:    "var(--color-none)",
            };

            const elementColor = elementColors[char.element] || "var(--color-none)";

            return (
              <div
                key={`${char.name}-${index}`}
                className="history-item"
              >
                <div className="history-left">
                  <span className="history-index">{spinNumber}</span>
                  <CharacterImage
                    name={char.name}
                    src={char.image}
                    element={char.element}
                    rarity={char.rarity}
                    size={28}
                  />
                  <div className="history-text">
                    <p className="history-name">{char.name}</p>
                    <span className="history-element" style={{ color: elementColor }}>
                      {char.element !== "None" ? char.element : "No Element"}
                    </span>
                  </div>
                </div>

                <div className="history-meta">
                  <span className="history-region">
                    {char.region !== "None" ? char.region : "Lore"}
                  </span>
                  <span className="history-rarity">
                    {char.rarity}&#9733;
                  </span>
                </div>
              </div>
            );
          })}
          {bossBattles.length > 0 && <p className="history-section-label">Boss battles</p>}
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
          {history.length > 10 && (
            <p style={{ textAlign: "center", fontSize: "0.65rem", color: "var(--text-muted)", padding: "8px 0" }}>
              +{history.length - 10} more (showing last 10)
            </p>
          )}
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
    </div>
  );
}
