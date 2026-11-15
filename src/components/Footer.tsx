import React from 'react';
import { ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { TRUSTED_HOUSESITTERS_REF_LINK } from './TrustedHousesittersBanner';
import { CURRENT_YEAR, SITE_LINK, PRIVACY_LINK, DISCLOSURE_LINK } from '../data';

export const Footer: React.FC = () => {
  return (
    <footer className="footer wrap-wide" id="site-footer">
      <div className="footer-columns">
        {/* Brand */}
        <div className="footer-col footer-col-brand">
          <BrandLogo variant="footer" />

          <p className="footer-brand-text">
            Enjoy complete peace of mind while you're away with a trusted live-in sitter, attentive
            care for your pets and home, and regular updates.
          </p>
        </div>

        {/* Navigation */}
        <nav className="footer-col footer-col-nav" aria-label="Footer navigation">
          <span className="footer-col-title">Navigation</span>

          <ul className="footer-links-list">
            <li>
              <a href="#about-section">About</a>
            </li>
            <li>
              <a href="#services-section">Services</a>
            </li>
            <li>
              <a href="#testimonials-section">Reviews</a>
            </li>
            <li>
              <a href="#faq-section">FAQs</a>
            </li>
            <li>
              <a href="#booking-form-section">Book a Sit</a>
            </li>
          </ul>
        </nav>

        {/* External Networks */}
        <nav className="footer-col footer-col-ext" aria-label="External networks">
          <span className="footer-col-title">External Networks</span>

          <ul className="footer-links-list">
            <li>
              <a href="https://sitterjourney.com" target="_blank" rel="noopener noreferrer">
                SitterJourney Blog <ExternalLink size={12} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={TRUSTED_HOUSESITTERS_REF_LINK} target="_blank" rel="noopener noreferrer">
                TrustedHousesitters <ExternalLink size={12} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          <span className="footer-nowrap">
            <span className="copyright-symbol">&copy;</span>
            {CURRENT_YEAR} {SITE_LINK}
          </span>
          <span className="footer-nowrap">
            <span className="footer-copyright-separator" aria-hidden="true">
              ·
            </span>
            All Rights Reserved
          </span>
          <span className="footer-nowrap">
            <span className="footer-copyright-separator" aria-hidden="true">
              ·
            </span>
            <a href={PRIVACY_LINK} target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
            <span className="footer-copyright-separator" aria-hidden="true">
              ·
            </span>
            <a href={DISCLOSURE_LINK} target="_blank" rel="noopener noreferrer">
              Disclosure
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
