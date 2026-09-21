import React, { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout   from './components/Publiclayout';
import { supabase }   from './js/supabase';

// ── Lazy-load with stale-chunk auto-recovery ────────────────────────────────
// After a new build is deployed, the browser (or installed PWA service worker)
// can still reference hashed chunk filenames from the previous bundle, so a
// React.lazy() import rejects with a ChunkLoadError ("Failed to fetch
// dynamically imported module", 404, "Loading chunk failed", "Unexpected token '<'").
// This wrapper forces a single page reload so the fresh index.html/chunk manifest
// is picked up; it also tries to bust the Workbox precache via CacheStorage
// (when available) before reloading. The sessionStorage flag guarantees we reload
// at most once and then surface the real error instead of looping forever
// (e.g. during private/incognito where storage may throw, we still reload once).
const PAGE_REFRESHED_KEY = 'page_refreshed';

function isChunkLoadError(error: unknown): boolean {
  const msg = (error as Error)?.message ?? String(error);
  return /Failed to fetch dynamically imported module|Loading chunk|ChunkLoadError|Unexpected token '<'|Importing a module script failed/i.test(msg);
}

async function bustServiceWorkerCache(): Promise<void> {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    // Ask Workbox to skipWaiting if an update is waiting
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      regs.forEach(r => r.update().catch(() => {}));
    }
  } catch { /* ignore */ }
}

function lazyWithRetry<T extends ComponentType<Record<string, unknown>>>(
  componentImport: () => Promise<{ default: T }>,
) {
  return lazy(async (): Promise<{ default: T }> => {
    let pageRefreshed = false;
    try {
      pageRefreshed = JSON.parse(window.sessionStorage.getItem(PAGE_REFRESHED_KEY) || 'false');
    } catch {
      pageRefreshed = false;
    }
    try {
      const component = await componentImport();
      try {
        window.sessionStorage.setItem(PAGE_REFRESHED_KEY, 'false');
      } catch { /* storage unavailable — ignore */ }
      return component;
    } catch (error) {
      // Only auto-reload for genuine chunk-load failures, not for render errors
      if (!isChunkLoadError(error)) throw error;
      if (!pageRefreshed) {
        try { window.sessionStorage.setItem(PAGE_REFRESHED_KEY, 'true'); } catch { /* ignore */ }
        await bustServiceWorkerCache();
        window.location.reload();
        // Return a never-resolving promise while reload happens to avoid throwing during unload
        return new Promise(() => {}) as Promise<{ default: T }>;
      }
      throw error;
    }
  });
}

const About = lazyWithRetry(() => import("./pages/About"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const Terms = lazyWithRetry(() => import("./pages/TermsOfUse"));

// ── Public pages ──────────────────────────────────────────────────────────────
const Homepage       = lazyWithRetry(() => import('./pages/Homepage'));
const Login          = lazyWithRetry(() => import('./pages/Login'));
const Signup         = lazyWithRetry(() => import('./pages/Signup'));
const ForgotPassword = lazyWithRetry(() => import('./pages/ForgotPassword'));
const Directory      = lazyWithRetry(() => import('./pages/Directory'));
const Map            = lazyWithRetry(() => import('./pages/Map'));
const IncidentAlerts = lazyWithRetry(() => import('./pages/IncidentaAlerts'));
const SafetyTips     = lazyWithRetry(() => import('./pages/SafetyTips'));   // add if you have it
const Resources      = lazyWithRetry(() => import('./pages/Resources'));     // add if you have it
const PartnerAgencies = lazyWithRetry(() => import('./pages/PartnerAgencies'));

// ── Admin ─────────────────────────────────────────────────────────────────────
const AdminDashboard = lazyWithRetry(() => import('./admin/AdminDashboard'));

// ── Responder ─────────────────────────────────────────────────────────────────
const Dispatch            = lazyWithRetry(() => import('./responder/Dispatch'));
const IncidentsPage       = lazyWithRetry(() => import('./responder/IncidentsPage'));
const ResponderAlertsPage = lazyWithRetry(() => import('./responder/ResponderAlertsPage'));
const RespondersDashboard = lazyWithRetry(() => import('./responder/Respondersdashboard'));
const ResponderTeam       = lazyWithRetry(() => import('./responder/ResponderTeam'));

// ── Chat ────────────────────────────────────────────────────────────────
const ChatPage = lazyWithRetry(() => import('./components/ChatPage'));

// ── Citizen ───────────────────────────────────────────────────────────────────
const CitizenLayout      = lazyWithRetry(() => import('./citizen/CitizenLayout'));
const CitizenDashboard   = lazyWithRetry(() => import('./citizen/CitizenDashboard'));
const CitizenHistoryPage = lazyWithRetry(() => import('./citizen/CitizenHistoryPage'));
const CitizenAlertsPage  = lazyWithRetry(() => import('./citizen/CitizenAlertsPage'));
const CitizenMap         = lazyWithRetry(() => import('./citizen/CitizenMap'));
const CitizenSafetyTips  = lazyWithRetry(() => import('./citizen/CitizenSafetyTips'));
const CitizenReportPage = lazyWithRetry(() => import("./citizen/CitizenReportPage"));
const Report = lazyWithRetry(() => import("./pages/Report"));
const CitizenDirectory   = lazyWithRetry(() => import('./citizen/CitizenDirectory'));
const CitizenResources   = lazyWithRetry(() => import('./citizen/CitizenResources'));
const CitizenAbout       = lazyWithRetry(() => import('./citizen/CitizenAbout'));
const CitizenChatPage    = lazyWithRetry(() => import('./citizen/components/CitizenChatPage'));

const Loader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', backgroundColor: '#080c14', color: '#eef0f7',
  }}>
    Loading...
  </div>
);

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080c14', color: '#eef0f7', padding: 24, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ maxWidth: 560, width: '100%', background: 'rgba(15,21,33,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: 'rgba(238,240,247,0.65)', marginBottom: 12, wordBreak: 'break-word' }}>
              {this.state.error?.message ?? 'Unknown error'}
            </div>
            <button onClick={() => window.location.reload()} style={{ background: 'rgba(46,204,143,0.16)', border: '1px solid rgba(46,204,143,0.35)', color: '#2ECC8F', borderRadius: 8, padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error && /Invalid Refresh Token|Refresh Token Not Found/i.test(error.message ?? '')) {
          try { await supabase.auth.signOut(); } catch {}
          try {
            Object.keys(localStorage).forEach(k => {
              if (k.startsWith('sb-') && k.includes('-auth-token')) localStorage.removeItem(k);
            });
          } catch {}
          if (!cancelled) {
            setUser(null);
            setLoading(false);
            // Force redirect to login if on protected route
            if (window.location.hash.includes('/citizen/') || window.location.hash.includes('/responder/') || window.location.hash.includes('/admin/')) {
              window.location.hash = '#/login';
            }
            return;
          }
        }
        if (!cancelled) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    };
    init();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { cancelled = true; authListener?.subscription?.unsubscribe(); };
  }, []);

  if (loading) return <Loader />;

  return (
    <HashRouter>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>

          {/* ── Public pages — all get Navbar + Footer via PublicLayout ──── */}
          <Route path="/" element={
            <PublicLayout isHomepage>
              <Homepage />
            </PublicLayout>
          } />

          <Route path="/login" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />

          <Route path="/signup" element={
            <PublicLayout>
              <Signup />
            </PublicLayout>
          } />

          <Route path="/forgot-password" element={
            <PublicLayout>
              <ForgotPassword />
            </PublicLayout>
          } />

          <Route path="/directory" element={
            <PublicLayout>
              <Directory />
            </PublicLayout>
          } />

          <Route path="/map" element={
            <PublicLayout>
              <Map />
            </PublicLayout>
          } />

          <Route path="/safetytips" element={
            <PublicLayout>
              <SafetyTips />
            </PublicLayout>
          } />

          <Route path="/resources" element={
            <PublicLayout>
              <Resources />
            </PublicLayout>
          } />

          <Route path="/partner-agencies" element={
            <PublicLayout>
              <PartnerAgencies />
            </PublicLayout>
          } />

          <Route path="/incident-alerts" element={
            <PublicLayout>
              <IncidentAlerts />
            </PublicLayout>
          } />

          {/* ── Admin — NO PublicLayout, has its own full-screen shell ──── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* ── Citizen — persistent CitizenLayout sidebar + <Outlet/> children ───── */}
          <Route element={<ProtectedRoute allowedRole="citizen"><CitizenLayout /></ProtectedRoute>}>
            <Route path="/citizen/dashboard"   element={<CitizenDashboard />} />
            <Route path="/citizen/history"     element={<CitizenHistoryPage />} />
            <Route path="/citizen/history/:id" element={<CitizenHistoryPage />} />
            <Route path="/citizen/alerts"      element={<CitizenAlertsPage />} />
            <Route path="/citizen/map"         element={<CitizenMap />} />
            <Route path="/citizen/safetytips"  element={<CitizenSafetyTips />} />
            <Route path="/citizen/report"      element={<CitizenReportPage />} />
            <Route path="/citizen/directory"   element={<CitizenDirectory />} />
            <Route path="/citizen/resources"   element={<CitizenResources />} />
            <Route path="/citizen/about"       element={<CitizenAbout />} />
            <Route path="/citizen/chat"      element={<CitizenChatPage />} />
          </Route>

          {/* ── Universal Chat ── */}
          <Route path="/chat" element={<ProtectedRoute allowedRole="citizen,responder,admin"><ChatPage /></ProtectedRoute>} />

          {/* ── Responder — NO PublicLayout, has its own dashboard shell ── */}
          <Route path="/responder/dashboard" element={<ProtectedRoute allowedRole="responder"><RespondersDashboard /></ProtectedRoute>} />
          <Route path="/responder/dispatch"  element={<ProtectedRoute allowedRole="responder"><Dispatch /></ProtectedRoute>} />
          <Route path="/responder/incidents" element={<ProtectedRoute allowedRole="responder"><IncidentsPage /></ProtectedRoute>} />
          <Route path="/responder/alerts"    element={<ProtectedRoute allowedRole="responder"><ResponderAlertsPage /></ProtectedRoute>} />
          <Route path="/responder/team"      element={<ProtectedRoute allowedRole="responder"><ResponderTeam /></ProtectedRoute>} />

          {/* ── Convenience redirects ─────────────────────────────────────── */}
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
              <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
              <Route path="/report" element={<PublicLayout><Report /></PublicLayout>} />
          {/* ── Catch-all ─────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        </Suspense>
      </ErrorBoundary>
    </HashRouter>
  );
}