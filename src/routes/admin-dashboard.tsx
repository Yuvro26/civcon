import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Activity,
  BarChart3,
  UserCog,
  LogOut,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DEMO_ISSUES,
  STATUS_STYLES,
  CATEGORY_CHART,
  TREND_CHART,
} from "@/lib/demo-data";

export const Route = createFileRoute("/admin-dashboard")({
  component: AdminDashboard,
});

const NAV = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: FileText, label: "Complaints" },
  { icon: UserCog, label: "Officers" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Users" },
];

const STATS = [
  { icon: Users, label: "Total Users", value: "12,480", tone: "text-primary" },
  { icon: FileText, label: "Total Complaints", value: "48,200", tone: "text-accent" },
  { icon: CheckCircle2, label: "Resolved", value: "41,500", tone: "text-success" },
  { icon: Clock, label: "Pending", value: "3,210", tone: "text-warning" },
  { icon: Activity, label: "Active", value: "3,490", tone: "text-primary" },
];

const PIE_COLORS = [
  "oklch(0.7 0.16 215)",
  "oklch(0.62 0.2 285)",
  "oklch(0.72 0.17 158)",
  "oklch(0.8 0.16 75)",
  "oklch(0.62 0.22 18)",
  "oklch(0.68 0.03 255)",
];

function AdminDashboard() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar p-4 lg:flex">
        <div className="px-2 py-2">
          <Logo />
        </div>
        <nav className="mt-6 flex-1 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active === item.label
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <Button asChild variant="ghost" className="justify-start text-muted-foreground">
          <Link to="/">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </Button>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-x-hidden">
        <header className="glass sticky top-0 z-10 flex items-center justify-between border-b border-border/60 px-4 py-3 lg:px-8">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">City Operations Control Center</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
              A
            </span>
          </div>
        </header>

        <div className="space-y-8 p-4 lg:p-8">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5"
              >
                <s.icon className={`h-5 w-5 ${s.tone}`} />
                <div className="mt-3 text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass-card rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-sm font-semibold">Complaints vs Resolutions</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TREND_CHART}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 264 / 40%)" />
                    <XAxis dataKey="month" stroke="oklch(0.68 0.03 255)" fontSize={12} />
                    <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.2 0.035 264)",
                        border: "1px solid oklch(0.3 0.04 264)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reported"
                      stroke="oklch(0.7 0.16 215)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="oklch(0.72 0.17 158)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-sm font-semibold">Issues by Category</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_CHART}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {CATEGORY_CHART.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.2 0.035 264)",
                        border: "1px solid oklch(0.3 0.04 264)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Complaints table */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Complaints</h2>
              <Button variant="glass" size="sm">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs uppercase text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Title</th>
                    <th className="pb-3 pr-4 font-medium">Category</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ISSUES.map((issue) => (
                    <tr key={issue.id} className="border-b border-border/40">
                      <td className="py-3 pr-4 font-semibold text-primary">{issue.id}</td>
                      <td className="py-3 pr-4">{issue.title}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{issue.category}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[issue.status]}`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <Button variant="ghost" size="sm" className="text-primary">
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
