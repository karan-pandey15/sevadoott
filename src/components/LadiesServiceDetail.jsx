"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
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
  ShoppingCart,
  Clipboard,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LadiesServiceDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const title = searchParams.get('title') || 'Health Issue Details';
  const image = searchParams.get('image') || '/image/lifestyle.png';
  const emoji = searchParams.get('emoji') || '🩺';
  const price = Number(searchParams.get('price') || 499);
  const description = searchParams.get('description') || 'Consultation for women health issues. Our specialists provide compassionate care and evidence-based treatments tailored to your unique needs.';
  const category = searchParams.get('category') || 'Gynecologist';
  const serviceId = searchParams.get('id') || `ladies_${Date.now()}`;

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeImage, setActiveImage] = useState(image);
  const [consultationType, setConsultationType] = useState('hospital'); // 'online' or 'hospital'
  const [dates, setDates] = useState([]);
  const [additionalRequest, setAdditionalRequest] = useState('');

  // Rating and Review State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState('');
  const [userName, setUserName] = useState('');
  const [averageRating, setAverageRating] = useState(4.9);

  const timeSlots = [
    '09:00 AM', '11:00 AM', '01:00 PM',
    '03:00 PM', '05:00 PM', '07:00 PM',
  ];

  const prescriptionData = [
    { med: "Tab. Mefkind-Spas", dose: "1-0-1", duration: "3 Days", instruction: "After food" },
    { med: "Tab. Folvite 5mg", dose: "0-1-0", duration: "1 Month", instruction: "Daily afternoon" },
    { med: "Syp. Hemfer", dose: "2 tsp", duration: "1 Month", instruction: "Twice daily after meals" },
  ];

  const adviceList = [
    "Drink at least 3-4 liters of water daily.",
    "Maintain a balanced diet rich in iron and calcium.",
    "Avoid spicy and oily food during peak symptoms.",
    "Perform light exercise/yoga for 30 mins daily.",
    "Follow up with the doctor in 15 days or if symptoms persist."
  ];

  useEffect(() => {
    generateDates();
    loadReviews();
  }, [title]);

  const loadReviews = () => {
    const savedReviews = localStorage.getItem(`reviews_${title}`);
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
    localStorage.setItem(`reviews_${title}`, JSON.stringify(updatedReviews));
    
    // Update average
    const sum = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    setAverageRating((sum / updatedReviews.length).toFixed(1));

    // Reset form
    setNewReview('');
    setNewRating(5);
    setUserName('');
  };

  const handleShare = async () => {
    const shareData = {
      title: `Sevadoot - ${title}`,
      text: `Check out this professional consultation: ${title}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Consultation link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const generateDates = () => {
    const today = new Date();
    const nextDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      nextDates.push({
        id: i,
        dayName: days[date.getDay()],
        dateNum: date.getDate(),
        monthName: months[date.getMonth()],
        year: date.getFullYear()
      });
    }
    setDates(nextDates);
  };

  const handleBooking = () => {
    if (!selectedTime) return alert('Please select a preferred time for consultation');
    
    const selectedDateObj = dates.find(d => d.id === selectedDate);
    const serviceItem = {
      id: serviceId,
      name: `${title} (${consultationType === 'online' ? 'Online Consulting' : 'Hospital Visit'})`,
      image: image,
      date: `${selectedDateObj.dayName}, ${selectedDateObj.dateNum} ${selectedDateObj.monthName}`,
      time: selectedTime,
      price: price,
      consultationType: consultationType,
      quantity: 1,
      category: category,
      emoji: emoji,
      additionalRequest
    };

    dispatch(addToCart(serviceItem));
    router.push('/cart');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      {/* ── Top Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="hidden sm:flex items-center text-xs text-gray-500 gap-2">
            <span>Consultations</span>
            <ChevronRight size={12} />
            <span>{category}</span>
            <ChevronRight size={12} />
            <span className="font-bold text-gray-800">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Share2 
            size={20} 
            className="text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" 
            onClick={handleShare}
            title="Share this consultation"
          />
          <Heart size={20} className="text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
          <button onClick={() => router.push('/cart')} className="relative">
            <ShoppingCart size={22} className="text-gray-700 hover:text-pink-600" />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">0</span>
          </button>
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <div className="flex-1 max-w-[1500px] mx-auto w-full pt-16 pb-32">
        <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-6 lg:p-8">
          
          {/* ── Left Column: Title & Image Flow ── */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            
            {/* 1. Category and Heading (Title) at the Top */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
                {category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 leading-tight">
                {title}
              </h1>
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

            {/* 2. Image below the Heading */}
            <div className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center text-9xl z-0 opacity-10">
                {emoji}
              </div>
              <img 
                src={activeImage} 
                alt={title}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 relative z-10"
              />
              <div className="absolute top-4 left-4 bg-pink-600 text-white px-2 py-1 text-[10px] font-bold rounded shadow-sm z-20">
                Top Rated Specialist
              </div>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(image)} // Using the same image for now but in a real case it would be i-th image
                  className={`w-16 h-16 border rounded cursor-pointer p-1 transition-all ${activeImage === image && i === 1 ? 'border-pink-600 ring-1 ring-pink-600' : 'border-gray-200 hover:border-pink-600 hover:scale-105'}`}
                >
                  <img src={image} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>

            {/* 3. Description below the Image */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-900">About this consultation</h3>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* 4. Additional Requests Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                <Info size={16} className="text-pink-600" />
                Additional Health Concerns?
              </h4>
              <textarea 
                value={additionalRequest}
                onChange={(e) => setAdditionalRequest(e.target.value)}
                placeholder="Briefly describe any other symptoms or questions..."
                className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-pink-600 focus:border-pink-600 outline-none transition-all resize-none"
                rows={3}
              />
            </div>

            {/* Prescription Preview Section */}
            <section className="border-2 border-dashed border-pink-200 rounded-2xl p-5 bg-white shadow-sm mt-4">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold tracking-tight text-gray-900 uppercase flex items-center gap-2">
                  <Clipboard size={18} className="text-pink-600" />
                  Prescription Preview
                </h3>
                <span className="text-[9px] font-bold bg-pink-100 text-pink-600 px-2 py-1 rounded uppercase">Sample Only</span>
              </div>
              
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] sm:text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase">
                        <th className="py-2 font-bold">Medicine</th>
                        <th className="py-2 font-bold">Dosage</th>
                        <th className="py-2 font-bold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {prescriptionData.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-50">
                          <td className="py-3 font-bold">{item.med}</td>
                          <td className="py-3 font-medium">{item.dose}</td>
                          <td className="py-3 font-medium">{item.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 bg-yellow-50 p-3 rounded-lg flex gap-3 items-start">
                  <AlertCircle size={14} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-yellow-700 uppercase mb-1">General Advice</h4>
                    <ul className="text-[10px] text-yellow-800 list-disc list-inside font-medium space-y-1">
                      {adviceList.map((advice, idx) => (
                        <li key={idx}>{advice}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Rating and Reviews Section */}
            <div className="border-t border-gray-200 pt-8 mt-4">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <MessageSquare size={22} className="text-pink-600" />
                Patient Reviews
              </h3>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
                <h4 className="text-sm font-bold text-gray-800">Share Your Experience</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Your Name</label>
                    <input 
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-600/20 focus:border-pink-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Rating</label>
                    <div className="flex gap-2 items-center h-[42px]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="hover:scale-110 transition-transform"
                        >
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
                    placeholder="Describe the care you received..."
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-600/20 focus:border-pink-600 outline-none min-h-[100px]"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-md"
                >
                  <Send size={16} />
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
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
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Center Column: Info & Details ── */}
          <div className="w-full lg:w-[35%] space-y-6 border-b lg:border-b-0 pb-8 pt-0 lg:pt-14">
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-pink-600 text-white px-2 py-0.5 text-[10px] font-bold rounded">Expert Specialist</span>
              <span className="text-gray-500">for "{title}"</span>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-red-700">-15%</span>
                <div className="flex items-start">
                  <span className="text-sm mt-1 font-medium">₹</span>
                  <span className="text-3xl font-medium">{price}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">M.R.P.: <span className="line-through">₹{Math.round(price * 1.15)}</span></p>
              <div className="bg-gray-100 p-2 rounded inline-block text-[11px] font-bold text-gray-700 border border-gray-200">
                Inclusive of all taxes
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4">
              <FeatureItem icon={CheckCircle2} label="Verified" color="text-green-600" />
              <FeatureItem icon={ShieldCheck} label="Safe" color="text-pink-600" />
              <FeatureItem icon={Zap} label="Quick" color="text-yellow-600" />
              <FeatureItem icon={Clock} label="30 Mins" color="text-gray-600" />
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-6">
              {/* Consultation Type Selector */}
              <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold mb-4 uppercase flex items-center gap-2">
                  <Info size={18} className="text-pink-600" />
                  Consultation Type
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConsultationType('online')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                      consultationType === 'online'
                        ? 'bg-pink-50 border-pink-600 text-pink-600'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-pink-200'
                    }`}
                  >
                    <Zap size={18} className="mb-1" />
                    <span className="font-bold text-[10px] uppercase">Online</span>
                  </button>

                  <button
                    onClick={() => setConsultationType('hospital')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                      consultationType === 'hospital'
                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100'
                    }`}
                  >
                    <MapPin size={18} className="mb-1" />
                    <span className="font-bold text-[10px] uppercase">Physical</span>
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Calendar size={18} />
                  Choose Date
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map((date) => (
                    <button
                      key={date.id}
                      onClick={() => setSelectedDate(date.id)}
                      className={`flex flex-col items-center min-w-[60px] p-2 rounded border transition-all ${
                        selectedDate === date.id 
                          ? 'border-pink-600 bg-pink-50 ring-1 ring-pink-600' 
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-[10px] uppercase text-gray-500 font-bold">{date.dayName}</span>
                      <span className="text-lg font-bold">{date.dateNum}</span>
                      <span className="text-[10px] uppercase text-gray-500">{date.monthName}</span>
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
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-1 rounded border text-xs font-bold transition-all ${
                        selectedTime === time 
                          ? 'border-pink-600 bg-pink-50 ring-1 ring-pink-600' 
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* ── Right Column: Buy Box ── */}
          <div className="w-full lg:w-[25%] pt-0 lg:pt-14">
            <div className="lg:sticky lg:top-24 border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm bg-white">
              <div className="text-2xl font-medium">₹{price}</div>
              
              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleBooking}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-full font-medium text-sm border border-pink-600 shadow-sm transition-all uppercase tracking-wider"
                >
                  Confirm Booking
                </button>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Care from</span>
                  <span className="text-pink-600 font-bold">Sevadoot Health</span>
                </div>
                <div className="text-[10px] text-gray-400 text-center pt-2">
                  * 100% Secure Transaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, label, color }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
      <Icon size={18} className={color} />
    </div>
    <span className="text-[10px] text-gray-600 font-medium text-center">{label}</span>
  </div>
);

export default LadiesServiceDetail;
