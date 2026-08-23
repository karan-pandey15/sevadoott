'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ExploreMoreButton from '@/components/HeaderScreen/ExploreMoreButton';

// salon & servies 
// food for pateints
// mehendi artist
// old age caretakers
// copassenger for travelling

const categories = [
  {
    id: 'Attendant',
    name: 'Elder Care Companion',
    image: '/image/categoryimg/gaurdiankids.png',
    screen: '/pages/Attendant',
    iconBg: '#E8F0FE',
  },
    {
    id: 'copessenger',
    name: 'Co-Pessenger For Travel',
    image: '/image/categoryimg/copessanger.png',
    screen: '/pages/Attendant',
    iconBg: '#E8F0FE',
  },
  {
    id: 'mehndi',
    name: 'Mehndi Artist',
    image: '/image/categoryimg/mehndi.png',
    screen: '/pages/Mehndi',
    params: {},
    iconBg: '#FFF8E1',
  },
  {
    id: 'Tiffin Service',
    name: 'Food For Patient',
    image: '/image/categoryimg/foodpatients.png',
    screen: '/pages/tiffinservice',
    params: { categoryId: 'Nurse' },
    iconBg: '#F1F8E9',
  },

  {
    id: 'salonMakeup',
    name: 'Salon and Makeup',
    image: '/image/categoryimg/salon.png',
    screen: '/pages/Salon',
    params: {},
    iconBg: '#FCE4EC',
  },
  {
    id: 'petWalker',
    name: 'Pet Walker',
    image:'/image/categoryimg/petwalker-removebg-preview.png',
    screen: '/pages/petwalker',
    params: { categoryId: 'petWalker' },
    iconBg: '#F0FDF4',
  },
  {
    id: 'pandit',
    name: 'Booking for Pandit Ji',
    image: '/image/categoryimg/pandit.png',
    screen: '/pages/Pandit',
    params: {},
    iconBg: '#FFF1F1',
  },
  {
    id: 'school',
    name: 'School Uniform & Accessories',
    image: '/image/categoryimg/schooluniform.png',
    screen: '/pages/School',
    params: {},
    iconBg: '#F3E5F5',
  },
  ,

  {
    id: 'ecommerce',
    name: 'E-commerece',
    image: '/image/categoryimg/school.png',
    screen: '/pages/ecommerce',
    params: {},
    iconBg: '#E8F5E9',
  },
  {
    id: 'groceries',
    name: 'Healthy Food',
    image:  '/image/categoryimg/healthyfood.png',
    screen: '/pages/Groceries',
    params: {},
    iconBg: '#E8F5E9',
  },
  {
    id: 'hotel',
    name: 'Resort & Farmhouse Booking',
    image: '/image/categoryimg/resort.png',
    screen: '/pages/Hotel',
    params: {},
    iconBg: '#E0F2F1',
  },
  {
    id: 'cosmetic',
    name: 'Cosmetic',
    image: '/image/categoryimg/makeup.png',
    screen: '/pages/Cosmetic',
    params: {},
    iconBg: '#FCE4EC',
  },
  {
    id: 'Nurse',
    name: 'Nurse For First Aid',
    image: '/image/categoryimg/nurse.png',
    screen: '/pages/nurse',
    params: { categoryId: 'Nurse' },
    iconBg: '#FFF3E0',
  },
  {
    id: 'Nursed',
    name: 'Pregnancy & Ladies Health Issues',
    image: '/image/categoryimg/womenpr.png',
    screen: '/pages/ladies',
    params: { categoryId: 'Nursed' },
    iconBg: '#FFF3E0',
  },
  {
    id: 'Gym',
    name: 'Premium Gym MemberShip',
    image: '/image/categoryimg/gym.png',
    screen: '/pages/Gym',
    iconBg: '#EFEBE9',
  },
  {
    id: 'Tiffin Service',
    name: 'Food For Patient & Tiffin Service',
    image: '/image/categoryimg/foodpatients.png',
    screen: '/pages/tiffinservice',
    params: { categoryId: 'Nurse' },
    iconBg: '#F1F8E9',
  }, 
  {
    id: 'physiotherapist',
    name: 'Physiotherapist',
    image: '/image/categoryimg/physo.png',
    screen: '/pages/physiotherapist',
    params: {},
    iconBg: '#E0F7FA',
  },
  {
    id: 'luxuryProduct',
    name: 'Luxury Product',
    image: '/image/categoryimg/luxuryitems.png',
    screen: '/pages/Luxury',
    params: {},
    iconBg: '#EDE7F6',
  },


  {
    id: 'Fashion',
    name: 'Fashion & LyfeStyle',
    image: '/image/categoryimg/fashionlifestyle.png',
    screen: '/pages/fashion',
    params: {},
    iconBg: '#EDE7F6',
  },
];

export default function CategorySlider({
  limitToTrending = false,
  clickableIds = null,
}) {

  const router = useRouter();
  const [active, setActive] = useState(null);

  const sliderRef = useRef(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const isClickable = (id) =>
    !Array.isArray(clickableIds) || clickableIds.includes(id);

  const go = (item) => {
    if (!isClickable(item.id)) return;
    setActive(item.id);
    localStorage.setItem('selectedCategoryId', item.id);
    const params = { ...item.params, categoryId: item.id };
    const q = '?' + new URLSearchParams(params).toString();
    router.push(`${item.screen}${q}`);
  };

  const trendingIds = ['mehndi', 'Attendant'];
  const visibleCategories = limitToTrending
    ? trendingIds
        .map((id) => categories.find((item) => item.id === id))
        .filter(Boolean)
    : categories;

  const mouseDown = (e) => {
    if (limitToTrending) return;
    isDown.current = true;
    sliderRef.current.classList.add('dragging');
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const mouseLeave = () => {
    if (limitToTrending) return;
    isDown.current = false;
    sliderRef.current.classList.remove('dragging');
  };

  const mouseUp = () => {
    if (limitToTrending) return;
    isDown.current = false;
    sliderRef.current.classList.remove('dragging');
  };

  const mouseMove = (e) => {
    if (limitToTrending) return;
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <>
      <style jsx>{`

      .wrapper{
        width:100%;
        background:#fff;
        padding:16px 0;
        border-bottom:1px solid #eee;
        overflow:visible;
      }

      @media (min-width: 768px) {
        .wrapper {
          display: none !important;
        }
      }

      .slider{
        display:flex;
        overflow-x:auto;
        gap:8px;
        scroll-behavior:smooth;
        padding:10px 20px;
        cursor:grab;
      }

      .slider.limited{
        display:flex;
        flex-direction:row;
        align-items:flex-end;
        justify-content:space-between;
        gap:8px;
        width:100%;
        overflow:visible;
        cursor:default;
        padding:10px 16px;
      }

      .slider.limited .trending-cats-group{
        display:flex;
        flex-direction:row;
        align-items:flex-end;
        gap:16px;
        flex:1 1 auto;
        min-width:0;
      }

      .slider.limited .explore-slot{
        flex:0 0 auto;
        display:flex;
        align-items:flex-end;
        justify-content:center;
      }

      @media(min-width:640px){
        .slider.limited .trending-cats-group{
          gap:24px;
        }
      }

      .slider.limited .item{
        width:72px;
        min-width:72px;
        max-width:72px;
        flex:0 0 72px;
      }

      .slider.limited .icon{
        width:64px;
        height:64px;
        min-width:64px;
        min-height:64px;
        max-width:64px;
        max-height:64px;
        flex-shrink:0;
      }

      .slider.limited .icon :global(img){
        width:64px !important;
        height:64px !important;
        min-width:64px !important;
        min-height:64px !important;
        object-fit:cover !important;
      }

      .slider.limited .label{
        font-size:11px;
        font-weight:700;
        min-height:28px;
        line-height:1.25;
        max-width:72px;
        text-align:center;
      }

      .slider.dragging{
        cursor:grabbing;
      }

      .slider::-webkit-scrollbar{
        display:none;
      }

      .item{
        flex:0 0 auto;
        width:110px;
        display:flex;
        flex-direction:column;
        align-items:center;
        border:none;
        background:none;
        cursor:pointer;
      }

      .item--disabled{
        cursor:default;
      }

      .item--disabled:hover .icon{
        transform:none;
      }

      .icon{
        width:80px;
        height:80px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        margin-bottom:6px;
        box-shadow:0 3px 10px rgba(0,0,0,0.12);
        transition:0.2s;
        overflow:hidden;
      }

      .icon.active{
        outline:3px solid #1898A5;
        transform:scale(1.08);
      }

      .label{
        font-size:12px;
        text-align:center;
        font-weight:700;
      }

      @media(max-width:768px){
        .slider.limited{
          padding:10px 12px;
          gap:6px;
        }

        .slider.limited .trending-cats-group{
          gap:12px;
        }

        .item{
          width:80px;
        }

        .icon{
          width:60px;
          height:60px;
        }

        .label{
          font-size:10px;
        }

      }

      `}</style>

      <div className="wrapper md:hidden">

        <div
          className={`slider ${limitToTrending ? 'limited' : ''}`}
          ref={sliderRef}
          onMouseDown={mouseDown}
          onMouseLeave={mouseLeave}
          onMouseUp={mouseUp}
          onMouseMove={mouseMove}
        >

          {limitToTrending ? (
            <>
              <div className="trending-cats-group">
                {visibleCategories.map((item) => (
                  <button
                    key={item.id}
                    className="item"
                    onClick={() => go(item)}
                  >
                    <div
                      className={`icon ${active === item.id ? 'active' : ''}`}
                      style={{ background: item.iconBg }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        style={{ objectFit: 'cover', padding: 0, width: '100%', height: '100%' }}
                      />
                    </div>
                    <span className="label">{item.name}</span>
                  </button>
                ))}
              </div>
              <div className="explore-slot">
                <ExploreMoreButton />
              </div>
            </>
          ) : (
            visibleCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`item ${isClickable(item.id) ? '' : 'item--disabled'}`}
                onClick={() => go(item)}
                aria-disabled={!isClickable(item.id)}
              >
                <div
                  className={`icon ${active === item.id ? 'active' : ''}`}
                  style={{ background: item.iconBg }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', padding: 0 }}
                  />
                </div>
                <span className="label">{item.name}</span>
              </button>
            ))
          )}

        </div>

      </div>
    </>
  );
}