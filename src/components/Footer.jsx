"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { HiChevronRight } from "react-icons/hi";
import Logo from "./Logo";
import { SEVADOOT_CONTACT } from "@/lib/partnerContact";

const serviceLinks = [
  { name: "Attendant For Parents", path: "/pages/Attendant" },
  { name: "Guardian For Kids", path: "/pages/GuardianKids" },
  { name: "Mehndi Artist", path: "/pages/Mehndi" },
  { name: "Hospitality", path: "/pages/HospitalityAviation?categoryId=hospitality" },
  { name: "Aviation Services", path: "/pages/HospitalityAviation?categoryId=aviation" },
  { name: "Pandit Ji Booking", path: "/pages/Pandit" },
  { name: "Pet Walker", path: "/pages/petwalker" },
  { name: "Physiotherapist", path: "/pages/physiotherapist" },
  { name: "Nurse For First Aid", path: "/pages/nurse" },
  { name: "Salon & Makeup", path: "/pages/Salon" },
  { name: "Healthy Food", path: "/pages/Groceries" },
  { name: "Tiffin Service", path: "/pages/tiffinservice" },
  { name: "Resort & Farmhouse", path: "/pages/Hotel" },
  { name: "Gym Membership", path: "/pages/Gym" },
];

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "Become a Partner", path: "/pages/partner" },
  { name: "For Investors", path: "/pages/investors" },
  { name: "Careers", path: "/pages/career" },
  { name: "Collaboration", path: "/pages/collaboration" },
  { name: "Contact Us", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms" },
];

const portalLinks = [
  { name: "Blog", path: "/blog" },
  { name: "Admin Login", path: "/admin/login" },
  { name: "Partner Login", path: "/partner/login" },
  {
    name: "HR Login",
    path: "https://helpaanahrportal.vercel.app/login",
    external: true,
  },
];

const socials = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

function FooterHeading({ children }) {
  return (
    <h3 className="mb-5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white">
      {children}
      <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#F58220]" />
    </h3>
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname.includes("/pages/ServiceDetail") ||
    pathname.includes("/pages/ladies") ||
    pathname.includes("/pages/Mehndi")
  ) {
    return null;
  }

  const helpline = SEVADOOT_CONTACT.phone.numbers[0];
  const email = SEVADOOT_CONTACT.email.address;
  const telHref = SEVADOOT_CONTACT.phone.tel || helpline.replace(/\s/g, "");

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#167F8A] to-[#0E5A63] text-white">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#F58220]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 pb-8 pt-12 md:px-8 md:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-4">
            <Logo size="md" asLink />
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              Sevadoot is India&apos;s trusted home service marketplace. Book verified
              professionals for family care, celebrations, wellness, and daily needs
              — all in one local service app.
            </p>
            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 transition hover:bg-[#F58220] hover:text-white hover:ring-[#F58220]"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:col-span-5">
            <div className="min-w-0">
              <FooterHeading>Services</FooterHeading>
              <ul className="space-y-2.5">
                {serviceLinks.map((cat) => (
                  <li key={cat.path + cat.name}>
                    <Link
                      href={cat.path}
                      className="group flex items-start gap-1 text-[12px] leading-snug text-white/75 transition hover:text-white sm:items-center sm:text-[13px]"
                    >
                      <HiChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#F58220]/80 transition group-hover:translate-x-0.5 sm:mt-0" />
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <FooterHeading>Company</FooterHeading>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="group flex items-start gap-1 text-[12px] leading-snug text-white/75 transition hover:text-white sm:items-center sm:text-[13px]"
                    >
                      <HiChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#F58220]/80 transition group-hover:translate-x-0.5 sm:mt-0" />
                      <span className="break-words">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-white/8 p-3 ring-1 ring-white/10">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#F58220]/20 text-[#FDE68A]">
                  <MapPin size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                    {SEVADOOT_CONTACT.office.label}
                  </p>
                  <p className="text-sm font-medium text-white">
                    {SEVADOOT_CONTACT.office.address}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${telHref}`}
                className="flex items-start gap-3 rounded-2xl bg-white/8 p-3 ring-1 ring-white/10 transition hover:bg-white/12"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#F58220]/20 text-[#FDE68A]">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                    {SEVADOOT_CONTACT.phone.label}
                  </p>
                  <p className="text-sm font-medium text-white">{helpline}</p>
                </div>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-start gap-3 rounded-2xl bg-white/8 p-3 ring-1 ring-white/10 transition hover:bg-white/12"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#F58220]/20 text-[#FDE68A]">
                  <Mail size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                    {SEVADOOT_CONTACT.email.label}
                  </p>
                  <p className="break-all text-sm font-medium text-white">{email}</p>
                </div>
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {portalLinks.map((link) =>
                link.external ? (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-white/50 underline-offset-2 hover:text-white hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ) : (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-[12px] text-white/50 underline-offset-2 hover:text-white hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-[12px] text-white/45 md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} {SEVADOOT_CONTACT.company}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
