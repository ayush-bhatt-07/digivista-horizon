import { createFileRoute, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Clock, MapPin, Sparkles, Star } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { useRole } from "@/lib/roles";
import { getAnalyticsData, type RecentReview } from "@/lib/analytics/data";
import { KPICards } from "@/components/analytics/kpi-cards";
import { RatingTrendChart } from "@/components/analytics/rating-trend-chart";
import { BranchPerformanceChart } from "@/components/analytics/branch-performance-chart";
import { ProtocolPieChart } from "@/components/analytics/protocol-pie-chart";
import { EngineerLeaderboardChart, EngineerLeaderboardCards } from "@/components/analytics/engineer-leaderboard";
import { ResolutionDonut } from "@/components/analytics/resolution-donut";
import { RecommendationGauge } from "@/components/analytics/recommendation-gauge";
import { FeedbackAreaChart } from "@/components/analytics/feedback-area-chart";
import { QualityRadarChart } from "@/components/analytics/quality-radar-chart";
import { WarehouseHeatmap } from "@/components/analytics/warehouse-heatmap";
import { RecentReviewsTable } from "@/components/analytics/recent-reviews-table";
import { CommentAnalysis } from "@/components/analytics/comment-analysis";
import { InsightsPanel } from "@/components/analytics/insights-panel";
import { FiltersBar, DEFAULT_FILTERS, type AnalyticsFilters } from "@/components/analytics/filters-bar";
import { ExportToolbar } from "@/components/analytics/export-toolbar";
import { ReviewDetailsDrawer } from "@/components/analytics/review-details-drawer";
import { toast } from "sonner";

export const Route = createFileRoute("/service-analytics")({
  head: () => ({
    meta: [
      { title: "Service Analytics — Digivista Console" },
      { name: "description", content: "Executive analytics for service verification: satisfaction, compliance, engineer performance." },
    ],
  }),
  component: ServiceAnalyticsPage,
});

function ServiceAnalyticsPage() {
  const { role } = useRole();
  const data = useMemo(() => getAnalyticsData(), []);
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<RecentReview | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (role !== "digivista_admin") {
    return <Navigate to="/" />;
  }

  const openReview = (r: RecentReview) => {
    setSelected(r);
    setDrawerOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Service Performance Analytics"
        description="Real-time KPI dashboard for customer satisfaction, engineer performance, protocol compliance and operational insights."
        actions={<ExportToolbar />}
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-card/60 p-3 backdrop-blur-sm sm:grid-cols-4"
      >
        <Meta icon={<Clock className="size-3.5" />} label="Last Updated" value={data.summary.lastUpdated} />
        <Meta icon={<Sparkles className="size-3.5" />} label="Total Reviews" value={String(data.summary.totalReviews)} />
        <Meta icon={<MapPin className="size-3.5" />} label="Branches Covered" value={String(data.summary.branchesCovered)} />
        <Meta icon={<Star className="size-3.5 fill-amber-400 stroke-amber-400" />} label="Average Rating" value={`${data.summary.averageRating} ★`} />
      </motion.div>

      <div className="mb-4">
        <FiltersBar
          value={filters}
          onChange={setFilters}
          onApply={() => toast.success("Filters applied", { description: "Charts refreshed with new filters." })}
          onReset={() => { setFilters(DEFAULT_FILTERS); toast.info("Filters reset"); }}
        />
      </div>

      <div className="mb-4">
        <KPICards kpis={data.kpis} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <RatingTrendChart data={data.trend} />
            <BranchPerformanceChart data={data.branches} />
            <ProtocolPieChart data={data.protocol} />
            <EngineerLeaderboardChart data={data.engineers} />
            <ResolutionDonut data={data.resolution} />
            <RecommendationGauge value={data.recommendation} />
            <FeedbackAreaChart data={data.trend} />
            <QualityRadarChart data={data.quality} />
          </div>

          <WarehouseHeatmap data={data.warehouses} />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <RecentReviewsTable data={data.reviews} onOpen={openReview} />
            <EngineerLeaderboardCards data={data.engineers} />
          </div>

          <CommentAnalysis positive={data.positiveWords} complaints={data.complaints} />
        </div>

        <aside className="xl:block">
          <InsightsPanel insights={data.insights} />
        </aside>
      </div>

      <ReviewDetailsDrawer review={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-8 place-items-center rounded-md bg-secondary text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}
