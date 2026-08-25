"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Lock, RefreshCw, CheckCircle2, ThumbsUp } from "lucide-react";

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "100% Quality Guaranteed",
    description: "If you're not satisfied with the service, our team will re-service your home completely free of charge.",
    badge: "Damage Protection",
  },
  {
    icon: Award,
    title: "Background Verified Pros",
    description: "Every technician undergoes rigorous background checks, skill testing, and police verification.",
    badge: "5-Step Vetted",
  },
  {
    icon: Lock,
    title: "Transparent & Fixed Pricing",
    description: "No hidden charges or surprise costs. Pay exactly what was quoted before work begins.",
    badge: "Zero Surprises",
  },
  {
    icon: RefreshCw,
    title: "7-Day Post-Service Warranty",
    description: "Enjoy hassle-free 7-day warranty on all repairs and installations for total peace of mind.",
    badge: "7 Days Free Cover",
  },
];

export default function SafetyGuarantee() {
  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#FF6014] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={13} className="fill-[#FF6014]" />
            Rajseba Protection Plan
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014] fill-[#FF6014]" />
            Your Peace of Mind is Our <span className="text-[#FF6014]">Top Priority</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            We stand behind every service delivered. Here is our ironclad commitment to safety and excellence.
          </p>
        </div>

          {/* Grid Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {GUARANTEES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#FF6014]/20 hover:border-[#FF6014] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FFF4EE] border border-[#FF6014]/30 flex items-center justify-center text-[#FF6014] group-hover:bg-[#FF6014] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-[#FF6014] bg-[#FFF4EE] px-2.5 py-1 rounded-full border border-[#FF6014]/15">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1.5 group-hover:text-[#FF6014] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Guarantee</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Trust Line */}
          <div className="mt-8 pt-6 border-t border-[#FF6014]/15 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700 relative z-10">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-[#FF6014]" />
              <span>Over <strong className="text-slate-900">50,000+</strong> happy households trust Rajseba for home maintenance</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px] font-bold">
              <span>✓ Instant Free Cancellation</span>
              <span>✓ 24/7 Priority Support</span>
            </div>
          </div>

      </div>
    </section>
  );
}
