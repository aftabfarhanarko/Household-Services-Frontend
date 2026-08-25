"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ShieldCheck, Sparkles, ArrowRight, Award } from "lucide-react";
import Link from "next/link";

const COMPARISONS = [
  {
    feature: "Pricing Transparency",
    rajseba: "Fixed rate upfront, zero hidden charges",
    local: "Unpredictable & extra hidden costs",
  },
  {
    feature: "Technician Reliability",
    rajseba: "100% NID & Police verified experts",
    local: "Unverified technicians with zero checks",
  },
  {
    feature: "Service Warranty",
    rajseba: "7 Days free warranty & damage cover",
    local: "No warranty or post-service support",
  },
  {
    feature: "Safety & Security",
    rajseba: "Uniformed pros with OTP security code",
    local: "No identity verification at your doorstep",
  },
  {
    feature: "Customer Support",
    rajseba: "24/7 Helpline & instant chat assistance",
    local: "Unreachable after payment is done",
  },
];

export default function ComparisonSection() {
  return (
    <section className="py-5 md:py-8 lg:py-10 relative overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">

        {/* Section Header - Matching exact website typography & badges */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#FF6014] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} className="fill-[#FF6014]" />
            Why Choose Rajseba
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Award className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            Rajseba Standard <span className="text-[#FF6014]">vs Local Technicians</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            See why thousands of households across Bangladesh trust Rajseba for guaranteed safety, quality, and transparent pricing.
          </p>
        </div>

        {/* Comparison Wrapper */}
        <div className="bg-white rounded-3xl border border-[#FF6014]/20 shadow-[0_8px_30px_rgba(255,96,20,0.06)] overflow-hidden">
          
          {/* Desktop & Tablet View (Table Layout) */}
          <div className="hidden sm:block">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#FFF8F4] border-b border-[#FF6014]/15 p-4 text-xs md:text-sm font-extrabold items-center">
              <div className="col-span-4 pl-3 text-slate-800 uppercase tracking-wider">Features & Guarantees</div>
              <div className="col-span-4 text-center text-[#FF6014] bg-[#FF6014]/10 py-2 rounded-xl border border-[#FF6014]/20 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF6014]" /> Rajseba Standard
              </div>
              <div className="col-span-4 text-center text-slate-500 uppercase tracking-wider">
                Unorganized Local Technicians
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {COMPARISONS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 p-4 text-xs md:text-sm items-center hover:bg-slate-50/80 transition-colors"
                >
                  {/* Feature Title */}
                  <div className="col-span-4 font-bold text-slate-800 flex items-center gap-2.5 pl-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF6014]" />
                    <span>{item.feature}</span>
                  </div>

                  {/* Rajseba Side */}
                  <div className="col-span-4 text-center font-bold text-slate-900 bg-[#FFF4EE] border border-[#FF6014]/30 rounded-xl p-2.5 mx-2 flex items-center justify-center gap-2 text-emerald-800 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="leading-tight text-xs font-bold">{item.rajseba}</span>
                  </div>

                  {/* Local Side */}
                  <div className="col-span-4 text-center text-slate-500 font-semibold p-2.5 flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="leading-tight text-xs text-rose-600/90">{item.local}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile View (Card List Stacked Layout) */}
          <div className="sm:hidden p-4 space-y-4 divide-y divide-slate-100">
            {COMPARISONS.map((item, i) => (
              <div key={i} className={i > 0 ? "pt-4" : ""}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF6014]" />
                  <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">{item.feature}</span>
                </div>

                <div className="space-y-2">
                  {/* Rajseba Box */}
                  <div className="bg-[#FFF4EE] border border-[#FF6014]/30 rounded-xl p-2.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] font-black text-[#FF6014] uppercase tracking-wider block">Rajseba</span>
                      <span className="text-xs font-bold text-slate-800 leading-tight">{item.rajseba}</span>
                    </div>
                  </div>

                  {/* Local Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Local Technicians</span>
                      <span className="text-xs font-semibold text-rose-600/90 leading-tight">{item.local}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 md:p-5 bg-gradient-to-r from-[#FFF8F4] to-white border-t border-[#FF6014]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-xs font-bold text-slate-700">
              ⚡ Experience hassle-free home maintenance with verified professionals today.
            </div>
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Explore All Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
