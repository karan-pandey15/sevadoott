'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PARTNER_CATEGORIES, PARTNER_STEPS } from '@/lib/categories';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PartnerKnowMore({ onRegisterClick }) {
  return (
    <div className="space-y-10">
      {/* How to Register */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-[#106670] mb-2">
          How to Become a Sevadoot Partner
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Follow these simple steps to register, get verified, and start receiving bookings on Sevadoot.
        </p>
        <div className="space-y-4">
          {PARTNER_STEPS.map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-4 md:p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1898A5] text-white flex items-center justify-center font-bold text-lg">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {onRegisterClick && (
          <button
            type="button"
            onClick={onRegisterClick}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#1898A5] hover:bg-[#147F8A] text-white font-semibold rounded-xl transition-colors"
          >
            Start Registration
            <ArrowRight size={18} />
          </button>
        )}
      </section>

      {/* All Categories */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-[#106670] mb-2">
          All Partner Categories
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Sevadoot supports partners across diverse service and product categories. Select the category
          that best matches your business when you register.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {PARTNER_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#1898A5]/40 transition-all group"
            >
              <div
                className="flex items-center justify-center p-5 h-32"
                style={{ backgroundColor: cat.iconBg }}
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1.5 leading-snug">{cat.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{cat.description}</p>
                <Link
                  href={cat.screen}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1898A5] hover:text-[#147F8A]"
                >
                  View category page
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Checklist */}
      <section className="bg-[#1898A5]/5 border border-[#1898A5]/20 rounded-2xl p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-bold text-[#106670] mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-[#1898A5]" size={24} />
          Documents Required for Registration
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          {[
            'Valid Aadhar Card (number + upload)',
            'Valid PAN Card (number + upload)',
            'Passport-size photograph',
            'Bank account details (name, account no., IFSC)',
            'Bank passbook or cancelled cheque upload',
            'Two references with full address details',
            'Personal and address information',
            'Selected service category',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-[#1898A5] mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
