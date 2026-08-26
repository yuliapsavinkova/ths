import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PrivacyDisclosure } from './PrivacyDisclosure';

export const TRUSTED_HOUSESITTERS_REF_LINK = 'https://www.trustedhousesitters.com/refer/raf943607/';

export interface TrustedHousesittersBannerProps {
  variant?: 'banner' | 'card';
  className?: string;
  onClick?: () => void;
}

export const TrustedHousesittersBanner: React.FC<TrustedHousesittersBannerProps> = ({ 
  variant = 'banner', 
  className = '',
  onClick,
}) => {
  const promoText = 'Interested in a free sitter? Join TrustedHousesitters with 25% off';

  const bannerText = (
    <span className="th-banner-message">
      <span className="th-banner-line">Interested in a free sitter?</span>
      <span className="th-banner-line">
        <span>
          Join TrustedHousesitters with <strong>25% off</strong>
        </span>
        <ExternalLink size={14} className="th-banner-icon" aria-hidden="true" />
      </span>
    </span>
  );

  if (variant === 'card') {
    return (
      <div className={`th-promo-card ${className}`.trim()}>
        <a
          href={TRUSTED_HOUSESITTERS_REF_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="th-promo-card-link"
          onClick={onClick}
          aria-label={promoText}
        >
          {bannerText}
        </a>
        <PrivacyDisclosure
          type="trustedhousesitters"
          align="center"
          theme="light"
          className="th-card-disclosure"
        />
      </div>
    );
  }

  return (
    <div className={`th-banner-wrapper ${className}`.trim()}>
      <div className="th-banner">
        <a
          href={TRUSTED_HOUSESITTERS_REF_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="th-banner-link"
          onClick={onClick}
          aria-label={promoText}
        >
          <div className="th-banner-content">
            {bannerText}
          </div>
        </a>
        <PrivacyDisclosure
          type="trustedhousesitters"
          align="center"
          theme="dark"
          className="th-banner-disclosure"
        />
      </div>
    </div>
  );
};

export default TrustedHousesittersBanner;


