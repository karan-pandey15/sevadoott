"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  MapPin,
  Search,
  ChevronDown,
  LogOut,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO_KEYWORD_PHRASES } from "@/lib/seo";
import Logo from "@/components/Logo";
import AppDownloadBanner from "@/components/HeaderScreen/AppDownloadBanner";

const searchPlaceholders = SEO_KEYWORD_PHRASES.map((k) => k.phrase);

const categories = [
  { name: "Book an Attendant", path: "/pages/Attendant" },
  { name: "Book an Guardian", path: "/pages/GuardianKids" },
  { name: "Pet Walker", path: "/pages/petwalker" },
  { name: "Booking for Pandit Ji", path: "/pages/Pandit" },
  { name: "Mehndi Artist", path: "/pages/Mehndi" },
  { name: "School Uniform & Accessories", path: "/pages/School" },
  { name: "Healthy Food", path: "/pages/Groceries" },
  { name: "Resort & Farmhouse Booking", path: "/pages/Hotel" },
  { name: "Cosmetic", path: "/pages/Cosmetic" },
  { name: "Nurse For First Aid", path: "/pages/nurse" },
  { name: "Premium Gym MemberShip", path: "/pages/gym" },
  { name: "Food For Patient & Tiffin Service", path: "/pages/tiffinservice" },
  { name: "Groceries", path: "/pages/Groceries" },
  { name: "Physiotherapist", path: "/pages/physiotherapist" },
  { name: "Salon and Makeup", path: "/pages/Salon" },
  { name: "Luxury Product", path: "/pages/Luxury" },
  { name: "Fashion & LyfeStyle", path: "/pages/fashion" },
  { name: "Pregnancy & Ladies Health Issues", path: "/pages/ladies" },
];

function SearchTrigger({ placeholder, compact = false }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push("/pages/SearchScreen")}
      className={`group flex w-full min-w-0 items-center rounded-full bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] ${
        compact ? "h-10 pl-3.5 pr-3" : "h-11 md:h-12 pl-4 pr-4"
      }`}
      aria-label="Search services"
    >
      <Search
        className="mr-2.5 flex-shrink-0 text-[#1898A5]"
        size={compact ? 16 : 18}
        strokeWidth={2.25}
      />
      <span className="truncate text-[13px] text-slate-400 md:text-sm">
        Search &ldquo;{placeholder}&rdquo;
      </span>
    </button>
  );
}

function IconButton({ href, onClick, label, children, className = "" }) {
  const classes = `relative inline-flex h-10 w-10 md:h-11 md:w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-[#147F8A] shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition hover:shadow-md active:scale-95 ${className}`;
  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      {children}
    </button>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;
  const placeholder = searchPlaceholders[placeholderIndex] || "home services";

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    setIsLoggedIn(!!token);
    if (!searchPlaceholders.length) return undefined;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/pages/auth");
    router.refresh();
  };

  const handleLogin = () => router.push("/pages/auth");

  if (
    pathname.includes("/pages/ServiceDetail") ||
    pathname.includes("/pages/ladies") ||
    pathname.includes("/pages/Mehndi")
  ) {
    return null;
  }

  return (
    <>
      {pathname === "/" && <AppDownloadBanner />}

      <header className="sticky top-0 z-50 w-full bg-[#1898A5] shadow-[0_8px_24px_rgba(24,152,165,0.28)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25" />
        <div className="relative mx-auto max-w-[1280px] px-3 sm:px-5 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 py-2.5 md:h-[76px] md:py-0">
            <Logo size="md" asLink />

            <Link
              href="/pages/addresses"
              className="hidden min-w-0 items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm transition hover:bg-white/15 lg:flex"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#F58220]/20">
                <MapPin size={16} className="text-[#FDE68A]" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">
                  Deliver to
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[13px] font-semibold text-white">
                  <span className="max-w-[120px] truncate">Select location</span>
                  <ChevronDown size={14} className="flex-shrink-0 text-white/80" />
                </span>
              </span>
            </Link>

            <div className="hidden min-w-0 flex-1 md:block">
              <SearchTrigger placeholder={placeholder} />
            </div>

            <div className="ml-auto flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
              <Link
                href="/pages/dealday"
                className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#F58220] to-[#E56A12] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[0_4px_14px_rgba(245,130,32,0.35)] transition hover:brightness-105 active:scale-95 lg:inline-flex"
              >
                <Zap size={14} className="flex-shrink-0" />
                Deal of the Day
              </Link>

              <IconButton
                href="/pages/dealday"
                label="Deal of the Day"
                className="bg-gradient-to-br from-[#F58220] to-[#E56A12] text-white ring-0 lg:hidden"
              >
                <Zap size={17} />
              </IconButton>

              <IconButton href="/pages/cart" label="Cart">
                <ShoppingCart size={19} strokeWidth={2.1} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#F58220] px-1 text-[9px] font-black text-white ring-2 ring-[#1898A5]">
                    {cartCount}
                  </span>
                )}
              </IconButton>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden items-center gap-2 rounded-2xl bg-white/12 px-3.5 py-2.5 text-[13px] font-bold text-white ring-1 ring-white/20 transition hover:bg-white/18 md:inline-flex"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="hidden items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-[13px] font-bold text-[#147F8A] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition hover:bg-slate-50 md:inline-flex"
                >
                  <User size={15} />
                  Login
                </button>
              )}

              <IconButton
                onClick={isLoggedIn ? handleLogout : handleLogin}
                label={isLoggedIn ? "Logout" : "Login"}
                className="md:hidden"
              >
                {isLoggedIn ? <LogOut size={18} /> : <User size={18} />}
              </IconButton>

              <IconButton
                onClick={() => setIsMobileMenuOpen(true)}
                label="Open menu"
                className="lg:hidden"
              >
                <Menu size={20} />
              </IconButton>
            </div>
          </div>

          <div className="pb-3 md:hidden">
            <SearchTrigger placeholder={placeholder} compact />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 z-[110] flex h-full w-[86%] max-w-[360px] flex-col bg-white shadow-2xl"
            >
              <div className="flex flex-shrink-0 items-center justify-between border-b border-white/15 bg-[#1898A5] px-4 py-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-0 hover:opacity-95"
                  aria-label="Sevadoot Home"
                >
                  <Logo size="sm" unconstrained />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <Link
                href="/pages/addresses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1898A5]/12 text-[#1898A5]">
                  <MapPin size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Deliver to
                  </span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Select location
                  </span>
                </span>
              </Link>

              <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: "none" }}>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Our services
                </p>
                <nav className="flex flex-col">
                  {categories.map((cat) => (
                    <Link
                      key={cat.path + cat.name}
                      href={cat.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-[13.5px] font-medium text-slate-600 transition hover:bg-[#1898A5]/8 hover:text-[#147F8A]"
                    >
                      {cat.name}
                      <ChevronDown size={13} className="-rotate-90 text-slate-300" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="space-y-2.5 border-t border-slate-100 p-4">
                <Link
                  href="/pages/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#106670] to-[#1898A5] text-white">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#106670]">My Account</p>
                    <p className="text-[11px] text-slate-400">View &amp; edit profile</p>
                  </div>
                </Link>

                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3.5 text-[14px] font-bold text-white"
                  >
                    <LogOut size={17} /> Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#E56A12] py-3.5 text-[14px] font-bold text-white"
                  >
                    <User size={17} /> Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
