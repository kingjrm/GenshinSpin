"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface BgSettings {
  imageDataUrl?: string;
  imageUrl?: string;
  opacity: number;
  blur: number;
  brightness: number;
}

const LS_KEY = "genspin-bg";

const DEFAULT: BgSettings = {
  imageDataUrl: undefined,
  imageUrl: undefined,
  opacity: 85,
  blur: 0,
  brightness: 70,
};

function loadSettings(): BgSettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function saveSettings(s: BgSettings) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {}
}

export default function BackgroundCustomizer() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<BgSettings>(DEFAULT);
  const [urlInput, setUrlInput] = useState("");
  const [tab, setTab] = useState<"file" | "url">("file");
  const fileRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    setUrlInput(s.imageUrl ?? "");
  }, []);

  const update = useCallback((patch: Partial<BgSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      update({ imageDataUrl: dataUrl, imageUrl: undefined });
      setUrlInput("");
    };
    reader.readAsDataURL(file);
  }, [update]);

  const handleUrlApply = useCallback(() => {
    if (!urlInput.trim()) return;
    update({ imageUrl: urlInput.trim(), imageDataUrl: undefined });
  }, [urlInput, update]);

  const handleReset = useCallback(() => {
    if (fileRef.current) fileRef.current.value = "";
    setUrlInput("");
    setSettings(DEFAULT);
    saveSettings(DEFAULT);
  }, []);

  const activeSrc = settings.imageDataUrl ?? settings.imageUrl;

  return (
    <>
      {/* Background layer */}
      {activeSrc && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: `url(${activeSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: settings.opacity / 100,
            filter: `blur(${settings.blur}px) brightness(${settings.brightness}%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Floating gear button */}
      <button
        className="bg-gear-btn"
        onClick={() => setOpen((v) => !v)}
        title="Customize Background"
        aria-label="Customize Background"
      >
        &#9881;
      </button>

      {/* Settings panel */}
      {open && (
        <>
          <div className="bg-panel-backdrop" onClick={() => setOpen(false)} />
          <div className="bg-panel glass-panel">
            {/* Header */}
            <div className="bg-panel-header">
              <span className="bg-panel-title">Background</span>
              <button className="bg-panel-close" onClick={() => setOpen(false)}>&#10005;</button>
            </div>

            {/* Tab row */}
            <div className="bg-tab-row">
              <button
                className={`bg-tab ${tab === "file" ? "active" : ""}`}
                onClick={() => setTab("file")}
              >
                Upload File
              </button>
              <button
                className={`bg-tab ${tab === "url" ? "active" : ""}`}
                onClick={() => setTab("url")}
              >
                Image URL
              </button>
            </div>

            {/* Tab content */}
            {tab === "file" ? (
              <div className="bg-file-area" onClick={() => fileRef.current?.click()}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
                {settings.imageDataUrl ? (
                  <div className="bg-preview-wrap">
                    <img src={settings.imageDataUrl} alt="bg preview" className="bg-preview-img" />
                    <span className="bg-preview-label">Click to change</span>
                  </div>
                ) : (
                  <div className="bg-upload-placeholder">
                    <span className="bg-upload-icon">&#8682;</span>
                    <span>Click to upload image</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-url-area">
                <input
                  type="text"
                  className="bg-url-input"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
                />
                <button className="bg-url-apply-btn" onClick={handleUrlApply}>Apply</button>
              </div>
            )}

            {/* Sliders */}
            <div className="bg-sliders">
              <label className="bg-slider-row">
                <div className="bg-slider-info">
                  <span>Opacity</span>
                  <span className="bg-slider-val">{settings.opacity}%</span>
                </div>
                <input
                  type="range" min={10} max={100}
                  value={settings.opacity}
                  onChange={(e) => update({ opacity: Number(e.target.value) })}
                  className="bg-slider"
                />
              </label>

              <label className="bg-slider-row">
                <div className="bg-slider-info">
                  <span>Blur</span>
                  <span className="bg-slider-val">{settings.blur}px</span>
                </div>
                <input
                  type="range" min={0} max={20}
                  value={settings.blur}
                  onChange={(e) => update({ blur: Number(e.target.value) })}
                  className="bg-slider"
                />
              </label>

              <label className="bg-slider-row">
                <div className="bg-slider-info">
                  <span>Brightness</span>
                  <span className="bg-slider-val">{settings.brightness}%</span>
                </div>
                <input
                  type="range" min={20} max={150}
                  value={settings.brightness}
                  onChange={(e) => update({ brightness: Number(e.target.value) })}
                  className="bg-slider"
                />
              </label>
            </div>

            {/* Reset */}
            {activeSrc && (
              <button className="bg-reset-btn" onClick={handleReset}>
                &#10005; Remove Background
              </button>
            )}

            <p className="bg-note">Settings are saved in your browser only.</p>
          </div>
        </>
      )}
    </>
  );
}
