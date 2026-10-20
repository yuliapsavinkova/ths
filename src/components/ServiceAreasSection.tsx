import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { PawIcon } from './Icons';

/* ─────────────────────────────────────────────────────────────
   GEO PROJECTION
   Everything is placed by real latitude / longitude, so the map
   stays geographically accurate and adding a city is one line.
   1° lat ≈ 111 km, 1° lon ≈ 88.8 km at 37°N, so X_SCALE / Y_SCALE
   keeps the 0.8 ratio and the map isn't stretched.
   ───────────────────────────────────────────────────────────── */
const LON_ORIGIN = -122.3;
const LAT_ORIGIN = 37.48;
const X_SCALE = 1120; // px per degree longitude
const Y_SCALE = 1400; // px per degree latitude
const VIEW_W = 640;
const VIEW_H = 780;

type LatLng = [number, number]; // [lat, lng]
interface Point {
  x: number;
  y: number;
}

const project = ([lat, lng]: LatLng): Point => ({
  x: Math.round((lng - LON_ORIGIN) * X_SCALE * 10) / 10,
  y: Math.round((LAT_ORIGIN - lat) * Y_SCALE * 10) / 10,
});

/** Catmull-Rom → cubic Bézier, so shorelines and roads curve naturally. */
const toSmoothPath = (coords: LatLng[]): string => {
  const pts = coords.map(project);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

/* ─────────────────────────────────────────────────────────────
   SERVICE AREAS  (edit blurbs freely)
   ───────────────────────────────────────────────────────────── */
type ServiceAreaId =
  | 'all'
  | 'los-altos'
  | 'mountain-view'
  | 'sunnyvale'
  | 'san-jose'
  | 'saratoga'
  | 'los-gatos'
  | 'santa-cruz';

interface ServiceArea {
  id: Exclude<ServiceAreaId, 'all'>;
  name: string;
  blurb: string;
  position: LatLng;
  label: { anchor: 'start' | 'middle' | 'end'; dx: number; dy: number };
}

const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'los-altos',
    name: 'Los Altos',
    blurb: 'Live-in house sitting and pet care in Los Altos and the surrounding hills.',
    position: [37.3852, -122.1141],
    label: { anchor: 'end', dx: -14, dy: -13 },
  },
  {
    id: 'mountain-view',
    name: 'Mountain View',
    blurb: 'Attentive in-home pet care for Mountain View households.',
    position: [37.3861, -122.0839],
    label: { anchor: 'middle', dx: 0, dy: -32 },
  },
  {
    id: 'sunnyvale',
    name: 'Sunnyvale',
    blurb: 'Reliable house sitting and daily pet routines in Sunnyvale.',
    position: [37.3688, -122.0363],
    label: { anchor: 'start', dx: 14, dy: -13 },
  },
  {
    id: 'san-jose',
    name: 'San Jose',
    blurb: 'Full-time live-in care across San Jose neighborhoods.',
    position: [37.3382, -121.8863],
    label: { anchor: 'start', dx: 14, dy: -13 },
  },
  {
    id: 'saratoga',
    name: 'Saratoga',
    blurb: 'Calm, dependable house sitting for Saratoga homes and their pets.',
    position: [37.2638, -122.023],
    label: { anchor: 'end', dx: -14, dy: -13 },
  },
  {
    id: 'los-gatos',
    name: 'Los Gatos',
    blurb: 'Live-in pet care for Los Gatos and the foothill communities.',
    position: [37.2358, -121.9624],
    label: { anchor: 'start', dx: 14, dy: -13 },
  },
  {
    id: 'santa-cruz',
    name: 'Santa Cruz',
    blurb: 'Coastal house sitting and pet care in Santa Cruz.',
    position: [36.9741, -122.0308],
    label: { anchor: 'start', dx: 14, dy: -13 },
  },
];

/* ─────────────────────────────────────────────────────────────
   GEOGRAPHY
   ───────────────────────────────────────────────────────────── */
// Pacific coast and Monterey Bay, north-west → south-east
const COASTLINE: LatLng[] = [
  [37.1, -122.32],
  [37.093, -122.28],
  [37.04, -122.23],
  [37.007, -122.195],
  [36.99, -122.15],
  [36.965, -122.1],
  [36.952, -122.06],
  [36.951, -122.027],
  [36.96, -122.0],
  [36.972, -121.95],
  [36.968, -121.9],
  [36.95, -121.865],
  [36.92, -121.83],
  [36.89, -121.8],
];

// South end of San Francisco Bay, west → east
const BAY_SHORE: LatLng[] = [
  [37.5, -122.165],
  [37.47, -122.13],
  [37.455, -122.105],
  [37.44, -122.085],
  [37.43, -122.06],
  [37.425, -122.03],
  [37.428, -122.0],
  [37.435, -121.975],
  [37.45, -121.955],
  [37.47, -121.94],
  [37.5, -121.92],
];

// Santa Cruz Mountains (foothill edge, then back along the map edge)
const MOUNTAIN_EDGE: LatLng[] = [
  [37.48, -122.3],
  [37.42, -122.25],
  [37.38, -122.17],
  [37.33, -122.09],
  [37.3, -122.05],
  [37.26, -122.0],
  [37.21, -121.96],
  [37.12, -121.93],
  [37.04, -121.97],
  [36.98, -122.0],
];

interface Road {
  id: string;
  label: string;
  path: LatLng[];
  shieldAt: number;
}

const ROADS: Road[] = [
  {
    id: 'i-280',
    label: '280',
    shieldAt: 1,
    path: [
      [37.46, -122.3],
      [37.4, -122.2],
      [37.36, -122.12],
      [37.325, -122.04],
      [37.31, -121.96],
      [37.33, -121.89],
    ],
  },
  {
    id: 'us-101',
    label: '101',
    shieldAt: 7,
    path: [
      [37.48, -122.185],
      [37.44, -122.13],
      [37.405, -122.075],
      [37.385, -122.02],
      [37.365, -121.96],
      [37.335, -121.895],
      [37.29, -121.86],
      [37.24, -121.81],
    ],
  },
  {
    id: 'sr-85',
    label: '85',
    shieldAt: 5,
    path: [
      [37.4, -122.07],
      [37.35, -122.04],
      [37.3, -122.01],
      [37.265, -121.975],
      [37.25, -121.95],
      [37.24, -121.9],
      [37.25, -121.85],
    ],
  },
  {
    id: 'sr-17',
    label: '17',
    shieldAt: 2,
    path: [
      [37.255, -121.965],
      [37.19, -121.99],
      [37.13, -121.99],
      [37.08, -121.98],
      [37.05, -122.01],
      [37.0, -122.03],
    ],
  },
];

// Neighboring towns shown for orientation only (not clickable)
const NEARBY_TOWNS: { name: string; position: LatLng }[] = [
  { name: 'Palo Alto', position: [37.4419, -122.143] },
  { name: 'Cupertino', position: [37.323, -122.0322] },
  { name: 'Santa Clara', position: [37.3541, -121.9552] },
  { name: 'Campbell', position: [37.2872, -121.95] },
  { name: 'Milpitas', position: [37.4323, -121.8996] },
];

// Pre-computed SVG geometry (runs once, not on every render)
const OCEAN_PATH = (() => {
  const end = project(COASTLINE[COASTLINE.length - 1]);
  const start = project(COASTLINE[0]);
  return `${toSmoothPath(COASTLINE)} L ${end.x} ${VIEW_H + 40} L ${start.x} ${VIEW_H + 40} Z`;
})();

const BAY_PATH = (() => {
  const first = project(BAY_SHORE[0]);
  const last = project(BAY_SHORE[BAY_SHORE.length - 1]);
  return `${toSmoothPath(BAY_SHORE)} L ${last.x} -40 L ${first.x} -40 Z`;
})();

const MOUNTAIN_PATH = (() => {
  const last = project(MOUNTAIN_EDGE[MOUNTAIN_EDGE.length - 1]);
  const first = project(MOUNTAIN_EDGE[0]);
  return `${toSmoothPath(MOUNTAIN_EDGE)} L ${last.x} ${VIEW_H + 40} L ${first.x - 40} ${VIEW_H + 40} L ${first.x - 40} ${first.y} Z`;
})();

const COAST_STROKE = toSmoothPath(COASTLINE);
const BAY_STROKE = toSmoothPath(BAY_SHORE);

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */
export const ServiceAreasSection: React.FC = () => {
  const [activeAreaId, setActiveAreaId] = useState<ServiceAreaId>('all');
  const activeArea = SERVICE_AREAS.find((a) => a.id === activeAreaId);
  const hasSelection = activeAreaId !== 'all';

  return (
    <section id="service-areas-section" className="service-areas-section">
      <div className="wrap stack-lg" id="service-areas-wrap">
        <div className="section-header text-center align-center" id="service-areas-header">
          <span className="section-tag">
            <PawIcon size={14} /> Map
          </span>
          <h2 className="section-title">Service Areas</h2>
          <p className="section-subtitle">I provide services locally and nationwide.</p>
        </div>

        <div className="service-map-card-wrapper" id="service-map-card">
          {/* */}
          <div className="service-map-wrapper">
            <div className="service-map-info" aria-live="polite">
              <div>
                My primary service areas for live-in house and pet sitting include Los Gatos,
                Saratoga, Monte Sereno, Los Altos, San Jose, Santa Cruz, and adjacent areas. For
                longer stays, I serve clients throughout California and am open to select extended
                opportunities nationwide.
              </div>
              <div className="service-map-canvas-container" id="service-map-canvas">
                <svg
                  viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                  className={`service-map-svg ${hasSelection ? 'has-selection' : ''}`}
                  role="group"
                  aria-label="Map of service areas: Los Altos, Mountain View, Sunnyvale, San Jose, Saratoga, Los Gatos and Santa Cruz"
                >
                  {/* Terrain & water */}
                  <path d={MOUNTAIN_PATH} className="map-mountains" />
                  <path d={OCEAN_PATH} className="map-ocean" />
                  <path d={COAST_STROKE} className="map-coastline" />
                  <path d={BAY_PATH} className="map-bay-water" />
                  <path d={BAY_STROKE} className="map-coastline" />

                  {/* Highways */}
                  {ROADS.map((road) => (
                    <path key={road.id} d={toSmoothPath(road.path)} className="map-road" />
                  ))}
                  {ROADS.map((road) => {
                    const { x, y } = project(road.path[road.shieldAt]);
                    return (
                      <g
                        key={`${road.id}-shield`}
                        transform={`translate(${x}, ${y})`}
                        className="map-shield"
                      >
                        <rect
                          x="-12"
                          y="-8"
                          width="24"
                          height="16"
                          rx="4"
                          className="map-shield-box"
                        />
                        <text y="3.5" textAnchor="middle" className="map-shield-text">
                          {road.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Nearby towns (context only) */}
                  {NEARBY_TOWNS.map((town) => {
                    const { x, y } = project(town.position);
                    return (
                      <g key={town.name} className="map-town" aria-hidden="true">
                        <circle cx={x} cy={y} r="2.5" className="map-town-dot" />
                        <text x={x + 6} y={y + 3.5} className="map-town-name">
                          {town.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Water & range labels */}
                  <text x="10" y="745" className="map-label-ocean">
                    Pacific Ocean
                  </text>
                  <text x="370" y="768" className="map-label-ocean">
                    Monterey Bay
                  </text>
                  <text x="300" y="30" textAnchor="middle" className="map-label-bay">
                    San Francisco Bay
                  </text>
                  <text
                    transform="rotate(-48 150 330)"
                    x="150"
                    y="330"
                    textAnchor="middle"
                    className="map-label-terrain"
                  >
                    Santa Cruz Mountains
                  </text>

                  {/* North arrow */}
                  <g transform="translate(600, 40)" className="map-scale" aria-hidden="true">
                    <path d="M 0 -16 L 6 6 L 0 2 L -6 6 Z" className="map-north-arrow" />
                    <text y="20" textAnchor="middle" className="map-scale-text">
                      N
                    </text>
                  </g>

                  {/* Service area pins */}
                  {SERVICE_AREAS.map((area) => {
                    const { x, y } = project(area.position);
                    const isSelected = activeAreaId === area.id;
                    return (
                      <g
                        key={area.id}
                        className={`map-pin-group ${isSelected ? 'is-active' : ''}`}
                        onClick={() => setActiveAreaId(area.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveAreaId(area.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        aria-label={`Select ${area.name}`}
                      >
                        <g transform={`translate(${x}, ${y})`}>
                          <path
                            d="M 0 0 C -2 -3 -8 -11 -8 -18 A 8 8 0 1 1 8 -18 C 8 -11 2 -3 0 0 Z"
                            className="map-pin-marker"
                          />
                          <circle cx="0" cy="-18" r="3.2" className="map-pin-inner-dot" />
                        </g>
                        <text
                          x={x + area.label.dx}
                          y={y + area.label.dy}
                          textAnchor={area.label.anchor}
                          className="map-pin-name"
                        >
                          {area.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="service-map-nav" role="tablist" aria-label="Service Area Selector">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeAreaId === 'all'}
                  className={`service-map-nav-btn ${activeAreaId === 'all' ? 'is-active' : ''}`}
                  onClick={() => setActiveAreaId('all')}
                >
                  <Navigation size={13} />
                  <span>All Areas</span>
                </button>
                {SERVICE_AREAS.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    role="tab"
                    aria-selected={activeAreaId === area.id}
                    className={`service-map-nav-btn ${activeAreaId === area.id ? 'is-active' : ''}`}
                    onClick={() => setActiveAreaId(area.id)}
                  >
                    <MapPin size={13} />
                    <span>{area.name}</span>
                  </button>
                ))}
              </div>
              <h3 className="service-map-info-title">
                {activeArea ? activeArea.name : 'Where I work'}
              </h3>
              <p className="service-map-info-text">
                {activeArea
                  ? activeArea.blurb
                  : `Serving ${SERVICE_AREAS.length} communities between Los Altos and the Santa Cruz coast. Tap a pin to learn more.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreasSection;
