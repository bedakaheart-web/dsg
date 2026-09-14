// src/citizen/components/CitizenChatPage.tsx
// Chat page for citizens — shows assigned responder chat.
// Uses the ChatBox component with the citizen's assigned responder ID.

import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { supabase } from "../../js/supabase";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../components/ChatBox";

export default function CitizenChatPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [assignedResponderId, setAssignedResponderId] = useState<string | null>(null);
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noResponder, setNoResponder] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }

        // Role check uses the flat profiles.role column.
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if ((profile?.role as string)?.toLowerCase() !== "citizen") {
          navigate("/citizen/dashboard");
          return;
        }

        // Source of truth for assignment: the citizen's active report
        // (reports.user_id = me, reports.responder_id set, status active).
        // incident_id for chat filtering = reports.id.
        const { data: reports } = await supabase
          .from("reports")
          .select("id, responder_id, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        const active = (reports ?? []).find(r =>
          r.responder_id && (r.status === "pending" || r.status === "in-progress")
        );

        if (active?.responder_id) {
          const { data: responder } = await supabase
            .from("profiles")
            .select("id, role")
            .eq("id", active.responder_id)
            .single();

          if ((responder?.role as string)?.toLowerCase() === "responder") {
            setAssignedResponderId(active.responder_id as string);
            setIncidentId(active.id as string);
          } else {
            setNoResponder(true);
          }
        } else {
          setNoResponder(true);
        }
      } catch {
        navigate("/citizen/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "60vh", color: "rgba(238,240,247,0.35)", fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "12px", fontSize: "24px" }}>🔒</div>
          {t("chat.loading", "Loading chat...")}
        </div>
      </div>
    );
  }

  if (noResponder) {
    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        <div style={{
          marginBottom: "16px", padding: "14px 18px",
          backgroundColor: "rgba(15,21,33,0.82)",
          border: "1px solid rgba(239,91,91,0.2)",
          borderRadius: "12px", borderLeft: "3px solid #EF5B5B",
        }}>
          <div style={{ fontSize: "10px", color: "#EF5B5B", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
            {t("chat.noResponder", "No Responder")}
          </div>
          <div style={{ fontSize: "13px", color: "rgba(238,240,247,0.65)" }}>
            {t("chat.noResponder", "No assigned responder found. File a report and wait for a responder to claim it to start chatting.")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      {/* Role-based header */}
      <div style={{
        marginBottom: "16px", padding: "14px 18px",
        backgroundColor: "rgba(15,21,33,0.82)",
        border: "1px solid rgba(46,204,143,0.15)",
        borderRadius: "12px", borderLeft: "3px solid #2ECC8F",
      }}>
        <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
          {t("chat.secureChannel", "Secure Channel")}
        </div>
        <div style={{ fontSize: "13px", color: "rgba(238,240,247,0.65)", fontWeight: "500" }}>
          {t("chat.citizenNote", "Your messages are encrypted and shared only with your assigned responder.")}
        </div>
      </div>

      <ChatBox assignedResponderId={assignedResponderId} incidentId={incidentId} userRole="citizen" />
    </div>
  );
}
