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
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceDetail = ({ 
  title: propTitle, 
  image: propImage, 
  basePrice: propBasePrice, 
  item: propItem = null 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const title = propTitle || searchParams.get('title') || 'Service Details';
  const image = propImage || searchParams.get('image') || 'https://images.unsplash.com/photo-1584512603392-f0c3d99c1ce0?q=80&w=800';
  const emoji = searchParams.get('emoji') || '✨';
  const basePrice = Number(propBasePrice || searchParams.get('price') || 299);
  
  const item = propItem || {
    id: searchParams.get('categoryId') || searchParams.get('id') || (typeof window !== 'undefined' ? localStorage.getItem('selectedCategoryId') : '') || '',
    description: searchParams.get('description') || 'Experience professional and high-quality service tailored to your needs. Our experts ensure every detail is handled with care.',
    category: searchParams.get('category') || 'Premium Service',
    time: searchParams.get('duration') || '1-2 Hours',
    hour: searchParams.get('hours') || '9 AM - 6 PM',
    isTraveling: searchParams.get('isTraveling') === 'true',
    withVehicle: searchParams.get('withVehicle') === 'true',
    suggestion: searchParams.get('suggestion') || 'Highly recommended for quality results.'
  };

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [hours, setHours] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState(item.description || '');
  const [dates, setDates] = useState([]);
  const [additionalRequest, setAdditionalRequest] = useState('');

  // Rating and Review State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState('');
  const [userName, setUserName] = useState('');
  const [averageRating, setAverageRating] = useState(5);

  // Traveling Details
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [location, setLocation] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  
  // Vehicle Details
  const [vehicleType, setVehicleType] = useState('Four Wheeler');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const timeSlots = [
    '09:00 AM', '11:00 AM', '01:00 PM',
    '03:00 PM', '05:00 PM', '07:00 PM',
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
      text: `Check out this professional service: ${title}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Service link copied to clipboard!');
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

  const handleAddToCart = () => {
    if (!selectedTime) return alert('Please select a preferred time');
    
    const selectedDateObj = dates.find(d => d.id === selectedDate);
    const serviceItem = {
      id: item?._id || `service_${Date.now()}`,
      name: title,
      image: image,
      date: `${selectedDateObj.dayName}, ${selectedDateObj.dateNum} ${selectedDateObj.monthName}`,
      time: selectedTime,
      hours: hours,
      description,
      price: basePrice,
      totalPrice: basePrice * hours * quantity,
      quantity: quantity,
      gender,
      religion,
      location,
      pickup,
      drop,
      vehicleType: item.withVehicle ? vehicleType : null,
      vehicleNumber: item.withVehicle ? vehicleNumber : null,
      isTraveling: item.isTraveling,
      withVehicle: item.withVehicle,
      additionalRequest
    };

    dispatch(addToCart(serviceItem));
    router.push('/cart');
  };

  const getVideoSource = (category, id) => {
    const catId = (id || '').toLowerCase();

    if (catId === 'attendant') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775108793/sevadoot1_hswkqc.mp4';
    if (catId === 'gaurdiankids') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775108793/sevadoot1_hswkqc.mp4';
    if (catId === 'petwalker') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775108991/WhatsApp_Video_2026-04-02_at_11.19.23_AM_nwsz98.mp4';
    if (catId === 'pandit') return '/video/sevadoot2.mp4';
    if (catId === 'mehndi') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775109134/WhatsApp_Video_2026-04-02_at_11.21.58_AM_nqfs3o.mp4';
    if (catId === 'school') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775108926/sevadoot03_lu4zut.mp4';
    if (catId === 'groceries' || catId === 'groceries2') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775108689/sevadoot5_gwyu07.mp4';
    if (catId === 'hotel') return '/video/sevadoot1.mp4';
    if (catId === 'nurse' || catId === 'nursed' || catId === 'ladieshealthissues') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775108597/sevadoot3_jyoxvk.mp4';
    if (catId === 'gym') return '/video/sevadoot3.mp4';
    if (catId === 'physiotherapist') return 'https://res.cloudinary.com/dkornixrz/video/upload/v1775108682/sevadoot8_nzoj6g.mp4';
    if (catId === 'salonmakeup' || catId === 'cosmetic') return '/video/sevadoot4.mp4';
    
    return '/video/sevadoot1.mp4'; // Default
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
            <span>Services</span>
            <ChevronRight size={12} />
            <span>{item.category}</span>
            <ChevronRight size={12} />
            <span className="font-bold text-gray-800">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Share2 
            size={20} 
            className="text-gray-600 cursor-pointer hover:text-[#1898A5] transition-colors" 
            onClick={handleShare}
            title="Share this service"
          />
          <Heart size={20} className="text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
          <button onClick={() => router.push('/cart')} className="relative">
            <ShoppingCart size={22} className="text-gray-700 hover:text-[#1898A5]" />
            <span className="absolute -top-2 -right-2 bg-[#1898A5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">0</span>
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
              <span className="text-xs font-bold text-[#1898A5] uppercase tracking-wider block">
                {item.category}
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
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#1898A5] text-white px-2 py-1 text-[10px] font-bold rounded shadow-sm">
                Top Rated
              </div>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-16 h-16 border rounded cursor-pointer p-1 ${i === 1 ? 'border-[#1898A5] ring-1 ring-[#1898A5]' : 'border-gray-200 hover:border-[#1898A5]'}`}>
                  <img src={image} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>

            {/* 3. Description below the Image */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-900">About this service</h3>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* 4. Add more thing section at the last */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                <Info size={16} className="text-[#1898A5]" />
                Additional Requests?
              </h4>
              <textarea 
                value={additionalRequest}
                onChange={(e) => setAdditionalRequest(e.target.value)}
                placeholder="Need something extra? Let us know here..."
                className="w-full bg-white border border-gray-300 rounded p-3 text-sm focus:ring-1 focus:ring-[#1898A5] focus:border-[#1898A5] outline-none transition-all resize-none"
                rows={3}
              />
            </div>

            {/* ── Tutorial Video Section ── */}
            <div className="border-t border-gray-200 pt-10 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-[#1898A5]/10 p-2 rounded-lg">
                    <Video size={24} className="text-[#1898A5]" />
                  </div>
                  Service Preview
                </h3>
                <span className="text-[10px] font-black bg-[#1898A5] text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  Official Tutorial
                </span>
              </div>
              <div className="w-full flex justify-center">
                <div className="w-full relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,64,144,0.15)] border-4 border-white group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,64,144,0.25)]">
                  <video 
                    key={getVideoSource(item.category, item.id)}
                    src={getVideoSource(item.category, item.id)}
                    controls 
                    className="w-full aspect-[9/16] sm:aspect-video rounded-2xl"
                    style={{ maxHeight: '750px', objectFit: 'cover' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 pointer-events-none border border-[#1898A5]/5 rounded-2xl"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center italic">
                Watch our professional tutorial to understand the service quality and process.
              </p>
            </div>

            {/* 5. Rating and Reviews Section */}
            <div className="border-t border-gray-200 pt-8 mt-4">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <MessageSquare size={22} className="text-[#1898A5]" />
                Customer Reviews
              </h3>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
                <h4 className="text-sm font-bold text-gray-800">Write a Review</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Your Name</label>
                    <input 
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1898A5]/20 focus:border-[#1898A5] outline-none"
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
                    placeholder="Share your experience with this service..."
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1898A5]/20 focus:border-[#1898A5] outline-none min-h-[100px]"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-[#1898A5] hover:bg-[#147F8A] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-md"
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
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
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
              <span className="bg-[#1898A5] text-white px-2 py-0.5 text-[10px] font-bold rounded">Sevadoot Choice</span>
              <span className="text-gray-500">for "{title}"</span>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-red-700">-10%</span>
                <div className="flex items-start">
                  <span className="text-sm mt-1 font-medium">₹</span>
                  <span className="text-3xl font-medium">{basePrice}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">M.R.P.: <span className="line-through">₹{Math.round(basePrice * 1.1)}</span></p>
              <div className="bg-gray-100 p-2 rounded inline-block text-[11px] font-bold text-gray-700 border border-gray-200">
                Inclusive of all taxes
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4">
              <FeatureItem icon={CheckCircle2} label="Verified" color="text-green-600" />
              <FeatureItem icon={ShieldCheck} label="Safe" color="text-[#1898A5]" />
              <FeatureItem icon={Zap} label="Quick" color="text-yellow-600" />
              <FeatureItem icon={Clock} label={item.time} color="text-gray-600" />
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-6">
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
                          ? 'border-[#1898A5] bg-blue-50 ring-1 ring-[#1898A5]' 
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
                          ? 'border-[#1898A5] bg-blue-50 ring-1 ring-[#1898A5]' 
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>

              {(item.isTraveling || item.withVehicle) && (
                <div className="space-y-4 pt-4 bg-gray-50 p-4 rounded border border-gray-200">
                  {item.isTraveling && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Service Logistics</h4>
                      <input 
                        type="text" 
                        placeholder="Pickup Location" 
                        className="w-full text-sm p-2 border border-gray-300 rounded"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Drop Location" 
                        className="w-full text-sm p-2 border border-gray-300 rounded"
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                      />
                    </div>
                  )}
                  {item.withVehicle && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Vehicle Info</h4>
                      <select 
                        className="w-full text-sm p-2 border border-gray-300 rounded"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                      >
                        <option value="Two Wheeler">Two Wheeler</option>
                        <option value="Four Wheeler">Four Wheeler</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Buy Box ── */}
          <div className="w-full lg:w-[25%] pt-0 lg:pt-14">
            <div className="lg:sticky lg:top-24 border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm bg-white">
              <div className="text-2xl font-medium">₹{basePrice * hours * quantity}</div>
              
              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-[#1898A5] hover:bg-[#147F8A] text-white py-2.5 rounded-full font-medium text-sm border border-[#1898A5] shadow-sm transition-all"
                >
                  Book Now
                </button>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Service from</span>
                  <span className="text-[#1898A5] font-bold">Sevadoot</span>
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

export default ServiceDetail;
