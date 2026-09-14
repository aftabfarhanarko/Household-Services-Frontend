"use client";

import React from "react";
import { XCircle } from "lucide-react";
import { Getway } from "@/redux/features/shared/getwayApi";
import { useAppSelector } from "@/redux/hooks";

interface RequestWithdrawModalProps {
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  gateways: Getway[];
  selectedGatewayId: number | null;
  setSelectedGatewayId: (id: number | null) => void;
  handleRequestWithdrawConfirm: () => void;
  isRequesting: boolean;
}

export default function RequestWithdrawModal({
  isWithdrawModalOpen,
  setIsWithdrawModalOpen,
  gateways,
  selectedGatewayId,
  setSelectedGatewayId,
  handleRequestWithdrawConfirm,
  isRequesting,
}: RequestWithdrawModalProps) {
  const lang = useAppSelector((state) => state.lang.value);
  if (!isWithdrawModalOpen) return null;

  const t = {
    bn: {
      title: "উইথড্র রিকোয়েস্ট করুন",
      description: "আপনি এই বুকিংয়ের জন্য কোথায় কমিশন রিসিভ করতে চান তা নির্বাচন করুন।",
      selectMethod: "পেমেন্ট মেথড সিলেক্ট করুন",
      confirmBtn: "কনফার্ম রিকোয়েস্ট",
    },
    en: {
      title: "Request Withdrawal",
      description: "Select where you want to receive your commission for this booking.",
      selectMethod: "Select Payment Method",
      confirmBtn: "Confirm Request",
    },
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{t.title}</h3>
          <button onClick={() => setIsWithdrawModalOpen(false)} className="text-slate-400 hover:text-slate-600">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-4 text-left">
            {t.description}
          </p>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 text-left">{t.selectMethod}</label>
            <div className="space-y-2">
              {gateways.map((g) => (
                <label
                  key={g.id}
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedGatewayId === g.id
                      ? "border-brand-primary bg-[#FFF8F4]"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value={g.id}
                    checked={selectedGatewayId === g.id}
                    onChange={() => setSelectedGatewayId(g.id)}
                    className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-slate-300"
                  />
                  <span className="ml-3 font-medium text-slate-800 uppercase text-sm">
                    {g.getway_type} -{" "}
                    <span className="text-slate-500 font-normal ml-1">
                      {g.info?.details || JSON.stringify(g.info)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleRequestWithdrawConfirm}
            disabled={isRequesting || !selectedGatewayId}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isRequesting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t.confirmBtn
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
