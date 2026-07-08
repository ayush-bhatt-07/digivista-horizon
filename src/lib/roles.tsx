import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Role =
  | "digivista_admin"
  | "corporate_admin"
  | "branch_manager"
  | "field_engineer";

export interface RoleProfile {
  id: Role;
  name: string;
  label: string;
  company: string;
  branch: string;
  initials: string;
  slaStatus: "on_track" | "at_risk" | "breached";
}

export const ROLE_PROFILES: Record<Role, RoleProfile> = {
  digivista_admin: {
    id: "digivista_admin",
    name: "Anika Rao",
    label: "Digivista Admin",
    company: "Digivista Infotech",
    branch: "Global HQ",
    initials: "AR",
    slaStatus: "on_track",
  },
  corporate_admin: {
    id: "corporate_admin",
    name: "Marcus Chen",
    label: "Corporate Admin",
    company: "Meridian Capital",
    branch: "All branches",
    initials: "MC",
    slaStatus: "at_risk",
  },
  branch_manager: {
    id: "branch_manager",
    name: "Priya Shah",
    label: "Branch Manager",
    company: "Meridian Capital",
    branch: "Mumbai — BKC",
    initials: "PS",
    slaStatus: "on_track",
  },
  field_engineer: {
    id: "field_engineer",
    name: "Diego Alvarez",
    label: "Field Engineer",
    company: "Assigned via ticket",
    branch: "Route: West Zone",
    initials: "DA",
    slaStatus: "breached",
  },
};

// Permissions — which modules each role can see.
export type ModuleKey =
  | "dashboard"
  | "companies"
  | "branches"
  | "assets"
  | "faults"
  | "tickets"
  | "service_verification"
  | "engineers"
  | "checklists"
  | "reports"
  | "notifications"
  | "audit"
  | "settings";

export const ROLE_MODULES: Record<Role, ModuleKey[]> = {
  digivista_admin: [
    "dashboard", "companies", "branches", "assets", "faults", "tickets",
    "service_verification", "engineers", "checklists", "reports",
    "notifications", "audit", "settings",
  ],
  corporate_admin: [
    "dashboard", "branches", "assets", "faults", "tickets",
    "service_verification", "checklists", "reports", "notifications", "settings",
  ],
  branch_manager: [
    "dashboard", "assets", "faults", "tickets", "service_verification",
    "checklists", "reports", "notifications",
  ],
  field_engineer: [
    "dashboard", "tickets", "checklists",
  ],
};

interface RoleContextValue {
  role: Role;
  profile: RoleProfile;
  modules: ModuleKey[];
  can: (m: ModuleKey) => boolean;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("digivista_admin");
  const value = useMemo<RoleContextValue>(() => {
    const modules = ROLE_MODULES[role];
    return {
      role,
      profile: ROLE_PROFILES[role],
      modules,
      can: (m) => modules.includes(m),
      setRole,
    };
  }, [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside <RoleProvider>");
  return ctx;
}
