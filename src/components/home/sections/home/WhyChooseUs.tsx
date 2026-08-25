"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Award, Headset } from "lucide-react";

const WHY_CHOOSE_US_CONTENT = {
  title: "Why Choose Us",
  subtitle: "Because we care about your safety",
  features: [
    {
      title: "Verified Professionals",
      description:
        "Every service provider undergoes a rigorous multi-step background check.",
      icon: ShieldCheck,
    },
    {
      title: "Safe Payments",
      description:
        "Secure online transactions with local and international payment methods.",
      icon: CreditCard,
    },
    {
      title: "Quality Guarantee",
      description:
        "We ensure the highest service quality with a money-back guarantee.",
      icon: Award,
    },
    {
      title: "24/7 Support",
      description:
        "Our dedicated customer support team is always ready to assist you.",
      icon: Headset,
    },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 65, damping: 15 },
  },
} as const;

export default function WhyChooseUs() {
  return (
    <div className="py-5 md:py-8 lg:py-10 bg-transparent overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            Safety First
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            Why Choose <span className="text-[#FF6014]">Us</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {WHY_CHOOSE_US_CONTENT.subtitle}
          </p>
        </div>
        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-10"
        >
          {WHY_CHOOSE_US_CONTENT.features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                className="
                  group relative overflow-hidden
                  flex flex-col items-center justify-center
                  text-center h-full
                  rounded-2xl sm:rounded-[32px] p-3 sm:p-6 lg:p-8
                  bg-gradient-to-br from-white to-[#e8eaed]
                  border-[2px] border-[#FF6014]/30
                  cursor-default
                  transition-all duration-300
                  hover:border-[#FF6014]/80 hover:shadow-[0_8px_30px_rgba(255,96,20,0.25)]
                "
              >
                {/* Top gloss sheen */}
                <span
                  className="
                    pointer-events-none absolute inset-x-0 top-0
                    h-1/2 rounded-t-2xl sm:rounded-t-[32px]
                    bg-gradient-to-b from-white/65 to-transparent
                  "
                  aria-hidden
                />

                {/* Icon orb */}
                <div
                  className="
                    relative overflow-hidden
                    w-12 h-12 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-8
                    flex items-center justify-center
                    bg-gradient-to-br from-[#f5f7fa] to-[#e8eaed]
                    shadow-[2px_2px_5px_rgba(174,180,190,0.35),_-2px_-2px_5px_rgba(255,255,255,1)]
                    sm:shadow-[4px_4px_10px_rgba(174,180,190,0.5),_-4px_-4px_10px_rgba(255,255,255,1)]
                    transition-all duration-300
                    group-hover:from-[#FF6014] group-hover:to-[#E0530A]
                    group-hover:shadow-[4px_4px_14px_rgba(255,96,20,0.35),_-3px_-3px_10px_rgba(255,220,200,0.6)]
                  "
                >
                  {/* Orb inner gloss */}
                  <span
                    className="
                      pointer-events-none absolute
                      top-[3px] left-[5px] sm:top-[6px] sm:left-[10px]
                      w-6 h-3 sm:w-10 sm:h-5 rounded-full
                      bg-[radial-gradient(ellipse,rgba(255,255,255,0.75)_0%,transparent_70%)]
                    "
                    aria-hidden
                  />
                  <IconComponent
                    className="
                      w-5 h-5 sm:w-8 sm:h-8 relative z-10
                      text-primary
                      transition-colors duration-300
                      group-hover:text-white
                    "
                  />
                </div>

                <h3 className="font-extrabold text-slate-900 text-xs sm:text-base md:text-xl mb-1.5 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 font-semibold sm:font-medium leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
