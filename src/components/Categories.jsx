'use client';
import React from 'react';

const trendingCategories = [
  { id: 1, name: "Attendant For Parents", icon: "/images/parents.png" },
  { id: 2, name: "Gaurdian For Kids", icon: "/images/kids.png" },
  { id: 3, name: "Booking for Pandit Ji", icon: "/images/pandit_booking.png" },
  { id: 4, name: "Hotel & Resort", icon: "/images/hotel_resort.png" },
  { id: 5, name: "School", icon: "/images/school_cat.png" },
  { id: 6, name: "Cosmetic", icon: "/images/cosmetic.png" },
];

const Categories = () => {
  return (
    <div className="px-4 py-4 space-y-4 bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800"></h2>
      
      <div className="grid grid-cols-2 gap-4 pb-10">
        {trendingCategories.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center space-y-3 border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center p-4">
                {/* Placeholder circle */}
                <div className="w-full h-full bg-blue-100 rounded-full" />
            </div>
            <span className="text-sm font-bold text-center text-gray-700 leading-tight h-8 flex items-center">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
