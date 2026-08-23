'use client';

import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { SEVADOOT_CONTACT } from '@/lib/partnerContact';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your API
    alert('Thank you for contacting Sevadoot. We will get back to you soon!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Contact Us" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Get in Touch</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Our Office</h3>
                <p className="text-sm text-gray-600">{SEVADOOT_CONTACT.office.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">WhatsApp / Phone</h3>
                <p className="text-sm text-gray-600">{SEVADOOT_CONTACT.phone.numbers[0]}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Email Us</h3>
                <p className="text-sm text-gray-600">{SEVADOOT_CONTACT.email.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="bg-[#1898A5] p-3 rounded-xl text-white">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Business Hours</h3>
                <p className="text-sm text-gray-600">{SEVADOOT_CONTACT.hours.display}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] focus:border-transparent transition-all"
                placeholder="Enter Email "
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] focus:border-transparent transition-all"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows="4" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] focus:border-transparent transition-all"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#147F8A] transition-colors shadow-lg shadow-[#1898A5]/20"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
