export type ID = string;

export type ContractStatus = "active" | "expiring" | "expired" | "trial";
export interface Company {
  id: ID;
  name: string;
  industry: string;
  contact: string;
  phone: string;
  email: string;
  gst: string;
  services: string[];
  contractStatus: ContractStatus;
  healthScore: number; // 0-100
  customerSince: string; // ISO date
  branchIds: ID[];
  logoHue: number;
}

export interface Branch {
  id: ID;
  companyId: ID;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  contactPerson: string;
  phone: string;
  cameras: number;
  nvrs: number;
  assignedEngineerId: ID;
  assetIds: ID[];
  lastVisit: string;
  healthScore: number;
  openTickets: number;
}

export type AssetCategory =
  | "CCTV" | "NVR" | "Biometric" | "Router" | "Switch" | "Server" | "UPS";
export type AssetStatus = "operational" | "maintenance" | "faulty" | "retired";
export interface Asset {
  id: ID;
  category: AssetCategory;
  model: string;
  serial: string;
  companyId: ID;
  branchId: ID;
  warrantyUntil: string;
  installedOn: string;
  engineerId: ID;
  status: AssetStatus;
  health: number;
  nextMaintenance: string;
  history: { date: string; note: string }[];
}

export type Availability = "available" | "on_job" | "off_duty";
export type SkillLevel = "L1" | "L2" | "L3" | "Lead";
export interface Engineer {
  id: ID;
  employeeId: string;
  name: string;
  initials: string;
  experienceYears: number;
  skillLevel: SkillLevel;
  branchIds: ID[];
  currentTickets: number;
  availability: Availability;
  rating: number;
  compliance: number;
  training: number;
  attendance: number;
  completedJobs: number;
  monthlyScore: number;
  phone: string;
  email: string;
}

export type TicketStatus =
  | "new" | "assigned" | "in_progress" | "waiting_parts" | "resolved" | "closed" | "cancelled";
export type Priority = "low" | "medium" | "high" | "critical";
export interface TicketComment { at: string; author: string; text: string }
export interface Ticket {
  id: ID;
  title: string;
  companyId: ID;
  branchId: ID;
  assetId?: ID;
  engineerId?: ID;
  status: TicketStatus;
  priority: Priority;
  sla: "on_track" | "at_risk" | "breached";
  createdAt: string;
  eta: string;
  description: string;
  comments: TicketComment[];
  attachments: { name: string; kind: "photo" | "doc" }[];
}

export type FaultCategory = "Hardware" | "Software" | "Network" | "Power" | "Camera" | "NVR";
export type Severity = "critical" | "high" | "medium" | "low";
export interface Fault {
  id: ID;
  category: FaultCategory;
  severity: Severity;
  branchId: ID;
  assetId?: ID;
  engineerId?: ID;
  rootCause: string;
  resolutionTime: string;
  status: "open" | "investigating" | "resolved";
  reportedAt: string;
}

export interface AuditLog {
  id: ID;
  at: string;
  actor: string;
  action: "login" | "edit" | "delete" | "role_change" | "ticket_update" | "verification" | "asset_created" | "company_added";
  entity: string;
  detail: string;
}

export type NotificationKind =
  | "ticket" | "engineer" | "asset" | "verification" | "analytics" | "sla" | "system";
export interface Notification {
  id: ID;
  at: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
}
