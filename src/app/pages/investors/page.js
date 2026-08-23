'use client';

import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { TrendingUp, PieChart, ShieldCheck, Send } from 'lucide-react';

export default function Investor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investmentRange: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your interest in investing with Sevadoot. Our investor relations team will reach out to you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      investmentRange: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="For Investors" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Invest in the Future</h2>
          <p className="text-gray-600">
            Join Sevadoot's journey in revolutionizing local services. We are building a scalable ecosystem 
            that empowers service providers and simplifies life for consumers.
          </p>
          
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Market Growth</h3>
                <p className="text-xs text-gray-500">Rapidly expanding service categories</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <PieChart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Scalable Model</h3>
                <p className="text-xs text-gray-500">Technology-driven operations</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Visionary Leadership</h3>
                <p className="text-xs text-gray-500">Committed to transparency and impact</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Investor Inquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Interest Range</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all bg-white"
                value={formData.investmentRange}
                onChange={(e) => setFormData({...formData, investmentRange: e.target.value})}
              >
                <option value="">Select Range</option>
                <option value="seed">₹5L - ₹20L</option>
                <option value="growth">₹20L - ₹50L</option>
                <option value="series_a">₹50L+</option>
                <option value="other">Discuss Directly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
              <textarea 
                rows="4" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="Tell us about your investment profile"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#147F8A] transition-colors shadow-lg shadow-[#1898A5]/20"
            >
              <Send size={18} />
              Submit Interest
            </button>
          </form>
        </section>

        <section className="pt-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Direct Contact</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-semibold text-[#1898A5]">Email:</span> sevadoot@support.com
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-semibold text-[#1898A5]">Call:</span> +91 9879790705
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
