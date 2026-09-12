// src/components/PublicLayout.tsx
//
// Wraps public-facing pages (Homepage, Map, Directory, SafetyTips, Resources)
// with the shared Navbar and Footer.
//
// ⚠️  This is ONLY used for public routes in App.tsx.
//     Citizen / Responder / Admin dashboards are NOT touched.
//     Navbar and Footer are hidden on /login and /signup — those pages
//     have their own internal navigation.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ── Pages that manage their own layout (no shared Navbar / Footer) ────────────
const AUTH_PATHS: string[] = [];

// ── PublicLayout ──────────────────────────────────────────────────────────────

interface PublicLayoutProps {
  children: React.ReactNode;
  /** Pass true for the Homepage — it manages its own top spacing internally */
  isHomepage?: boolean;
}

export default function PublicLayout({ children, isHomepage = false }: PublicLayoutProps) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Hide shared Navbar + Footer on auth pages — they have their own internal nav
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  if (isAuthPage) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "transparent" }}>
      {/* Navbar sits on top of everything via position:fixed — no extra div needed */}
      <Navbar />

      {/*
        Main content area.
        - isHomepage: no paddingTop because the homepage hero is designed to sit
          behind / beneath the transparent navbar intentionally.
        - All other public pages: paddingTop:70px to clear the fixed navbar height.
      */}
      <main style={{
        flex: 1,
        background: "transparent",
        paddingTop: isHomepage ? 0 : "70px",
        position: "relative",
        zIndex: 1,
      }}>
        {children}
      </main>

    <Footer />
    </div>
  );
}