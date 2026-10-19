import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import { PawIcon } from './Icons';

type ServiceAreaId = 'all' | 'los-altos' | 'saratoga' | 'los-gatos' | 'san-jose' | 'santa-cruz';

interface ServiceAreaPin {
  id: ServiceAreaId;
  name: string;
  pinLabel: string;
  subLabel: string;
  coordinates: { x: number; y: number };
  badgeOffset: { x: number; y: number };
}

const PINNED_LIST: ServiceAreaPin[] = [
  {
    id: 'los-altos',
    name: 'Los Altos',
    pinLabel: 'Los Altos',
    subLabel: 'Estates & Foothills',
    coordinates: { x: 440, y: 110 },
    badgeOffset: { x: -140, y: -18 },
  },
  {
    id: 'saratoga',
    name: 'Saratoga',
    pinLabel: 'Saratoga',
    subLabel: 'Village & Estates',
    coordinates: { x: 520, y: 185 },
    badgeOffset: { x: -140, y: -18 },
  },
  {
    id: 'los-gatos',
    name: 'Los Gatos',
    pinLabel: 'Los Gatos',
    subLabel: 'Town & Foothills',
    coordinates: { x: 590, y: 245 },
    badgeOffset: { x: 18, y: -18 },
  },
  {
    id: 'san-jose',
    name: 'San Jose',
    pinLabel: 'San Jose',
    subLabel: 'Willow Glen & Enclaves',
    coordinates: { x: 720, y: 195 },
    badgeOffset: { x: 18, y: -18 },
  },
  {
    id: 'santa-cruz',
    name: 'Santa Cruz',
    pinLabel: 'Santa Cruz',
    subLabel: 'Monterey Bay Coast',
    coordinates: { x: 290, y: 395 },
    badgeOffset: { x: 18, y: -18 },
  },
];

export const ServiceAreasSection: React.FC = () => {
  const [activeAreaId, setActiveAreaId] = useState<ServiceAreaId>('all');

  const handleSelectArea = (id: ServiceAreaId) => {
    setActiveAreaId(id);
  };

  return (
    <section id="service-areas-section" className="service-areas-section">
      <div className="wrap stack-lg" id="service-areas-wrap">
        {/* Section Header */}
        <div className="section-header text-center align-center" id="service-areas-header">
          <span className="section-tag">
            <PawIcon size={14} /> Map
          </span>
          <h2 className="section-title">Primary Service Areas</h2>
          <p className="section-subtitle">
            Attentive, full-time live-in house sitting and pet care concentrated in these premier communities.
          </p>
        </div>

        {/* Main Creative Map Card */}
        <div className="service-map-card-wrapper" id="service-map-card">
          {/* Quick Filter Navigation Buttons */}
          <div className="service-map-nav" role="tablist" aria-label="Service Area Selector">
            <button
              type="button"
              role="tab"
              aria-selected={activeAreaId === 'all'}
              className={`service-map-nav-btn ${activeAreaId === 'all' ? 'is-active' : ''}`}
              onClick={() => handleSelectArea('all')}
            >
              <Navigation size={13} />
              <span>All Primary Areas</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeAreaId === 'los-altos'}
              className={`service-map-nav-btn ${activeAreaId === 'los-altos' ? 'is-active' : ''}`}
              onClick={() => handleSelectArea('los-altos')}
            >
              <MapPin size={13} />
              <span>Los Altos</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeAreaId === 'saratoga'}
              className={`service-map-nav-btn ${activeAreaId === 'saratoga' ? 'is-active' : ''}`}
              onClick={() => handleSelectArea('saratoga')}
            >
              <MapPin size={13} />
              <span>Saratoga</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeAreaId === 'los-gatos'}
              className={`service-map-nav-btn ${activeAreaId === 'los-gatos' ? 'is-active' : ''}`}
              onClick={() => handleSelectArea('los-gatos')}
            >
              <MapPin size={13} />
              <span>Los Gatos</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeAreaId === 'san-jose'}
              className={`service-map-nav-btn ${activeAreaId === 'san-jose' ? 'is-active' : ''}`}
              onClick={() => handleSelectArea('san-jose')}
            >
              <MapPin size={13} />
              <span>San Jose</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeAreaId === 'santa-cruz'}
              className={`service-map-nav-btn ${activeAreaId === 'santa-cruz' ? 'is-active' : ''}`}
              onClick={() => handleSelectArea('santa-cruz')}
            >
              <MapPin size={13} />
              <span>Santa Cruz</span>
            </button>
          </div>

          {/* SVG Canvas Map Graphic */}
          <div className="service-map-canvas-container" id="service-map-canvas">
            <svg
              viewBox="0 0 900 520"
              className="service-map-svg"
              role="img"
              aria-label="Realistic geographic map of primary service areas: Los Altos, Saratoga, Los Gatos, San Jose, and Santa Cruz"
            >
              <defs>
                {/* Subtle radial shading for the map landmass */}
                <radialGradient id="landGlow" cx="60%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="var(--color-brand-primary-subtle)" />
                  <stop offset="80%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Pacific Ocean & Monterey Bay Water Polygon */}
              <path
                d="M 0 0 L 120 0 C 135 80, 160 160, 190 240 C 220 300, 255 350, 290 395 C 330 425, 410 445, 480 455 C 530 465, 555 490, 565 520 L 0 520 Z"
                className="map-ocean"
              />

              {/* Ocean Wave Accents */}
              <path d="M 35 150 Q 75 140 115 150" className="map-ocean-wave" />
              <path d="M 60 270 Q 100 260 140 270" className="map-ocean-wave" />
              <path d="M 120 370 Q 160 360 200 370" className="map-ocean-wave" />
              <path d="M 190 440 Q 230 430 270 440" className="map-ocean-wave" />
              <path d="M 340 475 Q 380 465 420 475" className="map-ocean-wave" />

              {/* Pacific & Monterey Bay Coastline */}
              <path
                d="M 120 0 C 135 80, 160 160, 190 240 C 220 300, 255 350, 290 395 C 330 425, 410 445, 480 455 C 530 465, 555 490, 565 520"
                className="map-coastline"
              />

              {/* South San Francisco Bay (Northeast Water Inset) */}
              <path
                d="M 520 0 C 535 30, 565 65, 615 85 C 665 105, 715 112, 765 100 C 800 85, 830 50, 855 0 Z"
                className="map-bay-water"
              />
              <path
                d="M 520 0 C 535 30, 565 65, 615 85 C 665 105, 715 112, 765 100 C 800 85, 830 50, 855 0"
                className="map-coastline"
              />

              {/* Santa Cruz Mountains Elevation Ridges */}
              <path
                d="M 230 40 C 310 130, 390 220, 480 300 C 560 370, 640 430, 720 490"
                className="map-ridge"
              />
              <path
                d="M 270 50 C 350 140, 430 230, 520 310 C 600 380, 675 440, 750 500"
                className="map-ridge"
              />

              {/* Mountain Relief Hatch Markings */}
              <path d="M 320 120 L 335 105 M 380 180 L 395 165 M 450 245 L 465 230 M 520 315 L 535 300 M 590 380 L 605 365" className="map-mountain-hatch" />
              <path d="M 350 140 L 365 125 M 410 200 L 425 185 M 480 265 L 495 250 M 550 335 L 565 320 M 620 400 L 635 385" className="map-mountain-hatch" />

              {/* Highway 1 Coastal Route */}
              <path
                d="M 190 240 C 220 300, 255 350, 290 395 C 330 425, 410 445, 480 455 C 530 465, 555 490, 565 520"
                className="map-route-secondary"
              />

              {/* Corridor: Highway 17 Mountain Pass (Los Gatos through Summit to Santa Cruz) */}
              <path
                d="M 590 245 C 520 280, 420 330, 290 395"
                className={`map-corridor ${activeAreaId === 'los-gatos' || activeAreaId === 'santa-cruz' ? 'map-corridor-active' : ''}`}
              />

              {/* Corridor: I-280 & Highway 85 Foothill Belt (Los Altos -> Saratoga -> Los Gatos) */}
              <path
                d="M 440 110 C 475 145, 500 165, 520 185"
                className={`map-corridor ${activeAreaId === 'los-altos' || activeAreaId === 'saratoga' ? 'map-corridor-active' : ''}`}
              />
              <path
                d="M 520 185 C 550 210, 570 225, 590 245"
                className={`map-corridor ${activeAreaId === 'saratoga' || activeAreaId === 'los-gatos' ? 'map-corridor-active' : ''}`}
              />

              {/* Corridor: Valley Expressways to San Jose (Willow Glen) */}
              <path
                d="M 590 245 C 630 225, 675 210, 720 195"
                className={`map-corridor ${activeAreaId === 'los-gatos' || activeAreaId === 'san-jose' ? 'map-corridor-active' : ''}`}
              />
              <path
                d="M 520 185 C 580 180, 650 185, 720 195"
                className={`map-corridor ${activeAreaId === 'saratoga' || activeAreaId === 'san-jose' ? 'map-corridor-active' : ''}`}
              />
              <path
                d="M 440 110 C 520 130, 620 160, 720 195"
                className={`map-corridor ${activeAreaId === 'los-altos' || activeAreaId === 'san-jose' ? 'map-corridor-active' : ''}`}
              />

              {/* Cartographic Water Labels */}
              <text x="50" y="220" className="map-label-ocean">
                Pacific Ocean
              </text>
              <text x="140" y="460" className="map-label-ocean">
                Monterey Bay
              </text>
              <text x="690" y="55" className="map-label-bay">
                San Francisco Bay
              </text>

              {/* Mountain Terrain Label */}
              <text x="405" y="300" className="map-label-terrain" transform="rotate(-38 405 300)">
                Santa Cruz Mountains
              </text>

              {/* Compass Rose Accent */}
              <g transform="translate(845, 65)">
                <circle cx="0" cy="0" r="20" className="map-compass-ring" />
                <polygon points="0,-16 3.5,-3 0,0 -3.5,-3" className="map-compass-pointer" />
                <polygon points="0,16 3.5,3 0,0 -3.5,3" fill="var(--color-border-bold)" />
                <text x="0" y="-21" textAnchor="middle" className="map-compass-text">
                  N
                </text>
              </g>

              {/* Pinned Wealthy Communities */}
              {PINNED_LIST.map((pin) => {
                const isSelected = activeAreaId === pin.id;
                const isAll = activeAreaId === 'all';
                const { x, y } = pin.coordinates;
                const { x: bx, y: by } = pin.badgeOffset;

                return (
                  <g
                    key={pin.id}
                    className={`map-pin-group ${isSelected ? 'is-active' : ''} ${isAll ? 'is-overview' : ''}`}
                    onClick={() => handleSelectArea(pin.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectArea(pin.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${pin.name}`}
                  >
                    {/* Animated Pulsing Rings */}
                    <circle cx={x} cy={y} r="14" className="map-pin-pulse-ring" />

                    {/* Central Pin Head */}
                    <circle cx={x} cy={y} r="8" className="map-pin-head" />
                    <circle cx={x} cy={y} r="3.5" className="map-pin-core" />

                    {/* Pin Label Floating Badge */}
                    <g transform={`translate(${x + bx}, ${y + by})`}>
                      <rect
                        x="0"
                        y="0"
                        width={pin.id === 'san-jose' ? 144 : 124}
                        height="36"
                        className="map-pin-badge-bg"
                      />
                      <text x="12" y="16" className="map-pin-label-title">
                        {pin.pinLabel}
                      </text>
                      <text x="12" y="28" className="map-pin-label-sub">
                        {pin.subLabel}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Statewide Extended Care Footer Ribbon */}
          <div className="service-map-footer-ribbon">
            <p className="service-map-footer-text">
              <Sparkles size={13} className="bms-inline-icon" />
              {' '}
              <strong>Statewide California:</strong> Extended (2+ weeks) &amp; monthly live-in house sitting stays are warmly welcomed across California.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreasSection;
