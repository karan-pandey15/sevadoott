"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";

const placeholderItems = [
  
  "Attendant",
  "Pandit Ji",
  "Gautdian For Kids",
  "Mehndi Artist",
  "Pooja Booking", 
];

export default function SearchBar({ onAdPress }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out → swap → fade in
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % placeholderItems.length);
        setVisible(true);
      }, 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
        {/* Search Box */}
        <button
          onClick={() => router.push("/pages/SearchScreen")}
          className="flex-1 flex items-center bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full
                     shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
        >
          <Search size={18} color="#666" className="mr-1.5 sm:mr-3 shrink-0" />
          <span
            className="text-xs sm:text-[15px] text-[#888] font-normal text-left truncate transition-opacity duration-200"
            style={{ opacity: visible ? 1 : 0 }}
          >
            Search for &ldquo;{placeholderItems[index]}&rdquo;
          </span>
        </button>

        {/* Ad / Shop Fresh Now */}
        <button
          onClick={onAdPress}
          className="flex items-center bg-white px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-tl-xl rounded-bl-xl
                     rounded-tr-none rounded-br-none shadow-md hover:shadow-lg transition-shadow duration-200 whitespace-nowrap"
        >
          <div className="mr-1.5 sm:mr-2 text-left">
            <p className="text-[10px] sm:text-[13px] font-bold text-[#1E88E5] leading-3 sm:leading-4">Shop</p>
            <p className="text-[10px] sm:text-[13px] font-bold text-[#1E88E5] leading-3 sm:leading-4">Fresh Now</p>
          </div>
          <div className="flex items-center shrink-0">
            <div className="w-4 sm:w-6 h-4 sm:h-6 rounded bg-[#1E88E5] flex items-center justify-center">
              <ShoppingCart size={10} className="sm:w-3.5 sm:h-3.5" color="#FFF" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
