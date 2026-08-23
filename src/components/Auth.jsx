"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaGooglePlay } from "react-icons/fa";
import { apiUrl } from "@/lib/api";
import { PLAY_STORE_URL } from "@/lib/brand";

const API_BASE_URL = apiUrl("/auth");

const inputClass =
  "w-full bg-slate-50 rounded-xl px-4 h-12 text-gray-800 outline-none text-sm border border-slate-200 focus:border-[#1898A5] focus:bg-white focus:ring-2 focus:ring-[#1898A5]/20";

const Auth = ({ onAuthSuccess, onSkip }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [authError, setAuthError] = useState("");
  const otpInputRefs = useRef([]);

  const [loginPhone, setLoginPhone] = useState("");
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const state = { page: "auth", timestamp: Date.now() };
    window.history.pushState(state, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState({ page: "auth", timestamp: Date.now() }, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateSignup = (field, value) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPhone.length !== 10) {
      setAuthError("Please enter a valid 10-digit phone number");
      return;
    }
    setAuthError("");
    setIsOtpStep(true);
    setOtpValues(["", "", "", "", "", ""]);
    setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const updatedOtp = [...otpValues];
    updatedOtp[index] = digit;
    setOtpValues(updatedOtp);
    setAuthError("");
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedValue) return;
    const updatedOtp = [...otpValues];
    for (let i = 0; i < 6; i++) updatedOtp[i] = pastedValue[i] || "";
    setOtpValues(updatedOtp);
    otpInputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otpValues.join("");
    if (enteredOtp.length !== 6) {
      setAuthError("Please enter all 6 OTP digits.");
      return;
    }
    if (enteredOtp !== "151515") {
      setAuthError("Invalid OTP. Please try again.");
      return;
    }
    localStorage.setItem("userToken", "mock-token-151515");
    localStorage.setItem("userPhone", loginPhone);
    onAuthSuccess?.();
    router.push("/");
  };

  const handleEditPhone = () => {
    setIsOtpStep(false);
    setOtpValues(["", "", "", "", "", ""]);
    setAuthError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, phone, houseNo, street, city, state, pincode } = signupForm;
    if (!name || !email || phone.length !== 10) {
      alert("Please fill all required fields correctly");
      return;
    }
    if (!houseNo || !street || !city || !state || pincode.length !== 6) {
      alert("Please fill all address fields correctly");
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
        signal: controller.signal,
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userPhone", phone);
        onAuthSuccess?.();
        router.push("/");
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      if (error.name === "AbortError") alert("Request timed out. Please try again.");
      else alert("Network error. Please check your connection.");
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const openPolicy = (type) => {
    setModalContent(
      type === "terms"
        ? {
            title: "Terms of Use",
            body: `Welcome to Sevadoot. By using our application, you agree to the following terms and conditions...`,
          }
        : {
            title: "Privacy Policy",
            body: `Your privacy is important to us. This Privacy Policy explains how Sevadoot collects, uses, and protects your information...`,
          }
    );
    setModalVisible(true);
  };

  const isLoginEnabled = loginPhone.length === 10;
  const isOtpEnabled = otpValues.every((digit) => digit !== "");
  const isSignupEnabled =
    signupForm.name &&
    signupForm.email &&
    signupForm.phone.length === 10 &&
    signupForm.houseNo &&
    signupForm.street &&
    signupForm.city &&
    signupForm.state &&
    signupForm.pincode.length === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#147F8A] via-[#1898A5] to-[#0E5A63] px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl flex-col">
        <div className="mb-4 flex items-center justify-start">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25"
          >
            Skip
          </button>
        </div>

        <div className="flex flex-1 items-center">
          <div className="w-full rounded-3xl bg-white p-5 text-slate-800 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-8">
            <div className="mb-5 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {activeTab === "signup" ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Book home services in minutes
              </p>
            </div>

            <div className="relative mx-auto mb-6 flex h-11 max-w-sm overflow-hidden rounded-full bg-slate-100 p-1">
              <motion.div
                className="absolute h-9 w-1/2 rounded-full bg-[#1898A5] shadow-sm"
                animate={{ x: activeTab === "login" ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                type="button"
                className={`z-10 flex-1 text-sm font-semibold transition-colors ${
                  activeTab === "login" ? "text-white" : "text-slate-500"
                }`}
                onClick={() => {
                  setActiveTab("login");
                  setAuthError("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`z-10 flex-1 text-sm font-semibold transition-colors ${
                  activeTab === "signup" ? "text-white" : "text-slate-500"
                }`}
                onClick={() => {
                  setActiveTab("signup");
                  setIsOtpStep(false);
                  setAuthError("");
                }}
              >
                Sign Up
              </button>
            </div>

            {activeTab === "login" ? (
              <form onSubmit={isOtpStep ? handleOtpSubmit : handleLogin} className="mx-auto max-w-md space-y-5">
                {!isOtpStep ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                      <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-[#1898A5] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1898A5]/20">
                        <span className="mr-2 font-bold text-slate-700">+91</span>
                        <input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          className="flex-1 bg-transparent text-sm outline-none"
                          value={loginPhone}
                          onChange={(e) => {
                            setLoginPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10));
                            setAuthError("");
                          }}
                          maxLength={10}
                        />
                      </div>
                    </div>
                    {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}
                    <button
                      type="submit"
                      disabled={!isLoginEnabled || isLoading}
                      className={`h-12 w-full rounded-xl bg-[#1898A5] text-base font-bold text-white shadow-md transition hover:bg-[#147F8A] ${
                        !isLoginEnabled || isLoading ? "opacity-60" : ""
                      }`}
                    >
                      {isLoading ? "Loading..." : "Send OTP"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">OTP Verification</p>
                      <p className="text-sm text-slate-500">
                        Enter 6-digit OTP sent to <span className="font-bold text-slate-800">+91 {loginPhone}</span>
                      </p>
                    </div>
                    <div className="flex justify-between gap-2">
                      {otpValues.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="h-12 w-10 rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-800 outline-none focus:border-[#1898A5] focus:bg-white sm:h-12 sm:w-12 sm:text-2xl"
                        />
                      ))}
                    </div>
                    {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}
                    <button
                      type="submit"
                      disabled={!isOtpEnabled || isLoading}
                      className={`h-12 w-full rounded-xl bg-[#1898A5] text-base font-bold text-white shadow-md ${
                        !isOtpEnabled || isLoading ? "opacity-60" : ""
                      }`}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={handleEditPhone}
                      className="h-11 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-600"
                    >
                      Change Phone Number
                    </button>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                    <input
                      className={inputClass}
                      placeholder="Your full name"
                      value={signupForm.name}
                      onChange={(e) => updateSignup("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Email *</label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="you@email.com"
                      value={signupForm.email}
                      onChange={(e) => updateSignup("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Phone *</label>
                    <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-gray-800 focus-within:border-[#1898A5] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1898A5]/20">
                      <span className="mr-2 text-sm font-bold">+91</span>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        className="flex-1 bg-transparent text-sm outline-none"
                        value={signupForm.phone}
                        onChange={(e) =>
                          updateSignup("phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
                        }
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-[#1898A5]">Address</p>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">House No *</label>
                    <input
                      className={inputClass}
                      placeholder="123"
                      value={signupForm.houseNo}
                      onChange={(e) => updateSignup("houseNo", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Street *</label>
                    <input
                      className={inputClass}
                      placeholder="Main Street"
                      value={signupForm.street}
                      onChange={(e) => updateSignup("street", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">City *</label>
                    <input
                      className={inputClass}
                      placeholder="Lucknow"
                      value={signupForm.city}
                      onChange={(e) => updateSignup("city", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">State *</label>
                    <input
                      className={inputClass}
                      placeholder="UP"
                      value={signupForm.state}
                      onChange={(e) => updateSignup("state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Pincode *</label>
                    <input
                      className={inputClass}
                      placeholder="226001"
                      value={signupForm.pincode}
                      onChange={(e) =>
                        updateSignup("pincode", e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                      }
                      maxLength={6}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={!isSignupEnabled || isLoading}
                      className={`h-12 w-full rounded-xl bg-[#1898A5] text-sm font-bold text-white shadow-md transition hover:bg-[#147F8A] ${
                        !isSignupEnabled || isLoading ? "opacity-60" : ""
                      }`}
                    >
                      {isLoading ? "Loading..." : "Create Account"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-6 flex flex-col items-center gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-between">
              <p className="text-center text-[12px] text-slate-400 sm:text-left">
                By continuing you agree to our{" "}
                <button type="button" className="font-semibold text-[#1898A5]" onClick={() => openPolicy("terms")}>
                  Terms
                </button>{" "}
                &amp;{" "}
                <button type="button" className="font-semibold text-[#1898A5]" onClick={() => openPolicy("privacy")}>
                  Privacy Policy
                </button>
              </p>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white"
              >
                <FaGooglePlay className="h-3.5 w-3.5" />
                Get App
              </a>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalVisible && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 lg:items-center lg:justify-center">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="h-[90%] overflow-y-auto rounded-t-[32px] bg-white p-6 text-gray-800 lg:h-auto lg:max-h-[80vh] lg:w-full lg:max-w-lg lg:rounded-3xl"
            >
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold">{modalContent.title}</h2>
                <button type="button" onClick={() => setModalVisible(false)}>
                  <X className="h-8 w-8 text-gray-600" />
                </button>
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed">{modalContent.body}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
