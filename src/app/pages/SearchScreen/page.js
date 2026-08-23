"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO_KEYWORD_PHRASES } from "@/lib/seo";

const THEME_COLOR = "#1898A5";

const SEO_TRENDING = SEO_KEYWORD_PHRASES.map((item) => ({
  name: item.title,
  href: item.href,
  icon: "✨",
  description: item.shortDescription,
  keywords: item.phrase,
}));

const SERVICES = [
  ...SEO_TRENDING,
  { name: "Attendant", href: "/pages/Attendant", icon: "👨‍⚕️", description: "Professional care for parents", keywords: "attendant" },
  { name: "Cosmetic", href: "/pages/Cosmetic", icon: "💄", description: "Beauty & skincare products", keywords: "cosmetic" },
  { name: "Groceries", href: "/pages/Groceries", icon: "🛒", description: "Daily essentials delivered", keywords: "groceries" },
  { name: "Guardian Kids", href: "/pages/GuardianKids", icon: "👶", description: "Safety for your little ones", keywords: "guardian kids" },
  { name: "Hotel", href: "/pages/Hotel", icon: "🏨", description: "Luxury stays and bookings", keywords: "hotel resort" },
  { name: "Mehndi", href: "/pages/Mehndi", icon: "🪷", description: "Traditional bridal designs", keywords: "mehndi mehandi" },
  { name: "Pandit", href: "/pages/Pandit", icon: "🕉️", description: "Spiritual & ritual services", keywords: "pandit puja" },
  { name: "School", href: "/pages/School", icon: "🏫", description: "Educational support", keywords: "school uniform" },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState(SERVICES);
  const inputRef = useRef(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter services based on query
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setFilteredServices(SERVICES);
    } else {
      const filtered = SERVICES.filter(s =>
        s.name.toLowerCase().includes(trimmed) ||
        s.description.toLowerCase().includes(trimmed) ||
        (s.keywords && s.keywords.toLowerCase().includes(trimmed))
      );
      setFilteredServices(filtered);
    }
  }, [query]);

  const handleNavigate = (href) => {
    router.push(href);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col overflow-hidden">
      {/* ── Dynamic Background Glow ── */}
      <div className="fixed top-0 left-0 right-0 h-[300px] pointer-events-none opacity-20 -z-10 bg-gradient-to-b from-[#1898A5] to-transparent" />

      {/* ── Search Header ── */}
      <header className="px-4 pt-8 pb-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 transition-all"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1898A5] transition-colors">
              <Search size={20} strokeWidth={2.5} />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-100/80 border-2 border-transparent focus:border-[#1898A5]/30 focus:bg-white px-12 py-3.5 text-[16px] font-semibold text-gray-900 placeholder-gray-400 outline-none transition-all"
            />
            {query.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
              >
                <X size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* ── Search Body ── */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredServices.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Service Grid/List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center gap-2 mb-2 px-1 col-span-full">
                    <TrendingUp size={16} className="text-[#1898A5]" />
                    <span className="text-[12px] font-black uppercase tracking-[0.1em] text-gray-400">
                      {query.length > 0 ? "Matching Services" : "Suggested for you"}
                    </span>
                  </div>

                  {filteredServices.map((service, idx) => (
                    <motion.button
                      key={service.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(service.href)}
                      className="flex items-center gap-4 p-4 bg-white border border-gray-100 transition-all duration-300 text-left group"
                    >
                      <div className="w-14 h-14 bg-[#1898A5]/10 flex items-center justify-center text-2xl group-hover:bg-[#1898A5] group-hover:text-white transition-all duration-300">
                        {service.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] font-black italic tracking-tight text-gray-900 leading-tight flex items-center gap-2">
                          {service.name}
                          {idx === 0 && !query && (
                            <span className="bg-yellow-400 text-black text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter not-italic">Popular</span>
                          )}
                        </h3>
                        <p className="text-[12px] font-medium text-gray-400 line-clamp-1 mt-0.5">
                          {service.description}
                        </p>
                      </div>

                      <div className="p-2.5 bg-gray-50 text-gray-300 group-hover:text-[#1898A5] group-hover:bg-[#1898A5]/10 transition-all">
                        <ArrowRight size={18} />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Extra attractive section if nothing typed */}
                {!query && (
                  <div className="mt-8 pt-8 border-t border-gray-50">
                    <div className="bg-gradient-to-r from-[#1898A5] to-[#106670] p-6 text-white relative overflow-hidden">
                      <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white opacity-10 rotate-12" />
                      <h4 className="text-lg font-black italic uppercase leading-none mb-2">Can&apos;t find it?</h4>
                      <p className="text-xs text-white/80 font-medium leading-relaxed max-w-[200px]">
                        Our support team is available 24/7 to help you with bookings.
                      </p>
                      <button className="mt-4 px-6 py-2.5 bg-white text-[#1898A5] text-[12px] font-black uppercase tracking-widest active:scale-95 transition-transform">
                        Chat Now
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 bg-gray-50 flex items-center justify-center mb-6 text-gray-200">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tight">No results for &quot;{query}&quot;</h3>
                <p className="text-sm text-gray-400 font-medium mt-2 max-w-[200px]">
                  Try searching for specific services like &quot;Mehndi&quot; or &quot;Grocery&quot;
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClear}
                  className="mt-8 text-[12px] font-black text-[#1898A5] uppercase tracking-widest border-b-2 border-[#1898A5] pb-1"
                >
                  Show all services
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
