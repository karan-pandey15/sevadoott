"use client";

import React, { useState } from 'react';
import { SEVADOOT_CONTACT } from '@/lib/partnerContact';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Headphones, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';

const HelpSupport = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const phoneNumber = SEVADOOT_CONTACT.phone.tel;
  const phoneDisplay = SEVADOOT_CONTACT.phone.numbers[0];
  const email = SEVADOOT_CONTACT.email.address;

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse our Products Page, add items to your cart, and proceed to checkout. Enter your delivery address and payment details to complete the order.',
    },
    {
      id: 2,
      question: 'What are the delivery charges?',
      answer: 'Delivery charges vary based on your location and order value. Orders above ₹159 are eligible for free delivery. You can see the exact delivery charges at checkout.',
    },
    {
      id: 3,
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 20-35 minutes. During peak hours, it might take slightly longer. You can track your order in real-time from the app.',
    },
    {
      id: 4,
      question: 'What payment methods are accepted?',
      answer: 'We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery. Digital wallets like Paytm, PhonePe are also accepted.',
    },
    {
      id: 5,
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 5 minutes of placing it. After that, please contact our support team for assistance.',
    },
    {
      id: 6,
      question: 'What is your refund policy?',
      answer: 'If you receive damaged or incorrect items, you can request a refund within 24 hours of delivery. Refunds are processed within 5-7 business days.',
    },
    {
      id: 7,
      question: 'How do I track my order?',
      answer: 'Once your order is confirmed, you can track it in real-time from the "Your Orders" section. You will also receive notifications about your order status.',
    },
    {
      id: 8,
      question: 'Are there any offers or discounts?',
      answer: 'Yes! Check the "Offers" section in the app for current deals and discounts. We regularly update our offers and send notifications about exclusive deals.',
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <h1 className="text-xl font-bold text-black ml-4">Help & Support</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 flex items-center justify-center py-4 text-base font-semibold transition-colors border-b-2 ${
            activeTab === 'faq' ? 'border-[#00A86B] text-[#00A86B]' : 'border-transparent text-gray-500'
          }`}
        >
          <HelpCircle size={20} className="mr-2" />
          FAQ
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 flex items-center justify-center py-4 text-base font-semibold transition-colors border-b-2 ${
            activeTab === 'contact' ? 'border-[#00A86B] text-[#00A86B]' : 'border-transparent text-gray-500'
          }`}
        >
          <Headphones size={20} className="mr-2" />
          Contact Us
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-10">
        {activeTab === 'faq' ? (
          <div className="p-4 space-y-4">
            <div className="flex flex-col items-center text-center py-8">
              <div className="bg-[#E8F5F1] p-4 rounded-full mb-4">
                <HelpCircle size={40} className="text-[#00A86B]" />
              </div>
              <h2 className="text-xl font-bold text-black">Frequently Asked Questions</h2>
              <p className="text-gray-500 mt-1">Find answers to common questions</p>
            </div>

            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-base font-semibold text-black pr-4">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={24} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={24} className="text-gray-400" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-2">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center mt-8">
              <h3 className="text-lg font-bold text-black mb-4">Still need help?</h3>
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-[#00A86B] text-white px-8 py-3 rounded-full font-bold flex items-center hover:bg-opacity-90 transition-all active:scale-95"
              >
                Contact Us
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex flex-col items-center text-center py-8">
              <div className="bg-[#E8F5F1] p-4 rounded-full mb-4">
                <Headphones size={40} className="text-[#00A86B]" />
              </div>
              <h2 className="text-xl font-bold text-black">We&apos;re Here to Help!</h2>
              <p className="text-gray-500 mt-1">Get in touch with us through any of these channels</p>
            </div>

            {/* Contact Cards */}
            <button
              onClick={handleCall}
              className="w-full flex items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#00A86B] transition-all text-left"
            >
              <div className="bg-[#E8F5F1] p-3 rounded-2xl mr-4">
                <Phone size={24} className="text-[#00A86B]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-black">Call Us</h3>
                <p className="text-xs text-gray-500">Talk to our support team</p>
                <p className="text-sm font-semibold text-[#00A86B] mt-1">{phoneDisplay}</p>
              </div>
              <ChevronRight size={24} className="text-[#00A86B]" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#25D366] transition-all text-left"
            >
              <div className="bg-[#E8F8F5] p-3 rounded-2xl mr-4">
                <MessageCircle size={24} className="text-[#25D366]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-black">WhatsApp</h3>
                <p className="text-xs text-gray-500">Chat with us on WhatsApp</p>
                <p className="text-sm font-semibold text-[#25D366] mt-1">{phoneDisplay}</p>
              </div>
              <ChevronRight size={24} className="text-[#25D366]" />
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#FF9800] transition-all text-left"
            >
              <div className="bg-[#FFF4E6] p-3 rounded-2xl mr-4">
                <Mail size={24} className="text-[#FF9800]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-black">Email Us</h3>
                <p className="text-xs text-gray-500">Send us your queries</p>
                <p className="text-sm font-semibold text-[#FF9800] mt-1">{email}</p>
              </div>
              <ChevronRight size={24} className="text-[#FF9800]" />
            </button>

            {/* Support Hours */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <Clock size={20} className="text-gray-400 mr-2" />
                <h3 className="text-base font-bold text-black">Support Hours</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">{SEVADOOT_CONTACT.hours.weekdays}</span>
                  <span className="text-right font-semibold text-black">{SEVADOOT_CONTACT.hours.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Saturday – Sunday</span>
                  <span className="font-semibold text-black">{SEVADOOT_CONTACT.hours.weekend}</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h3 className="text-base font-bold text-black mb-3 flex items-center">
                <Lightbulb size={20} className="mr-2 text-blue-500" />
                Quick Tips
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <span className="mr-2">•</span>
                  Have your order ID ready for faster assistance
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <span className="mr-2">•</span>
                  Check our FAQ section for instant answers
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <span className="mr-2">•</span>
                  Average response time: Under 5 minutes
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSupport;
