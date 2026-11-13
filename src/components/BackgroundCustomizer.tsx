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
const MAX_FILE_MB = 8; // max base64 image size to store

const DEFAULT: BgSettings = {
  imageDataUrl: undefined,
  imageUrl: "/mitya.png",
  opacity: 40,
  blur: 5,
  brightness: 45,
};

function loadSettings(): BgSettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    const imageDataUrl = typeof parsed.imageDataUrl === "string" ? parsed.imageDataUrl : undefined;
    const imageUrl = typeof parsed.imageUrl === "string"
      ? parsed.imageUrl
      : imageDataUrl
        ? undefined
        : DEFAULT.imageUrl;
    // Validate parsed values are within expected ranges
    return {
      imageDataUrl,
      imageUrl,
      opacity: typeof parsed.opacity === "number" && parsed.opacity >= 10 && parsed.opacity <= 100 ? parsed.opacity : DEFAULT.opacity,
      blur: typeof parsed.blur === "number" && parsed.blur >= 0 && parsed.blur <= 20 ? parsed.blur : DEFAULT.blur,
      brightness: typeof parsed.brightness === "number" && parsed.brightness >= 20 && parsed.brightness <= 150 ? parsed.brightness : DEFAULT.brightness,
    };
  } catch {
    return DEFAULT;
  }
}

function saveSettings(s: BgSettings): string | null {
  // Return error message or null on success
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
    return null;
  } catch (e) {
    if (e instanceof DOMException && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED")) {
      return "Image too large for browser storage. Try a smaller image or use a URL instead.";
    }
    return "Could not save settings.";
  }
}

export default function BackgroundCustomizer() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<BgSettings>(DEFAULT);
  const [urlInput, setUrlInput] = useState("");
  const [tab, setTab] = useState<"file" | "url">("file");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    setUrlInput(s.imageUrl ?? "");
  }, []);

  const update = useCallback((patch: Partial<BgSettings>) => {
    setError(null);
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      const err = saveSettings(next);
      if (err) setError(err);
      return next;
    });
  }, []);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Guard: reject files over MAX_FILE_MB MB
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${MAX_FILE_MB} MB. Try a URL instead.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("Failed to read file. Please try again.");
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl || !dataUrl.startsWith("data:image/")) {
        setError("Invalid image file.");
        return;
      }
      update({ imageDataUrl: dataUrl, imageUrl: undefined });
      setUrlInput("");
    };
    reader.readAsDataURL(file);
  }, [update]);

  const handleUrlApply = useCallback(() => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    // Basic URL validation
    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setError("Please enter a valid http/https URL.");
        return;
      }
    } catch {
      setError("Invalid URL format.");
      return;
    }
    setError(null);
    update({ imageUrl: trimmed, imageDataUrl: undefined });
  }, [urlInput, update]);

  const handleReset = useCallback(() => {
    if (fileRef.current) fileRef.current.value = "";
    setUrlInput("");
    setError(null);
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
        onClick={() => { setOpen((v) => !v); setError(null); }}
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

            {/* Error message */}
            {error && (
              <div className="bg-error-msg" role="alert">
                &#9888; {error}
              </div>
            )}

            {/* Tab row */}
            <div className="bg-tab-row">
              <button
                className={`bg-tab ${tab === "file" ? "active" : ""}`}
                onClick={() => { setTab("file"); setError(null); }}
              >
                Upload File
              </button>
              <button
                className={`bg-tab ${tab === "url" ? "active" : ""}`}
                onClick={() => { setTab("url"); setError(null); }}
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
                    <span style={{ fontSize: "0.62rem", opacity: 0.5 }}>Max {MAX_FILE_MB} MB</span>
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
                  onChange={(e) => { setUrlInput(e.target.value); setError(null); }}
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
