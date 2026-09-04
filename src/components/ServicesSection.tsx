import React from 'react';
import { Heart, Home, Shield, Sparkles } from 'lucide-react';
import { PawIcon } from './Icons';
import { SITTER_IMAGES } from '../data';

export const ServicesSection: React.FC = () => {
  return (
    <section id="services-section">
      <div className="wrap stack-xl" id="services-section-wrap">
        <div className="section-header" id="services-header">
          <span className="section-tag">
            <PawIcon size={14} /> Services
          </span>
          <h2 className="section-title">What Is Included</h2>
          <p className="section-subtitle">
            A comprehensive list of professional live-in care and home management services.
          </p>
        </div>

        <div className="services-grid" id="services-grid-el">
          {/* Card 1: Daily Pet Care */}
          <div className="app-card services-card" id="srv-card-pet">
            <div className="app-card-image-wrapper services-card-image-wrapper">
              <img
                src={SITTER_IMAGES.includedCards.dailyPetCare}
                alt="A happy pet enjoying daily walks and attention"
                className="app-card-image services-card-image"
                width={360}
                height={240}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="app-card-content services-card-content">
              <div className="app-card-header services-card-header">
                <div className="app-card-icon-box services-card-icon-box">
                  <Heart size={20} />
                </div>
                <h3 className="app-card-title services-card-title">Daily Pet Care</h3>
              </div>
              <ul className="package-features">
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Feeding & fresh water</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Daily walks & exercise</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Brushing & grooming</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Playtime & companionship</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Following existing routines</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Home & Property Care */}
          <div className="app-card services-card" id="srv-card-home">
            <div className="app-card-image-wrapper services-card-image-wrapper">
              <img
                src={SITTER_IMAGES.includedCards.homePropertyCare}
                alt="Meticulously maintained clean home with pool/plants stewardship"
                className="app-card-image services-card-image"
                width={360}
                height={240}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="app-card-content services-card-content">
              <div className="app-card-header services-card-header">
                <div className="app-card-icon-box services-card-icon-box">
                  <Home size={20} />
                </div>
                <h3 className="app-card-title services-card-title">Home & Property Care</h3>
              </div>
              <ul className="package-features">
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Watering & care for plants</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Collecting mail & packages</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Keeping home clean & tidy</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Managing security & alarms</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Reporting any home issues</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Specialized Care */}
          <div className="app-card services-card" id="srv-card-special">
            <div className="app-card-image-wrapper services-card-image-wrapper">
              <img
                src={SITTER_IMAGES.includedCards.specializedCare}
                alt="Caring for a gentle senior pet with love and precision"
                className="app-card-image services-card-image"
                width={360}
                height={240}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="app-card-content services-card-content">
              <div className="app-card-header services-card-header">
                <div className="app-card-icon-box services-card-icon-box">
                  <Shield size={20} />
                </div>
                <h3 className="app-card-title services-card-title">Specialized Care</h3>
              </div>
              <ul className="package-features">
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Medication administration</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Senior pet care</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>High-energy pets</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Shy or anxious pets</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Puppies & kittens</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 4: Additional Services */}
          <div className="app-card services-card" id="srv-card-nopets">
            <div className="app-card-image-wrapper services-card-image-wrapper">
              <img
                src={SITTER_IMAGES.includedCards.noPetsProbs}
                alt="A beautiful maintained yard/garden area representing empty home stewardship"
                className="app-card-image services-card-image"
                width={360}
                height={240}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="app-card-content services-card-content">
              <div className="app-card-header services-card-header">
                <div className="app-card-icon-box services-card-icon-box">
                  <Sparkles size={20} />
                </div>
                <h3 className="app-card-title services-card-title">Other Care</h3>
              </div>
              <ul className="package-features">
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Bunnies, hamsters, parrots & chickens</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Fish, turtles, lizards & dragons</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Coordinating maintenance visits</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Light garden & patio care</span>
                </li>
                <li className="package-feature-item">
                  <PawIcon size={14} className="services-paw-bullet" />
                  <span>Regular photo & video updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
