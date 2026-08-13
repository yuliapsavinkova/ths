import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SITTER_BIO } from '../data';
import { BrandLogo } from './BrandLogo';
import { TRUSTED_HOUSESITTERS_REF_LINK } from './TrustedHousesittersBanner';

export const Footer: React.FC = () => {
  return (
    <footer id="footer-section-el">
      <div className="wrap-wide footer-grid" id="footer-grid-wrap">
        
        {/* Col 1: Sitter brand */}
        <div className="footer-brand-col" id="footer-brand-container">
          <BrandLogo variant="footer" id="footer-brand-title-el" />
          <p className="footer-brand-text" id="footer-brand-desc">
            Premium live-in pet and home care. Enjoy complete peace of mind while you're away with a trusted live-in sitter, an active work-from-home presence, and regular updates.
          </p>
          <span className="footer-brand-copy" id="footer-brand-copy-text">
            <span className="footer-copy-domain">© {new Date().getFullYear()} yulia.sitterjourney.com</span>
            <span className="footer-copy-rights">&nbsp;&middot;&nbsp;All Rights Reserved</span>
          </span>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-links-col footer-links-col-nav" id="footer-nav-col">
          <span className="footer-col-title">Navigation</span>
          <ul className="footer-links-list">
            <li><a href="#about-section">About</a></li>
            <li><a href="#services-section">Services</a></li>
            <li><a href="#testimonials-section">Reviews</a></li>
            <li><a href="#faq-section">FAQs</a></li>
            <li><a href="#booking-form-section">Book a Sit</a></li>
          </ul>
        </div>

        {/* Col 3: External Profiles / Blog */}
        <div className="footer-links-col footer-links-col-ext" id="footer-ext-col">
          <span className="footer-col-title">External Networks</span>
          <ul className="footer-links-list">
            <li>
              <a 
                href={TRUSTED_HOUSESITTERS_REF_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                TrustedHousesitters Profile <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a 
                href="https://sitterjourney.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                SitterJourney Blog <ExternalLink size={12} />
              </a>
            </li>
          </ul>
          <div className="footer-contact-info" id="footer-contact-info-el">
            <span>Primary support: yulia.sitterjourney.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
