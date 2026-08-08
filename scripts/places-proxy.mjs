import http from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const PLACES_KEY = process.env.GOOGLE_PLACES_SERVER_API_KEY || '';
const ROUTES_KEY = process.env.GOOGLE_ROUTES_SERVER_API_KEY || PLACES_KEY;

if (!PLACES_KEY && !ROUTES_KEY) {
  console.error('Missing GOOGLE_PLACES_SERVER_API_KEY and GOOGLE_ROUTES_SERVER_API_KEY');
  process.exit(1);
}

const GOOGLE_PLACES_BASE = 'https://places.googleapis.com/v1';
const GOOGLE_ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  try {
    if (req.method === 'POST' && req.url === '/places:autocomplete') {
      if (!PLACES_KEY) return send(res, 503, { error: 'Google Places key is not configured' });
      const body = await readBody(req);
      const upstream = await fetch(`${GOOGLE_PLACES_BASE}/places:autocomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': PLACES_KEY,
          'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types,suggestions.placePrediction.distanceMeters',
        },
        body: JSON.stringify(body),
      });
      const data = await upstream.json();
      return send(res, upstream.status, data);
    }

    const detailsMatch = req.method === 'GET' && req.url?.match(/^\/places\/([^?]+)(\?.*)?$/);
    if (detailsMatch) {
      if (!PLACES_KEY) return send(res, 503, { error: 'Google Places key is not configured' });
      const placeId = decodeURIComponent(detailsMatch[1]);
      const query = detailsMatch[2] || '';
      const upstream = await fetch(`${GOOGLE_PLACES_BASE}/places/${encodeURIComponent(placeId)}${query}`, {
        headers: {
          'X-Goog-Api-Key': PLACES_KEY,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,types,viewport',
        },
      });
      const data = await upstream.json();
      return send(res, upstream.status, data);
    }

    if (req.method === 'POST' && req.url === '/routes:compute') {
      if (!ROUTES_KEY) return send(res, 503, { error: 'Google Routes key is not configured' });
      const body = await readBody(req);
      const upstream = await fetch(GOOGLE_ROUTES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': ROUTES_KEY,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
        body: JSON.stringify(body),
      });
      const data = await upstream.json();
      return send(res, upstream.status, data);
    }

    return send(res, 404, { error: 'Not found' });
  } catch (error) {
    return send(res, 500, { error: error instanceof Error ? error.message : 'Proxy error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Kareebu+ Google services proxy listening on http://0.0.0.0:${PORT}`);
  console.log(`Android emulator URL: http://10.0.2.2:${PORT}`);
});
