"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartRedux } from '@/redux/cartSlice';

// ============================================
// MOCK DATA & CONSTANTS
// ============================================
const THEME_COLOR = '#1898A5';
const PANDIT_IMAGE = 'https://lh3.googleusercontent.com/ogw/AF2bZygnDN02Te97on5Wf-4sDfYUPxMX27fbGwu4tJIZbNoA2eI=s64-c-mo';

const PANDITS = [
  {
    id: '1',
    name: 'Pandit Rajesh Sharma',
    specialization: 'Vedic Astrology & Kundli',
    experience: '15 years',
    rating: 5,
    reviews: 2,
    languages: ['Hindi', 'English', 'Sanskrit'],
    price: 299,
    image: PANDIT_IMAGE,
    available: true,
    expertise: ['Marriage Matching', 'Career Guidance', 'Health Issues', 'Kundli Making'],
  },
  {
    id: '2',
    name: 'Pandit Anil Kumar',
    specialization: 'Palmistry & Numerology',
    experience: '12 years',
    rating: 4,
    reviews: 1,
    languages: ['Hindi', 'English'],
    price: 249,
    image: PANDIT_IMAGE,
    available: true,
    expertise: ['Love Life', 'Business Consultation', 'Future Prediction', 'Palmistry'],
  },
  {
    id: '3',
    name: 'Pandit Suresh Mishra',
    specialization: 'Vastu Shastra Expert',
    experience: '20 years',
    rating: 5,
    reviews: 2,
    languages: ['Hindi', 'English', 'Bengali'],
    price: 399,
    image: PANDIT_IMAGE,
    available: false,
    expertise: ['Home Vastu', 'Office Vastu', 'Remedies', 'Vastu'],
  },
  {
    id: '6',
    name: 'Pandit Mahesh Singh',
    specialization: 'Puja & Rituals',
    experience: '18 years',
    rating: 5,
    reviews: 1,
    languages: ['Hindi', 'Sanskrit'],
    price: 349,
    image: PANDIT_IMAGE,
    available: true,
    expertise: ['Pooja Booking', 'Festival Rituals', 'Remedies', 'Pooja Booking'],
  },
];

const POOJAS = [
  {
    id: 'p1',
    title: 'Satyanarayan Puja',
    description: 'Performed to seek blessings of Lord Vishnu for prosperity and happiness.',
    image: '/image/subcategoryimg/pooja (1).png',
    price: 2100,
    location: 'At your Home',
    duration: '2-3 Hours',
    includes: ['Pandit Ji Fees', 'Puja Samagri Guidance', 'Aarti & Prashad'],
  },
  {
    id: 'p2',
    title: 'Ganesha Puja',
    description: 'Performed before new beginnings to remove obstacles.',
    image: '/image/subcategoryimg/pooja (3).png',
    price: 1500,
    location: 'Home / Temple',
    duration: '1-2 Hours',
    includes: ['Ganesh Sthapana', 'Modak Offering', 'Pandit Ji Fees'],
  },
  {
    id: 'p3',
    title: 'Griha Pravesh Puja',
    description: 'Purifies the new home and brings peace and prosperity.',
    image: '/image/subcategoryimg/pooja (13).png',
    price: 5100,
    location: 'New Home',
    duration: '4-5 Hours',
    includes: ['Vastu Shanti', 'Havan', 'Complete Rituals'],
  },
  {
    id: 'p4',
    title: 'Laxmi Puja',
    description: 'Performed to invite wealth and financial growth.',
    image: '/image/subcategoryimg/pooja (6).png',
    price: 2500,
    location: 'Home / Office',
    duration: '2 Hours',
    includes: ['Laxmi Pujan', 'Deep Prajwalan', 'Mantra Jaap'],
  },
  {
    id: 'p5',
    title: 'Rudrabhishek Puja',
    description: 'Powerful puja dedicated to Lord Shiva for health and peace.',
    image: '/image/subcategoryimg/pooja (7).png',
    price: 3500,
    location: 'Temple / Home',
    duration: '3 Hours',
    includes: ['Abhishek', 'Rudram Chanting', 'Pandit Fees'],
  },
  {
    id: 'p6',
    title: 'Saraswati Puja',
    description: 'For success in education, music, and creativity.',
    image: '/image/subcategoryimg/pooja (8).png',
    price: 1800,
    location: 'Home / School',
    duration: '2 Hours',
    includes: ['Vandana', 'Pushpanjali', 'Pandit Ji Fees'],
  },
  {
    id: 'p7',
    title: 'Navgraha Puja',
    description: 'Balances planetary doshas and brings harmony.',
    image: '/image/subcategoryimg/pooja (9).png',
    price: 4200,
    location: 'Home / Temple',
    duration: '3-4 Hours',
    includes: ['Navgraha Jaap', 'Havan', 'Pandit Fees'],
  },
  {
    id: 'p8',
    title: 'Maha Mrityunjaya Jaap',
    description: 'For health, longevity, and protection.',
    image: '/image/subcategoryimg/pooja (10).png',
    price: 4800,
    location: 'Home / Temple',
    duration: '3 Hours',
    includes: ['108 Jaap', 'Havan', 'Prashad'],
  },
  {
    id: 'p9',
    title: 'Durga Puja',
    description: 'Performed to gain strength and protection.',
    image: '/image/subcategoryimg/pooja (11).png',
    price: 3000,
    location: 'Home / Temple',
    duration: '2-3 Hours',
    includes: ['Durga Path', 'Aarti', 'Pandit Ji Fees'],
  },
  {
    id: 'p10',
    title: 'Kaal Sarp Dosh Puja',
    description: 'Remedy for Kaal Sarp dosh in kundli.',
    image: '/image/subcategoryimg/pooja (12).png',
    price: 6500,
    location: 'Temple',
    duration: '4 Hours',
    includes: ['Special Jaap', 'Havan', 'Pandit Fees'],
  },
  {
    id: 'p11',
    title: 'Vastu Shanti Puja',
    description: 'Removes Vastu dosh and brings positivity.',
    image: '/image/subcategoryimg/pooja (13).png',
    price: 4000,
    location: 'Home / Office',
    duration: '3 Hours',
    includes: ['Vastu Mantra', 'Havan', 'Pandit Ji Fees'],
  },
  {
    id: 'p12',
    title: 'Bhoomi Puja',
    description: 'Performed before construction work begins.',
    image: '/image/subcategoryimg/pooja (13).png',
    price: 3200,
    location: 'Construction Site',
    duration: '2 Hours',
    includes: ['Bhoomi Pujan', 'Aarti', 'Pandit Fees'],
  },
  {
    id: 'p13',
    title: 'Annaprashan Puja',
    description: 'First feeding ceremony for a baby.',
    image: '/image/subcategoryimg/pooja (2).png',
    price: 2200,
    location: 'Home',
    duration: '1-2 Hours',
    includes: ['Baby Rituals', 'Mantra', 'Pandit Ji Fees'],
  },
  {
    id: 'p14',
    title: 'Naamkaran Puja',
    description: 'Naming ceremony for newborn child.',
    image: '/image/subcategoryimg/pooja (2).png',
    price: 2500,
    location: 'Home',
    duration: '2 Hours',
    includes: ['Naamkaran Ritual', 'Kundli Check'],
  },
  {
    id: 'p15',
    title: 'Mundan Puja',
    description: 'First hair-cut ceremony of the child.',
    image: '/image/subcategoryimg/pooja (2).png',
    price: 2000,
    location: 'Home / Temple',
    duration: '1-2 Hours',
    includes: ['Mundan Sanskar', 'Pandit Fees'],
  },
  {
    id: 'p16',
    title: 'Pitru Dosh Nivaran Puja',
    description: 'Performed to remove ancestral dosh.',
    image: '/image/subcategoryimg/pooja (5).png',
    price: 5500,
    location: 'Temple',
    duration: '3-4 Hours',
    includes: ['Tarpan', 'Havan', 'Pandit Fees'],
  },
  {
    id: 'p17',
    title: 'Hanuman Puja',
    description: 'For strength, courage, and protection.',
    image: '/image/subcategoryimg/pooja (4).png',
    price: 1800,
    location: 'Home / Temple',
    duration: '2 Hours',
    includes: ['Hanuman Chalisa', 'Aarti'],
  },
  {
    id: 'p18',
    title: 'Shani Puja',
    description: 'Reduces malefic effects of Shani.',
    image: '/image/subcategoryimg/pooja (9).png',
    price: 2800,
    location: 'Temple',
    duration: '2-3 Hours',
    includes: ['Shani Jaap', 'Oil Abhishek'],
  },
  {
    id: 'p19',
    title: 'Chandi Path',
    description: 'Powerful ritual for protection and success.',
    image: '/image/subcategoryimg/pooja (11).png',
    price: 7500,
    location: 'Home / Temple',
    duration: '5 Hours',
    includes: ['Complete Path', 'Havan'],
  },
  {
    id: 'p20',
    title: 'Office Opening Puja',
    description: 'Ensures success and growth in business.',
    image: '/image/subcategoryimg/pooja (6).png',
    price: 2700,
    location: 'Office',
    duration: '2 Hours',
    includes: ['Ganesh Puja', 'Laxmi Puja'],
  },
  {
    id: 'p21',
    title: 'Vehicle Puja',
    description: 'Performed for safety and smooth journeys.',
    image: '/image/subcategoryimg/pooja (1).png',
    price: 1100,
    location: 'Showroom / Home',
    duration: '30-45 Minutes',
    includes: ['Vehicle Aarti', 'Coconut Ritual'],
  },
  {
    id: 'p22',
    title: 'Upanayan Sanskar',
    description: 'Sacred thread ceremony.',
    image: '/image/subcategoryimg/pooja (5).png',
    price: 9000,
    location: 'Home',
    duration: '6-7 Hours',
    includes: ['Complete Sanskar', 'Pandit Fees'],
  },
  {
    id: 'p23',
    title: 'Marriage Puja',
    description: 'Pre-wedding rituals for auspicious marriage.',
    image: '/image/subcategoryimg/pooja (1).png',
    price: 15000,
    location: 'Marriage Venue',
    duration: 'Full Day',
    includes: ['All Vedic Rituals'],
  },
  {
    id: 'p24',
    title: 'Bhagwat Katha',
    description: 'Spiritual discourse for peace and devotion.',
    image: '/image/subcategoryimg/pooja (1).png',
    price: 21000,
    location: 'Home / Hall',
    duration: '7 Days',
    includes: ['Katha', 'Aarti', 'Prashad'],
  },
  {
    id: 'p25',
    title: 'Ramayan Path',
    description: 'Brings peace and divine blessings.',
    image: '/image/subcategoryimg/pooja (1).png',
    price: 6500,
    location: 'Home / Temple',
    duration: '5 Hours',
    includes: ['Complete Path', 'Aarti'],
  },
  {
    id: '26',
    title: 'Sundarkand Path',
    description: 'Removes fear and negativity.',
    image: '/image/subcategoryimg/pooja (1).png',
    price: 2300,
    location: 'Home / Temple',
    duration: '2 Hours',
    includes: ['Path', 'Aarti', 'Prashad'],
  },
];


const TEMPLES_DATA = [
  {
    id: 'ram-mandir-ayodhya',
    name: 'Shri Ram Janmabhoomi Mandir',
    location: 'Ayodhya, Uttar Pradesh',
    image: 'data:image/jpeg;base64,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',
    description: 'Grand Hindu temple dedicated to Lord Ram, built at the sacred birthplace (Janmabhoomi) of Shri Ram in Ayodhya.',
    deity: 'Lord Ram',
  },
  {
    id: 'kashi-vishwanath',
    name: 'Kashi Vishwanath Temple',
    location: 'Varanasi, Uttar Pradesh',
    image: 'data:image/jpeg;base64,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',
    description: 'Sacred Jyotirlinga Temple on the banks of Ganga.',
    deity: 'Lord Shiva',
  },
  {
    id: 'vindhyachal-devi',
    name: 'Vindhyachal Devi',
    location: 'Vindhyachal, Uttar Pradesh',
    image: 'data:image/jpeg;base64,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',
    description: 'A divine Shakti Peeth where Goddess resides.',
    deity: 'Goddess Vindhyavasini',
  },
  {
    id: 'kalka-mata',
    name: 'Kalka Mata Temple',
    location: 'Delhi',
    image: 'data:image/jpeg;base64,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',
    description: 'Ancient temple dedicated to Goddess Kali.',
    deity: 'Goddess Kali',
  },
  {
    id: 'khatu-shyam',
    name: 'Khatu Shyam Baba',
    location: 'Sikar, Rajasthan',
    image: 'data:image/jpeg;base64,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',
    description: 'The legendary temple of Barbarik.',
    deity: 'Shri Shyam Baba',
  },
  {
    id: 'salasar-balaji',
    name: 'Salasar Balaji Dham',
    location: 'Rajasthan',
    image: 'data:image/jpeg;base64,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',
    description: 'Ancient temple dedicated to Lord Hanuman.',
    deity: 'Lord Hanuman',
  },
  {
    id: 'banke-bihari-temple',
    name: 'Shri Banke Bihari Temple',
    location: 'Vrindavan, Uttar Pradesh',
    image: 'data:image/jpeg;base64,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',
    description: 'One of the most sacred temples of Lord Krishna.',
    deity: 'Lord Krishna',
  },
];

const SERVICES = [
  { id: '1', name: 'Prasad Seva', icon: '⭐', key: 'Online Prasad Seva' },
  { id: '2', name: 'Pooja Booking', icon: '🕉️', key: 'Pooja Booking' },
  { id: '3', name: 'Kundli', icon: '📜', key: 'Kundli' }, 
  { id: '4', name: 'Matching', icon: '💞', key: 'Matching' },
  { id: '5', name: 'Vastu', icon: '🏠', key: 'Vastu' },
  { id: '6', name: 'Palmistry', icon: '🤚', key: 'Palmistry' },
  { id: '7', name: 'Tarot', icon: '🃏', key: 'Tarot' }, 
];

// --- HELPERS ---
const generateDates = () => {
  const next7Days = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    next7Days.push({
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      fullDate: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    });
  }
  return next7Days;
};

// --- SVG ICONS ---
const ArrowBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function PanditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const [currentView, setCurrentView] = useState('services');
  const [selectedService, setSelectedService] = useState('Online Prasad Seva');
  const [selectedPandit, setSelectedPandit] = useState(null);
  
  // States
  const [poojaMode, setPoojaMode] = useState('grid');
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [prasadMode, setPrasadMode] = useState('grid');
  const [selectedTemple, setSelectedTemple] = useState(null);
  
  // Form fields
  const [devoteeName, setDevoteeName] = useState('');
  const [gotra, setGotra] = useState('');
  const [rashi, setRashi] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [prayerWish, setPrayerWish] = useState('');
  const [dates] = useState(generateDates());
  const [offeringDate, setOfferingDate] = useState(dates[0].fullDate);
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const [selectedTime, setSelectedTime] = useState('08:00 AM');

  const addToCart = (item) => {
    dispatch(addToCartRedux({
      ...item,
      id: item.id || `pandit_${Date.now()}`,
      quantity: 1,
      totalPrice: item.price
    }));
  };

  const getFilteredPandits = () => {
    let filtered = PANDITS;
    if (selectedService && selectedService !== 'Pooja Booking' && selectedService !== 'Online Prasad Seva') {
      filtered = filtered.filter((pandit) =>
        pandit.specialization.toLowerCase().includes(selectedService.toLowerCase()) ||
        pandit.expertise.some((exp) => exp.toLowerCase().includes(selectedService.toLowerCase()))
      );
    }
    return filtered;
  };

  // --- RENDERS ---

  const handleServiceClick = (item, type = "Pooja") => {
    const imageUrl = item.image || "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=800";
    const params = new URLSearchParams({
      title: item.title || item.name,
      price: item.price,
      description: item.description || "",
      category: type,
      image: imageUrl,
    });
    router.push(`/pages/ServiceDetail?${params.toString()}`);
  };

  const renderPoojaGrid = () => (
    <div className="flex flex-col gap-4 p-2 sm:p-4 md:p-8 pb-24">
      <h2 className="text-lg md:text-2xl font-bold text-gray-800">Select Pooja</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
        {POOJAS.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <img 
              src={item.image} 
              className="h-24 sm:h-28 md:h-40 w-full object-contain cursor-pointer hover:opacity-90 transition-opacity bg-gray-50" 
              alt={item.title} 
              onClick={() => handleServiceClick(item, "Pooja")}
            />
            <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
              <h3 className="text-[11px] sm:text-sm md:text-base font-bold text-gray-800 line-clamp-1">{item.title}</h3>
              <p className="text-[#1898A5] font-bold text-xs sm:text-sm md:text-base mt-1">₹{item.price}</p>
              <button 
                onClick={() => handleServiceClick(item, "Pooja")}
                className="mt-2 md:mt-4 w-full py-1.5 md:py-2.5 bg-blue-50 text-[#1898A5] rounded-lg text-[10px] sm:text-xs md:text-sm font-bold border border-blue-100 hover:bg-[#1898A5] hover:text-white transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPoojaDetail = () => (
    <div className="flex flex-col p-4 md:p-10 pb-24 h-full overflow-y-auto max-w-6xl mx-auto">
      <button onClick={() => setPoojaMode('grid')} className="flex items-center gap-1 text-[#1898A5] mb-6 md:mb-10 font-medium hover:underline">
        <ArrowBack /> <span className="text-sm md:text-base">Back to List</span>
      </button>
      
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="w-full md:w-1/2">
          <img src={selectedPooja?.image} className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg" alt="" />
        </div>
        
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800">{selectedPooja?.title}</h2>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl md:text-3xl font-black text-[#1898A5]">₹{selectedPooja?.price}</span>
            <span className="text-sm md:text-base text-gray-500">📍 {selectedPooja?.location}</span>
          </div>
          
          <h4 className="font-bold text-gray-800 mt-8 mb-4 md:text-lg">Select Date</h4>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((d, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedDate(d.fullDate)}
                className={`flex flex-col items-center min-w-[70px] md:min-w-[80px] p-4 rounded-xl border transition-all ${selectedDate === d.fullDate ? 'bg-[#1898A5] border-[#1898A5] text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:border-[#1898A5]'}`}
              >
                <span className="text-[10px] md:text-xs uppercase font-bold">{d.day}</span>
                <span className="text-lg md:text-xl font-black">{d.date}</span>
              </button>
            ))}
          </div>

          <h4 className="font-bold text-gray-800 mt-8 mb-3 md:text-lg">Description</h4>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">{selectedPooja?.description}</p>
          
          <button 
            onClick={() => {
              addToCart({ ...selectedPooja, date: selectedDate, category: 'Pooja' });
              alert('Added to cart!');
            }}
            className="mt-10 w-full py-4 md:py-5 bg-[#1898A5] text-white rounded-2xl font-bold text-lg md:text-xl shadow-lg active:scale-[0.98] transition-transform hover:bg-[#147F8A]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrasadGrid = () => (
    <div className="flex flex-col gap-4 p-2 sm:p-4 md:p-8 pb-24">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg md:text-3xl font-black italic tracking-tighter text-gray-900 uppercase">Select Sacred Destination</h2>
        <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">Select a temple to offer Prasad</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
        {TEMPLES_DATA.map((item) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            key={item.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300"
          >
            <div 
              onClick={() => { setSelectedTemple(item); setPrasadMode('form'); }}
              className="relative h-24 sm:h-32 md:h-48 w-full overflow-hidden cursor-pointer bg-gray-50"
            >
              <img 
                src={item.image} 
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700" 
                alt={item.name} 
              />
            </div>

            <div className="p-2 sm:p-3 md:p-5 flex flex-col flex-1">
              <h3 className="text-[11px] sm:text-sm md:text-base font-black text-gray-800 leading-tight mb-1 sm:mb-2 line-clamp-2 min-h-[32px] md:min-h-[48px]">{item.name}</h3>
              
              <div className="flex items-center gap-1 text-[#1898A5] mb-2 sm:mb-3">
                <MapPin size={10} className="fill-[#1898A5]/10 md:size-4" />
                <span className="text-[10px] md:text-xs font-bold">{item.location.split(',')[0]}</span>
              </div>
              <p className='mb-2 text-[11px] sm:text-sm md:text-base' ><b>Price -</b> ₹1100</p>
              <button 
                onClick={() => { setSelectedTemple(item); setPrasadMode('form'); }}
                className="w-full py-2 md:py-3.5 bg-[#1898A5] text-white rounded-lg text-[10px] md:text-xs font-bold transition-all active:scale-95 hover:bg-[#147F8A]"
              >
                Select Temple
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPrasadForm = () => (
    <div className="flex flex-col p-4 md:p-10 pb-24 h-full overflow-y-auto bg-white max-w-5xl mx-auto">
      <button 
        onClick={() => setPrasadMode('grid')} 
        className="flex items-center gap-2 text-[#1898A5] mb-6 md:mb-10 font-bold hover:underline"
      >
        <ArrowBack /> <span className="text-sm md:text-base">Back to Temples</span>
      </button>
      
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-12">{selectedTemple?.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
        <div>
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Devotee Full Name *</label>
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1898A5]/20 transition-all"
            value={devoteeName} onChange={(e) => setDevoteeName(e.target.value)} placeholder="Name for Sankalp"
          />
        </div>

        <div>
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Gotra (Optional)</label>
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1898A5]/20 transition-all"
            value={gotra} onChange={(e) => setGotra(e.target.value)} placeholder="Your Gotra"
          />
        </div>

        <div>
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Rashi *</label>
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1898A5]/20 transition-all"
            value={rashi} onChange={(e) => setRashi(e.target.value)} placeholder="Your Rashi"
          />
        </div>

        <div>
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Birth Place *</label>
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1898A5]/20 transition-all"
            value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="City, State"
          />
        </div>

        <div>
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Mobile Number *</label>
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1898A5]/20 transition-all"
            value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile"
          />
        </div>

        <div>
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Delivery Address *</label>
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#1898A5]/20 transition-all"
            value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address to deliver Prasad"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Select Offering Date *</label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((d, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(d.fullDate)}
                className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  selectedDate === d.fullDate 
                    ? 'bg-[#1898A5] text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-[#1898A5]'
                }`}
              >
                <span className="text-[10px] md:text-xs font-bold">{d.day}</span>
                <span className="text-xl md:text-2xl font-black">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-[13px] md:text-sm font-bold text-gray-700 mb-2 block">Prayer/Wish</label>
          <textarea 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm md:text-base h-32 md:h-48 focus:outline-none focus:ring-2 focus:ring-[#1898A5]/20 transition-all"
            value={prayerWish} onChange={(e) => setPrayerWish(e.target.value)}
            placeholder="Write your prayer or wish here..."
          />
        </div>
        
        <div className="md:col-span-2">
          <button 
            onClick={() => {
              if (!devoteeName || !address || !rashi || !birthPlace || !mobile) return alert('Please fill all mandatory fields');
              addToCart({ 
                name: `Prasad - ${selectedTemple.name}`, 
                price: 1101, 
                devotee: devoteeName, 
                date: selectedDate,
                prayerWish: prayerWish,
                category: 'Prasad' 
              });
              alert('Added to Cart!');
              setPrasadMode('grid');
            }}
            className="w-full py-5 md:py-6 bg-[#1898A5] text-white rounded-2xl font-black text-lg md:text-2xl shadow-xl mt-4 md:mt-8 active:scale-95 transition-all hover:bg-[#147F8A]"
          >
            Book Prasad Seva
          </button>
        </div>
      </div>
    </div>
  );

  const renderPanditList = () => (
    <div className="flex flex-col gap-4 p-2 sm:p-4 md:p-8 pb-24">
      <h2 className="text-lg md:text-2xl font-bold text-gray-800">{selectedService} Experts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {getFilteredPandits().map((p) => (
          <div 
            key={p.id} 
            onClick={() => handleServiceClick(p, "Pandit")}
            className="bg-white p-2 sm:p-3 md:p-5 rounded-xl border border-gray-100 shadow-sm flex gap-3 sm:gap-4 cursor-pointer active:scale-[0.98] hover:shadow-md transition-all"
          >
            <img src={p.image} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg object-contain bg-gray-50" alt="" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-xs sm:text-sm md:text-lg">{p.name}</h3>
              <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium">{p.specialization}</p>
              <div className="flex items-center gap-2 mt-2 md:mt-4">
                <div className="flex items-center gap-1 px-1 py-0.5 bg-yellow-50 rounded-lg">
                  <StarIcon />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-yellow-700">{p.rating}</span>
                </div>
                <span className="text-xs sm:text-sm md:text-base font-black text-[#1898A5]">₹{p.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComingSoon = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/30">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-10 md:p-16 rounded-3xl shadow-xl shadow-[#1898A5]/10 border border-[#1898A5]/5 max-w-sm md:max-w-lg w-full"
      >
        <div className="text-6xl md:text-8xl mb-6">✨</div>
        <h2 className="text-2xl md:text-4xl font-black text-gray-800 uppercase tracking-tight mb-3">{selectedService}</h2>
        <div className="h-1.5 w-16 md:w-24 bg-[#1898A5] rounded-full mx-auto mb-6"></div>
        <p className="text-gray-500 md:text-lg font-medium leading-relaxed mb-8">
          We are currently working on bringing the best {selectedService} experts and services to you.
        </p>
        <div className="bg-[#1898A5]/5 border border-[#1898A5]/10 rounded-2xl p-4">
          <span className="text-[#1898A5] font-black text-sm md:text-base uppercase tracking-widest">Coming Soon</span>
        </div>
      </motion.div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-white w-full relative flex flex-col font-sans">
      <div className="relative h-72 md:h-96 bg-[#1898A5] overflow-hidden">
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <button onClick={() => setCurrentView('services')} className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40 transition-colors">
            <ArrowBack />
          </button>
        </div>
        <img src={selectedPandit?.image} className="w-full h-full object-cover opacity-80" alt="" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-[#1898A5] to-transparent">
          <h2 className="text-2xl md:text-4xl font-black text-white">{selectedPandit?.name}</h2>
          <p className="text-blue-100 text-sm md:text-lg opacity-90">{selectedPandit?.specialization}</p>
        </div>
      </div>
      
      <div className="p-6 md:p-10 -mt-6 bg-white rounded-t-3xl flex-1 shadow-2xl max-w-5xl mx-auto w-full">
        <h3 className="font-bold text-gray-800 mb-3 md:text-xl">Expertise</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {selectedPandit?.expertise.map((e, i) => (
            <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 text-[#1898A5] text-xs md:text-sm font-bold rounded-lg border border-blue-100 uppercase tracking-tight">
              {e}
            </span>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-100 mb-8">
          <h4 className="font-bold text-gray-800 text-sm md:text-base mb-1">Languages</h4>
          <p className="text-gray-500 text-xs md:text-sm">{selectedPandit?.languages.join(', ')}</p>
        </div>

        <button 
          onClick={() => alert('Booking request sent!')}
          className="w-full py-4 md:py-5 bg-[#1898A5] text-white rounded-2xl font-black text-lg md:text-xl shadow-xl shadow-blue-100 active:scale-95 transition-all hover:bg-[#147F8A]"
        >
          Connect Now - ₹{selectedPandit?.price}
        </button>
      </div>
    </div>
  );

  // --- MAIN LAYOUT ---

  if (currentView === 'profile') return renderProfile();

  return (
    <div className="min-h-screen bg-white w-full relative flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-gray-50 bg-white sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowBack />
        </button>
        <h1 className="text-lg md:text-2xl font-black text-gray-800 tracking-tight uppercase">
          {selectedService === 'Online Prasad Seva' ? 'Our Services' : 'Pandit Ji Seva'}
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        {!(selectedService === 'Online Prasad Seva' && prasadMode === 'form') && (
          <div className="w-20 sm:w-24 md:w-32 border-r border-gray-50 overflow-y-auto bg-white scrollbar-hide">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedService(s.key);
                  if (s.key === 'Pooja Booking') setPoojaMode('grid');
                  if (s.key === 'Online Prasad Seva') setPrasadMode('grid');
                }}
                className={`w-full py-4 md:py-8 flex flex-col items-center gap-1 md:gap-2 border-b border-gray-50 transition-all ${selectedService === s.key ? 'bg-blue-50 border-r-4 border-[#1898A5]' : 'hover:bg-gray-50'}`}
              >
                <span className="text-xl md:text-3xl">{s.icon}</span>
                <span className={`text-[8px] sm:text-[9px] md:text-[11px] font-black text-center px-1 uppercase leading-tight ${selectedService === s.key ? 'text-[#1898A5]' : 'text-gray-400'}`}>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="flex-1 bg-gray-50/30 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {selectedService === 'Pooja Booking' ? (poojaMode === 'grid' ? renderPoojaGrid() : renderPoojaDetail()) : 
             selectedService === 'Online Prasad Seva' ? (prasadMode === 'grid' ? renderPrasadGrid() : renderPrasadForm()) : 
             ['Kundli', 'Matching', 'Vastu', 'Palmistry', 'Tarot'].includes(selectedService) ? renderComingSoon() :
             renderPanditList()}
          </div>
        </div>
      </div>

      {/* FLOATING CART SUMMARY */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 z-[100]">
          <button 
            onClick={() => router.push('/cart')}
            className="w-full bg-[#1898A5] text-white rounded-xl py-3 md:py-4 px-4 md:px-6 flex items-center justify-between shadow-2xl shadow-blue-200 animate-in fade-in slide-in-from-bottom-4 hover:scale-[1.02] transition-transform"
          >
            <div className="flex flex-col items-start">
              <span className="text-[9px] md:text-xs font-black uppercase opacity-70 tracking-widest">{cart.length} ITEMS</span>
              <span className="text-base md:text-xl font-black tracking-tight">₹{cartTotal}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs md:text-base tracking-widest uppercase">VIEW CART</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
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
