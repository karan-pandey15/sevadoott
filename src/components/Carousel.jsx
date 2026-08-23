'use client';
import React from 'react';
import { motion } from 'framer-motion';

const banners = [
  { id: 1, text: "Book a Helper", sub: "Reliable, Attentive Service For Any Task", color: "bg-white" },
];

const categories = [
  { id: 1, name: "Attendant", icon: "/images/attended.png" },
  { id: 2, name: "Pandit Ji", icon: "/images/pandit.png" },
  { id: 3, name: "Hotel Resort", icon: "/images/hotel.png" },
  { id: 4, name: "Groceries", icon: "/images/groceries.png" },
  { id: 5, name: "School Items", icon: "/images/school.png" },
];

const Carousel = () => {
  return (
    <div className="py-4 space-y-6">
      {/* Top Categories Icons */}
      <div className="flex justify-between px-4 overflow-x-auto no-scrollbar gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center min-w-[70px] space-y-2">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
               {/* Using placeholder div if images don't exist */}
               <div className="w-full h-full bg-blue-100 rounded-lg" />
            </div>
            <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Main Banner */}
      <div className="px-4">
        <div className="relative h-40 bg-white rounded-3xl shadow-md flex items-center overflow-hidden border border-blue-50">
            <div className="flex-1 p-6 space-y-2 z-10">
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">Book a Helper</h2>
                <p className="text-[11px] text-gray-500 font-medium">Reliable, Attentive Service<br/>For Any Task</p>
                <button className="bg-orange-400 text-white text-[9px] px-3 py-1 rounded-md font-bold uppercase">Find Your Helper Today</button>
            </div>
            <div className="flex-1 h-full relative">
                {/* Mock image container */}
                <div className="absolute right-0 bottom-0 w-32 h-full bg-blue-50 rounded-l-full flex items-center justify-center overflow-hidden">
                    <div className="w-20 h-32 bg-gray-200 rounded-lg border-4 border-white shadow-lg" />
                </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-100/20 rounded-full -ml-8 -mb-8" />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
