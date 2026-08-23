"use client";

import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "@/redux/cartSlice";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight,
  Info,
  CheckCircle2,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAddItem = (item) => {
    dispatch(addToCart(item));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  // ── Totals Calculation ──────────────────────────────────────────
  const billDetails = useMemo(() => {
    const itemTotal = totalAmount;
    const deliveryFee = itemTotal >= 500 || itemTotal === 0 ? 0 : 40;
    const platformFee = itemTotal === 0 ? 0 : 5;
    const totalPayable = itemTotal + deliveryFee + platformFee;

    return {
      itemTotal,
      deliveryFee,
      platformFee,
      totalPayable
    };
  }, [totalAmount]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Sticky Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 backdrop-blur-md bg-white/90">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
            >
              <ArrowLeft size={24} className="text-gray-800 group-active:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter text-gray-900 leading-none">MY CART</h1>
              <p className="text-[10px] font-bold text-[#1898A5] uppercase tracking-widest mt-1">
                {items.length} {items.length === 1 ? 'Service' : 'Services'} Added
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/pages/SearchScreen')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search size={22} className="text-gray-800" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-40">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#1898A5]/10 rounded-full scale-150 blur-2xl" />
                <ShoppingCart size={100} className="text-[#1898A5]/20 relative z-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2 italic">YOUR CART IS EMPTY</h2>
              <p className="text-sm text-gray-400 font-medium max-w-[200px] mb-8">
                Looks like you haven&apos;t added any services yet.
              </p>
              <button 
                onClick={() => router.push("/")}
                className="px-10 py-4 bg-[#1898A5] text-white font-black rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >
                START EXPLORING
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Clear Cart Action */}
              <div className="flex justify-end">
                <button 
                  onClick={handleClearCart}
                  className="flex items-center gap-1.5 text-xs font-black text-red-500 bg-red-50 px-3 py-2 rounded-full hover:bg-red-100 transition-colors uppercase tracking-wider"
                >
                  <Trash2 size={14} /> Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden group"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-50 flex items-center justify-center text-4xl relative">
                      {item.emoji || "✨"}
                      {item.image && (
                        <img 
                          src={typeof item.image === 'string' ? item.image : (item.image.uri || '')} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 absolute inset-0" 
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-black text-gray-800 text-base leading-tight truncate uppercase italic">
                          {item.name}
                        </h3>
                        
                        {/* Service Metadata */}
                        <div className="mt-1.5 space-y-1">
                          {item.date && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              <Calendar size={12} className="text-[#1898A5]" /> {item.date}
                            </div>
                          )}
                          {item.time && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              <Clock size={12} className="text-[#1898A5]" /> {item.time} {item.hours ? `(${item.hours} hrs)` : ''}
                            </div>
                          )}
                          {item.address && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              <MapPin size={12} className="text-[#1898A5]" /> <span className="truncate">{item.address}</span>
                            </div>
                          )}
                          {item.devoteeName && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              <User size={12} className="text-[#1898A5]" /> {item.devoteeName}
                            </div>
                          )}
                          {item.studentName && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              <User size={12} className="text-[#1898A5]" /> {item.studentName} {item.studentClass ? `(${item.studentClass})` : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-lg font-black text-[#106670]">₹{item.price * item.quantity}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-90 transition-transform"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-black text-gray-800 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => handleAddItem(item)}
                            className="w-8 h-8 flex items-center justify-center bg-[#1898A5] text-white rounded-lg shadow-md active:scale-90 transition-transform"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bill Summary Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <Info size={20} className="text-[#1898A5]" />
                  <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest italic">Bill Summary</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Item Total</span>
                    <span>₹{billDetails.itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className={billDetails.deliveryFee === 0 ? "text-green-500" : "text-gray-800"}>
                      {billDetails.deliveryFee === 0 ? "FREE" : `₹${billDetails.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Platform Fee</span>
                    <span>₹{billDetails.platformFee}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-base font-black text-gray-800 uppercase italic">To Pay</span>
                    <span className="text-2xl font-black text-[#106670]">₹{billDetails.totalPayable}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 p-3 rounded-2xl flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={16} />
                  <p className="text-[10px] font-black uppercase tracking-wider">Secure Payment • No hidden charges</p>
                </div>
              </div>

              {/* Safety Policy */}
              <div className="flex items-start gap-3 p-4 bg-gray-100/50 rounded-2xl border border-gray-100">
                <div className="bg-white p-2 rounded-lg text-gray-400">
                  <Info size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-800 uppercase mb-1">Cancellation Policy</h4>
                  <p className="text-[9px] font-medium text-gray-400 leading-normal">
                    Orders cannot be cancelled once the professional is assigned. Please review your order details before proceeding.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Fixed Bottom Bar ─────────────────────────────────────── */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 z-[100] rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payable</span>
                <span className="text-2xl font-black text-[#106670]">₹{billDetails.totalPayable}</span>
              </div>
              <button 
                onClick={() => router.push('/checkout')}
                className="flex-1 bg-[#1898A5] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 group italic"
              >
                PROCEED TO PAY
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
