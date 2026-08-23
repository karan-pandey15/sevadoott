"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Truck, 
  Heart, 
  Clock, 
  ShieldCheck,
  Star
} from 'lucide-react';

const MembershipPage = () => {
  const router = useRouter();

  const benefits = [
    {
      id: 1,
      title: 'Unlimited Free Delivery',
      desc: 'Get free delivery on all orders above ₹149',
      icon: <Truck size={24} className="text-white" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Extra 10% Discount',
      desc: 'Save more on every service and product',
      icon: <Zap size={24} className="text-white" />,
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      title: 'Priority Customer Support',
      desc: 'Get your queries resolved in minutes',
      icon: <Heart size={24} className="text-white" />,
      color: 'bg-pink-500'
    },
    {
      id: 4,
      title: 'Exclusive Early Access',
      desc: 'Be the first to know about new services',
      icon: <Star size={24} className="text-white" />,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col pb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <h1 className="text-xl font-bold text-black ml-4">Helana Membership</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="bg-[#1898A5] px-6 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
          
          <div className="inline-flex items-center justify-center bg-white/20 p-4 rounded-3xl mb-4 backdrop-blur-md">
            <ShieldCheck size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-black italic text-white mb-2 tracking-tighter uppercase">Helana Gold</h2>
          <p className="text-white/80 text-sm max-w-[250px] mx-auto font-medium">
            Unlock premium benefits and save up to ₹500 every month
          </p>
        </div>

        {/* Benefits Section */}
        <div className="p-6 -mt-6">
          <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
            <h3 className="text-lg font-black italic text-gray-800 uppercase tracking-tight mb-4 text-center">Membership Perks</h3>
            
            {benefits.map((benefit) => (
              <div key={benefit.id} className="flex items-start gap-4 p-2">
                <div className={`${benefit.color} p-3 rounded-2xl shadow-lg shadow-${benefit.color.split('-')[1]}-100 flex-shrink-0`}>
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-black italic text-gray-800 uppercase tracking-tighter leading-none mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-xs font-medium text-gray-400 leading-normal">
                    {benefit.desc}
                  </p>
                </div>
                <CheckCircle2 size={20} className="text-green-500 mt-1 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Card */}
        <div className="px-6 py-4">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-6 py-2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">Best Value</div>
            
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Annual Plan</span>
            <div className="flex items-center justify-center gap-1 mb-6">
              <span className="text-2xl font-black text-gray-800 italic uppercase">₹</span>
              <span className="text-5xl font-black text-gray-900 italic tracking-tighter">499</span>
              <span className="text-gray-400 font-bold ml-1">/ year</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-600 italic">
                <CheckCircle2 size={16} className="text-green-500" /> Save ₹1,200 annually
              </div>
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-600 italic">
                <CheckCircle2 size={16} className="text-green-500" /> Cancel anytime
              </div>
            </div>

            <button className="w-full bg-[#1898A5] text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 group italic uppercase">
              Buy Membership
            </button>
            <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest italic">
              *T&C Apply. Valid for 12 months from purchase.
            </p>
          </div>
        </div>

        {/* Help/Support Section */}
        <div className="p-6">
          <div className="bg-gray-100/50 border border-gray-100 rounded-[32px] p-6 flex flex-col items-center text-center">
            <Clock size={32} className="text-gray-400 mb-3" />
            <h4 className="text-sm font-black italic text-gray-800 uppercase tracking-tighter mb-1">Still thinking?</h4>
            <p className="text-xs font-medium text-gray-500 max-w-[200px] mb-4">
              Our average member saves ₹150 on their very first order!
            </p>
            <button 
              onClick={() => router.push('/pages/help-support')}
              className="text-[10px] font-black italic text-[#1898A5] uppercase tracking-widest border-b-2 border-[#1898A5]/20 pb-1"
            >
              Know More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
