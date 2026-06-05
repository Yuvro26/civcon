import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CheckCircle2, Circle, Clock } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEMO_ISSUES,
  TRACK_STAGES,
  TRACK_TIMELINE,
  STATUS_STYLES,
  PRIORITY_STYLES,
} from "@/lib/demo-data";

export const Route = createFileRoute("/track")({
  component: TrackIssue,
});

function TrackIssue() {
  const [query, setQuery] = useState("CC-2026-0481");
  const [issue, setIssue] = useState(DEMO_ISSUES[0]);

  const currentIndex = TRACK_STAGES.indexOf(issue.status);

  const handleSearch = () => {
    const found = DEMO_ISSUES.find((i) => i.id.toLowerCase() === query.trim().toLowerCase());
    if (found) setIssue(found);
  };

  return (
    <SiteLayout>
      <div className="py-8">
        <PageHeader
          eyebrow="Track"
          title="Track Your Complaint"
          subtitle="Enter your Complaint ID to see live status and timeline."
        />

        <div className="mx-auto mt-10 max-w-2xl px-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CC-2026-0481"
                className="pl-9"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="hero" onClick={handleSearch}>
              Track
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Try: {DEMO_ISSUES.map((i) => i.id).slice(0, 3).join(", ")}
          </p>
        </div>

        <motion.div
          key={issue.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-10 grid max-w-5xl gap-6 px-4 lg:grid-cols-5"
        >
          {/* Details */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{issue.id}</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[issue.status]}`}
              >
                {issue.status}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{issue.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{issue.description}</p>

            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Category" value={issue.category} />
              <Row label="Priority">
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[issue.priority]}`}
                >
                  {issue.priority}
                </span>
              </Row>
              <Row label="Location">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {issue.location}
                </span>
              </Row>
              <Row label="Reported on" value={issue.date} />
              <Row label="Officer" value="R. Kulkarni (PWD)" />
            </dl>
          </div>

          {/* Progress + timeline */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-3">
            <h4 className="text-sm font-semibold">Status Progress</h4>
            <div className="mt-5 flex items-center">
              {TRACK_STAGES.map((stage, i) => {
                const done = i <= currentIndex;
                return (
                  <div key={stage} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`grid h-8 w-8 place-items-center rounded-full border text-xs ${
                          done
                            ? "border-primary bg-gradient-primary text-primary-foreground"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <span className="mt-1.5 w-16 text-center text-[10px] text-muted-foreground">
                        {stage}
                      </span>
                    </div>
                    {i < TRACK_STAGES.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 ${i < currentIndex ? "bg-primary" : "bg-border"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <h4 className="mt-8 text-sm font-semibold">Activity Timeline</h4>
            <ol className="mt-4 space-y-4">
              {TRACK_TIMELINE.map((t) => (
                <li key={t.stage} className="flex gap-3">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{t.stage}</span>
                      <span className="text-xs text-muted-foreground">{t.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children ?? value}</dd>
    </div>
  );
}
