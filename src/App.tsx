// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './pages/Layout';

// ── Public Pages ───────────────────────────────────────────────
const Homepage           = lazy(() => import('./pages/Homepage'));
const Login              = lazy(() => import('./pages/Login'));
const Signup             = lazy(() => import('./pages/Signup'));
const ForgotPassword     = lazy(() => import('./pages/Forgotpassword'));
const Directory          = lazy(() => import('./pages/Directory'));
const Map                = lazy(() => import('./pages/Map'));
const Report             = lazy(() => import('./pages/Report'));
const IncidentAlerts     = lazy(() => import('./pages/Incidentalerts'));
const AboutDumaSafeGuide = lazy(() => import('./pages/AboutDumaSafeGuide'));
const PartnerAgencies    = lazy(() => import('./pages/PartnerAgencies'));
const PrivacyPolicy      = lazy(() => import('./pages/PrivacyPolicy'));
const Resources          = lazy(() => import('./pages/Resources'));
const SafetyTips         = lazy(() => import('./pages/SafetyTips'));
const TermsOfService     = lazy(() => import('./pages/TermsOfService'));
const TermsOfUse         = lazy(() => import('./pages/TermsOfUse'));

// ── Citizen-scoped pages ───────────────────────────────────────
const CitizenMap         = lazy(() => import('./citizen/CitizenMap'));
const CitizenDirectory   = lazy(() => import('./citizen/CitizenDirectory'));
const CitizenSafetyTips  = lazy(() => import('./citizen/CitizenSafetyTips'));
const CitizenAbout       = lazy(() => import('./citizen/CitizenAbout'));
const CitizenReport      = lazy(() => import('./citizen/CitizenReport'));
const CitizenDashboard   = lazy(() => import('./citizen/CitizenDashboard'));
const CitizenAlertsPage  = lazy(() => import('./citizen/CitizenAlertsPage'));
const CitizenHistory     = lazy(() => import('./citizen/CitizenHistory'));
const CitizenReportDetail = lazy(() => import('./citizen/CitizenReportDetail'));

// ── Admin ──────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));

// ── Responder ──────────────────────────────────────────────────
const RespondersDashboard = lazy(() => import('./responder/Respondersdashboard'));
const ResponderAlertsPage = lazy(() => import('./responder/Responderalertspage'));
const ResponderTeamPage   = lazy(() => import('./responder/Responderteam'));
const Dispatch            = lazy(() => import('./responder/Dispatch'));
const ResponderIncidents  = lazy(() => import('./responder/IncidentsPage'));

export default function App() {
  return (
    <BrowserRouter
      basename="/dumasafeguide"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
        <Routes>

          {/* ── PUBLIC — Global Navbar + Footer ──────────────── */}
          <Route element={<Layout />}>
            <Route path="/"                 element={<Homepage />} />
            <Route path="/directory"        element={<Directory />} />
            <Route path="/report"           element={<Report />} />
            <Route path="/incident-alerts"  element={<IncidentAlerts />} />
            <Route path="/about"            element={<AboutDumaSafeGuide />} />
            <Route path="/partner-agencies" element={<PartnerAgencies />} />
            <Route path="/resources"        element={<Resources />} />
            <Route path="/safetytips"       element={<SafetyTips />} />
            <Route path="/terms-of-use"     element={<TermsOfUse />} />
            <Route path="/map"              element={<Map />} />
            <Route path="/privacy"          element={<PrivacyPolicy />} />
            <Route path="/terms"            element={<TermsOfService />} />
          </Route>

          {/* ── STANDALONE ───────────────────────────────────── */}
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── ADMIN portal ─────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* ── CITIZEN portal ───────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRole="citizen" />}>
            <Route element={<Layout />}>
              <Route path="/citizen/dashboard"   element={<CitizenDashboard />} />
              <Route path="/citizen/alerts"      element={<CitizenAlertsPage />} />
              <Route path="/citizen/history"     element={<CitizenHistory />} />
              <Route path="/citizen/history/:id" element={<CitizenReportDetail />} />
              <Route path="/citizen/map"         element={<CitizenMap />} />
              <Route path="/citizen/directory"   element={<CitizenDirectory />} />
              <Route path="/citizen/safetytips"  element={<CitizenSafetyTips />} />
              <Route path="/citizen/about"       element={<CitizenAbout />} />
              <Route path="/citizen/report"      element={<CitizenReport />} />
            </Route>
          </Route>

          {/* ── RESPONDER portal ─────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRole="responder" />}>
            <Route path="/responder/dashboard"  element={<RespondersDashboard />} />
            <Route path="/responder/alerts"     element={<ResponderAlertsPage />} />
            <Route path="/responder/team"       element={<ResponderTeamPage />} />
            <Route path="/responder/dispatch"   element={<Dispatch />} />
            <Route path="/responder/incidents"  element={<ResponderIncidents />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}