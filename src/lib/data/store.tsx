import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  COMPANIES, BRANCHES, ASSETS, ENGINEERS, TICKETS, FAULTS, AUDIT, NOTIFICATIONS,
} from "./seed";
import type {
  Company, Branch, Asset, Engineer, Ticket, Fault, AuditLog, Notification,
} from "./types";

interface CRUD<T> {
  items: T[];
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
}

function useCRUD<T extends { id: string }>(initial: T[]): CRUD<T> {
  const [items, setItems] = useState<T[]>(initial);
  return {
    items,
    add: useCallback((i: T) => setItems((p) => [i, ...p]), []),
    update: useCallback((id, patch) => setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x))), []),
    remove: useCallback((id) => setItems((p) => p.filter((x) => x.id !== id)), []),
    removeMany: useCallback((ids) => setItems((p) => p.filter((x) => !ids.includes(x.id))), []),
  };
}

interface Ctx {
  companies: CRUD<Company>;
  branches: CRUD<Branch>;
  assets: CRUD<Asset>;
  engineers: CRUD<Engineer>;
  tickets: CRUD<Ticket>;
  faults: CRUD<Fault>;
  audit: CRUD<AuditLog>;
  notifications: CRUD<Notification>;
}

const DataCtx = createContext<Ctx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const companies = useCRUD<Company>(COMPANIES);
  const branches = useCRUD<Branch>(BRANCHES);
  const assets = useCRUD<Asset>(ASSETS);
  const engineers = useCRUD<Engineer>(ENGINEERS);
  const tickets = useCRUD<Ticket>(TICKETS);
  const faults = useCRUD<Fault>(FAULTS);
  const audit = useCRUD<AuditLog>(AUDIT);
  const notifications = useCRUD<Notification>(NOTIFICATIONS);
  const value = useMemo(
    () => ({ companies, branches, assets, engineers, tickets, faults, audit, notifications }),
    [companies, branches, assets, engineers, tickets, faults, audit, notifications]
  );
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
