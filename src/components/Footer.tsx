import React, { useId } from 'react';
import { ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { TRUSTED_HOUSESITTERS_REF_LINK } from './TrustedHousesittersBanner';
import { CURRENT_YEAR, SITE_LINK, PRIVACY_LINK, DISCLOSURE_LINK } from '../data';

interface FooterLink {
  href: string;
  label: string;
  sponsored?: boolean;
}

const NAV_LINKS: FooterLink[] = [
  { href: '/#about-section', label: 'About' },
  { href: '/#services-section', label: 'Services' },
  { href: '/#testimonials-section', label: 'Reviews' },
  { href: '/#faq-section', label: 'FAQs' },
  { href: '/#booking-form-section', label: 'Book a Sit' },
];

const EXTERNAL_LINKS: FooterLink[] = [
  { href: 'https://sitterjourney.com', label: 'SitterJourney Blog' },
  { href: TRUSTED_HOUSESITTERS_REF_LINK, label: 'TrustedHousesitters', sponsored: true },
];

const LEGAL_LINKS: FooterLink[] = [
  { href: PRIVACY_LINK, label: 'Privacy' },
  { href: DISCLOSURE_LINK, label: 'Disclosure' },
];

interface NewTabLinkProps extends Pick<FooterLink, 'href' | 'sponsored'> {
  showIcon?: boolean;
  children: React.ReactNode;
}

const NewTabLink: React.FC<NewTabLinkProps> = ({
  href,
  sponsored = false,
  showIcon = false,
  children,
}) => (
  <a href={href} target="_blank" rel={`noopener noreferrer${sponsored ? ' sponsored' : ''}`}>
    {children}
    {showIcon && <ExternalLink size={12} aria-hidden="true" />}
    <span className="footer-sr-only"> (opens in a new tab)</span>
  </a>
);

interface FooterNavProps {
  title: string;
  children: React.ReactNode;
}

const FooterNav: React.FC<FooterNavProps> = ({ title, children }) => {
  const titleId = useId();

  return (
    <nav className="footer-col" aria-labelledby={titleId}>
      <h2 className="footer-col-title" id={titleId}>
        {title}
      </h2>
      <ul className="footer-links-list">{children}</ul>
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="footer" id="site-footer">
    <div className="footer-inner wrap-wide">
      <div className="footer-columns">
        <div className="footer-col footer-col-brand">
          <BrandLogo variant="footer" />
          <p className="footer-brand-text">
            Enjoy complete peace of mind while you&rsquo;re away with a trusted live-in sitter,
            attentive care for your pets and home, and regular updates.
          </p>
        </div>

        <FooterNav title="Navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </FooterNav>

        <FooterNav title="External Networks">
          {EXTERNAL_LINKS.map(({ href, label, sponsored }) => (
            <li key={href}>
              <NewTabLink href={href} sponsored={sponsored} showIcon>
                {label}
              </NewTabLink>
            </li>
          ))}
        </FooterNav>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          <span className="copyright-symbol" aria-hidden="true">
            &copy;
          </span>
          {CURRENT_YEAR} {SITE_LINK}
        </p>

        <ul className="footer-legal">
          <li>All Rights Reserved</li>
          {LEGAL_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NewTabLink href={href}>{label}</NewTabLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
