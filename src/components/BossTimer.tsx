"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface BossTimerProps {
  seconds: number;
  onExpire?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onComplete?: (elapsedMilliseconds: number) => void;
}

export default function BossTimer({ seconds, onExpire, onStop, onReset, onComplete }: BossTimerProps) {
  const totalMilliseconds = Math.max(1000, Math.round(seconds * 1000));

  const [remaining, setRemaining] = useState(totalMilliseconds);
  const [running, setRunning] = useState(false);
  const [expired, setExpired] = useState(false);
  const [stopped, setStopped] = useState(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const remainingRef = useRef(totalMilliseconds);
  const onExpireRef = useRef(onExpire);
  const onStopRef = useRef(onStop);
  const onResetRef = useRef(onReset);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onExpireRef.current = onExpire;
    onStopRef.current = onStop;
    onResetRef.current = onReset;
    onCompleteRef.current = onComplete;
  }, [onComplete, onExpire, onReset, onStop]);

  useEffect(() => {
    if (!running) return;

    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      setRemaining(remainingRef.current);
      if (remainingRef.current === 0) {
        setRunning(false);
        setExpired(true);
        onCompleteRef.current?.(totalMilliseconds - remainingRef.current);
        onExpireRef.current?.();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      lastTickRef.current = null;
    };
  }, [running, totalMilliseconds]);

  const handleReset = useCallback(() => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    remainingRef.current = totalMilliseconds;
    setRemaining(totalMilliseconds);
    setRunning(false);
    setExpired(false);
    setStopped(false);
    lastTickRef.current = null;
    onResetRef.current?.();
  }, [totalMilliseconds]);

  const handleStop = () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    setRunning(false);
    setStopped(true);
    lastTickRef.current = null;
    onCompleteRef.current?.(totalMilliseconds - remainingRef.current);
    onStopRef.current?.();
  };

  const remainingSeconds = remaining / 1000;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(Math.floor(remainingSeconds % 60)).padStart(2, "0");
  const ms = String(Math.floor(remaining % 1000)).padStart(3, "0");

  const pct = totalMilliseconds > 0 ? remaining / totalMilliseconds : 0;
  const color = pct > 0.5 ? "var(--text-gold)" : pct > 0.25 ? "#ff9933" : "#ff4444";

  return (
    <div className={`boss-timer ${expired ? "expired" : ""}`}>
      <div className="boss-timer-display" style={{ color: expired ? "#ff4444" : color }}>
        {expired ? "TIME'S UP!" : `${mm}:${ss}.${ms}`}
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
        {!running && !expired && !stopped && (
          <button className="boss-timer-btn start" onClick={() => setRunning(true)}>
            &#9654; Start
          </button>
        )}
        {running && (
          <button className="boss-timer-btn stop" onClick={handleStop}>
            &#9632; Stop
          </button>
        )}
        <button className="boss-timer-btn reset" onClick={handleReset}>
          &#8635; Reset
        </button>
      </div>
    </div>
  );
}
