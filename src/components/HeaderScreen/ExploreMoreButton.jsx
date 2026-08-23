import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * Explore More — blue pill, white text + chevron in one row.
 * Sits in trending row beside category circles (reference layout).
 */
export default function ExploreMoreButton({ href = '/categories', className = '' }) {
  return (
    <Link
      href={href}
      aria-label="Explore all categories"
      className={[
        'inline-flex flex-row flex-nowrap items-center justify-center gap-1',
        'shrink-0 flex-none',
        'h-[51px] min-w-[108px] px-3.5',
        'rounded-xl bg-[#1898A5] text-white',
        'text-[11px] sm:text-xs font-bold leading-none',
        'no-underline whitespace-nowrap',
        'shadow-[0_4px_12px_rgba(24,152,165,0.35)]',
        'hover:bg-[#147F8A] active:scale-[0.98] transition-all',
        'mb-[18px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-white">Explore More</span>
      <ChevronRight size={14} strokeWidth={2.5} className="text-white shrink-0" aria-hidden />
    </Link>
  );
}
