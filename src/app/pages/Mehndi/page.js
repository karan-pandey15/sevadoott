"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartRedux } from "@/redux/cartSlice";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  Info, 
  CheckCircle2,
  ChevronRight,
  Star,
  Users,
  ShieldCheck,
  Zap,
  MessageSquare,
  Send,
  Share2,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ACCENT = "#1898A5";

const MEHNDI_IMAGE_FILES = [
  "arbicmehndi.png",
  "coprateEventbookingmehndi.png",
  "fullhandbridalmehndi.png",
  "groupmehndi.png",
  "heavyarbicmehndi.png",
  "kidsmendi.png",
  "kittipartymehndi.png",
  "legmehndibridal.png",
  "minimilaistmehndi.png",
];

const inferCategoryId = (fileName) => {
  const key = fileName.toLowerCase();
  if (key.includes("bridal") || key.includes("leg")) return "Bridal";
  if (key.includes("arbic") || key.includes("arabic")) return "Arabic";
  if (key.includes("kittiparty")) return "KittyParty";
  if (key.includes("coprate") || key.includes("corporate") || key.includes("event")) return "Corporate";
  if (key.includes("group")) return "Group";
  if (key.includes("kids")) return "Kids";
  if (key.includes("minimilaist") || key.includes("minimal")) return "Simple";
  return "Special";
};

const prettifyNameFromFile = (fileName) =>
  fileName
    .replace(/\.png$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(fullhand)/gi, "Full Hand ")
    .replace(/(kittiparty)/gi, "Kitty Party ")
    .replace(/(coprate)/gi, "Corporate ")
    .replace(/(eventbooking)/gi, "Event Booking ")
    .replace(/(minimilaist)/gi, "Minimalist ")
    .replace(/(mendi)/gi, "Mehndi")
    .replace(/(arbic)/gi, "Arabic")
    .replace(/(mehndi)/gi, " Mehndi")
    .replace(/(bridal)/gi, "Bridal ")
    .replace(/(group)/gi, "Group ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const categoryDisplayName = {
  Bridal: "Bridal Wedding",
  Arabic: "Arabic Mehndi",
  Simple: "Simple Mehndi",
  Group: "For Group",
  KittyParty: "For Kitty Party",
  Corporate: "Corporate Office",
  Kids: "Kids Mehndi",
  Special: "Special Designs",
};

const serviceTimeByCategory = {
  Bridal: "3-4 Hours",
  Arabic: "1-2 Hours",
  Simple: "45-60 Mins",
  Group: "3-5 Hours",
  KittyParty: "2 Hours",
  Corporate: "Full Day",
  Kids: "30-45 Mins",
  Special: "1-2 Hours",
};

const ALL_MEHNDI_SERVICES = MEHNDI_IMAGE_FILES.map((fileName, index) => {
  const categoryId = inferCategoryId(fileName);
  const serviceName = prettifyNameFromFile(fileName);
  return {
    _id: `m${index + 1}`,
    categoryId,
    name: serviceName,
    price: 1499,
    time: serviceTimeByCategory[categoryId] || "1-2 Hours",
    image: `/image/mehndiimage/${fileName}`,
    description: `${serviceName} design service by professional artist. This style is based on the reference image and customized for your occasion.`,
  };
});

const categoryIds = [...new Set(ALL_MEHNDI_SERVICES.map((service) => service.categoryId))];

const CATEGORIES = categoryIds.map((id) => {
  const firstService = ALL_MEHNDI_SERVICES.find((service) => service.categoryId === id);
  return {
    id,
    name: categoryDisplayName[id] || id,
    icon: firstService?.image || "/image/mehndi.png",
  };
});

const MEHNDI_SERVICES = categoryIds.reduce((acc, id) => {
  acc[id] = ALL_MEHNDI_SERVICES.filter((service) => service.categoryId === id);
  return acc;
}, {});

const PACKAGES = [
  { name: "Basic",    priceAdd: 0, desc: "Reference image based design" },
  { name: "Standard", priceAdd: 0, desc: "Reference image based design" },
  { name: "Premium",  priceAdd: 0, desc: "Reference image based design" },
];

const TIMES = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM",
];

function generateDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full:    d.toISOString().split("T")[0],
      day:     d.toLocaleDateString("en-US", { weekday: "short" }),
      date:    d.getDate(),
      month:   d.toLocaleDateString("en-US", { month: "short" }),
      display: d.toLocaleDateString("en-US", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
      }),
    };
  });
}

// ─── ICONS ──────────────────────────────────────────────────────────────────
const IconBack = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconSearch = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const IconBrush = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
  </svg>
);
const IconInfo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1898A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);
const IconArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconHandRight = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);
const IconRadioOn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1898A5" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="5" fill="#1898A5" />
  </svg>
);
const IconRadioOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// ─── SUB-COMPONENT: DETAILS ────────────────────────────────────────────────
function MehndiArtistDetails({ artist, onBack, onAddToCart }) {
  const router = useRouter();
  const DATES = generateDates();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeImage, setActiveImage] = useState(artist.image);
  const [peopleCount, setPeopleCount] = useState(1);
  const [selectedHands, setSelectedHands] = useState(2);
  const [selectedPackage, setSelectedPackage] = useState("Standard");
  const [instructions, setInstructions] = useState("");

  // Rating and Review State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");
  const [userName, setUserName] = useState("");
  const [averageRating, setAverageRating] = useState(4.8);

  const currentPkg = PACKAGES.find((p) => p.name === selectedPackage);
  const totalPrice = (artist.price + (currentPkg?.priceAdd || 0)) * selectedHands * peopleCount;

  useEffect(() => {
    loadReviews();
  }, [artist.name]);

  const loadReviews = () => {
    const savedReviews = localStorage.getItem(`reviews_${artist.name}`);
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      setReviews(parsedReviews);
      if (parsedReviews.length > 0) {
        const sum = parsedReviews.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating((sum / parsedReviews.length).toFixed(1));
      }
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.trim() || !userName.trim()) return alert("Please provide your name and review");

    const reviewObj = {
      id: Date.now(),
      userName,
      rating: newRating,
      comment: newReview,
      date: new Date().toLocaleDateString(),
    };

    const updatedReviews = [reviewObj, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${artist.name}`, JSON.stringify(updatedReviews));
    const sum = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    setAverageRating((sum / updatedReviews.length).toFixed(1));
    setNewReview("");
    setNewRating(5);
    setUserName("");
  };

  const handleBooking = () => {
    if (selectedDate === null) return alert("Please select a date");
    if (!selectedTime) return alert("Please select a time slot");
    const dateObj = DATES[selectedDate];

    onAddToCart({
      id: `${artist._id}_${Date.now()}`,
      name: `${artist.name} (${selectedPackage})`,
      price: artist.price + (currentPkg?.priceAdd || 0) * selectedHands,
      totalPrice,
      quantity: peopleCount,
      hands: selectedHands,
      date: dateObj?.display,
      time: selectedTime,
      instructions,
      package: selectedPackage,
      category: "Mehndi Artist",
      image: artist.image || "/image/mehndi.png",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `Sevadoot - ${artist.name}`,
      text: `Check out this professional mehndi artist: ${artist.name}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Service link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans overflow-y-auto">
      {/* ── Top Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="hidden sm:flex items-center text-xs text-gray-500 gap-2">
            <span>Mehndi</span>
            <ChevronRight size={12} />
            <span>Professional Artist</span>
            <ChevronRight size={12} />
            <span className="font-bold text-gray-800">{artist.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Share2 size={20} className="text-gray-600 cursor-pointer hover:text-[#1898A5] transition-colors" onClick={handleShare} />
          <Heart size={20} className="text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
          <button onClick={() => router.push("/cart")} className="relative">
            <ShoppingCart size={22} className="text-gray-700 hover:text-[#1898A5]" />
            <span className="absolute -top-2 -right-2 bg-[#1898A5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
              0
            </span>
          </button>
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <div className="flex-1 max-w-[1500px] mx-auto w-full pt-16 pb-32">
        <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-6 lg:p-8">
          {/* ── Left Column: Title & Image Flow ── */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1898A5] uppercase tracking-wider block">Mehndi Artist</span>
              <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 leading-tight">{artist.name}</h1>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(averageRating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{averageRating}</span>
                <span className="text-xs text-gray-500">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden relative group">
              <img
                src={activeImage}
                alt={artist.name}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#1898A5] text-white px-2 py-1 text-[10px] font-bold rounded shadow-sm">
                Top Rated Artist
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(artist.image)}
                  className={`w-16 h-16 border rounded cursor-pointer p-1 transition-all ${
                    activeImage === artist.image && i === 1 ? "border-[#1898A5] ring-1 ring-[#1898A5]" : "border-gray-200 hover:border-[#1898A5] hover:scale-105"
                  }`}
                >
                  <img src={artist.image} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-900">About this service</h3>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{artist.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                <Info size={16} className="text-[#1898A5]" />
                Additional Instructions?
              </h4>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any specific design request or landmark..."
                className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-[#1898A5] focus:border-[#1898A5] outline-none transition-all resize-none"
                rows={3}
              />
            </div>

            {/* Rating and Reviews Section */}
            <div className="border-t border-gray-200 pt-8 mt-4">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <MessageSquare size={22} className="text-[#1898A5]" />
                Customer Reviews
              </h3>

              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
                <h4 className="text-sm font-bold text-gray-800">Write a Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Your Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1898A5]/20 focus:border-[#1898A5] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Rating</label>
                    <div className="flex gap-2 items-center h-[42px]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewRating(star)} className="hover:scale-110 transition-transform">
                          <Star
                            size={24}
                            fill={star <= newRating ? "#FACC15" : "none"}
                            className={star <= newRating ? "text-yellow-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Your Review</label>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1898A5]/20 focus:border-[#1898A5] outline-none min-h-[100px]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1898A5] hover:bg-[#147F8A] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-md"
                >
                  <Send size={16} />
                  Submit Review
                </button>
              </form>

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-bold text-gray-900">{review.userName}</h5>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Center Column: Info & Details ── */}
          <div className="w-full lg:w-[35%] space-y-6 border-b lg:border-b-0 pb-8 pt-0 lg:pt-14">
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-[#1898A5] text-white px-2 py-0.5 text-[10px] font-bold rounded">Sevadoot Choice</span>
              <span className="text-gray-500">for "{artist.name}"</span>
            </div>
            <hr className="border-gray-200" />
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-red-700">-10%</span>
                <div className="flex items-start">
                  <span className="text-sm mt-1 font-medium">₹</span>
                  <span className="text-3xl font-medium">{artist.price}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">M.R.P.: <span className="line-through">₹{Math.round(artist.price * 1.1)}</span></p>
              <div className="bg-gray-100 p-2 rounded inline-block text-[11px] font-bold text-gray-700 border border-gray-200">
                Inclusive of all taxes
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4">
              <FeatureItem icon={CheckCircle2} label="Verified" color="text-green-600" />
              <FeatureItem icon={ShieldCheck} label="Safe" color="text-[#1898A5]" />
              <FeatureItem icon={Zap} label="Quick" color="text-yellow-600" />
              <FeatureItem icon={Clock} label={artist.time} color="text-gray-600" />
            </div>

            <hr className="border-gray-200" />

            {/* People and Hands Section */}
            <div className="grid grid-cols-2 gap-4">
              <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Individuals</h3>
                <div className="flex items-center justify-between">
                  <button onClick={() => peopleCount > 1 && setPeopleCount(c => c - 1)} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-lg text-[#1898A5]">-</button>
                  <span className="font-bold text-lg">{peopleCount}</span>
                  <button onClick={() => setPeopleCount(c => c + 1)} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-lg text-[#1898A5]">+</button>
                </div>
              </section>

              <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Hands</h3>
                <div className="flex gap-2">
                  {[1, 2].map(h => (
                    <button key={h} onClick={() => setSelectedHands(h)} className={`flex-1 py-1 px-2 rounded-lg border-2 font-bold text-xs transition-all ${selectedHands === h ? 'border-[#1898A5] bg-white text-[#1898A5]' : 'border-transparent bg-white text-gray-400'}`}>
                      {h} {h === 1 ? 'Hand' : 'Hands'}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Package Selection */}
            <section>
              <h3 className="text-sm font-bold mb-3">Select Package</h3>
              <div className="space-y-2">
                {PACKAGES.map(pkg => (
                  <button key={pkg.name} onClick={() => setSelectedPackage(pkg.name)} className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${selectedPackage === pkg.name ? 'border-[#1898A5] bg-blue-50 ring-1 ring-[#1898A5]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    <div className="text-left">
                      <p className={`text-xs font-bold ${selectedPackage === pkg.name ? 'text-[#1898A5]' : 'text-gray-700'}`}>{pkg.name}</p>
                      <p className="text-[10px] text-gray-500">{pkg.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-[#1898A5]">+₹{pkg.priceAdd * selectedHands}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Calendar size={18} />
                Choose Date
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {DATES.map((date, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(idx)}
                    className={`flex flex-col items-center min-w-[60px] p-2 rounded border transition-all ${
                      selectedDate === idx ? 'border-[#1898A5] bg-blue-50 ring-1 ring-[#1898A5]' : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[10px] uppercase text-gray-500 font-bold">{date.day}</span>
                    <span className="text-lg font-bold">{date.date}</span>
                    <span className="text-[10px] uppercase text-gray-500">{date.month}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Clock size={18} />
                Pick Time
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-1 rounded border text-xs font-bold transition-all ${
                      selectedTime === time ? 'border-[#1898A5] bg-blue-50 ring-1 ring-[#1898A5]' : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right Column: Buy Box ── */}
          <div className="w-full lg:w-[25%] pt-0 lg:pt-14">
            <div className="lg:sticky lg:top-24 border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm bg-white">
              <div className="text-2xl font-medium">₹{totalPrice}</div>
              <div className="space-y-3 pt-2">
                <button onClick={handleBooking} className="w-full bg-[#1898A5] hover:bg-[#147F8A] text-white py-2.5 rounded-full font-medium text-sm border border-[#1898A5] shadow-sm transition-all">
                  Book Now
                </button>
              </div>
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Artist from</span>
                  <span className="text-[#1898A5] font-bold">Sevadoot</span>
                </div>
                <div className="text-[10px] text-gray-400 text-center pt-2">* 100% Secure Transaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, label, color }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
        <Icon size={18} className={color} />
      </div>
      <span className="text-[10px] text-gray-600 font-medium text-center">{label}</span>
    </div>
  );
}

// ─── MAIN COMPONENT: LIST ───────────────────────────────────────────────────
export default function MehndiArtist() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedArtist,   setSelectedArtist]   = useState(null);
  const [toast,            setToast]            = useState(null);
  const [showSearch,       setShowSearch]       = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");

  const currentServices = MEHNDI_SERVICES[selectedCategory.id] || [];
  const totalCartQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = (item) => {
    dispatch(addToCartRedux(item));
    showToast(`${item.name} added to cart`);
    setSelectedArtist(null); // Return to list after booking
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
  };

  const filteredServices = showSearch && searchQuery.trim()
    ? currentServices.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentServices;

  if (selectedArtist) {
    return (
      <MehndiArtistDetails 
        artist={selectedArtist} 
        onBack={() => setSelectedArtist(null)} 
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", backgroundColor: "#fff", overflow: "hidden" }}>

      {toast && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          backgroundColor: toast.type === "error" ? "#ef4444" : "#16a34a",
          color: "#fff", padding: "10px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 9999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", maxWidth: "86vw",
          textAlign: "center", animation: "fadeDown 0.25s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
        <div className="header-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => router.back()}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#000" }}>
              <IconBack />
            </button>
            <span className="main-header-title" style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>Mehndi Artists</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <button onClick={() => { setShowSearch(s => !s); setSearchQuery(""); }}
              style={{ background: "#f1f5f9", border: "none", cursor: "pointer", padding: 10, borderRadius: 12, display: "flex", color: "#475569" }}>
              <IconSearch />
            </button>
            <button onClick={() => router.push("/cart")}
              style={{ position: "relative", backgroundColor: ACCENT, border: "none", borderRadius: 12, padding: "10px 14px", cursor: "pointer", display: "flex", color: "#fff", boxShadow: "0 4px 12px rgba(69,123,157,0.2)" }}>
              <IconCart />
              {totalCartQty > 0 && (
                <span style={{ position: "absolute", top: -8, right: -8, backgroundColor: "#ef4444", color: "#fff", border: "2px solid #fff", borderRadius: "50%", width: 22, height: 22, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {totalCartQty}
                </span>
              )}
            </button>
          </div>
        </div>
        {showSearch && (
          <div style={{ padding: "0 20px 16px", maxWidth: 800, margin: "0 auto" }}>
            <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search mehndi services..."
              style={{ width: "100%", padding: "12px 18px", border: `2px solid ${ACCENT}`, borderRadius: 14, fontSize: 16, outline: "none", backgroundColor: "#f0f7f9", color: "#1f2937", boxSizing: "border-box", boxShadow: "0 4px 15px rgba(69,123,157,0.1)" }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="main-content-wrapper" style={{ flex: 1, display: "flex", overflow: "hidden", maxWidth: 1400, margin: "0 auto", width: "100%" }}>

        {/* Sidebar */}
        <div className="mehndi-sidebar" style={{ width: 80, backgroundColor: "#fff", borderRight: "1px solid #f3f4f6", overflowY: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => {
            const active = selectedCategory.id === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCategory(cat)}
                style={{ width: "100%", padding: "12px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, backgroundColor: active ? "#eef6fa" : "#fff", border: "none", cursor: "pointer", borderRight: active ? `3px solid ${ACCENT}` : "3px solid transparent", transition: "all 0.2s" }}>
                <div style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: active ? "#e0eff5" : "#f9fafb", border: `2px solid ${active ? ACCENT : "#f1f5f9"}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: active ? "0 4px 12px rgba(69,123,157,0.1)" : "none" }}>
                  <img src={cat.icon} alt={cat.name} style={{ width: 30, height: 30, objectFit: "contain" }} onError={e => { e.target.onerror = null; e.target.src = "/image/mehndi.png"; }} />
                </div>
                <span style={{ fontSize: 9, textAlign: "center", fontWeight: 800, color: active ? ACCENT : "#64748b", lineHeight: 1.2, padding: "0 2px", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid Container */}
        <div className="grid-container" style={{ flex: 1, backgroundColor: "#f8fafc", overflowY: "auto", padding: 12 }}>
          {filteredServices.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 40 }}>🪷</span>
              <p style={{ color: "#94a3b8", fontSize: 14, fontWeight: 600, margin: 0 }}>
                {showSearch && searchQuery ? "No results found" : "No services available"}
              </p>
            </div>
          ) : (
            <div className="mehndi-grid">
              {filteredServices.map(item => (
                <div key={item._id} className="mehndi-card"
                  style={{ backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", cursor: "pointer", transition: "all 0.3s" }}
                  onClick={() => handleArtistClick(item)}>
                  <div style={{ width: "100%", aspectRatio: "1", backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ padding: 12 }}>
                    <p className="card-title" style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "0 0 4px", height: 38, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3 }}>
                      {item.name}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span className="card-price" style={{ fontSize: 16, fontWeight: 800, color: ACCENT }}>₹{item.price}</span>
                      {item.time && <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{item.time}</span>}
                    </div>
                    <button className="book-btn" style={{ width: "100%", backgroundColor: "#fff", border: `1.5px solid ${ACCENT}`, borderRadius: 10, padding: "8px 0", fontSize: 12, fontWeight: 800, color: ACCENT, cursor: "pointer", transition: "all 0.2s" }}>
                      VIEW & BOOK
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        .mehndi-sidebar { width: 70px !important; }
        .mehndi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        .mehndi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
        }
        
        .mehndi-card:hover .book-btn {
          background-color: ${ACCENT} !important;
          color: #fff !important;
        }

        @media (min-width: 768px) {
          .mehndi-sidebar { width: 90px !important; }
          .grid-container { padding: 20px !important; }
          .mehndi-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .main-header-title { font-size: 22px !important; }
          .card-title { font-size: 16px !important; height: 44px !important; line-height: 1.4 !important; }
          .card-price { font-size: 18px !important; }
          .book-btn { font-size: 14px !important; padding: 10px 0 !important; }
        }

        @media (min-width: 1280px) {
          .mehndi-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
          .mehndi-sidebar { width: 140px !important; }
          .mehndi-sidebar span { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}
