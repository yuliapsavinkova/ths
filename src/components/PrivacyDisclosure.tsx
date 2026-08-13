import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ShieldCheck } from 'lucide-react';

interface PrivacyDisclosureProps {
  type: 'booking' | 'newsletter';
  align?: 'left' | 'center' | 'right' | 'responsive';
  theme?: 'light' | 'dark';
}

export const PrivacyDisclosure: React.FC<PrivacyDisclosureProps> = ({
  type,
  align = 'center',
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentTheme = theme || (type === 'newsletter' ? 'dark' : 'light');

  const content = {
    booking: {
      label: "Privacy Notice",
      full: "I only use your contact details to reply directly to your sitting requests. Your information is never shared or sold."
    },
    newsletter: {
      label: "Privacy Notice",
      full: "I only use your email to send my monthly availability and updates. I never sell or share your contact info."
    }
  };

  const current = content[type];

  return (
    <div className={`privacy-disclosure-container theme-${currentTheme} align-${align} type-${type}`}>
      <div className="privacy-toggle-wrapper">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="privacy-toggle-btn"
        >
          <ShieldCheck size={13} className="privacy-icon" />
          <span className="privacy-toggle-link">
            {current.label}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown size={11} className="privacy-toggle-chevron" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="privacy-box-content">
              {current.full}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


