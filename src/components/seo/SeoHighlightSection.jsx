import Link from 'next/link';
import { SEO_KEYWORD_PHRASES } from '@/lib/seo';

/**
 * Visible, crawlable section mapping target SEO phrases to real pages.
 * Helps branded sitelinks and long-tail rankings without keyword stuffing.
 */
export default function SeoHighlightSection() {
  return (
    <section
      id="services"
      className="py-12 md:py-16 bg-white border-t border-gray-100"
      aria-labelledby="seo-services-heading"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <header className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <p className="text-[#1898A5] text-sm font-bold uppercase tracking-widest mb-2">
            Sevadoot.com
          </p>
          <h2
            id="seo-services-heading"
            className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4"
          >
            India&apos;s Trusted Home Service Booking App
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Sevadoot is a <strong>local service app</strong> and{' '}
            <strong>home service marketplace</strong> where families book a{' '}
            <strong>trusted service provider app</strong> experience — from{' '}
            <strong>mehndi artist booking</strong> to{' '}
            <strong>elder care companion service</strong>,{' '}
            <strong>senior citizen assistance</strong>, and{' '}
            <strong>hospital visit helper</strong> support at home.
          </p>
        </header>

        <nav aria-label="Sevadoot popular services">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {SEO_KEYWORD_PHRASES.map((item) => (
              <li key={item.id} id={item.anchor}>
                <Link
                  href={item.href}
                  className="group flex flex-col h-full p-5 md:p-6 rounded-2xl border border-gray-100 bg-gray-50/80 hover:bg-white hover:border-[#1898A5]/30 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1898A5]/70 mb-2">
                    {item.phrase}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1898A5] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">
                    {item.shortDescription}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-[#1898A5] group-hover:underline">
                    Book on Sevadoot →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
