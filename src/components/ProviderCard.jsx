"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function ProviderCard({ name, rating, experience, image }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center gap-4 transition-all"
    >
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#1898A5]/10 shadow-lg shadow-[#1898A5]/20">
        <Image src={image || "https://i.pravatar.cc/150"} alt={name} fill className="object-cover" />
      </div>
      <div className="text-center">
        <h4 className="font-bold text-gray-800 text-lg mb-1">{name}</h4>
        <div className="flex items-center justify-center gap-1 mb-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-700">{rating || "4.9"}</span>
          <span className="text-xs text-gray-400 font-medium">(120+ reviews)</span>
        </div>
        <p className="text-xs font-bold text-[#1898A5] uppercase tracking-widest">{experience || "5 Years"} Exp.</p>
      </div>
      <button className="w-full bg-[#1898A5] text-white font-bold py-3 rounded-xl hover:bg-[#F58220] hover:text-[#1898A5] transition-all shadow-md">
        Book Now
      </button>
    </motion.div>
  );
}
