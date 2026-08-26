"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";

export type BookingStatus = "All" | "Pending" | "Assigned" | "On The Way" | "Completed" | "Cancelled";

export const STATUS_MAP: Record<string, BookingStatus> = {
  pending: "Pending",
  assigned: "Assigned",
  on_the_way: "On The Way",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_TEXT: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  on_the_way: "On the way",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function useClientBookingsState() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const authUser = useAppSelector((state) => state.auth.user);
  const [filter, setFilter] = useState<BookingStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery(undefined, {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
  });

  const allBookings = bookingsRes?.data || [];
  const myBookings = allBookings.filter((b: any) => {
    const userId = authUser?.id || authUser?._id;
    return b.user?.id === userId || b.user?.id === Number(userId);
  });

  const filteredBookings = myBookings.filter((b: any) => {
    const matchesFilter = filter === "All" || (STATUS_MAP[b.status] || "Pending") === filter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;

    const serviceName = (b.nestedService?.name || b.pkg?.name || "").toLowerCase();
    const vendorName = (b.vendor?.name || "").toLowerCase();
    const bookingId = (b.id || "").toString().toLowerCase();

    const matchesSearch = serviceName.includes(q) || vendorName.includes(q) || bookingId.includes(q);
    return matchesFilter && matchesSearch;
  });

  return {
    role,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    myBookings,
    filteredBookings,
  };
}
