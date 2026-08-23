"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Banknote, 
  ChevronRight, 
  CheckCircle2, 
  Plus,
  Loader2,
  ShieldCheck,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearCart } from "@/redux/cartSlice";
import { API_BASE } from "@/lib/api";

const BASE_URL = API_BASE;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  // States
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Load initial data
  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const initData = async () => {
      try {
        setInitializing(true);
        const token = localStorage.getItem("userToken");
        if (!token) {
          router.push("/pages/profile"); // Redirect to login if no token
          return;
        }

        // Fetch Profile and Addresses in parallel
        const [profileRes, addressRes] = await Promise.all([
          fetch(`${BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/user/addresses`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const profileData = await profileRes.json();
        const addressData = await addressRes.json();

        if (profileRes.ok) setProfile(profileData.user);
        if (addressRes.ok) {
          const list = addressData.addresses || [];
          setAddresses(list);
          const def = list.find(a => a.isDefault) || list[0];
          if (def) setSelectedAddressId(def._id);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setInitializing(false);
      }
    };

    initData();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [router]);

  // Totals Calculation
  const billDetails = useMemo(() => {
    const itemTotal = totalAmount;
    const deliveryFee = itemTotal >= 500 ? 0 : 40;
    const platformFee = 5;
    const discount = 0; // RN discount from route.params
    const totalPayable = itemTotal + deliveryFee + platformFee - discount;

    return { itemTotal, deliveryFee, platformFee, totalPayable, discount };
  }, [totalAmount]);

  const computeExpectedTime = () => {
    const base = new Date();
    const expectedTime = new Date(base.getTime() + 24 * 60 * 60 * 1000);
    return expectedTime.toISOString();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const selectedAddress = addresses.find(a => a._id === selectedAddressId);

      const payload = {
        items: cartItems.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          finalPrice: item.price,
          discount: Math.max(0, (item.originalPrice || item.price) - item.price),
          image: typeof item.image === 'string' ? item.image : (item.image?.uri || ""),
          // RN specific fields
          time: item.time || null,
          date: item.date || null,
          suggestion: item.suggestion || null,
          category: item.category || null,
          hour: item.hour || null,
          checkIn: item.checkIn || null,
          checkOut: item.checkOut || null,
          guests: item.guests || null,
          // Extra Web fields
          description: item.description || null,
          devoteeName: item.devoteeName || null,
          studentName: item.studentName || null,
          studentClass: item.studentClass || null,
          instructions: item.instructions || null,
          package: item.package || null,
          hands: item.hands || null
        })),
        pricing: {
          subtotal: billDetails.itemTotal,
          deliveryFee: billDetails.deliveryFee,
          couponDiscount: billDetails.discount,
          tax: 0,
          platformFee: billDetails.platformFee,
          grandTotal: billDetails.totalPayable
        },
        delivery: {
          type: 'Standard',
          expectedTime: computeExpectedTime(),
          instructions: '',
        },
        address: {
          ...selectedAddress,
          contactName: profile?.name || selectedAddress?.label || '',
          contactPhone: profile?.phone || '',
        },
        addressId: selectedAddressId,
        couponCode: null,
        payment: { method: selectedPayment }
      };

      const response = await fetch(`${BASE_URL}/payments/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (selectedPayment === "cod") {
          dispatch(clearCart());
          setToastMessage("Order successfully placed!");
          setToastType("success");
          setShowToast(true);
          
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          // Trigger Online Payment Logic (Razorpay)
          handleRazorpay(data);
        }
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = (data) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    // Matching RN response structure
    const createdOrder = data.order || data;
    const { razorpayOrder, razorpayKeyId } = createdOrder;

    if (!razorpayOrder || !razorpayKeyId) {
      alert("Razorpay order details not available");
      return;
    }

    const options = {
      key: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Sevadoot",
      description: "Service Booking Payment",
      order_id: razorpayOrder.id,
      handler: async function (response) {
        setLoading(true);
        try {
          const token = localStorage.getItem("userToken");
          const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            dispatch(clearCart());
            setToastMessage("Payment verified successfully!");
            setToastType("success");
            setShowToast(true);
            
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else {
            alert(verifyData.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Verification error:", error);
          alert("Payment verification failed");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: profile?.name || "",
        email: profile?.email || "",
        contact: profile?.phone || "",
      },
      theme: {
        color: "#1898A5",
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#1898A5] mb-4" size={40} />
        <p className="font-black italic text-gray-400 animate-pulse">PREPARING CHECKOUT...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40 font-sans">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 min-w-[320px] border-2 ${
              toastType === "success" 
                ? "bg-white border-green-500 text-green-700" 
                : "bg-white border-red-500 text-red-700"
            }`}
          >
            {toastType === "success" ? <CheckCircle2 size={24} /> : <Info size={24} />}
            <span className="font-black italic uppercase tracking-tighter">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">Checkout</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Left Column: Forms ── */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Address Selection */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={16} className="text-[#1898A5]" /> Delivery Address
                </h3>
                <button 
                  onClick={() => router.push('/address')}
                  className="text-xs font-black text-[#1898A5] flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> ADD NEW
                </button>
              </div>

              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <button 
                    onClick={() => router.push('/address')}
                    className="w-full p-8 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-[#1898A5] hover:text-[#1898A5] transition-all"
                  >
                    + Setup your delivery address
                  </button>
                ) : (
                  addresses.map((addr) => (
                    <div 
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`relative p-4 rounded-3xl border-2 transition-all cursor-pointer group ${selectedAddressId === addr._id ? 'border-[#1898A5] bg-white shadow-xl shadow-blue-50' : 'border-white bg-white/50 hover:border-gray-200'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedAddressId === addr._id ? 'border-[#1898A5] bg-[#1898A5]' : 'border-gray-300'}`}>
                          {selectedAddressId === addr._id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-black uppercase italic text-gray-800">{addr.label || 'Home'}</span>
                            {addr.isDefault && <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded tracking-widest">DEFAULT</span>}
                          </div>
                          <p className="text-xs font-medium text-gray-500 leading-relaxed">
                            {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-[#1898A5]" /> Payment Method
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentOption 
                  id="cod"
                  title="Cash on Delivery"
                  description="Pay after service is done"
                  icon={Banknote}
                  selected={selectedPayment === "cod"}
                  onClick={() => setSelectedPayment("cod")}
                />
                <PaymentOption 
                  id="online"
                  title="Pay Online"
                  description="Secure via Razorpay"
                  icon={ShieldCheck}
                  selected={selectedPayment === "online"}
                  onClick={() => setSelectedPayment("online")}
                  premium
                />
              </div>
            </section>
          </div>

          {/* ── Right Column: Summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Items Total</span>
                    <span>₹{billDetails.itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Delivery Fee</span>
                    <span className={billDetails.deliveryFee === 0 ? "text-green-500" : ""}>
                      {billDetails.deliveryFee === 0 ? "FREE" : `₹${billDetails.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Platform Fee</span>
                    <span>₹{billDetails.platformFee}</span>
                  </div>
                  
                  <div className="pt-6 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black italic text-gray-900 uppercase tracking-tighter">Total Payable</span>
                      <span className="text-3xl font-black text-[#106670]">₹{billDetails.totalPayable}</span>
                    </div>
                    <p className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1 uppercase tracking-wider">
                      <CheckCircle2 size={12} /> You are saving ₹40 on this order
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading || !selectedAddressId}
                  className={`w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-blue-100 group ${loading || !selectedAddressId ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1898A5] text-white active:scale-95 hover:bg-[#106670]'}`}
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      PLACE ORDER 
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Safety Badge */}
              <div className="flex items-center gap-3 p-6 bg-[#1898A5]/5 rounded-[30px] border border-[#1898A5]/10">
                <div className="bg-white p-2 rounded-xl shadow-sm text-[#1898A5]">
                  <ShieldCheck size={20} />
                </div>
                <p className="text-[10px] font-black text-[#1898A5] uppercase leading-tight tracking-wider">
                  Safe & Secure Checkout <br />
                  <span className="text-gray-400 font-bold">Encrypted via 256-bit SSL</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ── Helper Components ──

function PaymentOption({ title, description, icon: Icon, selected, onClick, premium }) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${selected ? 'border-[#1898A5] bg-white shadow-lg' : 'border-white bg-white/50 hover:border-gray-200'}`}
    >
      <div className={`p-3 rounded-2xl ${selected ? 'bg-[#1898A5] text-white' : 'bg-gray-100 text-gray-400'}`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-sm font-black italic tracking-tighter uppercase text-gray-900 leading-none mb-1">{title}</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
      </div>
      {premium && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-[8px] font-black px-2 py-1 rounded-full text-black shadow-sm">
          FASTEST
        </div>
      )}
    </div>
  );
}
