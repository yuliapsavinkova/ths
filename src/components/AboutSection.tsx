import React, { useState, useEffect } from 'react';
import { PawIcon, ShieldIcon, CodeIcon, HomeIcon } from './Icons';
import { SITTER_IMAGES, TESTIMONIALS } from '../data';

export const AboutSection: React.FC = () => {
  const coreReviews = TESTIMONIALS.filter((item) => item.core);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (coreReviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coreReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [coreReviews.length]);

  const activeReview = coreReviews[currentIndex] || TESTIMONIALS[0];

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="about-section">
      <div className="wrap stack-xl" id="about-section-wrap">
        {/* Section Header */}
        <div className="section-header text-center align-center" id="about-header">
          <span className="section-tag">
            <PawIcon size={14} /> About
          </span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Keep your home safe and your pets happy in the comfort of their own home.
          </p>
        </div>

        {/* Combined 3 Staggered Rows */}
        <div className="stack-xl" id="about-split-rows">
          {/* Row 1: The Idea */}
          <div className="split-section" id="about-split-1">
            <div className="split-content">
              <h3 className="split-title-with-icon">
                <div className="split-icon-box">
                  <HomeIcon size={20} className="split-icon" />
                </div>
                <span>The Idea</span>
              </h3>
              <div className="column-text">
                <p className="large">
                  Whether you have pets or just want someone to look after your house, I keep
                  everything running smoothly while you are away. Your pets can stay in their
                  familiar surroundings and keep their normal routines, while your home remains safe
                  and lived-in. I will water your plants, collect your mail, and handle small
                  household tasks, so you can return to a perfectly cared-for home.
                </p>
              </div>
            </div>

            <div className="split-image-wrapper">
              <img
                src={SITTER_IMAGES.advantageTrip}
                alt="Happy dog resting comfortably on a living room sofa"
                className="split-image"
                width={400}
                height={300}
                loading="lazy"
                decoding="async"
              />
              <div className="split-image-accent" />
            </div>
          </div>

          {/* Row 2: Who I Am (Alternate) */}
          <div className="split-section split-section-alternate" id="about-split-2">
            <div className="split-content">
              <h3 className="split-title-with-icon">
                <div className="split-icon-box">
                  <CodeIcon size={20} className="split-icon" />
                </div>
                <span>Who I Am</span>
              </h3>
              <div className="column-text">
                <p className="large">
                  I'm Yulia, a remote software engineer, so I'm home most of the time. When I'm
                  house- and pet-sitting, your pets have consistent company throughout the day.
                  Meals, walks, playtime, and any medications stay right on schedule, and I'm always
                  nearby if something unexpected comes up. Your home also gets the security of a
                  responsible person living in it, rather than sitting empty.
                </p>
              </div>
            </div>

            <div className="split-image-wrapper">
              <img
                src={SITTER_IMAGES.ideaCards.whoIAm}
                alt="Remote work setup with a cozy pet companion"
                className="split-image"
                width={400}
                height={300}
                loading="lazy"
                decoding="async"
              />
              <div className="split-image-accent" />
            </div>
          </div>

          {/* Row 3: Experience & Trust */}
          <div className="split-section" id="about-split-3">
            <div className="split-content">
              <h3 className="split-title-with-icon">
                <div className="split-icon-box">
                  <ShieldIcon size={20} className="split-icon" />
                </div>
                <span>Experience &amp; Trust</span>
              </h3>
              <div className="column-text">
                <p className="large">
                  I’ve spent my whole life around animals and have been house-sitting for years.
                  I’ve cared for dogs, cats, other small pets, and homes without pets.
                </p>
                <p className="large about-additional-para">
                  You’ll receive frequent photo and video updates, so you always know how your pets
                  are doing. I keep a close eye on your home’s security and upkeep, and with a clean
                  background check and verified five-star reviews from other homeowners, you can
                  travel with complete peace of mind.
                </p>
              </div>
            </div>

            <div className="split-image-wrapper">
              <img
                src={SITTER_IMAGES.ideaCards.experienceTrust}
                alt="A happy well-cared for pet showing trust"
                className="split-image"
                width={400}
                height={300}
                loading="lazy"
                decoding="async"
              />
              <div className="split-image-accent" />
            </div>
          </div>
        </div>

        {/* Pullquote (Centered / Rotating) */}
        {activeReview && (
          <div className="pullquote about-pullquote-container" id="about-pullquote">
            <div key={activeReview.id} className="pullquote-fade-active">
              <p className="pullquote-text">"{activeReview.quote}"</p>
              <cite className="pullquote-author">
                {activeReview.author} — {activeReview.location}
              </cite>
            </div>

            {coreReviews.length > 1 && (
              <div className="pullquote-dots">
                {coreReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`pullquote-dot ${idx === currentIndex ? 'active' : ''}`}
                    aria-label={`Go to review ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
