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
    name: "Gaurdian For Your Kids",
    endpoint: apiUrl("/api/services/category/GaurdianKids"),
    emoji: "🧓",
  }, 
];

// ─── STATIC SERVICE DATA ─────────────────────────────────────────────────────
const STATIC_SERVICES = {
  TravelingAttendant: [
    {
      _id: "traveling_attendant_1",
      name: "Book Traveling Attendant",
      price: 500,
      description:
        "Professional attendant for traveling needs. Includes support for gender, religion, and location selection.",
      emoji: "🧳",
      isTraveling: true,
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
const SERVICE_EMOJIS = ["", "", "", "", "", "", "", ""];
function getServiceEmoji(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) % SERVICE_EMOJIS.length;
  return SERVICE_EMOJIS[Math.abs(hash) % SERVICE_EMOJIS.length];
}

// ─── CART BUTTON ─────────────────────────────────────────────────────────────
function CartButton({ cartItems, onViewCart }) {
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmt = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  if (totalQty === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none flex justify-center md:justify-end">
      <button
        onClick={onViewCart}
        className="pointer-events-auto w-full max-w-lg md:w-96 flex items-center justify-between bg-violet-600 text-white px-3 sm:px-5 md:px-8 py-2 sm:py-3 md:py-5 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl shadow-violet-300 active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-2 md:gap-4">
          <span className="bg-white text-violet-600 font-bold text-[10px] sm:text-xs md:text-sm rounded-full w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex items-center justify-center">
            {totalQty}
          </span>
          <span className="font-bold text-xs sm:text-sm md:text-lg">View Cart 🛒</span>
        </div>
        <span className="font-black text-xs sm:text-sm md:text-xl">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-3xl p-6 md:p-10 overflow-y-auto shadow-2xl"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[400px] bg-violet-50 rounded-2xl flex items-center justify-center text-5xl sm:text-7xl overflow-hidden relative shadow-inner">
            
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

          {/* Right: Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 md:mb-4">{item.name}</h2>
            <p className="text-sm md:text-lg text-gray-500 mb-6 md:mb-8 leading-relaxed">{item.description}</p>
            
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <span className="text-3xl md:text-5xl font-black text-violet-600">
                ₹{item.price?.toLocaleString("en-IN")}
              </span>
              {item.time && (
                <span className="text-sm md:text-base text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full font-bold">
                  ⏱ {item.time}
                </span>
              )}
            </div>

            {qty > 0 ? (
              <div className="flex items-center justify-between bg-violet-600 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-5 shadow-lg">
                <button
                  onClick={onDec}
                  className="text-white text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  −
                </button>
                <span className="text-white font-black text-xl md:text-3xl">{qty}</span>
                <button
                  onClick={onInc}
                  className="text-white text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={onAdd}
                className="w-full bg-violet-600 text-white font-black py-4 md:py-6 rounded-xl md:rounded-2xl text-lg md:text-xl shadow-xl hover:bg-violet-700 active:scale-[0.98] transition-all"
              >
                ADD TO CART
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full mt-6 text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase tracking-widest text-xs md:text-sm"
            >
              Close
            </button>
          </div>
        </div>
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
              : data.services || data.data || [];
            return { id: cat.id, services: list };
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
    const imageUrl = item.images?.[0]?.url || item.image || "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800";
    const emoji = item.emoji || getServiceEmoji(item._id);
    const params = new URLSearchParams({
      title: item.name,
      price: item.price,
      description: item.description || "",
      category: selectedCategory?.name || "Service",
      isTraveling: item.isTraveling ? "true" : "false",
      image: imageUrl,
      emoji: emoji,
    });
    router.push(`/pages/ServiceDetail?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white relative">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-5 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
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
          <span className="text-lg md:text-2xl font-bold text-gray-900">Services</span>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
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
        <div className="mx-4 md:mx-8 mt-2 md:mt-4 px-3 md:px-5 py-2 md:py-3 bg-violet-50 rounded-xl flex items-center gap-2 text-xs md:text-sm text-violet-700 font-medium">
          <span>👤</span>
          <span>Hi, {user.name || user.email || "User"}</span>
        </div>
      )}

      {/* ── LOADER ── */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 md:w-16 md:h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm md:text-lg text-gray-400">Loading services…</p>
        </div>
      ) : (
        <div
          className="flex flex-1 overflow-hidden"
          style={{ height: "calc(100vh - 60px)" }}
        >
          {/* ── SIDEBAR ── */}
          <div className="w-20 sm:w-[100px] md:w-[160px] flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex flex-col items-center py-3 sm:py-4 md:py-8 px-1 transition-colors ${
                    isActive ? "bg-violet-50 border-r-4 border-violet-600" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-4xl mb-1.5 border transition-colors ${
                      isActive
                        ? "bg-violet-100 border-violet-400"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {cat.emoji}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] md:text-sm text-center font-bold leading-tight px-0.5 sm:px-1 uppercase tracking-tight ${
                      isActive ? "text-violet-700" : "text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </span>
                  {apiErrors[cat.id] && (
                    <span className="text-[8px] sm:text-[9px] md:text-xs text-red-400 mt-0.5">
                      ⚠ no data
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── SERVICES GRID ── */}
          <div className="flex-1 bg-gray-50 overflow-y-auto pb-28 scrollbar-hide">
            <div className="p-2 sm:p-4 md:p-8">
              {selectedCategory && (
                <div className="px-2 py-1 sm:py-2 mb-2 md:mb-6">
                  <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-700">
                    {selectedCategory.name}
                  </h2>
                  {apiErrors[selectedCategory.id] && (
                    <p className="text-[10px] sm:text-xs md:text-sm text-red-400 mt-0.5">
                      ⚠ Could not load from server.
                    </p>
                  )}
                </div>
              )}

              {currentServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-32 text-center">
                  <div className="text-4xl sm:text-5xl md:text-8xl mb-3">📭</div>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-lg">
                    No services available in this category
                  </p>
                  <button
                    onClick={fetchAllServices}
                    className="mt-4 text-violet-600 text-[10px] sm:text-xs md:text-sm font-medium underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
                  {currentServices.map((item) => {
                    const qty = getQty(item._id);
                    const emoji = item.emoji || getServiceEmoji(item._id);
                    const imageUrl = item.images?.[0]?.url || null;

                    return (
                      <div
                        key={item._id}
                        className="bg-white rounded-xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        onClick={() => handleServiceClick(item)}
                      >
                        {/* Image / emoji */}
                        <div className="w-full aspect-square bg-violet-50 flex items-center justify-center overflow-hidden relative">
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
                          <span className="text-3xl sm:text-4xl md:text-6xl z-0">{emoji}</span>
                        </div>

                        {/* Details */}
                        <div className="p-2 sm:p-3 md:p-5 flex flex-col flex-1">
                          <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-800 leading-tight line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between mt-1 mb-2 sm:mb-3">
                            <span className="text-sm sm:text-base md:text-xl font-black text-violet-600">
                              ₹{item.price?.toLocaleString("en-IN")}
                            </span>
                            {item.time && (
                              <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 font-medium bg-gray-50 px-1.5 sm:px-2 py-0.5 rounded-full">
                                {item.time}
                              </span>
                            )}
                          </div>

                          {qty > 0 ? (
                            <div
                              className="flex items-center justify-between bg-violet-600 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => decrementQty(item._id)}
                                className="text-white font-bold text-lg md:text-2xl w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white/10 rounded"
                              >
                                −
                              </button>
                              <span className="text-white font-bold text-xs sm:text-sm md:text-lg">
                                {qty}
                              </span>
                              <button
                                onClick={() => incrementQty(item._id)}
                                className="text-white font-bold text-lg md:text-2xl w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white/10 rounded"
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
                              className="w-full border-2 border-violet-500 text-violet-600 text-[10px] sm:text-xs md:text-sm font-black rounded-lg md:rounded-xl py-1.5 sm:py-2 md:py-3 hover:bg-violet-600 hover:text-white transition-all active:scale-95"
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