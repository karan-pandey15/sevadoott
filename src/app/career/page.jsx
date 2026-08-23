'use client';

import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Briefcase, UserPlus, Upload, CheckCircle2 } from 'lucide-react';

export default function CareerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Attendant',
    experience: '',
    resume: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Real logic would upload data here
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Application Received!</h2>
        <p className="text-gray-600">
          Thank you for your interest in joining Sevadoot. Our recruitment team will review your profile and contact you soon.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-6 text-[#1898A5] font-bold hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Join Us" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-4 bg-[#1898A5] text-white rounded-2xl shadow-lg shadow-[#1898A5]/30 mb-2">
            <Briefcase size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Start Your Career</h2>
          <p className="text-gray-500 text-sm">
            Join the Sevadoot family and make a difference in people&apos;s lives.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#1898A5] font-bold mb-2">
            <UserPlus size={20} />
            <h3>Application Form</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5]"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5]"
                  placeholder="+91..."
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5]"
                  placeholder="e.g. 2 Years"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interested Position</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1898A5] appearance-none bg-white"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              >
                <option value="Attendant">Attendant</option>
                <option value="Guardian for Kids">Guardian for Kids</option>
                <option value="School Assistant">School Assistant</option>
                <option value="Pandit">Pandit</option>
                <option value="Cosmetic Expert">Cosmetic Expert</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV</label>
              <div className="relative">
                <input 
                  type="file" 
                  className="hidden" 
                  id="resume-upload"
                  onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
                />
                <label 
                  htmlFor="resume-upload"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-500 cursor-pointer hover:border-[#1898A5] hover:text-[#1898A5] transition-all"
                >
                  <Upload size={18} />
                  {formData.resume ? formData.resume.name : 'Upload Resume (PDF/Doc)'}
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1898A5]/20 hover:bg-[#3d6d8c] transition-all"
            >
              Submit Application
            </button>
          </form>
        </section>

        <section className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h4 className="font-bold text-amber-800 text-sm mb-1">Note for Applicants</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            All candidates must undergo a background verification process. Please ensure the information provided is accurate and verifiable.
          </p>
        </section>
      </div>
    </div>
  );
}
