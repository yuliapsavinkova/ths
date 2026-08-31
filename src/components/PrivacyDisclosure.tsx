import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ShieldCheck, Info } from 'lucide-react';

export type DisclosureType = 'booking' | 'newsletter' | 'trustedhousesitters' | 'custom';

export interface PrivacyDisclosureProps {
  type?: DisclosureType;
  label?: string;
  content?: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'responsive';
  theme?: 'light' | 'dark';
  className?: string;
}

export const PrivacyDisclosure: React.FC<PrivacyDisclosureProps> = ({
  type = 'booking',
  label,
  content,
  align = 'center',
  theme,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentTheme = theme || (type === 'newsletter' || type === 'trustedhousesitters' ? 'dark' : 'light');

  const defaultContent: Record<string, { label: string; full: React.ReactNode; icon: 'shield' | 'info' }> = {
    booking: {
      label: 'Privacy Notice',
      full: 'I only use your contact details to reply directly to your sitting requests. Your information is never shared or sold.',
      icon: 'shield',
    },
    newsletter: {
      label: 'Privacy Notice',
      full: 'I only use your email to send my monthly availability and updates. I never sell or share your contact info.',
      icon: 'shield',
    },
    trustedhousesitters: {
      label: 'Learn More',
      full: (
        <span>
          <strong>TrustedHousesitters</strong> is a global community of pet lovers exchanging in-home pet care for unique home-stays around the world.
        </span>
      ),
      icon: 'info',
    },
  };

  const activeData = defaultContent[type] || defaultContent.booking;
  const displayLabel = label || activeData.label;
  const displayContent = content || activeData.full;
  const IconComponent = activeData.icon === 'info' ? Info : ShieldCheck;

  return (
    <div className={`privacy-disclosure-container theme-${currentTheme} align-${align} type-${type} ${className}`.trim()}>
      <div className="privacy-toggle-wrapper">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="privacy-toggle-btn"
          aria-expanded={isOpen}
          aria-label={`${displayLabel} details`}
        >
          <IconComponent size={13} className="privacy-icon" aria-hidden="true" />
          <span className="privacy-toggle-link">
            {displayLabel}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown size={11} className="privacy-toggle-chevron" aria-hidden="true" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="privacy-box-content">
              {displayContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivacyDisclosure;


