import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../js/supabase";

const ROLE_HOME: Record<string, string> = {
  citizen:   "/citizen/dashboard",
  responder: "/responder/dashboard",
  admin:     "/admin/dashboard",
};

interface Props {
  children: React.ReactElement;
  allowedRole?: "citizen" | "responder" | "admin";
}

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "wrong_role"; actualRole: string }
  | { status: "authorized" };

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    // Fetch profile with up to 3 retries — guards against the race where
    // the session is committed but the profile row isn't readable yet.
    const fetchRole = async (userId: string): Promise<string | null> => {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 600 * attempt));
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();
        if (!error && data?.role) return (data.role as string).trim().toLowerCase();
      }
      return null;
    };

    const resolve = async (userId: string | null) => {
      if (cancelled) return;

      if (!userId) {
        setAuthState({ status: "unauthenticated" });
        return;
      }

      // No role restriction — just confirm they're logged in.
      if (!allowedRole) {
        setAuthState({ status: "authorized" });
        return;
      }

      const role = await fetchRole(userId);
      if (cancelled) return;

      if (!role) {
        // Couldn't read profile after retries — send back to home/login.
        setAuthState({ status: "unauthenticated" });
        return;
      }

      if (role === allowedRole) {
        setAuthState({ status: "authorized" });
      } else {
        setAuthState({ status: "wrong_role", actualRole: role });
      }
    };

    // Use onAuthStateChange so we catch the session whether it was already
    // present (INITIAL_SESSION) or was just written (SIGNED_IN).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip transient events that fire during token refresh etc.
        if (event !== "INITIAL_SESSION" && event !== "SIGNED_IN") return;
        resolve(session?.user?.id ?? null);
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [allowedRole]);

  // ── Loading spinner ───────────────────────────────────────────────────────
  if (authState.status === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080c14",
        gap: 10,
        fontFamily: "sans-serif",
        color: "rgba(237,240,250,.35)",
        fontSize: 13,
      }}>
        <span style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "2px solid rgba(46,204,143,.2)",
          borderTopColor: "#2ECC8F",
          display: "inline-block",
          animation: "pr-spin .7s linear infinite",
        }} />
        Verifying access…
        <style>{`@keyframes pr-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Not logged in → go to homepage (which holds the login form) ───────────
  if (authState.status === "unauthenticated") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ── Wrong role → redirect to that role's own dashboard ───────────────────
  if (authState.status === "wrong_role") {
    const home = ROLE_HOME[authState.actualRole] ?? "/";
    return <Navigate to={home} replace />;
  }

  return children;
}