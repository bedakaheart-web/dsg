// src/citizen/CitizenLayout.tsx
//
// Persistent shared layout for every /citizen/* route. Renders the citizen
// sidebar statically on the left and the active child route in <Outlet /> on
// the right, so navigating between citizen pages never unmounts, flickers, or
// hides the sidebar. Active link highlighting derives from
// useLocation().pathname (prefix match, so /citizen/history/:id still
// highlights "My Reports").

import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../js/supabase";
import dsgLogo from "../assets/dsg_logo.png";

const NAV_LINK_BASE: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "10px 12px", borderRadius: "8px",
  fontSize: "13px", fontWeight: "500",
  color: "rgba(238,240,247,0.55)",
  textDecoration: "none", marginBottom: "2px",
};

const NAV_LINK_ACTIVE: React.CSSProperties = {
  backgroundColor: "rgba(46,204,143,0.10)",
  color: "#2ECC8F",
  borderLeft: "2px solid #2ECC8F",
  paddingLeft: "10px",
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: "10px", fontWeight: "700",
  color: "rgba(238,240,247,0.28)",
  letterSpacing: "0.14em", textTransform: "uppercase",
  padding: "12px 8px 6px",
};

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function CitizenLayout() {
  // Consumes the active Navbar/Header language — sidebar labels re-render
  // instantly alongside page content on language change.
  const { language, t, tList } = useLanguage();
  void language;
  void tList;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  // Close the mobile drawer on every navigation (including back/forward).
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll only while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(to + "/");

  const linkStyle = (to: string): React.CSSProperties =>
    isActive(to) ? { ...NAV_LINK_BASE, ...NAV_LINK_ACTIVE } : NAV_LINK_BASE;

  const sidebarBody = (
    <>
      <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <img src={dsgLogo} alt="DSG" style={{ width: "40px", height: "40px", borderRadius: "8px", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))" }} />
        <div>
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#eef0f7" }}>DumaSafeGuide</div>
          <div style={{ fontSize: "10px", color: "#2ECC8F", marginTop: "2px", fontWeight: "600" }}>● CITIZEN</div>
        </div>
        {isMobile && (
          <button onClick={() => setDrawerOpen(false)} aria-label="Close navigation" style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(238,240,247,0.5)", cursor: "pointer", fontSize: "18px", padding: "4px" }}>
            <FaTimes />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        <div style={SECTION_LABEL}>{t("dashboard.sidebarPortal", "Portal")}</div>
        <Link to="/citizen/dashboard" style={linkStyle("/citizen/dashboard")}><span>🏠</span> {t("history.overview", "Overview")}</Link>

        <div style={{ ...SECTION_LABEL, marginTop: "8px" }}>{t("history.actions", "Actions")}</div>
        <Link to="/citizen/report" style={linkStyle("/citizen/report")}><span>📝</span> {t("nav.reportIncident", "Report Incident")}</Link>
        <Link to="/citizen/history" style={linkStyle("/citizen/history")}><span>📂</span> {t("nav.myReports", "My Reports")}</Link>
        <Link to="/citizen/alerts" style={linkStyle("/citizen/alerts")}><span>🔔</span> {t("history.barangayAlerts", "Barangay Alerts")}</Link>
        <Link to="/citizen/map" style={linkStyle("/citizen/map")}><span>🗺️</span> {t("history.safetyMap", "Safety Map")}</Link>
        <Link to="/citizen/safetytips" style={linkStyle("/citizen/safetytips")}><span>💡</span> {t("history.safetyTips", "Safety Tips")}</Link>

        <div style={{ ...SECTION_LABEL, marginTop: "8px" }}>{t("history.info", "Info")}</div>
        <Link to="/citizen/directory" style={linkStyle("/citizen/directory")}><span>📋</span> {t("history.directory", "Directory")}</Link>
        <Link to="/citizen/resources" style={linkStyle("/citizen/resources")}><span>📚</span> {t("history.resources", "Resources")}</Link>
      </nav>

      <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", cursor: "pointer" }}>
          🚪 {t("history.signOut", "Sign Out")}
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080c14" }}>
      {!isMobile && (
        <aside style={{ position: "fixed", left: 0, top: 0, width: "260px", height: "100vh", backgroundColor: "rgba(8,12,20,0.95)", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", zIndex: 200 }}>
          {sidebarBody}
        </aside>
      )}

      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "56px", backgroundColor: "rgba(8,12,20,0.97)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", zIndex: 200 }}>
          <button onClick={() => setDrawerOpen(true)} aria-label="Open navigation" style={{ background: "none", border: "none", color: "#eef0f7", cursor: "pointer", fontSize: "18px", padding: "4px", display: "flex", alignItems: "center" }}>
            <FaBars />
          </button>
          <span style={{ fontSize: "14px", fontWeight: "800", color: "#eef0f7" }}>DumaSafeGuide</span>
          <span style={{ fontSize: "9px", color: "#2ECC8F", fontWeight: "600" }}>● CITIZEN</span>
        </div>
      )}

      {isMobile && drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 299, backdropFilter: "blur(2px)" }} />
          <aside style={{ position: "fixed", left: 0, top: 0, width: "280px", height: "100vh", backgroundColor: "rgba(8,12,20,0.98)", borderRight: "1px solid rgba(255,255,255,0.10)", display: "flex", flexDirection: "column", zIndex: 300 }}>
            {sidebarBody}
          </aside>
        </>
      )}

      <main style={{ marginLeft: isMobile ? 0 : "260px", paddingTop: isMobile ? "56px" : 0, minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}
