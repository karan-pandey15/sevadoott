'use client';

import SimpleHeader from '@/components/SimpleHeader';
import { Gavel, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Terms & Conditions" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-[#1898A5]/10 rounded-full text-[#1898A5] mb-2">
            <Gavel size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Legal Agreement</h2>
          <p className="text-gray-500 text-sm">
            Please read these terms and conditions carefully before using Sevadoot services.
          </p>
        </section>

        <div className="space-y-6">
          <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50 space-y-3">
            <div className="flex items-center gap-2 text-[#1898A5] font-bold">
              <CheckCircle size={18} />
              <h3>1. Acceptance of Terms</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </div>

          <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50 space-y-3">
            <div className="flex items-center gap-2 text-[#1898A5] font-bold">
              <CheckCircle size={18} />
              <h3>2. Service Provision</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sevadoot provides a platform to connect users with service providers. We are committed to maintaining the quality of these connections.
            </p>
          </div>

          <div className="p-5 border border-[#1898A5]/20 rounded-3xl bg-[#1898A5]/5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <AlertTriangle size={18} />
              <h3>3. User Responsibility</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Users are responsible for providing accurate information during booking and ensuring a safe environment for service providers.
            </p>
          </div>

          <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50 space-y-3">
            <div className="flex items-center gap-2 text-[#1898A5] font-bold">
              <CheckCircle size={18} />
              <h3>4. Cancellation Policy</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cancellations made within 24 hours of the scheduled service may be subject to a cancellation fee as per our standard policy.
            </p>
          </div>
        </div>

        <section className="bg-gray-800 text-white p-6 rounded-3xl space-y-3">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <p className="text-sm text-gray-300">
            If you have any questions about our Terms and Conditions, please contact us:
          </p>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>OFFICE:</strong> Surat, Gujarat</p>
            <p><strong>HELPLINE:</strong> +91 9879790705</p>
            <p><strong>EMAIL:</strong> sevadoot@support.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
