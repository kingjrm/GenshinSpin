"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface BossTimerProps {
  seconds: number;
  onExpire?: () => void;
}

export default function BossTimer({ seconds, onExpire }: BossTimerProps) {
  // Guard: clamp to at least 1 to avoid division-by-zero
  const totalSeconds = Math.max(1, Math.round(seconds));

  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [expired, setExpired] = useState(false);

  // Use a ref for the interval so cleanup is always stable
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track "should expire" in a ref to decouple from setState inside interval
  const shouldExpireRef = useRef(false);

  // Reset everything when the totalSeconds prop changes
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(totalSeconds);
    setRunning(false);
    setExpired(false);
    shouldExpireRef.current = false;
  }, [totalSeconds]);

  // Tick effect — only depends on `running`
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          shouldExpireRef.current = true;
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Watch remaining to trigger expiry outside the setState updater
  useEffect(() => {
    if (shouldExpireRef.current && remaining === 0) {
      shouldExpireRef.current = false;
      setRunning(false);
      setExpired(true);
      onExpire?.();
    }
  }, [remaining, onExpire]);

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    shouldExpireRef.current = false;
    setRemaining(totalSeconds);
    setRunning(false);
    setExpired(false);
  }, [totalSeconds]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const pct = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const color = pct > 0.5 ? "var(--text-gold)" : pct > 0.25 ? "#ff9933" : "#ff4444";

  return (
    <div className={`boss-timer ${expired ? "expired" : ""}`}>
      <div className="boss-timer-display" style={{ color: expired ? "#ff4444" : color }}>
        {expired ? "TIME'S UP!" : `${mm}:${ss}`}
      </div>
      <div className="boss-timer-bar-track">
        <div
          className="boss-timer-bar-fill"
          style={{
            width: `${pct * 100}%`,
            background: expired ? "#ff4444" : color,
          }}
        />
      </div>
      <div className="boss-timer-actions">
        {!running && !expired && (
          <button className="boss-timer-btn start" onClick={() => setRunning(true)}>
            &#9654; Start
          </button>
        )}
        {running && (
          <button className="boss-timer-btn pause" onClick={() => setRunning(false)}>
            &#9646;&#9646; Pause
          </button>
        )}
        <button className="boss-timer-btn reset" onClick={handleReset}>
          &#8635; Reset
        </button>
      </div>
    </div>
  );
}
