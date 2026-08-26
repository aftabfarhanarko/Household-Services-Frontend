"use client";

import React, { useState } from "react";
import { XCircle, Eye, EyeOff } from "lucide-react";
import { LocationCascader } from "@/components/ui/LocationCascader";

interface UserModalProps {
  isAddModalOpen: boolean;
  closeModal: () => void;
  step: 1 | 2;
  handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => void;
  isCreatingUser: boolean;
  isRolesLoading: boolean;
  rolesRes: any;
  role: string;
  handleCreateProfile: (e: React.FormEvent<HTMLFormElement>) => void;
  isCreatingProfile: boolean;
  isCategoriesLoading: boolean;
  allCategories: any[];
  selectedDevision: string;
  setSelectedDevision: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  selectedArea: string;
  setSelectedArea: (val: string) => void;
}

export default function UserModal({
  isAddModalOpen,
  closeModal,
  step,
  handleCreateUser,
  isCreatingUser,
  isRolesLoading,
  rolesRes,
  role,
  handleCreateProfile,
  isCreatingProfile,
  isCategoriesLoading,
  allCategories,
  selectedDevision,
  setSelectedDevision,
  selectedDistrict,
  setSelectedDistrict,
  selectedArea,
  setSelectedArea,
}: UserModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 1 ? "ধাপ ১: ইউজার অ্যাকাউন্ট" : "ধাপ ২: ইউজার প্রোফাইল"}
          </h2>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all"
          >
            <XCircle size={24} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">পুরো নাম</label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="যেমন: রহিম মিয়া"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">ইমেইল এড্রেস</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="যেমন: email@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">ফোন নম্বর (ঐচ্ছিক)</label>
              <input
                name="phone"
                type="tel"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">রোল</label>
              <select
                name="role"
                required
                defaultValue=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
              >
                <option value="" disabled>
                  একটি রোল নির্বাচন করুন
                </option>
                {isRolesLoading ? (
                  <option value="" disabled>
                    রোল লোড হচ্ছে...
                  </option>
                ) : (
                  (rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []))
                    .filter((r: any) => (role !== "vendor" && role !== "agent") || r.name === "Client")
                    .map((r: any) => (
                      <option key={r.id || r._id} value={r.id || r._id}>
                        {r.name}
                      </option>
                    ))
                )}
              </select>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isCreatingUser}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50"
              >
                {isCreatingUser ? "সেভ হচ্ছে..." : "পরবর্তী ধাপ"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">প্রোফাইলের ধরন</label>
              <select
                name="type"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
              >
                <option value="personal">ব্যক্তিগত / ফ্রিল্যান্সার</option>
                <option value="company">কোম্পানি / এজেন্সি</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                ক্যাটাগরি (একাধিক নির্বাচনের জন্য Ctrl/Cmd চেপে ধরুন)
              </label>
              <select
                multiple
                name="category_ids"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all h-24"
              >
                {isCategoriesLoading ? (
                  <option value="" disabled>
                    ক্যাটাগরি লোড হচ্ছে...
                  </option>
                ) : (
                  allCategories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                কোম্পানি / ব্যবসার নাম (ঐচ্ছিক)
              </label>
              <input
                name="company_name"
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="Acme Services Ltd."
              />
            </div>
            <div>
              <LocationCascader
                selectedDevisionId={selectedDevision}
                selectedDistrictId={selectedDistrict}
                selectedAreaId={selectedArea}
                onDevisionChange={setSelectedDevision}
                onDistrictChange={setSelectedDistrict}
                onAreaChange={setSelectedArea}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                নির্দিষ্ট অবস্থান (ঐচ্ছিক)
              </label>
              <input
                name="location"
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="যেমন: ঢাকা"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">বিবরণ</label>
              <textarea
                name="description"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                placeholder="ইউজারের সার্ভিস সম্পর্কে সংক্ষেপে লিখুন..."
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">শুরুর সর্বনিম্ন মূল্য</label>
                <input
                  name="min_starting_price"
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">গুগল ম্যাপ লিংক</label>
                <input
                  name="google_map_link"
                  type="url"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isCreatingProfile}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50"
              >
                {isCreatingProfile ? "সেভ হচ্ছে..." : "প্রোফাইল সম্পন্ন করুন"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
