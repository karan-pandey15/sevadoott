"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ReferFriend = () => {
  const router = useRouter();
  const [shareLoading, setShareLoading] = useState(false);

  const handleShare = async () => {
    try {
      setShareLoading(true);
      const shareData = {
        title: 'Share Sevadoot  with Friends',
        text: 'Join Sevadoot  and get 20% discount on your first order! Use my referral code and enjoy amazing fresh groceries delivered to your doorstep. Download the app now!',
        url: 'https://play.google.com/store/apps/details?id=com.Sevadoot ',
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast.success('Referral info copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') {
        toast.error('Unable to share. Please try again.');
      }
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <h1 className="text-xl font-bold text-black ml-4">Refer A Friend</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Refer Friend Image */}
        <div className="w-full h-48 flex justify-center items-center p-8">
          <img
            src="/image/referfriend.png"
            alt="Refer Friend"
            className="h-full object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="px-6 py-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-1">Share A Friend</h2>
          <p className="text-xl font-semibold text-[#2A9134] mb-8">and get 20% discount</p>

          {/* Benefits Card */}
          <div className="bg-[#F9F9F9] rounded-2xl p-6 mb-6 border-l-4 border-[#2A9134] text-left">
            <h3 className="text-lg font-bold text-black mb-6 text-center">How it works?</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#2A9134] flex items-center justify-center text-white font-bold flex-shrink-0 mr-4">
                  1
                </div>
                <div>
                  <h4 className="text-base font-bold text-black">Share the Code</h4>
                  <p className="text-sm text-gray-500">Share your unique referral code with friends</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#2A9134] flex items-center justify-center text-white font-bold flex-shrink-0 mr-4">
                  2
                </div>
                <div>
                  <h4 className="text-base font-bold text-black">They Download & Sign Up</h4>
                  <p className="text-sm text-gray-500">Your friends download Sevadoot  and use your referral code</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#2A9134] flex items-center justify-center text-white font-bold flex-shrink-0 mr-4">
                  3
                </div>
                <div>
                  <h4 className="text-base font-bold text-black">You Both Get Rewards</h4>
                  <p className="text-sm text-gray-500">Both of you get 20% discount on your first order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Card */}
          <div className="bg-[#FFF4E6] rounded-2xl p-6 mb-6 text-left">
            <h3 className="text-lg font-bold text-black mb-4 flex items-center">
              <Info size={20} className="mr-2 text-[#2A9134]" />
              Terms & Conditions
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-[#2A9134] mr-2 font-bold">•</span>
                Discount applies to first order of referred friends only
              </li>
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-[#2A9134] mr-2 font-bold">•</span>
                Minimum order value should be ₹200 for discount eligibility
              </li>
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-[#2A9134] mr-2 font-bold">•</span>
                Discount cannot be combined with other offers
              </li>
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-[#2A9134] mr-2 font-bold">•</span>
                Unlimited referrals - keep sharing and earning!
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Share Button Container */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10">
        <button
          onClick={handleShare}
          disabled={shareLoading}
          className="w-full bg-[#2A9134] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-green-100 active:scale-95 transition-all disabled:opacity-50"
        >
          <Share2 size={24} />
          {shareLoading ? 'Sharing...' : 'Share Now'}
        </button>
      </div>
    </div>
  );
};

export default ReferFriend;
