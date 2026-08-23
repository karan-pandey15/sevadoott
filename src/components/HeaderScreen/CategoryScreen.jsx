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
    const className = `cat-card ${isTrending ? 'trending-cat-card' : ''} ${activeCategory === item.id ? 'active' : ''} ${clickable ? '' : 'cat-card--disabled'}`;

    const inner = (
      <>
        <div
          className="circle-wrap"
          style={{ backgroundColor: item.iconBg }}
        >
          <Image
            src={item.image}
            alt={item.name}
            width={isTrending ? 64 : 64}
            height={isTrending ? 64 : 64}
            className="cat-img"
          />
        </div>
        <span className="cat-label" itemProp="name">{item.name}</span>
      </>
    );

    const cardStyles = (
      <style jsx>{`
        .cat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px 2px;
          border-radius: 14px;
          transition: transform 0.2s ease, background 0.2s ease;
          width: 100%;
          text-decoration: none;
        }

        .cat-card--disabled {
          cursor: default;
          pointer-events: auto;
        }

        .cat-card:not(.cat-card--disabled):hover,
        .cat-card.active {
          transform: translateY(-2px);
          background: #f4fbfc;
        }

        .circle-wrap {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(24, 152, 165, 0.12);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .cat-card:not(.cat-card--disabled):hover .circle-wrap {
          transform: scale(1.05);
          box-shadow: 0 8px 18px rgba(24, 152, 165, 0.22);
        }

        .cat-img {
          width: 52px;
          height: 52px;
          object-fit: cover;
        }

        .cat-label {
          font-size: 10px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
          line-height: 1.25;
          max-width: 100%;
          min-height: 26px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (min-width: 480px) {
          .circle-wrap { width: 72px; height: 72px; }
          .cat-img { width: 58px; height: 58px; }
          .cat-label { font-size: 11px; }
        }

        @media (min-width: 768px) {
          .circle-wrap { width: 86px; height: 86px; }
          .cat-img { width: 68px; height: 68px; }
          .cat-label { font-size: 12.5px; min-height: 32px; }
          .cat-card { gap: 8px; padding: 8px 4px; }
        }

        @media (min-width: 1024px) {
          .circle-wrap { width: 96px; height: 96px; }
          .cat-img { width: 76px; height: 76px; }
          .cat-label { font-size: 13px; }
        }
      `}</style>
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
          {cardStyles}
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
        {cardStyles}
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
