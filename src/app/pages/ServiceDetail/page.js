import ServiceDetail from '@/components/ServiceDetail';
import { Suspense } from 'react';

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1898A5]">
          
        </div>
      </div>
    }>
      <ServiceDetail />
    </Suspense>
  );
}
