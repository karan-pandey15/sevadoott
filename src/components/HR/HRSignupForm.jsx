'use client';
import { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { signupUser, HR_ROLE_SECRET_KEYS } from '@/lib/hrAuth';

const ROLES = Object.keys(HR_ROLE_SECRET_KEYS);

export default function HRSignupForm({ onToggleLogin }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    secretKey: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const result = signupUser(form);
      if (!result.ok) {
        setErrors(result.errors || {});
      } else {
        setSuccess(true);
        // Switch to login after short delay
        setTimeout(() => onToggleLogin?.(), 1500);
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="text-green-600" size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Account Created!</h3>
        <p className="text-sm text-gray-500">Redirecting you to login…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-sm text-gray-500 mt-1">Register for the HR Partner System</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hr-signup-name">
            Full Name
          </label>
          <input
            id="hr-signup-name"
            type="text"
            maxLength={100}
            value={form.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
            placeholder="Your full name"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition ${
              errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hr-signup-email">
            Email Address
          </label>
          <input
            id="hr-signup-email"
            type="email"
            maxLength={254}
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="you@example.com"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition ${
              errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            }`}
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hr-signup-password">
            Password <span className="text-gray-400 font-normal">(min 8 characters)</span>
          </label>
          <div className="relative">
            <input
              id="hr-signup-password"
              type={showPassword ? 'text' : 'password'}
              minLength={8}
              maxLength={128}
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="Minimum 8 characters"
              className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hr-signup-role">
            Role
          </label>
          <select
            id="hr-signup-role"
            value={form.role}
            onChange={(e) => setField('role', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition bg-white ${
              errors.role ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select your role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
        </div>

        {/* Secret Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hr-signup-secret">
            Role Secret Key
          </label>
          <div className="relative">
            <input
              id="hr-signup-secret"
              type={showSecretKey ? 'text' : 'password'}
              value={form.secretKey}
              onChange={(e) => setField('secretKey', e.target.value)}
              placeholder="Enter the secret key for your role"
              className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition ${
                errors.secretKey ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowSecretKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showSecretKey ? 'Hide secret key' : 'Show secret key'}
            >
              {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.secretKey && <p className="mt-1 text-xs text-red-600">{errors.secretKey}</p>}
        </div>

        {/* Generic form error */}
        {errors._form && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors._form}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#1898A5] hover:bg-[#147F8A] text-white font-semibold rounded-xl transition disabled:opacity-60"
        >
          <UserPlus size={18} />
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggleLogin}
          className="text-[#1898A5] hover:underline font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  );
}
