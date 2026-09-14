"use client";

import React from "react";
import { Wrench, Globe, Tag, User, Sparkles, Eye, Edit2, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import type { TableAction } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Service } from "@/redux/features/admin/service";
import { useAppSelector } from "@/redux/hooks";

interface ServiceTableProps {
  services: Service[];
  role: string;
  openEditModal: (item: Service) => void;
  openDeleteModal: (item: Service) => void;
}

export default function ServiceTable({
  services,
  role,
  openEditModal,
  openDeleteModal,
}: ServiceTableProps) {
  const router = useRouter();
  const lang = useAppSelector((state) => state.lang.value);

  const t = {
    bn: {
      serviceName: "সার্ভিসের নাম",
      slug: "স্লাগ",
      category: "ক্যাটাগরি",
      vendor: "ভেন্ডর",
      agentCommission: "এজেন্ট কমিশন",
      created: "তৈরির তারিখ",
      viewDetails: "বিবরণ দেখুন",
      edit: "এডিট",
      delete: "ডিলিট",
      searchPlaceholder: "সার্ভিস খুঁজুন...",
    },
    en: {
      serviceName: "Service Name",
      slug: "Slug",
      category: "Category",
      vendor: "Vendor",
      agentCommission: "Agent Commission",
      created: "Created Date",
      viewDetails: "View Details",
      edit: "Edit",
      delete: "Delete",
      searchPlaceholder: "Search services...",
    },
  }[lang];

  const columns = [
    {
      key: "name",
      header: t.serviceName,
      render: (item: Service) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-rose-100/40">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Wrench size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: t.slug,
      render: (item: Service) => (
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 font-mono font-bold text-xs px-2.5 py-1 rounded-xl">
          <Globe size={11} />
          {item.slug}
        </span>
      ),
    },
    {
      key: "category",
      header: t.category,
      render: (item: Service | any) => (
        <span className="inline-flex items-center gap-1.5 bg-indigo-50/70 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-indigo-100/50">
          <Tag size={11} />
          {item.category?.name || (item.category_id ? `Cat #${item.category_id}` : "—")}
        </span>
      ),
    },
    {
      key: "vendor",
      header: t.vendor,
      render: (item: Service | any) => (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50/70 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          <User size={11} />
          {item.vendor?.name || (item.vendor_id ? `Vendor #${item.vendor_id}` : "—")}
        </span>
      ),
    },
    {
      key: "commission",
      header: t.agentCommission,
      render: (item: Service | any) => (
        <span className="inline-flex items-center gap-1.5 bg-amber-50/70 text-amber-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-amber-100/50">
          <Sparkles size={11} />
          {item.agent_commission_percentage ? `${item.agent_commission_percentage}%` : "0%"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t.created,
      render: (item: Service) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const tableActions: TableAction<Service>[] = [
    {
      label: t.viewDetails,
      icon: Eye,
      onClick: (item) => router.push(`/dashbord/services/${item.id || (item as any)._id}`),
      variant: "default",
    },
    ...(role === "superadmin"
      ? [
          { label: t.edit, icon: Edit2, onClick: openEditModal, variant: "secondary" as const },
          { label: t.delete, icon: Trash2, onClick: openDeleteModal, variant: "destructive" as const },
        ]
      : []),
  ];

  return (
    <CustomTable
      columns={columns}
      data={services}
      actions={tableActions}
      searchKey="name"
      searchPlaceholder={t.searchPlaceholder}
      pageSize={10}
    />
  );
}
