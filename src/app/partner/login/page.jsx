'use client';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Users,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { PARTNER_BENEFITS, PARTNER_CATEGORIES } from '@/lib/categories';
import PartnerRegisterForm from '@/components/Partner/PartnerRegisterForm';
import PartnerKnowMore from '@/components/Partner/PartnerKnowMore';
import PartnerContact from '@/components/Partner/PartnerContact';

const TABS = [
  { id: 'register', label: 'Register Now' },
  { id: 'know-more', label: 'Know More' },
  { id: 'contact', label: 'Contact Us' },
];

const BENEFIT_ICONS = [Users, TrendingUp, Shield, Clock, CheckCircle2, Users];

function PartnerLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const registered = searchParams.get('registered') === '1';

  const [activeTab, setActiveTab] = useState(
    TABS.some((t) => t.id === tabParam) ? tabParam : 'know-more'
  );
  const [showSuccess, setShowSuccess] = useState(registered);

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (registered) {
      setShowSuccess(true);
    }
  }, [registered]);

  const switchTab = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tabId);
      if (tabId !== 'know-more') params.delete('registered');
      router.replace(`/partner/login?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const dismissSuccess = () => {
    setShowSuccess(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('registered');
    router.replace(`/partner/login?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1898A5] via-[#147F8A] to-[#106670] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#F58220] font-semibold text-sm uppercase tracking-wider mb-2">
                Partner Portal
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Join Sevadoot Today as A Service Partner
              </h1>
              <p className="text-white/85 text-base md:text-lg leading-relaxed mb-6">
                Join India&apos;s trusted home service marketplace. Register as a partner, choose your
                category, complete KYC verification, and start receiving bookings from customers near you.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className="px-6 py-3 bg-[#F58220] hover:bg-[#e09520] text-[#106670] font-bold rounded-xl transition-colors"
                >
                  Register Now
                </button>
                  <button 
                  type="button"
                  onClick={() => switchTab('login')}
                  className="px-6 py-3 bg-[#00bbf9] hover:bg-[#e09520] text-[#106670] font-bold rounded-xl transition-colors"
                >
                  Login Now
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('know-more')}
                  className="px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/30 font-semibold rounded-xl transition-colors"
                >
                  Know More
                </button>
              </div>
            </div>

            {/* Category preview strip */}
            <div className="hidden lg:grid grid-cols-4 gap-3">
              {PARTNER_CATEGORIES.slice(0, 8).map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden mb-2 shadow-md"
                    style={{ backgroundColor: cat.iconBg }}
                  >
                    <Image src={cat.image} alt={cat.name} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                  <span className="text-[10px] text-center font-medium leading-tight line-clamp-2">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 md:-mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PARTNER_BENEFITS.map((benefit, idx) => {
            const Icon = BENEFIT_ICONS[idx] || CheckCircle2;
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-xl p-5 shadow-md border border-gray-100 flex gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1898A5] text-white flex items-center justify-center shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {showSuccess && (
          <div className="mb-6 flex items-start gap-3 p-4 md:p-5 bg-green-50 border border-green-200 rounded-xl text-green-800">
            <CheckCircle2 className="shrink-0 mt-0.5" size={22} />
            <div className="flex-1">
              <p className="font-bold">Registration submitted successfully!</p>
              <p className="text-sm mt-1 text-green-700">
                Thank you for registering as a Sevadoot partner. Our team will verify your KYC documents
                within 24–48 business hours. You can explore categories and contact us below while you wait.
              </p>
            </div>
            <button type="button" onClick={dismissSuccess} className="text-green-600 hover:text-green-800 p-1" aria-label="Dismiss">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-8 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1898A5] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1898A5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className={
            activeTab === 'register'
              ? 'bg-[#e8e8e8] rounded-2xl p-4 md:p-8 lg:p-10 shadow-sm border border-gray-300'
              : 'bg-white rounded-2xl p-4 md:p-8 lg:p-10 shadow-sm border border-gray-200'
          }
        >
          {activeTab === 'register' && <PartnerRegisterForm />}
          {activeTab === 'know-more' && (
            <PartnerKnowMore onRegisterClick={() => switchTab('register')} />
          )}
          {activeTab === 'contact' && <PartnerContact />}
        </div>
      </section>
    </div>
  );
}

export default function PartnerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#1898A5] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PartnerLoginContent />
    </Suspense>
  );
}
