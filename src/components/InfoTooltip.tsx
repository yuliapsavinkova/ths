import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export interface InfoTooltipProps {
  /** Text or React element content inside the tooltip callout */
  content: React.ReactNode;
  /** Size in pixels for the Info icon (defaults to 14) */
  iconSize?: number;
  /** Accessible ARIA label for screen readers */
  ariaLabel?: string;
  /** Tooltip position relative to the icon: 'top' | 'bottom' */
  position?: 'top' | 'bottom';
  /** Tooltip horizontal alignment relative to the icon: 'left' | 'center' | 'right' */
  align?: 'left' | 'center' | 'right';
  /** Optional custom CSS class name */
  className?: string;
}

/**
  * Reusable InfoTooltip Component
  * Displays a subtle Info icon with a high-contrast, crystal-clear tooltip callout on hover, focus, or tap.
  */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  iconSize = 14,
  ariaLabel = 'More information',
  position = 'top',
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLButtonElement>(null);

  const toggleTooltip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <button
      type="button"
      ref={wrapperRef}
      className={`app-tooltip-wrapper position-${position} align-${align} ${isOpen ? 'is-open' : ''} ${className}`.trim()}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      onClick={toggleTooltip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }}
    >
      <Info size={iconSize} className="app-tooltip-icon" aria-hidden="true" />
      <span className="app-tooltip-box" role="tooltip">
        {content}
      </span>
    </button>
  );
};

export default InfoTooltip;
