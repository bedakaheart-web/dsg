import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './js/supabase';

const Homepage        = lazy(() => import('./pages/Homepage'));
const Login           = lazy(() => import('./pages/Login'));
const Signup          = lazy(() => import('./pages/Signup'));
const ForgotPassword  = lazy(() => import('./pages/ForgotPassword'));
const Directory       = lazy(() => import('./pages/Directory'));
const Map             = lazy(() => import('./pages/Map'));
const IncidentAlerts  = lazy(() => import('./pages/IncidentaAlerts'));

const Dispatch            = lazy(() => import('./responder/Dispatch'));
const IncidentsPage       = lazy(() => import('./responder/IncidentsPage'));
const ResponderAlertsPage = lazy(() => import('./responder/ResponderAlertsPage'));
const RespondersDashboard = lazy(() => import('./responder/RespondersDashboard'));
const ResponderTeam       = lazy(() => import('./responder/ResponderTeam'));

const CitizenDashboard   = lazy(() => import('./citizen/CitizenDashboard'));
const CitizenHistoryPage = lazy(() => import('./citizen/CitizenHistoryPage'));
const CitizenAlertsPage  = lazy(() => import('./citizen/CitizenAlertsPage'));
const CitizenMap         = lazy(() => import('./citizen/CitizenMap'));
const CitizenSafetyTips  = lazy(() => import('./citizen/CitizenSafetyTips'));
const CitizenReportPage  = lazy(() => import('./citizen/CitizenReportPage'));
const CitizenDirectory   = lazy(() => import('./citizen/CitizenDirectory'));
const CitizenResources   = lazy(() => import('./citizen/CitizenResources'));

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#080c14', color: '#eef0f7' }}>
    Loading...
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
          <Route path="/"                element={<Homepage />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/directory"       element={<Directory />} />
          <Route path="/map"             element={<Map />} />
          <Route path="/incident-alerts" element={<IncidentAlerts />} />

          <Route path="/citizen/dashboard"   element={<ProtectedRoute allowedRole="citizen"><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/citizen/history"     element={<ProtectedRoute allowedRole="citizen"><CitizenHistoryPage /></ProtectedRoute>} />
          <Route path="/citizen/history/:id" element={<ProtectedRoute allowedRole="citizen"><CitizenHistoryPage /></ProtectedRoute>} />
          <Route path="/citizen/alerts"      element={<ProtectedRoute allowedRole="citizen"><CitizenAlertsPage /></ProtectedRoute>} />
          <Route path="/citizen/map"         element={<ProtectedRoute allowedRole="citizen"><CitizenMap /></ProtectedRoute>} />
          <Route path="/citizen/safetytips"  element={<ProtectedRoute allowedRole="citizen"><CitizenSafetyTips /></ProtectedRoute>} />
          <Route path="/citizen/report"      element={<ProtectedRoute allowedRole="citizen"><CitizenReportPage /></ProtectedRoute>} />
          <Route path="/citizen/directory"   element={<ProtectedRoute allowedRole="citizen"><CitizenDirectory /></ProtectedRoute>} />
          <Route path="/citizen/resources"   element={<ProtectedRoute allowedRole="citizen"><CitizenResources /></ProtectedRoute>} />

          <Route path="/responder/dispatch"  element={<ProtectedRoute allowedRole="responder"><Dispatch /></ProtectedRoute>} />
          <Route path="/responder/incidents" element={<ProtectedRoute allowedRole="responder"><IncidentsPage /></ProtectedRoute>} />
          <Route path="/responder/alerts"    element={<ProtectedRoute allowedRole="responder"><ResponderAlertsPage /></ProtectedRoute>} />
          <Route path="/responder/dashboard" element={<ProtectedRoute allowedRole="responder"><RespondersDashboard /></ProtectedRoute>} />
          <Route path="/responder/team"      element={<ProtectedRoute allowedRole="responder"><ResponderTeam /></ProtectedRoute>} />

          <Route path="/report"     element={user ? <Navigate to="/citizen/report" replace /> : <Navigate to="/login" replace />} />
          <Route path="/safetytips" element={<Navigate to="/citizen/safetytips" replace />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}