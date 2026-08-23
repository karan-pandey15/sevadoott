"use client";

import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Search, 
  Share2, 
  Clock, 
  Star, 
  ChevronRight,
  MapPin,
  ShoppingCart,
  Percent,
  Plus,
  Minus,
  Info,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA ---
const CATEGORIES = [
  { id: "make-your-package", name: "Make Your Package", icon: "/image/categoryimg/salon.png" },
  { id: "korean-glow", name: "Korean Glow", icon: "/image/categoryimg/salon.png" },
  { id: "waxing", name: "Waxing", icon: "/image/categoryimg/salon.png" },
  { id: "facial", name: "Facial", icon: "/image/categoryimg/salon.png" },
  { id: "body-polishing", name: "Body Polishing", icon: "/image/categoryimg/salon.png" },
];

const PACKAGES = [
  {
    id: 1,
    title: "Korean Glow Special",
    type: "Multiple services",
    price: 3183,
    originalPrice: 6246,
    discount: "49% OFF",
    duration: "4 hrs 32 mins",
    bookings: "34K+ Bookings in Last 30 days",
    image: "/image/categoryimg/salon.png",
    description: "A comprehensive beauty ritual combining the best of Korean skincare techniques with premium waxing and grooming services for a complete transformation.",
    services: [
      { name: "Waxing", detail: "Full Arms, Full Legs & Underarms (Korean Waxing Ritual)" },
      { name: "Premium Facial", detail: "Korean Glow Facial (Korean Glow Facial)" },
      { name: "Manicure & Pedicure", detail: "Mani-Pedi Combo (Korean Luxe Mani & pedi)" },
      { name: "Facial Hair Removal", detail: "Eyebrows (Threading)" }
    ]
  },
  {
    id: 2,
    title: "Korean Waxing Special",
    type: "Multiple services",
    price: 1759,
    originalPrice: 3448,
    discount: "48% OFF",
    duration: "2 hrs 45 mins",
    bookings: "2K+ Bookings in Last 30 days",
    image: "/image/categoryimg/salon.png",
    description: "Expert waxing services using Korean bean peel-off wax for a smoother, less painful experience across all major areas.",
    services: [
      { name: "Waxing", detail: "Full Arms, Full Legs & Underarms (Korean Waxing Ritual)" },
      { name: "Intimate Waxing", detail: "Bikini Wax (Korean Bean Peel-Off Wax)" },
      { name: "Facial Hair Removal", detail: "Full Face (Threading)" }
    ]
  },
  {
    id: 3,
    title: "Wax & Relax",
    type: "Multiple services",
    price: 2835,
    originalPrice: 4947,
    discount: "42% OFF",
    duration: "3 hrs 57 mins",
    bookings: "1.5K+ Bookings in Last 30 days",
    image: "/image/categoryimg/salon.png",
    description: "The perfect combo for skin rejuvenation and smooth skin. Features Rica wax and O3+ premium products.",
    services: [
      { name: "Waxing", detail: "Full Arms, Full Legs & Underarms (Rica)" },
      { name: "Classic Facial", detail: "Vit-C Brightening Facial (Vit-C Brightening Facial)" },
      { name: "Manicure & Pedicure", detail: "Mani-Pedi Combo (O3+)" }
    ]
  }
];

// --- COMPONENTS ---

function DetailView({ pkg, onClose, onAdd, cartQty }) {
  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto max-w-md mx-auto"
    >
      <div className="relative h-72">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
          <Share2 size={20} className="text-gray-900" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{pkg.title}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-black px-2 py-0.5 rounded">
                <Percent size={12} strokeWidth={3} />
                {pkg.discount}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs font-bold">
                <Clock size={14} />
                {pkg.duration}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</p>
            <p className="text-2xl font-black text-[#B01050]">₹{pkg.price.toLocaleString()}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">{pkg.description}</p>

        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900">What's Included</h3>
          {pkg.services.map((service, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm">
                <Check className="text-[#B01050]" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{service.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{service.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-3 mb-8">
          <Star className="text-orange-500 fill-orange-500" size={20} />
          <div>
            <p className="text-sm font-bold text-orange-900">Highly Rated Package</p>
            <p className="text-xs text-orange-700">Trusted by over {pkg.bookings.split(' ')[0]} users this month</p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => onAdd(pkg)}
          className="w-full bg-[#B01050] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-pink-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {cartQty > 0 ? `In Cart (${cartQty})` : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}

export default function SalonPage() {
  const [activeTab, setActiveTab] = useState("make-your-package");
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [cart, setCart] = useState({}); // { id: qty }

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const pkg = PACKAGES.find(p => p.id === parseInt(id));
      return total + (pkg?.price || 0) * qty;
    }, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  const handleAdd = (pkg) => {
    setCart(prev => ({
      ...prev,
      [pkg.id]: (prev[pkg.id] || 0) + 1
    }));
  };

  const handleRemove = (pkgId) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[pkgId] > 1) next[pkgId] -= 1;
      else delete next[pkgId];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-28 font-sans max-w-md mx-auto shadow-2xl relative">
      <AnimatePresence>
        {selectedPkg && (
          <DetailView 
            pkg={selectedPkg} 
            onClose={() => setSelectedPkg(null)} 
            onAdd={handleAdd}
            cartQty={cart[selectedPkg.id] || 0}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Salon for Women</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Search size={22} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 size={22} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white sticky top-[53px] z-40 overflow-x-auto no-scrollbar border-b border-gray-100">
        <div className="flex whitespace-nowrap px-4 py-2 gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`pb-2 text-sm font-semibold transition-all relative ${
                activeTab === cat.id ? "text-[#B01050]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat.name}
              {activeTab === cat.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B01050] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="animate-in fade-in duration-500">
        {/* Banner */}
        <section className="p-4">
          <div className="bg-gradient-to-br from-pink-50 via-white to-orange-50 rounded-[32px] p-8 relative overflow-hidden border border-white shadow-inner">
            <div className="relative z-10 max-w-[65%]">
              <span className="text-[#B01050] text-[10px] font-black uppercase tracking-widest mb-2 block">Mix • Match • Glow</span>
              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-6">
                Create Your Own Package & <span className="text-[#B01050]">Save 50%</span>
              </h2>
              <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-gray-200 active:scale-95">
                Explore
              </button>
            </div>
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[45%] aspect-square flex items-center justify-center rotate-6">
              <div className="grid grid-cols-2 gap-2 opacity-90">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden">
                    <img src="/image/categoryimg/salon.png" alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Strip */}
        <section className="px-4 mb-8">
          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-2">
            <div className="flex-shrink-0 bg-[#B01050] rounded-[24px] p-4 flex flex-col items-center justify-center min-w-[95px] shadow-xl shadow-pink-100 text-white">
              <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">Extra Upto</span>
              <span className="text-2xl font-black leading-none my-1">50%</span>
              <span className="text-[9px] font-black uppercase tracking-widest">OFF</span>
            </div>
            {CATEGORIES.slice(1).map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => setActiveTab(cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-3 active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-[20px] overflow-hidden shadow-sm border-2 border-white bg-white">
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black text-gray-800 text-center max-w-[64px] leading-tight uppercase tracking-tighter">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* List */}
        <section className="px-4 space-y-8">
          {PACKAGES.map((pkg) => (
            <motion.div 
              key={pkg.id} 
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPkg(pkg)}
            >
              <div className="p-6 pb-0 flex gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pkg.type}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-4">{pkg.title}</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-black text-gray-900">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                    <div className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-1 rounded-lg">
                      {pkg.discount}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                    <Clock size={14} />
                    {pkg.duration}
                  </div>
                </div>

                <div className="w-28 h-28 rounded-3xl overflow-hidden relative shadow-lg shadow-gray-100">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="mx-6 mt-6 py-3 px-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                 <div className="flex -space-x-2.5">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm">
                       <img src="/image/categoryimg/salon.png" alt="" className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
                 <span className="text-[11px] font-black text-gray-600 tracking-tight">{pkg.bookings}</span>
              </div>

              <div className="p-6 space-y-4">
                {pkg.services.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B01050] mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-gray-800 leading-snug">
                      <span className="font-bold">{service.name}:</span> <span className="text-gray-500">{service.detail}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-6 pt-2 flex items-center justify-between gap-4">
                <button 
                  className="p-3.5 border border-gray-100 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); /* Share logic */ }}
                >
                  <Share2 size={20} className="text-gray-600" />
                </button>
                <div className="flex-1 flex gap-3">
                  <button className="flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] font-black text-gray-800 uppercase tracking-widest hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                  {cart[pkg.id] ? (
                    <div className="flex-1 flex items-center justify-between bg-[#B01050] text-white rounded-2xl px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleRemove(pkg.id)} className="p-1"><Minus size={16} /></button>
                      <span className="font-black">{cart[pkg.id]}</span>
                      <button onClick={() => handleAdd(pkg)} className="p-1"><Plus size={16} /></button>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAdd(pkg); }}
                      className="flex-1 py-4 bg-[#B01050] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-100 active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Cart Summary */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 p-4"
          >
            <div className="bg-gray-900 rounded-[32px] p-5 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center relative">
                  <ShoppingCart size={24} className="text-white" />
                  <span className="absolute -top-2 -right-2 bg-[#B01050] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">
                    {cartCount}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Grand Total</p>
                  <p className="text-xl font-black text-white">₹{cartTotal.toLocaleString()}</p>
                </div>
              </div>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
