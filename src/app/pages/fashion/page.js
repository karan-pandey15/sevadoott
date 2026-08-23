"use client";

import React, { useState, useEffect } from 'react'; 
import { ShoppingCart, Star, Heart, ArrowRight, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiUrl } from '@/lib/api';

export default function FashionPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl('/products/category/fashion'));
        const data = await response.json();
        if (data.ok) {
          setProducts(data.products);
          
          const uniqueSubs = [];
          const seenSubs = new Set();
          
          data.products.forEach(p => {
            if (!seenSubs.has(p.sub_category)) {
              seenSubs.add(p.sub_category);
              uniqueSubs.push({
                name: p.sub_category,
                image: p.images[0]?.url || ''
              });
            }
          });
          
          setSubCategories(uniqueSubs);
          if (uniqueSubs.length > 0) {
            setSelectedSubCategory(uniqueSubs[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching fashion products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => p.sub_category === selectedSubCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-white"> 
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="w-10 h-10 text-[#1898A5] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your fashion picks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> 
      
      <div className="bg-white border-b sticky top-[60px] md:top-[70px] z-40">
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
            {subCategories.map((sub) => (
              <button
                key={sub.name}
                onClick={() => setSelectedSubCategory(sub.name)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group outline-none"
              >
                <div className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300
                  ${selectedSubCategory === sub.name ? 'border-[#1898A5] scale-110 ring-2 ring-[#1898A5]/20' : 'border-transparent group-hover:border-gray-300'}
                `}>
                  <img 
                    src={sub.image} 
                    alt={sub.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`
                  text-xs md:text-sm font-bold transition-colors
                  ${selectedSubCategory === sub.name ? 'text-[#1898A5]' : 'text-gray-600 group-hover:text-gray-900'}
                `}>
                  {sub.name}
                </span>
                {selectedSubCategory === sub.name && (
                  <motion.div 
                    layoutId="activeSub"
                    className="h-1 w-full bg-[#1898A5] rounded-full mt-1"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1898A5] flex items-center gap-2">
            {selectedSubCategory} Fashion
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">
              {filteredProducts.length} items
            </span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">Discover the latest trends in {selectedSubCategory.toLowerCase()} wear.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product._id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-t-lg">
                <Link href={`/pages/ecommerce/details?id=${product.id}`}>
                  <img 
                    src={product.images[0]?.url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={18} />
                </button>
                {product.price.mrp > product.price.selling_price && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {Math.round(((product.price.mrp - product.price.selling_price) / product.price.mrp) * 100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-3 md:p-4 flex flex-col flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">(4.2)</span>
                  </div>
                  
                  <Link href={`/pages/ecommerce/details?id=${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#1898A5] transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">₹{product.price.selling_price}</span>
                    {product.price.mrp > product.price.selling_price && (
                      <span className="text-xs text-gray-400 line-through">M.R.P: ₹{product.price.mrp}</span>
                    )}
                  </div>
                </div>

                <button className="w-full bg-[#1898A5] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#147F8A] active:scale-95 transition-all shadow-md group-hover:shadow-lg">
                  <ShoppingCart size={14} />
                  ADD TO CART
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 mt-10">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No products found</h3>
            <p className="text-gray-500 mt-1">We couldn't find any products in this sub-category.</p>
            <button 
              onClick={() => setSelectedSubCategory(subCategories[0]?.name)}
              className="mt-6 text-[#1898A5] font-bold flex items-center gap-2 mx-auto hover:underline"
            >
              Browse all categories <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:hidden">
        <button className="bg-[#1898A5] text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform">
          <ShoppingCart size={24} />
        </button>
      </div>
    </div>
  );
}
