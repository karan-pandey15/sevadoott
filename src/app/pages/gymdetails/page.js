"use client";

import ServiceDetail from '@/components/ServiceDetail';
import GymDetails from '@/components/GymDetails';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DetailContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Route to GymDetails if category is Gym
  if (category?.toLowerCase() === 'gym' || category === 'Gym Membership') {
    return <GymDetails />;
  }

  return <ServiceDetail />;
}

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    }>
      <DetailContent />
    </Suspense>
  );
}
