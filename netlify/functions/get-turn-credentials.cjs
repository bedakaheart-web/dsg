exports.handler = async function () {
  const response = await fetch(
    `https://dumasafeguide.metered.live/api/v1/turn/credentials?apiKey=${process.env.METERED_SECRET_KEY}`
  );
  const iceServers = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(iceServers),
  };
};