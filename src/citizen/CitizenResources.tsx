// src/citizen/CitizenResources.tsx
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../js/supabase";
import dsgLogo from "../assets/dsg.logo.png";

const NAV_LINK: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "10px 12px", borderRadius: "8px",
  fontSize: "13px", fontWeight: "500",
  color: "rgba(238,240,247,0.55)",
  textDecoration: "none", marginBottom: "2px",
};

const resources = [
  { icon: "🛡️", accent: "#2ECC8F", tag: "Community",    title: "Safety Tips",         desc: "Practical barangay-level guidelines to keep yourself protected before, during, and after an emergency.", to: "/citizen/safetytips",  links: [{ label: "Before a Typhoon", to: "/citizen/safetytips" }, { label: "Flood Safety Protocol", to: "/citizen/safetytips" }, { label: "Fire Prevention Guide", to: "/citizen/safetytips" }] },
  { icon: "📋", accent: "#4A90D9", tag: "Contacts",     title: "Emergency Directory", desc: "All essential emergency hotlines — hospitals, barangay responders, and city-wide disaster management units.", to: "/citizen/directory", links: [{ label: "City Emergency Services", to: "/citizen/directory" }, { label: "Barangay Hotlines", to: "/citizen/directory" }, { label: "Hospitals & Medical", to: "/citizen/directory" }] },
  { icon: "🗺️", accent: "#F5C842", tag: "Map",          title: "Safety Map",          desc: "Real-time map of incidents, evacuation centers, and emergency facilities across Dumaguete City.", to: "/citizen/map",        links: [{ label: "View Live Map", to: "/citizen/map" }, { label: "Evacuation Centers", to: "/citizen/map" }, { label: "Incident Heatmap", to: "/citizen/map" }] },
  { icon: "📝", accent: "#EF5B5B", tag: "Report",       title: "File a Report",       desc: "Submit an emergency incident report directly to local responders. Fast, simple, and tracked in real-time.", to: "/citizen/report",    links: [{ label: "New Incident Report", to: "/citizen/report" }, { label: "My Report History", to: "/citizen/history" }, { label: "Check Report Status", to: "/citizen/history" }] },
];

export default function CitizenResources() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080c14", color: "#eef0f7", fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ position: "fixed", left: 0, top: 0, width: "260px", height: "100vh", backgroundColor: "rgba(8,12,20,0.95)", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", zIndex: 200 }}>
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <img src={dsgLogo} alt="DSG" style={{ width: "40px", height: "40px", borderRadius: "8px", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))" }} />
          <div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#eef0f7" }}>DumaSafeGuide</div>
            <div style={{ fontSize: "10px", color: "#2ECC8F", marginTop: "2px", fontWeight: "600" }}>● CITIZEN</div>
          </div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px" }}>Portal</div>
          <Link to="/citizen/dashboard"  style={NAV_LINK}><span>🏠</span> Overview</Link>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Actions</div>
          <Link to="/citizen/report"     style={NAV_LINK}><span>📝</span> File Report</Link>
          <Link to="/citizen/history"    style={NAV_LINK}><span>📂</span> My Reports</Link>
          <Link to="/citizen/alerts"     style={NAV_LINK}><span>🔔</span> Barangay Alerts</Link>
          <Link to="/citizen/map"        style={NAV_LINK}><span>🗺️</span> Safety Map</Link>
          <Link to="/citizen/safetytips" style={NAV_LINK}><span>💡</span> Safety Tips</Link>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Info</div>
          <Link to="/citizen/directory"  style={NAV_LINK}><span>📋</span> Directory</Link>
          {/* Active: Resources */}
          <Link to="/citizen/resources"  style={{ ...NAV_LINK, backgroundColor: "rgba(245,200,66,0.10)", color: "#F5C842", borderLeft: "2px solid #F5C842", paddingLeft: "10px" }}><span>📚</span> Resources</Link>
        </nav>
        <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", cursor: "pointer" }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: "260px", padding: "28px 32px", minHeight: "100vh" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "10px", color: "#F5C842", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px", fontWeight: "700" }}>● Knowledge Hub</div>
          <h1 style={{ fontSize: "34px", fontWeight: "900", color: "#eef0f7", marginBottom: "6px" }}>Resources &amp; <span style={{ color: "#F5C842" }}>Guides</span></h1>
          <p style={{ fontSize: "12px", color: "rgba(238,240,247,0.35)", letterSpacing: "0.06em" }}>EVERYTHING YOU NEED TO STAY INFORMED AND PREPARED</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {resources.map(r => (
            <div key={r.title} style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderTop: `2px solid ${r.accent}`, borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span style={{ fontSize: "28px" }}>{r.icon}</span>
                <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: r.accent, backgroundColor: `${r.accent}18`, border: `1px solid ${r.accent}40`, borderRadius: "3px", padding: "3px 7px" }}>{r.tag}</span>
              </div>
              <div style={{ fontSize: "17px", fontWeight: "800", color: "#eef0f7", marginBottom: "10px" }}>{r.title}</div>
              <p style={{ fontSize: "13px", color: "rgba(238,240,247,0.45)", lineHeight: "1.65", marginBottom: "20px", flex: 1 }}>{r.desc}</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {r.links.map(l => (
                  <Link key={l.label} to={l.to} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", fontSize: "12px", color: "rgba(238,240,247,0.35)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = r.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,240,247,0.35)")}>
                    <span>{l.label}</span>
                    <span style={{ fontSize: "12px" }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency CTA */}
        <div style={{ marginTop: "32px", backgroundColor: "rgba(232,55,42,0.07)", border: "1px solid rgba(232,55,42,0.2)", borderRadius: "14px", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#eef0f7", marginBottom: "6px" }}>Need to report an emergency?</div>
            <p style={{ fontSize: "13px", color: "rgba(238,240,247,0.35)" }}>Don't wait — alert local responders immediately using the incident report form.</p>
          </div>
          <Link to="/citizen/report" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", backgroundColor: "#e8372a", borderRadius: "10px", fontSize: "12px", fontWeight: "700", color: "#fff", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            🚨 Report Now
          </Link>
        </div>
      </div>
    </div>
  );
}