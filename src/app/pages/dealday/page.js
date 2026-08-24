"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '@/redux/cartSlice';
import { apiUrl } from '@/lib/api';

const PRIMARY      = "#1898A5";
const PRIMARY_DARK = "#147F8A";
const PRIMARY_MID  = "#147F8A";
const ACCENT       = "#FF6B00";
const ACCENT_LIGHT = "#ff8c3a";

export default function DealOfTheDayPage() {
  const router     = useRouter();
  const dispatch   = useDispatch();
  const cartItems  = useSelector((state) => state.cart.items);
  const cartTotal  = useSelector((state) => state.cart.totalAmount);
  const cartCount  = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [loading,          setLoading]          = useState(true);
  const [products,         setProducts]         = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeLeft,         setTimeLeft]         = useState({ h: 5, m: 59, s: 59 });
  const timerRef = useRef(null);

  /* ── countdown ── */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  /* ── fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(apiUrl('/products/category/dealday'));
        const json = await res.json();
        if (json.ok) setProducts(json.products);
      } catch (e) {
        console.error('API Error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── cart helpers ── */
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id:    product._id,
      name:  product.name,
      price: product.price.selling_price,
      image: product.images?.[0]?.url,
    }));
  };

  const updateQuantity = (productId, delta) => {
    if (delta > 0) {
      const item = products.find(p => p._id === productId);
      if (item) dispatch(addToCart({ id: item._id, name: item.name, price: item.price.selling_price, image: item.images?.[0]?.url }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const getQuantity = (productId) =>
    (cartItems.find(i => i.id === productId)?.quantity) || 0;

  /* ── navigation ── */
  const navigateToDetail = (product) => {
    const params = new URLSearchParams({
      id:           product._id,
      name:         product.name,
      price:        product.price.selling_price,
      mrp:          product.price.mrp,
      description:  product.description,
      category:     product.category,
      sub_category: product.sub_category,
      image:        product.images?.[0]?.url || '',
      images:       JSON.stringify(product.images || []),
      unit:         product.quantity_info.unit,
      size:         product.quantity_info.size,
    });
    router.push(`/pages/ecommerce/details?${params.toString()}`);
  };

  /* ── derived data ── */
  const categories   = ['All', ...new Set(products.map(p => p.sub_category))];
  const filtered     = selectedCategory === 'All'
    ? products
    : products.filter(p => p.sub_category === selectedCategory);

  const getDiscount  = (mrp, sp) => (mrp > sp ? Math.round(((mrp - sp) / mrp) * 100) : 0);
  const pad          = (n) => String(n).padStart(2, '0');

  /* ═══════════════════════════════════════
     LOADING
  ═══════════════════════════════════════ */
  if (loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:`linear-gradient(160deg,${PRIMARY} 0%,${PRIMARY_DARK} 100%)` }}>
        <div style={{ width:52, height:52, border:'4px solid rgba(255,255,255,0.2)', borderTop:'4px solid #fff', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
        <p style={{ color:'rgba(255,255,255,.7)', marginTop:16, fontWeight:600 }}>Loading deals…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     PAGE
  ═══════════════════════════════════════ */
  return (
    <div style={{ background:'#EEF3FB', minHeight:'100vh', paddingBottom: cartCount > 0 ? 110 : 36 }}>

      {/* ══════════════ HEADER ══════════════ */}
      <header style={{ background:`linear-gradient(135deg,${PRIMARY} 0%,${PRIMARY_DARK} 100%)`, position:'sticky', top:0, zIndex:50, boxShadow:`0 4px 24px rgba(24,152,165,0.45)` }}>

        {/* top row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px 10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button
              onClick={() => router.back()}
              style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:10, padding:'7px', cursor:'pointer', display:'flex', backdropFilter:'blur(6px)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.4px' }}>Deal of the Day</span>
                <span style={{ background:ACCENT, color:'#fff', fontSize:9, fontWeight:900, padding:'2px 7px', borderRadius:6, textTransform:'uppercase', letterSpacing:.5 }}>LIVE</span>
              </div>
              <p style={{ margin:'2px 0 0', fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:500 }}>Best prices · Limited time only</p>
            </div>
          </div>
          <button style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:10, padding:'7px', cursor:'pointer', display:'flex', backdropFilter:'blur(6px)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        {/* timer strip */}
        <div style={{ background:'rgba(0,0,0,0.22)', padding:'8px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid rgba(255,255,255,0.09)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:15 }}>⏳</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.88)', fontWeight:700 }}>Ends in</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            {[{label:'HRS',val:timeLeft.h},{label:'MIN',val:timeLeft.m},{label:'SEC',val:timeLeft.s}].map((t,i) => (
              <React.Fragment key={i}>
                <div style={{ background:'#fff', borderRadius:8, padding:'4px 9px', textAlign:'center', minWidth:40, boxShadow:'0 2px 10px rgba(0,0,0,0.18)' }}>
                  <div style={{ fontSize:16, fontWeight:900, color:PRIMARY, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{pad(t.val)}</div>
                  <div style={{ fontSize:7, color:'#999', fontWeight:800, letterSpacing:.5, marginTop:1 }}>{t.label}</div>
                </div>
                {i < 2 && <span style={{ color:'rgba(255,255,255,0.65)', fontWeight:900, fontSize:18, lineHeight:1, marginBottom:6 }}>:</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ background:ACCENT, borderRadius:8, padding:'5px 12px' }}>
            <span style={{ fontSize:11, color:'#fff', fontWeight:900 }}>{filtered.length} Deals</span>
          </div>
        </div>
      </header>

      {/* ══════════════ HERO BANNER ══════════════ */}
      <div style={{ margin:'14px 14px 0', borderRadius:20, overflow:'hidden', position:'relative', background:`linear-gradient(120deg,${PRIMARY} 0%,${PRIMARY_MID} 55%,#1898A5 100%)`, padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:`0 8px 28px rgba(24,152,165,0.28)` }}>
        {/* deco circles */}
        {[[{right:-20,top:-30,size:130},{right:50,bottom:-40,size:90},{left:-10,bottom:-20,size:70}]].flat().map((c,i) => (
          <div key={i} style={{ position:'absolute', width:c.size, height:c.size, borderRadius:'50%', background:'rgba(255,255,255,0.07)', ...c }} />
        ))}
        <div style={{ position:'relative', zIndex:1 }}>
          <span style={{ background:ACCENT, color:'#fff', fontSize:10, fontWeight:900, padding:'3px 10px', borderRadius:7, textTransform:'uppercase', letterSpacing:.8 }}>🔥 Today Only</span>
          <p style={{ margin:'8px 0 0', fontSize:26, fontWeight:900, color:'#fff', lineHeight:1.1 }}>
            Up to <span style={{ color:'#FFD60A' }}>70% OFF</span>
          </p>
          <p style={{ margin:'5px 0 0', fontSize:12, color:'rgba(255,255,255,0.72)', fontWeight:500 }}>Exclusive daily deals across top categories</p>
        </div>
        <div style={{ fontSize:58, position:'relative', zIndex:1, filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.22))' }}>🛍️</div>
      </div>

      {/* ══════════════ CATEGORY PILLS ══════════════ */}
      <div style={{ padding:'14px 14px 6px' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
          {categories.map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  flexShrink:0, padding:'7px 18px', borderRadius:24,
                  fontSize:12, fontWeight:800, border:'none', cursor:'pointer',
                  transition:'all .2s',
                  background: active ? PRIMARY : '#fff',
                  color:      active ? '#fff'  : '#555',
                  boxShadow:  active ? `0 4px 14px rgba(24,152,165,0.35)` : '0 1px 5px rgba(0,0,0,0.09)',
                  transform:  active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════ SECTION HEADING ══════════════ */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 16px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:4, height:20, background:PRIMARY, borderRadius:4 }} />
          <span style={{ fontSize:15, fontWeight:900, color:'#1a1a1a' }}>
            {selectedCategory === 'All' ? 'All Deals' : selectedCategory}
          </span>
        </div>
        <span style={{ fontSize:12, color:'#888', fontWeight:600 }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ══════════════ GRID ══════════════ */}
      <div style={{ padding:'0 10px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#aaa' }}>
            <div style={{ fontSize:52 }}>🎁</div>
            <p style={{ fontWeight:700, marginTop:12 }}>No deals in this category right now</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
            {filtered.map(item => {
              const qty      = getQuantity(item._id);
              const discount = getDiscount(item.price.mrp, item.price.selling_price);
              const saved    = item.price.mrp - item.price.selling_price;
              const lowStock = (item.inventory?.stock_quantity ?? 99) < 15;
              const stockPct = Math.min(100, Math.max(8, ((item.inventory?.stock_quantity || 0) / 20) * 100));

              return (
                <div
                  key={item._id}
                  style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column', position:'relative', border:'1px solid rgba(24,152,165,0.09)' }}
                >
                  {/* discount badge */}
                  {discount > 0 && (
                    <div style={{ position:'absolute', top:10, left:10, zIndex:10, background:ACCENT, color:'#fff', fontSize:10, fontWeight:900, padding:'3px 9px', borderRadius:8, boxShadow:`0 2px 8px rgba(255,107,0,0.4)` }}>
                      -{discount}%
                    </div>
                  )}

                  {/* wishlist icon */}
                  <div style={{ position:'absolute', top:10, right:10, zIndex:10, background:'rgba(255,255,255,0.92)', borderRadius:'50%', width:29, height:29, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 5px rgba(0,0,0,0.12)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>

                  {/* image */}
                  <div
                    onClick={() => navigateToDetail(item)}
                    style={{ cursor:'pointer', background:'linear-gradient(145deg,#f6f9ff,#eaf0fb)', padding:'16px 12px', display:'flex', alignItems:'center', justifyContent:'center', aspectRatio:'1/1', overflow:'hidden' }}
                  >
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.name}
                      style={{ width:'100%', height:'100%', objectFit:'contain', transition:'transform .3s' }}
                      onError={e => { e.target.src='/image/placeholder.png'; }}
                    />
                  </div>

                  {/* body */}
                  <div style={{ padding:'10px 12px 14px', flex:1, display:'flex', flexDirection:'column' }}>

                    {/* sub-category tag */}
                    <span style={{ display:'inline-block', alignSelf:'flex-start', fontSize:9, fontWeight:900, color:PRIMARY, textTransform:'uppercase', letterSpacing:.8, background:`rgba(24,152,165,0.09)`, padding:'2px 7px', borderRadius:5, marginBottom:5 }}>
                      {item.sub_category}
                    </span>

                    {/* name */}
                    <p
                      onClick={() => navigateToDetail(item)}
                      style={{ margin:'0 0 3px', fontSize:12, fontWeight:700, color:'#1a1a1a', lineHeight:1.4, cursor:'pointer', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:34 }}
                    >
                      {item.name}
                    </p>

                    {/* size */}
                    <p style={{ margin:'0 0 8px', fontSize:10, color:'#bbb', fontWeight:600 }}>
                      {item.quantity_info.size} {item.quantity_info.unit}
                    </p>

                    {/* price */}
                    <div style={{ marginBottom:8 }}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:7, flexWrap:'wrap' }}>
                        <span style={{ fontSize:19, fontWeight:900, color:'#111', lineHeight:1 }}>₹{item.price.selling_price}</span>
                        {item.price.mrp > item.price.selling_price && (
                          <span style={{ fontSize:11, color:'#ccc', textDecoration:'line-through', fontWeight:600 }}>₹{item.price.mrp}</span>
                        )}
                      </div>
                      {saved > 0 && (
                        <p style={{ margin:'3px 0 0', fontSize:10, color:'#1a9e50', fontWeight:800 }}>✓ Save ₹{saved}</p>
                      )}
                    </div>

                    {/* stock urgency */}
                    {lowStock && (
                      <div style={{ marginBottom:10 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                          <span style={{ fontSize:9, color:ACCENT, fontWeight:900, textTransform:'uppercase', letterSpacing:.5 }}>Selling fast!</span>
                          <span style={{ fontSize:9, color:'#aaa', fontWeight:600 }}>Only {item.inventory?.stock_quantity} left</span>
                        </div>
                        <div style={{ height:5, background:'#f0f0f0', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${stockPct}%`, background:`linear-gradient(90deg,${ACCENT},${ACCENT_LIGHT})`, borderRadius:4 }} />
                        </div>
                      </div>
                    )}

                    {/* cart button */}
                    <div style={{ marginTop:'auto' }}>
                      {qty > 0 ? (
                        <div style={{ background:`linear-gradient(135deg,${PRIMARY},${PRIMARY_MID})`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 8px', height:38, boxShadow:`0 4px 14px rgba(24,152,165,0.3)` }}>
                          <button onClick={() => updateQuantity(item._id,-1)} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:8, cursor:'pointer', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                          <span style={{ color:'#fff', fontWeight:900, fontSize:15 }}>{qty}</span>
                          <button onClick={() => updateQuantity(item._id,1)} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:8, cursor:'pointer', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          style={{ width:'100%', height:38, cursor:'pointer', background:`linear-gradient(135deg,${PRIMARY},${PRIMARY_MID})`, color:'#fff', border:'none', borderRadius:12, fontSize:12, fontWeight:900, letterSpacing:.5, boxShadow:`0 4px 14px rgba(24,152,165,0.28)` }}
                        >
                          ADD TO CART
                        </button>
                      )}
                    </div>
                  </div>

                  {/* bottom accent */}
                  <div style={{ height:3, background:`linear-gradient(90deg,${PRIMARY},${PRIMARY_MID})`, borderRadius:'0 0 18px 18px' }} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════ FLOATING CART ══════════════ */}
      {cartCount > 0 && (
        <div style={{ position:'fixed', bottom:20, left:14, right:14, zIndex:100 }}>
          <button
            onClick={() => router.push('/cart')}
            style={{ width:'100%', background:`linear-gradient(135deg,${PRIMARY} 0%,${PRIMARY_MID} 100%)`, color:'#fff', border:'none', borderRadius:18, padding:'0 20px', height:66, display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', boxShadow:`0 10px 32px rgba(24,152,165,0.48)` }}
          >
            {/* left */}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ background:'rgba(255,255,255,0.18)', borderRadius:12, width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <div style={{ position:'absolute', top:-5, right:-5, background:ACCENT, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff', border:'2px solid #fff' }}>
                  {cartCount}
                </div>
              </div>
              <div>
                <p style={{ margin:0, fontSize:10, color:'rgba(255,255,255,0.72)', fontWeight:700, textTransform:'uppercase', letterSpacing:.8 }}>{cartCount} item{cartCount>1?'s':''} added</p>
                <p style={{ margin:0, fontSize:19, fontWeight:900 }}>₹{cartTotal}</p>
              </div>
            </div>
            {/* right */}
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', padding:'9px 16px', borderRadius:12 }}>
              <span style={{ fontWeight:900, fontSize:13, letterSpacing:.4 }}>VIEW CART</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}