import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star, CheckCircle2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { LEADERBOARD } from "@/lib/demo-data";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — CivicConnect" },
      { name: "description", content: "Leaderboard, rewards, and resolved issues from the community." },
      { property: "og:title", content: "CivicConnect Community" },
      { property: "og:description", content: "Celebrating citizens who make cities better." },
    ],
  }),
  component: Community,
});

const RESOLVED = [
  { title: "Pothole on MG Road repaired", location: "Sector 14", days: "4 days" },
  { title: "Streetlights restored in Block C", location: "Park Avenue", days: "6 days" },
  { title: "Garbage collection resumed", location: "Lake View Colony", days: "2 days" },
  { title: "Drainage cover replaced", location: "Green Park", days: "3 days" },
];

const BADGES = [
  { icon: Medal, label: "Bronze Reporter", tone: "text-amber-600" },
  { icon: Medal, label: "Silver Reporter", tone: "text-slate-300" },
  { icon: Award, label: "Gold Reporter", tone: "text-warning" },
  { icon: Trophy, label: "City Hero", tone: "text-primary" },
];

function Community() {
  return (
    <SiteLayout>
      <div className="py-8">
        <PageHeader
          eyebrow="Community"
          title="Citizens making real change"
          subtitle="Earn points and badges for every issue you report, verify, and help resolve."
        />

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-4 lg:grid-cols-3">
          {/* Leaderboard */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              <h2 className="text-lg font-semibold">Top Contributors</h2>
            </div>
            <div className="mt-5 space-y-2">
              {LEADERBOARD.map((u, i) => (
                <motion.div
                  key={u.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-secondary/30 p-3"
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                      i < 3 ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.reports} reports • {u.badge}</div>
                  </div>
                  <span className="text-sm font-bold text-gradient">{u.points} pts</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                <h2 className="text-lg font-semibold">Reward Badges</h2>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {BADGES.map((b) => (
                  <div
                    key={b.label}
                    className="rounded-xl border border-border/60 bg-secondary/30 p-4 text-center"
                  >
                    <b.icon className={`mx-auto h-7 w-7 ${b.tone}`} />
                    <div className="mt-2 text-xs font-medium">{b.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Earn points when you report, verify, and resolve issues. Points unlock badges.
              </p>
            </div>
          </div>
        </div>

        {/* Resolved feed */}
        <div className="mx-auto mt-12 max-w-6xl px-4">
          <h3 className="text-xl font-bold">Recently Resolved</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESOLVED.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl p-5"
              >
                <CheckCircle2 className="h-5 w-5 text-success" />
                <h4 className="mt-3 text-sm font-semibold">{r.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{r.location}</p>
                <span className="mt-3 inline-block rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                  Resolved in {r.days}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
