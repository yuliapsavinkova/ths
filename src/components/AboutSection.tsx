import React, { useState, useEffect } from 'react';
import { PawIcon, ShieldIcon, CodeIcon, HomeIcon } from './Icons';
import { SITTER_IMAGES, TESTIMONIALS } from '../data';

export const AboutSection: React.FC = () => {
  const coreReviews = TESTIMONIALS.filter(item => item.core);
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
          <h2 className="section-title">
            How It Works
          </h2>
          <p className="section-subtitle">
            A way to keep your home safe and your pets happy in their own homes.
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
                  Whether you have pets or just want someone to look after your house, I keep everything running smoothly while you are away. Your pets can stay in their familiar surroundings and keep their normal routines, while your home remains safe and lived-in. I will water your plants, collect your mail, and handle small household tasks, so you can return to a perfectly cared-for home.
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
                  I'm Yulia, a remote software engineer. I work full-time from the homes where I sit, which means I'm there throughout the day to keep your pets company. They won't have to spend long hours alone—their meals, walks, playtime, and any medications stay right on schedule. Plus, your home gets the security of having a responsible person living in it instead of sitting empty.
                </p>
                <p className="large about-additional-para">
                  If you'd like to learn more about my professional background, you can{' '}
                  <a 
                    href="https://yuliapsavinkova.github.io/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-brand font-semibold text-underline"
                  >
                    view my portfolio
                  </a>.
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
                  I have spent my whole life around animals and have house-sat for years. I have cared for dogs, cats, other small pets, and homes without pets.
                </p>
                <p className="large about-additional-para">
                  I will send you frequent photo and video updates while you're away so you always know how your pets are doing. I keep a close eye on your home's security and upkeep, and I have a clean background check and verified five-star reviews from other homeowners, so you can travel without any worries.
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
              <p className="pullquote-text">
                "{activeReview.quote}"
              </p>
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
