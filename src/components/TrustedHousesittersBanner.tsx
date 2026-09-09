import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

export const TRUSTED_HOUSESITTERS_REF_LINK = 'https://www.trustedhousesitters.com/refer/raf943607/';
export const ARTICLE_EXCHANGE_VS_PRO_LINK = 'https://sitterjourney.com/blog/exchange-vs-professional-house-sitting';
export const ARTICLE_FREE_VS_PRO_LINK = ARTICLE_EXCHANGE_VS_PRO_LINK;

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
  const guideTitle = 'Exchange vs. Professional House Sitting: Which Is Right for You?';

  if (variant === 'card') {
    return (
      <div className={`th-promo-card ${className}`.trim()}>
        <div className="th-promo-card-header">
          <span className="th-card-hook">Trying to decide between exchange and professional house sitting?</span>
        </div>
        <a
          href={ARTICLE_EXCHANGE_VS_PRO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="th-promo-card-guide-link"
          onClick={onClick}
          aria-label={`Read my guide: ${guideTitle}`}
        >
          <BookOpen size={14} className="th-card-book-icon" aria-hidden="true" />
          <span className="th-card-guide-text">
            Read my guide: <strong>Exchange vs. Professional Sitting</strong>
          </span>
          <ExternalLink size={12} className="th-banner-icon" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className={`th-banner-wrapper ${className}`.trim()}>
      <div className="th-banner">
        <div className="th-banner-content">
          <div className="th-banner-message">
            <span className="th-banner-line th-banner-hook">
              Trying to decide between exchange and professional house sitting?
            </span>
            <span className="th-banner-line th-banner-action-line">
              <a
                href={ARTICLE_EXCHANGE_VS_PRO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="th-banner-guide-link"
                onClick={onClick}
                aria-label={`Read my guide: ${guideTitle}`}
              >
                <BookOpen size={13} className="th-guide-book-icon" aria-hidden="true" />
                <span className="th-guide-text">
                  Read my guide: <strong>Exchange vs. Professional House Sitting</strong>
                </span>
                <ExternalLink size={12} className="th-banner-icon" aria-hidden="true" />
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedHousesittersBanner;



