import React from 'react';
import { PawIcon } from './Icons';

export const RateBadgeCircle: React.FC = () => {
  return (
    <div className="badge-circle badge-circle-animated" id="hero-rate-badge-circle">
      <div className="badge-circle-content">
        <PawIcon size={14} className="badge-paw" />
        <span className="badge-title">Rates from</span>
        <span className="badge-rates">
          <span className="badge-rate-row">
            <span className="badge-price">$299</span>
            <span className="badge-unit">/week</span>
          </span>
          <span className="badge-rate-row">
            <span className="badge-price">$999</span>
            <span className="badge-unit">/month</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default RateBadgeCircle;
