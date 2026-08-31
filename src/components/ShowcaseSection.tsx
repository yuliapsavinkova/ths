import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SHOWCASE_ITEMS } from '../data';
import { ShowcaseItem } from '../types';
import { X, ChevronLeft, ChevronRight, ZoomIn, Play, Heart, Video } from 'lucide-react';
import { PawIcon } from './Icons';
import { useCarousel } from '../utils/carouselUtils';

export default function ShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize likes from localStorage and SHOWCASE_ITEMS
  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    const initialLiked: Record<string, boolean> = {};
    
    SHOWCASE_ITEMS.forEach(item => {
      // Load from localStorage if present
      const storedLikes = localStorage.getItem(`showcase_likes_${item.id}`);
      const storedLiked = localStorage.getItem(`showcase_liked_${item.id}`);
      
      initialLikes[item.id] = storedLikes ? parseInt(storedLikes, 10) : item.initialLikes;
      initialLiked[item.id] = storedLiked === 'true';
    });
    
    setLikesCount(initialLikes);
    setLikedItems(initialLiked);
  }, []);

  // Categories
  const categories = [
    { value: 'all', label: 'All', icon: <PawIcon size={14} className="category-icon" /> },
    { value: 'dogs', label: 'Dogs', icon: <span className="category-emoji">🐶</span> },
    { value: 'cats', label: 'Cats', icon: <span className="category-emoji">🐱</span> },
    { value: 'videos', label: 'Videos', icon: <Video size={14} className="category-icon" /> }
  ];

  // Filtering items based on category
  const filteredItems = SHOWCASE_ITEMS.filter(item => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  // Play video automatically when modal opens with video
  useEffect(() => {
    if (selectedItemIndex !== null) {
      const item = filteredItems[selectedItemIndex];
      if (item?.videoUrl && videoRef.current) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser blocks unmuted autoplay, mute and retry
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }
      }
    }
  }, [selectedItemIndex, filteredItems]);

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent opening lightbox if clicking heart on card
    
    const isLiked = !likedItems[id];
    const currentLikes = likesCount[id] || 0;
    const newLikes = isLiked ? currentLikes + 1 : currentLikes - 1;
    
    setLikedItems(prev => ({ ...prev, [id]: isLiked }));
    setLikesCount(prev => ({ ...prev, [id]: newLikes }));
    
    localStorage.setItem(`showcase_liked_${id}`, String(isLiked));
    localStorage.setItem(`showcase_likes_${id}`, String(newLikes));
  };

  const {
    containerRef: deckContainerRef,
    progressBarRef,
    scrollPrev,
    scrollNext,
    isAtStart,
    isAtEnd,
  } = useCarousel(filteredItems.length, activeCategory);

  // Modal navigation
  const handlePrev = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(prev => {
      if (prev === null) return null;
      return prev === 0 ? filteredItems.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(prev => {
      if (prev === null) return null;
      return prev === filteredItems.length - 1 ? 0 : prev + 1;
    });
  };

  // Handle keyboard arrow keys in modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItemIndex === null) return;
      if (e.key === 'Escape') setSelectedItemIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemIndex, filteredItems]);

  const activeItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <section id="showcase-album-section">
      <div className="wrap-ultrawide stack-xl" id="showcase-wrap">
        
        {/* Header Block */}
        <div className="section-header" id="showcase-header">
          <span className="section-tag">
            <PawIcon size={14} /> Gallery
          </span>
          <h2 className="section-title">
            The Showcase Album
          </h2>
          <p className="section-subtitle">
            Stories, photos, and highlights from my house sits and the pets I've cared for.
          </p>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="showcase-controls" id="showcase-controls-bar">
          {/* Category Tabs */}
          <div className="showcase-categories-scroll">
            <div className="showcase-categories" role="tablist">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={activeCategory === cat.value}
                  className={`app-pill-btn showcase-tab-btn ${activeCategory === cat.value ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.value);
                    setSelectedItemIndex(null); // Reset index on filter change
                  }}
                >
                  <span className="app-pill-icon showcase-tab-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="swipe-deck-wrapper" id="showcase-swipe-deck-box">
          <div className="swipe-deck-inner-wrapper">
            {/* Left Nav Button */}
            <button 
              className="carousel-nav-btn prev" 
              onClick={scrollPrev} 
              disabled={isAtStart || filteredItems.length === 0}
              aria-label="Previous card"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Scrolling Deck Container */}
            <div className="swipe-deck-container" ref={deckContainerRef}>
              {filteredItems.map((item, index) => {
                const isLiked = !!likedItems[item.id];
                const likes = likesCount[item.id] ?? item.initialLikes;
                
                return (
                  <div
                    key={item.id}
                    className={`showcase-card ${item.category}`}
                    onClick={() => setSelectedItemIndex(index)}
                    id={`showcase-card-${item.id}`}
                  >
                    {/* Image container */}
                    <div className="showcase-card-media">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        width={360}
                        height={270}
                        loading="lazy"
                        decoding="async"
                        className="showcase-card-img"
                      />

                      {/* Centered Play Badge for Video cards */}
                      {item.videoUrl && (
                        <div className="showcase-card-video-badge" aria-hidden="true">
                          <div className="showcase-card-play-btn">
                            <Play size={22} className="showcase-card-play-icon" fill="currentColor" />
                          </div>
                        </div>
                      )}
                      
                      {/* Floating Zoom Indicator on Hover */}
                      <div className="showcase-card-overlay">
                        <div className="showcase-zoom-indicator">
                          {item.videoUrl ? (
                            <>
                              <Play size={16} className="showcase-zoom-icon showcase-zoom-icon-play" />
                              <span className="showcase-zoom-label">Watch Video</span>
                            </>
                          ) : (
                            <>
                              <ZoomIn size={20} className="showcase-zoom-icon" />
                              <span className="showcase-zoom-label">View Story</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Likes & Category Badges */}
                      <div className="showcase-card-badges">
                        <span className="showcase-card-tag-pill">
                          {item.category === 'videos' && <Video size={12} className="tag-icon" />}
                          {item.category === 'dogs' && <span className="tag-emoji">🐶</span>}
                          {item.category === 'cats' && <span className="tag-emoji">🐱</span>}
                          <span className="tag-text">{item.category}</span>
                        </span>
                        <button 
                          className={`showcase-card-like-pill ${isLiked ? 'liked' : ''}`}
                          onClick={(e) => handleLike(item.id, e)}
                          title={isLiked ? "Unlike" : "Love this"}
                        >
                          <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
                          {/* <span>{likes}</span> */}
                        </button>
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="showcase-card-details">
                      <div className="showcase-card-header">
                        <span className="showcase-card-location">{item.location} • {item.year}</span>
                      </div>
                      <h3 className="showcase-card-title">{item.title}</h3>
                      <p className="showcase-card-pet-name">
                        {item.category === 'videos' ? '🎥' : '🐾'} {item.petName}
                      </p>
                      <p className="showcase-card-excerpt">
                        {item.description}
                      </p>
                      
                      <div className="showcase-card-footer">
                        <span className="showcase-card-action">Read story →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Nav Button */}
            <button 
              className="carousel-nav-btn next" 
              onClick={scrollNext} 
              disabled={isAtEnd || filteredItems.length === 0}
              aria-label="Next card"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {filteredItems.length === 0 && (
            <div className="showcase-empty" id="showcase-empty-state">
              <div className="showcase-empty-icon">📂</div>
              <h3>No matching memories found</h3>
              <p>Try resetting your active category filter to see all logs.</p>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setActiveCategory('all');
                }}
              >
                Show All Memories
              </button>
            </div>
          )}

          {filteredItems.length > 0 && (
            /* Centered Progress Track */
            <div className="swipe-progress-track-wrapper" id="showcase-progress-track-wrapper">
              <div className="swipe-progress-track">
                <div
                  ref={progressBarRef}
                  className="swipe-progress-bar"
                />
              </div>
            </div>
          )}
        </div>

        {/* Lightbox / Immersive Story Modal */}
        <AnimatePresence>
          {activeItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="showcase-modal-backdrop"
              onClick={() => setSelectedItemIndex(null)}
              role="dialog"
              aria-modal="true"
              id="showcase-modal-portal"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="showcase-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Controls Bar: Category Badge (left) & Actions (Heart + Close) (right) */}
                <div className="showcase-modal-top-bar">
                  <span className="showcase-modal-tag-pill">
                    {activeItem.category === 'videos' && <Video size={16} className="tag-icon" />}
                    {activeItem.category === 'dogs' && <span className="tag-emoji">🐶</span>}
                    {activeItem.category === 'cats' && <span className="tag-emoji">🐱</span>}
                    <span className="tag-text">{activeItem.category}</span>
                  </span>

                  <div className="showcase-modal-top-actions">
                    <button 
                      className={`showcase-modal-action-btn showcase-modal-like-btn ${likedItems[activeItem.id] ? 'liked' : ''}`}
                      onClick={(e) => handleLike(activeItem.id, e)}
                      title={likedItems[activeItem.id] ? 'Unlike' : 'Love this'}
                      aria-label={likedItems[activeItem.id] ? 'Unlike' : 'Love this'}
                    >
                      <Heart size={16} fill={likedItems[activeItem.id] ? 'currentColor' : 'none'} />
                    </button>

                    <button 
                      className="showcase-modal-action-btn showcase-modal-close-btn"
                      onClick={() => setSelectedItemIndex(null)}
                      aria-label="Close modal"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Dual Column Layout */}
                <div className="showcase-modal-columns">
                  
                  {/* Left Column: Premium Media Area */}
                  <div className="showcase-modal-media-col">
                    {activeItem.videoUrl ? (
                      <video 
                        ref={videoRef}
                        key={`showcase-video-${activeItem.id}`}
                        src={activeItem.videoUrl}
                        poster={activeItem.imageUrl}
                        controls
                        autoPlay
                        playsInline
                        preload="auto"
                        className="showcase-modal-main-video"
                      >
                        <source src={activeItem.videoUrl} type="video/quicktime" />
                        <source src={activeItem.videoUrl} type="video/mp4" />
                        {/* 
                        <track 
                          kind="captions" 
                          src="/captions.vtt" 
                          srcLang="en" 
                          label="English captions" 
                          default 
                        /> 
                        */}
                        Your browser does not support playing this video.
                      </video>
                    ) : (
                      <img 
                        src={activeItem.imageUrl} 
                        alt={activeItem.title} 
                        width={640}
                        height={480}
                        decoding="async"
                        className="showcase-modal-main-img"
                      />
                    )}
                  </div>

                  {/* Right Column: Narrative Content Area */}
                  <div className="showcase-modal-text-col">
                    <div className="showcase-modal-text-wrapper">
                      
                      {/* Location & Year meta */}
                      <div className="showcase-modal-meta">
                        <span className="showcase-modal-loc-text">{activeItem.location}</span>
                        <span className="showcase-modal-meta-divider">•</span>
                        <span className="showcase-modal-year-text">{activeItem.year}</span>
                      </div>

                      {/* Header Title */}
                      <h3 className="showcase-modal-title">{activeItem.title}</h3>

                      {/* Pet Name directly under title (matching card hierarchy) */}
                      <p className="showcase-modal-pet-name">
                        <span className="pet-icon">{activeItem.category === 'videos' ? '🎥' : '🐾'}</span>
                        <span>{activeItem.petName}</span>
                      </p>

                      {/* Fully Expressive narrative description */}
                      <div className="showcase-modal-story-section">
                        <p className="showcase-modal-description">{activeItem.description}</p>
                      </div>

                    </div>

                    {/* Footer bar with Prev/Next navigation and pagination */}
                    <div className="showcase-modal-footer">
                      <button 
                        className="showcase-modal-nav-link-btn" 
                        onClick={handlePrev}
                        aria-label="Previous story"
                      >
                        <ChevronLeft size={16} /> Prev
                      </button>

                      <div className="showcase-modal-pagination-number">
                        Slide <strong>{selectedItemIndex !== null ? selectedItemIndex + 1 : 0}</strong> of <strong>{filteredItems.length}</strong>
                      </div>

                      <button 
                        className="showcase-modal-nav-link-btn" 
                        onClick={handleNext}
                        aria-label="Next story"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
