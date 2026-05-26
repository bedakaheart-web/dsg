import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../js/supabase";
import { FaEye, FaEyeSlash, FaShieldAlt, FaCheck, FaArrowRight } from "react-icons/fa";
import directorybg from "../assets/directorybg.png";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .su-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    color: #ddeef8;
    background: linear-gradient(135deg, #0d1b2e 0%, #071a1d 50%, #0a1f28 100%);
    overflow: hidden;
    position: relative;
  }

  .su-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    opacity: 0.12;
    pointer-events: none;
  }

  .su-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(0,200,224,0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(232,55,42,0.06) 0%, transparent 50%);
    animation: atmosphereDrift 25s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes atmosphereDrift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  /* ── Left Panel ── */
  .su-left {
    position: relative;
    width: 45%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 52px;
    overflow: hidden;
    flex-shrink: 0;
    z-index: 1;
  }

  .su-left-bg {
    position: absolute; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
    opacity: 0.02;
  }

  .su-left-bg::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(7,16,29,0.92) 0%, rgba(7,16,29,0.78) 50%, rgba(7,16,29,0.90) 100%);
  }

  .su-left-lines {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,200,224,0.015) 3px, rgba(0,200,224,0.015) 4px);
  }

  .su-left-glow-a {
    position: absolute; z-index: 1; pointer-events: none;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,55,42,0.10) 0%, transparent 65%);
    top: -180px; left: -160px;
    filter: blur(40px);
    animation: glowPulse 8s ease-in-out infinite;
  }

  .su-left-glow-b {
    position: absolute; z-index: 1; pointer-events: none;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,224,0.08) 0%, transparent 65%);
    bottom: -100px; right: -80px;
    filter: blur(40px);
    animation: glowPulse 10s 2s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 0.9; }
  }

  .su-left::after {
    content: '';
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg, transparent 0%, rgba(0,200,224,0.25) 20%, rgba(0,200,224,0.40) 50%, rgba(0,200,224,0.25) 80%, transparent 100%);
    z-index: 3;
  }

  .su-left-content { position: relative; z-index: 2; }

  .su-brand-row {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 60px;
    animation: slideDown .6s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .su-logo-ring {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, rgba(232,55,42,0.12), rgba(0,200,224,0.08));
    border: 1px solid rgba(0,200,224,0.25);
    display: flex; align-items: center; justify-content: center;
    color: #e8372a; font-size: 18px; flex-shrink: 0;
    box-shadow: 0 0 20px rgba(0,200,224,0.10);
    transition: transform .3s ease;
  }

  .su-brand-row:hover .su-logo-ring { transform: scale(1.08) rotate(-5deg); }

  .su-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 900;
    color: #F8FAFC; letter-spacing: -0.03em;
  }

  .su-brand-name span { color: #00c8e0; }

  .su-hero {
    padding-bottom: 40px;
    animation: slideUp .7s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .su-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 12px; border-radius: 99px;
    background: rgba(0,200,224,0.10);
    border: 1px solid rgba(0,200,224,0.25);
    font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(0,200,224,0.80);
    margin-bottom: 20px;
  }

  .su-hero-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #00c8e0;
    animation: su-pulse 2s ease-in-out infinite;
  }

  @keyframes su-pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)} }

  .su-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px; font-weight: 900;
    color: #F8FAFC; line-height: 1.08; letter-spacing: -0.03em;
    margin-bottom: 18px;
  }

  .su-hero-title .c { color: #00c8e0; }
  .su-hero-title .r { color: #e8372a; }

  .su-hero-desc {
    font-size: 14px; font-weight: 300;
    color: rgba(168,216,255,0.45); line-height: 1.8;
    max-width: 340px; margin-bottom: 36px;
  }

  .su-steps { display: flex; flex-direction: column; gap: 14px; max-width: 340px; }

  .su-step {
    display: flex; align-items: flex-start; gap: 13px;
    padding: 16px 18px; border-radius: 12px;
    background: rgba(10,21,37,0.55);
    border: 1px solid rgba(0,200,224,0.12);
    backdrop-filter: blur(12px);
    transition: all .3s ease;
    animation: slideUp .5s ease both;
  }

  .su-step:nth-child(1) { animation-delay: .2s; }
  .su-step:nth-child(2) { animation-delay: .3s; }
  .su-step:nth-child(3) { animation-delay: .4s; }

  .su-step:hover {
    background: rgba(10,21,37,0.75);
    border-color: rgba(0,200,224,0.22);
    transform: translateX(4px);
    box-shadow: 0 8px 24px rgba(0,200,224,0.08);
  }

  .su-step-num {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    background: rgba(0,200,224,0.12);
    border: 1px solid rgba(0,200,224,0.30);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 900; color: #00c8e0;
    margin-top: 1px;
  }

  .su-step-title { font-size: 12.5px; font-weight: 700; color: rgba(168,216,255,0.85); margin-bottom: 3px; letter-spacing: -0.01em; }
  .su-step-desc  { font-size: 11.5px; color: rgba(168,216,255,0.35); line-height: 1.5; }

  .su-left-footer {
    position: relative; z-index: 2;
    animation: slideUp .7s .5s cubic-bezier(.22,1,.36,1) both;
  }

  .su-cert-badge {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 10px 14px; border-radius: 10px;
    background: rgba(10,21,37,0.70);
    border: 1px solid rgba(0,200,224,0.15);
    backdrop-filter: blur(12px);
    transition: all .3s ease;
  }

  .su-cert-badge:hover {
    background: rgba(10,21,37,0.90);
    border-color: rgba(0,200,224,0.30);
    box-shadow: 0 8px 24px rgba(0,200,224,0.08);
  }

  .su-cert-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #2ecc8f; flex-shrink: 0;
    box-shadow: 0 0 8px rgba(46,204,143,0.7);
    animation: su-pulse 2.5s ease-in-out infinite;
  }

  .su-cert-text { font-size: 11.5px; color: rgba(168,216,255,0.50); }
  .su-cert-text strong { color: rgba(168,216,255,0.80); font-weight: 700; }

  /* ── Right Panel ── */
  .su-right {
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    background: rgba(6,13,24,0.70);
    position: relative;
    overflow-y: auto;
    z-index: 1;
  }

  .su-right::before {
    content: ''; position: absolute; top: -200px; right: -200px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,224,0.05) 0%, transparent 65%);
    pointer-events: none;
    filter: blur(40px);
  }

  .su-form-wrap {
    width: 100%; max-width: 460px;
    position: relative; z-index: 1;
    animation: slideUp .6s cubic-bezier(.22,1,.36,1) both;
  }

  .su-back {
    display: inline-flex; align-items: center; gap: 7px;
    margin-bottom: 32px; font-size: 12px; font-weight: 600;
    color: rgba(168,216,255,0.45); text-decoration: none;
    transition: all .3s ease;
  }

  .su-back:hover { color: #00c8e0; gap: 10px; }
  .su-back svg   { transition: transform .3s ease; }
  .su-back:hover svg { transform: translateX(-4px); }

  .su-form-accent {
    width: 48px; height: 3px; border-radius: 99px;
    background: linear-gradient(90deg, #e8372a 0%, #00c8e0 100%);
    margin-bottom: 20px;
    animation: slideRight .7s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideRight {
    from { width: 0; opacity: 0; }
    to { width: 48px; opacity: 1; }
  }

  .su-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 900;
    color: #F8FAFC; letter-spacing: -0.03em; margin-bottom: 6px;
    animation: slideUp .6s .1s cubic-bezier(.22,1,.36,1) both;
  }

  .su-form-sub {
    font-size: 13.5px; font-weight: 300;
    color: rgba(168,216,255,0.45); margin-bottom: 28px;
    animation: slideUp .6s .15s cubic-bezier(.22,1,.36,1) both;
  }

  .su-error {
    display: flex; align-items: flex-start; gap: 11px;
    background: rgba(232,55,42,0.10);
    border: 1px solid rgba(232,55,42,0.28);
    border-radius: 12px; padding: 13px 15px;
    font-size: 12.5px; color: #ff8877; margin-bottom: 18px;
    animation: errorShake .35s ease;
  }

  @keyframes errorShake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-6px)}
    40%{transform:translateX(6px)}
    60%{transform:translateX(-4px)}
    80%{transform:translateX(4px)}
  }

  .su-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .su-field { margin-bottom: 15px; animation: slideUp .5s ease both; }
  .su-field:nth-child(1) { animation-delay: .2s; }
  .su-field:nth-child(2) { animation-delay: .25s; }
  .su-field:nth-child(3) { animation-delay: .3s; }
  .su-field:nth-child(4) { animation-delay: .35s; }
  .su-field:nth-child(5) { animation-delay: .4s; }

  .su-label {
    display: block; font-size: 10px; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; color: rgba(168,216,255,0.32); margin-bottom: 8px;
  }

  .su-input-wrap { position: relative; }

  .su-field-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(0,200,224,0.30); pointer-events: none;
    display: flex; align-items: center;
    transition: color .3s ease;
  }

  .su-input-wrap:focus-within .su-field-icon { color: rgba(0,200,224,0.60); }

  .su-input, .su-select {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(0,200,224,0.12);
    border-radius: 11px;
    padding: 12px 16px 12px 38px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #F8FAFC;
    outline: none;
    caret-color: #00c8e0;
    transition: all .25s ease;
  }

  .su-input::placeholder { color: rgba(168,216,255,0.18); }

  .su-input:focus, .su-select:focus {
    border-color: rgba(0,200,224,0.35);
    background: rgba(0,200,224,0.03);
    box-shadow: 0 0 0 3px rgba(0,200,224,0.07), inset 0 0 0 1px rgba(0,200,224,0.05);
  }

  .su-input.has-eye { padding-right: 42px; }

  .su-select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(0,200,224,0.35)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center; background-size: 16px;
    padding-right: 40px;
  }

  .su-select option { background: #0a1525; color: #F8FAFC; }

  .su-eye {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    color: rgba(0,200,224,0.25);
    display: flex; align-items: center;
    transition: color .2s;
  }

  .su-eye:hover { color: rgba(0,200,224,0.60); }

  .su-pw-hint {
    font-size: 11px; color: rgba(168,216,255,0.22);
    margin-top: 5px; padding-left: 2px; font-weight: 400;
  }

  .su-btn {
    width: 100%; padding: 14px 20px;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
    letter-spacing: .08em; text-transform: uppercase;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
    color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .25s ease;
    margin-top: 10px; margin-bottom: 20px;
    position: relative; overflow: hidden;
    box-shadow: 0 0 30px rgba(232,55,42,0.30);
  }

  .su-btn::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transform: skewX(-20deg); transition: left .4s ease;
  }

  .su-btn:hover:not(:disabled)::before { left: 140%; }
  .su-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 45px rgba(232,55,42,0.50);
    background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
  }
  .su-btn:active:not(:disabled) { transform: translateY(0); }
  .su-btn:disabled { opacity: .5; cursor: not-allowed; }

  .su-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.25); border-top-color: #fff;
    animation: su-spin .65s linear infinite; flex-shrink: 0;
  }

  @keyframes su-spin { to { transform: rotate(360deg); } }

  .su-form-footer { text-align: center; font-size: 13px; color: rgba(168,216,255,0.35); }
  .su-form-footer a { color: #00c8e0; text-decoration: none; font-weight: 700; transition: all .2s ease; }
  .su-form-footer a:hover { color: #a8d8ff; text-shadow: 0 0 12px rgba(0,200,224,0.25); }

  /* ── Success State ── */
  .su-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 40px 0;
    animation: slideUp .6s cubic-bezier(.22,1,.36,1) both;
  }

  .su-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(0,200,224,0.12);
    border: 2px solid rgba(0,200,224,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin-bottom: 18px;
    box-shadow: 0 0 30px rgba(0,200,224,0.20);
    animation: successPop .5s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes successPop {
    from { transform: scale(.6) rotate(-8deg); opacity: 0; }
    to   { transform: scale(1)  rotate(0deg);  opacity: 1; }
  }

  .su-success-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 900; color: #F8FAFC; margin-bottom: 10px; }
  .su-success-msg   { font-size: 13.5px; font-weight: 300; color: rgba(168,216,255,0.48); line-height: 1.8; margin-bottom: 8px; max-width: 340px; }
  .su-success-msg strong { color: #00c8e0; font-weight: 700; }
  .su-success-note  { font-size: 12px; color: rgba(168,216,255,0.28); margin-bottom: 28px; font-style: italic; }
  .su-success-div   { width: 100%; height: 1px; background: rgba(0,200,224,0.12); margin-bottom: 24px; }

  .su-success-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    width: 100%; padding: 14px;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
    letter-spacing: .08em; text-transform: uppercase;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
    color: #fff; cursor: pointer; text-decoration: none;
    transition: all .25s ease;
    box-shadow: 0 0 30px rgba(232,55,42,0.30);
    position: relative; overflow: hidden;
  }

  .su-success-btn::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transform: skewX(-20deg); transition: left .4s ease;
  }

  .su-success-btn:hover::before { left: 140%; }
  .su-success-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 45px rgba(232,55,42,0.50);
    background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
  }

  /* ── Responsive ── */
  @media (max-width: 920px) {
    .su-root { flex-direction: column; overflow-y: auto; }
    .su-left { width: 100%; min-height: auto; padding: 36px 32px 32px; }
    .su-left::after { display: none; }
    .su-hero { padding-bottom: 24px; }
    .su-hero-title { font-size: 28px; }
    .su-steps { display: none; }
    .su-right { min-height: auto; padding: 40px 32px 56px; }
  }

  @media (max-width: 600px) {
    .su-left { padding: 24px 20px 20px; }
    .su-brand-row { margin-bottom: 40px; }
    .su-hero-title { font-size: 24px; }
    .su-hero-desc { font-size: 13px; }
    .su-right { padding: 28px 20px 48px; }
    .su-form-wrap { max-width: 100%; }
    .su-row-2 { grid-template-columns: 1fr; gap: 0; }
    .su-input, .su-select { padding: 11px 14px 11px 36px; font-size: 13px; }
    .su-btn { padding: 12px 18px; font-size: 12px; margin-bottom: 16px; }
    .su-form-title { font-size: 22px; }
    .su-success-icon { width: 64px; height: 64px; font-size: 28px; }
    .su-success-title { font-size: 20px; }
  }

  @media (max-width: 360px) {
    .su-left { padding: 16px 14px 14px; }
    .su-hero-title { font-size: 22px; }
    .su-right { padding: 20px 14px 40px; }
    .su-form-title { font-size: 20px; }
    .su-btn { padding: 11px 16px; }
  }
`;

const BARANGAYS = [
  "Bagacay","Bajumpandan","Balugo","Banilad","Bantayan","Batinguel",
  "Buñao","Cadawinonan","Calindagan","Camanjac","Candau-ay","Cantil-e",
  "Daro","Looc","Lumabangan","Mangnao","Motong","Piapi","Poblacion 1",
  "Poblacion 2","Poblacion 3","Poblacion 4","Poblacion 5","Poblacion 6",
  "Poblacion 7","Poblacion 8","Pulantubig","Tabuctubig","Taclobo","Talay"
].sort();

function IconUser() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function IconMapPin() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconPhone() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.06 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.1a16 16 0 0 0 5.45 5.45l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function IconMail() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function IconLock() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", barangay: "", password: "", confirmPassword: ""
  });
  const [showPw,        setShowPw]        = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { fullName, email, phone, barangay, password, confirmPassword } = formData;

    if (!fullName || !email || !phone || !barangay || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed. Please try again.");

      // Step 2: Upsert the profile row.
      // Supabase may auto-create a profiles row via trigger on signUp,
      // so we use upsert (not insert) to avoid duplicate key errors.
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id:           authData.user.id,
            full_name:    fullName,
            email,
            phone_number: phone,
            barangay,
            role:         "citizen",
          },
          { onConflict: "id" }
        );

      if (profileError) throw profileError;

      // Step 3: Sign out — Supabase auto-logs in after signUp,
      // but we want the citizen to go through the login page manually.
      await supabase.auth.signOut();

      setSuccess(true);
      setTimeout(() => navigate("/login"), 4000);

    } catch (err: any) {
      // If it's a duplicate key error but auth succeeded, the account
      // was created — just treat it as success.
      const isDuplicate =
        err.message?.toLowerCase().includes("duplicate") ||
        err.message?.toLowerCase().includes("already") ||
        err.code === "23505";

      if (isDuplicate) {
        await supabase.auth.signOut();
        setSuccess(true);
        setTimeout(() => navigate("/login"), 4000);
        return;
      }

      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const LeftPanel = () => (
    <div className="su-left">
      <div className="su-left-bg" style={{ backgroundImage: `url(${directorybg})` }} />
      <div className="su-left-lines" />
      <div className="su-left-glow-a" />
      <div className="su-left-glow-b" />

      <div className="su-left-content">
        <div className="su-brand-row">
          <div className="su-logo-ring"><FaShieldAlt /></div>
          <div className="su-brand-name">Duma<span>SafeGuide</span></div>
        </div>
      </div>

      <div className="su-hero su-left-content">
        <div className="su-hero-eyebrow">
          <span className="su-hero-dot" />
          Community Safety Platform
        </div>
        <h1 className="su-hero-title">
          Join the<br/>
          <span className="c">emergency</span><br/>
          <span className="r">response</span>
        </h1>
        <p className="su-hero-desc">
          Register your account to report incidents, receive real-time alerts,
          and stay connected with emergency responders across all barangays.
        </p>

        <div className="su-steps">
          <div className="su-step">
            <div className="su-step-num">1</div>
            <div>
              <div className="su-step-title">Create Account</div>
              <div className="su-step-desc">Fill your details and select your barangay.</div>
            </div>
          </div>
          <div className="su-step">
            <div className="su-step-num">2</div>
            <div>
              <div className="su-step-title">Instant Access</div>
              <div className="su-step-desc">Your account is ready immediately after signup.</div>
            </div>
          </div>
          <div className="su-step">
            <div className="su-step-num">3</div>
            <div>
              <div className="su-step-title">Report & Respond</div>
              <div className="su-step-desc">Submit incidents and coordinate with responders now.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="su-left-footer">
        <div className="su-cert-badge">
          <span className="su-cert-dot" />
          <span className="su-cert-text"><strong>Free for all citizens</strong> in Dumaguete</span>
        </div>
      </div>
    </div>
  );

  if (success) {
    return (
      <>
        <style>{CSS}</style>
        <div className="su-root" style={{ '--bg-image': `url(${directorybg})` } as React.CSSProperties}>
          <LeftPanel />
          <div className="su-right">
            <div className="su-form-wrap">
              <div className="su-success">
                <div className="su-success-icon">
                  <FaCheck />
                </div>
                <div className="su-success-title">Account Created!</div>
                <p className="su-success-msg">
                  Welcome to <strong>DumaSafeGuide</strong>!<br/>
                  Your citizen account is ready immediately.
                </p>
                <p className="su-success-note">
                  Redirecting to login in 4 seconds…
                </p>
                <div className="su-success-div" />
                <Link to="/login" className="su-success-btn">
                  <FaArrowRight size={12} style={{ marginRight: "2px" }} />
                  Sign In Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="su-root" style={{ '--bg-image': `url(${directorybg})` } as React.CSSProperties}>
        <LeftPanel />

        <div className="su-right">
          <div className="su-form-wrap">

            <Link to="/" className="su-back">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to home
            </Link>

            <div className="su-form-accent" />
            <div className="su-form-title">Create Account</div>
            <div className="su-form-sub">Join DumaSafeGuide — it's completely free for all citizens.</div>

            {error && (
              <div className="su-error" key={error}>
                <span>⚠</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} noValidate>
              <div className="su-field">
                <label className="su-label">Full Name</label>
                <div className="su-input-wrap">
                  <span className="su-field-icon"><IconUser /></span>
                  <input className="su-input" name="fullName" type="text"
                    placeholder="Maria Clara"
                    value={formData.fullName} onChange={handleChange} />
                </div>
              </div>

              <div className="su-row-2">
                <div className="su-field">
                  <label className="su-label">Barangay</label>
                  <div className="su-input-wrap">
                    <span className="su-field-icon"><IconMapPin /></span>
                    <select className="su-select" name="barangay"
                      value={formData.barangay} onChange={handleChange}>
                      <option value="" disabled>Select location</option>
                      {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="su-field">
                  <label className="su-label">Phone Number</label>
                  <div className="su-input-wrap">
                    <span className="su-field-icon"><IconPhone /></span>
                    <input className="su-input" name="phone" type="tel"
                      placeholder="09XX XXX XXXX"
                      value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="su-field">
                <label className="su-label">Email Address</label>
                <div className="su-input-wrap">
                  <span className="su-field-icon"><IconMail /></span>
                  <input className="su-input" name="email" type="email"
                    placeholder="name@example.com"
                    value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="su-row-2">
                <div className="su-field">
                  <label className="su-label">Password</label>
                  <div className="su-input-wrap">
                    <span className="su-field-icon"><IconLock /></span>
                    <input className="su-input has-eye" name="password"
                      type={showPw ? "text" : "password"} placeholder="••••••••"
                      value={formData.password} onChange={handleChange} />
                    <button type="button" className="su-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                      {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="su-field">
                  <label className="su-label">Confirm</label>
                  <div className="su-input-wrap">
                    <span className="su-field-icon"><IconLock /></span>
                    <input className="su-input has-eye" name="confirmPassword"
                      type={showConfirmPw ? "text" : "password"} placeholder="••••••••"
                      value={formData.confirmPassword} onChange={handleChange} />
                    <button type="button" className="su-eye" onClick={() => setShowConfirmPw(!showConfirmPw)} tabIndex={-1}>
                      {showConfirmPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="su-pw-hint">Minimum 6 characters required.</p>

              <button className="su-btn" type="submit" disabled={loading}>
                {loading && <span className="su-spinner" />}
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="su-form-footer">
              Already have an account?{" "}
              <Link to="/login">Sign in →</Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}