// src/components/dispatch/geo.ts
//
// Shared geography helpers for the Admin + Responder dispatch maps.
// Single source of truth so both views compute positions identically.

export type LatLng = [number, number];

/** Dumaguete City Hall: map fallback center + dispatch start point. */
export const HQ_POS: LatLng = [9.3077, 123.3054];

/** Parse a "lat,lng" location string. Null when absent or malformed. */
export function parseCoords(loc: string | null | undefined): LatLng | null {
  if (!loc) return null;
  const parts = loc.split(",").map(s => parseFloat(s.trim()));
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
  if (parts[0] < -90 || parts[0] > 90 || parts[1] < -180 || parts[1] > 180) return null;
  return [parts[0], parts[1]];
}

export function hasCoords(loc: string | null | undefined): boolean {
  return parseCoords(loc) !== null;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const h = s1 * s1 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Straight-line interpolated path (fallback when OSRM routing is unreachable). */
export function interpolateRoute(from: LatLng, to: LatLng, segments = 64): LatLng[] {
  const pts: LatLng[] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    pts.push([from[0] + (to[0] - from[0]) * f, from[1] + (to[1] - from[1]) * f]);
  }
  return pts;
}

export function routeLengthKm(path: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) total += haversineKm(path[i - 1], path[i]);
  return total;
}

/** Human ETA: "4 mins" / "1h 5m" / "<1 min". */
export function formatEta(etaMin: number): string {
  if (etaMin < 1) return "<1 min";
  if (etaMin < 60) return `${Math.ceil(etaMin)} mins`;
  return `${Math.floor(etaMin / 60)}h ${Math.round(etaMin % 60)}m`;
}

/** Human distance: "350 m" / "1.4 km". */
export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
