import About from "./pages/AboutDumaSafeGuide";
import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout   from './components/Publiclayout';
import { supabase }   from './js/supabase';

// ── Public pages ──────────────────────────────────────────────────────────────
const Homepage       = lazy(() => import('./pages/Homepage'));
const Login          = lazy(() => import('./pages/Login'));
const Signup         = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Directory      = lazy(() => import('./pages/Directory'));
const Map            = lazy(() => import('./pages/Map'));
const IncidentAlerts = lazy(() => import('./pages/IncidentaAlerts'));
const SafetyTips     = lazy(() => import('./pages/SafetyTips'));   // add if you have it
const Resources      = lazy(() => import('./pages/Resources'));     // add if you have it

// ── Admin ─────────────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));

// ── Responder ─────────────────────────────────────────────────────────────────
const Dispatch            = lazy(() => import('./responder/Dispatch'));
const IncidentsPage       = lazy(() => import('./responder/IncidentsPage'));
const ResponderAlertsPage = lazy(() => import('./responder/ResponderAlertsPage'));
const RespondersDashboard = lazy(() => import('./responder/RespondersDashboard'));
const ResponderTeam       = lazy(() => import('./responder/ResponderTeam'));

// ── Citizen ───────────────────────────────────────────────────────────────────
const CitizenDashboard   = lazy(() => import('./citizen/CitizenDashboard'));
const CitizenHistoryPage = lazy(() => import('./citizen/CitizenHistoryPage'));
const CitizenAlertsPage  = lazy(() => import('./citizen/CitizenAlertsPage'));
const CitizenMap         = lazy(() => import('./citizen/CitizenMap'));
const CitizenSafetyTips  = lazy(() => import('./citizen/CitizenSafetyTips'));
const CitizenReportPage  = lazy(() => import('./citizen/CitizenReportPage'));
const CitizenDirectory   = lazy(() => import('./citizen/CitizenDirectory'));
const CitizenResources   = lazy(() => import('./citizen/CitizenResources'));

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

          {/* ── Citizen — NO PublicLayout, has CitizenNavbar built-in ───── */}
          <Route path="/citizen/dashboard"   element={<ProtectedRoute allowedRole="citizen"><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/citizen/history"     element={<ProtectedRoute allowedRole="citizen"><CitizenHistoryPage /></ProtectedRoute>} />
          <Route path="/citizen/history/:id" element={<ProtectedRoute allowedRole="citizen"><CitizenHistoryPage /></ProtectedRoute>} />
          <Route path="/citizen/alerts"      element={<ProtectedRoute allowedRole="citizen"><CitizenAlertsPage /></ProtectedRoute>} />
          <Route path="/citizen/map"         element={<ProtectedRoute allowedRole="citizen"><CitizenMap /></ProtectedRoute>} />
          <Route path="/citizen/safetytips"  element={<ProtectedRoute allowedRole="citizen"><CitizenSafetyTips /></ProtectedRoute>} />
          <Route path="/citizen/report"      element={<ProtectedRoute allowedRole="citizen"><CitizenReportPage /></ProtectedRoute>} />
          <Route path="/citizen/directory"   element={<ProtectedRoute allowedRole="citizen"><CitizenDirectory /></ProtectedRoute>} />
          <Route path="/citizen/resources"   element={<ProtectedRoute allowedRole="citizen"><CitizenResources /></ProtectedRoute>} />

          {/* ── Responder — NO PublicLayout, has its own dashboard shell ── */}
          <Route path="/responder/dashboard" element={<ProtectedRoute allowedRole="responder"><RespondersDashboard /></ProtectedRoute>} />
          <Route path="/responder/dispatch"  element={<ProtectedRoute allowedRole="responder"><Dispatch /></ProtectedRoute>} />
          <Route path="/responder/incidents" element={<ProtectedRoute allowedRole="responder"><IncidentsPage /></ProtectedRoute>} />
          <Route path="/responder/alerts"    element={<ProtectedRoute allowedRole="responder"><ResponderAlertsPage /></ProtectedRoute>} />
          <Route path="/responder/team"      element={<ProtectedRoute allowedRole="responder"><ResponderTeam /></ProtectedRoute>} />

          {/* ── Convenience redirects ─────────────────────────────────────── */}
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/report"
            element={user
              ? <Navigate to="/citizen/report" replace />
              : <Navigate to="/" replace />}
          />
          <Route path="/safetytips" element={<Navigate to="/citizen/safetytips" replace />} />

          {/* ── Catch-all ─────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </HashRouter>
  );
}