import React from 'react';
import { PawIcon } from './Icons';
import { SITTER_IMAGES } from '../data';
import RateBadgeCircle from './RateBadgeCircle';
import NewsletterSubscription from './NewsletterSubscription';
import { TrustedHousesittersBanner } from './TrustedHousesittersBanner';

export const Hero: React.FC = () => {
  return (
    <section className="hero" id="hero-section-el">
      <div className="hero-overlay" />

      <div className="wrap-wide hero-grid" id="hero-grid-el">
        
        {/* Left Column: Text & Call to Actions */}
        <div className="hero-content" id="hero-content-col">
          <div className="hero-tagline-wrapper" id="hero-tagline-wrap">
            <span className="hero-tagline">
              <PawIcon size={14} /> Premium Pet & Home Care
            </span>
          </div>

            <h1 className="hero-title" id="hero-main-title">
            Trusted Live-In
            <br />
            <span>House & Pet Sitter</span>
          </h1>

          <p className="hero-text" id="hero-lead-text">
            Planning a business trip, vacation, or extended time away? I provide live-in house sitting, pet care, plant watering, and home security, so you can travel with peace of mind.
          </p>

          {/* Call to Actions - At bottom of Hero */}
          <div className="hero-ctas" id="hero-buttons-container">
            <a 
              href="#booking-form-section" 
              className="btn btn-fill btn-auto-sm shadow-lg"
              id="hero-btn-propose"
            >
              Book a Sit
            </a>
            <a 
              href="#about-section" 
              className="btn btn-outline btn-auto-sm"
              id="hero-btn-learn"
            >
              Learn more
            </a>
          </div>

          {/* Newsletter Subscription Box */}
          <NewsletterSubscription variant="hero" />

        </div>

        {/* Right Column: Hero Image (Yulia with Dog) */}
        <div className="hero-image-wrapper" id="hero-img-wrap">
          <div className="hero-image-bg-glow" />
          <div className="badge-circle hero-image-ring badge-circle-animated" />
          <img 
            src={SITTER_IMAGES.hero} 
            alt="Yulia with a friendly dog" 
            className="hero-image"
            width={480}
            height={480}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            id="hero-main-img"
          />

          {/* Elegant Glowing Rate Badge Circle (Can be easily enabled/disabled here) */}
          <RateBadgeCircle />
        </div>

      </div>

      {/* Centered Promo Banner at the bottom of Hero */}
      <div className="wrap-wide hero-bottom-banner" id="hero-banner-wrap">
        <TrustedHousesittersBanner variant="banner" />
      </div>
    </section>
  );
};

export default Hero;
