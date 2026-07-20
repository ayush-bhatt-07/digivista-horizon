# Digivista Console — Full Module Expansion

Turn every sidebar item into a real, production-feeling page. Existing modules (Dashboard, Service Verification, Service Analytics) stay untouched. Design system, sidebar, header, tokens, PDF branding — unchanged.

## Approach

1. **Centralized mock dataset** — one file per entity under `src/lib/data/`, all cross-referenced by IDs so Company → Branch → Asset → Ticket → Verification stays consistent. Types live in `src/lib/data/types.ts`. A single `src/lib/data/seed.ts` generates the realistic volumes (25 companies, 60 branches, 350 assets, 40 engineers, 120 tickets, 300 service reports, 250 audit logs, 100 notifications) deterministically so refresh is stable.
2. **Reusable enterprise primitives** in `src/components/data/`:
   - `DataTable` (sortable columns, row selection, bulk-action bar, pagination, empty state, skeleton loading)
   - `FilterBar` (search + multi-select facets + date range + reset)
   - `EntityDrawer` (right-side detail panel with tabs)
   - `ConfirmDialog`, `EmptyState`, `PageTabs`, `KanbanBoard`, `StatPill`
3. **One route file per module** under `src/routes/`, each using the primitives above. Detail pages use dynamic segments (e.g. `companies.$id.tsx`) with tabbed profiles.
4. **CRUD** is local (mutates in-memory store via a tiny `useEntityStore` hook backed by React state + a module-level store) with toast confirmation — swap to Supabase later without touching the UI.

## Modules to build

| Route | Content |
|---|---|
| `/companies` | Table + card toggle, search/filter, Add/Edit/Delete dialogs |
| `/companies/$id` | Tabs: Overview, Branches, Assets, Engineers, Tickets, Service History, Documents, Timeline, Notes |
| `/branches` | Table with company filter, health score, CRUD |
| `/branches/$id` | Branch detail with assets + tickets |
| `/assets` | Table + card views, category filter, detail drawer, QR/barcode placeholders |
| `/engineers` | Card grid + list toggle, filters |
| `/engineers/$id` | Profile with performance, tickets, training |
| `/tickets` | Table + Kanban + Calendar tab views, Create Ticket dialog |
| `/tickets/$id` | Ticket detail with timeline, comments, attachments |
| `/faults` | Table with severity/category filters |
| `/checklists` | Templates list + a live checklist form |
| `/reports` | Report picker with export (reuse existing branded PDF) |
| `/audit` | Filterable, searchable audit log table |
| `/notifications` | Center with tabs (Unread/Read/All), mark-all-read |
| `/settings` | Preferences skeleton (theme, profile, integrations) |

## Sidebar / nav

Existing sidebar already lists every module; just make sure every entry has a matching route file and remove any placeholder text.

## Technical notes

- All new routes use `createFileRoute` with `head()` metadata, error/not-found components, and role gating via `useRole()` (respect `ROLE_MODULES`).
- Mock store: `src/lib/data/store.ts` exposes `useCompanies()`, `useBranches()`, etc. — each returns `{items, add, update, remove}` and persists in `useState` at provider level (`DataProvider` mounted in `__root.tsx`).
- Tables: TanStack Table is heavy; use a lightweight in-house `DataTable` on top of shadcn `Table` to stay consistent.
- Kanban: framer-motion drag between columns updating ticket status locally.
- Skeletons: shadcn `Skeleton`, shown for ~300ms on mount to feel real.
- No new dependencies required (all already installed: framer-motion, lucide, shadcn, sonner, recharts, jspdf).

## Out of scope

- Real backend / Supabase wiring (structure is ready, but no Cloud enable).
- Redesign of Dashboard, Service Verification, Service Analytics.
- Real QR/barcode generation — placeholder SVG only.

## Deliverable

~30 new files across `src/lib/data/`, `src/components/data/`, and `src/routes/`. One large batched build, then a typecheck pass.
