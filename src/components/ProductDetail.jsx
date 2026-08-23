"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
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
  Car,
  MessageSquare,
  Send,
  Share2,
  Heart,
  ShoppingCart,
  ChevronDown,
  Lock,
  RotateCcw,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THEME_COLOR = "#1898A5";
const SECONDARY_COLOR = "#F4A261"; // Amazon-like orange/yellow but theme compatible

const ProductDetail = ({ 
  name: propName, 
  image: propImage, 
  price: propPrice, 
  mrp: propMrp,
  item: propItem = null 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const name = propName || searchParams.get('name') || 'Product Details';
  const mainImage = propImage || searchParams.get('image') || '/image/placeholder.png';
  const sellingPrice = Number(propPrice || searchParams.get('price') || 0);
  const mrp = Number(propMrp || searchParams.get('mrp') || sellingPrice);
  const discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
  
  const item = propItem || {
    description: searchParams.get('description') || 'Experience professional and high-quality product tailored to your needs.',
    category: searchParams.get('category') || 'Ecommerce',
    sub_category: searchParams.get('sub_category') || 'General',
    id: searchParams.get('id'),
    unit: searchParams.get('unit') || 'piece',
    size: searchParams.get('size') || '',
    images: JSON.parse(searchParams.get('images') || '[]')
  };

  const productImages = item.images && item.images.length > 0 
    ? item.images 
    : [{ url: mainImage }];

  const [activeImage, setActiveImage] = useState(productImages[0]?.url || mainImage);
  const [quantity, setQuantity] = useState(1);
  const [additionalRequest, setAdditionalRequest] = useState('');
  
  // Rating and Review State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState('');
  const [userName, setUserName] = useState('');
  const [averageRating, setAverageRating] = useState(4.5);

  useEffect(() => {
    loadReviews();
    if (productImages.length > 0) {
      setActiveImage(productImages[0].url);
    }
  }, [name]);

  const loadReviews = () => {
    const savedReviews = localStorage.getItem(`reviews_prod_${item.id || name}`);
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
    if (!newReview.trim() || !userName.trim()) return alert('Please provide your name and review');

    const reviewObj = {
      id: Date.now(),
      userName,
      rating: newRating,
      comment: newReview,
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [reviewObj, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_prod_${item.id || name}`, JSON.stringify(updatedReviews));
    
    const sum = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    setAverageRating((sum / updatedReviews.length).toFixed(1));

    setNewReview('');
    setNewRating(5);
    setUserName('');
  };

  const handleShare = async () => {
    const shareData = {
      title: `Sevadoot - ${name}`,
      text: `Check out this product: ${name}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Product link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleAddToCart = (type = 'cart') => {
    const productItem = {
      id: item.id || `prod_${Date.now()}`,
      name: name,
      image: activeImage,
      price: sellingPrice,
      totalPrice: sellingPrice * quantity,
      quantity: quantity,
      category: item.category,
      sub_category: item.sub_category,
      size: item.size,
      unit: item.unit,
      additionalRequest
    };

    dispatch(addToCart(productItem));
    if (type === 'buy') {
      router.push('/checkout');
    } else {
      router.push('/cart');
    }
  };

  // Mock specifications for Amazon feel
  const specifications = [
    { label: 'Category', value: item.category },
    { label: 'Sub-Category', value: item.sub_category },
    { label: 'Brand', value: 'Sevadoot' },
    { label: 'Size', value: `${item.size} ${item.unit}` },
    { label: 'Availability', value: 'In Stock' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* MOBILE HEADER */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Share2 size={20} className="text-gray-600 cursor-pointer" onClick={handleShare} />
          <Heart size={20} className="text-gray-600 cursor-pointer" />
          <button onClick={() => router.push('/cart')} className="relative">
            <ShoppingCart size={22} className="text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-[#1898A5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">0</span>
          </button>
        </div>
      </nav>

      {/* BREADCRUMBS (Desktop) */}
      <div className="hidden lg:flex max-w-[1500px] mx-auto w-full px-6 pt-6 text-xs text-gray-500 gap-1.5 items-center">
        <span className="hover:underline cursor-pointer">Sevadoot Store</span>
        <ChevronRight size={10} />
        <span className="hover:underline cursor-pointer">{item.category}</span>
        <ChevronRight size={10} />
        <span className="hover:underline cursor-pointer font-bold text-gray-700">{item.sub_category}</span>
      </div>

      <main className="max-w-[1500px] mx-auto w-full pt-14 lg:pt-6 pb-20 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* IMAGE SECTION (LEFT) */}
          <div className="w-full lg:w-[45%] flex flex-col lg:flex-row gap-4">
            {/* Desktop Vertical Thumbnails */}
            <div className="hidden lg:flex flex-col gap-2 w-12 shrink-0">
              {productImages.map((img, i) => (
                <div 
                  key={i} 
                  onMouseEnter={() => setActiveImage(img.url)}
                  className={`w-12 h-12 border rounded cursor-pointer p-1 transition-all overflow-hidden bg-white ${activeImage === img.url ? 'border-[#1898A5] ring-2 ring-[#1898A5]/20 shadow-sm' : 'border-gray-300 hover:border-[#1898A5]'}`}
                >
                  <img src={img.url} className="w-full h-full object-contain" alt={`Thumbnail ${i}`} />
                </div>
              ))}
            </div>

            {/* Main Image Container */}
            <div className="flex-1">
              <div className="aspect-square bg-white border border-gray-100 rounded-sm relative group overflow-hidden flex items-center justify-center p-4">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  src={activeImage} 
                  alt={name}
                  className="max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-110"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-white lg:hidden">
                  <Share2 size={18} onClick={handleShare} />
                </button>
                <div className="absolute bottom-4 right-4 text-gray-400 hidden lg:block">
                  <span className="text-[10px]">Roll over image to zoom in</span>
                </div>
              </div>

              {/* Mobile Thumbnails (Horizontal) */}
              <div className="flex lg:hidden gap-2 overflow-x-auto py-4 scrollbar-hide">
                {productImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(img.url)}
                    className={`min-w-[60px] h-[60px] border rounded-lg p-1 shrink-0 ${activeImage === img.url ? 'border-[#1898A5] ring-2 ring-[#1898A5]/20' : 'border-gray-200'}`}
                  >
                    <img src={img.url} className="w-full h-full object-contain" alt={`Mobile Thumbnail ${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT INFO SECTION (MIDDLE) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
            <div className="space-y-1">
              <a href="#" className="text-[#007185] hover:underline hover:text-[#c45500] text-sm font-medium">
                Visit the Sevadoot Store
              </a>
              <h1 className="text-xl lg:text-2xl font-medium text-gray-900 leading-snug break-words">
                {name}
              </h1>
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(averageRating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <div className="flex items-center gap-1 group cursor-pointer">
                  <ChevronDown size={14} className="text-gray-500 group-hover:text-gray-900" />
                  <span className="text-sm text-[#007185] group-hover:text-[#c45500] hover:underline">{reviews.length} ratings</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-[#007185] hover:underline cursor-pointer">Search this page</span>
              </div>
            </div>

            <div className="bg-red-50 text-red-800 px-2 py-1 text-[10px] font-bold rounded w-fit uppercase">
              Limited time deal
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-2xl font-light text-red-600">-{discountPercent}%</span>
                <div className="flex items-start">
                  <span className="text-xs mt-1.5 font-medium">₹</span>
                  <span className="text-3xl font-medium">{sellingPrice}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                M.R.P.: <span className="line-through">₹{mrp}</span>
              </div>
              <div className="text-xs font-medium text-gray-800">
                Inclusive of all taxes
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="font-bold">EMI</span> starts at ₹125. No Cost EMI available <ChevronDown size={12} className="inline" />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Amazon Icons Section */}
            <div className="grid grid-cols-4 gap-2 py-2">
              <IconFeature icon={RotateCcw} label="7 days Replacement" />
              <IconFeature icon={Truck} label="Free Delivery" />
              <IconFeature icon={ShieldCheck} label="1 Year Warranty" />
              <IconFeature icon={Lock} label="Secure transaction" />
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <div className="flex gap-4 text-sm">
                <span className="font-bold text-gray-900 min-w-[80px]">Brand</span>
                <span className="text-gray-700">Sevadoot</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="font-bold text-gray-900 min-w-[80px]">Item Form</span>
                <span className="text-gray-700">{item.unit}</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="font-bold text-gray-900 min-w-[80px]">Size</span>
                <span className="text-gray-700">{item.size} {item.unit}</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">About this item</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-800 leading-relaxed">
                {item.description.split('\n').map((line, i) => (
                  <li key={i} className="pl-1 -indent-5 ml-5">{line}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* BUY BOX (RIGHT) */}
          
        </div>

        {/* BOTTOM SECTIONS */}
        <div className="mt-16 space-y-16">
          <hr className="border-gray-200" />
          
          {/* TECHNICAL DETAILS */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Product information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-0">
                <h3 className="text-sm font-bold bg-gray-50 p-2 border-b border-gray-200">Technical Details</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {specifications.map((spec, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-2 font-bold text-gray-900 bg-gray-50/50 w-1/3">{spec.label}</td>
                        <td className="py-3 px-4 text-gray-700">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold bg-gray-50 p-2 border-b border-gray-200">Additional Information</h3>
                <div className="space-y-4 px-2">
                  <div className="flex gap-4 items-center">
                    <span className="text-sm font-bold w-1/3">ASIN</span>
                    <span className="text-sm">B07V8H{item.id?.slice(-4) || 'ABCD'}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="text-sm font-bold w-1/3">Customer Reviews</span>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-[#007185] hover:underline cursor-pointer">{averageRating} out of 5 stars</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="text-sm font-bold w-1/3">Best Sellers Rank</span>
                    <span className="text-sm">#12 in {item.sub_category}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* REVIEWS SECTION */}
          <section className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-[30%] space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Customer reviews</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill={i < Math.floor(averageRating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-lg font-bold">{averageRating} out of 5</span>
                </div>
                <p className="text-sm text-gray-500">{reviews.length} global ratings</p>
              </div>

              {/* Rating Bars */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percentage = star === 5 ? 85 : star === 4 ? 10 : 5;
                  return (
                    <div key={star} className="flex items-center gap-4 group cursor-pointer">
                      <span className="text-sm text-[#007185] hover:underline whitespace-nowrap min-w-[40px]">{star} star</span>
                      <div className="flex-1 h-5 bg-gray-100 rounded-sm overflow-hidden border border-gray-200 shadow-inner">
                        <div 
                          className="h-full bg-[#FFA41C] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#007185] hover:underline min-w-[30px]">{percentage}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-bold mb-2">Review this product</h3>
                <p className="text-sm text-gray-600 mb-4">Share your thoughts with other customers</p>
                <button 
                  onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full border border-gray-300 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Write a customer review
                </button>
              </div>
            </div>

            <div className="w-full md:w-[70%] space-y-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold">Top reviews from India</h3>
                <select className="bg-gray-50 border border-gray-300 rounded text-xs p-1 focus:outline-none">
                  <option>Top reviews</option>
                  <option>Most recent</option>
                </select>
              </div>

              <form id="review-form" onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 mb-8">
                <h4 className="font-bold text-gray-800">Add a Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name"
                    className="p-2 border border-gray-300 rounded text-sm focus:border-[#1898A5] outline-none"
                  />
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={20} 
                        onClick={() => setNewRating(s)}
                        className="cursor-pointer"
                        fill={s <= newRating ? "#FACC15" : "none"}
                        color={s <= newRating ? "#FACC15" : "#D1D5DB"}
                      />
                    ))}
                  </div>
                </div>
                <textarea 
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="What did you like or dislike?"
                  className="w-full p-3 border border-gray-300 rounded text-sm min-h-[100px] focus:border-[#1898A5] outline-none"
                />
                <button className="bg-[#1898A5] text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                  Submit Review
                </button>
              </form>

              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
                    No reviews yet. Be the first to share your experience!
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-gray-500" />
                        </div>
                        <span className="text-sm font-medium">{review.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-sm font-bold">Verified Purchase</span>
                      </div>
                      <p className="text-xs text-gray-500">Reviewed in India on {review.date}</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{review.comment}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <button className="text-xs border border-gray-300 px-6 py-1 rounded shadow-sm hover:bg-gray-50">Helpful</button>
                        <span className="text-xs text-gray-500">|</span>
                        <button className="text-xs text-gray-500 hover:underline">Report</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV (ADD TO CART) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 p-4 flex gap-4">
        <button 
          onClick={() => handleAddToCart('cart')}
          className="flex-1 bg-white border border-[#1898A5] text-[#1898A5] py-3 rounded-xl font-bold text-sm shadow-sm"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => handleAddToCart('buy')}
          className="flex-1 bg-[#1898A5] text-white py-3 rounded-xl font-bold text-sm shadow-sm"
        >
          Buy Now
        </button>
      </div>

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
};

const IconFeature = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="w-10 h-10 flex items-center justify-center">
      <Icon size={24} className="text-[#1898A5]" />
    </div>
    <span className="text-[10px] text-[#007185] font-medium text-center hover:underline cursor-pointer leading-tight">
      {label}
    </span>
  </div>
);

export default ProductDetail;
