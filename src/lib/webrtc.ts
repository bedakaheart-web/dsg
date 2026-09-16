/**
 * Shared WebRTC helper — fetches TURN credentials from Netlify function.
 * Falls back to STUN-only if fetch fails.
 */

export async function getIceServers(): Promise<RTCIceServer[]> {
  try {
    const response = await fetch("/.netlify/functions/get-turn-credentials");
    if (!response.ok) throw new Error("Failed to fetch TURN credentials");
    const iceServers = await response.json();
    return iceServers as RTCIceServer[];
  } catch (err) {
    console.error("Falling back to STUN only:", err);
    return [{ urls: "stun:stun.l.google.com:19302" }];
  }
}
