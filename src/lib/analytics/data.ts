// Centralized analytics dataset. Every chart/kpi in the Service Analytics
// module reads from here. Replace `getAnalyticsData()` with a Supabase query
// later — the UI does not need to change.

export type WarehouseHealth = "excellent" | "average" | "attention";
export type ReviewStatus = "excellent" | "good" | "follow_up" | "critical";

export interface KPI {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  hint?: string;
}

export interface TrendPoint { month: string; rating: number; volume: number }
export interface BranchRating { branch: string; rating: number; reviews: number }
export interface EngineerScore { name: string; rating: number; reviews: number; compliance: number; badge?: "gold" | "silver" | "bronze" }
export interface ProtocolSlice { label: string; value: number }
export interface QualityFacet { facet: string; score: number }
export interface WarehouseCard { id: string; name: string; region: string; rating: number; reviews: number; health: WarehouseHealth }

export interface RecentReview {
  id: string;
  date: string;
  warehouse: string;
  manager: string;
  engineer: string;
  rating: number;
  status: ReviewStatus;
  review: string;
  answers: { question: string; answer: string }[];
  proofs: { name: string; kind: "photo" | "doc" }[];
  managerComment: string;
  ratings: { professionalism: number; communication: number; knowledge: number; behaviour: number; punctuality: number; safety: number };
  submittedAt: string;
}

export interface AnalyticsData {
  summary: { totalReviews: number; branchesCovered: number; averageRating: number; lastUpdated: string };
  kpis: KPI[];
  trend: TrendPoint[];
  branches: BranchRating[];
  protocol: ProtocolSlice[];
  engineers: EngineerScore[];
  resolution: ProtocolSlice[];
  recommendation: number;
  quality: QualityFacet[];
  warehouses: WarehouseCard[];
  reviews: RecentReview[];
  positiveWords: { word: string; count: number }[];
  complaints: { word: string; count: number }[];
  insights: string[];
}

const trend: TrendPoint[] = [
  { month: "Jan", rating: 4.1, volume: 28 },
  { month: "Feb", rating: 4.2, volume: 33 },
  { month: "Mar", rating: 4.3, volume: 41 },
  { month: "Apr", rating: 4.4, volume: 39 },
  { month: "May", rating: 4.5, volume: 46 },
  { month: "Jun", rating: 4.55, volume: 48 },
  { month: "Jul", rating: 4.6, volume: 49 },
];

const branches: BranchRating[] = [
  { branch: "Chandigarh", rating: 4.9, reviews: 62 },
  { branch: "Lucknow", rating: 4.8, reviews: 54 },
  { branch: "Karnal", rating: 4.4, reviews: 41 },
  { branch: "Gurgaon", rating: 4.3, reviews: 48 },
  { branch: "Himachal", rating: 4.1, reviews: 37 },
  { branch: "Jammu", rating: 3.6, reviews: 42 },
].sort((a, b) => b.rating - a.rating);

const engineers: EngineerScore[] = [
  { name: "Rahul", rating: 4.9, reviews: 128, compliance: 98, badge: "gold" },
  { name: "Mohit", rating: 4.8, reviews: 102, compliance: 96, badge: "silver" },
  { name: "Suresh", rating: 4.7, reviews: 88, compliance: 94, badge: "bronze" },
  { name: "Vipin", rating: 4.5, reviews: 71, compliance: 91 },
  { name: "Mahinder", rating: 4.3, reviews: 64, compliance: 89 },
];

const warehouses: WarehouseCard[] = [
  { id: "chd", name: "Chandigarh", region: "North", rating: 4.9, reviews: 62, health: "excellent" },
  { id: "lko", name: "Lucknow", region: "North", rating: 4.8, reviews: 54, health: "excellent" },
  { id: "krn", name: "Karnal", region: "North", rating: 4.4, reviews: 41, health: "average" },
  { id: "ggn", name: "Gurgaon", region: "NCR", rating: 4.3, reviews: 48, health: "average" },
  { id: "hp",  name: "Himachal", region: "North", rating: 4.1, reviews: 37, health: "average" },
  { id: "jmu", name: "Jammu", region: "North", rating: 3.6, reviews: 42, health: "attention" },
];

const reviews: RecentReview[] = [
  {
    id: "rev-2841",
    date: "Jul 08, 2026",
    warehouse: "Chandigarh",
    manager: "Priya Shah",
    engineer: "Rahul",
    rating: 5,
    status: "excellent",
    review: "Engineer arrived on time, resolved cooling issue quickly. Very professional.",
    answers: [
      { question: "Was the engineer on time?", answer: "Yes" },
      { question: "Was PPE used correctly?", answer: "Yes" },
      { question: "Was the site left clean?", answer: "Yes" },
      { question: "Was the issue fully resolved?", answer: "Yes" },
    ],
    proofs: [{ name: "before.jpg", kind: "photo" }, { name: "after.jpg", kind: "photo" }, { name: "report.pdf", kind: "doc" }],
    managerComment: "Excellent turnaround, would like Rahul on future critical tickets.",
    ratings: { professionalism: 5, communication: 5, knowledge: 5, behaviour: 5, punctuality: 5, safety: 5 },
    submittedAt: "2026-07-08T14:12:00Z",
  },
  {
    id: "rev-2840",
    date: "Jul 08, 2026",
    warehouse: "Lucknow",
    manager: "Anil Verma",
    engineer: "Mohit",
    rating: 4,
    status: "good",
    review: "Good service, could improve on communication updates during the visit.",
    answers: [
      { question: "Was the engineer on time?", answer: "Yes" },
      { question: "Was PPE used correctly?", answer: "Yes" },
      { question: "Was the site left clean?", answer: "Yes" },
      { question: "Was the issue fully resolved?", answer: "Yes" },
    ],
    proofs: [{ name: "site.jpg", kind: "photo" }, { name: "checklist.pdf", kind: "doc" }],
    managerComment: "Job done well, ask engineer to keep customer updated during work.",
    ratings: { professionalism: 4, communication: 3, knowledge: 5, behaviour: 4, punctuality: 5, safety: 5 },
    submittedAt: "2026-07-08T11:44:00Z",
  },
  {
    id: "rev-2839",
    date: "Jul 07, 2026",
    warehouse: "Jammu",
    manager: "Rakesh Sharma",
    engineer: "Vipin",
    rating: 2,
    status: "critical",
    review: "Parts were unavailable, resolution incomplete. Follow-up required.",
    answers: [
      { question: "Was the engineer on time?", answer: "Yes" },
      { question: "Was PPE used correctly?", answer: "Partial" },
      { question: "Was the site left clean?", answer: "Yes" },
      { question: "Was the issue fully resolved?", answer: "No" },
    ],
    proofs: [{ name: "faulty-unit.jpg", kind: "photo" }],
    managerComment: "Escalating — needs revisit within 48h with correct spares.",
    ratings: { professionalism: 3, communication: 2, knowledge: 3, behaviour: 3, punctuality: 4, safety: 3 },
    submittedAt: "2026-07-07T16:03:00Z",
  },
  {
    id: "rev-2838",
    date: "Jul 07, 2026",
    warehouse: "Karnal",
    manager: "Sunita Ahuja",
    engineer: "Suresh",
    rating: 4,
    status: "good",
    review: "Resolved quickly, small delay on arrival.",
    answers: [
      { question: "Was the engineer on time?", answer: "No" },
      { question: "Was PPE used correctly?", answer: "Yes" },
      { question: "Was the site left clean?", answer: "Yes" },
      { question: "Was the issue fully resolved?", answer: "Yes" },
    ],
    proofs: [{ name: "install.jpg", kind: "photo" }, { name: "signoff.pdf", kind: "doc" }],
    managerComment: "Good work overall.",
    ratings: { professionalism: 4, communication: 4, knowledge: 4, behaviour: 4, punctuality: 3, safety: 5 },
    submittedAt: "2026-07-07T09:20:00Z",
  },
  {
    id: "rev-2837",
    date: "Jul 06, 2026",
    warehouse: "Gurgaon",
    manager: "Deepak Rao",
    engineer: "Mahinder",
    rating: 3,
    status: "follow_up",
    review: "Issue partially fixed. Documentation missing at handover.",
    answers: [
      { question: "Was the engineer on time?", answer: "Yes" },
      { question: "Was PPE used correctly?", answer: "Yes" },
      { question: "Was the site left clean?", answer: "Partial" },
      { question: "Was the issue fully resolved?", answer: "Partial" },
    ],
    proofs: [{ name: "panel.jpg", kind: "photo" }],
    managerComment: "Please share updated service report.",
    ratings: { professionalism: 4, communication: 3, knowledge: 4, behaviour: 4, punctuality: 4, safety: 4 },
    submittedAt: "2026-07-06T15:48:00Z",
  },
];

export const ANALYTICS: AnalyticsData = {
  summary: { totalReviews: 284, branchesCovered: 42, averageRating: 4.6, lastUpdated: "Today • 2:14 PM" },
  kpis: [
    { label: "Overall Customer Satisfaction", value: "4.6 / 5", delta: "+4.2%", trend: "up", hint: "vs last month" },
    { label: "Protocol Compliance", value: "95%", hint: "Excellent" },
    { label: "Service Completion Rate", value: "98%", delta: "+1.1%", trend: "up" },
    { label: "Repeat Complaint Rate", value: "3%", delta: "-0.8%", trend: "down", hint: "Improved" },
    { label: "Average Resolution Time", value: "3h 42m", delta: "-22%", trend: "down" },
    { label: "Net Promoter Score", value: "84", hint: "Excellent" },
  ],
  trend,
  branches,
  protocol: [
    { label: "Excellent", value: 62 },
    { label: "Good", value: 24 },
    { label: "Average", value: 10 },
    { label: "Poor", value: 4 },
  ],
  engineers,
  resolution: [
    { label: "Resolved", value: 78 },
    { label: "Partially Resolved", value: 15 },
    { label: "Not Resolved", value: 7 },
  ],
  recommendation: 92,
  quality: [
    { facet: "Professionalism", score: 4.8 },
    { facet: "Communication", score: 4.2 },
    { facet: "Knowledge", score: 4.6 },
    { facet: "Behaviour", score: 4.7 },
    { facet: "Punctuality", score: 4.5 },
    { facet: "Safety", score: 4.9 },
  ],
  warehouses,
  reviews,
  positiveWords: [
    { word: "Professional", count: 142 },
    { word: "Fast", count: 118 },
    { word: "Helpful", count: 96 },
    { word: "Knowledgeable", count: 74 },
    { word: "Clean", count: 61 },
  ],
  complaints: [
    { word: "Delay", count: 34 },
    { word: "Communication", count: 27 },
    { word: "Parts", count: 21 },
    { word: "Cleanliness", count: 12 },
    { word: "Documentation", count: 9 },
  ],
  insights: [
    "Chandigarh has maintained 4.9★ satisfaction for 6 consecutive months.",
    "Protocol compliance decreased by 8% in Jammu — investigate spare-parts SLA.",
    "Engineer Rahul received the highest customer ratings this month.",
    "Average response time improved by 22% quarter-on-quarter.",
    "Customers most frequently praised professionalism and cleanliness.",
    "Communication ratings require improvement in Lucknow.",
  ],
};

export function getAnalyticsData(): AnalyticsData {
  // Later: replace with Supabase / REST query. UI stays unchanged.
  return ANALYTICS;
}

export function getWarehouseAnalytics(id: string) {
  const wh = ANALYTICS.warehouses.find((w) => w.id === id);
  if (!wh) return null;
  const wReviews = ANALYTICS.reviews.filter((r) => r.warehouse.toLowerCase() === wh.name.toLowerCase());
  return {
    warehouse: wh,
    reviews: wReviews,
    compliance: wh.health === "excellent" ? 96 : wh.health === "average" ? 88 : 72,
    avgResolution: wh.health === "excellent" ? "3h 12m" : wh.health === "average" ? "4h 05m" : "6h 20m",
    trend: trend.map((t) => ({ ...t, rating: Math.max(3, Math.min(5, t.rating + (wh.rating - 4.4))) })),
  };
}
