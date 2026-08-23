'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function SimpleHeader({ title }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-[#1898A5] px-4 pt-10 pb-4 flex items-center gap-4 shadow-md">
      <button 
        onClick={() => router.back()} 
        className="text-white p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-xl font-bold text-white">{title}</h1>
    </header>
  );
}
