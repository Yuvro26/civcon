import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Upload, Send, Image as ImageIcon, Crosshair } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type IssuePriority } from "@/lib/demo-data";

export const Route = createFileRoute("/report")({
  component: ReportIssue,
});

const PRIORITIES: IssuePriority[] = ["Low", "Medium", "High"];

function ReportIssue() {
  const [priority, setPriority] = useState<IssuePriority>("Medium");
  const [location, setLocation] = useState("");

  return (
    <SiteLayout>
      <div className="py-8">
        <PageHeader
          eyebrow="Report"
          title="Report a Civic Issue"
          subtitle="Provide a few details and we'll route it to the right authority."
        />

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Complaint submitted! Your ID is CC-2026-0482 (demo).");
          }}
          className="glass-card mx-auto mt-12 max-w-3xl space-y-6 rounded-3xl p-6 sm:p-8"
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Issue Title</Label>
            <Input id="title" placeholder="e.g. Large pothole near Market Junction" required />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      priority === p
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              rows={4}
              placeholder="Describe the issue, when you noticed it, and how it affects the area."
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Location</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter address or use GPS"
                  className="pl-9"
                />
              </div>
              <Button
                type="button"
                variant="glass"
                onClick={() => {
                  setLocation("MG Road, Sector 14 (auto-detected)");
                  toast.success("Location detected via GPS (demo).");
                }}
              >
                <Crosshair className="h-4 w-4" /> Detect
              </Button>
            </div>
            <div className="mt-2 grid h-40 place-items-center rounded-xl border border-dashed border-border bg-secondary/30 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Map preview (integration ready)
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Upload Photos</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-8 text-center transition-colors hover:border-primary/40">
              <Upload className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Drag & drop or click to upload</span>
              <span className="text-xs text-muted-foreground">
                Multiple images supported • Stored on AWS S3 (integration ready)
              </span>
              <input type="file" multiple accept="image/*" className="hidden" />
            </label>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid h-16 w-16 place-items-center rounded-lg border border-border bg-secondary/40 text-muted-foreground"
                >
                  <ImageIcon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full">
            Submit Complaint <Send className="h-4 w-4" />
          </Button>
        </motion.form>
      </div>
    </SiteLayout>
  );
}
