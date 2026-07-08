// Data source abstraction — swap the impl below for Supabase / REST / CSV
// import without changing any UI component. Keep the Warehouse shape stable.

export interface Warehouse {
  name: string;
  code: string;
  location: string;
  contact: string;
  phone: string;
  cameras: number;
  nvrs: number;
}

const WAREHOUSE_DATA: Record<string, Omit<Warehouse, "name">> = {
  Chandigarh: {
    code: "CHD",
    location: "Plot No. 73 F, Industrial Area Phase-1, Chandigarh — 160002",
    contact: "Mr. Sandeep Tagra",
    phone: "9888106354",
    cameras: 16,
    nvrs: 2,
  },
  Gurgaon: {
    code: "HAR",
    location: "Khasra Nos. 97/16/2 Min., Village Kadipur, Sector 34, Gurgaon — 122001",
    contact: "Mr. Vipin Sharma",
    phone: "9996930202",
    cameras: 23,
    nvrs: 2,
  },
  Karnal: {
    code: "KNL",
    location: "GT Road, Industrial Estate, Karnal — 132001",
    contact: "Mr. Vipin Sharma",
    phone: "9996930202",
    cameras: 34,
    nvrs: 2,
  },
  Himachal: {
    code: "HP",
    location: "Baddi Industrial Area, Solan, Himachal Pradesh — 173205",
    contact: "Mr. Rakesh Verma",
    phone: "9418200110",
    cameras: 12,
    nvrs: 1,
  },
  Jammu: {
    code: "JMU",
    location: "SIDCO Industrial Complex, Bari Brahmana, Jammu — 181133",
    contact: "Mr. Arun Gupta",
    phone: "9419100220",
    cameras: 10,
    nvrs: 1,
  },
  Lucknow: {
    code: "LKO",
    location: "Transport Nagar, Kanpur Road, Lucknow — 226012",
    contact: "Mr. Anil Yadav",
    phone: "9415300330",
    cameras: 28,
    nvrs: 2,
  },
  Uttarakhand: {
    code: "UK",
    location: "SIDCUL Industrial Area, Pantnagar, Udham Singh Nagar — 263153",
    contact: "Mr. Deepak Rawat",
    phone: "9412400440",
    cameras: 20,
    nvrs: 2,
  },
};

export const WAREHOUSE_NAMES = Object.keys(WAREHOUSE_DATA);

// Async on purpose — makes swapping to Supabase/REST trivial.
export async function fetchWarehouse(name: string): Promise<Warehouse | null> {
  await new Promise((r) => setTimeout(r, 650)); // simulate network
  const row = WAREHOUSE_DATA[name];
  if (!row) return null;
  return { name, ...row };
}

// Types shared across the verification module
export interface ChecklistAnswers {
  onTime: "yes" | "no" | null;
  companyId: "yes" | "no" | null;
  safety: "excellent" | "good" | "average" | "poor" | null;
  resolved: "yes" | "partially" | "no" | null;
  cleaned: "yes" | "no" | null;
  successful: "yes" | "no" | null;
}

export interface EngineerRatings {
  professionalism: number;
  technicalKnowledge: number;
  communication: number;
  behaviour: number;
  punctuality: number;
}

export interface VerificationSubmission {
  warehouse: Warehouse;
  managerName: string;
  checklist: ChecklistAnswers;
  engineer: EngineerRatings;
  overallRating: number;
  recommend: "yes" | "no" | null;
  likelihood: number;
  comments: string;
  files: { name: string; size: number }[];
  declaration: boolean;
  signature: string;
  date: string;
  referenceId: string;
}
