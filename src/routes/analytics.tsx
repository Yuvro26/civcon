import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { CATEGORY_CHART, TREND_CHART } from "@/lib/demo-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — CivicConnect" },
      { name: "description", content: "Interactive analytics on civic complaints and resolutions." },
      { property: "og:title", content: "CivicConnect Analytics" },
      { property: "og:description", content: "Trends, categories, and resolution insights." },
    ],
  }),
  component: Analytics,
});

const PIE_COLORS = [
  "oklch(0.7 0.16 215)",
  "oklch(0.62 0.2 285)",
  "oklch(0.72 0.17 158)",
  "oklch(0.8 0.16 75)",
  "oklch(0.62 0.22 18)",
  "oklch(0.68 0.03 255)",
];

const RESOLUTION = [
  { week: "W1", days: 6.2 },
  { week: "W2", days: 5.4 },
  { week: "W3", days: 4.8 },
  { week: "W4", days: 4.1 },
  { week: "W5", days: 3.6 },
];

const tooltipStyle = {
  background: "oklch(0.2 0.035 264)",
  border: "1px solid oklch(0.3 0.04 264)",
  borderRadius: 12,
  color: "#fff",
};

function Analytics() {
  return (
    <SiteLayout>
      <div className="py-8">
        <PageHeader
          eyebrow="Analytics"
          title="City insights & trends"
          subtitle="Understand complaint patterns and track resolution performance over time."
        />

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Complaint Trends</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 264 / 40%)" />
                  <XAxis dataKey="month" stroke="oklch(0.68 0.03 255)" fontSize={12} />
                  <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="reported" stroke="oklch(0.7 0.16 215)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="resolved" stroke="oklch(0.72 0.17 158)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Issues by Category</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 264 / 40%)" />
                  <XAxis dataKey="name" stroke="oklch(0.68 0.03 255)" fontSize={11} />
                  <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.3 0.04 264 / 30%)" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {CATEGORY_CHART.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Avg. Resolution Time (days)</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RESOLUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 264 / 40%)" />
                  <XAxis dataKey="week" stroke="oklch(0.68 0.03 255)" fontSize={12} />
                  <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="days" stroke="oklch(0.62 0.2 285)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Category Share</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_CHART} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                    {CATEGORY_CHART.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
