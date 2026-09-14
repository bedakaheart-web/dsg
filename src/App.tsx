import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout   from './components/Publiclayout';
import { supabase }   from './js/supabase';

// ── Lazy-load with stale-chunk auto-recovery ────────────────────────────────
// After a new build is deployed, the browser (or installed service worker) can
// still reference hashed chunk filenames from the previous bundle, so a
// React.lazy() import rejects with a ChunkLoadError ("Failed to fetch
// dynamically imported module", 404). This wrapper forces a single page reload
// so the fresh index.html/chunk manifest is picked up; the sessionStorage flag
// guarantees we reload at most once and then surface the real error instead of
// looping forever (e.g. during private browsing where storage may throw, the
// reload still happens once and the error propagates on the second failure).
const PAGE_REFRESHED_KEY = 'page_refreshed';

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
      } catch {
        // Storage unavailable (e.g. private mode) — safe to ignore.
      }
      return component;
    } catch (error) {
      if (!pageRefreshed) {
        try {
          window.sessionStorage.setItem(PAGE_REFRESHED_KEY, 'true');
        } catch {
          // Storage unavailable — still reload once below.
        }
        window.location.reload();
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

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { authListener?.subscription?.unsubscribe(); };
  }, []);

  if (loading) return <Loader />;

  return (
    <HashRouter>
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
    </HashRouter>
  );
}