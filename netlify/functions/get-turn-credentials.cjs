exports.handler = async function () {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  try {
    const apiKey = process.env.METERED_SECRET_KEY;
    if (!apiKey) {
      console.warn("[get-turn-credentials] METERED_SECRET_KEY not set — returning STUN fallback");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([{ urls: "stun:stun.l.google.com:19302" }]),
      };
    }
    const response = await fetch(
      `https://dumasafeguide.metered.live/api/v1/turn/credentials?apiKey=${apiKey}`
    );
    if (!response.ok) {
      console.error("[get-turn-credentials] Metered API error:", response.status);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([{ urls: "stun:stun.l.google.com:19302" }]),
      };
    }
    const iceServers = await response.json();
    const servers = Array.isArray(iceServers) ? iceServers : iceServers.iceServers || [{ urls: "stun:stun.l.google.com:19302" }];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(servers),
    };
  } catch (err) {
    console.error("[get-turn-credentials] fetch failed, STUN fallback:", err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([{ urls: "stun:stun.l.google.com:19302" }]),
    };
  }
};