'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Building2 } from 'lucide-react';
import { SEVADOOT_CONTACT } from '@/lib/partnerContact';

export default function PartnerContact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Contact Details from Footer */}
      <div className="space-y-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#106670] mb-2">Contact Sevadoot</h2>
          <p className="text-gray-600 text-sm">
            Have questions about partner registration? Reach us using the details below or send a message.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#F58220]/20 flex items-center justify-center text-[#F58220] shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{SEVADOOT_CONTACT.office.label}</p>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{SEVADOOT_CONTACT.office.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#F58220]/20 flex items-center justify-center text-[#F58220] shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{SEVADOOT_CONTACT.phone.label}</p>
              {SEVADOOT_CONTACT.phone.numbers.map((num) => (
                <a key={num} href={`tel:${num.replace(/\s/g, '')}`} className="block text-sm text-gray-700 mt-1 hover:text-[#1898A5] transition-colors">
                  {num}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#F58220]/20 flex items-center justify-center text-[#F58220] shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{SEVADOOT_CONTACT.email.label}</p>
              <a href={`mailto:${SEVADOOT_CONTACT.email.address}`} className="text-sm text-gray-700 mt-1 hover:text-[#1898A5] transition-colors">
                {SEVADOOT_CONTACT.email.address}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#1898A5]/15 flex items-center justify-center text-[#1898A5] shrink-0">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Company</p>
              <p className="text-sm text-gray-700 mt-1">{SEVADOOT_CONTACT.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Send us a Message</h3>
        <p className="text-sm text-gray-500 mb-6">We typically respond within 24 business hours.</p>

        {submitted && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Thank you for contacting Sevadoot. We will get back to you soon!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1898A5]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1898A5]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1898A5]"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
            <textarea
              rows={4}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1898A5] resize-y"
              placeholder="How can we help you with partner registration?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1898A5] hover:bg-[#147F8A] text-white font-semibold rounded-xl transition-colors"
          >
            <Send size={16} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
