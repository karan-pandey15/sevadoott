'use client';

import { Suspense, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  AVIATION_CATEGORY,
  AVIATION_ROLES,
  HOSPITALITY_CATEGORY,
  HOSPITALITY_ROLES,
} from '@/lib/hospitalityAviation';

function HospitalityAviationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial =
    searchParams.get('categoryId') === 'aviation' ? 'aviation' : 'hospitality';
  const [group, setGroup] = useState(initial);
  const [selectedId, setSelectedId] = useState(null);

  const parent = group === 'aviation' ? AVIATION_CATEGORY : HOSPITALITY_CATEGORY;
  const roles = group === 'aviation' ? AVIATION_ROLES : HOSPITALITY_ROLES;
  const selected = useMemo(
    () => roles.find((role) => role.id === selectedId) || roles[0],
    [roles, selectedId]
  );

  return (
    <div className="font-poppins min-h-screen bg-[#F7FBFC]">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-[#1898A5] px-4 py-3 text-white shadow-md">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
            Hospitality & Aviation Services
          </p>
          <h1 className="text-base font-bold leading-tight">{parent.heading}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-5 pb-24">
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(24,152,165,0.12)]">
          <div className="relative h-44 bg-slate-100 sm:h-56">
            <Image
              src={parent.image}
              alt={parent.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
          <div className="p-5">
            <h2 className="text-xl font-extrabold text-slate-900">{parent.name}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {parent.description}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[HOSPITALITY_CATEGORY, AVIATION_CATEGORY].map((item) => {
            const active = group === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setGroup(item.id);
                  setSelectedId(null);
                }}
                className={`rounded-2xl border p-3 text-left transition ${
                  active
                    ? 'border-[#1898A5] bg-[#E8F7F9] shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-center text-[12px] font-bold text-slate-800 sm:text-sm">
                  {item.name}
                </p>
              </button>
            );
          })}
        </div>

        <h3 className="mt-7 mb-3 text-sm font-extrabold uppercase tracking-wide text-slate-700">
          Choose a role
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {roles.map((role) => {
            const active = selected?.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedId(role.id)}
                className={`rounded-2xl border bg-white p-3 text-left transition ${
                  active ? 'border-[#1898A5] ring-2 ring-[#1898A5]/20' : 'border-slate-100'
                }`}
              >
                <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                  <Image
                    src={role.image}
                    alt={role.name}
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-center text-[11px] font-bold leading-tight text-slate-800 sm:text-xs">
                  {role.name}
                </p>
                <p className="mt-1 text-center text-[10px] leading-snug text-slate-500">
                  {role.detail}
                </p>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-50">
                <Image
                  src={selected.image}
                  alt={selected.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900">{selected.name}</p>
                <p className="text-sm text-slate-500">{selected.detail}</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-[#1898A5] py-3 text-sm font-bold text-white shadow-md hover:bg-[#147F8A]"
              onClick={() =>
                router.push(
                  `/contact?service=${encodeURIComponent(selected.name)}`
                )
              }
            >
              Request {selected.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HospitalityAviationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#1898A5]" />
        </div>
      }
    >
      <HospitalityAviationContent />
    </Suspense>
  );
}
