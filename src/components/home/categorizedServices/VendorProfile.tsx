"use client";

import React from "react";
import { Star, Building, CheckCircle2, MessageSquare, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleLanguage } from "@/redux/features/shared/langSlice";

interface Vendor {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  createdAt?: string;
  wallet_balance?: string;
  commission_percentage?: string;
}

export function VendorProfile({ vendor, serviceRating = "0.0" }: { vendor?: Vendor; serviceRating?: string | number }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.lang.value);

  if (!vendor) return null;

  const t = {
    bn: {
      servicePartner: "সার্ভিস পার্টনার",
      verified: "ভেরিফাইড",
      officialPartner: "অফিসিয়াল পার্টনার এজেন্সি",
      rating: "রেটিং",
    },
    en: {
      servicePartner: "Service Partner",
      verified: "Verified",
      officialPartner: "Official Partner Agency",
      rating: "Rating",
    }
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
      {/* Decorative Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/40 rounded-full blur-2xl pointer-events-none" />

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => dispatch(toggleLanguage())}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-slate-200 transition-colors"
        >
          <Languages className="w-3 h-3" />
          {lang === "bn" ? "English" : "বাংলা"}
        </button>
      </div>

      <div className="flex flex-col gap-5 relative z-10 mt-4">
        {/* Header/Badge */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {t[lang].servicePartner}
          </span>
          {vendor.status === "active" && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
              {t[lang].verified}
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-[#FF6014] shrink-0 shadow-inner">
            <Building className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-800 tracking-tight truncate">
              {vendor.name}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
              {t[lang].officialPartner}
            </p>
          </div>
        </div>

        {/* Rating and Chat Button */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* Rating */}
          <div className="flex items-center justify-between bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500">{t[lang].rating}</span>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(Number(serviceRating) || 5)
                        ? "fill-current"
                        : "opacity-30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-slate-800">
                {serviceRating || "5.0"}
              </span>
            </div>
          </div>

          {/* Chat option hidden as requested */}
        </div>
      </div>
    </div>
  );
}
