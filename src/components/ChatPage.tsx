// src/components/ChatPage.tsx
// Universal chat page — handles role-based routing logic:
//   Citizen → sees assigned Responder chat
//   Responder → sees list of Admins to chat with
//   Admin → sees list of Responders to chat with

import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../js/supabase";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";

export default function ChatPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        setUserId(user.id);
        setUserRole(user.user_metadata?.role);
      } catch { navigate("/login"); }
    })();
  }, [navigate]);

  // Load participants based on role
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const myRole = user.user_metadata?.role;
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, user_metadata")
          .order("created_at", { ascending: true });
        if (!profiles) return;
        let filtered: { id: string; name: string; email: string }[] = [];
        if (myRole === "citizen") {
          const responders = profiles.filter(p => p.user_metadata?.role === "responder");
          // Citizens chat with their assigned responder
          const assigned = user.user_metadata?.assigned_responder_id;
          const targetResponder = assigned
            ? profiles.find(p => p.id === assigned)
            : responders[0];
          if (targetResponder) {
            setRecipientId(targetResponder.id);
            filtered = [targetResponder];
          }
        } else if (myRole === "responder") {
          filtered = profiles
            .filter(p => p.user_metadata?.role === "admin")
            .map(p => ({ id: p.id, name: p.user_metadata?.full_name ?? p.email, email: p.email }));
        } else if (myRole === "admin") {
          filtered = profiles
            .filter(p => p.user_metadata?.role === "responder")
            .map(p => ({ id: p.id, name: p.user_metadata?.full_name ?? p.email, email: p.email }));
        }
        setParticipants(filtered);
      } catch {}
    })();
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

      <ChatBox assignedResponderId={recipientId} userRole={userRole ?? undefined} />
    </div>
  );
}
