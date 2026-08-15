import React, { useState, FormEvent } from 'react';
import { 
  Lightbulb, 
  MessageCircle, 
  HelpCircle, 
  Heart, 
  Send, 
  Check, 
  RotateCcw, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { PawIcon } from './Icons';

type FeedbackCategory = 'Suggestion' | 'Thoughts' | 'Question' | 'Praise';

interface CategoryOption {
  id: FeedbackCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'Suggestion', label: 'Suggestion', icon: <Lightbulb size={14} /> },
  { id: 'Thoughts', label: 'Thoughts', icon: <MessageCircle size={14} /> },
  { id: 'Question', label: 'Question', icon: <HelpCircle size={14} /> },
  { id: 'Praise', label: 'Praise', icon: <Heart size={14} /> }
];

export const FeedbackSection: React.FC = () => {
  const [category, setCategory] = useState<FeedbackCategory>('Suggestion');
  const [message, setMessage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxChars = 1000;
  const remainingChars = maxChars - message.length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Please type your feedback before sending.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message.trim(),
          category,
          name: name.trim(),
          email: email.trim()
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || (data && data.success === false)) {
        throw new Error(data?.message || 'Failed to submit feedback. Please try again.');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Feedback submit error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setName('');
    setEmail('');
    setCategory('Suggestion');
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <section id="feedback-section" className="feedback-section" aria-labelledby="feedback-section-title">
      <div className="feedback-container" id="feedback-container-wrap">
        
        <div className="feedback-card" id="feedback-main-card">
          
          {/* Header */}
          <div className="feedback-header" id="feedback-header-box">
            <span className="feedback-badge" id="feedback-badge-tag">
              <PawIcon size={12} /> Thoughts?
            </span>
            <h2 className="feedback-title" id="feedback-section-title">
              Have Thoughts or Ideas?
            </h2>
            <p className="feedback-subtitle" id="feedback-subtitle-desc">
              Have suggestions to make the site better, a quick question, or thoughts to share? I'd love to hear directly from you!
            </p>
          </div>

          {isSuccess ? (
            <div className="feedback-success-box" id="feedback-success-state" role="status" aria-live="polite">
              <div className="feedback-success-icon" id="feedback-success-icon-el">
                <Check size={28} />
              </div>
              <h3 className="feedback-success-title" id="feedback-success-heading">
                Thank You for Your Thoughts!
              </h3>
              <p className="feedback-success-desc" id="feedback-success-message">
                Your message has been sent directly to my inbox. I deeply appreciate your time and feedback!
              </p>
              <button 
                type="button" 
                className="feedback-reset-btn" 
                id="feedback-reset-action-btn"
                onClick={handleReset}
              >
                <RotateCcw size={14} /> Send Another Note
              </button>
            </div>
          ) : (
            <form className="feedback-form" id="feedback-submission-form" onSubmit={handleSubmit} noValidate>
              
              {/* Category selector */}
              <div className="feedback-field" id="feedback-categories-group">
                <span className="feedback-categories-label" id="feedback-categories-label-el">
                  Category
                </span>
                <div className="feedback-categories-wrap" id="feedback-categories-pills-wrap" role="radiogroup" aria-label="Feedback category">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      id={`feedback-cat-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`feedback-category-btn ${category === cat.id ? 'active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                      role="radio"
                      aria-checked={category === cat.id}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message field */}
              <div className="feedback-field" id="feedback-message-field-box">
                <label htmlFor="feedback-message-input" className="feedback-label">
                  Your Message <span className="feedback-required-mark">*</span>
                </label>
                <textarea
                  id="feedback-message-input"
                  className="feedback-textarea"
                  placeholder="Share your thoughts, ideas, or suggestions..."
                  value={message}
                  onChange={(e) => {
                    if (e.target.value.length <= maxChars) {
                      setMessage(e.target.value);
                    }
                  }}
                  rows={4}
                  required
                />
                <div className="feedback-textarea-meta">
                  <span>Constructive thoughts are always welcome</span>
                  <span>{remainingChars} chars left</span>
                </div>
              </div>

              {/* Sender info (optional) */}
              <div className="feedback-inputs-row" id="feedback-contact-row">
                <div className="feedback-field" id="feedback-name-field-box">
                  <label htmlFor="feedback-name-input" className="feedback-label">
                    Your Name <span className="feedback-label-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="feedback-name-input"
                    className="feedback-input"
                    placeholder="e.g. Sarah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div className="feedback-field" id="feedback-email-field-box">
                  <label htmlFor="feedback-email-input" className="feedback-label">
                    Your Email <span className="feedback-label-optional">(Optional, for reply)</span>
                  </label>
                  <input
                    type="email"
                    id="feedback-email-input"
                    className="feedback-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={120}
                  />
                </div>
              </div>

              {/* Error banner if any */}
              {errorMessage && (
                <div className="feedback-error-banner" id="feedback-error-alert" role="alert">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions & Submit */}
              <div className="feedback-actions" id="feedback-actions-bar">
                <button
                  type="submit"
                  id="feedback-submit-btn"
                  className="feedback-submit-btn"
                  disabled={isSubmitting || !message.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles size={16} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};

export default FeedbackSection;
