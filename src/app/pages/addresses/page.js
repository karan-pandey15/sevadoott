"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Home, 
  Briefcase, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Navigation,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "@/lib/api";

const BASE_URL = API_BASE;

export default function AddressPage() {
  const router = useRouter();
  
  // State
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    label: "Home",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    setIsAuthenticated(!!token);
    if (token) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("userToken");
      const url = editingAddress 
        ? `${BASE_URL}/user/addresses/${editingAddress._id}`
        : `${BASE_URL}/user/addresses`;
      
      const res = await fetch(url, {
        method: editingAddress ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowForm(false);
        setEditingAddress(null);
        resetForm();
        fetchAddresses();
      }
    } catch (error) {
      alert("Error saving address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`${BASE_URL}/user/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAddresses();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      label: "Home", houseNo: "", street: "", landmark: "", city: "", state: "", pincode: "", isDefault: false
    });
  };

  const startEdit = (addr) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
    setShowForm(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <div className="max-w-4xl mx-auto w-full bg-white min-h-screen shadow-sm">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft size={24} className="text-gray-800" />
              </button>
              <h1 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">My Addresses</h1>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <MapPin size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Login Required</h2>
            <p className="text-gray-500 text-center mb-6">Please login to view your saved addresses</p>
            <button 
              onClick={() => window.location.href = "/"}
              className="bg-[#1898A5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#106670] transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-20">
      <div className="max-w-4xl mx-auto w-full bg-white min-h-screen shadow-sm">
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft size={24} className="text-gray-800" />
            </button>
            <h1 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">My Addresses</h1>
          </div>
        </header>

        <main className="w-full p-4 md:p-8 space-y-6">
          
          {/* Add New Button */}
          <button 
            onClick={() => { resetForm(); setEditingAddress(null); setShowForm(true); }}
            className="w-full bg-white p-6 rounded-[32px] shadow-sm border border-dashed border-gray-200 flex items-center justify-between group hover:border-[#1898A5] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#1898A5]/10 p-3 rounded-2xl text-[#1898A5] group-hover:bg-[#1898A5] group-hover:text-white transition-colors">
                <Plus size={24} />
              </div>
              <span className="font-black italic text-gray-800 uppercase tracking-tight">Add New Address</span>
            </div>
            <CheckCircle2 size={20} className="text-gray-100 group-hover:text-[#1898A5] transition-colors" />
          </button>

          {/* Saved Addresses List */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Saved Locations</h3>
            
            {loading ? (
              <div className="flex flex-col items-center py-20 opacity-20">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-black italic uppercase">Syncing Addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
                <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase italic">No addresses found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <motion.div 
                    layout
                    key={addr._id}
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-start gap-4 group hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-50 p-4 rounded-2xl text-gray-400 group-hover:bg-[#1898A5]/10 group-hover:text-[#1898A5] transition-colors">
                      {addr.label === 'Work' ? <Briefcase size={24} /> : <Home size={24} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black italic text-gray-800 uppercase text-sm tracking-tight">{addr.label || 'Home'}</span>
                        {addr.isDefault && <span className="text-[8px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded tracking-widest">DEFAULT</span>}
                      </div>
                      <p className="text-xs font-medium text-gray-400 leading-relaxed line-clamp-2">
                        {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      
                      <div className="flex gap-4 mt-4">
                        <button 
                          onClick={() => startEdit(addr)}
                          className="text-[10px] font-black uppercase text-[#1898A5] flex items-center gap-1 hover:opacity-70"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(addr._id)}
                          className="text-[10px] font-black uppercase text-red-400 flex items-center gap-1 hover:opacity-70"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">
                  {editingAddress ? 'Edit Address' : 'New Address'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {['Home', 'Work', 'Other'].map(l => (
                    <button 
                      key={l}
                      type="button"
                      onClick={() => setFormData({...formData, label: l})}
                      className={`py-3 rounded-2xl border-2 font-black uppercase text-[10px] transition-all ${formData.label === l ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <InputField label="House / Flat No" value={formData.houseNo} onChange={v => setFormData({...formData, houseNo: v})} required />
                  <InputField label="Street / Area" value={formData.street} onChange={v => setFormData({...formData, street: v})} required />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" value={formData.city} onChange={v => setFormData({...formData, city: v})} required />
                    <InputField label="State" value={formData.state} onChange={v => setFormData({...formData, state: v})} required />
                  </div>
                  <InputField label="Pincode" value={formData.pincode} onChange={v => setFormData({...formData, pincode: v})} required maxLength={6} />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                  <input 
                    type="checkbox" 
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    className="w-5 h-5 accent-[#1898A5] rounded-lg"
                  />
                  <label htmlFor="isDefault" className="text-xs font-black text-gray-500 uppercase tracking-widest cursor-pointer">Set as Default Address</label>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1898A5] text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 group italic uppercase"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : 'Save Address'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const InputField = ({ label, value, onChange, placeholder, required, maxLength }) => (
  <div>
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-2 block">{label} {required && '*'}</label>
    <input 
      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#1898A5] outline-none transition-all"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      maxLength={maxLength}
    />
  </div>
);
