import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { TrustedHousesittersBanner } from './TrustedHousesittersBanner';

interface HeaderProps {
  scrolled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-menu-active' : ''}`} role="banner">
      <div className="wrap-wide header-container" id="header-container-el">
        
        {/* Logo / Brand */}
        <BrandLogo variant="header" onClick={closeMobileMenu} id="header-logo-link" />

        {/* Hamburger Toggle Button (Mobile Only) */}
        <button 
          className="mobile-nav-toggle" 
          id="mobile-nav-toggle-btn"
          onClick={toggleMobileMenu} 
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Sitter status bar */}
        <div className="header-status-wrapper" id="header-status-wrap">
          <nav className="nav-links" id="header-nav-links" aria-label="Main Navigation">
            <a href="#about-section">About</a>
            <a href="#services-section">Services</a>
            <a href="#testimonials-section">Reviews</a>
            <a href="#faq-section">FAQs</a>
            <a href="#booking-form-section" className="nav-cta-btn">Book a Sit</a>
          </nav>
        </div>

      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <nav 
            className="mobile-drawer-menu" 
            id="mobile-nav-menu" 
            onClick={(e) => e.stopPropagation()} 
            aria-label="Mobile Navigation"
          >
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-title">Navigation</span>
              <button className="mobile-drawer-close" onClick={closeMobileMenu} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            
            <div className="mobile-drawer-body">
              <div className="mobile-drawer-links">
                <a href="#about-section" onClick={closeMobileMenu}>About</a>
                <a href="#services-section" onClick={closeMobileMenu}>Services</a>
                <a href="#testimonials-section" onClick={closeMobileMenu}>Reviews</a>
                <a href="#faq-section" onClick={closeMobileMenu}>FAQs</a>
              </div>
              
              <div className="mobile-drawer-action">
                <a href="#booking-form-section" className="mobile-drawer-cta-btn" onClick={closeMobileMenu}>
                  Book a Sit
                </a>
              </div>

              {/* TrustedHousesitters Promo Banner in Mobile Drawer (Below Book a Sit) */}
              <TrustedHousesittersBanner 
                variant="card" 
                onClick={closeMobileMenu} 
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

