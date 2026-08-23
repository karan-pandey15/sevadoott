'use client';

import SimpleHeader from '@/components/SimpleHeader';
import { Lock, Eye, FileText, Bell } from 'lucide-react';
import { SEVADOOT_CONTACT } from '@/lib/partnerContact';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Privacy Policy" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#1898A5]">
            <Lock size={28} />
            <h2 className="text-2xl font-bold">Privacy Matters</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Last updated: February 1, 2026. Your privacy is important to us. It is Sevadoot&apos;s policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-start gap-3">
            <Eye className="text-[#1898A5] shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-gray-800">1. Information We Collect</h3>
              <p className="text-sm text-gray-600 mt-1">
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="text-[#1898A5] shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-gray-800">2. Use of Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we&apos;ll protect within commercially acceptable means to prevent loss and theft.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Bell className="text-[#1898A5] shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-gray-800">3. Third-party Sharing</h3>
              <p className="text-sm text-gray-600 mt-1">
                We don&apos;t share any personally identifying information publicly or with third-parties, except when required to by law.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">Cookies</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
          </p>
        </section>

        <section className="bg-gray-800 text-white p-6 rounded-3xl space-y-3">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <p className="text-sm text-gray-300">
            If you have any questions about our Privacy Policy, please contact us:
          </p>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>OFFICE:</strong> {SEVADOOT_CONTACT.office.address}</p>
            <p><strong>WHATSAPP / PHONE:</strong> {SEVADOOT_CONTACT.phone.numbers[0]}</p>
            <p><strong>EMAIL:</strong> {SEVADOOT_CONTACT.email.address}</p>
            <p><strong>HOURS:</strong> {SEVADOOT_CONTACT.hours.display}</p>
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center italic">
          Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information.
        </p>
      </div>
    </div>
  );
}
