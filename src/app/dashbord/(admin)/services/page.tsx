"use client";

import { ShieldAlert, PlusCircle, Wrench } from "lucide-react";
import DeleteServiceModal from "./components/DeleteServiceModal";
import ServiceTable from "./components/ServiceTable";
import { useServiceState } from "./hooks/useServiceState";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/hooks";

export default function AdminServicesManagementPage() {
  const router = useRouter();
  const lang = useAppSelector((state) => state.lang.value);
  const {
    role,
    isServicesLoading,
    services,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    setItemToDelete,
    openDeleteModal,
    handleDelete,
  } = useServiceState();

  if (role !== "superadmin" && role !== "agent") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          {lang === "bn" ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিন এবং এজেন্টদের জন্য।" : "This panel is restricted to Administrators and Agents."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {lang === "bn" ? "সার্ভিসেস ব্যবস্থাপনা" : "Manage Services"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "bn" ? "প্লাটফর্মের সকল প্রধান সার্ভিস তৈরি এবং কনফিগার করুন।" : "Create and manage all services across the platform."}
            </p>
          </div>
        </div>
        {role === "superadmin" && (
          <Link
            href="/dashbord/services/create"
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> {lang === "bn" ? "নতুন সার্ভিস যোগ করুন" : "Add Service"}
          </Link>
        )}
      </div>

      {/* Table */}
      {isServicesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Wrench size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {lang === "bn" ? "কোনো সার্ভিস পাওয়া যায়নি" : "No Services Found"}
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {lang === "bn" ? "আপনার প্রথম সার্ভিস তৈরি করে শুরু করুন।" : "Start by creating your first service."}
          </p>
          <Link
            href="/dashbord/services/create"
            className="mt-4 inline-block bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold px-4 py-2 rounded-xl text-xs transition-all"
          >
            {lang === "bn" ? "নতুন সার্ভিস যোগ করুন" : "Add New Service"}
          </Link>
        </div>
      ) : (
        <ServiceTable
          services={services}
          role={role}
          openEditModal={(item) => router.push(`/dashbord/services/edit/${item.id}`)}
          openDeleteModal={openDeleteModal}
        />
      )}

      {/* Delete Modal */}
      <DeleteServiceModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
