/**
 * Shared WebRTC helper — fetches TURN credentials from Netlify function.
 * Falls back to STUN-only if fetch fails.
 */

export async function getIceServers(): Promise<RTCIceServer[]> {
  try {
    const response = await fetch("/.netlify/functions/get-turn-credentials");
    if (!response.ok) throw new Error("Failed to fetch TURN credentials");
    const iceServers = await response.json();
    // Ensure at least one STUN is present even when TURN succeeds
    if (!iceServers.some((s: any) => JSON.stringify(s.urls).includes("stun"))) {
      iceServers.unshift({ urls: "stun:stun.l.google.com:19302" });
    }
    return iceServers as RTCIceServer[];
  } catch (err) {
    console.error("Falling back to STUN only:", err);
    // Multiple STUNs for better NAT traversal on localhost/mobile
    return [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ];
  }
}
