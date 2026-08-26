"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Briefcase, User, ChevronRight, Trash2,
  Lock, LogIn, UserPlus, CheckCircle2, Sparkles, Clock,
  FileText
} from "lucide-react";
import { useBookingsState, STATUS_CONFIG, FILTERS } from "@/app/bookings/hooks/useBookingsState";
import BookingStats from "@/app/bookings/components/BookingStats";
import BookingFilters from "@/app/bookings/components/BookingFilters";
import BookingDetailModal from "@/app/bookings/components/BookingDetailModal";
import ServiceAreas from "@/components/home/sections/home/ServiceAreas";

const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const cardFadeUp: any = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled" | "assigned" | "on_the_way";

export default function BookingsPage() {
  const {
    isAuthenticated, isAuthLoading, isBookingsLoading, isUpdating, isDeleting,
    filtered, activeFilter, setActiveFilter, search, setSearch,
    selectedBooking, setSelectedBooking, handleCancel, handleDelete, getStats,
  } = useBookingsState();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F4]/10 flex flex-col justify-center items-center py-16">
        <div className="w-10 h-10 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing bookings page...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#FFF8F4]/40 via-white to-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center">
        <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] bg-[#FF6014]/4 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-[#FF6014]/2 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />

        <div className="mx-auto max-w-2xl w-full text-center relative z-10 space-y-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }} className="inline-flex p-4.5 bg-[#FFF8F4] text-[#FF6014] rounded-3xl border border-[#FF6014]/15 shadow-sm shadow-[#FF6014]/5 mb-2">
            <Lock className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 tracking-tight leading-tight">
            Manage Your <span className="text-[#FF6014]">Schedules</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-semibold">
            Please log in to view booking summaries, active schedules, and track your verified home care experts.
          </motion.p>

          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
            <motion.div variants={cardFadeUp} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF6014]/10 transition-colors">
              <div className="w-8 h-8 bg-[#FFF8F4] text-[#FF6014] rounded-xl flex items-center justify-center mb-3"><Clock className="w-4 h-4" /></div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Real-time Tracker</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5 leading-relaxed">Track your service provider as they arrive.</p>
            </motion.div>
            <motion.div variants={cardFadeUp} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF6014]/10 transition-colors">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-3"><CheckCircle2 className="w-4 h-4" /></div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Satisfied Guarantee</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5 leading-relaxed">Release funds only when you are satisfied.</p>
            </motion.div>
            <motion.div variants={cardFadeUp} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF6014]/10 transition-colors col-span-2 sm:col-span-1">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3"><Sparkles className="w-4 h-4" /></div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Premium Perks</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5 leading-relaxed">Access exclusive promo codes and rewards.</p>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-xs uppercase tracking-wider">
                <LogIn className="w-4 h-4" />Sign In Now
              </motion.button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold py-3.5 px-8 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider">
                <UserPlus className="w-4 h-4" />Create Free Account
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FFF8F4]/20 via-white to-white px-4 py-8 md:py-12 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[5%] left-[-10%] w-[350px] h-[350px] bg-[#FF6014]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-[#FF6014]/2 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />

      <div className="mx-auto max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-sm shadow-[#FF6014]/2">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-medium text-slate-900 tracking-tight">My Bookings</h1>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">View your schedule times, order status, and booking history</p>
            </div>
          </div>
        </motion.div>

        <BookingStats stats={getStats()} />
        <BookingFilters search={search} setSearch={setSearch} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <motion.div layout className="space-y-4">
          {isBookingsLoading ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest animate-pulse">Loading your bookings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center mx-auto border border-[#FF6014]/10"><FileText className="w-6 h-6" /></div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">No Bookings Found</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-semibold">{search ? "No matching records found. Try adjusting your search query." : "You don't have any bookings in this category yet."}</p>
              </div>
              {!search && (<Link href="/services" className="inline-block pt-1"><button className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-extrabold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md hover:shadow-[0_8px_20px_rgba(255,96,20,0.2)] uppercase tracking-wider">Book a Service</button></Link>)}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((booking: any) => {
                const cfg = STATUS_CONFIG[booking.status as BookingStatus] || STATUS_CONFIG['pending'];
                const serviceName = booking.nestedService?.name || booking.pkg?.name || "Premium Home Service";
                const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Scheduled Date N/A";
                return (
                  <motion.div key={booking.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 100, damping: 15 }} whileHover={{ y: -3, boxShadow: "0 12px 30px -5px rgba(0,0,0,0.03)" }} className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-l-4 bg-white p-5 border border-slate-100/90 transition-all ${cfg.borderColor} ${cfg.glowColor}`}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cfg.iconBg} ${cfg.iconText} border border-slate-100 shadow-inner`}>
                        {booking.nestedService ? <Briefcase size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-extrabold text-slate-800 truncate leading-snug">{serviceName}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5 shrink-0"><Calendar size={13} className="text-slate-400" /> {dateStr}</span>
                          <span className="flex items-center gap-1.5 shrink-0"><User size={13} className="text-slate-400" /> {booking.vendor?.name || "Expert assignment pending"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-3 pt-3.5 md:pt-0 border-t border-slate-50 md:border-0">
                      <span className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider border ${cfg.pillBg} ${cfg.pillText} select-none`}>{cfg.label}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedBooking(booking)} className="rounded-xl border border-slate-200 hover:border-[#FF6014] hover:text-[#FF6014] bg-slate-50/50 hover:bg-[#FFF8F4] px-4 py-2.5 text-xs font-extrabold text-slate-600 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1">
                          View Details<ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(booking.id)} disabled={isDeleting} className="p-2.5 rounded-xl border border-rose-100 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-rose-500 bg-rose-50/50 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50" title="Delete Booking">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      <BookingDetailModal selectedBooking={selectedBooking} onClose={() => setSelectedBooking(null)} onCancel={handleCancel} onDelete={handleDelete} isUpdating={isUpdating} isDeleting={isDeleting} />

      {/* Coverage Map Section */}
      <ServiceAreas />
    </section>
  );
}