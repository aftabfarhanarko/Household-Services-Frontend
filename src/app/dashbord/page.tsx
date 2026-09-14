"use client";

import { useAppSelector } from "@/redux/hooks";

// Import Modular Dashboard Components
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import AgentDashboard from "./components/AgentDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import CustomerDashboard from "./components/CustomerDashboard";

export default function DashboardPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "client";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";

  switch (role) {
    case "superadmin":
    case "admin":
      return <SuperAdminDashboard />;
    case "agent":
      return <AgentDashboard />;
    case "vendor":
    case "provider":
      return <ProviderDashboard />;
    case "client":
    default:
      return <CustomerDashboard />;
  }
}