import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Sevadoot brand logo — full logo artwork from /image/sevadoot.png
 * White chip keeps blue/green logo readable on dark header/footer backgrounds.
 */
const Logo = ({ className = '', size = 'md', asLink = false, unconstrained = false }) => {
  const heights = {
    sm: 'h-9 sm:h-10',
    md: 'h-11 sm:h-14',
    lg: 'h-14 sm:h-16',
  };

  const widths = {
    sm: 120,
    md: 160,
    lg: 200,
  };

  const content = (
    <div
      className={`flex items-center min-w-0 ${
        unconstrained ? 'w-auto max-w-none' : 'w-[85%] max-w-[85%] sm:w-auto sm:max-w-none'
      } ${className}`}
    >
      <div className="flex-shrink-0 rounded-xl bg-white px-2 py-1 shadow-sm">
        <Image
          src="/image/sevadoot.png"
          alt="Sevadoot"
          width={widths[size] || widths.md}
          height={Math.round((widths[size] || widths.md) * 0.72)}
          className={`${heights[size] || heights.md} w-auto object-contain`}
          priority
        />
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className="flex-shrink min-w-0 max-w-[calc(100%-7.5rem)] sm:max-w-none hover:opacity-95 transition-opacity"
        aria-label="Sevadoot Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
