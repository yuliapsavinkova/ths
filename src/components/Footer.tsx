import React from 'react';
import { ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { TRUSTED_HOUSESITTERS_REF_LINK } from './TrustedHousesittersBanner';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" id="footer-section-el">
      <div className="wrap-wide footer-inner" id="footer-inner-wrap">
        
        {/* Row 1: 3 Columns */}
        <div className="footer-columns" id="footer-columns-wrap">
          {/* Column 1: Sitter brand */}
          <div className="footer-col footer-col-brand" id="footer-brand-container">
            <BrandLogo variant="footer" id="footer-brand-title-el" />
            <p className="footer-brand-text" id="footer-brand-desc">
              Premium live-in pet and home care. Enjoy complete peace of mind while you're away with a
              trusted live-in sitter, an active work-from-home presence, and regular updates.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col footer-col-nav" id="footer-nav-col">
            <span className="footer-col-title">Navigation</span>
            <ul className="footer-links-list">
              <li><a href="#about-section">About</a></li>
              <li><a href="#services-section">Services</a></li>
              <li><a href="#testimonials-section">Reviews</a></li>
              <li><a href="#faq-section">FAQs</a></li>
              <li><a href="#booking-form-section">Book a Sit</a></li>
            </ul>
          </div>

          {/* Column 3: External Networks */}
          <div className="footer-col footer-col-ext" id="footer-ext-col">
            <span className="footer-col-title">External Networks</span>
            <ul className="footer-links-list">
              <li>
                <a 
                  href="https://sitterjourney.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  SitterJourney Blog <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href={TRUSTED_HOUSESITTERS_REF_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  TrustedHousesitters <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 2: 1 Column Independent Copyright Line */}
        <div className="footer-bottom" id="footer-bottom-wrap">
          <p className="footer-copyright" id="footer-copyright-text">
            © {new Date().getFullYear()} yulia.sitterjourney.com · All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
