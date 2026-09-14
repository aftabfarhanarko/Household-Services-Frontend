"use client";

import React from "react";
import Link from "next/link";
import { MoreVertical, Eye, ShieldCheck, XCircle, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { useAppSelector } from "@/redux/hooks";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
}

interface UserTableProps {
  users: UserItem[];
  role: string;
  openDropdownId: string | null;
  setOpenDropdownId: (val: string | null) => void;
  handleActivate: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleBlock: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function UserTable({
  users,
  role,
  openDropdownId,
  setOpenDropdownId,
  handleActivate,
  handleDeactivate,
  handleBlock,
  handleDelete,
}: UserTableProps) {
  const lang = useAppSelector((state) => state.lang.value);

  const t = {
    bn: {
      userDetails: "ইউজারের বিবরণ",
      id: "আইডি",
      role: "রোল",
      joinedDate: "যোগদানের তারিখ",
      status: "স্ট্যাটাস",
      actions: "অ্যাকশন",
      viewDetails: "বিবরণ দেখুন",
      activate: "সক্রিয় করুন",
      deactivate: "নিষ্ক্রিয় করুন",
      block: "ব্লক করুন",
      delete: "ডিলিট করুন",
      searchPlaceholder: "নাম দিয়ে ইউজার খুঁজুন...",
      filterPlaceholder: "সকল স্ট্যাটাস",
      active: "সক্রিয়",
      inactive: "নিষ্ক্রিয়",
      blocked: "ব্লকড",
    },
    en: {
      userDetails: "User Details",
      id: "ID",
      role: "Role",
      joinedDate: "Joined Date",
      status: "Status",
      actions: "Actions",
      viewDetails: "View Details",
      activate: "Activate",
      deactivate: "Deactivate",
      block: "Block",
      delete: "Delete",
      searchPlaceholder: "Search users by name...",
      filterPlaceholder: "All Statuses",
      active: "Active",
      inactive: "Inactive",
      blocked: "Blocked",
    },
  }[lang];

  const columns = [
    {
      key: "name",
      header: t.userDetails,
      render: (user: UserItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            {user.phone && user.phone !== "No Phone" && (
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "id",
      header: t.id,
      render: (user: UserItem) => <span className="font-mono text-slate-500 font-bold text-xs">{user.id}</span>,
    },
    {
      key: "role",
      header: t.role,
      render: (user: UserItem) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            user.role === "Customer" ? "bg-indigo-50 text-indigo-700" : "bg-teal-50 text-teal-700"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "joined",
      header: t.joinedDate,
    },
    {
      key: "status",
      header: t.status,
      render: (user: UserItem) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            user.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : user.status === "blocked"
              ? "bg-[#FFF8F4] text-[#E0530A]"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: t.actions,
      render: (user: UserItem) => (
        <div className="flex justify-end gap-1">
          <Link
            href={`/dashbord/users/${user.id}`}
            title={t.viewDetails}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye size={16} />
          </Link>

          {user.status !== "active" && (
            <button
              onClick={() => handleActivate(user.id)}
              title={t.activate}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck size={16} />
            </button>
          )}

          {user.status !== "inactive" && (
            <button
              onClick={() => handleDeactivate(user.id)}
              title={t.deactivate}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            >
              <XCircle size={16} />
            </button>
          )}

          {user.status !== "blocked" && (
            <button
              onClick={() => handleBlock(user.id)}
              title={t.block}
              className="p-1.5 text-slate-400 hover:text-[#E0530A] hover:bg-[#FFF8F4] rounded-lg transition-colors cursor-pointer"
            >
              <XCircle size={16} />
            </button>
          )}

          {role !== "agent" && (
            <button
              onClick={() => handleDelete(user.id)}
              title={t.delete}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder={t.searchPlaceholder}
      filterKey="status"
      filterPlaceholder={t.filterPlaceholder}
      filterOptions={[
        { label: t.active, value: "active" },
        { label: t.inactive, value: "inactive" },
        { label: t.blocked, value: "blocked" },
      ]}
      pageSize={5}
    />
  );
}
