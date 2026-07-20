import type {
  Company, Branch, Asset, Engineer, Ticket, Fault, AuditLog, Notification,
  AssetCategory, TicketStatus, Priority, FaultCategory, Severity, NotificationKind,
} from "./types";

// Deterministic PRNG so seeds are stable across renders.
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

const INDUSTRIES = ["Banking", "Retail", "Logistics", "Healthcare", "Manufacturing", "Hospitality", "Education", "Telecom", "IT Services", "Real Estate"];
const CITIES = [
  ["Mumbai", "MH"], ["Delhi", "DL"], ["Bengaluru", "KA"], ["Chennai", "TN"], ["Pune", "MH"],
  ["Hyderabad", "TS"], ["Kolkata", "WB"], ["Ahmedabad", "GJ"], ["Jaipur", "RJ"], ["Chandigarh", "CH"],
  ["Lucknow", "UP"], ["Gurgaon", "HR"], ["Noida", "UP"], ["Kochi", "KL"], ["Indore", "MP"],
];
const FIRST = ["Aditi", "Rahul", "Priya", "Vikram", "Neha", "Arjun", "Kavya", "Rohit", "Sneha", "Karan", "Ananya", "Vivek", "Ishita", "Manish", "Deepa", "Sanjay", "Meera", "Nikhil", "Pooja", "Rajesh"];
const LAST = ["Sharma", "Verma", "Patel", "Iyer", "Menon", "Rao", "Kaur", "Singh", "Khan", "Das", "Ghosh", "Reddy", "Nair", "Bose", "Mehta"];
const SERVICES = ["Preventive Maintenance", "24×7 Monitoring", "Break-fix", "Installation", "Audit", "AMC Gold", "AMC Silver"];
const ASSET_CATEGORIES: AssetCategory[] = ["CCTV", "NVR", "Biometric", "Router", "Switch", "Server", "UPS"];
const MODEL_MAP: Record<AssetCategory, string[]> = {
  CCTV: ["Hikvision DS-2CD2143", "Dahua IPC-HDW3849", "CP Plus CP-VNC"],
  NVR: ["Hikvision DS-7616NI", "Dahua NVR4216", "CP Plus CP-UNR"],
  Biometric: ["ESSL K30", "Realtime T502", "Matrix COSEC"],
  Router: ["Cisco ISR-4331", "MikroTik CCR2004", "Ubiquiti ER-4"],
  Switch: ["Cisco Catalyst 2960", "TP-Link TL-SG3428", "HP Aruba 2530"],
  Server: ["Dell PowerEdge R750", "HPE ProLiant DL380", "Lenovo SR650"],
  UPS: ["APC Smart-UPS 3000", "Vertiv Liebert 5kVA", "Eaton 9PX 6kVA"],
};

const name = () => `${pick(FIRST)} ${pick(LAST)}`;
const initials = (n: string) => n.split(" ").map(p => p[0]).join("").slice(0, 2);
const phone = () => `+91 9${int(100000000, 999999999)}`;

// --- Engineers (40)
export const ENGINEERS: Engineer[] = Array.from({ length: 40 }, (_, i) => {
  const n = name();
  return {
    id: `ENG-${1000 + i}`,
    employeeId: `DGV-${2000 + i}`,
    name: n,
    initials: initials(n),
    experienceYears: int(1, 15),
    skillLevel: pick(["L1", "L2", "L2", "L3", "L3", "Lead"] as const),
    branchIds: [],
    currentTickets: int(0, 6),
    availability: pick(["available", "available", "on_job", "off_duty"] as const),
    rating: +(3.5 + rand() * 1.5).toFixed(1),
    compliance: int(78, 99),
    training: int(60, 100),
    attendance: int(85, 100),
    completedJobs: int(20, 320),
    monthlyScore: int(70, 98),
    phone: phone(),
    email: `${n.toLowerCase().replace(" ", ".")}@digivista.io`,
  };
});

// --- Companies (25) + Branches (60) + Assets (350)
export const COMPANIES: Company[] = [];
export const BRANCHES: Branch[] = [];
export const ASSETS: Asset[] = [];

for (let i = 0; i < 25; i++) {
  const cid = `CMP-${100 + i}`;
  const industry = pick(INDUSTRIES);
  const contactName = name();
  const branchCount = int(1, 4);
  const branchIds: string[] = [];
  for (let b = 0; b < branchCount && BRANCHES.length < 60; b++) {
    const [city, state] = pick(CITIES);
    const bid = `BR-${500 + BRANCHES.length}`;
    branchIds.push(bid);
    const eng = pick(ENGINEERS);
    if (!eng.branchIds.includes(bid)) eng.branchIds.push(bid);
    const assetIds: string[] = [];
    const assetCount = int(4, 8);
    for (let a = 0; a < assetCount && ASSETS.length < 350; a++) {
      const cat = pick(ASSET_CATEGORIES);
      const aid = `AST-${10000 + ASSETS.length}`;
      assetIds.push(aid);
      ASSETS.push({
        id: aid,
        category: cat,
        model: pick(MODEL_MAP[cat]),
        serial: `SN${int(10000000, 99999999)}`,
        companyId: cid,
        branchId: bid,
        warrantyUntil: daysAhead(int(30, 900)),
        installedOn: daysAgo(int(30, 1500)),
        engineerId: eng.id,
        status: pick(["operational", "operational", "operational", "maintenance", "faulty"] as const),
        health: int(55, 100),
        nextMaintenance: daysAhead(int(5, 120)),
        history: [
          { date: daysAgo(int(1, 30)), note: "Routine inspection completed" },
          { date: daysAgo(int(31, 120)), note: "Firmware updated" },
        ],
      });
    }
    BRANCHES.push({
      id: bid,
      companyId: cid,
      name: `${city} — ${pick(["Central", "North Zone", "South Zone", "HQ", "Tower A", "Wing B"])}`,
      code: `${state}-${100 + BRANCHES.length}`,
      city,
      state,
      address: `${int(1, 200)}, ${pick(["Sector", "Block", "Plot"])} ${int(1, 60)}, ${city}`,
      contactPerson: name(),
      phone: phone(),
      cameras: int(4, 48),
      nvrs: int(1, 4),
      assignedEngineerId: eng.id,
      assetIds,
      lastVisit: daysAgo(int(1, 45)),
      healthScore: int(60, 99),
      openTickets: int(0, 8),
    });
  }
  COMPANIES.push({
    id: cid,
    name: `${pick(["Meridian", "Aurora", "Solstice", "Vega", "Kinetic", "Zenith", "Helix", "Nimbus", "Cobalt", "Prism", "Vertex", "Radiant"])} ${pick(["Capital", "Retail", "Logistics", "Health", "Systems", "Industries", "Networks", "Group"])}`,
    industry,
    contact: contactName,
    phone: phone(),
    email: `${contactName.toLowerCase().replace(" ", ".")}@corp.io`,
    gst: `27${pick(["AA", "AB", "AC"])}BCD${int(1000, 9999)}E1Z${int(1, 9)}`,
    services: Array.from(new Set([pick(SERVICES), pick(SERVICES), pick(SERVICES)])),
    contractStatus: pick(["active", "active", "active", "expiring", "trial", "expired"] as const),
    healthScore: int(60, 98),
    customerSince: daysAgo(int(180, 1800)),
    branchIds,
    logoHue: int(180, 260),
  });
}

// --- Tickets (120)
const TICKET_STATUSES: TicketStatus[] = ["new", "assigned", "in_progress", "waiting_parts", "resolved", "closed", "cancelled"];
const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];
const TICKET_TITLES = [
  "Camera offline in main hall", "NVR not recording", "UPS battery alarm",
  "Switch port failure", "Biometric device unresponsive", "Router intermittent drops",
  "Server high temperature", "Recording gap detected", "PoE injector failure",
  "Firmware update required", "Network latency spike", "Access control not sync",
];
export const TICKETS: Ticket[] = Array.from({ length: 120 }, (_, i) => {
  const branch = pick(BRANCHES);
  const asset = pick(ASSETS.filter(a => a.branchId === branch.id));
  const eng = ENGINEERS.find(e => e.id === branch.assignedEngineerId)!;
  const status = pick(TICKET_STATUSES);
  return {
    id: `TCK-${5000 + i}`,
    title: pick(TICKET_TITLES),
    companyId: branch.companyId,
    branchId: branch.id,
    assetId: asset?.id,
    engineerId: status === "new" ? undefined : eng.id,
    status,
    priority: pick(PRIORITIES),
    sla: pick(["on_track", "on_track", "at_risk", "breached"] as const),
    createdAt: daysAgo(int(0, 30)),
    eta: daysAhead(int(0, 5)),
    description: "Reported by branch manager. Investigation in progress. See attachments and comments for details.",
    comments: [
      { at: daysAgo(int(0, 5)), author: eng.name, text: "On site. Running diagnostics now." },
      { at: daysAgo(int(0, 3)), author: branch.contactPerson, text: "Please prioritize — impacts daily operations." },
    ],
    attachments: [
      { name: "site.jpg", kind: "photo" },
      { name: "diagnostics.pdf", kind: "doc" },
    ],
  };
});

// --- Faults (60)
const FAULT_CATS: FaultCategory[] = ["Hardware", "Software", "Network", "Power", "Camera", "NVR"];
const SEVS: Severity[] = ["critical", "high", "medium", "low"];
export const FAULTS: Fault[] = Array.from({ length: 60 }, (_, i) => {
  const branch = pick(BRANCHES);
  const asset = pick(ASSETS.filter(a => a.branchId === branch.id));
  return {
    id: `FLT-${3000 + i}`,
    category: pick(FAULT_CATS),
    severity: pick(SEVS),
    branchId: branch.id,
    assetId: asset?.id,
    engineerId: branch.assignedEngineerId,
    rootCause: pick(["Power fluctuation", "Cable damage", "Firmware bug", "Hardware failure", "Configuration drift", "Environmental"]),
    resolutionTime: `${int(1, 12)}h ${int(0, 59)}m`,
    status: pick(["open", "investigating", "resolved", "resolved"] as const),
    reportedAt: daysAgo(int(0, 60)),
  };
});

// --- Audit logs (250)
const ACTIONS: AuditLog["action"][] = ["login", "edit", "delete", "role_change", "ticket_update", "verification", "asset_created", "company_added"];
export const AUDIT: AuditLog[] = Array.from({ length: 250 }, (_, i) => ({
  id: `LOG-${8000 + i}`,
  at: daysAgo(rand() * 30),
  actor: pick(ENGINEERS).name,
  action: pick(ACTIONS),
  entity: pick(["CMP-101", "BR-503", "AST-10023", "TCK-5011", "ENG-1004"]),
  detail: pick(["Updated status", "Signed in from Mumbai", "Changed role to Manager", "Removed record", "Created new record", "Submitted verification"]),
}));

// --- Notifications (100)
const NKIND: NotificationKind[] = ["ticket", "engineer", "asset", "verification", "analytics", "sla", "system"];
export const NOTIFICATIONS: Notification[] = Array.from({ length: 100 }, (_, i) => ({
  id: `NTF-${9000 + i}`,
  at: daysAgo(rand() * 10),
  kind: pick(NKIND),
  title: pick([
    "New ticket assigned to you",
    "SLA about to breach on TCK-5011",
    "Verification submitted for BR-504",
    "Engineer flagged as off-duty",
    "Asset warranty expiring in 30 days",
    "Monthly analytics report ready",
    "System backup completed",
  ]),
  body: "Tap to review details in the corresponding module.",
  read: i > 30,
}));
