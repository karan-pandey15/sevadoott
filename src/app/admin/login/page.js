'use client';
import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Lock } from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone === '9999781282') {
      window.location.href = 'https://helpaanaadminn.vercel.app/';
    } else {
      setError('Unauthorized access. Please enter a valid admin phone number.');
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Admin Login" />
      
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <Logo size="lg" light={false} />

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back, Admin</h2>
          <p className="text-gray-500 text-sm">Please verify your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
            <div className="relative">
              <input 
                type="tel" 
                required
                maxLength="10"
                className={`w-full px-4 py-4 pl-12 rounded-2xl border-2 ${error ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:border-[#1898A5] transition-all bg-gray-50 text-lg font-medium tracking-wider`}
                placeholder="Enter admin phone"
                value={phone}
                onChange={(e) => {
                  setError('');
                  setPhone(e.target.value.replace(/\D/g, ''));
                }}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#1898A5]/30 hover:bg-[#3d6d8c] transition-all text-lg"
          >
            Verify & Proceed
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Secure administration portal for Sevadoot management.
        </p>
      </div>
    </div>
  );
}
