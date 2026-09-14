// src/components/ChatBox.tsx
// Role-based chat component with image attachment support.
// Citizens see their assigned Responder chat; Responders and Admins
// see direct chat with each other.

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../js/supabase";
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

  // ── Fetch user info (flat profiles schema: role column) ──
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        userIdRef.current = session.user.id;
        let r: string | undefined = session.user.user_metadata?.role;
        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          if (prof?.role) r = prof.role as string;
        } catch {}
        setUser({ id: session.user.id, email: session.user.email ?? "", role: r });
      } catch {}
    })();
  }, []);

  // ── Load participants (flat profiles schema; strict role lists) ──
  // Citizen → responders only (never admins). Responder → admins only.
  // Admin → responders only.
  useEffect(() => {
    (async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;
        let myRole: string | undefined = u.user_metadata?.role;
        try {
          const { data: me } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", u.id)
            .single();
          if (me?.role) myRole = me.role as string;
        } catch {}
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .order("created_at", { ascending: true });
        if (!profiles) return;
        const filtered = (profiles as ChatParticipant[]).filter(p => {
          const r = (p.role ?? "").toLowerCase();
          if (myRole === "citizen") return r === "responder";
          if (myRole === "responder") return r === "admin";
          if (myRole === "admin") return r === "responder";
          return false;
        });
        setParticipants(filtered);
      } catch {}
    })();
  }, []);

  // ── Build query for chat_messages with role-based enforcement ──
  // Citizen: strict 1-on-1 pair (me ↔ assigned responder) + active incident_id.
  // Responder/Admin: own threads only (sender or recipient = me); RLS enforces.
  const buildChatQuery = useCallback((userId: string) => {
    let query = supabase.from("chat_messages").select("*");
    if (isCitizen && recipientId && incidentId) {
      query = query
        .or(
          `and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),` +
          `and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`
        )
        .eq("incident_id", incidentId);
    } else if (isCitizen && recipientId) {
      query = query.or(
        `and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),` +
        `and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`
      );
    } else if (isCitizen) {
      query = query.eq("sender_id", userId);
    } else {
      query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
    }
    return query.order("created_at", { ascending: true });
  }, [isCitizen, recipientId, incidentId]);

  // ── Load messages & subscribe ──
  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) { setLoading(false); return; }
        userIdRef.current = u.id;

        const query = buildChatQuery(u.id);
        const { data, error } = await query;
        if (!cancelled) {
          if (error) {
            const missing =
              (error as { code?: string }).code === "PGRST205" ||
              /does not exist|not found|404|chat_messages/i.test(error.message ?? "");
            if (missing) {
              console.warn("[ChatBox] `chat_messages` table unavailable — create it via supabase migration (see supabase/migrations/*_create_chat_messages.sql).");
            }
            setMessages([]);
            setLoading(false);
            return;
          }
          const allMsgs = (data as ChatMessage[]) || [];
          const deduped = Array.from(new Map(allMsgs.map(m => [m.id, m])).values());
          setMessages(deduped.slice(-MAX_VISIBLE_MESSAGES));
          setLoading(false);
        }
      } catch { if (!cancelled) setLoading(false); }
    };
    loadMessages();

    const channel = supabase
      .channel("chat-messages-realtime")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (!cancelled) {
            // Role-based filtering for real-time messages (mirror the query).
            const me = userIdRef.current;
            if (isCitizen && recipientId) {
              const inPair =
                (newMsg.sender_id === me && newMsg.recipient_id === recipientId) ||
                (newMsg.sender_id === recipientId && newMsg.recipient_id === me);
              if (!inPair) return;
              if (incidentId && newMsg.incident_id !== incidentId) return;
            } else if (newMsg.sender_id !== me && newMsg.recipient_id !== me) {
              return;
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

      // Strict role-based enforcement at query level (flat profiles schema).
      // Citizen → responder only (never admin). Responder → admin only.
      // Admin → responder only.
      const { data: { user: me } } = await supabase.auth.getUser();
      let myRole: string | undefined = session.user.user_metadata?.role ?? me?.user_metadata?.role;
      try {
        const { data: meProf } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (meProf?.role) myRole = (meProf.role as string).toLowerCase();
      } catch {}
      if (recipientId) {
        const { data: recipientProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", recipientId)
          .single();
        const rRole = ((recipientProfile?.role as string) ?? "").toLowerCase();
        const mRole = (myRole ?? "").toLowerCase();
        const allowed =
          (mRole === "citizen" && rRole === "responder") ||
          (mRole === "responder" && rRole === "admin") ||
          (mRole === "admin" && rRole === "responder");
        if (!allowed) {
          alert("You cannot send messages to this user.");
          setSending(false);
          return;
        }
      } else if ((myRole ?? "").toLowerCase() === "citizen") {
        alert("No assigned responder found.");
        setSending(false);
        return;
      }

      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${session.user.id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(fileName, imageFile, { cacheControl: "3600", upsert: false, contentType: imageFile.type });
        if (uploadError) {
          setUploading(false);
          setSending(false);
          const missingBucket = /not found|404|bucket|chat-images/i.test(uploadError.message ?? "");
          alert(missingBucket
            ? "Image storage is not set up yet (missing `chat-images` bucket). Your text was not sent — ask an admin to create the bucket."
            : `Image upload failed: ${uploadError.message}`);
          return;
        }
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
      if (insertError) {
        const missing =
          (insertError as { code?: string }).code === "PGRST205" ||
          /does not exist|not found|404|chat_messages/i.test(insertError.message ?? "");
        alert(missing
          ? "Chat is not set up yet (missing `chat_messages` table). Ask an admin to run the migration."
          : `Send failed: ${insertError.message}`);
        throw insertError;
      }

      setInputText("");
      setImageFile(null);
      setImagePreview(null);
      setSending(false);
    } catch {
      setSending(false);
      setUploading(false);
    }
  }, [inputText, imageFile, recipientId, incidentId, isCitizen, sending]);

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
              {((imageFile?.size ?? 0) / 1024).toFixed(0)} KB
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
