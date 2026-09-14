"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  BarChart3,
  LogOut,
  Menu,
  Briefcase,
  ClipboardList,
  CalendarCheck,
  LayoutDashboard,
  Compass,
  Headphones,
  Handshake,
  HardHat,
  BadgeCheck,
  ShieldCheck,
  Tag,
  Banknote,
  Heart,
  Wallet,
  User,
  UserPlus,
  HelpCircle,
  Zap,
  Percent,
  LayoutGrid,
  Calendar,
  Gift,
  Wrench,
  Layers,
  Package,
  MapPin,
  History,
  MessageSquare,
  Mail,
  Search,
  X,
  ChevronDown,
  Bot,
  Languages,
  Truck,
  Coins,
  Ticket,
  Shield,
  FileText,
  Receipt,
  PlusCircle,
  Trash2,
  Globe,
  Sparkles,
  BookOpen,
  UserCheck,
  ShoppingBag,
  Building2
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { UserRole, getRoleName, logout as authLogout } from "@/redux/features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toggleLanguage } from "@/redux/features/shared/langSlice";
import { useGetPublicCompanyBrandingQuery } from "@/redux/features/landing/landingApi";
import { formatImageUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SidebarGroup {
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: {
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
  }[];
}

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = (typeof rawRole === 'string' ? rawRole.toLowerCase().replace(/\s+/g, '') : "client") as UserRole;
  const roleName = getRoleName(role);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lang = useAppSelector((state) => state.lang.value);

  // Dynamic grouped menu items based on role (Accordion Tree structure)
  const getSidebarGroups = (userRole: UserRole): SidebarGroup[] => {
    const homeItem = { label: lang === "bn" ? "হোম পেজ" : "Home Page", icon: Building2, href: "/" };

    switch (userRole) {
      case "superadmin":
        return [
          homeItem,
          { label: lang === "bn" ? "ওভারভিউ" : "Overview", icon: LayoutDashboard, href: "/dashbord" },
          { label: lang === "bn" ? "এআই অ্যাডভাইজর" : "AI Advisor", icon: Bot, href: "/dashbord/analytics" },
          {
            label: lang === "bn" ? "অপারেশনস" : "Operations",
            icon: CalendarCheck,
            children: [
              { label: lang === "bn" ? "বুকিং ম্যানেজ করুন" : "Manage Bookings", href: "/dashbord/manage-bookings", icon: CalendarCheck },
              { label: lang === "bn" ? "কুইক বুকিং" : "Quick Booking", href: "/dashbord/quick-booking", icon: Zap },
              { label: lang === "bn" ? "উত্তোলনের অনুরোধসমূহ" : "Withdraw Requests", href: "/dashbord/withdraw", icon: Banknote }
            ]
          },
          {
            label: lang === "bn" ? "কাস্টম রিকোয়েস্ট" : "Custom Requests",
            icon: FileText,
            children: [
              { label: lang === "bn" ? "সার্ভিসেস রিকোয়েস্ট" : "Service Requests", href: "/dashbord/custom-requests", icon: Wrench },
              { label: lang === "bn" ? "হোম শিফটিং" : "Home Shifting", href: "/dashbord/custom-shifting", icon: Truck }
            ]
          },
          {
            label: lang === "bn" ? "ইউজার ডিরেক্টরি" : "User Directory",
            icon: Users,
            children: [
              { label: lang === "bn" ? "সুপার অ্যাডমিন" : "Super Admins", href: "/dashbord/superadmins", icon: ShieldCheck },
              { label: lang === "bn" ? "ক্লায়েন্ট ম্যানেজ করুন" : "Manage Clients", href: "/dashbord/users", icon: UserCheck },
              { label: lang === "bn" ? "ভেন্ডর ম্যানেজ করুন" : "Manage Vendors", href: "/dashbord/vendors", icon: HardHat },
              { label: lang === "bn" ? "এজেন্ট ম্যানেজ করুন" : "Manage Agents", href: "/dashbord/agents", icon: BadgeCheck },
              { label: lang === "bn" ? "কর্মচারী ম্যানেজ করুন" : "Manage Employees", href: "/dashbord/employees", icon: Users },
              { label: lang === "bn" ? "রোল ম্যানেজমেন্ট" : "Role Management", href: "/dashbord/role", icon: Shield }
            ]
          },
          {
            label: lang === "bn" ? "সার্ভিস ক্যাটালগ" : "Service Catalog",
            icon: Wrench,
            children: [
              { label: lang === "bn" ? "ক্যাটাগরিস" : "Categories", href: "/dashbord/category", icon: LayoutGrid },
              { label: lang === "bn" ? "লোকেশনসমূহ" : "Locations", href: "/dashbord/locations", icon: Compass },
              { label: lang === "bn" ? "সার্ভিসেস" : "Services", href: "/dashbord/services", icon: Wrench },
              { label: lang === "bn" ? "নেস্টেড সার্ভিসেস" : "Nested Services", href: "/dashbord/nested-services", icon: Layers },
              { label: lang === "bn" ? "প্যাকেজসমূহ" : "Packages", href: "/dashbord/packages", icon: Package }
            ]
          },
          {
            label: lang === "bn" ? "ল্যান্ডিং পেজ" : "Landing Page",
            icon: Globe,
            children: [
              { label: lang === "bn" ? "হিরো ম্যানেজমেন্ট" : "Hero Management", href: "/dashbord/hero", icon: Sparkles },
              { label: lang === "bn" ? "ব্লগ ম্যানেজমেন্ট" : "Blog Management", href: "/dashbord/blogs", icon: BookOpen },
              { label: lang === "bn" ? "কোম্পানি ব্র্যান্ডিং" : "Company Branding", href: "/dashbord/company-branding", icon: Building2 }
            ]
          },
          {
            label: lang === "bn" ? "মার্কেটিং" : "Marketing",
            icon: Tag,
            children: [
              { label: lang === "bn" ? "কুপনসমূহ" : "Coupons", href: "/dashbord/coupons", icon: Tag }
            ]
          },
          {
            label: lang === "bn" ? "ম্যানুয়াল ইনভয়েস" : "Manual Invoice",
            icon: Receipt,
            children: [
              { label: lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard", href: "/dashbord/manual-invoice", icon: LayoutDashboard },
              { label: lang === "bn" ? "নতুন ইনভয়েস" : "Create Invoice", href: "/dashbord/manual-invoice/create", icon: PlusCircle },
              { label: lang === "bn" ? "ক্লায়েন্ট ডিরেক্টরি" : "Client Directory", href: "/dashbord/manual-invoice/customers", icon: Users },
              { label: lang === "bn" ? "সার্ভিস ক্যাটালগ" : "Service Catalog", href: "/dashbord/manual-invoice/services", icon: Wrench },
              { label: lang === "bn" ? "ট্র্যাশ বিন" : "Trash Bin", href: "/dashbord/manual-invoice/trash", icon: Trash2 }
            ]
          },
          {
            label: lang === "bn" ? "সাপোর্ট ডেস্ক" : "Support Desk",
            icon: Headphones,
            children: [
              { label: lang === "bn" ? "টিকেট ম্যানেজমেন্ট" : "Ticket Management", href: "/dashbord/support-desk", icon: Ticket },
              { label: lang === "bn" ? "যোগাযোগ" : "Contacts", href: "/dashbord/contacts", icon: Headphones },
              { label: lang === "bn" ? "লাইভ চ্যাট" : "Live Chat", href: "/dashbord/live-chat", icon: MessageSquare },
              { label: lang === "bn" ? "এআই চ্যাট লগ" : "AI Chat Log", href: "/dashbord/ai-chat-log", icon: Bot },
            ]
          },
          {
            label: lang === "bn" ? "সেটিংস" : "Settings",
            icon: User,
            children: [
              { label: lang === "bn" ? "আমার প্রোফাইল" : "My Profile", href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "agent":
        return [
          homeItem,
          { label: lang === "bn" ? "ওভারভিউ" : "Overview", icon: LayoutDashboard, href: "/dashbord" },
          {
            label: lang === "bn" ? "অপারেশনস" : "Operations",
            icon: CalendarCheck,
            children: [
              { label: lang === "bn" ? "বুকিং ম্যানেজ করুন" : "Manage Bookings", href: "/dashbord/manage-bookings", icon: CalendarCheck },
              { label: lang === "bn" ? "কুইক বুকিং" : "Quick Booking", href: "/dashbord/quick-booking", icon: Zap },
              { label: lang === "bn" ? "কমিশনসমূহ" : "Commissions", href: "/dashbord/commissions", icon: Coins },
              { label: lang === "bn" ? "অর্ডারসমূহ" : "Orders", href: "/dashbord/orders", icon: ShoppingBag },
              { label: lang === "bn" ? "ওয়ালেট এবং উপার্জন" : "Wallet & Earnings", href: "/dashbord/vendor-wallet", icon: Wallet }
            ]
          },
          {
            label: lang === "bn" ? "ডিরেক্টরি" : "Directories",
            icon: Users,
            children: [
              { label: lang === "bn" ? "ক্লায়েন্ট ম্যানেজ করুন" : "Manage Clients", href: "/dashbord/users", icon: UserCheck },
              { label: lang === "bn" ? "সার্ভিসেস" : "Services", href: "/dashbord/services", icon: Wrench }
            ]
          },
          {
            label: lang === "bn" ? "ম্যানুয়াল ইনভয়েস" : "Manual Invoice",
            icon: Receipt,
            children: [
              { label: lang === "bn" ? "ড্যাশবোর্ড" : "Invoice Dashboard", href: "/dashbord/manual-invoice", icon: LayoutDashboard },
              { label: lang === "bn" ? "নতুন ইনভয়েস" : "Create Invoice", href: "/dashbord/manual-invoice/create", icon: PlusCircle },
              { label: lang === "bn" ? "ক্লায়েন্ট ডিরেক্টরি" : "Client Directory", href: "/dashbord/manual-invoice/customers", icon: Users },
              { label: lang === "bn" ? "সার্ভিস ক্যাটালগ" : "Service Catalog", href: "/dashbord/manual-invoice/services", icon: Wrench },
              { label: lang === "bn" ? "ট্র্যাশ বিন" : "Trash Bin", href: "/dashbord/manual-invoice/trash", icon: Trash2 }
            ]
          },
          {
            label: lang === "bn" ? "সাপোর্ট এবং প্রোফাইল" : "Support & Profile",
            icon: Headphones,
            children: [
              { label: lang === "bn" ? "লাইভ চ্যাট" : "Live Chat", href: "/dashbord/live-chat", icon: MessageSquare },
              { label: lang === "bn" ? "সাপোর্ট ডেস্ক" : "Support Desk", href: "/dashbord/support", icon: Headphones },
              { label: lang === "bn" ? "আমার প্রোফাইল" : "My Profile", href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "vendor":
        return [
          homeItem,
          { label: lang === "bn" ? "ওভারভিউ" : "Overview", icon: LayoutDashboard, href: "/dashbord" },
          {
            label: lang === "bn" ? "বুকিংস" : "Bookings",
            icon: CalendarCheck,
            children: [
              { label: lang === "bn" ? "বুকিং ম্যানেজ করুন" : "Manage Bookings", href: "/dashbord/manage-bookings", icon: CalendarCheck },
              { label: lang === "bn" ? "কাস্টম শিফটিং" : "Custom Shifting", href: "/dashbord/custom-shifting", icon: Truck },
              { label: lang === "bn" ? "ওয়ালেট এবং উপার্জন" : "Wallet & Earnings", href: "/dashbord/vendor-wallet", icon: Wallet }
            ]
          },
          {
            label: lang === "bn" ? "সার্ভিসেস" : "Services",
            icon: Wrench,
            children: [
              { label: lang === "bn" ? "আমার সার্ভিসেস" : "My Services", href: "/dashbord/vendor-services", icon: Wrench },
              { label: lang === "bn" ? "নেস্টেড সার্ভিসেস" : "Nested Services", href: "/dashbord/nested-services", icon: Layers },
              { label: lang === "bn" ? "প্যাকেজসমূহ" : "Packages", href: "/dashbord/vendor-packages", icon: Package }
            ]
          },
          {
            label: lang === "bn" ? "টিম এবং ক্লাইন্টস" : "Team & Clients",
            icon: Users,
            children: [
              { label: lang === "bn" ? "আমার কর্মচারীবৃন্দ" : "My Employees", href: "/dashbord/employees", icon: HardHat },
              { label: lang === "bn" ? "আমার ক্লাইন্টস" : "My Clients", href: "/dashbord/users", icon: UserCheck }
            ]
          },
          {
            label: lang === "bn" ? "সাপোর্ট এবং প্রোফাইল" : "Support & Profile",
            icon: Headphones,
            children: [
              { label: lang === "bn" ? "লাইভ চ্যাট" : "Live Chat", href: "/dashbord/live-chat", icon: MessageSquare },
              { label: lang === "bn" ? "আমার প্রোফাইল" : "My Profile", href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "client":
        return [
          homeItem,
          { label: lang === "bn" ? "ওভারভিউ" : "Overview", icon: LayoutDashboard, href: "/dashbord/overview" },
          { label: lang === "bn" ? "আমার বুকিংস" : "My Bookings", icon: CalendarCheck, href: "/dashbord/bookings" },
          { label: lang === "bn" ? "সংরক্ষিত সার্ভিসেস" : "Saved Services", icon: Heart, href: "/dashbord/saved" },
          { label: lang === "bn" ? "হেল্প সেন্টার" : "Help Center", icon: Headphones, href: "/dashbord/help" },
          { label: lang === "bn" ? "আমার প্রোফাইল" : "My Profile", icon: User, href: "/dashbord/profile" }
        ];
      default:
        return [];
    }
  };

  // Fuzzy / Multi-word Search Algorithm: Matches if ALL or ANY query words match label
  const isSearchMatch = (text: string, query: string) => {
    if (!query.trim()) return true;
    const cleanText = text.toLowerCase();
    const queryTokens = query.toLowerCase().trim().split(/\s+/);
    // Return true if every searched word token exists anywhere in the text
    return queryTokens.every(token => cleanText.includes(token));
  };

  // Filter sidebar groups based on search query
  const sidebarGroups = useMemo(() => {
    const groups = getSidebarGroups(role);
    if (!searchQuery.trim()) return groups;

    return groups
      .map(group => {
        if (group.children) {
          const matchedChildren = group.children.filter(child =>
            isSearchMatch(child.label, searchQuery) || isSearchMatch(child.href, searchQuery)
          );
          if (matchedChildren.length > 0) {
            return { ...group, children: matchedChildren };
          }
        }
        if (isSearchMatch(group.label, searchQuery) || (group.href && isSearchMatch(group.href, searchQuery))) {
          return group;
        }
        return null;
      })
      .filter((g): g is SidebarGroup => g !== null);
  }, [role, searchQuery, lang]);

  // Auto-expand group that contains active link or matching search
  useEffect(() => {
    const groups = getSidebarGroups(role);
    if (searchQuery.trim()) {
      const matchedGroup = groups.find(group =>
        isSearchMatch(group.label, searchQuery) ||
        group.children?.some(c => isSearchMatch(c.label, searchQuery) || isSearchMatch(c.href, searchQuery))
      );
      if (matchedGroup) {
        setExpandedGroup(matchedGroup.label);
      }
    } else {
      const activeGroup = groups.find(group =>
        group.children?.some(child => pathname === child.href)
      );
      if (activeGroup) {
        setExpandedGroup(activeGroup.label);
      }
    }
  }, [pathname, role, searchQuery, lang]);

  const handleLogout = () => {
    dispatch(authLogout());
  };

  const { data: brandingRes, isLoading: isBrandingLoading } = useGetPublicCompanyBrandingQuery();
  const rawCompanyLogo = brandingRes?.data?.logoUrl || "/rajshiblogo.png";
  const companyLogo = formatImageUrl(rawCompanyLogo);
  const companyName = brandingRes?.data?.companyName || "Rajseba";

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      <div
        className={`bg-white text-slate-800 border-r-[2px] border-[#FF6014]/15 shadow-[6px_0_24px_rgba(0,0,0,0.015)] transition-all duration-300 flex flex-col h-screen fixed inset-y-0 left-0 z-[60] md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${collapsed ? "w-20" : "w-64"} overflow-hidden`}
      >
        {/* Repeating background icons pattern inside sidebar */}
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />

        {/* Brand Header */}
        <div className="p-5 flex items-start justify-between border-b border-slate-100 relative z-10">
          <Link href="/" className="flex flex-col items-start gap-2">
            <div className="relative max-h-11 max-w-[170px] min-w-[60px] min-h-[32px] flex items-center justify-start">
              {isBrandingLoading ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6014]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className={collapsed ? "h-8 w-8 object-contain shrink-0" : "max-h-11 w-auto max-w-[170px] object-contain object-left shrink-0"}
                />
              )}
            </div>
            {!collapsed && (
              <span className="text-[9px] text-[#FF6014] font-black tracking-wider uppercase bg-[#FF6014]/5 border border-[#FF6014]/20 px-2.5 py-0.5 rounded-full shrink-0">
                {roleName}
              </span>
            )}
          </Link>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2 relative z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder={lang === "bn" ? "মেনু খুঁজুন..." : "Search menu..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 placeholder:text-slate-400/80 outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all shadow-sm focus:shadow-[0_0_20px_-3px_rgba(255,96,20,0.15)]"
              />
            </div>
          </div>
        )}

        {/* Accordion Tree Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-sidebar-scrollbar relative z-10">
          {sidebarGroups.map((group, index) => {
            const hasChildren = group.children && group.children.length > 0;
            const isExpanded = expandedGroup === group.label;

            // Check if active item is inside this group
            const containsActive = hasChildren && group.children?.some(c => pathname === c.href);
            const isDirectActive = !hasChildren && group.href && pathname === group.href;

            const handleToggle = () => {
              if (hasChildren) {
                setExpandedGroup(isExpanded ? null : group.label);
              }
            };

            return (
              <div key={index} className="space-y-1">
                {/* Parent Row Button / Link */}
                {group.href ? (
                  <Link
                    href={group.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border relative ${isDirectActive
                      ? "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white font-extrabold shadow-md shadow-[#FF6014]/20 scale-[1.01] border-transparent"
                      : "border-transparent text-slate-600 hover:bg-[#FF6014]/5 hover:text-[#FF6014] hover:translate-x-1 font-semibold"
                      }`}
                  >
                    {isDirectActive && (
                      <div className="absolute left-1.5 w-1 h-5 bg-white rounded-full" />
                    )}
                    <group.icon size={18} className={isDirectActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                    {!collapsed && <span className="text-[14px]">{group.label}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={handleToggle}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group border relative ${containsActive
                      ? isExpanded
                        ? "bg-[#FF6014]/5 border-[#FF6014]/15 text-[#FF6014] font-extrabold shadow-sm"
                        : "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white font-extrabold shadow-md shadow-[#FF6014]/20 scale-[1.01] border-transparent"
                      : "border-transparent text-slate-600 hover:bg-[#FF6014]/5 hover:text-[#FF6014] hover:translate-x-1 font-semibold"
                      }`}
                  >
                    {containsActive && isExpanded && (
                      <div className="absolute left-1.5 w-1 h-5 bg-[#FF6014] rounded-full" />
                    )}
                    {containsActive && !isExpanded && (
                      <div className="absolute left-1.5 w-1 h-5 bg-white rounded-full" />
                    )}
                    <div className="flex items-center gap-3">
                      <group.icon
                        size={18}
                        className={
                          containsActive
                            ? isExpanded
                              ? "text-[#FF6014]"
                              : "text-white"
                            : "text-slate-400 group-hover:text-slate-600 transition-colors"
                        }
                      />
                      {!collapsed && <span className="text-[14px]">{group.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${containsActive
                          ? isExpanded
                            ? "text-[#FF6014]/70"
                            : "text-white/70"
                          : "text-slate-400"
                          } ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                )}

                {/* Collapsible Sub-menu (Tree branch hierarchy) */}
                {hasChildren && group.children && (
                  <AnimatePresence initial={false}>
                    {isExpanded && !collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="relative pl-6 space-y-1 overflow-hidden"
                      >
                        {/* Parent vertical timeline trunk */}
                        <div className="absolute left-[27px] top-0 bottom-4 w-[1.5px] bg-[#FF6014]/25" />

                        {group.children.map((child, cIdx) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={cIdx}
                              href={child.href}
                              onClick={onClose}
                              className={`flex items-center gap-2.5 pl-9 pr-3 py-2 rounded-xl text-[13px] font-bold transition-all relative group border ${isChildActive
                                ? "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white shadow-md shadow-[#FF6014]/15 border-transparent scale-[1.01]"
                                : "border-transparent text-slate-500 hover:bg-[#FF6014]/5 hover:text-[#FF6014] hover:translate-x-1.5"
                                }`}
                            >
                              {/* Branch hook curve SVG-style path connector */}
                              <div className="absolute left-[27px] top-0 w-3.5 h-[20px] border-l-[1.5px] border-b-[1.5px] border-[#FF6014]/30 rounded-bl-lg pointer-events-none" />

                              {isChildActive && (
                                <div className="absolute left-[25px] top-[12px] w-1.5 h-1.5 bg-[#FF7C71] rounded-full ring-2 ring-white z-10" />
                              )}

                              {child.icon && (
                                <child.icon
                                  size={14}
                                  className={isChildActive ? "text-white shrink-0" : "text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"}
                                />
                              )}
                              <span className="truncate">{child.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>



        {/* Bottom Language & Logout Controls (Premium Glass Card) */}
        <div className="p-3 border-t border-slate-100 bg-gradient-to-b from-white/40 to-slate-50/60 relative z-10 space-y-1.5">
          <button
            onClick={() => dispatch(toggleLanguage())}
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-700 hover:text-[#FF6014] w-full rounded-2xl bg-white border border-slate-200/70 hover:border-[#FF6014]/25 hover:bg-[#FFF8F4] transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl bg-slate-100 group-hover:bg-[#FF6014]/10 text-slate-500 group-hover:text-[#FF6014] transition-colors shrink-0">
              <Languages size={16} />
            </div>
            {!collapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="text-xs font-black text-slate-800 group-hover:text-[#FF6014] truncate transition-colors">
                  {lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
                </span>
                <span className="text-[9px] font-black text-[#FF6014] uppercase tracking-wider bg-[#FFF8F4] border border-[#FF6014]/20 px-2 py-0.5 rounded-full shrink-0 ml-1">
                  {lang === "bn" ? "EN" : "বাং"}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:text-rose-600 w-full rounded-2xl bg-white border border-slate-200/70 hover:border-rose-200 hover:bg-rose-50/50 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl bg-slate-100 group-hover:bg-rose-100/80 text-slate-500 group-hover:text-rose-600 transition-colors shrink-0">
              <LogOut size={16} />
            </div>
            {!collapsed && (
              <span className="text-xs font-black text-slate-700 group-hover:text-rose-600 transition-colors">
                {lang === "bn" ? "লগআউট" : "Logout"}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}