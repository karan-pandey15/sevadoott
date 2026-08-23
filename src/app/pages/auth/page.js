"use client";

import Auth from "@/components/Auth";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function AuthContent() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push("/pages/profile");
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <Auth onAuthSuccess={handleAuthSuccess} onSkip={handleSkip} />
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#1898A5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
