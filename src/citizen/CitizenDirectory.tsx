// src/citizen/CitizenDirectory.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../js/supabase";
import dsgLogo from "../assets/dsg.logo.png";

interface PhoneEntry { label: string; number: string; }
interface EmergencyAgency {
  agency: string; label: string; address: string; icon: string; accent: string;
  phones: PhoneEntry[]; notes?: string;
}
interface Hospital {
  name: string; address: string; type: string;
  beds?: string; phones: PhoneEntry[]; notes?: string;
}
interface Barangay { name: string; hotline: string | null; evacuation: string | null; }

const emergency: EmergencyAgency[] = [
  { agency: "PNP", label: "Police", address: "Camp Leon Kilat, Dumaguete City", icon: "🚔", accent: "#4A90D9",
    phones: [{ label: "National", number: "911" }, { label: "Local", number: "116" }, { label: "CRUZTELCO", number: "(035) 225-1766" }, { label: "Globe", number: "0917 933 0022" }, { label: "Smart", number: "0929 200 6999" }],
    notes: "Available 24/7 for all police emergencies" },
  { agency: "BFP", label: "Fire Dept.", address: "Real St, Dumaguete City", icon: "🔥", accent: "#e8372a",
    phones: [{ label: "Emergency", number: "160" }, { label: "CRUZTELCO", number: "(035) 225-3445" }, { label: "Globe", number: "0977 198 1900" }, { label: "Smart", number: "0961 199 8377" }],
    notes: "Fire suppression, rescue & emergency medical response" },
  { agency: "CDRRMO", label: "City DRRM", address: "City Hall Compound, Dumaguete City", icon: "🛡️", accent: "#F5C842",
    phones: [{ label: "Emergency", number: "348" }, { label: "Operations", number: "(035) 225-1911" }, { label: "Globe", number: "0936 795 4163" }],
    notes: "City Disaster Risk Reduction & Management — 24/7" },
  { agency: "ONE Rescue", label: "EMS / Ambulance", address: "Oriental Negros Emergency Rescue Foundation", icon: "🚑", accent: "#2ECC8F",
    phones: [{ label: "CRUZTELCO", number: "(035) 225-9110" }, { label: "Globe", number: "0905 518 6917" }, { label: "Sun", number: "0922 880 8897" }],
    notes: "Free pre-hospital emergency medical services" },
  { agency: "Coast Guard", label: "Sea Rescue", address: "Dumaguete Boulevard", icon: "⚓", accent: "#00c8e0",
    phones: [{ label: "Station", number: "(035) 422-6541" }, { label: "Mobile", number: "0968 771 2455" }],
    notes: "Marine search & rescue operations" },
  { agency: "NORECO II", label: "Electric", address: "Dumaguete City", icon: "⚡", accent: "#a78bfa",
    phones: [{ label: "CRUZTELCO", number: "(035) 225-4830" }, { label: "Globe", number: "0917 322 4237" }],
    notes: "Power outages, downed lines & electrical emergencies" },
];

const hospitals: Hospital[] = [
  { name: "Silliman University Medical Center", address: "V. Aldecoa Sr. Road, Daro", type: "Private — Level III",
    beds: "200+ beds",
    phones: [{ label: "Main", number: "(035) 420-2000" }, { label: "ICU", number: "(035) 225-3563" }, { label: "Ambulance", number: "0917 107 7415" }],
    notes: "Oldest Protestant hospital in Negros Oriental (est. 1903)" },
  { name: "ACE Dumaguete Doctors Hospital", address: "Claytown Road, Dumaguete City", type: "Private — Tertiary",
    phones: [{ label: "Trunk", number: "(035) 523-5957" }, { label: "Alt", number: "(035) 225-8000" }],
    notes: "Allied Care Experts — specialist and emergency services" },
  { name: "Holy Child Hospital", address: "Bp. Epifanio Surban St.", type: "Private — Secondary",
    phones: [{ label: "Main", number: "(035) 422-9063" }, { label: "Mobile", number: "0995 090 8263" }],
    notes: "Catholic-affiliated, run by the Sisters of Mount Carmel" },
  { name: "Negros Oriental Provincial Hospital", address: "North National Hwy, Brgy. Piapi", type: "Government — Level III",
    beds: "250 beds",
    phones: [{ label: "Main", number: "(035) 225-4921" }, { label: "Alt", number: "(035) 422-8628" }],
    notes: "Primary government referral hospital for Negros Oriental" },
];

const barangays: Barangay[] = [
  { name: "Bagacay",     hotline: "09652045077",               evacuation: "Barangay Bagacay Gymnasium" },
  { name: "Bajumpandan", hotline: "09551850601",               evacuation: "NORSU Main Campus II" },
  { name: "Balugo",      hotline: "09273571566",               evacuation: "Balugo Elementary School" },
  { name: "Banilad",     hotline: "09197607484",               evacuation: "Hermenegilda Flores Gloria Memorial High School" },
  { name: "Bantayan",    hotline: "09353261839",               evacuation: "Barangay Bantayan Health Center" },
  { name: "Batinguel",   hotline: "09054345143",               evacuation: "Barangay Batinguel Gymnasium" },
  { name: "Buñao",       hotline: "09559268258",               evacuation: "Buñao Barangay Hall / Magsaysay Memorial Elementary School" },
  { name: "Cadawinonan", hotline: "09363175898 / 09164803784", evacuation: "Cadawinonan Elementary School" },
  { name: "Calindagan",  hotline: "09457419261",               evacuation: "Dumaguete City National High School" },
  { name: "Camanjac",    hotline: "(035) 523-6263",            evacuation: "Camanjac Basketball Court" },
  { name: "Candau-ay",   hotline: "09359836121",               evacuation: "Batinguel / Candau-ay Elementary School" },
  { name: "Cantil-e",    hotline: "09550192925",               evacuation: "Upper Cantil-e Covered Court" },
  { name: "Daro",        hotline: "(035) 422-9761",            evacuation: "Daro Barangay Hall" },
  { name: "Junob",       hotline: "09753422065",               evacuation: "Northern Junob Basketball Court" },
  { name: "Looc",        hotline: "09362997073",               evacuation: "Amador Dagudag Elementary School" },
  { name: "Mangnao",     hotline: "09979156379",               evacuation: "Mangnao Gymnasium / South City Elementary School" },
  { name: "Motong",      hotline: "09261912007",               evacuation: "Barangay Motong Covered Court" },
  { name: "Piapi",       hotline: "09165009288",               evacuation: "Piapi High School and Elementary School" },
  { name: "Poblacion 1", hotline: "09264603953",               evacuation: "City Central Elementary School" },
  { name: "Poblacion 2", hotline: "09558560795",               evacuation: "Building 2, Public Market" },
  { name: "Poblacion 3", hotline: null,                        evacuation: null },
  { name: "Poblacion 4", hotline: null,                        evacuation: null },
  { name: "Poblacion 5", hotline: null,                        evacuation: null },
  { name: "Poblacion 6", hotline: null,                        evacuation: null },
  { name: "Poblacion 7", hotline: "09550894159",               evacuation: "Barangay Hall / West City Elementary School" },
  { name: "Poblacion 8", hotline: "09067729723",               evacuation: "COSCA / Building 2, Public Market" },
  { name: "Pulantubig",  hotline: "09559268258",               evacuation: "Magsaysay Memorial Elementary School" },
  { name: "Tabuc-tubig", hotline: "09975941648",               evacuation: "Tabuc-tubig Barangay Hall" },
  { name: "Taculing",    hotline: null,                        evacuation: null },
  { name: "Talay",       hotline: "09190834553",               evacuation: "Talay Multi-purpose Evacuation Center" },
  { name: "Tamnag",      hotline: null,                        evacuation: null },
  { name: "Taclobo",     hotline: "(035) 226-3953",            evacuation: "Taclobo National High School" },
];

function cleanPhone(p: string) { return p.replace(/[^0-9+]/g, ""); }
function openMaps(q: string) { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, "_blank"); }

const NAV_LINK: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "10px 12px", borderRadius: "8px",
  fontSize: "13px", fontWeight: "500",
  color: "rgba(238,240,247,0.55)",
  textDecoration: "none", marginBottom: "2px", transition: "all 0.2s",
};

export default function CitizenDirectory() {
  const navigate = useNavigate();
  const [tab,       setTab]       = useState<"emergency" | "hospitals" | "barangays">("emergency");
  const [bgySearch, setBgySearch] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const filtered = barangays.filter(b => {
    const q = bgySearch.toLowerCase();
    return b.name.toLowerCase().includes(q) ||
      (b.hotline?.toLowerCase().includes(q) ?? false) ||
      (b.evacuation?.toLowerCase().includes(q) ?? false);
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080c14", color: "#eef0f7", fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* ── Sidebar ── */}
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
          <Link to="/citizen/dashboard" style={NAV_LINK}><span>🏠</span> Overview</Link>

          <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Actions</div>
          <Link to="/citizen/report"    style={NAV_LINK}><span>📝</span> File Report</Link>
          <Link to="/citizen/history"   style={NAV_LINK}><span>📂</span> My Reports</Link>
          <Link to="/citizen/alerts"    style={NAV_LINK}><span>🔔</span> Barangay Alerts</Link>
          <Link to="/citizen/map"       style={NAV_LINK}><span>🗺️</span> Safety Map</Link>
          <Link to="/citizen/safetytips" style={NAV_LINK}><span>💡</span> Safety Tips</Link>

          <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Info</div>
          {/* Active state for directory */}
          <Link to="/citizen/directory" style={{ ...NAV_LINK, backgroundColor: "rgba(74,144,217,0.12)", color: "#4A90D9", borderLeft: "2px solid #4A90D9", paddingLeft: "10px" }}><span>📋</span> Directory</Link>
          <Link to="/citizen/resources" style={NAV_LINK}><span>📚</span> Resources</Link>
        </nav>

        <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", cursor: "pointer" }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ marginLeft: "260px", padding: "28px 32px", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", color: "#4A90D9", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px", fontWeight: "700" }}>● Emergency Directory</div>
          <h1 style={{ fontSize: "34px", fontWeight: "900", color: "#eef0f7", marginBottom: "6px" }}>Emergency <span style={{ color: "#4A90D9" }}>Contacts</span></h1>
          <p style={{ fontSize: "12px", color: "rgba(238,240,247,0.35)", letterSpacing: "0.06em" }}>DUMAGUETE CITY — ALL CRITICAL HOTLINES IN ONE PLACE</p>
        </div>

        {/* 911 Banner */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", backgroundColor: "rgba(232,55,42,0.08)", border: "1px solid rgba(232,55,42,0.3)", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#ff8a80", letterSpacing: "0.12em" }}>🚨 UNIVERSAL EMERGENCY</span>
          {[["911","All Emergencies"],["116","PNP Police"],["160","BFP Fire"],["0936 795 4163","CDRRMO"],["0905 518 6917","ONE Rescue"]].map(([num, lbl]) => (
            <a key={num} href={`tel:${cleanPhone(num)}`} style={{ display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: "rgba(232,55,42,0.1)", border: "1px solid rgba(232,55,42,0.3)", borderRadius: "20px", padding: "6px 13px", fontSize: "12px", fontWeight: "500", color: "#eef0f7", textDecoration: "none" }}>
              📞 {num} <span style={{ color: "rgba(238,240,247,0.4)", fontSize: "10px" }}>— {lbl}</span>
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {(["emergency","hospitals","barangays"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.10em", textTransform: "uppercase", cursor: "pointer", border: "1px solid", transition: "all 0.2s",
              backgroundColor: tab === t ? "rgba(74,144,217,0.15)" : "rgba(255,255,255,0.03)",
              color:           tab === t ? "#4A90D9"               : "rgba(238,240,247,0.35)",
              borderColor:     tab === t ? "rgba(74,144,217,0.4)"  : "rgba(255,255,255,0.07)",
            }}>
              {t === "emergency" ? "🚨 Emergency" : t === "hospitals" ? "🏥 Hospitals" : "🏘️ Barangays"}
            </button>
          ))}
        </div>

        {/* ── Emergency Services Tab ── */}
        {tab === "emergency" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {emergency.map(item => (
              <div key={item.agency} style={{ backgroundColor: "rgba(15,21,33,0.82)", border: `1px solid rgba(255,255,255,0.07)`, borderTop: `2px solid ${item.accent}`, borderRadius: "14px", padding: "20px", transition: "all 0.2s" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: "900", color: item.accent, marginBottom: "2px" }}>{item.agency}</div>
                <div style={{ fontSize: "10px", color: "rgba(238,240,247,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>{item.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
                  {item.phones.map((p, i) => {
                    const isHotline = /^\d{2,3}$/.test(p.number.trim());
                    const isMobile  = p.number.startsWith("09");
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{p.label}</span>
                        <a href={`tel:${cleanPhone(p.number)}`} style={{ fontSize: isHotline ? "16px" : "13px", fontWeight: isHotline ? "800" : "500", color: isHotline ? "#ff8a80" : isMobile ? item.accent : "rgba(238,240,247,0.7)", textDecoration: "none" }}>
                          {p.number}
                        </a>
                      </div>
                    );
                  })}
                </div>
                {item.notes && <p style={{ fontSize: "11px", color: "rgba(238,240,247,0.28)", lineHeight: "1.5", marginBottom: "12px" }}>{item.notes}</p>}
                <div style={{ display: "flex", gap: "6px" }}>
                  <a href={`tel:${cleanPhone(item.phones[0].number)}`} style={{ flex: 1, textAlign: "center", padding: "8px", backgroundColor: `${item.accent}18`, border: `1px solid ${item.accent}55`, borderRadius: "8px", fontSize: "11px", fontWeight: "700", color: item.accent, textDecoration: "none" }}>
                    📞 Call Now
                  </a>
                  <button onClick={() => openMaps(`${item.agency} ${item.address}`)} style={{ padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "11px", color: "rgba(238,240,247,0.35)", cursor: "pointer" }}>
                    📍
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Hospitals Tab ── */}
        {tab === "hospitals" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
            {hospitals.map(h => {
              const isGov = h.type.includes("Government");
              return (
                <div key={h.name} style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: isGov ? "#4A90D9" : "#2ECC8F", border: `1px solid ${isGov ? "rgba(74,144,217,0.3)" : "rgba(46,204,143,0.3)"}`, borderRadius: "4px", padding: "3px 7px" }}>
                      {isGov ? "Government" : "Private"}
                    </span>
                    {h.beds && <span style={{ fontSize: "9px", color: "rgba(238,240,247,0.28)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", padding: "3px 7px" }}>🛏 {h.beds}</span>}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#eef0f7", marginBottom: "4px", lineHeight: "1.3" }}>{h.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.28)", marginBottom: "14px" }}>📍 {h.address}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
                    {h.phones.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{p.label}</span>
                        <a href={`tel:${cleanPhone(p.number)}`} style={{ fontSize: "13px", fontWeight: "500", color: p.number.startsWith("09") ? "#4A90D9" : "rgba(238,240,247,0.7)", textDecoration: "none" }}>{p.number}</a>
                      </div>
                    ))}
                  </div>
                  {h.notes && <p style={{ fontSize: "11px", color: "rgba(238,240,247,0.28)", lineHeight: "1.5", marginBottom: "12px" }}>{h.notes}</p>}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <a href={`tel:${cleanPhone(h.phones[0].number)}`} style={{ flex: 1, textAlign: "center", padding: "8px", backgroundColor: "rgba(74,144,217,0.1)", border: "1px solid rgba(74,144,217,0.3)", borderRadius: "8px", fontSize: "11px", fontWeight: "700", color: "#4A90D9", textDecoration: "none" }}>📞 Call</a>
                    <button onClick={() => openMaps(`${h.name} Dumaguete`)} style={{ padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "11px", color: "rgba(238,240,247,0.35)", cursor: "pointer" }}>📍</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Barangays Tab ── */}
        {tab === "barangays" && (
          <>
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}>🔍</span>
              <input
                type="text"
                value={bgySearch}
                onChange={e => setBgySearch(e.target.value)}
                placeholder="Search barangay, hotline, or evacuation site…"
                style={{ width: "100%", backgroundColor: "rgba(8,12,20,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "11px 36px 11px 36px", fontSize: "13px", color: "#eef0f7", outline: "none", fontFamily: "inherit" }}
              />
              {bgySearch && (
                <button onClick={() => setBgySearch("")} style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(238,240,247,0.35)", fontSize: "18px", cursor: "pointer" }}>×</button>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[
                { label: `${barangays.filter(b => b.hotline).length} with hotlines`,        color: "#4A90D9" },
                { label: `${barangays.filter(b => b.evacuation).length} with evacuation`,   color: "#2ECC8F" },
                { label: `${barangays.filter(b => !b.hotline).length} no direct hotline`,   color: "rgba(238,240,247,0.28)" },
              ].map(s => (
                <span key={s.label} style={{ fontSize: "11px", color: s.color, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "4px 10px" }}>{s.label}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px", color: "rgba(238,240,247,0.28)", fontSize: "13px" }}>No barangay matches your search.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
                {filtered.map(b => (
                  <div key={b.name} style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#eef0f7", marginBottom: "8px" }}>{b.name}</div>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "8px", flexWrap: "wrap" }}>
                      {b.hotline    && <span style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.10em", color: "#4A90D9", border: "1px solid rgba(74,144,217,0.25)", borderRadius: "3px", padding: "2px 6px" }}>📞 HOTLINE</span>}
                      {b.evacuation && <span style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.10em", color: "#2ECC8F", border: "1px solid rgba(46,204,143,0.25)", borderRadius: "3px", padding: "2px 6px" }}>🏫 EVAC</span>}
                      {!b.hotline && !b.evacuation && <span style={{ fontSize: "8px", color: "rgba(238,240,247,0.28)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "3px", padding: "2px 6px" }}>NO DIRECT HOTLINE</span>}
                    </div>
                    {b.hotline
                      ? <a href={`tel:${cleanPhone(b.hotline.split("/")[0].trim())}`} style={{ fontSize: "12px", fontWeight: "600", color: "#4A90D9", textDecoration: "none", display: "block", marginBottom: "5px" }}>{b.hotline}</a>
                      : <p style={{ fontSize: "11px", color: "rgba(238,240,247,0.28)", marginBottom: "5px" }}>Call <a href="tel:911" style={{ color: "#ff8a80", textDecoration: "none" }}>911</a> or <a href="tel:09367954163" style={{ color: "#4A90D9", textDecoration: "none" }}>CDRRMO</a></p>
                    }
                    {b.evacuation && <p style={{ fontSize: "10px", color: "rgba(238,240,247,0.35)", lineHeight: "1.4", marginBottom: "8px" }}>🏫 {b.evacuation}</p>}
                    <button onClick={() => openMaps(`${b.name} Barangay Dumaguete City`)} style={{ fontSize: "10px", fontWeight: "600", color: "rgba(238,240,247,0.35)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Navigate →</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}