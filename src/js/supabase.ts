
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mulpurkwsadxohfpbcsu.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bHB1cmt3c2FkeG9oZnBiY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Njg2MTEsImV4cCI6MjA5MDM0NDYxMX0.a2IiLRTojN87mpty8CqCWAnHblqynX65NbIWPmWoYQE";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Clear stale refresh tokens faster
      flowType: 'pkce',
    },
  }
);

// Auto-clear invalid refresh tokens to prevent infinite 400 loop / black screen
// Supabase will emit SIGNED_OUT when refresh fails, but localStorage may retain
// the stale token and cause repeated 400s on next reload.
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      try {
        // Remove only Supabase auth keys, keep other app keys
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('sb-') && k.includes('-auth-token')) {
            localStorage.removeItem(k);
          }
        });
      } catch {}
    }
  });
  // Also listen for unhandled refresh errors via window error
  window.addEventListener('unhandledrejection', (ev: any) => {
    const msg = String(ev?.reason?.message ?? ev?.reason ?? '');
    if (/Invalid Refresh Token|Refresh Token Not Found/i.test(msg)) {
      try { supabase.auth.signOut(); } catch {}
    }
  });
}