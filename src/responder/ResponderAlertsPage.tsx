import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";

interface ResponderAlert {
  id: string;
  title: string | null;
  message: string | null;
  type: string | null;
  severity: string | null;
  audience: string | null;
  created_at: string;
  description?: string | null;
  location?: string | null;
  address?: string | null;
  report_id?: string | null;
  report_link?: string | null;
  // allow any extra columns from real Supabase row (see console.log)
  [key: string]: any;
}

const RESP_ALERT_META: Record<string, { color: string; bg: string; border: string; label: string }> = {
  danger:   { color: "#EF5B5B", bg: "rgba(239,91,91,0.08)",  border: "rgba(239,91,91,0.2)",  label: "Danger" },
  critical: { color: "#EF5B5B", bg: "rgba(239,91,91,0.08)",  border: "rgba(239,91,91,0.2)",  label: "Critical" },
  warning:  { color: "#F5C842", bg: "rgba(245,200,66,0.08)", border: "rgba(245,200,66,0.2)", label: "Warning" },
  info:     { color: "#5B8DEF", bg: "rgba(91,141,239,0.08)", border: "rgba(91,141,239,0.2)", label: "Info" },
  success:  { color: "#2ECC8F", bg: "rgba(46,204,143,0.08)", border: "rgba(46,204,143,0.2)", label: "Info" },
};

function normalizeAlertType(a: ResponderAlert): string {
  const raw = (a.type ?? a.severity ?? "info").toLowerCase();
  if (raw === "critical") return "critical";
  if (raw === "danger") return "danger";
  if (raw === "warning") return "warning";
  if (raw === "success") return "info";
  return "info";
}

export default function ResponderAlertsPage() {
  const [alerts, setAlerts] = useState<ResponderAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error: err } = await supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (err) throw err;
        if (cancelled) return;
        const rows = (data as ResponderAlert[]) ?? [];
        // Dev helper: log raw row once so fields can be inspected (task #4)
        if (import.meta.env.DEV && rows.length > 0) {
          console.log("[ResponderAlerts] raw alert row:", rows[0]);
        }
        setAlerts(rows);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load alerts:", err);
        if (!cancelled) {
          setError("Error loading alerts");
          setLoading(false);
        }
      }
    };

    void load();

    const channelId = `resp-alerts-${Math.random().toString(36).slice(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        const newAlert = payload.new as ResponderAlert;
        setAlerts(prev => {
          if (prev.some(a => a.id === newAlert.id)) return prev;
          return [newAlert, ...prev];
        });
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "alerts" }, (payload) => {
        setAlerts(prev => prev.filter(a => a.id !== (payload.old as any).id));
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div style={{ padding: 20, color: "rgba(238,240,247,0.4)" }}>Loading alerts…</div>;
  if (error) return <div style={{ padding: 20, color: "rgba(238,240,247,0.4)" }}>Error: {error}</div>;
  if (alerts.length === 0) return <div style={{ padding: 20, color: "rgba(238,240,247,0.4)" }}>No alerts.</div>;

  return (
    <div style={{ padding: 16, color: "#eef0f7" }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>Alerts</h3>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: "rgba(238,240,247,0.5)" }}>Broadcasts from command — title, message, severity &amp; audience</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "65vh", overflowY: "auto", paddingRight: 4 }}>
        {alerts.map((alert) => {
          const t = normalizeAlertType(alert);
          const meta = RESP_ALERT_META[t] ?? RESP_ALERT_META.info;
          const aud = (alert.audience ?? "all").toLowerCase();
          // Correct fields per real Supabase columns (see supabase/migrations/20260912130000_ensure_alerts_table.sql)
          // title -> type fallback, message -> description fallback
          const rawTitle = (alert.title?.trim() ? alert.title.trim() : null) ?? (alert.type?.trim() ? alert.type.trim() : null);
          const rawMessage = (alert.message?.trim() ? alert.message.trim() : null) ?? ((alert as any).description?.trim() ? (alert as any).description.trim() : null);
          const severityExists = !!(alert.severity?.trim() || alert.type?.trim());
          const displayTitle = rawTitle || (rawMessage || severityExists ? (rawMessage ? rawMessage.slice(0, 60) : meta.label) : "Alert");
          const displayMessage = rawMessage || "";
          const isExpanded = expandedId === alert.id;
          const locationText = (alert.location?.trim() ? alert.location.trim() : null) ?? ((alert as any).address?.trim() ? (alert as any).address.trim() : null);
          const reportLink = (alert.report_id ? `/reports/${alert.report_id}` : null) ?? ((alert as any).report_link?.trim() ? (alert as any).report_link.trim() : null) ?? ((alert as any).reportLink?.trim() ? (alert as any).reportLink.trim() : null);
          return (
            <div
              key={alert.id}
              onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedId(isExpanded ? null : alert.id); } }}
              title={isExpanded ? "Click to collapse" : "Click to expand"}
              style={{
                background: "rgba(15,21,33,0.82)",
                border: `1px solid rgba(255,255,255,0.07)`,
                borderLeft: `3px solid ${meta.color}`,
                borderRadius: 12,
                padding: "14px 16px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#eef0f7", lineHeight: 1.3 }}>{displayTitle}</span>
                <span style={{ fontSize: 10, color: "rgba(238,240,247,0.4)", whiteSpace: "nowrap" }}>
                  {new Date(alert.created_at).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(238,240,247,0.65)", lineHeight: 1.5, marginBottom: 10, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {displayMessage || (isExpanded ? "No details provided." : (severityExists ? "" : "No details provided."))}
                {!isExpanded && displayMessage && displayMessage.length > 120 ? "…" : ""}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {severityExists && (
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                    {meta.label}
                  </span>
                )}
                <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "rgba(255,255,255,0.04)", color: "rgba(238,240,247,0.5)", border: "1px solid rgba(255,255,255,0.07)", textTransform: "capitalize" }}>
                  {aud}
                </span>
                {!isExpanded && (
                  <span style={{ fontSize: 10, color: "rgba(238,240,247,0.35)", marginLeft: "auto" }}>Click to expand ▸</span>
                )}
              </div>
              {isExpanded && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "rgba(238,240,247,0.65)", lineHeight: 1.6 }}>
                  {displayMessage && (
                    <div><strong style={{ color: "#eef0f7" }}>Message:</strong> <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{displayMessage}</span></div>
                  )}
                  <div><strong style={{ color: "#eef0f7" }}>Time:</strong> {new Date(alert.created_at).toLocaleString("en-PH", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                  {locationText && (
                    <div><strong style={{ color: "#eef0f7" }}>Location:</strong> {locationText}</div>
                  )}
                  {reportLink && (
                    <div><strong style={{ color: "#eef0f7" }}>Report:</strong> <a href={reportLink} onClick={(e) => e.stopPropagation()} style={{ color: "#5B8DEF", textDecoration: "underline" }}>{reportLink}</a></div>
                  )}
                  {!locationText && !reportLink && !displayMessage && (
                    <div style={{ color: "rgba(238,240,247,0.4)" }}>No additional details for this alert.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}