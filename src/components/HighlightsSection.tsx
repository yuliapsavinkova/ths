import React, { useState, useEffect, useRef } from 'react';
import { Laptop, ShieldCheck, Home, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { PawIcon } from './Icons';

interface StarFiveProps {
  size?: number;
  id?: string;
  className?: string;
}

const StarFive: React.FC<StarFiveProps> = ({ size = 22, id, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      id={id}
      className={`star-five-icon ${className || ''}`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      <text 
        x="12" 
        y="14.8" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="7" 
        fontWeight="900" 
        fill="currentColor" 
        textAnchor="middle" 
        stroke="none"
      >
        5
      </text>
    </svg>
  );
};

export const HighlightsSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orbitRadius, setOrbitRadius] = useState(105);
  const [stepCount, setStepCount] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Handle responsive resize checks and dynamic orbit radius
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 600;
      const tablet = width >= 600 && width < 900;
      setIsMobile(mobile);
      setIsTablet(tablet);

      if (mobile) {
        // Maximize circle width on mobile viewports so it spans full screen width
        const availableWidth = Math.min(width - 20, 390);
        const calculatedRadius = Math.round((availableWidth / 2) - 30);
        setOrbitRadius(Math.max(110, calculatedRadius));
      } else if (tablet) {
        setOrbitRadius(145);
      } else {
        setOrbitRadius(185);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iconSize = isMobile ? 20 : isTablet ? 22 : 24;

  const highlights = [
    {
      icon: <Laptop size={iconSize} id="highlight-icon-laptop" />,
      title: "Remote Worker",
      description: "Your pets have constant companionship all day long."
    },
    {
      icon: <PawIcon size={iconSize} id="highlight-icon-paw" />,
      title: "10+ Years Experience",
      description: "Over ten years of loving care for all kinds of pets."
    },
    {
      icon: <ShieldCheck size={iconSize} id="highlight-icon-shield" />,
      title: "Background-Checked",
      description: "Verified safety and care for your home & pets."
    },
    {
      icon: <StarFive size={iconSize} id="highlight-icon-star" />,
      title: "5-Star Reviews",
      description: "Highly rated and trusted by homeowners."
    },
    {
      icon: <Home size={iconSize} id="highlight-icon-home" />,
      title: "Smart Home Tech",
      description: "Experienced with smart systems and home security."
    },
    {
      icon: <Video size={iconSize} id="highlight-icon-video" />,
      title: "Frequent Updates",
      description: "Photo and video updates for peace of mind."
    }
  ];

  const total = highlights.length;
  const degreesPerNode = 360 / total;

  // Auto-scroll interval (only active when isAutoSpinning is true)
  useEffect(() => {
    if (!isAutoSpinning) return;

    const timer = setInterval(() => {
      setStepCount(prev => prev + 1);
    }, 2200);

    return () => clearInterval(timer);
  }, [isAutoSpinning]);

  const activeIndex = ((stepCount % total) + total) % total;
  const wheelRotationAngle = stepCount * degreesPerNode;

  // Update CSS custom properties on DOM nodes directly without inline style JSX props
  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--wheel-deg', `${wheelRotationAngle}deg`);
    }
    if (containerRef.current) {
      containerRef.current.style.setProperty('--orbit-radius', `${orbitRadius}px`);
    }
  }, [wheelRotationAngle, orbitRadius]);

  const handlePrev = () => {
    setIsAutoSpinning(false);
    setStepCount(prev => prev - 1);
  };

  const handleNext = () => {
    setIsAutoSpinning(false);
    setStepCount(prev => prev + 1);
  };

  const handleSelectNode = (index: number) => {
    setIsAutoSpinning(false);
    const diff = index - activeIndex;
    setStepCount(prev => prev + diff);
  };

  const activeHighlight = highlights[activeIndex] || highlights[0];

  return (
    <section 
      id="highlights-section" 
      className="highlights-section-bleed"
    >
      <div className="highlights-bg-overlay" id="highlights-overlay" />

      <div className="wrap-ultrawide stack-md highlights-content" id="highlights-section-wrap">
        {/* Section Header */}
        <div className="highlights-header-container" id="highlights-header">
          <span className="highlights-tag" id="highlights-tag-el">
            <PawIcon size={14} /> Quick Facts
          </span>
          <h2 className="highlights-title" id="highlights-section-title">
            Highlights at a Glance
          </h2>
          <p className="section-subtitle highlights-subtitle" id="highlights-section-subtitle">
            Live-in house sitting and premium pet care tailored to your home.
          </p>
        </div>

        {/* Interactive area containing rotating wheel and central focal card */}
        <div 
          className="highlights-interactive-area" 
          id="highlights-dial-area"
          ref={containerRef}
        >
          <div className="highlights-dial-container" id="highlights-dial-container">
            {/* Rotating wheel wrapper */}
            <div className="highlights-wheel-wrapper" id="highlights-orbit-wrapper">
              {/* Dashed guide path ring */}
              <div className="highlights-track-ring" id="highlights-track-ring" />

              {/* Rotating wheel container */}
              <div 
                className="highlights-wheel" 
                id="highlights-rotating-wheel"
                ref={wheelRef}
              >
                {highlights.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={index}
                      type="button"
                      className={`badge-circle highlights-orbit-node highlights-node-${index} ${isActive ? 'is-active' : ''}`}
                      id={`orbit-node-${index}`}
                      onClick={() => handleSelectNode(index)}
                      aria-label={`View ${item.title}`}
                    >
                      <span className="highlights-node-icon-wrapper" id={`node-icon-${index}`}>
                        {item.icon}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Stationary central focal card */}
              <div className="badge-circle highlights-center-card" id="highlights-focal-card">
                <div className="highlights-center-card-content" id="highlights-focal-content">
                  <div className="badge-circle highlights-center-icon-badge" id="highlights-active-icon-badge">
                    {activeHighlight.icon}
                  </div>
                  <h3 className="highlights-center-title" id="highlights-active-title">
                    {activeHighlight.title}
                  </h3>
                  <p className="highlights-center-desc" id="highlights-active-desc">
                    {activeHighlight.description}
                  </p>
                  
                  {/* Step counter with embedded control arrows < 1 / 6 > inside circle */}
                  <div className="highlights-inner-nav-controls" id="highlights-step-indicator">
                    <button 
                      type="button" 
                      className="highlights-inner-nav-btn" 
                      onClick={handlePrev} 
                      aria-label="Previous highlight"
                      id="highlights-prev-btn"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="highlights-inner-nav-text">
                      <span>{activeIndex + 1}</span> / <span>{total}</span>
                    </span>
                    <button 
                      type="button" 
                      className="highlights-inner-nav-btn" 
                      onClick={handleNext} 
                      aria-label="Next highlight"
                      id="highlights-next-btn"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
