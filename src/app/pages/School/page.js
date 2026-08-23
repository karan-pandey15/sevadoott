"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '@/redux/cartSlice';

// --- DUMMY DATA ---
const SCHOOLS = [
  { 
    id: '1', 
    name: 'ST Boston EdTech', 
    address: 'Khasua Bhaluwan, Tehsil Bansgaon, Kauriram, Gorakhpur',
    image: '/image/stschool1.jpeg',
    gallery: [
      '/image/stschool1.jpeg',
      '/image/stschool2.jpeg',
      '/image/stschool3.jpeg'
    ]
  },
];

const CATEGORIES = [
  { id: 'boys', name: "Uniform For Boy's", icon: 'shirt' },
  { id: 'girls', name: 'Uniform For Girls', icon: 'woman' },
  { id: 'books', name: 'Books', icon: 'book' },
  { id: 'stationery', name: 'Stationery', icon: 'pencil' },
  { id: 'bags', name: 'School Bags', icon: 'bag' },
  { id: 'shoes', name: 'Shoes', icon: 'footsteps' },
];

const DUMMY_PRODUCTS = {
  boys: [
    { id: 'b1', name: 'Half Sleeve Shirt', price: 450, mrp: 600, description: 'Comfortable cotton half sleeve shirt for daily school wear.', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Sky Blue'], category: 'boys' },
    { id: 'b2', name: 'School Trousers', price: 850, mrp: 1100, description: 'Durable and formal school trousers with adjustable waist.', sizes: ['28', '30', '32', '34'], colors: ['Grey', 'Navy Blue'], category: 'boys' },
    { id: 'b3', name: 'School Blazer', price: 2200, mrp: 2800, description: 'Premium quality wool-blend blazer for winters.', sizes: ['36', '38', '40'], colors: ['Navy Blue'], category: 'boys' },
  ],
  girls: [
    { id: 'g1', name: 'School Skirt', price: 550, mrp: 750, description: 'Pleated school skirt with comfortable elastic waist.', sizes: ['S', 'M', 'L'], colors: ['Grey', 'Blue Plaid'], category: 'girls' },
    { id: 'g2', name: 'White Blouse', price: 400, mrp: 550, description: 'Classic white cotton blouse with sharp collars.', sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], category: 'girls' },
    { id: 'g3', name: 'Winter Tunic', price: 950, mrp: 1300, description: 'Warm tunic for primary school girls.', sizes: ['24', '26', '28'], colors: ['Grey'], category: 'girls' },
  ],
  books: [
    { id: 'bk1', name: 'Mathematics Grade 10', price: 350, mrp: 400, description: 'Latest edition mathematics textbook following NCERT guidelines.', category: 'books' },
    { id: 'bk2', name: 'English Literature', price: 280, mrp: 320, description: 'A collection of classic stories and poems for grade 8.', category: 'books' },
    { id: 'bk3', name: 'Physics Part I', price: 420, mrp: 500, description: 'Comprehensive physics guide for senior secondary students.', category: 'books' },
  ],
  stationery: [
    { id: 's1', name: 'Geometry Box', price: 150, mrp: 200, description: 'Complete geometry kit with compass, divider, and rulers.', category: 'stationery' },
    { id: 's2', name: 'Notebook Pack (5)', price: 300, mrp: 450, description: 'Premium quality 200-page ruled notebooks.', category: 'stationery' },
    { id: 's3', name: 'Artist Color Set', price: 500, mrp: 650, description: 'Pack of 24 vibrant water colors for art projects.', category: 'stationery' },
  ],
  bags: [
    { id: 'bg1', name: 'Ergonomic Backpack', price: 1200, mrp: 1800, description: 'Waterproof school bag with multiple compartments and padded straps.', colors: ['Blue', 'Red', 'Black'], category: 'bags' },
    { id: 'bg2', name: 'Trolley School Bag', price: 2500, mrp: 3200, description: 'Heavy-duty trolley bag for students carrying heavy books.', colors: ['Purple', 'Green'], category: 'bags' },
  ],
  shoes: [
    { id: 'sh1', name: 'Black Formal Shoes', price: 800, mrp: 1200, description: 'Polished black leather shoes for daily school uniform.', shoeSizes: ['5', '6', '7', '8', '9', '10'], category: 'shoes' },
    { id: 'sh2', name: 'White Sports Shoes', price: 950, mrp: 1400, description: 'Lightweight canvas shoes for PT and sports activities.', shoeSizes: ['4', '5', '6', '7', '8'], category: 'shoes' },
  ],
};

// --- ICON COMPONENTS (SVGs) ---
const Icon = ({ name, className = "w-6 h-6", color = "currentColor" }) => {
  const icons = {
    'arrow-back': <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />,
    'notifications': <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
    'search': <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
    'location': <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>,
    'image': <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
    'shirt': <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />, // Simplified
    'woman': <><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></>,
    'book': <><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></>,
    'pencil': <><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></>,
    'bag': <><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></>,
    'footsteps': <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-5.744-4.056 4.125 4.125 0 01-8.004 0 4.125 4.125 0 00-5.744 4.056 9.337 9.337 0 004.121.952 9.38 9.38 0 002.625-.372" />,
    'cart': <><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 100 6 3 3 0 000-6zm12.75 0a3 3 0 100 6 3 3 0 000-6zM9.172 9h10.242c.41 0 .748.33.784.739l.633 7.19a.75.75 0 01-.747.816H7.306a.75.75 0 01-.747-.816l.633-7.19a.75.75 0 01.784-.739z" /></>,
    'add': <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    'remove': <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className={className}>
      {icons[name]}
    </svg>
  );
};

export default function SchoolPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxCartItems = useSelector((state) => state.cart.items);
  const reduxTotalAmount = useSelector((state) => state.cart.totalAmount);

  // --- STATE ---
  const [view, setView] = useState('schoolList'); // schoolList, schoolDetail, categoryProducts, productDetail
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedShoeSize, setSelectedShoeSize] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  // --- LOGIC ---
  const filteredSchools = SCHOOLS.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    if (view === 'productDetail') {
      setView('categoryProducts');
      setSelectedProduct(null);
      setSelectedSize(null);
      setSelectedColor(null);
      setSelectedShoeSize(null);
      setStudentName('');
      setStudentClass('');
    } else if (view === 'categoryProducts') {
      setView('schoolDetail');
      setSelectedCategory(null);
    } else if (view === 'schoolDetail') {
      setView('schoolList');
      setSelectedSchool(null);
    } else {
      router.back();
    }
  };

  const getItemQuantity = (productId) => {
    const item = reduxCartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product) => {
    if ((product.category === 'boys' || product.category === 'girls' || product.category === 'shoes') && (!studentName || !studentClass)) {
      alert('Please enter student name and class');
      return;
    }
    const newItem = {
      id: product.id + (selectedSize || '') + (selectedColor || '') + (selectedShoeSize || ''),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: null,
      quantity: 1,
      selectedSize,
      selectedColor,
      selectedShoeSize,
      studentName,
      studentClass,
      category: product.category,
    };
    dispatch(addToCart(newItem));
  };

  const updateQuantity = (productId, delta) => {
    const item = reduxCartItems.find(i => i.productId === productId);
    if (!item) return;

    if (delta > 0) {
      dispatch(addToCart(item));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const cartCount = reduxCartItems.length;
  const cartTotal = reduxTotalAmount;

  // --- VIEWS ---

  const Header = ({ title }) => (
    <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <Icon name="arrow-back" className="w-6 h-6" color="#1e293b" />
      </button>
      <h1 className="text-lg font-bold text-slate-800">{title}</h1>
      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <Icon name="notifications" className="w-6 h-6" color="#1e293b" />
      </button>
    </div>
  );

  const CartFloatingButton = () => {
    if (cartCount === 0) return null;
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <button 
          onClick={() => router.push('/cart')}
          className="w-full bg-blue-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-xl shadow-blue-200 animate-in fade-in slide-in-from-bottom-4 active:scale-95 transition-all"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{cartCount} ITEMS</span>
            <span className="text-lg font-bold">₹{cartTotal}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase italic">View Cart</span>
            <Icon name="cart" className="w-5 h-5" color="white" />
          </div>
        </button>
      </div>
    );
  };

  // --- RENDERING ---

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative flex flex-col font-sans">
      
      {/* VIEW: SCHOOL LIST */}
      {view === 'schoolList' && (
        <>
          <Header title="Find Your School" />
          <div className="p-4 space-y-4 flex-1">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Icon name="search" className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by school name or address..."
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* List */}
            <div className="space-y-6 pb-24">
              {filteredSchools.map((school) => (
                <div 
                  key={school.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => {
                    setSelectedSchool(school);
                    setView('schoolDetail');
                  }}
                >
                  <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                    {school.image ? (
                      <img 
                        src={school.image} 
                        alt={school.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="image" className="w-12 h-12 text-slate-300" />
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm">
                      <Icon name="location" className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{school.name}</h2>
                    <div className="flex items-start gap-2 mt-2">
                      <Icon name="location" className="w-4 h-4 text-slate-400 mt-0.5" />
                      <p className="text-sm text-slate-500 leading-snug">{school.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* VIEW: SCHOOL DETAIL */}
      {view === 'schoolDetail' && (
        <>
          <Header title="School Details" />
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="px-4 py-4">
              {/* Gallery Scroll */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {selectedSchool?.gallery ? (
                  selectedSchool.gallery.map((img, index) => (
                    <div 
                      key={index} 
                      className="relative h-56 min-w-[85%] rounded-3xl overflow-hidden bg-slate-100 snap-center shadow-md border border-slate-100"
                    >
                      <img 
                        src={img} 
                        alt={`${selectedSchool.name} ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                        <h2 className="text-xl font-extrabold text-white">{selectedSchool?.name}</h2>
                        <p className="text-slate-200 text-xs mt-1">{selectedSchool?.address}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative h-56 w-full rounded-3xl overflow-hidden bg-slate-100 mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Icon name="image" className="w-16 h-16 text-slate-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <h2 className="text-2xl font-extrabold text-white">{selectedSchool?.name}</h2>
                      <p className="text-slate-200 text-sm mt-1">{selectedSchool?.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-slate-800 mb-4">Shop By Category</h3>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setView('categoryProducts');
                    }}
                    className="flex flex-col items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                      <Icon name={cat.icon} className="w-7 h-7 text-blue-600" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 text-center uppercase tracking-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW: CATEGORY PRODUCTS */}
      {view === 'categoryProducts' && (
        <>
          <Header title={selectedCategory?.name} />
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-slate-800">{selectedCategory?.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{(DUMMY_PRODUCTS[selectedCategory?.id] || []).length} items available</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(DUMMY_PRODUCTS[selectedCategory?.id] || []).map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(item);
                    setView('productDetail');
                  }}
                >
                  <div className="aspect-square bg-slate-50 flex items-center justify-center">
                    <Icon name="image" className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-extrabold text-blue-600">₹{item.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                    </div>
                    <button className="mt-3 w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* VIEW: PRODUCT DETAIL */}
      {view === 'productDetail' && selectedProduct && (
        <>
          <Header title="Product Details" />
          <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
            <div className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center mb-6 relative">
              <Icon name="image" className="w-24 h-24 text-slate-200" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-800">{selectedProduct.name}</h2>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-blue-600">₹{selectedProduct.price}</span>
                <span className="text-xl text-slate-400 line-through">₹{selectedProduct.mrp}</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  {Math.round((1 - selectedProduct.price / selectedProduct.mrp) * 100)}% OFF
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{selectedProduct.description}</p>
            </div>

            {/* Options */}
            <div className="mt-8 space-y-6">
              {selectedProduct.sizes && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Select Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(s => (
                      <button 
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-6 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${
                          selectedSize === s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.colors && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Select Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map(c => (
                      <button 
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-5 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${
                          selectedColor === c ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-500'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.shoeSizes && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Select Shoe Number</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.shoeSizes.map(s => (
                      <button 
                        key={s}
                        onClick={() => setSelectedShoeSize(s)}
                        className={`px-6 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${
                          selectedShoeSize === s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Details for Uniforms and Shoes */}
              {(selectedProduct.category === 'boys' || selectedProduct.category === 'girls' || selectedProduct.category === 'shoes') && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800">Student Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Student Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter Student Name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Class / Section</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5th - B"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="mt-12">
              {getItemQuantity(selectedProduct.id) > 0 ? (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-2xl">
                  <button 
                    onClick={() => updateQuantity(selectedProduct.id, -1)}
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl active:scale-95 transition-transform"
                  >
                    <Icon name="remove" className="w-6 h-6" color="white" />
                  </button>
                  <span className="text-2xl font-black text-slate-800">{getItemQuantity(selectedProduct.id)}</span>
                  <button 
                    onClick={() => updateQuantity(selectedProduct.id, 1)}
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl active:scale-95 transition-transform"
                  >
                    <Icon name="add" className="w-6 h-6" color="white" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all font-black text-lg active:scale-[0.98]"
                >
                  <Icon name="cart" className="w-6 h-6" color="white" />
                  ADD TO CART
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <CartFloatingButton />
    </div>
  );
}
