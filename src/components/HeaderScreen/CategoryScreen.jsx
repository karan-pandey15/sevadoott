'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_URL, DEFAULT_DESCRIPTION } from '@/lib/seo';

const categories = [
  {
    id: 'seniorCareCompanion',
    name: 'Elder Care Companion',
    image: '/image/categoryimg/gaurdiankids.png',
    screen: '/pages/Attendant',
    params: { categoryId: 'Attendant' },
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
    id: 'GaurdianKids',
    name: 'Book an Guardian',
    image: '/image/categoryimg/gaurdiankids.png',
    screen: '/pages/GuardianKids',
    params: { categoryId: 'GaurdianKids' },
    iconBg: '#FFF4E5',
  },
  {
    id: 'petWalker',
    name: 'Pet Walker',
    image: '/image/categoryimg/petwalker-removebg-preview.png',
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
  {
    id: 'groceries',
    name: 'Healthy Food',
    image: '/image/categoryimg/healthyfood.png',
    screen: '/pages/Groceries',
    params: {},
    iconBg: '#E8F5E9',
  },
  {
    id: 'ecommerce',
    name: 'E-commerece',
    image: '/image/categoryimg/school.png',
    screen: '/pages/ecommerce',
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
    id: 'groceries2',
    name: 'Groceries',
    image: '/image/grocery1.png',
    screen: '/pages/Groceries',
    params: {},
    iconBg: '#E8F5E9',
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
  {
    id: 'ladieshealthissues',
    name: 'Pregnancy & Ladies Health Issues',
    image: '/image/categoryimg/womenpr.png',
    screen: '/pages/ladies',
    params: {},
    iconBg: '#EDE7F6',
  },
];

const trendingIds = ['mehndi', 'seniorCareCompanion'];

const TRENDING_GROUP = {
  title: 'Our Trending Categories',
  ids: ['mehndi', 'seniorCareCompanion'],
};

/** Categories that open a page when clicked. Others show but do nothing. */
const DEFAULT_CLICKABLE_IDS = null; // null = all clickable

export default function CategoryScreen({
  mode = 'full',
  clickableIds = DEFAULT_CLICKABLE_IDS,
}) {
  const [activeCategory, setActiveCategory] = useState(null);
  const isHomeMode = mode === 'home';

  const isClickable = (id) =>
    !Array.isArray(clickableIds) || clickableIds.includes(id);

  const getCategoryLink = (item) => {
    const params = {
      ...item.params,
      categoryId: item.params?.categoryId ?? item.id,
    };
    const query = '?' + new URLSearchParams(params).toString();
    return `${item.screen}${query}`;
  };

  const handleCategoryClick = (e, id) => {
    if (!isClickable(id)) {
      e.preventDefault();
      return;
    }
    setActiveCategory(id);
    localStorage.setItem('selectedCategoryId', id);
  };

  const renderCategoryCard = (item, isTrending = false) => {
    const clickable = isClickable(item.id);
    const className = `cat-card flex w-full flex-col items-center gap-1.5 rounded-[14px] bg-transparent p-1.5 no-underline transition-transform md:gap-2 md:p-2 ${
      isTrending ? 'trending-cat-card' : ''
    } ${activeCategory === item.id ? 'active' : ''} ${
      clickable ? 'cursor-pointer hover:-translate-y-0.5' : 'cat-card--disabled cursor-default'
    }`;

    const inner = (
      <>
        <div
          className={`circle-wrap mx-auto flex aspect-square h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_4px_12px_rgba(24,152,165,0.12)] transition-transform sm:h-[72px] sm:w-[72px] md:h-[86px] md:w-[86px] lg:h-[96px] lg:w-[96px] ${
            clickable ? 'hover:scale-105 hover:shadow-[0_8px_18px_rgba(24,152,165,0.22)]' : ''
          }`}
        >
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="h-full w-full object-contain object-center p-1"
          />
        </div>
        <span
          className="cat-label line-clamp-2 min-h-[22px] max-w-full text-center text-[8px] font-bold leading-tight text-gray-800 sm:text-[9px] md:min-h-[28px] md:text-[10.5px] lg:text-[11px]"
          itemProp="name"
        >
          {item.name}
        </span>
      </>
    );

    if (!clickable) {
      return (
        <div
          key={item.id}
          className={className}
          title={item.name}
          role="presentation"
          onClick={(e) => e.preventDefault()}
        >
          {inner}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={getCategoryLink(item)}
        onClick={(e) => handleCategoryClick(e, item.id)}
        className={className}
        title={item.name}
        itemProp="url"
      >
        {inner}
      </Link>
    );
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Sevadoot Services',
        description: DEFAULT_DESCRIPTION,
        numberOfItems: categories.length,
        itemListElement: categories.map((cat, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: cat.name,
          url: `${SITE_URL}${getCategoryLink(cat)}`,
        })),
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Main Categories',
        hasPart: categories.slice(0, 8).map((cat) => ({
          '@type': 'WebPage',
          name: cat.name,
          url: `${SITE_URL}${getCategoryLink(cat)}`,
        })),
      },
    ],
  };

  return (
    <div className="page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="page-container">
        <nav
          className="groups-stack"
          aria-label="Service Categories"
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          {isHomeMode ? (
            <section className="group-block trending-section">
              <h3 className="group-heading">{TRENDING_GROUP.title}</h3>
              <div className="cat-grid home-cat-grid">
                {categories.map((item) =>
                  renderCategoryCard(item, trendingIds.includes(item.id))
                )}
              </div>
            </section>
          ) : (
            <section className="group-block">
              <div className="group-header">
                <h3 className="group-heading">All Categories</h3>
              </div>
              <div className="cat-grid">
                {categories.map((item) => renderCategoryCard(item))}
              </div>
            </section>
          )}
        </nav>
      </div>

      <style jsx>{`
        .page-wrapper {
          width: 100%;
          background: #fff;
          padding: 16px 0 20px;
        }

        .page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 12px;
        }

        .groups-stack {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .group-block {
          width: 100%;
        }

        .group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .group-heading {
          font-size: 16px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 14px 0;
          letter-spacing: -0.02em;
        }

        .group-header .group-heading {
          margin-bottom: 0;
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px 6px;
        }

        .home-cat-grid {
          gap: 12px 8px;
        }

        .trending-section .group-heading {
          margin-bottom: 14px;
          text-align: left;
        }

        @media (min-width: 480px) {
          .page-container { padding: 0 16px; }
          .cat-grid, .home-cat-grid { gap: 14px 10px; }
          .group-heading { font-size: 18px; }
        }

        @media (min-width: 640px) {
          .cat-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; }
          .home-cat-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
          .group-heading { font-size: 20px; }
        }

        @media (min-width: 768px) {
          .cat-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px; }
          .home-cat-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
          .page-container { padding: 0 24px; }
          .page-wrapper { padding: 24px 0; }
        }

        @media (min-width: 1024px) {
          .cat-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 24px; }
          .home-cat-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); }
          .group-heading { font-size: 22px; }
        }

        @media (min-width: 1280px) {
          .cat-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); }
          .home-cat-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  );
}
