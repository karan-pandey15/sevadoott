"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Lucide-style inline SVG icons ───────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const PersonIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);
const ShoppingBag = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.74L23 6H6"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const PersonOutline = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const GiftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
);
const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const LogoutIconLarge = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ─── Mock API (replace with your actual API calls) ───────────────────────────
const getProfile = async () => {
  
  return { ok: false };
};

// ─── MenuItem component ───────────────────────────────────────────────────────
const MenuItem = ({ icon, label, onClick, isLast = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 ${
      !isLast ? "border-b border-gray-100" : ""
    }`}
  >
    <div className="flex items-center gap-4">
      <span className="text-black">{icon}</span>
      <span className="text-base text-black font-normal">{label}</span>
    </div>
    <span className="text-gray-400">
      <ChevronRight />
    </span>
  </button>
);

// ─── Main Profile Component ───────────────────────────────────────────────────
export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const [animating, setAnimating] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    setIsLoggedIn(!!token);
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await getProfile();
      if (data.ok && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const showLogoutModal = () => {
    setLogoutVisible(true);
    // Small delay so the DOM paints before we trigger the transition
    setTimeout(() => setAnimating(true), 10);
  };

  const hideLogoutModal = () => {
    setAnimating(false);
    setTimeout(() => {
      setLogoutVisible(false);
    }, 250);
  };

  const handleLogout = async () => {
    hideLogoutModal();
    try {
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  // Navigation helpers — replace with your Next.js router.push calls
  const navigate = (route) => {
    switch (route) {
      case "YourOrders":
        router.push("/pages/orders");
        break;
      case "HelpSupport":
        router.push("/pages/help-support");
        break;
      case "Sevadoot Cart":
        router.push("/pages/cart");
        break;
      case "AddressPage":
        router.push("/pages/addresses");
        break;
      case "ProfilePage":
        // Already on profile, or could be a detailed profile edit page
        router.push("/pages/profile");
        break;
      case "Rewards":
        router.push("/pages/refer-friend");
        break;
      case "Membership":
        router.push("/pages/membership");
        break;
      default:
        console.log("Navigate to:", route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-sm">
        {/* ── Header ── */}
        <div
          className="flex items-center bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
        >
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-xl font-bold text-black ml-4">Settings</h1>
        </div>

        <div className="overflow-y-auto pb-10">
          {/* ── Profile Section ── */}
          <div className="flex items-center bg-white px-5 py-8 md:py-10 border-b border-gray-50">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#1898A5" }}
            >
              {user && user.name ? (
                <span className="text-3xl md:text-4xl font-bold text-white">{getInitials(user.name)}</span>
              ) : (
                <PersonIcon />
              )}
            </div>
            <div className="ml-4 md:ml-6 flex-1 flex justify-between items-center">
              <div>
                <p className="text-[22px] md:text-2xl font-bold text-black leading-tight">
                  {isLoggedIn ? (user?.name || "User") : "Guest User"}
                </p>
                {isLoggedIn && user?.phone && (
                  <p className="text-[15px] md:text-base text-gray-500 mt-1">{user.phone}</p>
                )}
              </div>
              {!isLoggedIn && (
                <button 
                  onClick={router.push("/pages/auth")}
                  className="bg-[#1898A5] text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-[#106670] transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="grid grid-cols-2 gap-4 px-4 py-6 md:py-8">
            <button
              onClick={() => navigate("YourOrders")}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 min-h-[120px] hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-95 group"
            >
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <ShoppingBag />
              </div>
              <span className="text-sm font-bold text-black text-center mt-3">
                Your Orders
              </span>
            </button>

            <button
              onClick={() => navigate("HelpSupport")}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 min-h-[120px] hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-95 group"
            >
              <div className="p-3 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <MessageIcon />
              </div>
              <span className="text-sm font-bold text-black text-center mt-3">
                Help & Support
              </span>
            </button>
          </div>

          <div className="md:grid md:grid-cols-2 md:gap-6 md:px-4">
            {/* ── Your Information ── */}
            <div className="mt-2">
              <p className="text-base font-bold text-gray-400 uppercase tracking-wider px-5 py-4 text-xs">Your Information</p>

              <div className="mx-4 md:mx-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <MenuItem
                  icon={<CartIcon />}
                  label="Your Cart"
                  onClick={() => navigate("Sevadoot Cart")}
                />
                <MenuItem
                  icon={<MessageIcon />}
                  label="Help & Support"
                  onClick={() => navigate("HelpSupport")}
                />
                <MenuItem
                  icon={<LocationIcon />}
                  label="Saved Addresses"
                  onClick={() => navigate("AddressPage")}
                />
                <MenuItem
                  icon={<PersonOutline />}
                  label="Profile"
                  onClick={() => navigate("ProfilePage")}
                />
                <MenuItem
                  icon={<GiftIcon />}
                  label="Refer A Friend"
                  onClick={() => navigate("Rewards")}
                />
                <MenuItem
                  icon={<CardIcon />}
                  label="Helpana MemberShip"
                  onClick={() => navigate("Membership")}
                  isLast
                />
              </div>
            </div>

            {/* ── Other Information (Logout) ── */}
            {isLoggedIn && (
              <div className="mt-2">
                <p className="text-base font-bold text-gray-400 uppercase tracking-wider px-5 py-4 text-xs">Other Information</p>

                <div className="mx-4 md:mx-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={showLogoutModal}
                    className="w-full flex items-center justify-between px-4 py-5 bg-white hover:bg-red-50 active:bg-red-100 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-4">
                      <LogoutIcon />
                      <span className="text-base font-bold text-[#E53935]">Logout</span>
                    </div>
                    <span className="text-gray-400">
                      <ChevronRight />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Logout Confirmation Modal ── */}
      {logoutVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            onClick={hideLogoutModal}
            className="absolute inset-0 bg-black transition-opacity duration-250"
            style={{ opacity: animating ? 0.5 : 0 }}
          />

          {/* Modal Card */}
          <div
            className="relative bg-white rounded-2xl p-8 mx-auto flex flex-col items-center shadow-2xl transition-all duration-250"
            style={{
              width: "85%",
              maxWidth: "360px",
              opacity: animating ? 1 : 0,
              transform: animating ? "scale(1)" : "scale(0.85)",
            }}
          >
            {/* Icon circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#FFE8E8" }}
            >
              <LogoutIconLarge />
            </div>

            <h2 className="text-2xl font-bold text-black mb-3 text-center">Logout?</h2>
            <p className="text-base text-gray-500 text-center mb-7 leading-6">
              Are you sure you want to logout? You&apos;ll need to login again to access your account.
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={hideLogoutModal}
                className="flex-1 py-[14px] rounded-xl border border-gray-200 bg-gray-100 text-base font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-[14px] rounded-xl text-base font-semibold text-white transition-colors duration-150 hover:opacity-90 active:opacity-80"
                style={{ backgroundColor: "#E53935" }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}