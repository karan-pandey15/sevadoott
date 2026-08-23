"use client";

import React from "react";
import Image from "next/image";
import BannerComponent from "@/components/HeaderScreen/BannerComponent";
import CategoryScreen from "@/components/HeaderScreen/CategoryScreen";
import CategorySlider from "@/components/HeaderScreen/Categoryslider";
import { PLAY_STORE_URL } from "@/lib/brand";
import { FaGooglePlay, FaStar, FaGlobe } from "react-icons/fa";
import {
  MdVerifiedUser,
  MdBolt,
  MdHealthAndSafety,
  MdPalette,
  MdElderly,
  MdLocalHospital,
  MdTempleHindu,
  MdSpa,
  MdRestaurant,
  MdDownload,
  MdSupportAgent,
  MdFlashOn,
  MdPhoneIphone,
} from "react-icons/md";

export default function HomePageClient() {
  return (
    <main className="font-poppins min-h-screen bg-white">
      <section className="w-full md:hidden" aria-label="Service categories carousel">
        <CategorySlider limitToTrending />
      </section>

      <section className="w-full" aria-label="Promotional banners">
        <BannerComponent />
      </section>

      <section className="py-6 md:py-10" aria-label="Browse trending services">
        <CategoryScreen mode="home" />
      </section>

      <section className="px-4 py-10 md:px-8 md:py-14">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1898A5] via-[#157F8A] to-[#0E5A63] shadow-[0_24px_60px_rgba(14,90,99,0.35)] md:rounded-[2rem]">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-yellow-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 grid items-center gap-10 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:p-12">
            <div className="text-center lg:text-left">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-1.5 text-[11px] font-black tracking-wide text-[#0E5A63] shadow-md">
                <MdPhoneIphone className="h-3.5 w-3.5" />
                ANDROID LIVE · iOS VIA WEB
              </span>

              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Get the <span className="text-yellow-400">Sevadoot</span> Home
                Service Booking App
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 lg:mx-0">
                Book mehndi artists, elder care companions, hospital helpers and
                15+ verified services in under 30 seconds.
              </p>

              <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                {[
                  { icon: MdDownload, label: "Free Download" },
                  { icon: MdFlashOn, label: "Instant Booking" },
                  { icon: MdSupportAgent, label: "24/7 Support" },
                  { icon: MdPhoneIphone, label: "iOS Web Support" },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <Icon className="h-3.5 w-3.5 text-yellow-300" />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-black px-5 py-3.5 text-white shadow-xl ring-1 ring-white/10 transition hover:bg-neutral-900 hover:scale-[1.02] active:scale-95 sm:w-auto"
                >
                  <FaGooglePlay className="h-8 w-8 text-white" aria-hidden />
                  <span className="text-left leading-tight">
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-white/55">
                      Get it on
                    </span>
                    <span className="block text-lg font-bold">Google Play</span>
                  </span>
                </a>

                <a
                  href="https://sevadoot.com"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3.5 text-white transition hover:bg-white/15"
                >
                  <FaGlobe className="h-5 w-5 text-yellow-300" />
                  <span className="text-left leading-tight">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/55">
                      For iOS users
                    </span>
                    <span className="block text-sm font-bold">Visit Sevadoot.com</span>
                  </span>
                </a>
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                Android 5.0+ · Secure payments · Encrypted
              </p>
            </div>

            <div className="relative mx-auto flex w-full max-w-[280px] justify-center pb-6 lg:max-w-none lg:pb-2">
              <div className="absolute inset-8 rounded-full bg-yellow-400/25 blur-3xl" />
              <div className="relative w-[210px] overflow-hidden rounded-[2.2rem] border-[6px] border-white/25 bg-slate-950 shadow-[0_30px_70px_rgba(0,0,0,0.45)] sm:w-[230px]">
                <div className="flex h-6 items-center justify-center bg-black">
                  <span className="h-3 w-16 rounded-full bg-slate-700" />
                </div>
                <div className="flex flex-col items-center bg-gradient-to-b from-[#1AA3B0] to-[#0E5A63] px-3 pb-3 pt-4">
                  <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-2xl bg-white p-1 shadow-lg">
                    <Image src="/image/sevadoot.png" alt="Sevadoot" fill className="object-contain" sizes="56px" />
                  </div>
                  <p className="text-[11px] font-black tracking-[0.22em] text-white">SEVADOOT</p>
                  <p className="mt-0.5 text-[8px] font-bold tracking-widest text-yellow-300">
                    CARE · SUPPORT · TRUST
                  </p>
                  <div className="mt-3 flex w-full items-center gap-1.5 rounded-xl bg-white/15 px-2.5 py-2">
                    <MdBolt className="h-3.5 w-3.5 text-yellow-300" />
                    <span className="text-[9px] text-white/70">Search services…</span>
                  </div>
                  <div className="mt-3 grid w-full grid-cols-3 gap-1.5">
                    {[
                      { Icon: MdPalette, label: "Mehndi" },
                      { Icon: MdElderly, label: "Elder" },
                      { Icon: MdLocalHospital, label: "Nurse" },
                      { Icon: MdTempleHindu, label: "Pandit" },
                      { Icon: MdSpa, label: "Salon" },
                      { Icon: MdRestaurant, label: "Food" },
                    ].map(({ Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center rounded-xl bg-white/12 py-2 text-white"
                      >
                        <Icon className="h-4 w-4 text-yellow-300" />
                        <span className="mt-1 text-[7px] font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-yellow-400 py-2.5 text-[11px] font-black tracking-wide text-[#0E5A63]"
                  >
                    GET APP
                    <FaGooglePlay className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex h-5 items-center justify-center bg-black">
                  <span className="h-1 w-16 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="absolute -bottom-1 left-2 flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 shadow-xl sm:left-0">
                <FaStar className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-black text-slate-800">4 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why-sevadoot"
        className="relative overflow-hidden py-14 md:py-20 bg-gradient-to-b from-[#F4FBFC] to-white"
      >
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#1898A5]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-6 h-56 w-56 rounded-full bg-[#F58220]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="mb-10 text-center md:mb-14">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1898A5]">
              Why Sevadoot
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Trusted care, booked in seconds
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
              Verified experts, instant booking, and secure support — built for families across India.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {[
              {
                icon: MdVerifiedUser,
                title: "Verified Professionals",
                desc: "Background-checked experts for mehndi artist booking, elder care, nursing, and every home service on our marketplace.",
                accent: "from-[#1898A5] to-[#147F8A]",
              },
              {
                icon: MdBolt,
                title: "Fast Booking",
                desc: "Book any local service in under 30 seconds — from senior citizen assistance to hospital visit helper support.",
                accent: "from-[#F58220] to-[#E56A12]",
              },
              {
                icon: MdHealthAndSafety,
                title: "Safe & Trusted",
                desc: "India's trusted service provider app with secure payments, insured visits, and 24/7 dedicated customer support.",
                accent: "from-[#1898A5] to-[#0E5A63]",
              },
            ].map(({ icon: Icon, title, desc, accent }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_10px_40px_rgba(24,152,165,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_50px_rgba(24,152,165,0.16)] md:p-8"
              >
                <span className="absolute right-5 top-5 text-5xl font-black leading-none text-slate-100 transition group-hover:text-[#1898A5]/15">
                  0{index + 1}
                </span>
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                >
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="relative text-xl font-bold text-slate-900">{title}</h3>
                <p className="relative mt-3 text-[15px] leading-relaxed text-slate-500">{desc}</p>
                <div className="mt-6 h-1 w-12 rounded-full bg-[#1898A5]/20 transition-all duration-300 group-hover:w-20 group-hover:bg-[#F58220]" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
