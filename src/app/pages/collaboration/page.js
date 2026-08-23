'use client';

import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Building2, Handshake, Users, Send } from 'lucide-react';

export default function Collaboration() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    collaborationType: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your interest in collaborating with Sevadoot. Our business team will contact you soon!');
    setFormData({
      businessName: '',
      contactPerson: '',
      email: '',
      phone: '',
      collaborationType: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Business Collaboration" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Partner with Us</h2>
          <p className="text-gray-600">
            Sevadoot welcomes businesses to collaborate and grow together. Whether you are a service provider, 
            a retail brand, or a corporate entity, we have diverse opportunities for partnership.
          </p>
          
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Corporate Tie-ups</h3>
                <p className="text-xs text-gray-500">Exclusive services for your employees</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Handshake size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Strategic Partnerships</h3>
                <p className="text-xs text-gray-500">Mutual growth through shared resources</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Vendor Network</h3>
                <p className="text-xs text-gray-500">Join our growing ecosystem of providers</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Collaboration Inquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="Enter Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="Enter Your Name"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="business@example.com"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Type of Collaboration</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all bg-white"
                value={formData.collaborationType}
                onChange={(e) => setFormData({...formData, collaborationType: e.target.value})}
              >
                <option value="">Select Option</option>
                <option value="corporate">Corporate Tie-up</option>
                <option value="strategic">Strategic Partnership</option>
                <option value="vendor">Vendor Network</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brief Proposal</label>
              <textarea 
                rows="4" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="Tell us how we can work together"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#147F8A] transition-colors shadow-lg shadow-[#1898A5]/20"
            >
              <Send size={18} />
              Submit Proposal
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
