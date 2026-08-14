import React from 'react';
import { ExternalLink } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const TRUSTED_HOUSESITTERS_REF_LINK = 'https://www.trustedhousesitters.com/refer/raf943607/';

export interface TrustedHousesittersBannerProps {
  variant?: 'banner' | 'card';
  className?: string;
  onClick?: () => void;
  tooltipPosition?: 'top' | 'bottom';
  tooltipAlign?: 'left' | 'center' | 'right';
}

export const TrustedHousesittersBanner: React.FC<TrustedHousesittersBannerProps> = ({ 
  variant = 'banner', 
  className = '',
  onClick,
  tooltipPosition = 'top',
  tooltipAlign = 'center'
}) => {
  const promoText = 'Interested in a free housesitter? Get 25% off TrustedHousesitters!';

  const explanationContent = (
    <span>
      <strong>TrustedHousesitters</strong> is a trusted global network connecting pet owners with verified, background-checked sitters who care for pets for free in exchange for a place to stay.
    </span>
  );

  const handleTooltipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const content = (
    <span className="th-banner-message">
      <span className="th-banner-line">Interested in a free housesitter?</span>
      <span className="th-banner-line">
        <span>
          Get <strong>25% off</strong> TrustedHousesitters!
        </span>
        <span className="th-banner-actions">
          <span onClick={handleTooltipClick} className="th-tooltip-wrapper">
            <InfoTooltip 
              content={explanationContent} 
              iconSize={13} 
              position={tooltipPosition} 
              align={tooltipAlign} 
              ariaLabel="What is TrustedHousesitters?"
            />
          </span>
          <ExternalLink size={13} className="th-banner-icon" />
        </span>
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

