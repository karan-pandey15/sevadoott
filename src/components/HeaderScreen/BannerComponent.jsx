"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const bannerData = [
  {
    id: 1,
    mobileImage: "/image/SevadootBanner.png",
    desktopImage: "/image/SevadootBanner.png",
    route: "",
    title: "Sevadoot",
  },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export default function BannerComponent({ bannerIds = null }) {
  const router = useRouter();
  const isMobile = useIsMobile(768);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedSrc, setDisplayedSrc] = useState("");
  const [incomingSrc, setIncomingSrc] = useState(null);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const autoplayRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const filteredBanners =
    Array.isArray(bannerIds) && bannerIds.length > 0
      ? bannerData.filter((banner) => bannerIds.includes(banner.id))
      : bannerData;
  const safeBanners = filteredBanners.length > 0 ? filteredBanners : bannerData;
  const showControls = safeBanners.length > 1;

  const slideNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
  }, [safeBanners.length]);

  const slidePrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + safeBanners.length) % safeBanners.length
    );
  }, [safeBanners.length]);

  const resetAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
    if (safeBanners.length < 2) return;
    autoplayRef.current = setInterval(slideNext, 5000);
  }, [slideNext, safeBanners.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [safeBanners.length]);

  useEffect(() => {
    resetAutoplay();
    return () => {
      clearInterval(autoplayRef.current);
      clearTimeout(transitionTimeoutRef.current);
    };
  }, [resetAutoplay]);

  const handleClick = (route) => {
    if (!route || route === "#") return;
    if (route.startsWith("http")) window.open(route, "_blank");
    else router.push(route);
  };

  const slide = safeBanners[currentIndex];
  const imageSrc = isMobile
    ? slide.mobileImage || slide.desktopImage
    : slide.desktopImage || slide.mobileImage;

  useEffect(() => {
    if (!imageSrc) return;
    if (!displayedSrc) {
      setDisplayedSrc(imageSrc);
      return;
    }
    if (imageSrc === displayedSrc) return;

    const preloaded = new window.Image();
    preloaded.src = imageSrc;
    preloaded.onload = () => {
      setIncomingSrc(imageSrc);
      requestAnimationFrame(() => setIncomingVisible(true));
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setDisplayedSrc(imageSrc);
        setIncomingSrc(null);
        setIncomingVisible(false);
      }, 420);
    };
  }, [imageSrc, displayedSrc]);

  const isClickable = slide.route && slide.route !== "#";

  return (
    <section
      aria-label="Promotional banner"
      className="relative w-full group"
      style={{
        backgroundColor: "#f3f4f6",
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => handleClick(slide.route)}
        style={{
          cursor: isClickable ? "pointer" : "default",
          position: "relative",
          width: "100%",
        }}
      >
        {displayedSrc && (
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={slide.desktopImage}
            />
            <img
              src={slide.mobileImage}
              alt={slide.title || "Banner"}
              draggable={false}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                objectPosition: "center",
                userSelect: "none",
                WebkitUserDrag: "none",
              }}
            />
          </picture>
        )}

        {incomingSrc && (
          <img
            src={incomingSrc}
            alt={slide.title || "Banner"}
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              maxWidth: "100%",
              userSelect: "none",
              WebkitUserDrag: "none",
              opacity: incomingVisible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        )}
      </div>

      {showControls && (
        <div
          aria-hidden
          className="
            absolute inset-0
            flex items-center justify-between
            px-3 sm:px-5
            pointer-events-none
            opacity-100 md:opacity-0 md:group-hover:opacity-100
            transition-opacity duration-300
          "
        >
          <NavButton
            onClick={() => {
              slidePrev();
              resetAutoplay();
            }}
            dir="prev"
          />
          <NavButton
            onClick={() => {
              slideNext();
              resetAutoplay();
            }}
            dir="next"
          />
        </div>
      )}
    </section>
  );
}

function NavButton({ onClick, dir }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "rgba(0,0,0,0.28)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "#fff",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.15s",
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0,0,0,0.52)";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0,0,0,0.28)";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    >
      {dir === "prev" ? (
        <ChevronLeft style={{ width: 22, height: 22 }} />
      ) : (
        <ChevronRight style={{ width: 22, height: 22 }} />
      )}
    </button>
  );
}
