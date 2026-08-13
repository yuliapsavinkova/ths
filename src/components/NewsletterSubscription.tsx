import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PrivacyDisclosure } from './PrivacyDisclosure';

interface NewsletterSubscriptionProps {
  variant?: 'hero' | 'card' | 'inline';
  className?: string;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  variant = 'card',
  className = '',
}) => {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Subscription error:', error);
      setStatus('error');
      setErrorMessage('Could not connect to the server. Please check your internet connection.');
    }
  };

  // Render variant styles
  const getContainerClass = () => {
    switch (variant) {
      case 'hero':
        return `hero-newsletter-box ${className}`;
      case 'inline':
        return `newsletter-inline-container ${className}`;
      case 'card':
      default:
        return `newsletter-card-container ${className}`;
    }
  };

  const isHero = variant === 'hero';

  const innerContent = (
    <>
      {variant !== 'inline' && !isHero && (
        <p className="hero-newsletter-title" id="newsletter-title-el">
          <Mail size={13} className="text-amber-500" />
          Get Yulia's Monthly Updates
        </p>
      )}

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="newsletter-success-wrapper"
          >
            <div className="newsletter-success-title">
              <CheckCircle2 size={18} className="shrink-0" />
              <span className="newsletter-success-title-text">
                Successfully subscribed!
              </span>
            </div>
            <p className="hero-newsletter-success-text" id="newsletter-success-desc">
              ✓ You'll receive my updates and availability.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <form onSubmit={handleSubscribe} className="hero-newsletter-form" id="newsletter-form-el">
              <input
                type="email"
                required
                value={email}
                disabled={status === 'loading'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address..."
                className="hero-newsletter-input"
                id="newsletter-email-input"
                aria-label="Email address for availability updates"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="hero-newsletter-btn flex items-center justify-center gap-2 min-w-[150px]"
                id="newsletter-submit-btn"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  'Keep Me Updated'
                )}
              </button>
            </form>

            {!isHero && (
              <PrivacyDisclosure type="newsletter" align="responsive" />
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-red-500 mt-2 text-xs font-medium"
              >
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (isHero) {
    return (
      <div className="hero-newsletter-wrapper" id={`newsletter-subscription-${variant}`}>
        <div className={`hero-newsletter-box ${className}`}>
          {innerContent}
        </div>
        <div className="hero-newsletter-privacy-under" id="hero-newsletter-privacy-under-el">
          <PrivacyDisclosure type="newsletter" align="responsive" />
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClass()} id={`newsletter-subscription-${variant}`}>
      {innerContent}
    </div>
  );
};

export default NewsletterSubscription;
