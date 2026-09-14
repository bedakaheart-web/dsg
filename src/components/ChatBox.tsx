// src/components/ChatBox.tsx
// Role-based chat component with image attachment support.
// Citizens see their assigned Responder chat; Responders and Admins
// see direct chat with each other.

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../js/supabase";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaImage, FaTimes, FaSpinner } from "react-icons/fa";

// ── Types ────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  incident_id: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
}

interface ChatParticipant {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

// ── Constants ────────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VISIBLE_MESSAGES = 100;

// ── Helpers ──────────────────────────────────────────────────────────
function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Component ────────────────────────────────────────────────────────
export default function ChatBox({
  assignedResponderId,
  incidentId,
  userRole,
}: { assignedResponderId?: string | null; incidentId?: string | null; userRole?: string }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ChatParticipant | null>(null);
  const userIdRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const role = userRole ?? user?.role ?? "citizen";
  const isCitizen = role === "citizen";
  const recipientId = assignedResponderId ?? null;

  // ── Fetch user info ──
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        setUser({ id: session.user.id, email: session.user.email ?? "", role: session.user.user_metadata?.role });
        userIdRef.current = session.user.id;
      } catch {}
    })();
  }, []);

  // ── Load participants (for direct chat selection) ──
  useEffect(() => {
    (async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;
        const myRole = u.user_metadata?.role;
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, user_metadata")
          .order("created_at", { ascending: true });
        if (!profiles) return;
        // Citizens see only responders; responders/admins see only admins and responders
        const filtered = profiles.filter(p => {
          const role = p.user_metadata?.role;
          if (myRole === "citizen") return role === "responder";
          if (myRole === "responder") return role === "admin" || role === "responder";
          if (myRole === "admin") return role === "responder";
          return false;
        });
        setParticipants(filtered.map(p => ({
          id: p.id,
          email: p.email,
          full_name: p.user_metadata?.full_name,
          role: p.user_metadata?.role,
        })));
      } catch {}
    })();
  }, []);

  // ── Build query for chat_messages with role-based enforcement ──
  const buildChatQuery = useCallback((u: any) => {
    const myRole = u.user_metadata?.role;
    let query = supabase.from("chat_messages").select("*");

    if (isCitizen && recipientId && incidentId) {
      // Citizens can only see messages for their assigned responder + incident
      query = query
        .or(`sender_id.eq.${u.id},recipient_id.eq.${recipientId}`)
        .eq("incident_id", incidentId);
    } else if (isCitizen) {
      query = query.eq("sender_id", u.id);
    } else if (myRole === "responder") {
      // Responders see messages with admins and other responders
      query = query.or(`sender_id.eq.${u.id},recipient_id.in.(select id from profiles where user_metadata->>'role' in ('admin','responder'))`);
    } else if (myRole === "admin") {
      // Admins see messages with responders
      query = query.or(`sender_id.eq.${u.id},recipient_id.in.(select id from profiles where user_metadata->>'role' = 'responder')`);
    }
    return query.order("created_at", { ascending: true });
  }, [isCitizen, recipientId, incidentId]);

  // ── Load messages & subscribe ──
  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;

        const query = buildChatQuery(u);
        const { data } = await query;
        if (!cancelled) {
          const allMsgs = (data as ChatMessage[]) || [];
          const deduped = Array.from(new Map(allMsgs.map(m => [m.id, m])).values());
          setMessages(deduped.slice(-MAX_VISIBLE_MESSAGES));
          setLoading(false);
        }
      } catch {}
    };
    loadMessages();

    const channel = supabase
      .channel("chat-messages-realtime")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (!cancelled) {
            // Role-based filtering for real-time messages
            if (isCitizen && recipientId && incidentId) {
              if (newMsg.recipient_id !== recipientId && newMsg.sender_id !== userIdRef.current) return;
              if (newMsg.incident_id !== incidentId) return;
            }
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              const updated = [...prev, newMsg];
              return updated.slice(-MAX_VISIBLE_MESSAGES);
            });
          }
        }
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [recipientId, incidentId, isCitizen, buildChatQuery]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Image upload handler ──
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert(t("chat.errorWrongFormat", "Only JPEG, PNG, and WEBP images are allowed."));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert(t("chat.errorTooLarge", "Image must be under 5 MB."));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [t]);

  // ── Send message ──
  const sendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !imageFile) || sending) return;
    try {
      setSending(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Permission enforcement: citizens can only message responders
      if (recipientId) {
        const { data: recipientProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", recipientId)
          .single();
        if (recipientProfile?.role !== "responder") {
          alert("You cannot send messages to this user.");
          setSending(false);
          return;
        }
      }

      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(fileName, imageFile, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from("chat-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
        setUploading(false);
      }

      const { error: insertError } = await supabase
        .from("chat_messages")
        .insert({
          sender_id: session.user.id,
          recipient_id: recipientId,
          incident_id: isCitizen ? incidentId : null,
          content: inputText.trim(),
          image_url: imageUrl,
        });
      if (insertError) throw insertError;

      setInputText("");
      setImageFile(null);
      setImagePreview(null);
      setSending(false);
    } catch {
      setSending(false);
      setUploading(false);
    }
  }, [inputText, imageFile, recipientId, sending]);

  // ── Role-based warning ──
  const recipientName = useMemo(() => {
    const p = participants.find(p => p.id === recipientId);
    return p?.full_name ?? p?.email ?? "";
  }, [participants, recipientId]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 200px)",
      minHeight: "400px",
      backgroundColor: "rgba(15,21,33,0.95)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
      color: "#eef0f7",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: "rgba(8,12,20,0.6)", flexShrink: 0,
      }}>
        <div style={{
          width: "36px", height: "36px", minWidth: "36px",
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "12px", fontWeight: "700",
          backgroundColor: "rgba(46,204,143,0.15)", color: "#2ECC8F",
          border: "1px solid rgba(46,204,143,0.3)",
        }}>
          {recipientName ? getInitials(recipientName) : "?"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: "700" }}>
            {recipientName || t("chat.chatWith", "Chat")}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(238,240,247,0.35)" }}>
            {t("chat.online", "Online")}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: "10px",
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(238,240,247,0.35)" }}>
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> {t("chat.loading", "Loading messages...")}
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(238,240,247,0.35)", fontSize: "12px" }}>
            {t("chat.noMessages", "No messages yet. Start a conversation!")}
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === user?.id;
            return (
              <div key={msg.id} style={{
                display: "flex", justifyContent: isMine ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "75%", padding: "10px 14px",
                  borderRadius: "14px", fontSize: "13px", lineHeight: "1.5",
                  backgroundColor: isMine ? "rgba(46,204,143,0.15)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isMine ? "rgba(46,204,143,0.25)" : "rgba(255,255,255,0.07)"}`,
                  wordBreak: "break-word",
                }}>
                  {msg.image_url && (
                    <a href={msg.image_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "6px", borderRadius: "8px", overflow: "hidden" }}>
                      <img src={msg.image_url} alt="attachment" style={{
                        maxWidth: "100%", maxHeight: "200px",
                        borderRadius: "8px", objectFit: "cover",
                        display: "block",
                      }} loading="lazy" />
                    </a>
                  )}
                  {msg.content && <div>{msg.content}</div>}
                  <div style={{ fontSize: "9px", color: "rgba(238,240,247,0.3)", marginTop: "4px", textAlign: "right" }}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{
          padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: "rgba(8,12,20,0.6)", borderTop: "1px solid rgba(255,255,255,0.05)",
        }}>
          <img src={imagePreview} alt="Preview" style={{
            width: "50px", height: "50px", objectFit: "cover",
            borderRadius: "8px", cursor: "pointer",
          }} onClick={() => { setImagePreview(null); setImageFile(null); }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", fontWeight: "600" }}>{imageFile?.name}</div>
            <div style={{ fontSize: "9px", color: "rgba(238,240,247,0.35)" }}>
              {(imageFile?.size ?? 0 / 1024).toFixed(0)} KB
            </div>
          </div>
          <button onClick={() => { setImagePreview(null); setImageFile(null); }} style={{
            background: "none", border: "none", color: "#EF5B5B", cursor: "pointer", fontSize: "14px",
          }}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={sendMessage} style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: "rgba(8,12,20,0.6)", flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "8px", cursor: uploading ? "not-allowed" : "pointer",
            color: uploading ? "rgba(238,240,247,0.2)" : "#2ECC8F", fontSize: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: uploading ? 0.5 : 1,
          }}
          title={t("chat.attachImage", "Attach Image")}
        >
          <FaImage />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          style={{ display: "none" }}
          disabled={uploading}
        />
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={t("chat.typeMessage", "Type a message...")}
          style={{
            flex: 1, backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
            padding: "8px 14px", fontSize: "13px", color: "#eef0f7",
            outline: "none", fontFamily: "inherit",
          }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) e.preventDefault(); }}
        />
        <button
          type="submit"
          disabled={sending || uploading || (!inputText.trim() && !imageFile)}
          style={{
            background: sending || uploading ? "rgba(238,240,247,0.05)" : "rgba(46,204,143,0.15)",
            border: `1px solid ${sending || uploading ? "rgba(238,240,247,0.1)" : "rgba(46,204,143,0.3)"}`,
            borderRadius: "8px", padding: "8px 12px", cursor: sending || uploading ? "not-allowed" : "pointer",
            color: sending || uploading ? "rgba(238,240,247,0.3)" : "#2ECC8F",
            fontSize: "14px", display: "flex", alignItems: "center",
            justifyContent: "center", opacity: sending || uploading ? 0.5 : 1,
          }}
        >
          {sending ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaPaperPlane />}
        </button>
      </form>
    </div>
  );
}
