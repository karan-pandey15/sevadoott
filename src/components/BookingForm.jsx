"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BookingForm() {
  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md sticky top-[100px]"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Book Now</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
          <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F58220]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</label>
          <input type="tel" placeholder="+91 98765 43210" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F58220]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
            <input type="date" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F58220]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Time</label>
            <input type="time" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F58220]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
          <textarea placeholder="Your full address..." className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F58220] h-24" />
        </div>
        <button type="submit" className="w-full bg-[#1898A5] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#106670] active:scale-95 transition-all">
          Confirm Booking
        </button>
      </form>
    </motion.div>
  );
}
