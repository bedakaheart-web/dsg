// src/components/ChatPage.tsx
// Universal chat page — handles role-based routing logic:
//   Citizen → sees assigned Responder chat
//   Responder → sees list of Admins to chat with
//   Admin → sees list of Responders to chat with

import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../js/supabase";
import { useNavigate } from "react-router-dom";
import ChatBox from "./Chatbox";

export default function ChatPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        let r: string | null = (user.user_metadata?.role as string) ?? null;
        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (prof?.role) r = (prof.role as string).toLowerCase();
        } catch {}
        setUserId(user.id);
        setUserRole(r);
      } catch { navigate("/login"); }
    })();
  }, [navigate]);

  // Load participants based on role (flat profiles schema).
  // Citizen → assigned responder only (via active report; never admins).
  // Responder → admins only. Admin → responders only.
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        let myRole: string | null = (user.user_metadata?.role as string) ?? null;
        try {
          const { data: me } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (me?.role) myRole = (me.role as string).toLowerCase();
        } catch {}
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .order("created_at", { ascending: true });
        if (!profiles) { setLoading(false); return; }
        const rows = profiles as { id: string; email: string; full_name?: string; role?: string }[];
        let filtered: { id: string; name: string; email: string }[] = [];
        if (myRole === "citizen") {
          // Active incident drives both recipient and incident filter.
          const { data: reports } = await supabase
            .from("reports")
            .select("id, responder_id, status")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);
          const active = (reports ?? []).find(r =>
            r.responder_id && (r.status === "pending" || r.status === "in-progress")
          );
          const target = active
            ? rows.find(p => p.id === active.responder_id && (p.role ?? "").toLowerCase() === "responder")
            : undefined;
          if (target && active) {
            setRecipientId(target.id);
            setIncidentId(active.id as string);
            filtered = [{ id: target.id, name: target.full_name ?? target.email, email: target.email }];
          } else {
            setRecipientId(null);
            setIncidentId(null);
            filtered = [];
          }
        } else if (myRole === "responder") {
          filtered = rows
            .filter(p => (p.role ?? "").toLowerCase() === "admin")
            .map(p => ({ id: p.id, name: p.full_name ?? p.email, email: p.email }));
          if (filtered[0] && !recipientId) setRecipientId(filtered[0].id);
        } else if (myRole === "admin") {
          filtered = rows
            .filter(p => (p.role ?? "").toLowerCase() === "responder")
            .map(p => ({ id: p.id, name: p.full_name ?? p.email, email: p.email }));
          if (filtered[0] && !recipientId) setRecipientId(filtered[0].id);
        }
        setParticipants(filtered);
      } catch {} finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // If citizen without a specific recipient, redirect to dashboard
  useEffect(() => {
    if (userRole === "citizen" && !recipientId && !loading) {
      navigate("/citizen/dashboard");
    }
  }, [userRole, recipientId, loading]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "rgba(238,240,247,0.35)", fontSize: "13px" }}>
        {t("chat.loading", "Loading chat...")}
      </div>
    );
  }

  if (userRole === "citizen" && !recipientId) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "rgba(238,240,247,0.35)", fontSize: "13px" }}>
        {t("chat.noResponder", "No assigned responder found.")}
      </div>
    );
  }

  const recipientName = participants.find(p => p.id === recipientId)?.name ?? "";

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Role-based info bar */}
      <div style={{
        marginBottom: "16px", padding: "14px 18px",
        backgroundColor: "rgba(15,21,33,0.82)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px", borderLeft: "3px solid #2ECC8F",
      }}>
        <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
          {t("chat.secureChannel", "Secure Channel")}
        </div>
        <div style={{ fontSize: "13px", color: "rgba(238,240,247,0.65)" }}>
          {userRole === "citizen" && t("chat.citizenNote", "Messages are shared only with your assigned responder.")}
          {userRole === "responder" && t("chat.responderNote", "Chat directly with administrators.")}
          {userRole === "admin" && t("chat.adminNote", "Chat directly with responders.")}
        </div>
      </div>

      <ChatBox assignedResponderId={recipientId} incidentId={incidentId} userRole={userRole ?? undefined} />
    </div>
  );
}
