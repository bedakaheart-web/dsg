// src/pages/Homepage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, Fragment } from "react";
import { FaMapMarkedAlt, FaUsers, FaLightbulb, FaPhoneAlt, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { supabase } from "../js/supabase";
import homepageBg from "../assets/homepage.bg.jpg";

const cards = [
  {
    icon: <FaMapMarkedAlt size={28} />,
    label: "Safety Map",
    desc: "View live incident zones and safe routes",
    to: "/map",
    accent: "#00c8e0",
    tag: "LIVE",
  },
  {
    icon: <FaUsers size={28} />,
    label: "Directory",
    desc: "Barangay officials and contact persons",
    to: "/directory",
    accent: "#4A90D9",
    tag: "PEOPLE",
  },
  {
    icon: <FaLightbulb size={28} />,
    label: "Safety Tips",
    desc: "Preparedness guides for every situation",
    to: "/safetytips",
    accent: "#e8b830",
    tag: "TIPS",
  },
  {
    icon: <FaPhoneAlt size={28} />,
    label: "Emergency Contacts",
    desc: "Reach responders and hotlines instantly",
    to: "/resources",
    accent: "#e8372a",
    tag: "URGENT",
  },
];

const STATS = [
  { value: 30, label: "Barangays Covered", suffix: "" },
  { value: 24, label: "Hour Response",     suffix: "/7" },
  { value: 5,  label: "Avg. Response (min)", suffix: "m" },
];

const TICKER_ITEMS = [
  "🔴 STAY ALERT — Monitor local advisories",
  "📡 LIVE — Incident tracking active",
  "🚨 HOTLINE — Call 911 for emergencies",
  "🌧️ FLOOD — Check safe routes on the map",
  "🛡️ PREPARED — Review your barangay safety tips",
  "📍 REPORT — File incidents directly from your dashboard",
];

const ROLE_REDIRECT: Record<string, string> = {
  admin:     "/admin/dashboard",
  responder: "/responder/dashboard",
  citizen:   "/citizen/dashboard",
};

function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const raf = { id: 0 };
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) {
        raf.id = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    raf.id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.id);
  }, [start, target, duration]);
  return count;
}

function StatCounter({
  value,
  label,
  suffix,
  start,
}: {
  value: number;
  label: string;
  suffix: string;
  start: boolean;
}) {
  const count = useCounter(value, 1800, start);
  return (
    <div className="hp-stat">
      <div className="hp-stat-value">
        {count}
        <span className="hp-stat-suffix">{suffix}</span>
      </div>
      <div className="hp-stat-label">{label}</div>
    </div>
  );
}

export default function Homepage() {
  const navigate = useNavigate();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event !== "INITIAL_SESSION") return;
        if (!session?.user) return;

        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          const role = profile?.role?.trim().toLowerCase();
          if (role && ROLE_REDIRECT[role]) {
            navigate(ROLE_REDIRECT[role], { replace: true });
          }
        } catch (err) {
          console.error("Error fetching profile on initial session:", err);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError || !authData.user) {
        setError(authError?.message || "Login failed.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile?.role) {
        await new Promise(res => setTimeout(res, 1500));
        const { data: retryProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (!retryProfile?.role) {
          setError("Profile not ready yet. Please wait a moment and try again.");
          setLoading(false);
          return;
        }

        const role = retryProfile.role.trim().toLowerCase();
        setLoading(false);
        await new Promise(res => setTimeout(res, 100));
        navigate(ROLE_REDIRECT[role] ?? "/citizen/dashboard", { replace: true });
        return;
      }

      const role = profile.role.trim().toLowerCase();
      setLoading(false);
      await new Promise(res => setTimeout(res, 100));
      navigate(ROLE_REDIRECT[role] ?? "/citizen/dashboard", { replace: true });

    } catch (err: any) {
      setError(err.message || "Login failed.");
      setLoading(false);
    }
  };

  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Global overflow lock ── */
        html, body {
          overflow-x: hidden !important;
          width: 100%;
          max-width: 100vw;
        }

        /* ── Reset ── */
        .hp-root *, .hp-root *::before, .hp-root *::after {
          box-sizing: border-box;
        }

        .hp-root {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #ddeef8;
          overflow-x: hidden;
          position: relative;
          width: 100%;
          max-width: 100vw;
        }

        /* ── Background ── */
        .hp-bg {
          position: fixed; inset: 0; z-index: -1;
          overflow: hidden;
          will-change: transform;
          transform: translateZ(0);
        }
        .hp-bg-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center bottom; display: block;
          transform-origin: center center;
          animation: bgDrift 30s ease-in-out infinite;
          will-change: transform;
          transform: translateZ(0) scale(1.08);
        }
        .hp-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7,16,29,0.87) 0%,
            rgba(7,16,29,0.72) 40%,
            rgba(7,16,29,0.87) 75%,
            rgba(7,16,29,0.98) 100%
          );
        }
        .hp-bg-atmosphere {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 10% 0%,  rgba(232,55,42,0.14)  0%, transparent 65%),
            radial-gradient(ellipse 60% 70% at 90% 100%, rgba(0,200,224,0.10)  0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 55% 45%,  rgba(13,27,46,0.50)   0%, transparent 60%);
          pointer-events: none;
          animation: atmosphereDrift 20s ease-in-out infinite;
        }
        .hp-bg-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.45; pointer-events: none;
        }

        @keyframes bgDrift {
          0%   { transform: translateZ(0) scale(1.08) translate(0px, 0px); }
          25%  { transform: translateZ(0) scale(1.11) translate(-12px, -8px); }
          50%  { transform: translateZ(0) scale(1.10) translate(-6px, -14px); }
          75%  { transform: translateZ(0) scale(1.11) translate(8px, -6px); }
          100% { transform: translateZ(0) scale(1.08) translate(0px, 0px); }
        }

        @keyframes atmosphereDrift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        /* ── Orbs — clipped so they never cause horizontal scroll ── */
        .hp-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          animation: orbDrift linear infinite;
          will-change: transform;
          transform: translateZ(0);
          filter: blur(60px);
          /* Prevent orbs from expanding the scrollable area */
          max-width: 100vw;
        }
        .hp-orb-1 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(232,55,42,0.09) 0%, transparent 70%);
          top: 5%; left: -8%;
          animation-duration: 22s;
        }
        .hp-orb-2 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(0,200,224,0.08) 0%, transparent 70%);
          bottom: 15%; right: -6%;
          animation-duration: 28s; animation-delay: -10s;
        }
        .hp-orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(74,144,217,0.07) 0%, transparent 70%);
          top: 50%; left: 35%;
          animation-duration: 18s; animation-delay: -5s;
        }
        @keyframes orbDrift {
          0%   { transform: translateZ(0) translate(0, 0) scale(1); }
          33%  { transform: translateZ(0) translate(20px, -30px) scale(1.08); }
          66%  { transform: translateZ(0) translate(-16px, 20px) scale(0.95); }
          100% { transform: translateZ(0) translate(0, 0) scale(1); }
        }

        /* ── Badge row ── */
        .hp-badge-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 16px 0 0 0;
          position: relative;
          z-index: 2;
          animation: fadeDown 0.7s cubic-bezier(.22,1,.36,1) both;
          width: 100%;
          box-sizing: border-box;
        }
        .hp-badge-slot {
          width: auto;
          max-width: 340px;
          flex-shrink: 1;
          min-width: 0;
        }
        .hp-nav-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px 20px;
          background: rgba(8,18,32,0.80);
          border: 1px solid rgba(232,55,42,0.38);
          border-radius: 999px;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 0 0 1px rgba(232,55,42,0.15), 0 0 24px rgba(232,55,42,0.18), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: all 0.3s cubic-bezier(.22,1,.36,1);
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          box-sizing: border-box;
        }
        .hp-nav-badge::before {
          content: ''; position: absolute; top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: skewX(-20deg); transition: left 0.6s ease;
        }
        .hp-nav-badge:hover::before { left: 140%; }
        .hp-nav-badge:hover {
          background: rgba(12,24,42,0.95);
          border-color: rgba(232,55,42,0.70);
          box-shadow: 0 0 0 1px rgba(232,55,42,0.25), 0 0 36px rgba(232,55,42,0.40), 0 0 80px rgba(232,55,42,0.12), inset 0 1px 0 rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }
        .hp-nav-badge:active { transform: translateY(0); }

        .hp-badge-icon {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(232,55,42,0.18); border: 1.5px solid rgba(232,55,42,0.35);
          color: #e8372a; font-size: 13px; flex-shrink: 0;
          position: relative;
          animation: ringShake 3s ease-in-out infinite;
          box-shadow: 0 0 12px rgba(232,55,42,0.25);
        }
        .hp-badge-icon::before,
        .hp-badge-icon::after {
          content: ''; position: absolute; inset: -6px;
          border-radius: 50%; border: 1.5px solid rgba(232,55,42,0.45);
          animation: badgePulse 2s ease-out infinite;
        }
        .hp-badge-icon::after { inset: -12px; animation-delay: 0.5s; border-color: rgba(232,55,42,0.2); }

        @keyframes badgePulse {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes ringShake {
          0%, 85%, 100% { transform: rotate(0deg); }
          88%           { transform: rotate(-16deg); }
          91%           { transform: rotate(16deg); }
          94%           { transform: rotate(-12deg); }
          97%           { transform: rotate(10deg); }
        }

        .hp-badge-text {
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.08em; color: rgba(200,225,245,0.70);
        }
        .hp-badge-sep { width: 1.5px; height: 16px; background: rgba(232,55,42,0.30); flex-shrink: 0; }
        .hp-badge-911 {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 900;
          letter-spacing: 0.1em; color: #e8372a;
          animation: glowPulse 1.6s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 8px rgba(232,55,42,0.5); opacity: 1; }
          50%       { text-shadow: 0 0 16px rgba(232,55,42,0.95), 0 0 32px rgba(232,55,42,0.5); opacity: 0.95; }
        }

        /* ── Inner container ── */
        .hp-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hp-hero {
          margin-top: 48px; margin-bottom: 80px;
          display: grid;
          grid-template-columns: 1fr minmax(0, 420px);
          gap: 56px; align-items: center;
          animation: fadeUp 0.8s 0.15s cubic-bezier(.22,1,.36,1) both;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: #e8372a; margin-bottom: 22px;
          display: flex; align-items: center; gap: 12px;
          animation: slideRight 0.6s .1s cubic-bezier(.22,1,.36,1) both;
        }
        .hp-hero-eyebrow::after {
          content: ''; display: block; width: 48px; height: 1.5px;
          background: linear-gradient(90deg, #e8372a, transparent);
          opacity: 0.7;
        }

        .hp-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(38px, 6.5vw, 84px);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: -0.03em;
          color: #F8FAFC;
          margin-bottom: 28px;
          animation: slideUp .8s .2s cubic-bezier(.22,1,.36,1) both;
          word-break: break-word;
        }
        .hp-hero h1 .accent { color: #A8D8FF; }

        .hp-hero-sub {
          font-size: 16px; font-weight: 300;
          color: rgba(168, 216, 255, 0.75);
          max-width: 420px; line-height: 1.75; margin-bottom: 40px;
          animation: slideUp .8s .25s cubic-bezier(.22,1,.36,1) both;
        }

        .hp-hero-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
          color: #fff; text-decoration: none;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 15px 32px; border-radius: 10px;
          transition: all .3s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 0 32px rgba(232,55,42,0.32);
          position: relative; overflow: hidden;
          animation: slideUp .8s .3s cubic-bezier(.22,1,.36,1) both;
          max-width: 100%;
          box-sizing: border-box;
        }
        .hp-hero-cta::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
          transform: skewX(-20deg);
          animation: ctaShimmer 3s ease-in-out infinite;
        }
        @keyframes ctaShimmer {
          0%   { left: -100%; }
          40%  { left: 140%; }
          100% { left: 140%; }
        }
        .hp-hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 48px rgba(232,55,42,0.60), 0 8px 32px rgba(232,55,42,0.40);
          background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
        }
        .hp-hero-cta:active { transform: translateY(-1px); }
        .hp-hero-cta-arrow { transition: transform .3s ease; }
        .hp-hero-cta:hover .hp-hero-cta-arrow { transform: translateX(6px); }

        /* ── Stats ── */
        .hp-stats {
          display: flex; align-items: stretch; gap: 0;
          margin-top: 56px;
          border: 1px solid rgba(0,200,224,0.14);
          border-radius: 14px;
          background: rgba(7,16,29,0.60);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0,200,224,0.08);
          animation: slideUp .8s .35s cubic-bezier(.22,1,.36,1) both;
          width: 100%;
          box-sizing: border-box;
        }
        .hp-stat {
          flex: 1; padding: 24px 18px; text-align: center;
          position: relative; min-width: 0;
          transition: all .3s ease;
        }
        .hp-stat:hover {
          background: rgba(0,200,224,0.05);
        }
        .hp-stat + .hp-stat::before {
          content: ''; position: absolute; left: 0; top: 18%; bottom: 18%;
          width: 1px; background: rgba(0,200,224,0.12);
        }
        .hp-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 32px; font-weight: 900;
          color: #F8FAFC; line-height: 1;
          margin-bottom: 8px;
        }
        .hp-stat-suffix { font-size: 18px; color: #A8D8FF; margin-left: 3px; font-weight: 800; }
        .hp-stat-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(168,216,255,0.50);
          line-height: 1.4;
        }

        /* ── Auth panel ── */
        .hp-auth-panel {
          background: rgba(13,27,46,0.85);
          border: 1px solid rgba(0,200,224,0.18);
          border-radius: 18px; padding: 36px 32px 32px;
          backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          position: relative; overflow: hidden;
          box-shadow: 0 0 48px rgba(7,16,29,0.6), inset 0 0 48px rgba(0,200,224,0.03);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          animation: slideUp .8s .2s cubic-bezier(.22,1,.36,1) both;
        }
        .hp-auth-panel::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #e8372a, #00c8e0, transparent);
          border-radius: 18px 18px 0 0;
        }
        .hp-auth-panel::after {
          content: ''; position: absolute; top: -50px; right: -50px;
          width: 150px; height: 150px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,200,224,0.12), transparent 70%);
          pointer-events: none;
          filter: blur(40px);
        }
        .hp-auth-scan {
          position: absolute; top: 0; left: 0; right: 0; height: 100%;
          pointer-events: none; overflow: hidden; border-radius: 18px;
          z-index: 0;
        }
        .hp-auth-scan::after {
          content: '';
          position: absolute; left: 0; right: 0; top: -4px; height: 3px;
          background: linear-gradient(90deg, transparent 0%, rgba(0,200,224,0.20) 40%, rgba(0,200,224,0.40) 50%, rgba(0,200,224,0.20) 60%, transparent 100%);
          animation: scanLine 5s ease-in-out infinite;
          filter: blur(1.5px);
          will-change: top;
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .hp-auth-watermark {
          position: absolute; bottom: -20px; right: -20px;
          font-size: 130px; color: rgba(0,200,224,0.03);
          pointer-events: none; z-index: 0;
          line-height: 1;
        }

        .hp-auth-panel > *:not(.hp-auth-scan):not(.hp-auth-watermark) {
          position: relative; z-index: 1;
        }

        .hp-auth-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px; font-weight: 900;
          color: #F8FAFC; margin-bottom: 6px;
        }
        .hp-auth-subtitle {
          font-size: 13.5px; font-weight: 300;
          color: rgba(168,216,255,0.60);
          margin-bottom: 28px; line-height: 1.6;
        }

        .hp-auth-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%; }
        .hp-auth-label {
          font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(168,216,255,0.50);
        }
        .hp-auth-input {
          background: rgba(6,15,28,0.85);
          border: 1px solid rgba(0,200,224,0.14);
          border-radius: 10px; padding: 12px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #c8e4f4;
          outline: none; caret-color: #00c8e0;
          transition: all .25s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .hp-auth-input::placeholder { color: rgba(160,200,224,0.20); }
        .hp-auth-input:focus {
          border-color: rgba(0,200,224,0.45);
          box-shadow: 0 0 0 3.5px rgba(0,200,224,0.08);
          background: rgba(0,200,224,0.03);
        }

        .hp-auth-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; gap: 10px; flex-wrap: wrap;
          width: 100%; box-sizing: border-box;
        }
        .hp-auth-remember {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; color: rgba(168,216,255,0.50);
          cursor: pointer; user-select: none;
          transition: color .2s;
        }
        .hp-auth-remember:hover { color: rgba(168,216,255,0.70); }
        .hp-auth-remember input[type="checkbox"] {
          accent-color: #e8372a; width: 14px; height: 14px; cursor: pointer;
          border: 1.5px solid rgba(0,200,224,0.25);
        }
        .hp-auth-forgot {
          font-size: 12.5px; font-weight: 700; color: #00c8e0; text-decoration: none;
          transition: all .25s;
        }
        .hp-auth-forgot:hover {
          color: #A8D8FF;
          text-shadow: 0 0 12px rgba(0,200,224,0.35);
        }

        .hp-auth-error {
          font-size: 12px; color: #ff7f6b;
          background: rgba(232,55,42,0.12);
          border: 1px solid rgba(232,55,42,0.28);
          border-radius: 10px; padding: 11px 14px;
          margin-bottom: 16px; line-height: 1.5;
          animation: errShake 0.35s ease;
          width: 100%; box-sizing: border-box;
        }
        @keyframes errShake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }

        .hp-auth-btn {
          width: 100%; padding: 14px 22px; border: none; border-radius: 10px;
          background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
          color: #fff;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
          transition: all .25s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 0 32px rgba(232,55,42,0.28);
          position: relative; overflow: hidden;
          box-sizing: border-box;
        }
        .hp-auth-btn::after {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-20deg);
          transition: left 0.45s ease;
        }
        .hp-auth-btn:hover:not(:disabled)::after { left: 140%; }
        .hp-auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(232,55,42,0.50);
          background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
        }
        .hp-auth-btn:active:not(:disabled) { transform: translateY(0); }
        .hp-auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .hp-auth-or {
          display: flex; align-items: center; gap: 14px; margin: 20px 0;
          width: 100%; box-sizing: border-box;
        }
        .hp-auth-or-line { flex: 1; height: 1px; background: rgba(0,200,224,0.12); }
        .hp-auth-or-text {
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(168,216,255,0.35); white-space: nowrap;
        }

        .hp-auth-create {
          display: block; width: 100%; padding: 14px;
          border: 1.5px solid rgba(168,216,255,0.30);
          border-radius: 10px; background: rgba(168,216,255,0.06);
          color: #A8D8FF;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-align: center; text-decoration: none;
          transition: all .25s cubic-bezier(.22,1,.36,1);
          box-sizing: border-box;
        }
        .hp-auth-create:hover {
          background: rgba(168,216,255,0.12);
          border-color: rgba(168,216,255,0.55);
          transform: translateY(-2px);
          box-shadow: 0 0 28px rgba(168,216,255,0.15);
        }
        .hp-auth-create:active { transform: translateY(0); }

        /* ── Divider ── */
        .hp-divider {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 48px;
          animation: fadeUp 0.8s 0.4s cubic-bezier(.22,1,.36,1) both;
          width: 100%; box-sizing: border-box;
          overflow: hidden;
        }
        .hp-divider-label {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: rgba(168,216,255,0.40); white-space: nowrap;
        }
        .hp-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(168,216,255,0.20), transparent);
          min-width: 0;
        }

        /* ── Cards grid ── */
        .hp-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-card {
          position: relative;
          background: rgba(13,27,46,0.70);
          border: 1.5px solid rgba(0,200,224,0.11);
          border-radius: 14px; padding: 28px 24px;
          text-decoration: none; color: inherit;
          display: flex; flex-direction: column; gap: 12px;
          overflow: hidden;
          transition: all .3s cubic-bezier(.22,1,.36,1);
          animation: fadeUp 0.7s ease both;
          cursor: pointer;
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          box-sizing: border-box;
          min-width: 0;
        }
        .hp-card:nth-child(1) { animation-delay: 0.3s; }
        .hp-card:nth-child(2) { animation-delay: 0.38s; }
        .hp-card:nth-child(3) { animation-delay: 0.46s; }
        .hp-card:nth-child(4) { animation-delay: 0.54s; }

        .hp-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 100% 70% at 10% 0%, var(--accent-alpha), transparent 75%);
          opacity: 0; transition: opacity .35s ease;
          pointer-events: none;
        }
        .hp-card::after {
          content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 1.5px;
          background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
          opacity: 0; transition: opacity .4s ease;
          border-radius: 1px;
          pointer-events: none;
        }
        .hp-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--accent-color);
          background: rgba(13,27,46,0.92);
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 40px var(--accent-alpha);
        }
        .hp-card:hover::before { opacity: 1; }
        .hp-card:hover::after  { opacity: 1; }

        .hp-card-header {
          display: flex; align-items: center; justify-content: space-between;
        }
        .hp-card-icon {
          width: 52px; height: 52px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-color);
          background: var(--accent-alpha); border: 1.5px solid var(--accent-color);
          flex-shrink: 0; position: relative; z-index: 1;
          transition: all .3s ease;
          box-shadow: 0 0 20px var(--accent-alpha);
        }
        .hp-card:hover .hp-card-icon {
          transform: scale(1.12);
          box-shadow: 0 0 28px var(--accent-alpha);
        }
        .hp-card-tag {
          font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 800;
          letter-spacing: 0.14em; color: var(--accent-color);
          border: 1px solid var(--accent-color);
          border-radius: 4px; padding: 3px 8px; opacity: 0.75;
          position: relative; z-index: 1;
          transition: all .2s ease;
        }
        .hp-card:hover .hp-card-tag { opacity: 1; }
        .hp-card-title {
          font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 800;
          color: #F8FAFC; position: relative; z-index: 1;
        }
        .hp-card-desc {
          font-size: 13px; font-weight: 300;
          color: rgba(168,216,255,0.62); line-height: 1.6;
          position: relative; z-index: 1; flex: 1;
        }
        .hp-card-action {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
          color: var(--accent-color); position: relative; z-index: 1; margin-top: 6px;
          transition: gap .25s ease;
        }
        .hp-card:hover .hp-card-action { gap: 12px; }

        /* ── Ticker ── */
        .hp-ticker {
          margin-top: 20px;
          margin-bottom: 0;
          border: 1px solid rgba(168,216,255,0.12);
          border-radius: 12px;
          background: rgba(7,16,29,0.70);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          padding: 13px 0;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 24px rgba(0,200,224,0.06);
          animation: slideUp .8s .45s cubic-bezier(.22,1,.36,1) both;
          width: 100%;
          box-sizing: border-box;
          /* Prevent ticker from expanding page width */
          contain: layout style;
        }
        .hp-ticker-label {
          flex-shrink: 0;
          font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 900;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: #e8372a; padding: 0 18px;
          border-right: 1.5px solid rgba(232,55,42,0.28);
          margin-right: 18px;
          background: rgba(7,16,29,0.65);
          position: relative; z-index: 2;
        }
        .hp-ticker-track {
          display: flex;
          gap: 72px;
          align-items: center;
          animation: tickerScroll 28s linear infinite;
          white-space: nowrap;
          will-change: transform;
          transform: translateZ(0);
          /* The track itself scrolls inside the clipped ticker */
          flex-shrink: 0;
        }
        .hp-ticker:hover .hp-ticker-track { animation-play-state: paused; }
        @keyframes tickerScroll {
          from { transform: translateZ(0) translateX(0); }
          to   { transform: translateZ(0) translateX(-50%); }
        }
        .hp-ticker-item {
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 400;
          letter-spacing: 0.05em; color: rgba(168,216,255,0.58);
          flex-shrink: 0;
        }
        .hp-ticker-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(168,216,255,0.35); flex-shrink: 0;
        }

        /* ── Footer bridge ── */
        .hp-footer-bridge {
          height: 56px;
          background: linear-gradient(to bottom, rgba(4,16,28,0) 0%, rgba(4,16,28,1) 100%);
          pointer-events: none; position: relative; z-index: 1;
        }

        /* ── Keyframes ── */
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
           ════════════════════════════════════════ */

        @media (max-width: 860px) {
          .hp-hero {
            grid-template-columns: 1fr;
            margin-top: 32px; margin-bottom: 56px; gap: 40px;
          }
          .hp-auth-panel { order: -1; }
          .hp-badge-slot { width: 100%; max-width: none; }
          .hp-badge-row { justify-content: flex-start; }
          .hp-nav-badge { justify-content: center; }
        }

        /* ── OnePlus Nord & similar ~412px devices ── */
        @media (max-width: 600px) {
          .hp-inner { padding: 0 14px; }

          .hp-badge-row {
            padding-top: 12px;
            justify-content: stretch;
          }
          .hp-badge-slot {
            width: 100%;
            max-width: 100%;
          }
          .hp-nav-badge {
            padding: 10px 16px;
            width: 100%;
            justify-content: center;
          }
          .hp-badge-text { font-size: 11px; }
          .hp-badge-911 { font-size: 15px; }

          .hp-ticker {
            border-radius: 10px;
            padding: 10px 0;
          }
          .hp-ticker-label {
            padding: 0 12px;
            margin-right: 12px;
            font-size: 9px;
          }
          .hp-ticker-item { font-size: 11.5px; }

          .hp-hero {
            margin-top: 16px;
            margin-bottom: 36px;
            gap: 24px;
          }
          .hp-hero h1 {
            font-size: clamp(34px, 9vw, 52px);
            margin-bottom: 14px;
            line-height: 0.95;
          }
          .hp-hero-sub {
            font-size: 14px;
            margin-bottom: 22px;
            line-height: 1.65;
          }
          .hp-hero-eyebrow {
            font-size: 10px;
            margin-bottom: 14px;
          }
          .hp-hero-cta {
            padding: 13px 22px;
            font-size: 12px;
            width: 100%;
            justify-content: center;
          }

          .hp-auth-panel {
            padding: 22px 16px 20px;
            border-radius: 14px;
          }
          .hp-auth-title { font-size: 20px; }
          .hp-auth-subtitle {
            font-size: 12.5px;
            margin-bottom: 20px;
          }
          .hp-auth-input {
            padding: 11px 13px;
            font-size: 13px;
          }
          .hp-auth-btn {
            padding: 13px;
            font-size: 12px;
          }
          .hp-auth-create {
            padding: 13px;
            font-size: 12px;
          }
          .hp-auth-row { margin-bottom: 18px; }

          .hp-stats {
            margin-top: 28px;
          }
          .hp-stat { padding: 14px 8px; }
          .hp-stat-value { font-size: 24px; }
          .hp-stat-suffix { font-size: 14px; }
          .hp-stat-label {
            font-size: 9px;
            letter-spacing: 0.04em;
          }

          .hp-divider { margin-bottom: 24px; }

          .hp-grid {
            gap: 12px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .hp-card {
            padding: 18px 14px;
            gap: 10px;
            border-radius: 12px;
          }
          .hp-card-icon {
            width: 42px;
            height: 42px;
            border-radius: 10px;
          }
          .hp-card-icon svg { width: 20px !important; height: 20px !important; }
          .hp-card-title { font-size: 15px; }
          .hp-card-desc { font-size: 11.5px; }
          .hp-card-tag { font-size: 8px; padding: 2px 6px; }
          .hp-card-action { font-size: 11px; margin-top: 2px; }
        }

        @media (max-width: 400px) {
          .hp-inner { padding: 0 12px; }
          .hp-grid { grid-template-columns: 1fr; }
          .hp-card { padding: 16px 14px; }
          .hp-card-title { font-size: 15px; }
          .hp-card-desc { font-size: 11px; }
          .hp-stat-value { font-size: 20px; }
          .hp-hero h1 { font-size: clamp(30px, 9vw, 46px); }
          .hp-auth-panel { padding: 20px 14px 18px; }
        }
      `}</style>

      {/* Outer wrapper locks horizontal overflow at the very top level */}
      <div style={{ overflowX: "hidden", width: "100%", maxWidth: "100vw" }}>
        <div className="hp-root">

          {/* ── Background ── */}
          <div className="hp-bg">
            <img src={homepageBg} alt="" className="hp-bg-img" aria-hidden="true" />
            <div className="hp-bg-overlay" />
            <div className="hp-bg-atmosphere" />
            <div className="hp-bg-grain" />
          </div>

          <div className="hp-orb hp-orb-1" />
          <div className="hp-orb hp-orb-2" />
          <div className="hp-orb hp-orb-3" />

          <div className="hp-inner">

            {/* ── Ticker ── */}
            <div className="hp-ticker">
              <div className="hp-ticker-label">LIVE</div>
              <div className="hp-ticker-track">
                {tickerItems.map((item, i) => (
                  <Fragment key={i}>
                    <span className="hp-ticker-item">{item}</span>
                    <span className="hp-ticker-dot" />
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Badge ── */}
            <div className="hp-badge-row">
              <div className="hp-badge-slot">
                <a href="tel:911" className="hp-nav-badge">
                  <span className="hp-badge-icon">
                    <FaPhoneAlt size={11} />
                  </span>
                  <span className="hp-badge-text">Emergency</span>
                  <span className="hp-badge-sep" />
                  <span className="hp-badge-911">911</span>
                </a>
              </div>
            </div>

            {/* ── Hero ── */}
            <section className="hp-hero">
              <div className="hp-hero-copy">
                <div className="hp-hero-eyebrow">Community Safety Platform</div>

                <h1>
                  Emergency<br />
                  <span className="accent">Response</span> at Your Fingertips
                </h1>

                <p className="hp-hero-sub">
                  A centralized safety platform for the City of Gentle People. Fast access
                  to hotlines, facilities, and safety guidelines.
                </p>

                <Link to="/report" className="hp-hero-cta">
                  Report an Incident
                  <span className="hp-hero-cta-arrow">→</span>
                </Link>

                <div className="hp-stats" ref={statsRef}>
                  {STATS.map((s) => (
                    <StatCounter
                      key={s.label}
                      value={s.value}
                      label={s.label}
                      suffix={s.suffix}
                      start={statsVisible}
                    />
                  ))}
                </div>
              </div>

              {/* ── Auth Panel ── */}
              <div className="hp-auth-panel">
                <div className="hp-auth-scan" />
                <div className="hp-auth-watermark">
                  <FaShieldAlt />
                </div>

                <div className="hp-auth-title">Welcome Back</div>
                <div className="hp-auth-subtitle">
                  Login to access the DumaSafeGuide emergency dashboard.
                </div>

                <div className="hp-auth-field">
                  <label className="hp-auth-label">Email Address</label>
                  <input
                    className="hp-auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="hp-auth-field">
                  <label className="hp-auth-label">Password</label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      className="hp-auth-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      autoComplete="current-password"
                      style={{ paddingRight: "42px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{
                        position: "absolute", right: "12px", top: "50%",
                        transform: "translateY(-50%)", background: "none",
                        border: "none", cursor: "pointer", padding: 0,
                        display: "flex", alignItems: "center",
                        color: "rgba(168,216,255,0.40)", transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#A8D8FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(168,216,255,0.40)")}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="hp-auth-row">
                  <label className="hp-auth-remember">
                    <input type="checkbox" /> Remember me
                  </label>
                  <Link to="/forgot-password" className="hp-auth-forgot">
                    Forgot Password?
                  </Link>
                </div>

                {error && <div className="hp-auth-error">⚠ {error}</div>}

                <button
                  className="hp-auth-btn"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Login Account"}
                </button>

                <div className="hp-auth-or">
                  <span className="hp-auth-or-line" />
                  <span className="hp-auth-or-text">No account yet?</span>
                  <span className="hp-auth-or-line" />
                </div>

                <Link to="/signup" className="hp-auth-create">
                  Create Account →
                </Link>
              </div>
            </section>

            {/* ── Quick Access Divider ── */}
            <div className="hp-divider">
              <span className="hp-divider-label">Quick Access</span>
              <span className="hp-divider-line" />
            </div>

            {/* ── Cards Grid ── */}
            <div className="hp-grid">
              {cards.map((card) => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="hp-card"
                  style={{
                    "--accent-color": card.accent,
                    "--accent-alpha": `${card.accent}20`,
                  } as React.CSSProperties}
                >
                  <div className="hp-card-header">
                    <div className="hp-card-icon">{card.icon}</div>
                    <span className="hp-card-tag">{card.tag}</span>
                  </div>
                  <div className="hp-card-title">{card.label}</div>
                  <div className="hp-card-desc">{card.desc}</div>
                  <div className="hp-card-action">Explore <span>→</span></div>
                </Link>
              ))}
            </div>

          </div>

          <div className="hp-footer-bridge" />

        </div>
      </div>
    </>
  );
}