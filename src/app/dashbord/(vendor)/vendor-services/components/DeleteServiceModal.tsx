"use client";

import React from "react";
import { X, Wrench } from "lucide-react";
import { Service } from "@/redux/features/admin/service";
import { useAppSelector } from "@/redux/hooks";

interface DeleteServiceModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  itemToDelete: Service | null;
  setItemToDelete: (item: Service | null) => void;
  handleDelete: () => void;
}

export default function DeleteServiceModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  itemToDelete,
  setItemToDelete,
  handleDelete,
}: DeleteServiceModalProps) {
  const lang = useAppSelector((state) => state.lang.value);
  if (!isDeleteModalOpen || !itemToDelete) return null;

  const t = {
    bn: {
      title: "সার্ভিস মুছুন",
      confirmDesc: "আপনি কি নিশ্চিত? এই সার্ভিসটি মুছে ফেললে এর সাথে যুক্ত সাব-সার্ভিস এবং প্যাকেজগুলো প্রভাবিত হতে পারে।",
      cancel: "বাতিল",
      delete: "মুছে ফেলুন",
    },
    en: {
      title: "Delete Service",
      confirmDesc: "Are you sure? Deleting this service will also affect associated sub-services and packages.",
      cancel: "Cancel",
      delete: "Delete",
    },
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
          <button
            onClick={() => {
              setIsDeleteModalOpen(false);
              setItemToDelete(null);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-6 text-center">
          <div className="flex flex-col items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
              {itemToDelete.image ? (
                <img src={itemToDelete.image} alt={itemToDelete.name} className="w-full h-full object-cover" />
              ) : (
                <Wrench className="text-slate-400" size={28} />
              )}
            </div>
            <div>
              <span className="font-mono text-slate-400 font-bold text-xs">ID: {itemToDelete.id}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{itemToDelete.name}</h3>
            </div>
          </div>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {t.confirmDesc}
          </p>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
              }}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#FF6014] hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-red-500/10"
            >
              {t.delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
