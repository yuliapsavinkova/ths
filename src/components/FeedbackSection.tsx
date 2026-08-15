import React, { useState, FormEvent } from 'react';
import { 
  Send, 
  Check, 
  RotateCcw, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { PawIcon } from './Icons';

export const FeedbackSection: React.FC = () => {
  const [message, setMessage] = useState<string>('');
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
          message: message.trim()
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
              Have Feedback or Suggestions?
            </h2>
            <p className="feedback-subtitle" id="feedback-subtitle-desc">
              I'd love to hear from you.
            </p>
          </div>

          {isSuccess ? (
            <div className="feedback-success-box" id="feedback-success-state" role="status" aria-live="polite">
              <div className="feedback-success-icon" id="feedback-success-icon-el">
                <Check size={28} />
              </div>
              <h3 className="feedback-success-title" id="feedback-success-heading">
                Thank You for Your Feedback!
              </h3>
              <p className="feedback-success-desc" id="feedback-success-message">
                Your message has been sent directly to my inbox.
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
              
              {/* Simplified Message field */}
              <div className="feedback-field" id="feedback-message-field-box">
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
                  <span>{remainingChars} chars left</span>
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
