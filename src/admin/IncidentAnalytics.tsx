import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";

const IA_STYLE = `
:root {
  --primary:  #0066FF;
  --success:  #00B074;
  --warning:  #FF9500;
  --danger:   #FF3B30;
  --bg:       #0d1117;
  --surface:  rgba(15,21,33,0.82);
  --border:   rgba(255,255,255,0.07);
  --text:     #eef0f7;
  --text-secondary: rgba(238,240,247,0.55);
  --text-tertiary:  rgba(238,240,247,0.28);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes ia-fadeIn  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: none; } }
@keyframes ia-slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes ia-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

.ia-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  min-height: 100vh;
}

/* ── Header ── */
.ia-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
  animation: ia-fadeIn 0.4s ease both;
}

.ia-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--primary); margin-bottom: 6px;
  display: flex; align-items: center; gap: 8px;
}

.ia-eyebrow::before {
  content: ''; display: block; width: 20px; height: 2px;
  background: var(--primary);
}

.ia-title {
  font-size: 32px; font-weight: 700; letter-spacing: -0.5px;
  color: var(--text); line-height: 1.1; margin: 0 0 4px;
}

.ia-subtitle {
  font-size: 12px; color: var(--text-tertiary); margin: 0;
}

/* ── Stat grid ── */
.ia-stats {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px; margin-bottom: 24px;
}

.ia-stat {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; position: relative; overflow: hidden;
  transition: all 0.3s; cursor: default; animation: ia-fadeIn 0.5s ease-out both;
}

.ia-stat:nth-child(2) { animation-delay: 0.05s; }
.ia-stat:nth-child(3) { animation-delay: 0.10s; }
.ia-stat:nth-child(4) { animation-delay: 0.15s; }

.ia-stat:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 16px rgba(0,102,255,0.10);
}

.ia-stat::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--is-color);
}

.ia-stat-num {
  font-size: 32px; line-height: 1; margin-bottom: 6px;
  letter-spacing: -0.5px; font-weight: 700; color: var(--is-color);
}

.ia-stat-label {
  font-size: 11px; color: var(--text-secondary);
  letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500;
}

.ia-stat-pct {
  font-size: 10.5px; color: var(--text-tertiary); margin-top: 6px;
}

/* ── Grid layout ── */
.ia-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}

@media (max-width: 1024px) { .ia-grid { grid-template-columns: 1fr; } }

.ia-panel {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; position: relative; overflow: hidden;
  animation: ia-slideIn 0.5s ease-out both;
}

.ia-panel:nth-child(2) { animation-delay: 0.1s; }
.ia-panel:nth-child(3) { animation-delay: 0.15s; }
.ia-panel:nth-child(4) { animation-delay: 0.2s; }

.ia-panel-full { grid-column: 1 / -1; }

.ia-panel-title {
  font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--text-secondary);
  margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border);
}

/* ── Horizontal bar chart ── */
.ia-hbar-row {
  display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
}

.ia-hbar-row:last-child { margin-bottom: 0; }

.ia-hbar-label {
  font-size: 12px; color: var(--text-secondary); width: 80px;
  flex-shrink: 0; font-weight: 500;
}

.ia-hbar-track {
  flex: 1; height: 6px; border-radius: 3px;
  background: var(--border); overflow: hidden;
}

.ia-hbar-fill {
  height: 100%; border-radius: 3px; background: var(--hb-color);
  transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
}

.ia-hbar-val {
  font-size: 12px; font-weight: 600; color: var(--hb-color);
  width: 24px; text-align: right; flex-shrink: 0;
}

/* ── Vertical bar chart ── */
.ia-vbar-wrap {
  display: flex; align-items: flex-end; gap: 8px;
  height: 160px; padding-bottom: 20px; position: relative;
}

.ia-vbar-col {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 6px; height: 100%; justify-content: flex-end;
}

.ia-vbar-bar {
  width: 100%; border-radius: 6px 6px 0 0; background: var(--vb-color);
  min-height: 3px; transition: height 0.5s cubic-bezier(0.4,0,0.2,1);
  position: relative;
}

.ia-vbar-bar:hover::after {
  content: attr(data-val);
  position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
  background: rgba(15,21,33,0.95); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px; padding: 4px 8px;
  font-size: 11px; font-weight: 600; color: #fff;
  white-space: nowrap; pointer-events: none; margin-bottom: 6px;
}

.ia-vbar-xlabel {
  font-size: 11px; color: var(--text-secondary); text-align: center;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 100%; font-weight: 500;
}

/* ── Donut chart ── */
.ia-donut-wrap {
  display: flex; align-items: center; gap: 28px;
}

.ia-donut-ring {
  width: 120px; height: 120px; flex-shrink: 0;
}

.ia-donut-legend {
  display: flex; flex-direction: column; gap: 12px; flex: 1;
}

.ia-donut-legend-item {
  display: flex; align-items: center; gap: 10px;
}

.ia-donut-legend-dot {
  width: 8px; height: 8px; border-radius: 3px; flex-shrink: 0;
}

.ia-donut-legend-label {
  font-size: 12px; color: var(--text-secondary); flex: 1; font-weight: 500;
}

.ia-donut-legend-val {
  font-size: 13px; font-weight: 600; color: var(--text);
}

/* ── Resolution rate ── */
.ia-res-rate-wrap {
  display: flex; align-items: center; gap: 24px;
}

.ia-res-rate-num {
  font-size: 48px; font-weight: 700; line-height: 1;
  color: var(--success);
}

.ia-res-rate-label {
  font-size: 12px; color: var(--text-secondary); line-height: 1.6;
}

.ia-res-bar-track {
  margin-top: 16px; height: 8px; border-radius: 4px;
  background: var(--border); overflow: hidden;
}

.ia-res-bar-fill {
  height: 100%; border-radius: 4px; background: var(--success);
  transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
}

/* ── Empty state ── */
.ia-empty {
  font-size: 12px; letter-spacing: 0.3px;
  color: var(--text-secondary); text-transform: uppercase; margin: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .ia-title { font-size: 26px; }
  .ia-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .ia-stat-num { font-size: 24px; }
  .ia-donut-wrap { flex-direction: column; gap: 16px; }
  .ia-vbar-wrap { height: 120px; }
}

@media (max-width: 420px) {
  .ia-stats { grid-template-columns: 1fr; }
}
`;

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const TYPE_COLORS: Record<string, string> = {
  fire:       "#FF3B30",
  flood:      "#0066FF",
  crime:      "#FF2D55",
  medical:    "#00B074",
  accident:   "#FF9500",
  other:      "#9CA3AF",
};

export default function IncidentAnalytics() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: true });
      setIncidents(data || []);
    };
    fetchAll();
  }, []);

  const total = incidents.length;
  const pending  = incidents.filter((i) => i.status === "pending").length;
  const inProg   = incidents.filter((i) => i.status === "in-progress").length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;
  const resRate  = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Monthly counts (last 6 months)
  const now = new Date();
  const monthly = Array.from({ length: 6 }, (_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    const count = incidents.filter((i) => {
      const id = new Date(i.created_at);
      return id.getFullYear() === d.getFullYear() && id.getMonth() === d.getMonth();
    }).length;
    return { label: MONTH_LABELS[d.getMonth()], count };
  });
  const maxMonthly = Math.max(...monthly.map((m) => m.count), 1);

  // Type breakdown
  const typeCounts: Record<string, number> = {};
  incidents.forEach((i) => {
    const t = (i.type || "other").toLowerCase();
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const maxType = Math.max(...typeEntries.map((e) => e[1]), 1);

  // Donut SVG data
  const statusSlices = [
    { label: "Resolved",    count: resolved, color: "#00B074" },
    { label: "In Progress", count: inProg,   color: "#FF9500" },
    { label: "Pending",     count: pending,  color: "#FF3B30" },
  ];
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let donutOffset = 0;

  return (
    <>
      <style>{IA_STYLE}</style>
      <div className="ia-root">

        {/* Header */}
        <div className="ia-header">
          <div>
            <div className="ia-eyebrow">Management</div>
            <h1 className="ia-title">Analytics</h1>
            <p className="ia-subtitle">Incident data & statistical insights</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="ia-stats">
          {[
            { label: "Total Reports", value: total,    color: "#0066FF" },
            { label: "Pending",       value: pending,  color: "#FF3B30" },
            { label: "In Progress",   value: inProg,   color: "#FF9500" },
            { label: "Resolved",      value: resolved, color: "#00B074" },
          ].map((s) => (
            <div className="ia-stat" key={s.label} style={{ "--is-color": s.color } as React.CSSProperties}>
              <div className="ia-stat-num">{s.value}</div>
              <div className="ia-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="ia-grid">

          {/* Monthly trend */}
          <div className="ia-panel ia-panel-full">
            <div className="ia-panel-title">Monthly Incident Trend (Last 6 Months)</div>
            <div className="ia-vbar-wrap">
              {monthly.map((m) => (
                <div className="ia-vbar-col" key={m.label}>
                  <div
                    className="ia-vbar-bar"
                    data-val={m.count}
                    style={{
                      height: `${Math.round((m.count / maxMonthly) * 100)}%`,
                      "--vb-color": "#0066FF",
                    } as React.CSSProperties}
                  />
                  <span className="ia-vbar-xlabel">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type breakdown */}
          <div className="ia-panel">
            <div className="ia-panel-title">Incidents by Type</div>
            {typeEntries.length === 0 ? (
              <p className="ia-empty">No data yet.</p>
            ) : (
              typeEntries.map(([type, count]) => (
                <div className="ia-hbar-row" key={type}>
                  <span className="ia-hbar-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  <div className="ia-hbar-track">
                    <div
                      className="ia-hbar-fill"
                      style={{
                        width: `${Math.round((count / maxType) * 100)}%`,
                        "--hb-color": TYPE_COLORS[type] ?? "#9CA3AF",
                      } as React.CSSProperties}
                    />
                  </div>
                  <span
                    className="ia-hbar-val"
                    style={{ "--hb-color": TYPE_COLORS[type] ?? "#9CA3AF" } as React.CSSProperties}
                  >
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Status distribution */}
          <div className="ia-panel">
            <div className="ia-panel-title">Status Distribution</div>
            <div className="ia-donut-wrap">
              {/* SVG donut */}
              <svg className="ia-donut-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={donutRadius} fill="none"
                  stroke="var(--border)" strokeWidth="14" />
                {total === 0 ? null : statusSlices.map((s) => {
                  const dash = (s.count / total) * donutCircumference;
                  const gap  = donutCircumference - dash;
                  const el = (
                    <circle key={s.label}
                      cx="60" cy="60" r={donutRadius} fill="none"
                      stroke={s.color} strokeWidth="14"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-donutOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{ opacity: 0.9 }}
                    />
                  );
                  donutOffset += dash;
                  return el;
                })}
                <text x="60" y="56" textAnchor="middle"
                  fill="#eef0f7" fontSize="20" fontWeight="700"
                  fontFamily="inherit">{total}</text>
                <text x="60" y="71" textAnchor="middle"
                  fill="rgba(238,240,247,0.28)" fontSize="10"
                  fontFamily="inherit">TOTAL</text>
              </svg>

              <div className="ia-donut-legend">
                {statusSlices.map((s) => (
                  <div className="ia-donut-legend-item" key={s.label}>
                    <div className="ia-donut-legend-dot" style={{ background: s.color }} />
                    <span className="ia-donut-legend-label">{s.label}</span>
                    <span className="ia-donut-legend-val">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resolution rate */}
          <div className="ia-panel ia-panel-full">
            <div className="ia-panel-title">Resolution Rate</div>
            <div className="ia-res-rate-wrap">
              <div className="ia-res-rate-num">{resRate}%</div>
              <div className="ia-res-rate-label">
                of all reported incidents<br />have been resolved
              </div>
            </div>
            <div className="ia-res-bar-track">
              <div className="ia-res-bar-fill" style={{ width: `${resRate}%` }} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}