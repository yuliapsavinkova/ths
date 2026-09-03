import React, { useState, useEffect } from 'react';

// Import custom sections/components
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import HighlightsSection from './components/HighlightsSection';
import ServicesSection from './components/ServicesSection';
import BookMySit from './components/BookMySit';
import FAQAccordion from './components/FAQAccordion';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import Footer from './components/Footer';
import ShowcaseSection from './components/ShowcaseSection';
import FeedbackSection from './components/FeedbackSection';
import { PawIcon } from './components/Icons';

export default function App() {
  const [selectedDuration] = useState<number>(30);
  const [selectedPetType] = useState<'dog' | 'cat' | 'mixed' | 'other' | 'none'>('none');
  const [selectedPetCount] = useState<number>(0);
  const [selectedHasMedications] = useState<boolean>(false);
  const [selectedHasSeniorPets] = useState<boolean>(false);
  const [selectedStartDate] = useState<string>('');
  const [selectedEndDate] = useState<string>('');

  const [scrolled, setScrolled] = useState<boolean>(false);

  // Guarantee clean top alignment on initial page load on iPhone / iOS Safari
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

      // Compensate for iOS Safari initial layout recalculation and dynamic chrome shifts
      const raf = requestAnimationFrame(() => {
        if (!window.location.hash && window.scrollY > 0 && window.scrollY < 120) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        }
      });
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="app-root">
      {/* ─── Premium Header / Top Bar ─────────────────────────────── */}
      <Header scrolled={scrolled} />

      <main id="main-content">
        {/* ─── Elegant Hero Section ─────────────────────────────── */}
        <Hero />

        {/* ─── Philosophy & The Narrative Section ─────────────────────────────── */}
        <AboutSection />

        {/* ─── Services / What Is Included Section ─────────────────────────────── */}
        <ServicesSection />

        {/* ─── Highlights at a Glance Section ─────────────────────────────── */}
        <HighlightsSection />

        {/* ─── Client Testimonials / Reviews Carousel ─────────────────────────────── */}
        <section id="testimonials-section">
          <div className="wrap-ultrawide stack-xl" id="testimonials-section-wrap">
            <div className="section-header" id="testimonials-section-header">
              <span className="section-tag">
                <PawIcon size={14} /> Reviews
              </span>
              <h2 className="section-title">What Home Owners Say</h2>
              <p className="section-subtitle">
                Reviews from homeowners who trusted me with their homes and pets.
              </p>
            </div>

            <TestimonialsCarousel />
          </div>
        </section>

        {/* ─── Interactive Showcase Album Gallery Section ─────────────────────────── */}
        <ShowcaseSection />

        {/* ─── Accordion FAQ Section ─────────────────────────────── */}
        <section id="faq-section">
          <div className="wrap-narrow stack-xl" id="faq-section-wrap">
            <div className="section-header" id="faq-section-header">
              <span className="section-tag">
                <PawIcon size={14} /> FAQS
              </span>
              <h2 className="section-title">Common Questions</h2>
              <p className="section-subtitle">
                Answers to common queries about live-in requirements, routines, and property
                coordination.
              </p>
            </div>
            <FAQAccordion />
          </div>
        </section>

        {/* ─── Rates, Planning, and Booking Section ─────────────────────────────── */}
        <section id="booking-form-section">
          <div className="wrap stack-xl" id="booking-section-wrap">
            <div className="section-header" id="booking-section-header">
              <span className="section-tag">
                <PawIcon size={14} /> Book A Sit
              </span>
              <h2 className="section-title">Your Trip Details</h2>
              <p className="section-subtitle">
                Tell me about your travel dates, location, pets, and any special needs.
              </p>
            </div>

            <BookMySit
              initialDuration={selectedDuration}
              initialPetType={selectedPetType}
              initialPetCount={selectedPetCount}
              initialHasMedications={selectedHasMedications}
              initialHasSeniorPets={selectedHasSeniorPets}
              initialStartDate={selectedStartDate}
              initialEndDate={selectedEndDate}
            />
          </div>
        </section>

        {/* ─── Visitor Thoughts & Feedback Section ─────────────────────────────── */}
        <FeedbackSection />
      </main>

      {/* ─── Footer Section ─────────────────────────────── */}
      <Footer />
    </div>
  );
}
