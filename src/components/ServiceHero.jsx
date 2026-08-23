"use client"; 
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ServiceHero({ title, tagline, image }) {
  return (
    <section className="relative h-[250px] md:h-[400px] overflow-hidden">
      <Image 
        src={image || "https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=1200"} 
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40 flex items-center px-4 md:px-20">
        <div className="max-w-[1280px] w-full mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-xl text-white"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-sm md:text-xl text-white/90">{tagline}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
