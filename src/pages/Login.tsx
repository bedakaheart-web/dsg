declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>;
  }
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { supabase } from "../js/supabase";
import { FaEye, FaEyeSlash, FaCheck, FaArrowRight } from "react-icons/fa";
import logoImage from "../assets/dsg.logo.png";
import directorybg from "../assets/directorybg.png";
import { useLanguage } from "../context/LanguageContext";

// ── Cloudflare Turnstile site key ──
// Priority: VITE_TURNSTILE_SITE_KEY → REACT_APP_TURNSTILE_SITE_KEY → dev dummy.
// Cloudflare's official dummy sitekey for localhost/dev (always passes):
//   1x00000000000000000000AA
// (see https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
// The key MUST match the key configured in Supabase Auth > CAPTCHA settings,
// otherwise signInWithPassword() calls sending `options: { captchaToken }`
// will be rejected.
const DUMMY_SITE_KEY = "1x00000000000000000000AA";

// Local dev detection: "localhost" / "127.0.0.1" hostnames OR a Vite dev
// server. (`vite dev --host` can be reached via a LAN IP where the hostname
// is neither, but DEV is still true — the production key must not be used
// there either, or Cloudflare renders a blank/0px frame.)
const IS_LOCAL_DEV =
  (typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")) ||
  Boolean(import.meta.env.DEV);

// Hostname-only check used directly at the siteKey prop so the forcing is
// explicit at the call site (independent of the DEV flag / env resolution).
function isLocalhostHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

function resolveTurnstileSiteKey(): { siteKey: string; isDummy: boolean; missingEnv: boolean } {
  // Production path only: local dev never reaches this key (it is forced to
  // the official test sitekey at the call site — see TURNSTILE_SITE_KEY).
  const envKey =
    (import.meta.env.VITE_TURNSTILE_SITE_KEY ||
      import.meta.env.REACT_APP_TURNSTILE_SITE_KEY ||
      "").trim();
  if (envKey) return { siteKey: envKey, isDummy: false, missingEnv: false };
  console.error(
    "[Turnstile] VITE_TURNSTILE_SITE_KEY / REACT_APP_TURNSTILE_SITE_KEY is missing — falling back to dummy sitekey for rendering. Login CAPTCHA verification will fail until a real site key is configured."
  );
  return { siteKey: DUMMY_SITE_KEY, isDummy: true, missingEnv: true };
}

// ── CSS-in-JS ──
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .lg-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    opacity: 0.12;
    pointer-events: none;
  }

  .lg-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(0,200,224,0.10) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(232,55,42,0.08) 0%, transparent 50%);
    animation: atmosphereDrift 25s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes atmosphereDrift {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.02); }
  }

  .lg-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 11.5px; font-weight: 600;
    color: rgba(168, 216, 255, 0.45);
    text-decoration: none;
    transition: color .2s ease;
    margin-bottom: 28px;
    position: relative; z-index: 1;
    width: fit-content;
    animation: slideUp .5s .05s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-back:hover { color: #00c8e0; }

  .lg-back-arrow {
    font-size: 13px;
    transition: transform .2s ease;
    line-height: 1;
  }

  .lg-back:hover .lg-back-arrow { transform: translateX(-3px); }

  .lg-page {
    position: relative; z-index: 1;
    width: 100%; max-width: 1080px;
    display: grid;
    grid-template-columns: 1.1fr 440px;
    gap: 0;
    background: rgba(13, 27, 46, 0.72);
    border-radius: 24px;
    border: 1px solid rgba(0, 200, 224, 0.18);
    box-shadow:
      0 0 80px rgba(0, 200, 224, 0.10),
      0 25px 80px rgba(7, 16, 29, 0.65),
      inset 0 1px 0 rgba(0, 200, 224, 0.08);
    overflow: hidden;
    min-height: 620px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    animation: pageSlideUp .7s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes pageSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lg-brand-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px 56px;
    background: linear-gradient(135deg, rgba(10,37,64,0.88) 0%, rgba(13,27,46,0.82) 50%, rgba(5,26,36,0.88) 100%);
    overflow: hidden;
  }

  .lg-brand-panel-bg {
    position: absolute; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
    opacity: 0.02;
  }

  .lg-brand-panel::after {
    content: '';
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 90% 110% at 50% -10%, rgba(0,200,224,0.10) 0%, transparent 60%);
  }

  .lg-panel-geo {
    position: absolute; z-index: 1;
    bottom: -100px; right: -100px;
    width: 360px; height: 360px;
    border-radius: 50%;
    border: 60px solid rgba(0, 200, 224, 0.06);
    box-shadow: 0 0 60px rgba(0, 200, 224, 0.08);
    animation: geoPulse 8s ease-in-out infinite;
  }

  .lg-panel-geo-2 {
    position: absolute; z-index: 1;
    top: -60px; left: -60px;
    width: 240px; height: 240px;
    border-radius: 50%;
    border: 40px solid rgba(232, 55, 42, 0.04);
    animation: geoPulse 10s 1s ease-in-out infinite reverse;
  }

  @keyframes geoPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 0.9; }
  }

  .lg-brand-top { position: relative; z-index: 2; }

  .lg-brand-logo {
    display: flex; align-items: center; gap: 14px; margin-bottom: 64px;
    animation: slideDown .6s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lg-brand-logo-img {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, rgba(0,200,224,0.18), rgba(232,55,42,0.12));
    border: 1.5px solid rgba(0, 200, 224, 0.25);
    border-radius: 14px; padding: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 24px rgba(0, 200, 224, 0.12);
    transition: all .3s ease;
  }

  .lg-brand-logo:hover .lg-brand-logo-img {
    transform: scale(1.08) rotate(-4deg);
    box-shadow: 0 0 32px rgba(0, 200, 224, 0.18);
  }

  .lg-brand-logo-img img { width: 100%; height: 100%; object-fit: contain; }

  .lg-brand-logo-name {
    font-family: 'Poppins', sans-serif;
    font-size: 17px; font-weight: 700;
    color: #f8fafc; letter-spacing: -0.02em;
  }

  .lg-brand-logo-name span { color: #00c8e0; }

  .lg-brand-headline {
    font-family: 'Poppins', sans-serif;
    font-size: 36px; font-weight: 700;
    color: #f8fafc; line-height: 1.08;
    letter-spacing: -0.025em;
    margin-bottom: 20px;
    animation: slideUp .7s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lg-brand-headline .accent { color: #00c8e0; }

  .lg-brand-desc {
    font-family: 'Inter', sans-serif;
    font-size: 14.5px; font-weight: 400;
    color: rgba(200, 228, 244, 0.52);
    line-height: 1.8; max-width: 340px;
    animation: slideUp .7s .15s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-brand-bottom { position: relative; z-index: 2; }

  .lg-brand-stats {
    display: flex; gap: 36px; margin-bottom: 32px;
    animation: slideUp .7s .25s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-brand-stat-val {
    font-family: 'Poppins', sans-serif;
    font-size: 28px; font-weight: 700;
    color: #f8fafc; line-height: 1;
    margin-bottom: 5px;
  }

  .lg-brand-stat-val em { color: #00c8e0; font-style: normal; }

  .lg-brand-stat-label {
    font-family: 'Inter', sans-serif;
    font-size: 10.5px; font-weight: 600;
    color: rgba(168, 216, 255, 0.38);
    text-transform: uppercase; letter-spacing: .12em;
  }

  .lg-brand-divider {
    height: 1px; background: linear-gradient(90deg, rgba(0, 200, 224, 0.12), transparent);
    margin-bottom: 26px;
  }

  .lg-brand-badge {
    display: inline-flex; align-items: center; gap: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 12px; color: rgba(168, 216, 255, 0.50);
    animation: slideUp .7s .35s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-brand-badge-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #00c8e0; flex-shrink: 0;
    box-shadow: 0 0 10px rgba(0, 200, 224, 0.80);
    animation: lg-pulse 2.2s ease-in-out infinite;
  }

  @keyframes lg-pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.75)} }

  .lg-form-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 56px 48px;
    background: rgba(13, 27, 46, 0.72);
    border-left: 1px solid rgba(0, 200, 224, 0.12);
    position: relative;
  }

  .lg-form-panel::before {
    content: '';
    position: absolute; top: -150px; right: -150px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0, 200, 224, 0.06), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    filter: blur(40px);
  }

  .lg-form-header {
    margin-bottom: 36px;
    position: relative; z-index: 1;
    animation: slideUp .6s .1s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-form-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 10px; font-weight: 800;
    letter-spacing: .18em; text-transform: uppercase;
    color: #00c8e0; margin-bottom: 14px;
    display: flex; align-items: center; gap: 9px;
  }

  .lg-form-eyebrow::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: #00c8e0; opacity: 0.7;
    animation: lg-pulse 2.2s ease-in-out infinite;
  }

  .lg-form-title {
    font-family: 'Poppins', sans-serif;
    font-size: 28px; font-weight: 700;
    color: #f8fafc; letter-spacing: -0.025em;
    margin-bottom: 7px;
  }

  .lg-form-sub {
    font-family: 'Inter', sans-serif;
    font-size: 13.5px; font-weight: 400;
    color: rgba(168, 216, 255, 0.52);
  }

  .lg-rule {
    height: 1px; background: linear-gradient(90deg, rgba(0, 200, 224, 0.10), transparent);
    margin-bottom: 32px;
    position: relative; z-index: 1;
  }

  .lg-error {
    display: flex; align-items: flex-start; gap: 11px;
    background: rgba(232, 55, 42, 0.12);
    border: 1px solid rgba(232, 55, 42, 0.28);
    border-radius: 12px;
    padding: 13px 15px;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: #ff7f6b;
    margin-bottom: 20px;
    animation: errorShake .35s ease;
    position: relative; z-index: 1;
  }

  @keyframes errorShake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-6px)}
    40%{transform:translateX(6px)}
    60%{transform:translateX(-4px)}
    80%{transform:translateX(4px)}
  }

  .lg-field {
    margin-bottom: 20px;
    position: relative; z-index: 1;
    animation: slideUp .5s ease both;
  }

  .lg-field:nth-child(3) { animation-delay: .2s; }
  .lg-field:nth-child(4) { animation-delay: .25s; }

  .lg-label {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 700;
    color: rgba(168, 216, 255, 0.64);
    margin-bottom: 9px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .lg-field-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(0, 200, 224, 0.35);
    pointer-events: none;
    display: flex; align-items: center;
    transition: color .25s ease;
  }

  /* Anchor the absolutely-positioned field icon + password eye to the input
     itself (not .lg-field, which also contains the label and would offset
     top:50% upward, leaving the icon misplaced/overlapping the label). */
  .lg-input-wrap { position: relative; }

  .lg-input-wrap:focus-within .lg-field-icon { color: rgba(0, 200, 224, 0.65); }

  .lg-input {
    width: 100%;
    background: rgba(13, 27, 46, 0.88);
    border: 1.5px solid rgba(0, 200, 224, 0.16);
    border-radius: 11px;
    padding: 13px 16px 13px 42px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #f8fafc;
    outline: none;
    transition: all .25s ease;
  }

  .lg-input::placeholder { color: rgba(168, 216, 255, 0.22); }

  .lg-input:focus {
    border-color: rgba(0, 200, 224, 0.42);
    background: rgba(0, 200, 224, 0.04);
    box-shadow: 0 0 0 4px rgba(0, 200, 224, 0.08), inset 0 0 0 1px rgba(0, 200, 224, 0.06);
  }

  .lg-input.has-eye { padding-right: 44px; }

  .lg-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    color: rgba(0, 200, 224, 0.35);
    display: flex; align-items: center;
    transition: color .25s ease;
  }

  .lg-eye:hover { color: rgba(0, 200, 224, 0.70); }

  .lg-helper-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px; margin-top: 8px;
    position: relative; z-index: 1;
    animation: slideUp .5s .3s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-remember {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: rgba(168, 216, 255, 0.55);
    cursor: pointer; user-select: none;
    transition: color .2s ease;
  }

  .lg-remember:hover { color: rgba(168, 216, 255, 0.75); }

  .lg-remember input[type="checkbox"] {
    accent-color: #00c8e0; cursor: pointer;
    width: 16px; height: 16px;
    border: 1.5px solid rgba(0, 200, 224, 0.32);
    border-radius: 4px; transition: all .2s ease;
  }

  .lg-remember input[type="checkbox"]:hover { border-color: rgba(0, 200, 224, 0.50); }

  .lg-forgot {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px; font-weight: 700;
    color: #00c8e0; text-decoration: none;
    transition: all .25s ease;
  }

  .lg-forgot:hover {
    color: #a8d8ff;
    text-shadow: 0 0 14px rgba(0, 200, 224, 0.35);
    letter-spacing: 0.5px;
  }

  .lg-btn {
    width: 100%;
    padding: 15px 22px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
    color: #fff;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .25s ease;
    margin-bottom: 24px;
    box-shadow: 0 0 32px rgba(232, 55, 42, 0.32), 0 0 0 1px rgba(232, 55, 42, 0.22);
    position: relative; z-index: 1;
    overflow: hidden;
    animation: slideUp .5s .35s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-btn::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
    transform: skewX(-20deg);
    transition: left 0.45s ease;
  }

  .lg-btn:hover:not(:disabled)::before { left: 140%; }

  .lg-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(232, 55, 42, 0.55), 0 6px 24px rgba(232, 55, 42, 0.35);
  }

  .lg-btn:active:not(:disabled) { transform: translateY(0); }
  .lg-btn:disabled { opacity: .5; cursor: not-allowed; }

  .lg-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.22); border-top-color: #fff;
    animation: lg-spin .65s linear infinite; flex-shrink: 0;
  }

  @keyframes lg-spin { to { transform: rotate(360deg); } }

  .lg-form-footer {
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: rgba(168, 216, 255, 0.50);
    padding-top: 22px;
    border-top: 1px solid rgba(0, 200, 224, 0.10);
    position: relative; z-index: 1;
    animation: slideUp .5s .4s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-form-footer a {
    color: #00c8e0; font-weight: 700;
    text-decoration: none; transition: all .25s ease;
  }

  .lg-form-footer a:hover {
    color: #a8d8ff;
    text-shadow: 0 0 14px rgba(0, 200, 224, 0.35);
    letter-spacing: 0.5px;
  }

  .lg-captcha {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 78px;
    margin: 4px 0 22px;
    position: relative;
    z-index: 1;
  }

  .lg-captcha-widget {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 65px;
    min-width: 300px;
  }

  /* Explicit-size Turnstile box: the Cloudflare "normal" widget is exactly
     300×65px. Without reserved dimensions the container can collapse to 0px
     (e.g. while api.js is still loading or an ad-blocker delays the iframe),
     making the widget appear missing. The box keeps layout stable and the
     widget visible above the submit button. */
  .lg-turnstile-box {
    width: 300px;
    height: 65px;
    min-width: 300px;
    min-height: 65px;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    position: relative;
    z-index: 1;
  }

  .lg-turnstile-box > div {
    width: 300px !important;
    height: 65px !important;
    max-width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  .lg-captcha-widget iframe,
  .lg-turnstile-box iframe {
    display: block !important;
    visibility: visible !important;
    width: 300px !important;
    height: 65px !important;
    border: 0;
  }

  @media (max-width: 360px) {
    /* Shrink the fixed-size widget instead of clipping it on tiny screens. */
    .lg-turnstile-box { transform: scale(0.86); transform-origin: top center; }
  }

  .lg-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 28px 0;
    animation: slideUp .6s cubic-bezier(.22,1,.36,1) both;
    position: relative; z-index: 1;
  }

  .lg-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(0, 200, 224, 0.18);
    border: 2px solid rgba(0, 200, 224, 0.40);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin-bottom: 18px;
    box-shadow: 0 0 32px rgba(0, 200, 224, 0.25);
    animation: successPop .5s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes successPop {
    from { transform: scale(.5) rotate(-15deg); opacity: 0; }
    to { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .lg-success-title {
    font-family: 'Poppins', sans-serif;
    font-size: 24px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;
  }

  .lg-success-sub {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: rgba(168, 216, 255, 0.60);
    line-height: 1.7;
  }

  .lg-checking {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; padding: 60px 0;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px; color: rgba(168, 216, 255, 0.55);
    position: relative; z-index: 1;
  }

  .lg-check-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2.5px solid rgba(0, 200, 224, 0.20); border-top-color: #00c8e0;
    animation: lg-spin .7s linear infinite;
  }

  @media (max-width: 920px) {
    .lg-page {
      grid-template-columns: 1fr;
      max-width: 500px;
      border-radius: 20px;
    }
    .lg-brand-panel { display: none; }
    .lg-form-panel { border-left: none; border-radius: 20px; }
  }

  @media (max-width: 480px) {
    .lg-root { padding: 16px; align-items: flex-start; padding-top: 32px; }
    .lg-page { min-height: auto; border-radius: 16px; }
    .lg-form-panel { padding: 36px 26px; }
    .lg-form-title { font-size: 24px; }
    .lg-input { padding: 11px 14px 11px 38px; font-size: 13px; }
    .lg-btn { padding: 13px 18px; font-size: 12px; margin-bottom: 18px; }
    .lg-form-footer { font-size: 12px; }
    .lg-back { font-size: 11px; }
  }

  @media (max-width: 360px) {
    .lg-form-panel { padding: 28px 18px; }
    .lg-form-title { font-size: 22px; }
    .lg-input { font-size: 12px; }
  }
`;

const ROLE_REDIRECT: Record<string, string> = {
  admin:     "/admin/dashboard",
  responder: "/responder/dashboard",
  citizen:   "/citizen/dashboard",
};

// ── Helper Icons ────────────────────────────────────────────────────────
function IconMail() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}

function IconLock() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}

// ── Main Component ────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ── State ─────────────────────────────────────────────────────────────
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [remember, setRemember]     = useState(false);
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");
  const [checking, setChecking]     = useState(true);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaStatus, setCaptchaStatus] = useState<"loading" | "ready" | "error">("loading");
  const [captchaMsg, setCaptchaMsg] = useState("");
  // Ref to the <Turnstile /> wrapper instance (reset/remove/getResponse).
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Resolve once per mount: env key (production path) with logging.
  const { siteKey: ENV_TURNSTILE_SITE_KEY, isDummy: ENV_IS_DUMMY } = useMemo(
    resolveTurnstileSiteKey,
    []
  );

  // Local dev FORCES the official Cloudflare test widget — never the
  // production sitekey. A production key is domain allow-listed, so on
  // localhost / `vite dev` Cloudflare rejects it and the widget collapses
  // to a blank 0px frame (the exact symptom seen here).
  const TURNSTILE_SITE_KEY = IS_LOCAL_DEV ? "1x00000000000000000000AA" : ENV_TURNSTILE_SITE_KEY;
  const TURNSTILE_IS_DUMMY = IS_LOCAL_DEV || ENV_IS_DUMMY;

  useEffect(() => {
    if (IS_LOCAL_DEV) {
      console.log(
        '[Turnstile] local dev detected (localhost or Vite DEV) — siteKey forced to "1x00000000000000000000AA". Production key ignored.'
      );
    }
  }, []);

  // ── Guard against setState after unmount ──
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Keep latest translator without re-rendering the widget on every
  // keystroke (`t` is re-created each render and is NOT referentially stable).
  // The <Turnstile /> wrapper uses stable callbacks by default
  // (rerenderOnCallbackChange=false), so translation updates flow through
  // this ref instead of tearing down the widget.
  const tRef = useRef(t);
  tRef.current = t;
  const tr = (path: string, fallback: string) => {
    try {
      return tRef.current(path, fallback);
    } catch {
      return fallback;
    }
  };

  // ── Retry CAPTCHA (used by the UI when the widget errors/expires) ──
  // The <Turnstile /> component owns the widget lifecycle + the
  // https://challenges.cloudflare.com/turnstile/v0/api.js script injection,
  // so retry is just a reset.
  const retryCaptcha = () => {
    setCaptchaMsg("");
    setCaptchaStatus("loading");
    setTurnstileToken(null);
    try {
      turnstileRef.current?.reset();
    } catch { /* ignore — widget will re-render on its own */ }
  };

  // ── Supabase session check ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          if (!cancelled) setChecking(false);
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          await supabase.auth.signOut();
          if (!cancelled) setChecking(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles").select("role").eq("id", user.id).single();

        const role = profile?.role?.trim().toLowerCase() ?? "";

        if (!cancelled) {
          setChecking(false);
          navigate(ROLE_REDIRECT[role] ?? "/citizen/dashboard", { replace: true });
        }
      } catch {
        if (!cancelled) setChecking(false);
      }
    };

    checkSession();
    return () => { cancelled = true; };
  }, [navigate]);

  // ── Reset CAPTCHA ──
  // The <Turnstile /> wrapper owns the widget; reset via its instance ref.
  const resetCaptcha = () => {
    setTurnstileToken(null);
    try {
      turnstileRef.current?.reset();
    } catch {
      // If reset fails (e.g. widget removed), the wrapper re-renders on its own.
    }
  };

  // ── Handle login ────────────────────────────────────────────────────────
  // Sends the Turnstile token as `options.captchaToken` (Supabase verifies it
  // server-side against the sitekey/secret pair in Auth > CAPTCHA settings).
  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError(t("login.errors.missingFields", "Please fill in all required fields."));
      return;
    }
    if (captchaStatus === "loading") {
      setError(t("login.errors.captchaLoading", "Security check is still loading. Please wait a moment and try again."));
      return;
    }
    if (!turnstileToken) {
      setError(
        captchaMsg ||
          t("login.errors.needCaptcha", "Please complete the CAPTCHA to verify you're human.")
      );
      return;
    }
    setLoading(true);

    let authData: any = null;
    let authError: any = null;
    try {
      const res = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
        options: { captchaToken: turnstileToken },
      });
      authData = res.data;
      authError = res.error;
    } catch (e: any) {
      authError = e;
    }

    if (authError || !authData?.user) {
      const rawMessage = (authError?.message || "").toLowerCase();
      const isUnconfirmed = rawMessage.includes("email not confirmed");
      const isCaptcha =
        rawMessage.includes("captcha") ||
        rawMessage.includes("turnstile") ||
        rawMessage.includes("challenge") ||
        rawMessage.includes("robot") ||
        rawMessage.includes("bot ") ||
        rawMessage.includes("verification") ||
        rawMessage.includes("human");
      setError(
        isUnconfirmed
          ? t("login.errors.unconfirmedEmail", "Please verify your email before signing in.")
          : isCaptcha
            ? t(
                "login.errors.captchaFailed",
                "Security check failed. Please complete the CAPTCHA again and retry."
              )
            : t("login.errors.loginFailed", "Invalid email or password.")
      );
      setLoading(false);
      resetCaptcha();
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("role").eq("id", authData.user.id).single();

    if (profileError || !profile?.role) {
      await new Promise(res => setTimeout(res, 1500));
      if (!mountedRef.current) return;

      const { data: retryProfile } = await supabase
        .from("profiles").select("role").eq("id", authData.user.id).single();

      if (!mountedRef.current) return;

      if (!retryProfile?.role) {
        setError(t("login.errors.profileNotReady", "User profile is taking longer than expected. Please try again."));
        setLoading(false);
        return;
      }
      const role = retryProfile.role.trim().toLowerCase();
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        if (mountedRef.current) navigate(ROLE_REDIRECT[role] ?? "/citizen/dashboard", { replace: true });
      }, 900);
      return;
    }

    const role = profile.role.trim().toLowerCase();
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      if (mountedRef.current) navigate(ROLE_REDIRECT[role] ?? "/citizen/dashboard", { replace: true });
    }, 900);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="lg-root" style={{ '--bg-image': `url(${directorybg})` } as React.CSSProperties}>
        <div className="lg-page">

          {/* ── Left branding panel ── */}
          <div className="lg-brand-panel">
            <div className="lg-brand-panel-bg" style={{ backgroundImage: `url(${directorybg})` }} />
            <div className="lg-panel-geo" />
            <div className="lg-panel-geo-2" />

            <div className="lg-brand-top">
              <div className="lg-brand-logo">
                <div className="lg-brand-logo-img">
                  <img src={logoImage} alt="DumaSafeGuide" />
                </div>
                <div className="lg-brand-logo-name">Duma<span>SafeGuide</span></div>
              </div>

              <div className="lg-brand-headline">
                {t("login.headline1", "Empowering")}<br/>
                <span className="accent">{t("login.headlineAccent", "Dumaguete")}</span><br/>
                {t("login.headline2", "Safety Together.")}
              </div>
              <p className="lg-brand-desc">
                {t("login.desc", "Real-time emergency monitoring and citizen response platform.")}
              </p>
            </div>

            <div className="lg-brand-bottom">
              <div className="lg-brand-stats">
                <div>
                  <div className="lg-brand-stat-val">30<em>+</em></div>
                  <div className="lg-brand-stat-label">{t("login.stats.barangays", "Barangays Covered")}</div>
                </div>
                <div>
                  <div className="lg-brand-stat-val"><em>24</em>/7</div>
                  <div className="lg-brand-stat-label">{t("login.stats.monitoring", "Monitoring Status")}</div>
                </div>
                <div>
                  <div className="lg-brand-stat-val">&lt;<em>5m</em></div>
                  <div className="lg-brand-stat-label">{t("login.stats.avgResponse", "Average Response Time")}</div>
                </div>
              </div>
              <div className="lg-brand-divider" />
              <div className="lg-brand-badge">
                <span className="lg-brand-badge-dot" />
                {t("login.badge", "Official City Emergency Portal")}
              </div>
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="lg-form-panel">
            {checking ? (
              <div className="lg-checking">
                <span className="lg-check-spin" />
                {t("login.checkingSession", "Checking session...")}
              </div>
            ) : success ? (
              <div className="lg-success">
                <div className="lg-success-icon">
                  <FaCheck size={32} color="#00c8e0" />
                </div>
                <div className="lg-success-title">{t("login.success.title", "Welcome Back!")}</div>
                <div className="lg-success-sub">{t("login.success.sub", "Redirecting to your dashboard...")}</div>
              </div>
            ) : (
              <div>
                <Link to="/" className="lg-back">
                  <span className="lg-back-arrow">←</span>
                  {t("login.backToHome", "Back to Home")}
                </Link>

                <div className="lg-form-header">
                  <div className="lg-form-eyebrow">{t("login.formEyebrow", "Secure Portal")}</div>
                  <div className="lg-form-title">{t("login.formTitle", "Welcome Back")}</div>
                  <div className="lg-form-sub">{t("login.formSub", "Enter your credentials to access your account")}</div>
                </div>

                <div className="lg-rule" />

                {error && (
                  <div className="lg-error" key={error}>
                    <span>⚠</span><span>{error}</span>
                  </div>
                )}

                <div className="lg-field">
                  <label className="lg-label">{t("login.labels.email", "Email Address")}</label>
                  <div className="lg-input-wrap">
                    <span className="lg-field-icon"><IconMail /></span>
                    <input
                      className="lg-input"
                      type="email"
                      placeholder=" "
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleLogin(); } }}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="lg-field">
                  <label className="lg-label">{t("login.labels.password", "Password")}</label>
                  <div className="lg-input-wrap">
                    <span className="lg-field-icon"><IconLock /></span>
                    <input
                      className="lg-input has-eye"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleLogin(); } }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="lg-eye"
                      onClick={() => setShowPw(v => !v)}
                      tabIndex={-1}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="lg-helper-row">
                  <label className="lg-remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                    />
                    {t("login.rememberMe", "Remember Me")}
                  </label>
                  <Link to="/forgot-password" className="lg-forgot">
                    {t("login.forgotPassword", "Forgot Password?")}
                  </Link>
                </div>

                <div className="lg-captcha" id="login-turnstile-wrapper">
                  {/* ── Cloudflare Turnstile — renders directly above MAG-LOGIN.
                      The @marsidev/react-turnstile wrapper injects
                      https://challenges.cloudflare.com/turnstile/v0/api.js
                      itself (there is intentionally NO <script> tag in
                      index.html — a hardcoded tag races the wrapper's
                      onload handshake and leaves window.turnstile
                      undefined). The .lg-turnstile-box reserves the exact
                      300×65px widget footprint so it never collapses. ── */}
                  <div className="lg-turnstile-box" id="login-turnstile-widget" style={{ minHeight: "65px", width: "100%", display: "flex", justifyContent: "center" }}>
                  <Turnstile
                    ref={turnstileRef as React.Ref<TurnstileInstance | undefined>}
                    siteKey={isLocalhostHost() ? "1x00000000000000000000AA" : TURNSTILE_SITE_KEY}
                    options={{ theme: "dark" }}
                    onWidgetLoad={(widgetId) => {
                      console.log("[Turnstile] widget loaded. id:", widgetId, "| siteKey:", TURNSTILE_SITE_KEY);
                      if (!mountedRef.current) return;
                      setCaptchaStatus("ready");
                    }}
                    onSuccess={(token) => {
                      console.log("[Turnstile] success — token received. length:", token?.length);
                      setTurnstileToken(token);
                      if (!mountedRef.current) return;
                      setCaptchaMsg("");
                      setCaptchaStatus("ready");
                    }}
                    onExpire={() => {
                      console.log("[Turnstile] token expired — resetting widget for a fresh challenge.");
                      if (!mountedRef.current) return;
                      setTurnstileToken(null);
                      setCaptchaMsg(tr("login.errors.captchaExpired", "Security check expired. Please verify again."));
                      try { turnstileRef.current?.reset(); } catch { /* ignore */ }
                    }}
                    onTimeout={() => {
                      console.log("[Turnstile] widget timed out waiting for interaction.");
                      if (!mountedRef.current) return;
                      setTurnstileToken(null);
                      setCaptchaStatus("error");
                      setCaptchaMsg(tr("login.errors.captchaTimeout", "Security check timed out. Please retry."));
                    }}
                    onError={(code) => {
                      console.log("[Turnstile] onError failure code:", code);
                      console.error(
                        "[Turnstile] widget failed. code:",
                        code,
                        "| siteKey:",
                        TURNSTILE_SITE_KEY,
                        "| hostname:",
                        typeof window !== "undefined" ? window.location.hostname : "unknown",
                        "| hint: 110xxx/400xxx = sitekey-domain mismatch (use the 1x00000000000000000000AA test key on localhost); network/ad-blocker blocks also surface here."
                      );
                      if (!mountedRef.current) return;
                      setTurnstileToken(null);
                      setCaptchaStatus("error");
                      setCaptchaMsg(
                        tr("login.errors.captchaLoadFailed", "Security check failed to load. Check your connection / ad-blocker and retry.")
                      );
                    }}
                  />
                  </div>
                  {TURNSTILE_IS_DUMMY && (
                    <div style={{ fontSize: 11, color: "rgba(255,180,166,0.75)", marginTop: 6, textAlign: "center", maxWidth: 320 }}>
                      Dev mode: using Cloudflare dummy sitekey — Supabase CAPTCHA verification must be disabled or use matching test keys.
                    </div>
                  )}
                  {captchaStatus === "loading" && !turnstileToken && (
                    <div style={{ fontSize: 12, color: "rgba(168,216,255,0.55)", marginTop: 8 }}>
                      {t("login.captchaLoading", "Loading security check…")}
                    </div>
                  )}
                  {captchaMsg && (
                    <div style={{ fontSize: 12, color: "#ffb4a6", marginTop: 8, textAlign: "center", maxWidth: 320 }}>
                      {captchaMsg}{" "}
                      <button
                        type="button"
                        onClick={retryCaptcha}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#00c8e0",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 12,
                          padding: 0,
                          marginLeft: 4,
                        }}
                      >
                        {t("login.captchaRetry", "Retry")}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  id="MAG-LOGIN"
                  data-testid="MAG-LOGIN"
                  className="lg-btn"
                  onClick={handleLogin}
                  disabled={loading}
                  type="button"
                >
                  {loading && <span className="lg-spinner" />}
                  {loading ? t("login.submitting", "Signing In...") : (
                    <>
                      {t("login.submitBtn", "Sign In")}
                      <FaArrowRight size={11} />
                    </>
                  )}
                </button>

                <div className="lg-form-footer">
                  {t("login.footerNoAccount", "Don't have an account? ")}
                  <Link to="/signup">{t("login.footerCreateAccount", "Register Here")}</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}