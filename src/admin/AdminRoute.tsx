import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";

const AR_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Instrument+Sans:wght@400;500&display=swap');

  .ar-checking {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Sans', sans-serif;
    background: #0b0f1a;
  }
  .ar-checking-inner {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    text-align: center;
  }
  .ar-shield {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(46,204,143,.1);
    border: 1px solid rgba(46,204,143,.25);
    display: flex; align-items: center; justify-content: center;
    color: #2ECC8F; font-size: 20px;
    animation: arPulse 1.8s ease infinite;
  }
  @keyframes arPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(46,204,143,.25); }
    50%      { box-shadow: 0 0 0 10px rgba(46,204,143,.0); }
  }
  .ar-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.1);
    border-top-color: #2ECC8F;
    animation: arSpin .7s linear infinite;
  }
  @keyframes arSpin { to { transform: rotate(360deg); } }
  .ar-checking-label {
    font-size: 13px; font-weight: 500; color: rgba(237,240,250,.35);
  }
  .ar-checking-detail {
    font-size: 11px; color: rgba(237,240,250,.2); margin-top: 4px;
  }

  /* Error state */
  .ar-error {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Sans', sans-serif;
    background: #0b0f1a;
  }
  .ar-error-inner {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    text-align: center; max-width: 340px;
  }
  .ar-error-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(255,59,48,.1);
    border: 1px solid rgba(255,59,48,.25);
    display: flex; align-items: center; justify-content: center;
    color: #FF3B30; font-size: 20px;
  }
  .ar-error-title {
    font-size: 14px; font-weight: 500; color: #eef0f7;
  }
  .ar-error-msg {
    font-size: 12px; color: rgba(237,240,250,.5); line-height: 1.5;
  }
  .ar-error-actions {
    display: flex; gap: 8px; margin-top: 8px;
  }
  .ar-error-btn {
    padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,.15);
    background: transparent; color: rgba(237,240,250,.7); font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
  }
  .ar-error-btn:hover {
    background: rgba(46,204,143,.1); border-color: rgba(46,204,143,.25); color: #2ECC8F;
  }
  .ar-error-btn.primary {
    background: rgba(46,204,143,.1); border-color: #2ECC8F; color: #2ECC8F;
  }
  .ar-error-btn.primary:hover {
    background: rgba(46,204,143,.2);
  }
`;

type AuthState = "checking" | "authorized" | "unauthorized" | "error";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const checkRole = async () => {
    try {
      setError(null);

      // ── Step 1: Check if user is authenticated ──
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication check failed: ${authError.message}`);
      }

      if (!user) {
        setAuthState("unauthorized");
        return;
      }

      // ── Step 2: Fetch user profile and check role ──
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error(`Profile fetch failed: ${profileError.message}`);
      }

      // ── Step 3: Verify admin role ──
      if (profile?.role === "admin") {
        setAuthState("authorized");
      } else {
        setAuthState("unauthorized");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setAuthState("error");
    }
  };

  useEffect(() => {
    checkRole();
  }, []);

  // ── Retry handler ──
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setAuthState("checking");
      checkRole();
    } else {
      setError("Max retries reached. Please refresh the page or contact support.");
    }
  };

  // ── Logout handler for unauthorized users ──
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // React Router will handle redirect to /login
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ── Checking state ──
  if (authState === "checking") {
    return (
      <>
        <style>{AR_STYLE}</style>
        <div className="ar-checking">
          <div className="ar-checking-inner">
            <div className="ar-shield">
              <FaShieldAlt />
            </div>
            <div className="ar-spinner" />
            <div className="ar-checking-label">Verifying admin access…</div>
            {retryCount > 0 && (
              <div className="ar-checking-detail">Attempt {retryCount} of {maxRetries}</div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Error state ──
  if (authState === "error") {
    return (
      <>
        <style>{AR_STYLE}</style>
        <div className="ar-error">
          <div className="ar-error-inner">
            <div className="ar-error-icon">
              <FaExclamationTriangle />
            </div>
            <div className="ar-error-title">Authentication Error</div>
            <div className="ar-error-msg">
              {error || "Unable to verify your admin access. Please try again."}
            </div>
            <div className="ar-error-actions">
              {retryCount < maxRetries && (
                <button className="ar-error-btn primary" onClick={handleRetry}>
                  Retry
                </button>
              )}
              <button className="ar-error-btn" onClick={() => window.location.reload()}>
                Refresh
              </button>
              <button className="ar-error-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Unauthorized state ──
  if (authState === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  // ── Authorized state ──
  return <>{children}</>;
}