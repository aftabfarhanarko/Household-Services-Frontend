"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  CheckCircle2,
  Award,
  ChevronLeft,
  LogIn,
  Lock,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLoginState } from "@/app/login/hooks/useLoginState";
import LoginLeftPanel from "@/app/login/components/LoginLeftPanel";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    lottieAnimation,
    isLoading,
    handleSubmit,
  } = useLoginState();

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white flex font-sans">
      <LoginLeftPanel lottieAnimation={lottieAnimation} />

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "url('/bg-icons-design.png')",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative z-10 px-6 sm:px-10 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#FF6014] transition-colors group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-6 relative z-10">
          <div className="lg:hidden mb-8 flex flex-col items-center">
            <Link href="/" className="flex flex-col items-center gap-2.5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6014] to-[#FF8142] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#FF6014]/25">
                <Sparkles size={20} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#FF6014] text-xl tracking-tight">
                Rajseba
              </span>
            </Link>
          </div>

          <div className="w-full max-w-[440px] bg-transparent border border-slate-200/80 sm:border-0 rounded-3xl shadow-lg sm:shadow-none px-6 py-8 sm:px-2 sm:py-0">
            <div className="flex flex-col items-center text-center mb-8">
              <Link
                href="/"
                className="flex flex-col items-center gap-2.5 group mb-5 lg:flex hidden"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6014] to-[#FF8142] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#FF6014]/25 group-hover:scale-105 transition-transform">
                  <Sparkles size={24} className="stroke-[2]" />
                </div>
                <span className="font-black text-xl text-slate-900 tracking-tight">
                  Rajseba
                </span>
              </Link>
              <div className="inline-flex items-center gap-2 bg-[#FFF4EE] text-[#FF6014] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4 border border-[#FF6014]/20">
                <ShieldCheck size={13} className="stroke-[2.5]" /> Email Authentication
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2.5">
                <LogIn size={28} className="text-[#FF6014]" />
                Welcome back
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-2 leading-relaxed max-w-xs">
                Enter your email address and password to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 focus:outline-none transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 focus:outline-none transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                        remember
                          ? "bg-[#FF6014] border-[#FF6014]"
                          : "bg-white border-slate-350 group-hover:border-[#FF6014]/50"
                      }`}
                    >
                      {remember && (
                        <CheckCircle2 size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-bold">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/help"
                  className="text-xs text-[#FF6014] hover:underline font-bold"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-60 text-white text-[11px] font-extrabold tracking-wide py-4 rounded-2xl shadow-xl shadow-[#FF6014]/25 hover:shadow-[#FF6014]/35 transition-all flex items-center justify-center gap-2 focus:outline-none active:scale-[0.99] mt-2 border-none cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 font-bold mt-8">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#FF6014] hover:underline font-extrabold"
              >
                Create one free →
              </Link>
            </p>

            <div className="mt-8 flex items-center justify-center gap-5 flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                <ShieldCheck size={13} className="text-emerald-500" />
                SSL Encrypted
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Privacy Protected
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                <Award size={13} className="text-amber-500" />
                Trusted by 50K+
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-5 text-[11px] text-slate-400 font-medium relative z-10 border-t border-slate-100 mx-6 space-y-1">
          <div>
            © {new Date().getFullYear()} Rajseba Services Ltd. · All rights
            reserved.
            <Link
              href="/privacy"
              className="ml-3 text-slate-400 hover:text-[#FF6014] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="ml-3 text-slate-400 hover:text-[#FF6014] transition-colors"
            >
              Terms
            </Link>
          </div>
          <div>
            Developed by{" "}
            <a
              href="https://jevxo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6014] hover:underline font-semibold"
            >
              Jevxo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}