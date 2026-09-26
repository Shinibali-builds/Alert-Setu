import React, { useState, useEffect } from 'react';
import { OfficialEmergencyAlert } from '../../data/lastMileAlerts';
import { MapPin, AlertCircle, Compass, Layers, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface AlertMapProps {
  alert: OfficialEmergencyAlert;
}

// Map center synchronizer
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    try {
      map.setView(center, 9, { animate: true });
    } catch {
      // Map may be unmounting
    }
  }, [center, map]);
  return null;
}

export const AlertMap: React.FC<AlertMapProps> = ({ alert }) => {
  const [hasMapError, setHasMapError] = useState(false);
  const position: [number, number] = [alert.coordinates.lat, alert.coordinates.lon];

  const severityColor =
    alert.severity === 'RED'
      ? '#ef4444'
      : alert.severity === 'ORANGE'
      ? '#f97316'
      : '#eab308';

  return (
    <section className="glass-panel rounded-3xl overflow-hidden" aria-labelledby="map-heading">
      <div className="p-5 md:p-6 pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            06 / GEOSPATIAL INTELLIGENCE
          </span>
          <h2 id="map-heading" className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Affected Impact Zone Map</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300">
              OpenStreetMap (Public / Free Tier)
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => setHasMapError((prev) => !prev)}
            className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-400 hover:text-amber-300 transition-colors"
            title="Toggle graceful fallback display"
          >
            {hasMapError ? 'Restore Map Tiles' : 'Simulate Tile Failure Fallback'}
          </button>
          <div className="flex items-center gap-1.5 font-mono">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>
              {alert.coordinates.lat.toFixed(4)}°N, {alert.coordinates.lon.toFixed(4)}°E
            </span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[360px] md:h-[400px] bg-slate-950">
        {hasMapError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300">
            <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
            <h4 className="text-base font-bold text-slate-200">
              MAP TILES TEMPORARILY UNAVAILABLE
            </h4>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
              OpenStreetMap tile retrieval unavailable. Emergency workflow, CAP telemetry, and geospatial coordinates continue functioning without interruption.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1.5 max-w-md w-full">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Target Area:</span>
                <span className="font-bold text-slate-200">{alert.affectedArea}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Geospatial Epicenter:</span>
                <span className="font-mono text-slate-200">{alert.coordinates.lat}°N, {alert.coordinates.lon}°E</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Emergency Perimeter:</span>
                <span className="text-amber-400 font-semibold">25 km Impact Radius</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Public Action:</span>
                <span className="text-slate-300">{alert.recommendedAction}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHasMapError(false)}
              className="mt-4 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Retry Tile Connection
            </button>
          </div>
        ) : (
          <>
            <MapContainer
              center={position}
              zoom={9}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%', backgroundColor: '#090d16' }}
              attributionControl={true}
            >
              <MapUpdater center={position} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                eventHandlers={{
                  tileerror: () => {
                    setHasMapError(true);
                  },
                }}
              />

              {/* Impact Zone Circle (25km) */}
              <Circle
                center={position}
                radius={25000}
                pathOptions={{
                  color: severityColor,
                  fillColor: severityColor,
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '6, 6',
                }}
              />

              {/* Core Epicenter Circle (5km) */}
              <Circle
                center={position}
                radius={5000}
                pathOptions={{
                  color: severityColor,
                  fillColor: severityColor,
                  fillOpacity: 0.35,
                  weight: 2,
                }}
              />

              {/* Epicenter Marker (vector CircleMarker to avoid broken asset PNGs) */}
              <CircleMarker
                center={position}
                radius={9}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: severityColor,
                  fillOpacity: 1,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="text-slate-100">
                    <div className="font-bold text-sm text-rose-400 flex items-center gap-1 mb-1">
                      <Shield className="w-3.5 h-3.5" />
                      {alert.hazard} ({alert.severity})
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mb-1">
                      {alert.affectedArea}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      {alert.recommendedAction}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </MapContainer>

            {/* Map Floating Legend */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl text-xs space-y-1.5 shadow-xl max-w-xs">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                SAMPLE AFFECTED AREA
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: severityColor }}
                />
                <span>Epicenter & High-Risk Core (5km)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span
                  className="w-3 h-3 rounded-full border border-dashed"
                  style={{ borderColor: severityColor, backgroundColor: `${severityColor}33` }}
                />
                <span>Advisory Impact Zone (25km)</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span>No proprietary API keys (Mapbox/Google) required. Open public GIS standard.</span>
        <span className="font-mono text-[11px]">Coordinate reference system: WGS84 EPSG:4326</span>
      </div>
    </section>
  );
};
