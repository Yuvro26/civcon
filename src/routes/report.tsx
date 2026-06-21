import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Upload,
  Send,
  Crosshair,
  X,
  Loader2,
  FileText,
  RotateCw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type IssuePriority } from "@/lib/demo-data";
import { useAuth } from "@/lib/auth";
import {
  createIssue,
  uploadIssueFile,
  removeIssueFile,
  validateFile,
  isImageType,
  MAX_FILES,
  type Attachment,
} from "@/lib/issues";

export const Route = createFileRoute("/report")({
  component: ReportIssue,
});

type FileStatus = "pending" | "uploading" | "done" | "error";

interface SelectedFile {
  id: string;
  file: File;
  previewUrl: string | null; // for images
  status: FileStatus;
  progress: number;
  attachment: Attachment | null;
}


const PRIORITIES: IssuePriority[] = ["Low", "Medium", "High"];

function ReportIssue() {
  const [priority, setPriority] = useState<IssuePriority>("Medium");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate({ to: "/login", search: { redirect: "/report" } });
    }
  }, [loading, isLoggedIn, navigate]);

  useEffect(() => {
    return () => {
      files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !isLoggedIn) return null;

  const updateFile = (id: string, patch: Partial<SelectedFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const uploadOne = async (item: SelectedFile) => {
    updateFile(item.id, { status: "uploading", progress: 0 });
    try {
      const attachment = await uploadIssueFile(item.file, (p) =>
        updateFile(item.id, { progress: p }),
      );
      updateFile(item.id, { status: "done", progress: 100, attachment });
    } catch {
      updateFile(item.id, { status: "error" });
      toast.error(`Could not upload "${item.file.name}". You can retry.`);
    }
  };

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);
    if (list.length === 0) return;

    setFiles((prev) => {
      const next = [...prev];
      for (const file of list) {
        if (next.length >= MAX_FILES) {
          toast.error("Maximum 4 files are allowed.");
          break;
        }
        const err = validateFile(file);
        if (err) {
          toast.error(err);
          continue;
        }
        const item: SelectedFile = {
          id: crypto.randomUUID(),
          file,
          previewUrl: isImageType(file.type) ? URL.createObjectURL(file) : null,
          status: "pending",
          progress: 0,
          attachment: null,
        };
        next.push(item);
        // kick off upload immediately
        void uploadOne(item);
      }
      return next;
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.attachment) void removeIssueFile(target.attachment.path).catch(() => {});
      return prev.filter((f) => f.id !== id);
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device.");
      return;
    }
    toast.loading("Detecting your location…", { id: "geo" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        toast.success("Location detected.", { id: "geo" });
      },
      () => toast.error("Could not detect location. Please enter it manually.", { id: "geo" }),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const resetForm = () => {
    files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    setTitle("");
    setCategory("");
    setPriority("Medium");
    setDescription("");
    setLocation("");
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Please enter an issue title.");
    if (!category) return toast.error("Please select a category.");
    if (!description.trim()) return toast.error("Please add a description.");

    if (files.some((f) => f.status === "uploading")) {
      return toast.error("Please wait for files to finish uploading.");
    }
    if (files.some((f) => f.status === "error")) {
      return toast.error("Some files failed to upload. Retry or remove them.");
    }

    const attachments = files
      .map((f) => f.attachment)
      .filter((a): a is Attachment => a !== null);

    setSubmitting(true);
    try {
      const issue = await createIssue(
        { title, category, priority, description, location },
        attachments,
      );

      toast.success(`Complaint submitted! Your ID is ${issue.ticket_id}.`);
      resetForm();
      navigate({ to: "/track", search: { id: issue.ticket_id } });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const anyUploading = files.some((f) => f.status === "uploading");
  const busy = submitting || anyUploading;
  const canAddMore = files.length < MAX_FILES;



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
          onSubmit={handleSubmit}
          className="glass-card mx-auto mt-12 max-w-3xl space-y-6 rounded-3xl p-6 sm:p-8"
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large pothole near Market Junction"
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory} required>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              <Button type="button" variant="glass" onClick={detectLocation}>
                <Crosshair className="h-4 w-4" /> Detect
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Upload Photo</Label>
            {!previewUrl ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-secondary/30 px-4 py-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <Upload className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Drag & drop or click to upload</span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG or WEBP • up to 10 MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img
                  src={previewUrl}
                  alt="Selected issue preview"
                  className="max-h-64 w-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 grid place-items-center bg-background/60">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={uploading}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-foreground shadow transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                Submit Complaint <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </SiteLayout>
  );
}
