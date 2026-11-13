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

  return (
    <div className="glass-panel history-panel p-5 flex flex-col w-full h-full">
      <div className="history-header">
        <div>
          <h2 className="history-title">Spin History</h2>
          <p className="history-subtitle">Session Records</p>
        </div>
        {bossBattles.length > 0 && (
          <button onClick={onClearHistory} className="history-clear-btn">
            Clear
          </button>
        )}
      </div>

      {bossBattles.length === 0 ? (
        <div className="history-empty-state">
          <span className="history-empty-icon" style={{ fontFamily: "var(--font-header)", fontSize: "1.5rem", color: "var(--text-gold)", opacity: 0.4 }}>&#9654;</span>
          <p className="history-empty-title">No spins recorded yet.</p>
          <p className="history-empty-text">Launch the wheel to see your records here.</p>
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
    </div>
  );
}
