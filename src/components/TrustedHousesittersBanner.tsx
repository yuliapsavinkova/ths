import React from 'react';
import { ExternalLink } from 'lucide-react';

export const TRUSTED_HOUSESITTERS_REF_LINK = 'https://www.trustedhousesitters.com/refer/raf943607/';

export interface TrustedHousesittersBannerProps {
  variant?: 'banner' | 'card';
  className?: string;
  onClick?: () => void;
}

export const TrustedHousesittersBanner: React.FC<TrustedHousesittersBannerProps> = ({ 
  variant = 'banner', 
  className = '',
  onClick
}) => {
  const promoText = 'Interested in a free housesitter? Join TrustedHousesitters with 25% off!';

  const content = (
    <span className="th-banner-message">
      <span className="th-banner-line">Interested in a free housesitter?</span>
      <span className="th-banner-line">
        Join TrustedHousesitters with <strong>25% off</strong>!
        <ExternalLink size={13} className="th-banner-icon" />
      </span>
    </span>
  );

  if (variant === 'card') {
    return (
      <a 
        href={TRUSTED_HOUSESITTERS_REF_LINK} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`th-promo-card ${className}`.trim()}
        onClick={onClick}
        aria-label={promoText}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="th-banner-wrapper">
      <a 
        href={TRUSTED_HOUSESITTERS_REF_LINK} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`th-banner ${className}`.trim()}
        onClick={onClick}
        aria-label={promoText}
      >
        <div className="th-banner-content">
          {content}
        </div>
      </a>
    </div>
  );
};

export default TrustedHousesittersBanner;

