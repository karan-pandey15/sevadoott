"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartRedux, removeFromCart as removeFromCartRedux } from "@/redux/cartSlice";

// ─── CATEGORIES CONFIG ───────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "general_nurse",
    name: "General Nurse",
    image: "/image/nurse.png",
  },
  {
    id: "injection_drip",
    name: "Injection & Drip",
    image: "/image/nurse.png",
  },
  {
    id: "first_aid",
    name: "First Aid",
    image: "/image/nurse.png",
  },
];

// ─── STATIC SERVICE DATA ─────────────────────────────────────────────────────
const STATIC_SERVICES = {
  general_nurse: [
    {
      _id: "nurse_1h",
      name: "Nurse Visit (1 Hour)",
      price: 350,
      time: "1 hour",
      description: "Professional nurse visit for basic health checkups and assistance.",
      image: "/image/nurse.png",
      emoji: "👩‍⚕️",
    },
    {
      _id: "nurse_4h",
      name: "Nurse Visit (4 Hours)",
      price: 1200,
      time: "4 hours",
      description: "Intermediate nursing care for patients requiring longer monitoring.",
      image: "/image/nurse.png",
      emoji: "👩‍⚕️",
    },
    {
      _id: "nurse_12h",
      name: "Nurse Visit (12 Hours)",
      price: 2500,
      time: "12 hours",
      description: "Full shift nursing care for elderly or recovering patients.",
      image: "/image/nurse.png",
      emoji: "👩‍⚕️",
    },
  ],
  injection_drip: [
    {
      _id: "injection_visit",
      name: "Injection Service",
      price: 150,
      time: "15 mins",
      description: "Professional nurse for administering IM/IV injections at home.",
      image: "/image/nurse.png",
      emoji: "💉",
    },
    {
      _id: "drip_setting",
      name: "IV Drip Setting",
      price: 450,
      time: "45 mins",
      description: "Setting up IV infusion and monitoring for the duration.",
      image: "/image/nurse.png",
      emoji: "💧",
    },
    {
      _id: "dressing_minor",
      name: "Wound Dressing",
      price: 350,
      time: "30 mins",
      description: "Professional wound cleaning and dressing service.",
      image: "/image/nurse.png",
      emoji: "🩹",
    },
  ],
  first_aid: [
    {
      _id: "first_aid_basic",
      name: "Basic First Aid",
      price: 300,
      time: "30 mins",
      description: "Immediate first aid assistance for minor injuries.",
      image: "/image/nurse.png",
      emoji: "🚑",
    },
    {
      _id: "bp_sugar_check",
      name: "BP & Sugar Check",
      price: 350,
      time: "10 mins",
      description: "Quick home visit for blood pressure and blood sugar monitoring.",
      image: "/image/nurse.png",
      emoji: "🩸",
    },
  ],
};

// ─── CART BUTTON ─────────────────────────────────────────────────────────────
function CartButton({ cartItems, onViewCart }) {
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmt = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  if (totalQty === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none">
      <button
        onClick={onViewCart}
        className="pointer-events-auto w-full max-w-4xl mx-auto flex items-center justify-between bg-violet-600 text-white px-3 sm:px-5 py-2 sm:py-3 active:scale-95 transition-transform rounded-lg shadow-lg"
      >
        <div className="flex items-center gap-2">
          <span className="bg-white text-violet-600 font-bold text-[10px] sm:text-xs w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full">
            {totalQty}
          </span>
          <span className="font-semibold text-xs sm:text-sm">View Cart 🛒</span>
        </div>
        <span className="font-bold text-xs sm:text-sm">
          ₹{totalAmt.toLocaleString("en-IN")}
        </span>
      </button>
    </div>
  );
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────
function SearchOverlay({ services, onClose, onSelectService }) {
  const [query, setQuery] = useState("");
  const allServices = Object.values(services).flat();
  const filtered = query.trim()
    ? allServices.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onClose}>
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <input
          autoFocus
          className="flex-1 text-sm outline-none placeholder-gray-400"
          placeholder="Search nurse services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {query.trim() === "" && (
          <p className="text-center text-gray-400 text-sm mt-10">Type to search services…</p>
        )}
        {filtered.length === 0 && query.trim() !== "" && (
          <p className="text-center text-gray-400 text-sm mt-10">No results for &quot;{query}&quot;</p>
        )}
        {filtered.map((item) => (
          <button
            key={item._id}
            onClick={() => {
              onSelectService(item);
              onClose();
            }}
            className="w-full flex items-center gap-3 py-3 border-b border-gray-100 text-left"
          >
            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden rounded-md">
              <img src={item.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-violet-600 font-bold">₹{item.price?.toLocaleString("en-IN")}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── INNER COMPONENT ──────────────────────────────────────────────────────────
function NurseInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (categoryId) {
      const found = CATEGORIES.find((c) => c.id === categoryId);
      if (found) setSelectedCategory(found);
    }
  }, [categoryId]);

  const getQty = (id) => cartItems.find((i) => i.id === id)?.quantity || 0;

  const addToCart = (item) => {
    dispatch(addToCartRedux({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      emoji: item.emoji || "👩‍⚕️",
    }));
  };

  const incrementQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      dispatch(addToCartRedux({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        emoji: item.emoji || "👩‍⚕️",
      }));
    }
  };

  const decrementQty = (id) => {
    dispatch(removeFromCartRedux(id));
  };

  const handleServiceClick = (item) => {
    const params = new URLSearchParams({
      title: item.name,
      price: item.price.toString(),
      description: item.description || "",
      category: selectedCategory?.name || "Nurse",
      image: item.image,
      duration: item.time || "",
      emoji: item.emoji || "👩‍⚕️",
    });
    router.push(`/pages/ServiceDetail?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white relative">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 w-full border-b border-gray-50">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xl font-bold text-gray-900">Nurse & First Aid</span>
        </div>
        <button onClick={() => setSearchOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <div className="w-20 sm:w-[100px] flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto pt-2 lg:w-[150px]">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex flex-col items-center py-3 sm:py-4 px-1 transition-all ${
                  isActive ? "bg-violet-50" : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border transition-all overflow-hidden mb-1.5 sm:mb-2 ${
                    isActive ? "bg-violet-100 border-violet-400" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <span className={`text-[9px] sm:text-[10px] text-center font-bold px-0.5 sm:px-1 ${
                  isActive ? "text-violet-700" : "text-gray-500"
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── SERVICES GRID ── */}
        <div className="flex-1 bg-white overflow-y-auto pb-24">
          <div className="p-2 sm:p-4 grid grid-cols-2 gap-2 sm:gap-4">
            {STATIC_SERVICES[selectedCategory.id].map((item) => {
              const qty = getQty(item._id);
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-1.5 sm:p-2 transition-transform active:scale-[0.98]"
                  onClick={() => handleServiceClick(item)}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 sm:mb-2 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    <div className="absolute top-1 right-1 bg-white/80 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs">
                      {item.emoji}
                    </div>
                  </div>
                  <h3 className="text-[11px] sm:text-[13px] font-bold text-gray-800 leading-tight mb-1 min-h-[2.2rem] sm:min-h-[2.5rem] line-clamp-2">{item.name}</h3>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-extrabold text-violet-600">₹{item.price}</span>
                    <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium">{item.time}</span>
                  </div>

                  {qty > 0 ? (
                    <div className="flex items-center justify-between bg-violet-600 rounded-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => decrementQty(item._id)} className="text-white font-bold text-base w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-violet-700 transition-colors">
                        −
                      </button>
                      <span className="text-white font-bold text-[10px] sm:text-xs">{qty}</span>
                      <button onClick={() => incrementQty(item._id)} className="text-white font-bold text-base w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-violet-700 transition-colors">
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="w-full border border-violet-500 text-violet-600 text-[10px] sm:text-[11px] font-bold py-1.5 sm:py-2 rounded-md hover:bg-violet-50 transition-all uppercase"
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CART BUTTON ── */}
      <CartButton cartItems={cartItems} onViewCart={() => router.push("/cart")} />

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <SearchOverlay
          services={STATIC_SERVICES}
          onClose={() => setSearchOpen(false)}
          onSelectService={(item) => {
            const catId = Object.keys(STATIC_SERVICES).find(key => 
              STATIC_SERVICES[key].some(s => s._id === item._id)
            );
            if (catId) {
              const cat = CATEGORIES.find(c => c.id === catId);
              if (cat) setSelectedCategory(cat);
            }
            handleServiceClick(item);
          }}
        />
      )}
    </div>
  );
}

export default function NursePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>}>
      <NurseInner />
    </Suspense>
  );
}
