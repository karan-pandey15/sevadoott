"use client";

import React, { Suspense } from 'react';
import LadiesServiceDetail from '@/components/LadiesServiceDetail';

export default function LadiesDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    }>
      <LadiesServiceDetail />
    </Suspense>
  );
}
