import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS } from '../data';
import { 
  ChevronDown, 
  MapPin, 
  Home, 
  Clock, 
  CalendarRange, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

const getFAQIcon = (id: string) => {
  switch (id) {
    case 'faq1':
      return MapPin;
    case 'faq2':
      return Home;
    case 'faq3':
      return Clock;
    case 'faq4':
      return CalendarRange;
    case 'faq5':
      return ShieldCheck;
    case 'faq6':
      return AlertTriangle;
    default:
      return Home;
  }
};

export default function FAQAccordion() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  return (
    <div 
      className="faq-box" 
      id="faq-accordion"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      {FAQS.map((faq) => {
        const isOpen = activeId === faq.id;
        const Icon = getFAQIcon(faq.id);

        return (
          <div 
            key={faq.id} 
            className={`faq-card-item ${isOpen ? 'active' : ''}`}
            itemScope 
            itemProp="mainEntity" 
            itemType="https://schema.org/Question"
          >
            <h3 className="faq-question-heading">
              <button
                type="button"
                id={`faq-trigger-${faq.id}`}
                onClick={() => toggleFAQ(faq.id)}
                className="faq-trigger-btn"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <div className="faq-trigger-content-wrapper">
                  <div className="faq-icon-badge" aria-hidden="true">
                    <Icon size={20} />
                  </div>
                  <span className="faq-question-text" itemProp="name">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  aria-hidden="true"
                  className={isOpen ? 'faq-chevron-icon faq-chevron-icon-open' : 'faq-chevron-icon'}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="faq-collapse-body"
                  itemScope 
                  itemProp="acceptedAnswer" 
                  itemType="https://schema.org/Answer"
                >
                  <div className="faq-answer-inner-text">
                    <div className="faq-answer-content">
                      <p itemProp="text">{faq.answer}</p>
                      {faq.linkText && faq.linkUrl && (
                        <div className="faq-link-wrapper">
                          <a 
                            href={faq.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="faq-custom-link hover:underline"
                            aria-label={`${faq.linkText} (opens in a new tab)`}
                          >
                            {faq.linkText}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
