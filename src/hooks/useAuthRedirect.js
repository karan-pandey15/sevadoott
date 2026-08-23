"use client";
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = (redirectTo = '/pages/profile') => {
  const router = useRouter();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    
    if (!token) {
      const handleBeforeUnload = () => {
        hasCheckedAuth.current = false;
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      router.push(redirectTo);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [router, redirectTo]);

  const isAuthenticated = typeof window !== 'undefined' ? !!localStorage.getItem('userToken') : false;
  
  return { isAuthenticated };
};
