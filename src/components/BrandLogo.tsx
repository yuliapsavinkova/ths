import React from 'react';

export interface BrandLogoProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  variant?: 'header' | 'footer' | 'default';
  lightBg?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  href = '#app-root',
  onClick,
  variant = 'default',
  lightBg = false,
  className = '',
  id = 'brand-logo-link',
  ariaLabel = 'Yulia House and Pet Sitter Home',
}) => {
  const variantClass = variant !== 'default' ? `brand-logo-component--${variant}` : '';
  const lightBgClass = lightBg ? 'brand-logo-component--light-bg' : '';
  const combinedClasses = `brand-logo-component ${variantClass} ${lightBgClass} ${className}`.trim();

  return (
    <a
      href={href}
      className={combinedClasses}
      id={id}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <img
        src="/yulia_logo.svg"
        alt="Yulia Logo"
        className="brand-logo-icon-img"
        referrerPolicy="no-referrer"
      />
      <span className="brand-logo-text-wrap">
        <span className="brand-logo-name">Yulia &mdash;</span>
        <span className="brand-logo-tagline">House &amp; Pet Sitter</span>
      </span>
    </a>
  );
};
