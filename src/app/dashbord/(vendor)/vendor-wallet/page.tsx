"use client";

import React from "react";
import { ShieldAlert, Wallet, CheckCircle2, XCircle, Clock, RefreshCw, FileText } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { Withdraw } from "@/redux/features/shared/withdrawApi";
import { useVendorWalletState } from "./hooks/useVendorWalletState";
import PaymentMethodsList from "./components/PaymentMethodsList";
import AddGatewayModal from "./components/AddGatewayModal";
import RequestWithdrawModal from "./components/RequestWithdrawModal";
import { printWithdrawInvoice, printAllWithdrawsInvoice } from "@/utils/invoicePrint";
import { useAppSelector } from "@/redux/hooks";

const translations = {
  bn: {
    title: "ওয়ালেট এবং উপার্জন",
    subtitle: "আপনার কমিশন এবং উইথড্র রিকোয়েস্ট পরিচালনা করুন।",
    downloadStatement: "স্টেটমেন্ট ডাউনলোড",
    accessDenied: "প্রবেশাধিকার নেই",
    accessDeniedDesc: "এই প্যানেলটি শুধুমাত্র ভেন্ডরদের জন্য।",
    currentBalance: "বর্তমান ওয়ালেট ব্যালেন্স",
    commissionRate: "কমিশন রেট",
    perCompletedBooking: "প্রতি কমপ্লিট হওয়া বুকিংয়ে",
    pendingWithdrawal: "অপেক্ষমান উইথড্র",
    totalApproved: "মোট অনুমোদিত (লাইফটাইম)",
    readyForWithdrawal: "উইথড্র করার জন্য প্রস্তুত উপার্জন",
    withdrawalHistory: "উইথড্র হিস্ট্রি",
    noEarnings: "কোনো উপার্জন নেই",
    noEarningsDesc: "কমিশন পেতে আরও বুকিং সম্পূর্ণ করুন।",
    noWithdrawRequests: "কোনো উইথড্র রিকোয়েস্ট নেই",
    noWithdrawRequestsDesc: "আপনি এখনও কোনো কমিশন রিকোয়েস্ট করেননি।",
    requestId: "রিকোয়েস্ট আইডি",
    bookingId: "বুকিং আইডি",
    serviceAndClient: "সার্ভিস এবং ক্লায়েন্ট",
    amount: "অ্যামাউন্ট",
    status: "স্ট্যাটাস",
    adminNote: "অ্যাডমিন নোট",
    date: "তারিখ",
    actions: "অ্যাকশন",
    download: "ডাউনলোড",
    downloadReceipt: "রিসিট ডাউনলোড করুন",
    totalPrice: "মোট মূল্য",
    yourEarnings: "আপনার উপার্জন",
    pleaseWait: "অপেক্ষা করুন...",
    requestCommission: "কমিশন রিকোয়েস্ট করুন",
    pending: "অপেক্ষমান",
    approved: "অনুমোদিত",
    rejected: "বাতিল",
    allStatus: "সব স্ট্যাটাস",
    service: "সার্ভিস",
    client: "ক্লায়েন্ট",
  },
  en: {
    title: "Wallet & Earnings",
    subtitle: "Manage your commission and withdrawal requests.",
    downloadStatement: "Download Statement",
    accessDenied: "Access Denied",
    accessDeniedDesc: "This panel is restricted to Vendors only.",
    currentBalance: "Current Wallet Balance",
    commissionRate: "Commission Rate",
    perCompletedBooking: "Per completed booking",
    pendingWithdrawal: "Pending Withdrawal",
    totalApproved: "Total Approved (Lifetime)",
    readyForWithdrawal: "Earnings Ready for Withdrawal",
    withdrawalHistory: "Withdrawal History",
    noEarnings: "No earnings yet",
    noEarningsDesc: "Complete more bookings to earn commissions.",
    noWithdrawRequests: "No withdrawal requests",
    noWithdrawRequestsDesc: "You haven't requested any commissions yet.",
    requestId: "Request ID",
    bookingId: "Booking ID",
    serviceAndClient: "Service & Client",
    amount: "Amount",
    status: "Status",
    adminNote: "Admin Note",
    date: "Date",
    actions: "Actions",
    download: "Download",
    downloadReceipt: "Download Receipt",
    totalPrice: "Total Price",
    yourEarnings: "Your Earnings",
    pleaseWait: "Please wait...",
    requestCommission: "Request Commission",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    allStatus: "All Statuses",
    service: "Service",
    client: "Client",
  },
};

export default function VendorWalletPage() {
  const state = useVendorWalletState();
  const lang = useAppSelector((state) => state.lang.value);
  const t = translations[lang];

  if (!state.isAuthenticated || (state.normalizedRole !== "vendor" && state.normalizedRole !== "agent")) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{t.accessDenied}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{t.accessDeniedDesc}</p>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      rejected: "bg-[#FFF8F4] text-[#E0530A] border-[#FFF0EB]",
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock size={11} />,
      approved: <CheckCircle2 size={11} />,
      rejected: <XCircle size={11} />,
    };
    const cls = map[status] || "bg-slate-100 text-slate-600 border-slate-200";
    const translatedStatus: Record<string, string> = {
      pending: t.pending,
      approved: t.approved,
      rejected: t.rejected,
    };
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-xl border ${cls}`}>
        {icons[status]}
        {translatedStatus[status] || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: "id",
      header: t.requestId,
      render: (item: Withdraw) => <span className="text-slate-600 font-medium">#{item.id}</span>,
    },
    {
      key: "booking",
      header: t.bookingId,
      render: (item: Withdraw) => (
        <span className="text-slate-800 font-bold">{item.booking?.id ? `#${item.booking.id}` : "—"}</span>
      ),
    },
    {
      key: "service",
      header: t.serviceAndClient,
      render: (item: Withdraw) => (
        <div className="flex flex-col">
          <span className="text-slate-800 font-bold text-sm">
            {item.booking?.service?.name || item.booking?.pkg?.name || "—"}
          </span>
          <span className="text-xs text-slate-500">{item.booking?.user?.name || "—"}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: t.amount,
      render: (item: Withdraw) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          ৳{(item.amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: t.status,
      render: (item: Withdraw) => statusBadge(item.status),
    },
    {
      key: "admin_note",
      header: t.adminNote,
      render: (item: Withdraw) => (
        <span className="text-slate-500 text-xs truncate max-w-[150px] inline-block" title={item.admin_note}>
          {item.admin_note || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t.date,
      render: (item: Withdraw) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: t.actions,
      render: (item: Withdraw) => (
        <button
          onClick={() => printWithdrawInvoice(item)}
          className="flex items-center gap-1 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          title={t.downloadReceipt}
        >
          <FileText size={12} />
          <span>{t.download}</span>
        </button>
      ),
    },
  ];

  const withdrawableColumns = [
    {
      key: "id",
      header: t.bookingId,
      render: (item: any) => <span className="text-slate-600 font-bold">#{item.id}</span>,
    },
    {
      key: "service",
      header: t.serviceAndClient,
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="text-slate-800 font-bold text-sm">{item.service?.name || item.pkg?.name || t.service}</span>
          <span className="text-xs text-slate-500">{item.user?.name || t.client}</span>
        </div>
      ),
    },
    {
      key: "total_price",
      header: t.totalPrice,
      render: (item: any) => <span className="text-slate-600">৳{Number(item.total_price || 0).toLocaleString()}</span>,
    },
    {
      key: "earnings",
      header: t.yourEarnings,
      render: (item: any) => {
        let amount = 0;
        if (state.normalizedRole === "agent") {
          const agentCommission = Number(item.service?.agent_commission_percentage || 0);
          amount = Number(item.total_price || 0) * (agentCommission / 100);
        } else {
          const platformCut = state.commissionPct;
          const vendorSharePct = 100 - Number(platformCut);
          amount = Number(item.total_price || 0) * (vendorSharePct / 100);
        }
        return <span className="text-emerald-600 font-bold">৳{amount.toLocaleString()}</span>;
      },
    },
    {
      key: "actions",
      header: t.actions,
      render: (item: any) => (
        <button
          onClick={() => state.handleRequestWithdrawClick(item.id)}
          disabled={state.isRequesting}
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm shadow-[#FF6014]/20 disabled:opacity-50"
        >
          {state.isRequesting ? t.pleaseWait : t.requestCommission}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{t.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {state.withdraws && state.withdraws.length > 0 && (
            <button
              onClick={() => {
                const totalAmount = state.withdraws.reduce((sum, w) => sum + parseFloat(String(w.amount || 0)), 0);
                printAllWithdrawsInvoice(state.withdraws, totalAmount);
              }}
              className="flex items-center gap-2 bg-[#FFF8F4] border border-[#FF6014]/20 hover:bg-[#FF6014] hover:text-white text-[#FF6014] font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
            >
              <FileText size={16} />
              <span>{t.downloadStatement}</span>
            </button>
          )}
          <button
            onClick={() => state.refetchWithdraws()}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-200"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-2xl shadow-premium p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet size={80} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">
            {t.currentBalance}
          </p>
          <p className="text-4xl font-black mt-2 relative z-10">৳{state.walletBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.commissionRate}</p>
          <p className="text-3xl font-bold text-[#FF6014] mt-1">{state.commissionPct}%</p>
          <p className="text-xs text-slate-400 mt-1">{t.perCompletedBooking}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.pendingWithdrawal}</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">৳{state.totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalApproved}</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">৳{state.totalWithdrawn.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Methods Section */}
      <PaymentMethodsList
        gateways={state.gateways}
        isGatewaysLoading={state.isGatewaysLoading}
        setIsAddGatewayModalOpen={state.setIsAddGatewayModalOpen}
        handleDeleteGateway={state.handleDeleteGateway}
      />

      {/* Withdrawable Bookings Table */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t.readyForWithdrawal}</h2>
        {state.isBookingsLoading ? (
          <div className="flex items-center justify-center py-10 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : state.withdrawableBookings.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-sm">
            <h3 className="text-base font-bold text-slate-800">{t.noEarnings}</h3>
            <p className="text-sm text-slate-400 mt-1">{t.noEarningsDesc}</p>
          </div>
        ) : (
          <CustomTable
            columns={withdrawableColumns}
            data={state.withdrawableBookings}
            searchKey="id"
            filterKey=""
            filterOptions={[]}
            pageSize={5}
          />
        )}
      </div>

      {/* Withdrawal Requests Table */}
      <div className="pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t.withdrawalHistory}</h2>
        {state.isWithdrawsLoading ? (
          <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : state.withdraws.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
              <Wallet size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">{t.noWithdrawRequests}</h3>
            <p className="text-sm text-slate-400 mt-1">{t.noWithdrawRequestsDesc}</p>
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={state.withdraws}
            searchKey="status"
            filterKey="status"
            filterPlaceholder={t.allStatus}
            filterOptions={[
              { label: t.pending, value: "pending" },
              { label: t.approved, value: "approved" },
              { label: t.rejected, value: "rejected" },
            ]}
            pageSize={10}
          />
        )}
      </div>

      {/* Add Gateway Modal */}
      <AddGatewayModal
        isAddGatewayModalOpen={state.isAddGatewayModalOpen}
        setIsAddGatewayModalOpen={state.setIsAddGatewayModalOpen}
        newGatewayType={state.newGatewayType}
        setNewGatewayType={state.setNewGatewayType}
        newGatewayInfo={state.newGatewayInfo}
        setNewGatewayInfo={state.setNewGatewayInfo}
        handleAddGateway={state.handleAddGateway}
        isCreatingGateway={state.isCreatingGateway}
      />

      {/* Request Withdraw Modal */}
      <RequestWithdrawModal
        isWithdrawModalOpen={state.isWithdrawModalOpen}
        setIsWithdrawModalOpen={state.setIsWithdrawModalOpen}
        gateways={state.gateways}
        selectedGatewayId={state.selectedGatewayId}
        setSelectedGatewayId={state.setSelectedGatewayId}
        handleRequestWithdrawConfirm={state.handleRequestWithdrawConfirm}
        isRequesting={state.isRequesting}
      />
    </div>
  );
}
