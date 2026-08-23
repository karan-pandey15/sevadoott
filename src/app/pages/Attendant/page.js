 "use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartRedux, removeFromCart as removeFromCartRedux } from "@/redux/cartSlice";
import { apiUrl } from "@/lib/api";

// ─── CATEGORIES CONFIG ───────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "Attendant",
    name: "Book a Attendant For Your Parents",
    endpoint: apiUrl("/api/services/category/Attendant"),
    emoji: "🧓",
  },
  {
    id: "TravelingAttendant",
    name: "Book a Female Attendant For Traveling Airport",
    emoji: "/image/categoryimg/travellingattendant.png",
  }, 
   
];

// ─── STATIC SERVICE DATA ─────────────────────────────────────────────────────
const STATIC_SERVICES = {
  TravelingAttendant: [
    {
      _id: "traveling_attendant_1",
      name: "Book Traveling Attendant",  
      price: 999,
      description:
        "Professional attendant for traveling needs. Includes support for gender, religion reference, and location selection.",
      emoji: "/image/categoryimg/travellingattendant.png",
      image: "/image/categoryimg/travellingattendant.png",
      isTraveling: true,
    },
    {
      _id: "traveling_vehicle_1",
      name: "Traveling with Vehicle",
      price: 2499,
      description:
        "Professional attendant for traveling with vehicle. Support for Two Wheeler and Four Wheeler.",
      emoji: "/image/categoryimg/travellingattendant.png",
      image: "/image/categoryimg/travellingattendant.png",
      isTraveling: true,
      withVehicle: true,
    },
  ],
};

// ─── localStorage HELPERS ────────────────────────────────────────────────────
const CART_KEY = "marasimpex_cart";
const USER_KEY = "marasimpex_user";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
}
function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── EMOJI HELPER ────────────────────────────────────────────────────────────
const SERVICE_EMOJIS = [""];
function getServiceEmoji(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) % SERVICE_EMOJIS.length;
  return SERVICE_EMOJIS[Math.abs(hash) % SERVICE_EMOJIS.length];
}

function renderEmojiOrImage(emoji, id, className = "") {
  if (!emoji) emoji = getServiceEmoji(id);
  if (emoji?.startsWith("/")) {
    return (
      <img 
        src={emoji} 
        alt="service" 
        className={className}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }
  return <span className={className}>{emoji}</span>;
}

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
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
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
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {query.trim() === "" && (
          <p className="text-center text-gray-400 text-sm mt-10">
            Type to search services…
          </p>
        )}
        {filtered.length === 0 && query.trim() !== "" && (
          <p className="text-center text-gray-400 text-sm mt-10">
            No results for &quot;{query}&quot;
          </p>
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
            <div className="w-10 h-10 bg-violet-50 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
              {renderEmojiOrImage(item.emoji, item._id, "w-full h-full object-cover")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-violet-600 font-bold">
                ₹{item.price?.toLocaleString("en-IN")}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICE DETAIL MODAL ────────────────────────────────────────────────────
function ServiceDetailModal({ item, qty, onClose, onAdd, onInc, onDec }) {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg p-4 sm:p-6 pb-10 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full aspect-[5/3] bg-violet-50 flex items-center justify-center mb-4 text-5xl sm:text-7xl overflow-hidden relative">
          {renderEmojiOrImage(item.emoji, item._id, "w-full h-full object-contain absolute inset-0")}
          {(item.images?.[0]?.url || item.image) && (
            <img 
              src={item.images?.[0]?.url || item.image} 
              alt={item.name}
              className="w-full h-full object-contain absolute inset-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{item.name}</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">{item.description}</p>
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl sm:text-2xl font-extrabold text-violet-600">
            ₹{item.price?.toLocaleString("en-IN")}
          </span>
          {item.time && (
            <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 sm:px-3 py-1">
              ⏱ {item.time}
            </span>
          )}
        </div>
        {qty > 0 ? (
          <div className="flex items-center justify-between bg-violet-600 px-4 py-2 sm:py-3">
            <button
              onClick={onDec}
              className="text-white text-xl sm:text-2xl font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
            >
              −
            </button>
            <span className="text-white font-bold text-base sm:text-lg">{qty}</span>
            <button
              onClick={onInc}
              className="text-white text-xl sm:text-2xl font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="w-full bg-violet-600 text-white font-bold py-2.5 sm:py-3 text-xs sm:text-sm active:scale-95 transition-transform"
          >
            ADD TO CART
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-400 text-xs sm:text-sm py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── INNER COMPONENT — uses useSearchParams (must be inside Suspense) ─────────
function AllCategoryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [apiErrors, setApiErrors] = useState({});

  // Hydrate from localStorage (client only)
  useEffect(() => {
    setUser(loadUser());
  }, []);

  // Set initial selected category from query param
  useEffect(() => {
    const found = categoryId
      ? CATEGORIES.find((c) => c.id === categoryId)
      : null;
    setSelectedCategory(found || CATEGORIES[0]);
  }, [categoryId]);

  // Fetch all services from API + static data
  const fetchAllServices = useCallback(async () => {
    setLoading(true);
    const errors = {};

    const results = await Promise.allSettled(
      CATEGORIES.map(async (cat) => {
        if (STATIC_SERVICES[cat.id]) {
          return { id: cat.id, services: STATIC_SERVICES[cat.id] };
        }
        if (cat.endpoint) {
          try {
            const res = await fetch(cat.endpoint, {
              cache: "no-store",
              headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const list = Array.isArray(data)
              ? data
              : data.services || data.data || data.gyms || [];
            
            // Map price if missing (e.g., Gym has monthlyPrice)
            const mappedList = list.map(item => ({
              ...item,
              price: item.price || item.monthlyPrice || 0
            }));
            return { id: cat.id, services: mappedList };
          } catch (err) {
            errors[cat.id] = err.message;
            return { id: cat.id, services: [] };
          }
        }
        return { id: cat.id, services: [] };
      })
    );

    const map = {};
    results.forEach((r) => {
      if (r.status === "fulfilled") {
        map[r.value.id] = r.value.services;
      }
    });

    setServices(map);
    setApiErrors(errors);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  // ── Cart helpers ────────────────────────────────────────────────────────────
  const getQty = (id) => cartItems.find((i) => i.id === id)?.quantity || 0;

  const addToCart = (item) => {
    const emoji = item.emoji || getServiceEmoji(item._id);
    dispatch(addToCartRedux({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image || null,
      emoji: emoji,
    }));
  };

  const incrementQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      dispatch(addToCartRedux({
        id: item.id,
        name: item.name,
        price: item.price,
      }));
    }
  };

  const decrementQty = (id) => {
    dispatch(removeFromCartRedux(id));
  };

  const currentServices = selectedCategory
    ? services[selectedCategory.id] || []
    : [];

  const handleServiceClick = (item) => {
    let imageUrl = null;
    if (Array.isArray(item.images) && item.images.length > 0) {
      imageUrl = typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url;
    } else {
      imageUrl = item.image || item.images?.[0]?.url || item.images?.[0];
    }

    if (!imageUrl && item.emoji?.startsWith("/")) {
      imageUrl = item.emoji;
    }
    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1584512603392-f0c3d99c1ce0?q=80&w=800";
    }
    const emoji = (item.emoji && !item.emoji.startsWith("/")) ? item.emoji : getServiceEmoji(item._id);
    
    // Prepare working hours for Gym
    let hours = item.time || "9 AM - 6 PM";
    if (item.workingHours) {
      hours = `${item.workingHours.from} - ${item.workingHours.to}`;
    }

    const params = new URLSearchParams({
      title: item.name,
      price: item.price,
      description: item.description || "",
      category: selectedCategory?.name || "Service",
      isTraveling: item.isTraveling ? "true" : "false",
      withVehicle: item.withVehicle ? "true" : "false",
      image: imageUrl,
      emoji: emoji,
      hours: hours,
      duration: item.monthlyPrice ? "Monthly" : (item.time || "1 Hour"),
    });
    router.push(`/pages/ServiceDetail?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white relative">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30 w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-900">Services</span>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <svg
            className="w-5 h-5 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </button>
      </div>

      {/* ── USER BADGE ── */}
      {user && (
        <div className="mx-4 mt-2 px-3 py-2 bg-violet-50 flex items-center gap-2 text-xs text-violet-700 font-medium">
          <span>👤</span>
          <span>Hi, {user.name || user.email || "User"}</span>
        </div>
      )}

      {/* ── LOADER ── */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading services…</p>
        </div>
      ) : (
        <div
          className="flex flex-1 overflow-hidden"
          style={{ height: "calc(100vh - 60px)" }}
        >
          {/* Sidebar hidden on Attendant listing (?categoryId=Attendant) */}
          {selectedCategory?.id !== "Attendant" && (
          <div className="w-20 sm:w-24 flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex flex-col items-center py-2.5 sm:py-3 px-1 transition-colors ${
                    isActive ? "bg-violet-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-lg sm:text-2xl mb-1.5 border transition-colors rounded-lg ${
                      isActive
                        ? "bg-violet-100 border-violet-400"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {renderEmojiOrImage(cat.emoji, cat.id, "w-full h-full object-contain")}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] text-center font-bold uppercase leading-tight px-0.5 tracking-tighter ${
                      isActive ? "text-violet-700" : "text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </span>
                  {apiErrors[cat.id] && (
                    <span className="text-[8px] sm:text-[9px] text-red-400 mt-0.5">
                      ⚠ no data
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          )}

          {/* ── SERVICES GRID ── */}
          <div className="flex-1 bg-gray-50 overflow-y-auto pb-28">
            <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
              {selectedCategory && (
                <div className="px-2 py-1 sm:py-2 mb-2 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">
                    {selectedCategory.name}
                  </h2>
                  {apiErrors[selectedCategory.id] && (
                    <p className="text-[10px] sm:text-xs text-red-400 mt-0.5">
                      ⚠ Could not load from server.
                    </p>
                  )}
                </div>
              )}

              {currentServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-4xl sm:text-5xl mb-3">📭</div>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    No services available in this category
                  </p>
                  <button
                    onClick={fetchAllServices}
                    className="mt-4 text-violet-600 text-[10px] sm:text-xs font-medium underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
                  {currentServices.map((item) => {
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
                        className="bg-white overflow-hidden border border-gray-100 flex flex-col cursor-pointer active:scale-95 transition-transform"
                        onClick={() => handleServiceClick(item)}
                      >
                        {/* Image / emoji */}
                        <div className="w-full aspect-square bg-violet-50 flex items-center justify-center overflow-hidden relative text-3xl sm:text-5xl">
                          {renderEmojiOrImage(item.emoji, item._id, "w-full h-full object-contain absolute inset-0")}
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-contain absolute inset-0"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )} 
                        </div>

                        {/* Details */}
                        <div className="p-2 sm:p-3 flex flex-col flex-1">
                          <p className="text-[11px] sm:text-sm font-bold text-gray-900 leading-tight mb-1 min-h-[1.5rem] line-clamp-2">
                            {item.name}
                          </p>
                          <div className="flex flex-col gap-1 mt-auto mb-2 sm:mb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm sm:text-base font-black text-violet-600">
                                ₹{item.price?.toLocaleString("en-IN")}
                              </span>
                              {item.time && (
                                <span className="text-[8px] sm:text-[10px] font-medium text-gray-400 bg-gray-100 px-1 sm:px-1.5 py-0.5 rounded">
                                  ⏱ {item.time}
                                </span>
                              )}
                            </div>
                            
                          </div>

                          {qty > 0 ? (
                            <div
                              className="flex items-center justify-between bg-violet-600 px-2 sm:px-3 py-1 sm:py-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => decrementQty(item._id)}
                                className="text-white font-bold text-lg sm:text-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
                              >
                                −
                              </button>
                              <span className="text-white font-bold text-sm sm:text-base">
                                {qty}
                              </span>
                              <button
                                onClick={() => incrementQty(item._id)}
                                className="text-white font-bold text-lg sm:text-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item);
                              }}
                              className="w-full border-[1.5px] sm:border-2 border-violet-500 text-violet-600 text-[10px] sm:text-sm font-bold py-1.5 sm:py-2 hover:bg-violet-50 transition-colors"
                            >
                              ADD TO CART
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CART BUTTON ── */}
      <CartButton
        cartItems={cartItems}
        onViewCart={() => router.push("/cart")}
      />

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <SearchOverlay
          services={services}
          onClose={() => setSearchOpen(false)}
          onSelectService={(item) => {
            const cat = CATEGORIES.find((c) =>
              (services[c.id] || []).some((s) => s._id === item._id)
            );
            if (cat) setSelectedCategory(cat);
            handleServiceClick(item);
          }}
        />
      )}

      {/* ── SERVICE DETAIL MODAL ── */}
      {detailItem && (
        <ServiceDetailModal
          item={detailItem}
          qty={getQty(detailItem._id)}
          onClose={() => setDetailItem(null)}
          onAdd={() => addToCart(detailItem)}
          onInc={() => incrementQty(detailItem._id)}
          onDec={() => decrementQty(detailItem._id)}
        />
      )}
    </div>
  );
}

// ─── SUSPENSE FALLBACK ────────────────────────────────────────────────────────
function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    </div>
  );
}

// ─── DEFAULT EXPORT ───────────────────────────────────────────────────────────
// useSearchParams() MUST be inside a Suspense boundary.
// The inner component uses it; this wrapper provides the boundary.
export default function AllCategoryPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AllCategoryInner />
    </Suspense>
  );
}