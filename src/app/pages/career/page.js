'use client';

import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Rocket, Heart, Zap, Send, Paperclip } from 'lucide-react';
import { SEVADOOT_CONTACT } from '@/lib/partnerContact';

export default function Career() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for applying to Sevadoot. Our HR team will review your application and contact you if your profile matches our requirements!');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Join Our Team" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Build Your Career</h2>
          <p className="text-gray-600">
            Work at Sevadoot and be part of a team that is redefining the service industry in India. 
            We value innovation, ownership, and empathy.
          </p>
          
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Rocket size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Fast Growth</h3>
                <p className="text-xs text-gray-500">Accelerate your career in a fast-paced environment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Great Culture</h3>
                <p className="text-xs text-gray-500">Collaborative and inclusive workplace</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Real Impact</h3>
                <p className="text-xs text-gray-500">Your work directly impacts millions of lives</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Application Form</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Interested In</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all bg-white"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              >
                <option value="">Select Position</option>
                <option value="tech">Technology & Engineering</option>
                <option value="ops">Operations & Logistics</option>
                <option value="marketing">Marketing & Sales</option>
                <option value="hr">Human Resources</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all"
                placeholder="e.g. 2"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (Drive/Dropbox)</label>
              <div className="relative">
                <input 
                  type="url" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition-all pl-10"
                  placeholder="https://..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                <Paperclip size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#147F8A] transition-colors shadow-lg shadow-[#1898A5]/20"
            >
              <Send size={18} />
              Submit Application
            </button>
          </form>
        </section>

        <section className="pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don't see a relevant role? Send your resume to <br />
            <span className="font-bold text-[#1898A5]">{SEVADOOT_CONTACT.email.address}</span>
          </p>
        </section>
      </div>
    </div>
  );
}
