"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Workflow, Search, Calendar, Wrench, CreditCard } from "lucide-react";

const HOW_IT_WORKS_CONTENT = {
  title: "How It Works",
  subtitle: "Get your household tasks solved in 4 simple, hassle-free steps",
  steps: [
    {
      stepNumber: "01",
      icon: Search,
      title: "Select Service",
      description: "Browse our wide range of premium, verified home service categories and select what you need.",
    },
    {
      stepNumber: "02",
      icon: Calendar,
      title: "Schedule Time",
      description: "Pick a convenient date and flexible time slot that fits perfectly in your daily schedule.",
    },
    {
      stepNumber: "03",
      icon: Wrench,
      title: "Get Expert Service",
      description: "Relax while our certified background-verified professional arrives and handles everything.",
    },
    {
      stepNumber: "04",
      icon: CreditCard,
      title: "Pay & Relax",
      description: "Pay securely after the service is completed to your satisfaction and leave a genuine review.",
    },
  ],
};

function TimelineStep({ step, isEven }: { step: (typeof HOW_IT_WORKS_CONTENT.steps)[number]; isEven: boolean }) {
  const Icon = step.icon;

  return (
    <div className="relative flex flex-col md:flex-row items-center">
      {/* Content */}
      <div
        className={`w-full md:w-1/2 ${
          isEven ? "md:order-2 md:pl-16 pl-10" : "md:order-1 md:pr-16 md:text-right pl-10 md:pl-0"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col ${isEven ? "items-start" : "items-start md:items-end"}`}
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-[10px] md:text-[11px] font-black tracking-[0.2em] text-[#FF6014]/70 uppercase mb-1.5 md:mb-2"
          >
            Step {step.stepNumber}
          </motion.span>

          <div className={`flex items-center gap-2.5 md:gap-3 mb-2 md:mb-2.5 ${isEven ? "" : "md:flex-row-reverse"}`}>
            <motion.div
              initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
              className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-[#FFF4EE] text-[#FF6014] flex items-center justify-center shrink-0"
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>
            <h3 className="font-bold text-black text-lg md:text-2xl tracking-tight">{step.title}</h3>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[14px] md:text-[16px] text-slate-800 leading-relaxed font-white-500 max-w-sm"
          >
            {step.description}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className={`h-px w-8 md:w-10 bg-[#FF6014]/40 mt-3 md:mt-4 origin-left ${!isEven ? "md:origin-right" : ""}`}
          />
        </motion.div>
      </div>

      {/* Center node — number only, pop-in + pulse */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1 md:top-1/2 md:-translate-y-1/2 z-20">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            whileInView={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0] }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="absolute inset-0 rounded-full bg-[#FF6014]/40 pointer-events-none"
          />
          <div className="relative w-7 h-7 md:w-12 md:h-12 rounded-full bg-white border-2 border-[#FF6014] flex items-center justify-center">
            <span className="text-[10px] md:text-xs font-black text-[#FF6014]">{step.stepNumber}</span>
          </div>
        </motion.div>
      </div>

      {/* Spacer to balance grid on desktop */}
      <div className={`hidden md:block w-1/2 ${isEven ? "order-1" : "order-2"}`} />
    </div>
  );
}

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 80%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="py-8 md:py-16 lg:py-20 overflow-hidden relative bg-transparent">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#FF6014]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-9 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#FFF4EE] border border-[#FF6014]/25 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Workflow size={14} />
            Hassle-Free Process
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-black tracking-tight leading-tight flex items-center justify-center gap-2">
            <Workflow className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            How It <span className="text-[#FF6014]">Works</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {HOW_IT_WORKS_CONTENT.subtitle}
          </p>
        </div>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-slate-200" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 md:left-1/2 top-4 w-px -translate-x-1/2 bg-gradient-to-b from-[#FF6014] to-amber-500 shadow-[0_0_12px_rgba(255,96,20,0.5)] z-10 origin-top"
          />

          <div className="space-y-10 md:space-y-24">
            {HOW_IT_WORKS_CONTENT.steps.map((step, i) => (
              <TimelineStep key={i} step={step} isEven={i % 2 === 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}