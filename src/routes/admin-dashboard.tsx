import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAdminAuth, adminLogout } from "@/lib/auth";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_STYLES, type IssueStatus } from "@/lib/demo-data";
import { useAllIssues, type IssueRow } from "@/lib/issues";
import { supabase } from "@/integrations/supabase/client";

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

const STATUS_OPTIONS: IssueStatus[] = [
  "Pending",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved",
  "Rejected",
  "Closed",
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
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminAuth();
  const { issues, loading: issuesLoading } = useAllIssues(isAdmin);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/admin" });
  }, [loading, isAdmin, navigate]);

  const handleSignOut = async () => {
    await adminLogout();
    toast.success("Signed out of admin");
    navigate({ to: "/admin" });
  };

  const stats = useMemo(() => {
    const resolved = issues.filter((i) => ["Resolved", "Closed"].includes(i.status)).length;
    const pending = issues.filter((i) => i.status === "Pending").length;
    const inProgress = issues.filter((i) => ["Verified", "Assigned", "In Progress"].includes(i.status)).length;
    const today = issues.filter(
      (i) => new Date(i.created_at).toDateString() === new Date().toDateString(),
    ).length;
    return [
      { icon: FileText, label: "Total Complaints", value: issues.length, tone: "text-primary" },
      { icon: CheckCircle2, label: "Resolved", value: resolved, tone: "text-success" },
      { icon: Clock, label: "Pending", value: pending, tone: "text-warning" },
      { icon: Activity, label: "In Progress", value: inProgress, tone: "text-accent" },
      { icon: BarChart3, label: "Today", value: today, tone: "text-primary" },
    ];
  }, [issues]);

  const categoryChart = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of issues) map.set(i.category, (map.get(i.category) ?? 0) + 1);
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [issues]);

  const trendChart = useMemo(() => {
    const months: { key: string; month: string; reported: number; resolved: number }[] = [];
    const now = new Date();
    for (let m = 5; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleDateString(undefined, { month: "short" }),
        reported: 0,
        resolved: 0,
      });
    }
    const idx = new Map(months.map((x, i) => [x.key, i]));
    for (const i of issues) {
      const c = new Date(i.created_at);
      const k = `${c.getFullYear()}-${c.getMonth()}`;
      const at = idx.get(k);
      if (at !== undefined) {
        months[at].reported += 1;
        if (["Resolved", "Closed"].includes(i.status)) months[at].resolved += 1;
      }
    }
    return months;
  }, [issues]);

  const updateStatus = async (issue: IssueRow, status: string) => {
    const { error } = await supabase.from("issues").update({ status }).eq("id", issue.id);
    if (error) {
      toast.error("Could not update status. Please try again.");
    } else {
      toast.success(`${issue.ticket_id} marked ${status}.`);
    }
  };

  if (loading || !isAdmin) return null;

  const hasData = issues.length > 0;

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
        <Button variant="ghost" className="justify-start text-muted-foreground" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign out
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
            {stats.map((s, i) => (
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
              {hasData ? (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 264 / 40%)" />
                      <XAxis dataKey="month" stroke="oklch(0.68 0.03 255)" fontSize={12} />
                      <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.2 0.035 264)",
                          border: "1px solid oklch(0.3 0.04 264)",
                          borderRadius: 12,
                          color: "#fff",
                        }}
                      />
                      <Line type="monotone" dataKey="reported" stroke="oklch(0.7 0.16 215)" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="resolved" stroke="oklch(0.72 0.17 158)" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyChart />
              )}
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-sm font-semibold">Issues by Category</h2>
              {hasData ? (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryChart} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                        {categoryChart.map((_, i) => (
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
              ) : (
                <EmptyChart />
              )}
            </div>
          </div>

          {/* Complaints table */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Complaints</h2>
            </div>
            {issuesLoading ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Loading complaints…</p>
            ) : !hasData ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No complaints have been submitted yet.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs uppercase text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">ID</th>
                      <th className="pb-3 pr-4 font-medium">Title</th>
                      <th className="pb-3 pr-4 font-medium">Category</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => (
                      <tr key={issue.id} className="border-b border-border/40">
                        <td className="py-3 pr-4 font-semibold text-primary">{issue.ticket_id}</td>
                        <td className="py-3 pr-4">{issue.title}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{issue.category}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                              STATUS_STYLES[issue.status as IssueStatus] ?? ""
                            }`}
                          >
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <Select value={issue.status} onValueChange={(v) => updateStatus(issue, v)}>
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="mt-4 grid h-64 place-items-center text-center text-sm text-muted-foreground">
      <span>Statistics will appear once reports are submitted.</span>
    </div>
  );
}
