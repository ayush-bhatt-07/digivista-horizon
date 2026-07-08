import {
  LayoutDashboard, Building2, Network, Cpu, AlertTriangle, TicketCheck,
  Wrench, ClipboardCheck, ClipboardList, FileBarChart, BarChart3, Bell, ShieldCheck, Settings,
  type LucideIcon,
} from "lucide-react";
import type { ModuleKey } from "./roles";

export interface NavItem {
  key: ModuleKey;
  label: string;
  to: string;
  icon: LucideIcon;
  group: "Operate" | "Manage" | "Insights" | "System";
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", to: "/", icon: LayoutDashboard, group: "Operate" },
  { key: "tickets", label: "Tickets", to: "/tickets", icon: TicketCheck, group: "Operate" },
  { key: "faults", label: "Faults", to: "/faults", icon: AlertTriangle, group: "Operate" },
  { key: "service_verification", label: "Service Verification", to: "/service-verification", icon: ClipboardList, group: "Operate" },
  { key: "checklists", label: "Checklists", to: "/checklists", icon: ClipboardCheck, group: "Operate" },

  { key: "companies", label: "Companies", to: "/companies", icon: Building2, group: "Manage" },
  { key: "branches", label: "Branches", to: "/branches", icon: Network, group: "Manage" },
  { key: "assets", label: "Assets", to: "/assets", icon: Cpu, group: "Manage" },
  { key: "engineers", label: "Engineers", to: "/engineers", icon: Wrench, group: "Manage" },

  { key: "reports", label: "Reports", to: "/reports", icon: FileBarChart, group: "Insights" },
  { key: "service_analytics", label: "Service Analytics", to: "/service-analytics", icon: BarChart3, group: "Insights" },
  { key: "audit", label: "Audit log", to: "/audit", icon: ShieldCheck, group: "Insights" },

  { key: "notifications", label: "Notifications", to: "/notifications", icon: Bell, group: "System" },
  { key: "settings", label: "Settings", to: "/settings", icon: Settings, group: "System" },
];
