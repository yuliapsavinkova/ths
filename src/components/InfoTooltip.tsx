import React from 'react';
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
  * Displays a subtle Info icon with a high-contrast, crystal-clear tooltip callout on hover/focus.
  */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  iconSize = 14,
  ariaLabel = 'More information',
  position = 'top',
  align = 'left',
  className = '',
}) => {
  return (
    <span
      className={`app-tooltip-wrapper position-${position} align-${align} ${className}`.trim()}
      aria-label={ariaLabel}
      tabIndex={0}
      role="button"
    >
      <Info size={iconSize} className="app-tooltip-icon" />
      <span className="app-tooltip-box" role="tooltip">
        {content}
      </span>
    </span>
  );
};

export default InfoTooltip;
