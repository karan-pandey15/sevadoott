"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '@/redux/cartSlice';
import { apiUrl } from '@/lib/api';

const THEME_COLOR = "#1898A5";

export default function GroceryPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // --- API FETCHING ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl('/products/category/Grocery'));
        const json = await res.json();

        if (json.ok) {
          const list = json.products;
          const subs = [...new Set(list.map((p) => p.sub_category))];
          
          setProducts(list);
          setSubCategories(subs);
          if (subs.length > 0) setSelectedSubCategory(subs[0]);
        }
      } catch (e) {
        console.error('API Error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- CART LOGIC ---
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price.selling_price,
      image: product.images?.[0]?.url,
    }));
  };

  const updateQuantity = (productId, delta) => {
    if (delta > 0) {
      const item = products.find(p => p._id === productId);
      if (item) {
        dispatch(addToCart({
          id: item._id,
          name: item.name,
          price: item.price.selling_price,
          image: item.images?.[0]?.url,
        }));
      }
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  // --- FILTERED DATA ---
  const filteredProducts = products.filter((p) => p.sub_category === selectedSubCategory);

  const getSubCategoryImage = (sub) => {
    const p = products.find((prod) => prod.sub_category === sub);
    return p?.images?.[0]?.url || "/image/placeholder.png";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1898A5] border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-gray-900 overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h1 className="text-lg font-bold">Grocery</h1>
        </div>
        <button className="p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </header>

      {/* CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[100px] border-r border-gray-100 overflow-y-auto bg-white scrollbar-hide">
          {subCategories.map((sub, i) => (
            <button
              key={i}
              onClick={() => setSelectedSubCategory(sub)}
              className={`w-full py-4 flex flex-col items-center gap-2 px-1 transition-colors ${
                selectedSubCategory === sub ? 'bg-blue-50 border-r-4 border-[#1898A5]' : ''
              }`}
            >
              <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center p-2 border border-gray-50">
                <img 
                  src={getSubCategoryImage(sub)} 
                  alt={sub} 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = "/image/placeholder.png"; }}
                />
              </div>
              <span className="text-[10px] font-semibold text-center leading-tight line-clamp-2">
                {sub}
              </span>
            </button>
          ))}
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-2 pb-24">
          <div className="grid grid-cols-2 gap-2">
            {filteredProducts.map((item) => {
              const qty = getQuantity(item._id);
              const showDiscount = item.price.mrp > item.price.selling_price;

              return (
                <div key={item._id} className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
                  {/* Image Container */}
                  <div className="aspect-square w-full p-4 relative bg-white">
                    <img 
                      src={item.images?.[0]?.url} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1 min-h-[24px]">
                      <div className={`px-1.5 py-0.5 rounded ${showDiscount ? 'bg-[#1898A5] text-white' : ''}`}>
                        <span className="text-sm font-bold">₹{item.price.selling_price}</span>
                      </div>
                      {showDiscount && (
                        <span className="text-[11px] text-gray-400 line-through">₹{item.price.mrp}</span>
                      )}
                    </div>

                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 h-8">
                      {item.name}
                    </h3>

                    <p className="text-[11px] text-gray-500 mb-3">
                      {item.quantity_info.size} {item.quantity_info.unit}
                    </p>

                    {/* Add / Quantity Control */}
                    <div className="mt-auto">
                      {qty > 0 ? (
                        <div className="bg-[#1898A5] rounded-lg flex items-center justify-between p-1 h-9">
                          <button 
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </button>
                          <span className="text-white font-bold text-sm">{qty}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="w-full border border-[#1898A5] text-[#1898A5] rounded-lg py-1.5 text-sm font-bold h-9 hover:bg-blue-50 transition-colors"
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* FLOATING CART BUTTON */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-[100]">
          <button 
            onClick={() => router.push('/cart')}
            className="w-full bg-[#1898A5] text-white rounded-xl py-3.5 px-5 flex items-center justify-between shadow-lg shadow-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{cartCount} ITEMS</span>
              <span className="text-base font-bold">₹{cartTotal}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">VIEW CART</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
