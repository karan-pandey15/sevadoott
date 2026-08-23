'use client';

import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { UserPlus, Settings, Briefcase, Send } from 'lucide-react';
import { SEVADOOT_CONTACT } from '@/lib/partnerContact';

export default function Partner() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceCategory: '',
    experience: '',
    city: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for choosing to become a partner with Sevadoot. We will review your application and get back to you soon!');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      serviceCategory: '',
      experience: '',
      city: ''
    });
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Become a Partner" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Grow Your Business</h2>
          <p className="text-gray-600">
            Join 10,000+ professionals who have grown their business with Sevadoot. Get more leads, 
            manage bookings easily, and build your brand.
          </p>
          
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">New Customers</h3>
                <p className="text-xs text-gray-500">Get access to high-quality leads daily</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Settings size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Easy Management</h3>
                <p className="text-xs text-gray-500">Manage all your bookings in one place</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Flexible Work</h3>
                <p className="text-xs text-gray-500">Work on your own terms and schedule</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Partner Registration</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="Enter Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all bg-white"
                value={formData.serviceCategory}
                onChange={(e) => setFormData({...formData, serviceCategory: e.target.value})}
              >
                <option value="">Select Category</option>
                <option value="cleaning">Home Cleaning</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="salon">Salon & Spa</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="e.g. 5"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="Your City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#147F8A] transition-colors shadow-lg shadow-[#1898A5]/20"
            >
              <Send size={18} />
              Register as Partner
            </button>
          </form>
        </section>

        <section className="pt-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Direct Contact</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-semibold text-[#1898A5]">Email:</span> {SEVADOOT_CONTACT.email.address}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-semibold text-[#1898A5]">WhatsApp / Phone:</span> {SEVADOOT_CONTACT.phone.numbers[0]}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
