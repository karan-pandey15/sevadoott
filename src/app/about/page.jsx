'use client';

import SimpleHeader from '@/components/SimpleHeader';
import { Info, Target, Users, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="About Us" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#1898A5]">
            <Info size={28} />
            <h2 className="text-2xl font-bold">Who We Are</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Sevadoot is your trusted partner in domestic assistance and professional services. 
            We bridge the gap between busy households and reliable service providers, 
            ensuring peace of mind for you and your loved ones.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#1898A5]">
            <Target size={28} />
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to provide high-quality, reliable, and accessible services including 
            Attendants, Guardian for kids, School assistance, Hotel services, and much more. 
            We strive to make your life easier by handling the details that matter.
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50 text-center space-y-2">
            <Users className="mx-auto text-[#1898A5]" size={32} />
            <h3 className="font-bold text-gray-800">1000+</h3>
            <p className="text-xs text-gray-500">Happy Clients</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50 text-center space-y-2">
            <ShieldCheck className="mx-auto text-[#1898A5]" size={32} />
            <h3 className="font-bold text-gray-800">Verified</h3>
            <p className="text-xs text-gray-500">Service Partners</p>
          </div>
        </div>

        <section className="bg-[#1898A5]/10 p-6 rounded-3xl space-y-3">
          <h2 className="text-xl font-bold text-[#1898A5]">Our Story</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Founded with a vision to organize the domestic service sector, Sevadoot started 
            as a small initiative to help families find trustworthy attendants. Today, 
            we have expanded into a multi-service platform catering to various needs from 
            grocery delivery to pandit services and school assistance.
          </p>
        </section>
      </div>
    </div>
  );
}
