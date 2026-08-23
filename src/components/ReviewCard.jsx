"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function ReviewCard({ name, stars, text, avatar }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col gap-6"
    >
      <div className="flex gap-1">
        {[...Array(stars || 5)].map((_, i) => (
          <Star key={i} size={18} className="fill-[#F58220] text-[#F58220]" />
        ))}
      </div>
      <p className="text-gray-700 italic leading-relaxed text-sm md:text-base">"{text || "Outstanding service! The professional arrived on time and was very polite. Highly recommended for everyone in Noida."}"</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#1898A5]/20">
          <Image src={avatar || "https://i.pravatar.cc/100"} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm md:text-base">{name || "Arjun Sharma"}</h4>
          <p className="text-xs text-gray-400 font-medium">Verified Customer</p>
        </div>
      </div>
    </motion.div>
  );
}
