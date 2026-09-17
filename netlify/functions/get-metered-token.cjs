exports.handler = async function (event) {
  const secretKey = process.env.METERED_SECRET_KEY;
  if (!secretKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "METERED_SECRET_KEY not configured" }) };
  }

  try {
    const { roomId, participantId } = JSON.parse(event.body || "{}");
    if (!roomId) {
      return { statusCode: 400, body: JSON.stringify({ error: "roomId is required" }) };
    }

    const domain = process.env.VITE_METERED_DOMAIN || "dumasafeguide.metered.live";

    // Call Metered REST API to create a room (which generates a token)
    const response = await fetch(`https://${domain}/api/v1/room/`, {
      method: "POST",
      params: { secretKey },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Metered room creation failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ roomId: data.roomName || roomId, domain, ...data }),
    };
  } catch (err) {
    console.error("[get-metered-token] Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate Metered token" }) };
  }
};
