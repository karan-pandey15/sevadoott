'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { loginUser, setSession, DASHBOARD_URLS } from '@/lib/hrAuth';

export default function HRLoginForm({ onToggleSignup }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const result = loginUser({ email: form.email.trim(), password: form.password });
      if (!result.ok) {
        setErrors({ _form: result.error });
      } else {
        setSession(result.user);
        router.replace(DASHBOARD_URLS[result.user.role] || '/partner/login?tab=login');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to your HR Partner account</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hr-login-email">
            Email Address
          </label>
          <input
            id="hr-login-email"
            type="email"
            maxLength={254}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hr-login-password">
            Password
          </label>
          <div className="relative">
            <input
              id="hr-login-password"
              type={showPassword ? 'text' : 'password'}
              maxLength={128}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Enter your password"
              className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1898A5] transition ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              autoComplete="current-password"
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
          <LogIn size={18} />
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onToggleSignup}
          className="text-[#1898A5] hover:underline font-semibold"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}
