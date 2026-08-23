"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartRedux, removeFromCart as removeFromCartRedux } from "@/redux/cartSlice";

// ─── CATEGORIES CONFIG ───────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "Gynecologist",
    name: "Common issues related to women",
    emoji: "👩‍⚕️",
  }
];

// ─── STATIC SERVICE DATA ─────────────────────────────────────────────────────
const STATIC_SERVICES = {
  Gynecologist: [
    // {
    //   _id: "issue_1",
    //   name: "Period problems (irregular or painful periods)",
    //   price: "",
    //   description: "Consultation for irregular, heavy, or painful menstrual cycles.",
    //   emoji: "/image/preg.png",
    // },
    {
      _id: "issue_2",
      name: "Pregnancy and delivery",
 price: "",
      description: "Comprehensive prenatal and postnatal care for mother and baby.",
      emoji: "/image/preg.png",
    },
    // {
    //   _id: "issue_3",
    //   name: "Hormonal issues Polycystic Ovary Syndrome (PCOS)",
    //   price: "",
    //   description: "Diagnosis and management of PCOS related hormonal imbalances.",
    //   emoji: "/image/preg.png",
    // },
    // {
    //   _id: "issue_4",
    //   name: "Polycystic Ovary Syndrome (PCOD)",
    //  price: "",
    //   description: "Specialized care for PCOD symptoms and management.",
    //   emoji: "/image/preg.png",
    // },
    // {
    //   _id: "issue_5",
    //   name: "Infection or white discharge",
    //   price: "",
    //   description: "Treatment for various gynecological infections and concerns.",
    //   emoji: "/image/preg.png",
    // },
    // {
    //   _id: "issue_6",
    //   name: "Fertility issues (difficulty in conceiving)",
    //   price: "",
    //   description: "Expert advice and treatment options for conception difficulties.",
    //   emoji: "/image/physiotherapist.png",
    // },
    // {
    //   _id: "issue_7",
    //   name: "Menopause-related problems",
    //    price: "",
    //   description: "Support and treatment for physical and emotional changes during menopause.",
    //   emoji: "/image/preg.png",
    // },
    // {
    //   _id: "issue_8",
    //   name: "Unexpected Pregnancy",
    //   price: "",
    //   description: "Compassionate counseling and medical options for unplanned pregnancies.",
    //   emoji: "/image/preg.png",
    // },
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
const SERVICE_EMOJIS = ["🌸", "🩺", "🤰", "💊"];
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

// ─── INNER COMPONENT — uses useSearchParams ─────────
function AllCategoryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState(STATIC_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setUser(loadUser());
  }, []);

  useEffect(() => {
    const found = categoryId
      ? CATEGORIES.find((c) => c.id === categoryId)
      : null;
    if (found) setSelectedCategory(found);
  }, [categoryId]);

  const getQty = (id) => cartItems.find((i) => i.id === id)?.quantity || 0;

  const addToCart = (item) => {
    const emoji = item.emoji || getServiceEmoji(item._id);
    dispatch(addToCartRedux({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image || (item.emoji?.startsWith("/") ? item.emoji : null),
      emoji: (item.emoji && !item.emoji.startsWith("/")) ? item.emoji : emoji,
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
    let imageUrl = item.image || (item.emoji?.startsWith("/") ? item.emoji : null);
    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1584512603392-f0c3d99c1ce0?q=80&w=800";
    }
    const emoji = (item.emoji && !item.emoji.startsWith("/")) ? item.emoji : getServiceEmoji(item._id);
    
    const params = new URLSearchParams({
      title: item.name,
      price: item.price,
      description: item.description || "",
      category: selectedCategory?.name || "Gynecologist",
      image: imageUrl,
      emoji: emoji,
      id: item._id,
    });
    // Navigating to a custom details page for ladies' issues
    router.push(`/pages/ladies/details?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white relative">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30 w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-900">Women's Health</span>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </div>

      {user && (
        <div className="mx-4 mt-2 px-3 py-2 bg-pink-50 flex items-center gap-2 text-xs text-pink-700 font-medium rounded-lg">
          <span>👤</span>
          <span>Hi, {user.name || user.email || "User"}</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
        <div className="w-20 sm:w-24 flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex flex-col items-center py-4 px-1 transition-colors ${isActive ? "bg-pink-50" : "hover:bg-gray-50"}`}
              >
                <div className={`w-12 h-12 flex items-center justify-center text-2xl mb-1.5 border transition-colors rounded-xl ${isActive ? "bg-pink-100 border-pink-400" : "bg-gray-50 border-gray-200"}`}>
                  {cat.emoji}
                </div>
                <span className={`text-[9px] text-center font-bold uppercase tracking-tighter ${isActive ? "text-pink-700" : "text-gray-600"}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-gray-50 overflow-y-auto pb-28">
          <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                {selectedCategory?.name}
              </h2>
              <p className="text-xs text-gray-500 font-medium">Select an issue to book a consultation or view details.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentServices.map((item) => {
                const qty = getQty(item._id);
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col cursor-pointer active:scale-95 transition-all hover:shadow-md"
                    onClick={() => handleServiceClick(item)}
                  >
                    <div className="w-full aspect-square bg-pink-50 flex items-center justify-center overflow-hidden relative">
                      {renderEmojiOrImage(item.emoji, item._id, "w-full h-full object-cover")}
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                        {item.name}
                      </p>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm sm:text-lg font-black text-pink-600">
                            {/* ₹{item.price} */}
                          </span>
                        </div>

                        {qty > 0 ? (
                          <div className="flex items-center justify-between bg-pink-600 rounded-lg px-2 py-1.5" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => decrementQty(item._id)} className="text-white font-bold text-xl w-8 h-8 flex items-center justify-center">−</button>
                            <span className="text-white font-bold">{qty}</span>
                            <button onClick={() => incrementQty(item._id)} className="text-white font-bold text-xl w-8 h-8 flex items-center justify-center">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                            className="w-full bg-gray-900 text-white text-[10px] sm:text-xs font-black py-2.5 rounded-lg hover:bg-black transition-colors uppercase tracking-wider"
                          >
                            Add to Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CartButton cartItems={cartItems} onViewCart={() => router.push("/cart")} />

      {searchOpen && (
        <SearchOverlay
          services={services}
          onClose={() => setSearchOpen(false)}
          onSelectService={(item) => {
            handleServiceClick(item);
          }}
        />
      )}
    </div>
  );
}

export default function LadiesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" /></div>}>
      <AllCategoryInner />
    </Suspense>
  );
}
