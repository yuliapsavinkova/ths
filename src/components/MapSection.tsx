import React from 'react';
import { MapPin } from 'lucide-react';
import { PawIcon } from './Icons';
import { COVERAGE_AREAS } from '../data';

export const MapSection: React.FC = () => {
  const localAreas = COVERAGE_AREAS.filter((area) => area !== 'California');

  return (
    <section id="map-section" className="map-section">
      <div className="wrap-wide stack-xl" id="map-section-wrap">
        <div className="section-header text-center align-center" id="service-areas-header">
          <span className="section-tag">
            <PawIcon size={14} /> Service Areas
          </span>
          <h2 className="section-title">Where I Sit</h2>
          <p className="section-subtitle">
            Local Bay Area with availability for extended stays across California and nationwide.
          </p>
        </div>

        <div className="split-section split-section-alternate" id="map-split">
          <div className="split-content">
            <h3 className="split-title-with-icon">
              <div className="split-icon-box">
                <MapPin size={20} className="split-icon" />
              </div>
              <span>Bay Area &amp; Beyond</span>
            </h3>
            <div className="column-text">
              <p className="large">
                My primary service areas for live-in house and pet sitting include{' '}
                {localAreas.map((area, idx) => (
                  <React.Fragment key={area}>
                    <strong>{area}</strong>
                    {idx < localAreas.length - 1 ? ', ' : ''}
                  </React.Fragment>
                ))}
                , and adjacent cities.
              </p>
              <p className="large">
                For longer stays, I offer house and pet sitting throughout{' '}
                <strong>California</strong> and am open to select extended opportunities nationwide.
              </p>
              <p className="large">
                I welcome ongoing house and pet sitting arrangements for homeowners with multiple
                residences or regular travel plans.
              </p>
            </div>
            <div className="pills-container map-pills">
              {COVERAGE_AREAS.map((area) => (
                <span key={area} className="pill">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div>
            <img
              src="/images/map.webp"
              alt="Service areas map for Los Altos, Los Gatos, San Francisco, San Jose, Santa Cruz, and California"
              className="split-image map-split-image"
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
