"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  Timer,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';

const GymDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // 1. Get initial data from URL params
  const title = searchParams.get('title') || 'Gym Membership';
  const rawImage = searchParams.get('image') || '';
  const basePrice = Number(searchParams.get('price') || 0);
  const description = searchParams.get('description') || '';
  const hours = searchParams.get('hours') || '6 AM - 10 PM';
  const gymId = searchParams.get('id') || `gym_${Date.now()}`;
  const isAC = searchParams.get('isAC') === 'true';

  // 2. State Management
  const [gymImage, setGymImage] = useState('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800');
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Morning');
  const [selectedTime, setSelectedTime] = useState('07:00 AM');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [duration, setDuration] = useState(1);
  const [planType, setPlanType] = useState('Monthly');
  const [dates, setDates] = useState([]);
  
  const monthsList = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const timeOptions = {
    Morning: ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'],
    Evening: ['04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM']
  };

  // 3. Image & Initial Setup
  useEffect(() => {
    if (rawImage === "base64" && gymId) {
      const storedImg = sessionStorage.getItem(`gym_img_${gymId}`);
      if (storedImg) setGymImage(storedImg);
    } else if (rawImage && rawImage !== "base64") {
      setGymImage(rawImage);
    }

    const today = new Date();
    setSelectedMonth(monthsList[today.getMonth()]);

    const nextDates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextDates.push({
        id: i,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        dateNum: date.getDate(),
        monthName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()],
        fullDate: date.toDateString()
      });
    }
    setDates(nextDates);
  }, [rawImage, gymId]);

  // Handle slot change
  useEffect(() => {
    setSelectedTime(timeOptions[selectedTimeSlot][1]);
  }, [selectedTimeSlot]);

  // 4. Calculations
  const totalPrice = planType === 'Yearly' ? basePrice * 12 * 0.8 : basePrice * duration;
  const displayDuration = planType === 'Yearly' ? '12 Months' : `${duration} ${duration === 1 ? 'Month' : 'Months'}`;

  const handleBooking = () => {
    const startDate = dates[selectedDate]?.fullDate;
    
    dispatch(addToCart({
      id: `${gymId}_${selectedMonth}_${selectedTimeSlot}_${planType}_${duration}`,
      name: `${title} (${isAC ? 'AC' : 'Non-AC'}) (${displayDuration})`,
      image: gymImage,
      price: basePrice,
      totalPrice: totalPrice,
      quantity: 1,
      category: 'Gym',
      startDate,
      startTime: selectedTime,
      startMonth: selectedMonth,
      timeSlot: selectedTimeSlot,
      planType,
      monthCount: planType === 'Yearly' ? 12 : duration,
      isGym: true,
      isAC: isAC
    }));
    router.push('/cart');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-sans pb-32">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2">
          {/* <Dumbbell size={20} className="text-violet-600" /> */}
          <h1 className="text-sm font-black uppercase tracking-widest">Gym MemberShip</h1>
        </div>
        <div className="w-10" />
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row pt-16">
        {/* ── IMAGE SECTION ── */}
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 relative overflow-hidden">
          <img src={gymImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-8 right-8 text-white">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-violet-600 text-[10px] font-black uppercase rounded inline-block">Verified Facility</span>
              <span className={`px-3 py-1 text-[10px] font-black uppercase rounded inline-block ${isAC ? 'bg-blue-600' : 'bg-orange-600'}`}>
                {isAC ? 'AC' : 'Non AC'}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-none uppercase tracking-tighter italic">{title}</h2>
          </div>
        </div>

        {/* ── CONTENT SECTION ── */}
        <div className="w-full lg:w-1/2 p-6 lg:p-12 space-y-10">
          <section className="grid grid-cols-3 gap-3">
            <FacilityBadge icon={Timer} label="Slots" value="Flexible" />
            <FacilityBadge icon={ShieldCheck} label="Secure" value="Certified" />
            <FacilityBadge icon={Zap} label="Trainer" value="Available" />
          </section>

          {/* Plan Type Selection */}
          <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Choose Plan Type</h3>
            <div className="flex gap-4">
              {['Monthly', 'Yearly'].map((type) => (
                <button
                  key={type}
                  onClick={() => { setPlanType(type); if(type === 'Yearly') setDuration(12); }}
                  className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${
                    planType === type ? 'bg-violet-600 border-violet-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500'
                  }`}
                >
                  {type} {type === 'Yearly' && <span className="block text-[9px] opacity-80">Save 20%</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Month Duration Selection (only for Monthly) */}
          {planType === 'Monthly' && (
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Duration (Months)</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    className={`min-w-[50px] h-[50px] rounded-xl border-2 font-black transition-all ${
                      duration === m ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Start Month Selection */}
          <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Start Month</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {monthsList.map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-6 py-2 rounded-full border-2 text-xs font-bold whitespace-nowrap transition-all ${
                    selectedMonth === month ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-500'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </section>

          {/* Joining Date Selection */}
          <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Joining Date</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {dates.map((date) => (
                <button
                  key={date.id}
                  onClick={() => setSelectedDate(date.id)}
                  className={`flex flex-col items-center min-w-[65px] py-4 rounded-2xl border-2 transition-all ${
                    selectedDate === date.id ? 'bg-violet-600 border-violet-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase mb-1">{date.dayName}</span>
                  <span className="text-xl font-black">{date.dateNum}</span>
                  <span className="text-[8px] font-bold uppercase">{date.monthName}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Time Slot Selection */}
          <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Preferred Slot & Time</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['Morning', 'Evening'].map((slot) => (
                <button 
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`flex items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all ${
                    selectedTimeSlot === slot ? 'bg-violet-600 border-violet-600 text-white shadow-lg' : 'bg-white border-gray-100'
                  }`}
                >
                  {slot === 'Morning' ? <Sun size={20}/> : <Moon size={20}/>}
                  <span className="font-bold">{slot}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {timeOptions[selectedTimeSlot].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black whitespace-nowrap transition-all ${
                    selectedTime === time ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-400'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </section>

          {/* Summary Card */}
          <section className="bg-violet-50 p-8 rounded-[40px] border border-violet-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{planType} Subscription</p>
                <p className="text-4xl font-black text-gray-900">₹{totalPrice.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1">For {displayDuration}</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md"><Dumbbell className="text-violet-600" /></div>
            </div>
            <ul className="space-y-3 text-xs font-bold text-gray-700">
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-500" /> Starts: {dates[selectedDate]?.dateNum} {selectedMonth}</li>
              <li className="flex items-center gap-3"><Clock size={16} className="text-violet-500" /> Time: {selectedTime} ({selectedTimeSlot})</li>
              <li className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${isAC ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {isAC ? 'AC' : 'Non-AC'} Facility
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 z-[100]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pay</span>
            <span className="text-xl font-black text-gray-900">₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <button 
            onClick={handleBooking}
            className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-violet-600 uppercase italic"
          >
            Confirm Booking <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FacilityBadge = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-4 rounded-[24px] border border-gray-100 flex flex-col items-center shadow-sm">
    <Icon size={18} className="text-violet-600 mb-1.5" />
    <span className="text-[10px] font-black text-gray-900 truncate text-center w-full">{value}</span>
    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
  </div>
);

export default GymDetails;
