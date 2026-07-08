import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, ShieldCheck, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/roles";
import { getWarehouseAnalytics, ANALYTICS, type RecentReview } from "@/lib/analytics/data";
import { RatingTrendChart } from "@/components/analytics/rating-trend-chart";
import { EngineerLeaderboardCards } from "@/components/analytics/engineer-leaderboard";
import { RecentReviewsTable } from "@/components/analytics/recent-reviews-table";
import { InsightsPanel } from "@/components/analytics/insights-panel";
import { ReviewDetailsDrawer } from "@/components/analytics/review-details-drawer";
import { StatCard } from "@/components/shell/stat-card";

export const Route = createFileRoute("/service-analytics/$warehouse")({
  head: () => ({
    meta: [{ title: "Warehouse Analytics — Digivista Console" }],
  }),
  component: WarehouseAnalyticsPage,
});

function WarehouseAnalyticsPage() {
  const { role } = useRole();
  const { warehouse } = Route.useParams();
  const data = useMemo(() => getWarehouseAnalytics(warehouse), [warehouse]);
  const [selected, setSelected] = useState<RecentReview | null>(null);
  const [open, setOpen] = useState(false);

  if (role !== "digivista_admin") return <Navigate to="/" />;
  if (!data) return <Navigate to="/service-analytics" />;

  return (
    <div>
      <PageHeader
        title={`${data.warehouse.name} — Warehouse Analytics`}
        description={`Region ${data.warehouse.region} · ${data.warehouse.reviews} reviews · ${data.warehouse.rating.toFixed(1)}★ average`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/service-analytics"><ArrowLeft className="size-3.5" /> Back to overview</Link>
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Reviews" value={String(data.warehouse.reviews)} icon={Star} />
        <StatCard label="Avg Rating" value={`${data.warehouse.rating.toFixed(1)} ★`} icon={Star} />
        <StatCard label="Protocol Compliance" value={`${data.compliance}%`} icon={ShieldCheck} />
        <StatCard label="Avg Resolution" value={data.avgResolution} icon={Clock} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <RatingTrendChart data={data.trend} />
          <RecentReviewsTable
            data={data.reviews.length ? data.reviews : ANALYTICS.reviews.slice(0, 3)}
            onOpen={(r) => { setSelected(r); setOpen(true); }}
          />
          <EngineerLeaderboardCards data={ANALYTICS.engineers.slice(0, 3)} />
        </div>
        <aside>
          <InsightsPanel
            insights={[
              `${data.warehouse.name} averages ${data.warehouse.rating.toFixed(1)}★ across ${data.warehouse.reviews} reviews.`,
              `Protocol compliance is currently ${data.compliance}% for this warehouse.`,
              `Average resolution time is ${data.avgResolution}.`,
              data.warehouse.health === "attention"
                ? "Trend indicates urgent attention required — allocate senior engineer coverage."
                : "Trend is stable — maintain current engineer rotation.",
            ]}
          />
        </aside>
      </div>

      <ReviewDetailsDrawer review={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
