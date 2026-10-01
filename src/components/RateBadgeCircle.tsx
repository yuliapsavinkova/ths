import React from 'react';
import { PawIcon } from './Icons';

export interface RateBadgeCircleProps {
  id?: string;
  className?: string;
  onSelectWeek?: () => void;
  onSelectMonth?: () => void;
  activeTier?: 'week' | 'month' | null;
  interactive?: boolean;
}

export const RateBadgeCircle: React.FC<RateBadgeCircleProps> = ({
  id = 'hero-rate-badge-circle',
  className = '',
  onSelectWeek,
  onSelectMonth,
  activeTier: propActiveTier,
  interactive = false,
}) => {
  const [internalActiveTier, setInternalActiveTier] = React.useState<'week' | 'month' | null>(null);
  const activeTier = propActiveTier !== undefined ? propActiveTier : internalActiveTier;
  const isInteractive = interactive || Boolean(onSelectWeek || onSelectMonth);

  const handleWeekClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalActiveTier('week');
    onSelectWeek?.();
  };

  const handleMonthClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalActiveTier('month');
    onSelectMonth?.();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!isInteractive) return;
    if ((e.target as HTMLElement).closest('.badge-rate-btn')) return;
    setInternalActiveTier('month');
    onSelectMonth?.();
  };

  return (
    <div
      className={`badge-circle badge-circle-animated ${className} ${isInteractive ? 'badge-circle-interactive' : ''}`}
      id={id}
      onClick={handleContainerClick}
      title={isInteractive ? 'Click to view & auto-fill trip rates' : undefined}
    >
      <div className="badge-circle-content">
        <PawIcon size={14} className="badge-paw" />
        <span className="badge-title">Rates from</span>
        <span className="badge-rates">
          {isInteractive ? (
            <>
              <button
                type="button"
                onClick={handleMonthClick}
                className={`badge-rate-row badge-rate-btn ${activeTier === 'month' ? 'is-active' : ''}`}
                aria-pressed={activeTier === 'month'}
                title="Book 1 Month Stay"
              >
                <span className="badge-price">$999</span>
                <span className="badge-unit">/month</span>
              </button>
              <button
                type="button"
                onClick={handleWeekClick}
                className={`badge-rate-row badge-rate-btn ${activeTier === 'week' ? 'is-active' : ''}`}
                aria-pressed={activeTier === 'week'}
                title="Book 1 Week Stay"
              >
                <span className="badge-price">$299</span>
                <span className="badge-unit">/week</span>
              </button>
            </>
          ) : (
            <>
              <span className="badge-rate-row">
                <span className="badge-price">$999</span>
                <span className="badge-unit">/month</span>
              </span>
              <span className="badge-rate-row">
                <span className="badge-price">$299</span>
                <span className="badge-unit">/week</span>
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default RateBadgeCircle;
