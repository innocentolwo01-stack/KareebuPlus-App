const photonBase = (process.env.EXPO_PUBLIC_PHOTON_BASE_URL || 'https://photon.komoot.io').replace(/\/$/, '');
const valhallaBase = (process.env.EXPO_PUBLIC_VALHALLA_BASE_URL || 'https://valhalla1.openstreetmap.de').replace(/\/$/, '');
const clientId = process.env.EXPO_PUBLIC_VALHALLA_CLIENT_ID || 'kareebu-plus-dev';

async function main() {
  console.log('Testing Photon search…');
  const photonUrl = new URL(`${photonBase}/api`);
  photonUrl.searchParams.set('q', 'Acacia Mall');
  photonUrl.searchParams.set('countrycode', 'UG');
  photonUrl.searchParams.set('lat', '0.3476');
  photonUrl.searchParams.set('lon', '32.5825');
  photonUrl.searchParams.set('limit', '3');
  const photonResponse = await fetch(photonUrl);
  if (!photonResponse.ok) throw new Error(`Photon failed: HTTP ${photonResponse.status}`);
  const photon = await photonResponse.json();
  const first = photon.features?.[0];
  console.log(`Photon OK: ${first?.properties?.name || 'search returned no matching POI'}`);

  for (const costing of ['auto', 'motorcycle']) {
    console.log(`Testing Valhalla ${costing} route…`);
    const response = await fetch(`${valhallaBase}/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Client-Id': clientId },
      body: JSON.stringify({
        locations: [
          { lat: 0.3476, lon: 32.5825 },
          { lat: 0.3185, lon: 32.5810 },
        ],
        costing,
        units: 'kilometers',
        shape_format: 'polyline6',
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.trip?.summary) throw new Error(`Valhalla ${costing} failed: ${data.error || data.status_message || response.status}`);
    console.log(`Valhalla ${costing} OK: ${Number(data.trip.summary.length || 0).toFixed(1)} km, ${Math.round(Number(data.trip.summary.time || 0) / 60)} min`);
  }

  console.log('Open maps stack is reachable.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
