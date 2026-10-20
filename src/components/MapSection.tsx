import React from 'react';
import { PawIcon } from './Icons';

export const MapSection: React.FC = () => (
  <section id="map-section" className="map-section">
    <div className="section-header text-center align-center" id="service-areas-header">
      <span className="section-tag">
        <PawIcon size={14} /> Map
      </span>
      <h2 className="section-title">Service Areas</h2>
      <p className="section-subtitle">I provide services locally and nationwide.</p>
    </div>

    <div className="service-map-layout">
      <div className="service-map-image">
        <img src="/images/map.png" alt="Service areas map" className="service-map-image" />
      </div>

      <div className="service-map-description">
        My primary service areas for live-in house and pet sitting include Los Gatos, Saratoga,
        Monte Sereno, Los Altos, San Jose, Santa Cruz, and adjacent areas. For longer stays, I serve
        clients throughout California and am open to select extended opportunities nationwide.
      </div>
    </div>
  </section>
);

export default MapSection;
