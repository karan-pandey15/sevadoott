"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartRedux, removeFromCart as removeFromCartRedux } from "@/redux/cartSlice";

// ─── CATEGORIES CONFIG ───────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "small_dogs",
    name: "Small Dogs",
    image: "/image/dog.png",
  },
  {
    id: "large_dogs",
    name: "Large Dogs",
    image: "/image/dog.png",
  },
  {
    id: "cats",
    name: "Cats",
    image: "/image/catimage.png",
  },
];

// ─── STATIC SERVICE DATA ─────────────────────────────────────────────────────
const STATIC_SERVICES = {
  small_dogs: [
    {
      _id: "small_dog_walk_15",
      name: "Quick 15 Min Walk",
      price: 150,
      time: "15 mins",
      description: "A quick 15-minute walk for your small dog.",
      image: "/image/dog.png",
    },
    {
      _id: "small_dog_walk_30",
      name: "Standard 30 Min Walk",
      price: 250,
      time: "30 mins",
      description: "A standard 30-minute walk for your small dog.",
      image: "/image/dog.png",
    },
    {
      _id: "small_dog_walk_60",
      name: "Premium 60 Min Walk",
      price: 450,
      time: "60 mins",
      description: "A premium 60-minute walk for your small dog.",
      image: "/image/dog.png",
    },
  ],
  large_dogs: [
    {
      _id: "large_dog_walk_15",
      name: "Quick 15 Min Walk",
      price: 200,
      time: "15 mins",
      description: "A quick 15-minute walk for your large dog.",
      image: "/image/dog.png",
    },
    {
      _id: "large_dog_walk_30",
      name: "Standard 30 Min Walk",
      price: 350,
      time: "30 mins",
      description: "A standard 30-minute walk for your large dog.",
      image: "/image/dog.png",
    },
    {
      _id: "large_dog_walk_60",
      name: "Premium 60 Min Walk",
      price: 600,
      time: "60 mins",
      description: "A premium 60-minute walk for your large dog.",
      image: "/image/dog.png",
    },
  ],
  cats: [
    {
      _id: "cat_sitting_1h",
      name: "Cat Sitting 1 Hour",
      price: 200,
      time: "1 hour",
      description: "Professional cat sitting service for 1 hour.",
      image: "/image/catimage.png",
    },
    {
      _id: "cat_sitting_3h",
      name: "Cat Sitting 3 Hours",
      price: 500,
      time: "3 hours",
      description: "Professional cat sitting service for 3 hours.",
      image: "/image/catimage.png",
    },
    {
      _id: "cat_sitting_full_day",
      name: "Cat Sitting Full Day",
      price: 900,
      time: "Full Day",
      description: "Professional cat sitting service for the full day.",
      image: "/image/catimage.png",
    },
  ],
};

// ─── CART BUTTON ─────────────────────────────────────────────────────────────
function CartButton({ cartItems, onViewCart }) {
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmt = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  if (totalQty === 0) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
      <button
        onClick={onViewCart}
        className="pointer-events-auto w-full max-w-lg mx-auto flex items-center justify-between bg-violet-600 text-white px-4 sm:px-6 py-3 sm:py-4 active:scale-95 transition-transform rounded-xl shadow-2xl"
      >
        <div className="flex flex-col items-start">
          <span className="text-[9px] sm:text-xs font-black uppercase opacity-70 tracking-widest">
            {totalQty} ITEMS
          </span>
          <span className="font-bold text-sm sm:text-xl tracking-tight">
            ₹{totalAmt.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-xs sm:text-base tracking-widest uppercase">VIEW CART</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:h-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
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
          placeholder="Search services..."
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
function PetWalkerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);
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
    const emoji = selectedCategory.id === 'cats' ? "🐈" : "🐕";
    dispatch(addToCartRedux({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      emoji: emoji,
    }));
  };

  const incrementQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    const emoji = selectedCategory.id === 'cats' ? "🐈" : "🐕";
    if (item) {
      dispatch(addToCartRedux({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        emoji: emoji,
      }));
    }
  };

  const decrementQty = (id) => {
    dispatch(removeFromCartRedux(id));
  };

  const handleServiceClick = (item) => {
    const emoji = selectedCategory.id === 'cats' ? "🐈" : "🐕";
    const params = new URLSearchParams({
      title: item.name,
      price: item.price.toString(),
      description: item.description || "",
      category: selectedCategory?.name || "Pet Walker",
      image: item.image,
      duration: item.time || "",
      emoji: emoji,
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
          <span className="text-xl font-bold text-gray-900">Pet Walker</span>
        </div>
        <button onClick={() => setSearchOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <div className="w-20 sm:w-24 flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto pt-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex flex-col items-center py-2.5 sm:py-4 px-1 transition-all ${
                  isActive ? "bg-violet-50" : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border transition-all overflow-hidden mb-1 sm:mb-2 ${
                    isActive ? "bg-violet-100 border-violet-400" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <span className={`text-[9px] sm:text-[10px] text-center font-bold px-0.5 sm:px-1 uppercase tracking-tighter ${
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
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 sm:mb-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
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

export default function PetWalkerPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>}>
      <PetWalkerInner />
    </Suspense>
  );
}
