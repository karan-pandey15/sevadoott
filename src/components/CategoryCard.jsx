"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CategoryCard({ name, icon: Icon, path, emoji, iconBg, variant = "grid" }) {
  if (variant === "circle") {
    return (
      <Link href={path} className="flex flex-col items-center gap-2 group min-w-[80px]">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-full ${iconBg || 'bg-[#1898A5]/10'} flex items-center justify-center border-2 border-transparent group-hover:border-[#1898A5] transition-all`}
        >
          {Icon ? <Icon className="text-[#1898A5]" size={32} /> : <span className="text-2xl">{emoji}</span>}
        </motion.div>
        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center line-clamp-2 max-w-[80px]">
          {name}
        </span>
      </Link>
    );
  }

  return (
    <Link href={path}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center gap-4 group h-full border border-gray-100"
      >
        {emoji && (
          <span className="absolute top-3 right-3 text-sm opacity-80">{emoji}</span>
        )}
        
        <div className={`w-16 h-16 rounded-2xl ${iconBg || 'bg-gradient-to-br from-[#1898A5]/20 to-[#1898A5]/5'} flex items-center justify-center transition-transform group-hover:rotate-6`}>
          {Icon ? <Icon className="text-[#1898A5]" size={32} /> : <span className="text-3xl">{name[0]}</span>}
        </div>

        <h3 className="font-bold text-gray-800 text-center text-sm sm:text-base leading-tight">
          {name}
        </h3>

        <div className="mt-auto pt-2">
          <span className="text-[10px] font-bold text-[#1898A5] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            Book Now
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
