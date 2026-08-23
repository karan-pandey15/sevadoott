"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { number: "01", title: "Select Service", description: "Choose the service you need from our extensive catalog." },
    { number: "02", title: "Pick Date & Time", description: "Select a slot that fits your schedule perfectly." },
    { number: "03", title: "Get It Done", description: "Our verified professional will arrive and get the job done." }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[52px] left-0 w-full h-0.5 bg-[#1898A5]/10 z-0" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-3xl font-black text-[#1898A5] border-4 border-[#F58220]">
                {step.number}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
