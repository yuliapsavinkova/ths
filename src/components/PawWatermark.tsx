import React from 'react';
import { PawIcon } from './Icons';

export type WatermarkPosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'hero-circle'
  | 'none';

export type WatermarkVariant = 'gold' | 'soft' | 'glow';

export interface PawWatermarkProps {
  position?: WatermarkPosition;
  size?: number | string;
  variant?: WatermarkVariant;
  className?: string;
  id?: string;
}

export const PawWatermark: React.FC<PawWatermarkProps> = ({
  position = 'left',
  size = 160,
  variant = 'gold',
  className = '',
  id,
}) => {
  const getPositionClass = (pos: WatermarkPosition): string => {
    switch (pos) {
      case 'left':
        return 'paw-watermark-left';
      case 'right':
        return 'paw-watermark-right';
      case 'top':
        return 'paw-watermark-top';
      case 'bottom':
        return 'paw-watermark-bottom';
      case 'top-left':
        return 'paw-watermark-top-left';
      case 'top-right':
        return 'paw-watermark-top-right';
      case 'bottom-left':
        return 'paw-watermark-bottom-left';
      case 'bottom-right':
        return 'paw-watermark-bottom-right';
      case 'hero-circle':
        return 'hero-circle-paw-watermark';
      case 'none':
      default:
        return '';
    }
  };

  const positionClass = getPositionClass(position);
  const variantClass = `paw-watermark-${variant}`;

  return (
    <div
      className={`paw-watermark ${positionClass} ${variantClass} ${className}`.trim()}
      id={id}
      aria-hidden="true"
    >
      <PawIcon size={size} />
    </div>
  );
};

export default PawWatermark;
