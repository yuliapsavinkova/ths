import React, { useState, useEffect } from 'react';

// Import custom sections/components
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import MapSection from './components/MapSection';
import HighlightsSection from './components/HighlightsSection';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import ShowcaseSection from './components/ShowcaseSection';
import FAQAccordion from './components/FAQAccordion';
import BookMySit from './components/BookMySit';
import FeedbackSection from './components/FeedbackSection';
import Footer from './components/Footer';

export default function App() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
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
      {/* ─── Header / Top Bar ─────────────────────────────── */}
      <Header scrolled={scrolled} />

      <main id="main-content">
        {/* ─── Elegant Hero Section ─────────────────────────────── */}
        <Hero />

        {/* ─── Philosophy & The Narrative Section ─────────────────────────────── */}
        <AboutSection />

        {/* ─── Services / What Is Included Section ─────────────────────────────── */}
        <ServicesSection />

        {/* ─── Primary Service Areas Section ─────────────────────────────── */}
        <MapSection />

        {/* ─── Highlights at a Glance Section ─────────────────────────────── */}
        <HighlightsSection />

        {/* ─── Client Testimonials / Reviews Carousel ─────────────────────────────── */}
        <TestimonialsCarousel />

        {/* ─── Interactive Showcase Album Gallery Section ─────────────────────────── */}
        <ShowcaseSection />

        {/* ─── Accordion FAQ Section ─────────────────────────────── */}
        <FAQAccordion />

        {/* ─── Rates, Planning, and Booking Sections ─────────────────────────────── */}
        <BookMySit />

        {/* ─── Visitor Thoughts & Feedback Section ─────────────────────────────── */}
        <FeedbackSection />
      </main>

      {/* ─── Footer Section ─────────────────────────────── */}
      <Footer />
    </div>
  );
}
