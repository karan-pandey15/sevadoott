'use client';
import { LogOut, User } from 'lucide-react';

export default function HRHeader({ userName, onLogout }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-gray-700">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: '#1898A5' }}
          aria-hidden="true"
        >
          {userName ? userName.charAt(0).toUpperCase() : <User size={16} />}
        </div>
        <span className="font-semibold text-sm truncate max-w-[200px]">{userName}</span>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition"
        style={{ backgroundColor: '#1898A5' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#147F8A'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1898A5'; }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}
