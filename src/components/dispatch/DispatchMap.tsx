// src/components/dispatch/DispatchMap.tsx
//
// Shared Leaflet map shell for the Admin + Responder dispatch views:
// identical tile provider, sizing, marker factories, follow-mode controller,
// and HUD overlay shell. Pages compose markers/routes/HUD content via props
// and keep their own panel chrome + styles.

import { useEffect, useRef, type ReactNode } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLng } from "./geo";
import { HQ_POS, haversineKm } from "./geo";

export const INCIDENT_HEX: Record<string, string> = {
  fire: "#FF6B6B",
  accident: "#F5C842",
  flood: "#5B8DEF",
  crime: "#FF9F43",
  medical: "#2ECC8F",
  other: "#8fa3be",
};

export function incidentPin(color: string, selected = false): L.DivIcon {
  const size = selected ? 44 : 30;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};display:flex;align-items:center;justify-message:center;font-size:${selected ? 18 : 14}px;border:${selected ? 3 : 2}px solid #0d1117;box-shadow:0 2px 12px rgba(0,0,0,.5);">📍</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function unitPin(heading: number | null): L.DivIcon {
  const rot = heading != null && !isNaN(heading) ? `rotate(${heading}deg)` : "";
  return L.divIcon({
    className: "",
    html: `<div style="width:38px;height:38px;border-radius:9999px;background:#0066FF;display:flex;align-items:center;justify-message:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 16px rgba(0,0,0,.5),0 0 0 4px rgba(0,102,255,.35);"><span style="display:inline-block;${rot ? `transform:${rot};` : ""}">🚑</span></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

// Keeps the view glued to a moving position while follow mode is on.
// Pans only after >20 m of movement so high-frequency ticks don't jitter.
export function MapFollow({ pos, follow, recenterTick }: {
  pos: LatLng | null; follow: boolean; recenterTick: number;
}) {
  const map = useMap();
  const lastTick = useRef(recenterTick);
  const lastPan = useRef<LatLng | null>(null);
  useEffect(() => {
    if (!pos) return;
    if (recenterTick !== lastTick.current) {
      lastTick.current = recenterTick;
      lastPan.current = pos;
      map.flyTo(pos, Math.max(map.getZoom(), 15), { duration: 1.2 });
    } else if (follow) {
      const last = lastPan.current;
      const movedM = last ? haversineKm(last, pos) * 1000 : Infinity;
      if (movedM > 20) {
        lastPan.current = pos;
        map.panTo(pos, { animate: true });
      }
    }
  }, [map, pos, follow, recenterTick]);
  return null;
}

interface DispatchMapProps {
  center?: LatLng;
  zoom?: number;
  height?: number;
  children?: ReactNode;
  /** Floating HUD overlay content (non-interactive shell; buttons opt back in). */
  hud?: ReactNode;
}

export default function DispatchMap({ center = HQ_POS, zoom = 14, height = 560, hud, children }: DispatchMapProps) {
  return (
    <>
      <style>{`
        .dm-wrap { width: 100%; height: ${height}px; position: relative; border-radius: 8px; overflow: hidden; }
        .dm-wrap .leaflet-container { width: 100%; height: 100%; background: #0d1117; touch-action: pan-x pan-y; }
        .dm-hud { position: absolute; top: 12px; left: 12px; right: 12px; z-index: 600; display: flex; justify-message: flex-start; pointer-events: none; }
        .dm-hud > * { pointer-events: none; }
        .dm-hud button, .dm-hud a { pointer-events: auto; }
        @media (max-width: 768px) {
          .dm-wrap { height: 380px; }
        }
      `}</style>
      <div className="dm-wrap">
        <MapContainer center={center} zoom={zoom} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {children}
        </MapContainer>
        {hud && <div className="dm-hud">{hud}</div>}
      </div>
    </>
  );
}
