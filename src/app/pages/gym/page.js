"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartRedux, removeFromCart as removeFromCartRedux } from "@/redux/cartSlice";
import { apiUrl } from "@/lib/api";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const GYM_ENDPOINT = apiUrl("/api/gym/all");

// ─── localStorage HELPERS ────────────────────────────────────────────────────
const USER_KEY = "marasimpex_user";

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── INNER COMPONENT ─────────────────────────────────────────────────────────
function GymPageInner() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(true);
  const [allGyms, setAllGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(loadUser());
  }, []);

  // Fetch gyms and extract unique cities
  const fetchGyms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(GYM_ENDPOINT, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = data.gyms || [];
      
      const mappedList = list.map(item => ({
        ...item,
        price: item.monthlyPrice || 0,
        isAC: item._id ? (item._id.charCodeAt(item._id.length - 1) % 2 === 0) : Math.random() > 0.5,
      }));

      setAllGyms(mappedList);
      setFilteredGyms(mappedList);
      
      // Extract unique cities
      const uniqueCities = ["All", ...new Set(mappedList.map(g => g.address?.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  // Filtering Logic
  useEffect(() => {
    let result = allGyms;

    if (selectedCity !== "All") {
      result = result.filter(g => g.address?.city === selectedCity);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q)
      );
    }

    setFilteredGyms(result);
  }, [selectedCity, searchQuery, allGyms]);

  const getQty = (id) => cartItems.find((i) => i.id === id)?.quantity || 0;

  
  const handleServiceClick = (item) => {
    let imageUrl = null;
    
    // Always prioritize the first image from the array
    if (Array.isArray(item.images) && item.images.length > 0) {
      imageUrl = item.images[0];
    } else {
      imageUrl = item.image || item.images?.[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800";
    }
    
    let hours = "9 AM - 6 PM";
    if (item.workingHours) {
      hours = `${item.workingHours.from} - ${item.workingHours.to}`;
    }

    // Since base64 can be too long for URL, we'll store it in sessionStorage temporarily
    // to ensure GymDetails can pick it up if URL truncation occurs.
    // if (typeof window !== "undefined" && imageUrl.startsWith("data:")) {
    //   sessionStorage.setItem(`gym_img_${item._id}`, imageUrl);
    // }

    const params = new URLSearchParams({
      id: item._id,
      title: item.name,
      price: item.price.toString(),
      description: item.description || "",
      category: "Gym Membership",
      image: imageUrl.startsWith("data:") ? "base64" : imageUrl, // Flag for base64
      hours: hours,
      duration: "Monthly",
      isAC: (!!item.isAC).toString(),
    });
    router.push(`/pages/gymdetails?${params.toString()}`);
  };


  const incrementQty = (item) => {
    dispatch(addToCartRedux({
      id: item._id,
      name: `${item.name} (${item.isAC ? 'AC' : 'Non-AC'})`,
      price: item.price,
      isAC: item.isAC
    }));
  };

  const decrementQty = (id) => {
    dispatch(removeFromCartRedux(id));
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8f9fd] relative">
      {/* ── HEADER & SEARCH ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Fitness Centers</h1>
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input 
            type="text"
            placeholder="Search gym name or equipment..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── CITY SIDEBAR (Line by line tabs) ── */}
        <div className="w-20 sm:w-24 md:w-32 bg-white border-r border-gray-100 overflow-y-auto flex flex-col pt-4">
          <span className="px-2 sm:px-3 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Cities</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`py-3 sm:py-4 px-2 sm:px-3 text-left transition-all relative ${
                selectedCity === city 
                  ? "text-violet-600 font-bold bg-violet-50" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="text-[10px] sm:text-xs md:text-sm block truncate uppercase tracking-tighter">{city}</span>
              {selectedCity === city && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-violet-600 rounded-l" />
              )}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 overflow-y-auto pb-32 p-4">
          {user && (
            <div className="mb-4 p-3 bg-violet-600 rounded-2xl text-white flex items-center justify-between shadow-lg shadow-violet-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">👤</div>
                <div>
                  <p className="text-[10px] opacity-80 uppercase font-black">Member</p>
                  <p className="font-bold">Hi, {user.name || "Athelete"}</p>
                </div>
              </div>
              <div className="text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold">PRO</div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse font-bold uppercase tracking-wider">Loading Best Gyms...</p>
            </div>
          ) : (
            <>
              {filteredGyms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                  <div className="text-6xl mb-4">👟</div>
                  <p className="text-gray-500 font-bold">No gyms found here yet</p>
                  <button onClick={fetchGyms} className="mt-4 text-violet-600 text-sm font-bold underline">Show all</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredGyms.map((item) => {
                    const qty = getQty(item._id);
                    let imageUrl = null;
                    if (Array.isArray(item.images) && item.images.length > 0) {
                      imageUrl = typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url;
                    } else {
                      imageUrl = item.image || item.images?.[0]?.url || item.images?.[0];
                    }

                    return (
                      <div 
                        key={item._id} 
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group"
                        onClick={() => handleServiceClick(item)}
                      >
                        {imageUrl && (
                          <div className="w-full aspect-video overflow-hidden relative bg-gray-50">
                            <img 
                              src={imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-contain group-hover:scale-105 transition duration-700"
                              onError={(e) => { e.currentTarget.style.display = "none"; }} 
                            />
                            <div className="absolute top-2 left-2">
                              <span className="bg-black/60 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                                {item.address?.city}
                              </span>
                            </div>
                            <div className="absolute bottom-2 right-2">
                              <span className="bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase">
                                Verified
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-3 sm:p-5 flex flex-col flex-1">
                          <h3 className="text-sm sm:text-lg font-black text-gray-900 leading-tight mb-1 group-hover:text-violet-600 transition">{item.name}</h3>
                          <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-2 sm:mb-3 italic">📍 {item.address?.landmark || item.address?.street}</p>
                          
                          <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">{item.description}</p>
                          
                          <div className="flex items-center justify-between mt-auto bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-100">
                            <div>
                              <div className="flex items-center gap-1 mb-0.5">
                                <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest">Monthly</p>
                                <span className={`text-[7px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase tracking-tighter ${item.isAC ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                  {item.isAC ? 'AC' : 'Non AC'}
                                </span>
                              </div>
                              <span className="text-sm sm:text-xl font-black text-violet-600">₹{item.price?.toLocaleString("en-IN")}</span>
                            </div>
                            
                            {qty > 0 ? (
                              <div className="flex items-center gap-2 sm:gap-4 bg-violet-600 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 shadow-lg shadow-violet-200" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => decrementQty(item._id)} className="text-white font-bold text-lg sm:text-xl">−</button>
                                <span className="text-white font-bold text-xs sm:text-base">{qty}</span>
                                <button onClick={() => incrementQty(item)} className="text-white font-bold text-lg sm:text-xl">+</button>
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleServiceClick(item); }}
                                className="bg-gray-900 text-white text-[10px] sm:text-xs font-black px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-violet-600 transition shadow-lg active:scale-95 uppercase"
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── FLOATING VIEW CART ── */}
      {/* <CartButton cartItems={cartItems} onViewCart={() => router.push("/cart")} /> */}
    </div>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );
}

export default function GymPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <GymPageInner />
    </Suspense>
  );
}
