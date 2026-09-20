import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../js/supabase";

const ROLE_HOME: Record<string, string> = {
  citizen:   "/citizen/dashboard",
  responder: "/responder/dashboard",
  admin:     "/admin/dashboard",
};

type Role = "citizen" | "responder" | "admin";

interface Props {
  children: React.ReactElement;
  // Single role ("citizen"), a list (["responder", "admin"]), or a
  // comma-separated string ("citizen,responder,admin" as used by /chat).
  allowedRole?: Role | Role[] | string;
}

function normalizeRoles(allowedRole: Props["allowedRole"]): Role[] | null {
  if (!allowedRole) return null;
  const list = (Array.isArray(allowedRole) ? allowedRole : String(allowedRole).split(","))
    .map(r => r.trim().toLowerCase())
    .filter(Boolean) as Role[];
  return list.length ? list : null;
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
      const allowed = normalizeRoles(allowedRole);
      if (!allowed) {
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

      if (allowed.includes(role as Role)) {
        setAuthState({ status: "authorized" });
      } else {
        setAuthState({ status: "wrong_role", actualRole: role });
      }
    };

    // Fallback: also try getSession immediately in case onAuthStateChange
    // hasn't fired INITIAL_SESSION yet (prevents infinite "Verifying..." black screen).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      // Only resolve if we haven't already received an auth event that set state
      // Check if still loading — avoids racing but ensures we don't hang forever.
      setAuthState(prev => {
        if (prev.status !== "loading") return prev;
        // Trigger async resolve without blocking setState
        resolve(session?.user?.id ?? null);
        return prev;
      });
    });

    // Safety: if nothing resolves within 4s, force unauthenticated instead of hanging on black/loading.
    const fallbackTimer = setTimeout(() => {
      setAuthState(prev => prev.status === "loading" ? { status: "unauthenticated" } : prev);
    }, 4000);

    // Use onAuthStateChange so we catch the session whether it was already
    // present (INITIAL_SESSION) or was just written (SIGNED_IN).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // React to explicit sign-outs and remote session revocation so a
        // user can't stay stuck on a protected route after their session ends.
        if (event === "SIGNED_OUT") {
          if (cancelled) return;
          setAuthState({ status: "unauthenticated" });
          return;
        }
        // Handle initial session and sign-in; ignore transient TOKEN_REFRESHED etc.
        if (event !== "INITIAL_SESSION" && event !== "SIGNED_IN") return;
        resolve(session?.user?.id ?? null);
      }
    );

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── Wrong role → redirect to that role's own dashboard ───────────────────
  if (authState.status === "wrong_role") {
    const home = ROLE_HOME[authState.actualRole] ?? "/";
    return <Navigate to={home} replace />;
  }

  return children;
}