'use client';

import SimpleHeader from '@/components/SimpleHeader';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, BookOpen } from 'lucide-react';

export default function BlogPage() {
  const serviceCategories = [
    { 
      name: "Attendant", 
      href: "/pages/Attendant", 
      image: "/image/attendant.jpg",
      description: "Professional home care and medical assistance at your doorstep."
    },
    { 
      name: "Cosmetic", 
      href: "/pages/Cosmetic", 
      image: "/image/cosmetic.jpg",
      description: "Expert beauty treatments and grooming services for all occasions."
    },
    { 
      name: "Groceries", 
      href: "/pages/Groceries", 
      image: "/image/grocery.jpg",
      description: "Fresh produce and daily essentials delivered within minutes."
    },
    { 
      name: "Guardian Kids", 
      href: "/pages/GuardianKids", 
      image: "/image/kids.jpg",
      description: "Reliable childcare and educational guidance for your little ones."
    },
    { 
      name: "Hotel", 
      href: "/pages/Hotel", 
      image: "/image/hotel.jpg",
      description: "Find the best accommodations and luxury stays in your city."
    },
    { 
      name: "Mehndi", 
      href: "/pages/Mehndi", 
      image: "/image/mehndi.jpg",
      description: "Traditional and modern henna designs by skilled artists."
    },
    { 
      name: "Pandit", 
      href: "/pages/Pandit", 
      image: "/image/pandit.jpg",
      description: "Connect with certified priests for all religious rituals."
    },
    { 
      name: "School Uniform & Accessories ", 
      href: "/pages/School", 
      image: "/image/school.jpg",
      description: "Academic support and schooling assistance for every grade."
    },
  ];

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      <SimpleHeader title="Sevadoot Blog" />
      
      <div className="p-6 space-y-8 pb-20">
        <section className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-4 bg-[#1898A5]/10 text-[#1898A5] rounded-3xl mb-2">
            <BookOpen size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Our Services & Insights</h2>
          <p className="text-gray-500 text-sm">Explore our wide range of professional services designed to simplify your life.</p>
        </section>

        <div className="grid gap-6">
          {serviceCategories.map((category) => (
            <Link 
              key={category.name} 
              href={category.href}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image 
                  src={category.image} 
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1521791136064-7986c29596ba?q=80&w=500&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#1898A5] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                    Service
                  </span>
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 line-clamp-1 flex-1 pr-4">{category.description}</p>
                <div className="bg-gray-50 p-2 rounded-full text-[#1898A5] group-hover:bg-[#1898A5] group-hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="bg-gray-50 p-8 rounded-[2.5rem] text-center space-y-4">
          <h4 className="font-bold text-gray-800">Ready to Book?</h4>
          <p className="text-xs text-gray-500">Select any category above to see details and book your service instantly.</p>
          <Link 
            href="/"
            className="inline-block bg-[#1898A5] text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-[#1898A5]/20"
          >
            Back to Home
          </Link>
        </section>
      </div>
    </div>
  );
}
