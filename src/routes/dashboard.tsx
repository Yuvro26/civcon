import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Bell,
  Plus,
  Award,
  TrendingUp,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { DEMO_ISSUES, STATUS_STYLES, PRIORITY_STYLES } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const STATS = [
  { icon: FileText, label: "Total Reported", value: 18, tone: "text-primary" },
  { icon: CheckCircle2, label: "Resolved", value: 11, tone: "text-success" },
  { icon: Clock, label: "Pending", value: 4, tone: "text-warning" },
  { icon: Eye, label: "Under Review", value: 3, tone: "text-accent" },
];

const NOTIFICATIONS = [
  { text: "Your complaint CC-2026-0481 is now In Progress.", time: "2h ago" },
  { text: "Officer assigned to CC-2026-0479.", time: "1d ago" },
  { text: "Complaint CC-2026-0470 marked Resolved 🎉", time: "3d ago" },
];

function Dashboard() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Aarav 👋</h1>
            <p className="mt-1 text-muted-foreground">Here's what's happening with your reports.</p>
          </div>
          <Button asChild variant="hero">
            <Link to="/report">
              <Plus className="h-4 w-4" /> Report New Issue
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={`h-5 w-5 ${s.tone}`} />
              </div>
              <div className="mt-2 text-3xl font-extrabold">{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent issues */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Link to="/track" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {DEMO_ISSUES.slice(0, 5).map((issue) => (
                <div
                  key={issue.id}
                  className="flex flex-col gap-2 rounded-xl border border-border/60 bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">{issue.id}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[issue.priority]}`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">{issue.category} • {issue.location}</p>
                  </div>
                  <span
                    className={`shrink-0 self-start rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[issue.status]}`}
                  >
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="mt-4 space-y-3">
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                    <p className="text-sm">{n.text}</p>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-warning" />
                <h2 className="text-lg font-semibold">Your Rewards</h2>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-gradient">2,340 pts</div>
                  <div className="text-xs text-muted-foreground">City Hero badge</div>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <Link
                to="/community"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                View leaderboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
