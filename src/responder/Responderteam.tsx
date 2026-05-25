import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  full_name: string | null;   // FIX: was string — can be null from DB
  email: string | null;       // FIX: was string — can be null from DB
  role: string | null;        // FIX: was string — can be null from DB
  status?: string;
  unit?: string;
  avatar_url?: string | null;
  phone?: string | null;
  joined_at?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  on_duty:    { label: "ON DUTY",    color: "#00DC82", dot: "#00DC82" },
  responding: { label: "RESPONDING", color: "#FFAA00", dot: "#FFAA00" },
  off_duty:   { label: "OFF DUTY",   color: "rgba(226,238,248,0.28)", dot: "rgba(226,238,248,0.28)" },
};

const UNIT_COLORS: Record<string, string> = {
  Alpha:   "#4D9EFF",
  Bravo:   "#00DC82",
  Charlie: "#FFAA00",
  Delta:   "#FF4D4D",
  HQ:      "#C084FC",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = {
  Users: ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Shield: ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Radio: ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
      <circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
    </svg>
  ),
  Activity: ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Phone: ({ s = 12 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: ({ s = 12 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Search: ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Filter: ({ s = 13 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Clock: ({ s = 9 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ChevDown: ({ s = 11 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
/* ── Variables (scoped so they don't clash with dashboard :root) ── */
.rt-wrap {
  --rt-ink:   #06101C;
  --rt-edge:  rgba(255,255,255,0.07);
  --rt-text:  #D8EAF8;
  --rt-muted: rgba(216,234,248,0.45);
  --rt-dim:   rgba(216,234,248,0.22);
  --rt-cyan:  #00C8E0;
  --rt-blue:  #4D9EFF;
  --rt-green: #00DC82;
  --rt-amber: #FFAA00;
  --rt-red:   #FF4D4D;
  --rt-head:  'Bebas Neue','Arial Narrow',Arial,sans-serif;
  --rt-mono:  'IBM Plex Mono','Fira Mono',monospace;
  --rt-body:  'DM Sans',system-ui,sans-serif;
}

@keyframes rt-spin    { to{transform:rotate(360deg)} }
@keyframes rt-fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes rt-pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
@keyframes rt-shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
@keyframes rt-slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes rt-expand  { from{opacity:0;max-height:0} to{opacity:1;max-height:200px} }

.rt-wrap *,.rt-wrap *::before,.rt-wrap *::after{box-sizing:border-box;margin:0;padding:0}
.rt-wrap{font-family:var(--rt-body);color:var(--rt-text);min-height:100%}

/* ── Header ── */
.rt-hd{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;margin-bottom:20px}
.rt-eyebrow{font-family:var(--rt-mono);font-size:10px;color:rgba(0,200,224,.6);letter-spacing:.28em;text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.rt-eyebrow::before{content:'';display:block;width:20px;height:1px;background:var(--rt-cyan);opacity:.5}
.rt-title{font-family:var(--rt-head);font-size:42px;font-weight:400;color:#fff;letter-spacing:.04em;line-height:1}
.rt-subtitle{font-family:var(--rt-mono);font-size:9px;color:var(--rt-dim);letter-spacing:.18em;text-transform:uppercase;margin-top:4px}

/* ── Live badge ── */
.rt-live{display:inline-flex;align-items:center;gap:6px;font-family:var(--rt-mono);font-size:8.5px;padding:5px 11px;border-radius:20px;border:1px solid rgba(0,220,130,.22);background:rgba(0,220,130,.05);color:var(--rt-green);letter-spacing:.1em;white-space:nowrap}
.rt-live-dot{width:5px;height:5px;border-radius:50%;background:var(--rt-green);animation:rt-pulse 1.4s ease infinite}

/* ── Stats ── */
.rt-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:20px}
.rt-stat{background:rgba(6,17,32,.92);border:1px solid var(--rt-edge);border-radius:12px;padding:16px;position:relative;overflow:hidden}
.rt-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.rt-stat-icon{margin-bottom:10px;opacity:.85;display:flex;align-items:center}
.rt-stat-num{font-family:var(--rt-head);font-size:34px;line-height:1;margin-bottom:5px;min-height:34px}
.rt-stat-lbl{font-family:var(--rt-mono);font-size:8.5px;color:var(--rt-dim);letter-spacing:.12em;text-transform:uppercase}

.rt-stat.sc-total  ::before{background:var(--rt-text)}
.rt-stat.sc-total  .rt-stat-icon,.rt-stat.sc-total  .rt-stat-num{color:var(--rt-text)}
.rt-stat.sc-active ::before{background:var(--rt-green)}
.rt-stat.sc-active .rt-stat-icon,.rt-stat.sc-active .rt-stat-num{color:var(--rt-green)}
.rt-stat.sc-resp   ::before{background:var(--rt-amber)}
.rt-stat.sc-resp   .rt-stat-icon,.rt-stat.sc-resp   .rt-stat-num{color:var(--rt-amber)}
.rt-stat.sc-off    ::before{background:var(--rt-dim)}
.rt-stat.sc-off    .rt-stat-icon,.rt-stat.sc-off    .rt-stat-num{color:var(--rt-muted)}

/* ── Skeleton ── */
.rt-skel{
  background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);
  background-size:200% 100%;
  animation:rt-shimmer 1.4s ease infinite;
  border-radius:6px;
}
.rt-skel-num{height:34px;width:40px;border-radius:4px;margin-bottom:5px}

/* ── Toolbar ── */
.rt-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.rt-search-wrap{position:relative;flex:1;min-width:180px}
.rt-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--rt-dim);pointer-events:none;display:flex}
.rt-search{background:rgba(6,17,32,.92);border:1px solid var(--rt-edge);border-radius:9px;padding:10px 12px 10px 36px;font-family:var(--rt-body);font-size:13px;color:var(--rt-text);outline:none;transition:border-color .2s;width:100%}
.rt-search::placeholder{color:var(--rt-dim)}
.rt-search:focus{border-color:rgba(0,200,224,.3)}

.rt-filter-grp{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.rt-filter-ico{color:var(--rt-dim);display:flex;align-items:center}
.rt-filter-btn{display:inline-flex;align-items:center;gap:5px;padding:8px 13px;background:rgba(255,255,255,.03);border:1px solid var(--rt-edge);border-radius:8px;font-family:var(--rt-mono);font-size:9px;font-weight:600;letter-spacing:.08em;color:var(--rt-muted);cursor:pointer;transition:all .15s;white-space:nowrap}
.rt-filter-btn:hover{border-color:rgba(255,255,255,.15);color:var(--rt-text)}
.rt-filter-btn.rt-active{background:rgba(0,200,224,.08);border-color:rgba(0,200,224,.3);color:var(--rt-cyan)}
.rt-filter-btn.f-on  {border-color:rgba(0,220,130,.3);color:var(--rt-green);background:rgba(0,220,130,.07)}
.rt-filter-btn.f-resp{border-color:rgba(255,170,0,.3); color:var(--rt-amber);background:rgba(255,170,0,.07)}
.rt-filter-btn.f-off {border-color:rgba(216,234,248,.15);color:var(--rt-muted);background:rgba(216,234,248,.04)}

/* ── Grid ── */
.rt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
@media(max-width:600px){.rt-grid{grid-template-columns:1fr}}

/* ── Member card ── */
.rt-card{
  background:rgba(6,17,32,.92);
  border:1px solid var(--rt-edge);
  border-radius:14px;padding:18px;
  display:flex;flex-direction:column;gap:14px;
  transition:border-color .22s,box-shadow .22s,transform .22s;
  animation:rt-slideUp .3s ease both;
  position:relative;overflow:hidden;
}
.rt-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:var(--card-accent,var(--rt-cyan));opacity:.75;
}
.rt-card:hover{
  border-color:rgba(0,200,224,.22);
  box-shadow:0 8px 40px rgba(0,0,0,.45),0 0 0 1px rgba(0,200,224,.07);
  transform:translateY(-2px);
}

/* ── Card top row ── */
.rt-card-top{display:flex;align-items:flex-start;gap:12px}
.rt-avatar{
  width:46px;height:46px;border-radius:12px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--rt-head);font-size:20px;color:#fff;
  background:var(--av-bg,rgba(0,200,224,.15));
  border:1px solid var(--av-border,rgba(0,200,224,.25));
  position:relative;
  text-transform:uppercase;
}
.rt-avatar-img{width:100%;height:100%;object-fit:cover;border-radius:11px}
.rt-dot{
  position:absolute;bottom:-3px;right:-3px;
  width:11px;height:11px;border-radius:50%;
  background:var(--dot-c,var(--rt-dim));
  border:2.5px solid #06101C;
}
.rt-dot.is-resp{animation:rt-pulse 1.1s ease-in-out infinite}

.rt-card-info{flex:1;min-width:0}
.rt-card-name{font-size:15px;font-weight:700;color:#fff;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rt-card-role{font-family:var(--rt-mono);font-size:8.5px;color:var(--rt-dim);letter-spacing:.1em;text-transform:uppercase;margin-top:3px}
.rt-unit-tag{
  display:inline-flex;align-items:center;gap:4px;
  font-family:var(--rt-mono);font-size:8px;font-weight:700;
  padding:2px 8px;border-radius:4px;letter-spacing:.07em;margin-top:6px;
  background:var(--unit-bg);border:1px solid var(--unit-bd);color:var(--unit-c);
}
.rt-status-pill{
  flex-shrink:0;
  display:inline-flex;align-items:center;gap:5px;
  font-family:var(--rt-mono);font-size:8px;font-weight:700;
  padding:4px 10px;border-radius:20px;letter-spacing:.07em;
  border:1px solid currentColor;opacity:.9;
}

/* ── Contact rows ── */
.rt-contacts{display:flex;flex-direction:column;gap:6px;border-top:1px solid var(--rt-edge);padding-top:12px}
.rt-contact-row{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--rt-muted)}
.rt-contact-row a{color:inherit;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;transition:color .15s}
.rt-contact-row a:hover{color:#fff}

/* ── Expandable detail ── */
.rt-expand-btn{
  width:100%;display:flex;align-items:center;justify-content:center;gap:5px;
  padding:6px;background:rgba(255,255,255,.02);
  border:1px solid var(--rt-edge);border-radius:8px;
  font-family:var(--rt-mono);font-size:9px;font-weight:600;
  color:var(--rt-dim);letter-spacing:.08em;cursor:pointer;
  transition:all .15s;
}
.rt-expand-btn:hover{background:rgba(0,200,224,.06);border-color:rgba(0,200,224,.2);color:var(--rt-cyan)}
.rt-expand-btn svg{transition:transform .2s}
.rt-expand-btn.open svg{transform:rotate(180deg)}

.rt-detail{
  display:flex;flex-direction:column;gap:8px;
  overflow:hidden;
  animation:rt-expand .2s ease both;
}
.rt-detail-row{display:flex;justify-content:space-between;align-items:center;gap:8px}
.rt-detail-key{font-family:var(--rt-mono);font-size:8.5px;color:var(--rt-dim);letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
.rt-detail-val{font-size:12px;color:var(--rt-muted);text-align:right}

/* ── Footer ── */
.rt-card-foot{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;border-top:1px solid var(--rt-edge);padding-top:10px}
.rt-meta{display:inline-flex;align-items:center;gap:4px;font-family:var(--rt-mono);font-size:8.5px;color:var(--rt-dim)}

/* ── Empty / Error ── */
.rt-empty{
  grid-column:1/-1;text-align:center;padding:60px 20px;
  font-family:var(--rt-mono);font-size:10.5px;color:var(--rt-dim);letter-spacing:.12em;
  display:flex;flex-direction:column;align-items:center;gap:12px;
}
.rt-empty-icon{font-size:32px;opacity:.3}

/* ── Skeleton cards ── */
.rt-skel-card{
  background:rgba(6,17,32,.92);border:1px solid var(--rt-edge);
  border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:14px;
}
.rt-skel-av{width:46px;height:46px;border-radius:12px}
.rt-skel-name{height:16px;width:58%}
.rt-skel-role{height:10px;width:32%;margin-top:5px}
.rt-skel-line{height:11px;width:80%}
.rt-skel-line-sm{height:11px;width:52%}

/* ── Spinner ── */
.rt-spinner{display:inline-block;width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.1);border-top-color:var(--rt-cyan);animation:rt-spin .7s linear infinite}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

// FIX: accepts null/undefined, returns "?" fallback instead of crashing
function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function cls(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}

function fmtDate(ts?: string) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function fmtRelative(ts?: string) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return fmtDate(ts);
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rt-skel-card">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div className="rt-skel rt-skel-av" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="rt-skel rt-skel-name" />
              <div className="rt-skel rt-skel-role" />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="rt-skel rt-skel-line" />
            <div className="rt-skel rt-skel-line-sm" />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Member Card ─────────────────────────────────────────────────────────────

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const status     = member.status ?? "off_duty";
  const statusMeta = STATUS_META[status] ?? STATUS_META.off_duty;
  const unit       = member.unit ?? "HQ";
  const unitColor  = UNIT_COLORS[unit] ?? "#4D9EFF";

  const avBg  = `${unitColor}22`;
  const avBd  = `${unitColor}40`;

  // FIX: safe display values for nullable fields
  const displayName = member.full_name ?? "Unknown Member";
  const displayRole = member.role ?? "—";

  return (
    <div
      className="rt-card"
      style={{
        animationDelay: `${index * 0.045}s`,
        ["--card-accent" as any]: unitColor,
        ["--av-bg"       as any]: avBg,
        ["--av-border"   as any]: avBd,
      }}
    >
      {/* ── Top row ── */}
      <div className="rt-card-top">
        {/* Avatar */}
        <div className="rt-avatar">
          {member.avatar_url
            // FIX: use safe displayName for alt text
            ? <img src={member.avatar_url} alt={displayName} className="rt-avatar-img" />
            // FIX: initials() now handles null safely
            : initials(member.full_name)
          }
          <span
            className={cls("rt-dot", status === "responding" && "is-resp")}
            style={{ ["--dot-c" as any]: statusMeta.dot }}
          />
        </div>

        {/* Info */}
        <div className="rt-card-info">
          {/* FIX: use displayName so null never renders as blank */}
          <div className="rt-card-name">{displayName}</div>
          <div className="rt-card-role">{displayRole}</div>
          <div
            className="rt-unit-tag"
            style={{
              ["--unit-bg" as any]: avBg,
              ["--unit-bd" as any]: avBd,
              ["--unit-c"  as any]: unitColor,
            }}
          >
            <Ico.Shield s={8} />
            {unit} Unit
          </div>
        </div>

        {/* Status pill */}
        <span
          className="rt-status-pill"
          style={{ color: statusMeta.color, borderColor: `${statusMeta.color}50` }}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* ── Contact rows ── */}
      {(member.email || member.phone) && (
        <div className="rt-contacts">
          {member.email && (
            <div className="rt-contact-row">
              <Ico.Mail s={11} />
              <a href={`mailto:${member.email}`}>{member.email}</a>
            </div>
          )}
          {member.phone && (
            <div className="rt-contact-row">
              <Ico.Phone s={11} />
              <a href={`tel:${member.phone}`}>{member.phone}</a>
            </div>
          )}
        </div>
      )}

      {/* ── Expand / collapse detail ── */}
      <button
        className={cls("rt-expand-btn", expanded && "open")}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "HIDE DETAILS" : "VIEW DETAILS"}
        <Ico.ChevDown s={11} />
      </button>

      {expanded && (
        <div className="rt-detail">
          <div className="rt-detail-row">
            <span className="rt-detail-key">Role</span>
            <span className="rt-detail-val" style={{ textTransform: "capitalize" }}>{displayRole}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-key">Unit</span>
            <span className="rt-detail-val" style={{ color: unitColor }}>{unit}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-key">Status</span>
            <span className="rt-detail-val" style={{ color: statusMeta.color }}>{statusMeta.label}</span>
          </div>
          <div className="rt-detail-row">
            <span className="rt-detail-key">Last Seen</span>
            <span className="rt-detail-val">{fmtRelative(member.joined_at)}</span>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="rt-card-foot">
        <span className="rt-meta">
          <Ico.Clock s={9} />
          Joined {fmtDate(member.joined_at)}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResponderTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all" | "on_duty" | "responding" | "off_duty">("all");

  const loadTeam = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, unit, avatar_url, phone, joined_at")
        .in("role", ["responder", "admin"])
        .order("full_name", { ascending: true });

      if (err) throw err;
      setMembers(data ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
    const ch = supabase
      .channel("rt-team-presence")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadTeam)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── Counts ─────────────────────────────────────────────────────────────────
  const counts = {
    total:      members.length,
    on_duty:    members.filter((m) => m.status === "on_duty").length,
    responding: members.filter((m) => m.status === "responding").length,
    off_duty:   members.filter((m) => !m.status || m.status === "off_duty").length,
  };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const visible = members.filter((m) => {
    const q = search.toLowerCase();
    // FIX: all nullable string fields are coerced to "" before .toLowerCase()/.includes()
    const matchSearch =
      !q ||
      (m.full_name ?? "").toLowerCase().includes(q) ||
      (m.email     ?? "").toLowerCase().includes(q) ||
      (m.unit      ?? "").toLowerCase().includes(q) ||
      (m.role      ?? "").toLowerCase().includes(q);

    const matchFilter =
      filter === "all" ||
      (filter === "off_duty"
        ? !m.status || m.status === "off_duty"
        : m.status === filter);

    return matchSearch && matchFilter;
  });

  const statCards = [
    { label: "Total Members", value: counts.total,      cls: "sc-total",  icon: <Ico.Users s={16} />    },
    { label: "On Duty",       value: counts.on_duty,    cls: "sc-active", icon: <Ico.Shield s={16} />   },
    { label: "Responding",    value: counts.responding, cls: "sc-resp",   icon: <Ico.Radio s={16} />    },
    { label: "Off Duty",      value: counts.off_duty,   cls: "sc-off",    icon: <Ico.Activity s={16} /> },
  ];

  const filterOpts = [
    { key: "all"        as const, label: "ALL",        extra: ""      },
    { key: "on_duty"    as const, label: "ON DUTY",    extra: "f-on"  },
    { key: "responding" as const, label: "RESPONDING", extra: "f-resp"},
    { key: "off_duty"   as const, label: "OFF DUTY",   extra: "f-off" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="rt-wrap">

        {/* ── Header ── */}
        <div className="rt-hd">
          <div>
            <div className="rt-eyebrow">Field Operations</div>
            <div className="rt-title">TEAM</div>
            <div className="rt-subtitle">Responder roster &amp; live status</div>
          </div>
          <div className="rt-live">
            <span className="rt-live-dot" />
            LIVE ROSTER
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="rt-stats">
          {statCards.map((s) => (
            <div key={s.label} className={cls("rt-stat", s.cls)}>
              <div className="rt-stat-icon">{s.icon}</div>
              <div className="rt-stat-num">
                {loading ? <div className="rt-skel rt-skel-num" /> : s.value}
              </div>
              <div className="rt-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="rt-toolbar">
          <div className="rt-search-wrap">
            <span className="rt-search-icon"><Ico.Search s={14} /></span>
            <input
              className="rt-search"
              placeholder="Search name, email, unit or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="rt-filter-grp">
            <span className="rt-filter-ico"><Ico.Filter s={12} /></span>
            {filterOpts.map((f) => (
              <button
                key={f.key}
                className={cls("rt-filter-btn", f.extra, filter === f.key && "rt-active")}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="rt-grid">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <div className="rt-empty">
              <div className="rt-empty-icon">⚠</div>
              <div>{error}</div>
              <button
                onClick={loadTeam}
                style={{
                  marginTop: 8, padding: "8px 20px",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8, color: "rgba(216,234,248,.5)",
                  fontSize: 11, cursor: "pointer", fontFamily: "var(--rt-mono)",
                  letterSpacing: ".08em",
                }}
              >
                RETRY
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="rt-empty">
              <div className="rt-empty-icon">
                <Ico.Users s={32} />
              </div>
              <div>
                {search
                  ? `NO RESULTS FOR "${search.toUpperCase()}"`
                  : "NO TEAM MEMBERS FOUND"}
              </div>
            </div>
          ) : (
            visible.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i} />
            ))
          )}
        </div>

      </div>
    </>
  );
}