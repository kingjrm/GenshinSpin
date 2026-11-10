"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface BossTimerProps {
  seconds: number;        // total seconds for the timer
  onExpire?: () => void;
}

export default function BossTimer({ seconds, onExpire }: BossTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when seconds prop changes
  useEffect(() => {
    setRemaining(seconds);
    setRunning(false);
    setExpired(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setExpired(true);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running, onExpire]);

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(seconds);
    setRunning(false);
    setExpired(false);
  }, [seconds]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const pct = remaining / seconds;
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
