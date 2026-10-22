import React, { useState } from 'react';
import { TESTIMONIALS, REVIEWS_LINK } from '../data';
import { Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '../utils/carouselUtils';
import { PawIcon } from './Icons';

export default function TestimonialsCarousel() {
  const {
    containerRef: deckContainerRef,
    progressBarRef,
    scrollPrev,
    scrollNext,
    isAtStart,
    isAtEnd,
    canScroll,
  } = useCarousel(TESTIMONIALS.length);

  return (
    <section id="testimonials-section">
      <div className="wrap-ultrawide" id="testimonials-section-wrap">
        <div className="section-header" id="testimonials-section-header">
          <span className="section-tag">
            <PawIcon size={14} /> Reviews
          </span>
          <h2 className="section-title">What Home Owners Say</h2>
          <p className="section-subtitle">
            Reviews from homeowners who trusted me with their homes and pets.
          </p>
        </div>

        <div className="testimonials-interactive-wrapper" id="testimonials-root">
          {/* Swipe Deck Layout */}
          <div className="swipe-deck-wrapper" id="swipe-deck-box">
            {/* Relative Inner Wrapper for Side Arrows */}
            <div className={`swipe-deck-inner-wrapper ${!canScroll ? 'no-scroll' : ''}`}>
              {/* Left Arrow Button */}
              <button
                className="carousel-nav-btn prev"
                onClick={scrollPrev}
                disabled={isAtStart}
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Scrolling Deck */}
              <div
                className={`swipe-deck-container ${!canScroll ? 'is-centered' : ''}`}
                ref={deckContainerRef}
              >
                {TESTIMONIALS.map((item) => (
                  <SwipeTestimonialCard key={item.id} item={item} />
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                className="carousel-nav-btn next"
                onClick={scrollNext}
                disabled={isAtEnd}
                aria-label="Next testimonials"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Centered Progress Track */}
            {canScroll && (
              <div
                className="swipe-progress-track-wrapper"
                id="testimonials-progress-track-wrapper"
              >
                <div className="swipe-progress-track">
                  <div ref={progressBarRef} className="swipe-progress-bar" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SwipeTestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 160;
  const isLong = item.quote.length > maxLength;

  const displayQuote = isExpanded 
    ? item.quote 
    : isLong 
      ? `${item.quote.slice(0, maxLength)}` 
      : item.quote;

  return (
    <div className="swipe-testimonial-card">
      {/* Top Row: Sitter client details & Rating */}
      <div className="swipe-card-top-row">
        <div className="swipe-client-info">
          <strong className="swipe-author-line">{item.author}</strong>
          <div className="swipe-meta-line">
            <MapPin size={11} />
            <span>{item.location}</span>
          </div>
        </div>
        <div className="swipe-stars-container">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill="currentColor" />
          ))}
        </div>
      </div>

      {/* Pet Row: Pet names on left, larger pet images on right */}
      {/*<div className="swipe-card-pet-row">
        <div className="swipe-pet-details">
          <span className="swipe-pet-label">Pets cared for</span>
          <strong className="swipe-card-pets">
            {item.petNames}
          </strong>
        </div>
        <div className="swipe-avatars-group">
          {item.petImages && item.petImages.map((imgUrl, idx) => (
            <img 
              key={idx}
              src={imgUrl} 
              alt={`${item.petNames} cared for by Yulia in ${item.location}`} 
              className="swipe-avatar" 
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
      </div>*/}

      {/* Review Text with Modern Toggle */}
      <div className="swipe-testimonial-text-container">
        <p className="swipe-testimonial-text">
          "{displayQuote}"
          {!isExpanded && isLong && <span className="swipe-ellipsis">...</span>}
        </p>
        {isLong && (
          <button 
            className="swipe-read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Read less review' : 'Read full review'}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}
