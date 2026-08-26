"use client";

import { useState } from "react";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation, useDeleteBookingMutation } from "@/redux/features/admin/booking";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { Briefcase, Clock, CheckCircle2, ShieldAlert } from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled" | "assigned" | "on_the_way";

export const STATUS_CONFIG: Record<BookingStatus, { label: string; pillBg: string; pillText: string; borderColor: string; iconBg: string; iconText: string; glowColor: string }> = {
  confirmed: { label: "Confirmed", pillBg: "bg-[#FFF8F4] border-[#FF6014]/20", pillText: "text-[#FF6014]", borderColor: "border-l-[#FF6014]", iconBg: "bg-[#FFF8F4]", iconText: "text-[#FF6014]", glowColor: "shadow-[0_0_15px_rgba(255,96,20,0.08)]" },
  assigned: { label: "Assigned", pillBg: "bg-blue-50/70 border-blue-100", pillText: "text-blue-600", borderColor: "border-l-blue-500", iconBg: "bg-blue-50", iconText: "text-blue-600", glowColor: "shadow-[0_0_15px_rgba(59,130,246,0.08)]" },
  on_the_way: { label: "On the way", pillBg: "bg-purple-50/70 border-purple-100", pillText: "text-purple-600", borderColor: "border-l-purple-500", iconBg: "bg-purple-50", iconText: "text-purple-600", glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.08)]" },
  pending: { label: "Pending", pillBg: "bg-amber-50/70 border-amber-100", pillText: "text-amber-600", borderColor: "border-l-amber-500", iconBg: "bg-amber-50", iconText: "text-amber-600", glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.08)]" },
  completed: { label: "Completed", pillBg: "bg-emerald-50/70 border-emerald-100", pillText: "text-emerald-600", borderColor: "border-l-emerald-500", iconBg: "bg-emerald-50", iconText: "text-emerald-600", glowColor: "shadow-[0_0_15px_rgba(16,185,129,0.08)]" },
  cancelled: { label: "Cancelled", pillBg: "bg-red-50/70 border-red-100", pillText: "text-red-500", borderColor: "border-l-red-500", iconBg: "bg-red-50", iconText: "text-red-500", glowColor: "shadow-[0_0_15px_rgba(239,68,68,0.08)]" },
};

export const FILTERS: { label: string; value: "all" | BookingStatus }[] = [
  { label: "All Bookings", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "On the way", value: "on_the_way" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function useBookingsState() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetAllBookingsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
  });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const bookings = bookingsRes?.data || [];

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await updateStatus({ id, status: "cancelled" }).unwrap();
      toast.success("Booking cancelled successfully.");
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: "cancelled" }));
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to cancel booking.");
    }
  };

  const executeDelete = async (id: number) => {
    try {
      await deleteBooking(id).unwrap();
      toast.success("Booking deleted successfully.");
      if (selectedBooking?.id === id) setSelectedBooking(null);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete booking.");
    }
  };

  const handleDelete = (id: number) => {
    toast.error("Are you sure you want to permanently delete this booking?", {
      description: "This action cannot be undone.",
      action: { label: "Confirm Delete", onClick: () => executeDelete(id) },
      duration: 6000,
    });
  };

  const filtered = bookings.filter((b: any) => {
    const matchFilter = activeFilter === "all" || b.status === activeFilter;
    const serviceName = b.nestedService?.name || b.pkg?.name || "";
    const vendorName = b.vendor?.name || "";
    const matchSearch = !search || serviceName.toLowerCase().includes(search.toLowerCase()) || vendorName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStats = () => {
    let pending = 0, completed = 0, cancelled = 0;
    bookings.forEach((b: any) => {
      if (b.status === "pending" || b.status === "assigned" || b.status === "on_the_way") pending++;
      if (b.status === "completed") completed++;
      if (b.status === "cancelled") cancelled++;
    });
    return [
      { label: "Total Bookings", value: bookings.length.toString(), sub: "All time records", icon: Briefcase, stripeColor: "bg-[#FF6014]", iconContainerColor: "bg-[#FFF8F4] border-[#FF6014]/15", iconColor: "text-[#FF6014]", gradient: "from-white via-white to-orange-50/15", borderColor: "hover:border-[#FF6014]/25", shadow: "hover:shadow-[0_20px_40px_rgba(255,96,20,0.05)]" },
      { label: "Upcoming", value: pending.toString(), sub: "In progress", icon: Clock, stripeColor: "bg-amber-500", iconContainerColor: "bg-amber-50 border-amber-500/15", iconColor: "text-amber-500", gradient: "from-white via-white to-amber-50/15", borderColor: "hover:border-amber-500/25", shadow: "hover:shadow-[0_20px_40px_rgba(245,158,11,0.05)]" },
      { label: "Completed", value: completed.toString(), sub: "Finished services", icon: CheckCircle2, stripeColor: "bg-emerald-500", iconContainerColor: "bg-emerald-50 border-emerald-500/15", iconColor: "text-emerald-500", gradient: "from-white via-white to-emerald-50/15", borderColor: "hover:border-emerald-500/25", shadow: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.05)]" },
      { label: "Cancelled", value: cancelled.toString(), sub: "Declined requests", icon: ShieldAlert, stripeColor: "bg-rose-500", iconContainerColor: "bg-rose-50 border-rose-500/15", iconColor: "text-rose-500", gradient: "from-white via-white to-rose-50/15", borderColor: "hover:border-rose-500/25", shadow: "hover:shadow-[0_20px_40px_rgba(244,63,94,0.05)]" },
    ];
  };

  return {
    isAuthenticated,
    isAuthLoading,
    isBookingsLoading,
    isUpdating,
    isDeleting,
    bookings,
    filtered,
    activeFilter,
    setActiveFilter,
    search,
    setSearch,
    selectedBooking,
    setSelectedBooking,
    handleCancel,
    handleDelete,
    getStats,
  };
}
