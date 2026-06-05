export type IssueStatus =
  | "Pending"
  | "Verified"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Rejected"
  | "Closed";

export type IssuePriority = "Low" | "Medium" | "High";

export interface Issue {
  id: string;
  title: string;
  category: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  location: string;
  date: string;
  reporter: string;
  image?: string;
}

export const STATUS_STYLES: Record<IssueStatus, string> = {
  Pending: "bg-warning/15 text-warning border-warning/30",
  Verified: "bg-primary/15 text-primary border-primary/30",
  Assigned: "bg-accent/15 text-accent border-accent/30",
  "In Progress": "bg-primary/15 text-primary border-primary/30",
  Resolved: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Closed: "bg-muted text-muted-foreground border-border",
};

export const PRIORITY_STYLES: Record<IssuePriority, string> = {
  Low: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
};

export const CATEGORIES = [
  "Pothole",
  "Garbage",
  "Streetlight",
  "Water Leakage",
  "Drainage",
  "Road Damage",
  "Traffic Signal",
  "Public Property Damage",
  "Other",
];

export const TRACK_STAGES: IssueStatus[] = [
  "Pending",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

export const DEMO_ISSUES: Issue[] = [
  {
    id: "CC-2026-0481",
    title: "Large pothole near Market Junction",
    category: "Pothole",
    description: "Deep pothole causing traffic slowdowns and vehicle damage during peak hours.",
    status: "In Progress",
    priority: "High",
    location: "MG Road, Sector 14",
    date: "2026-05-28",
    reporter: "Aarav Sharma",
  },
  {
    id: "CC-2026-0479",
    title: "Streetlight not working for a week",
    category: "Streetlight",
    description: "Entire lane is dark at night, raising safety concerns for residents.",
    status: "Assigned",
    priority: "Medium",
    location: "Park Avenue, Block C",
    date: "2026-05-26",
    reporter: "Priya Nair",
  },
  {
    id: "CC-2026-0470",
    title: "Overflowing garbage bins",
    category: "Garbage",
    description: "Garbage not collected for several days, attracting stray animals.",
    status: "Resolved",
    priority: "Medium",
    location: "Lake View Colony",
    date: "2026-05-20",
    reporter: "Rohan Mehta",
  },
  {
    id: "CC-2026-0465",
    title: "Water leakage from main pipeline",
    category: "Water Leakage",
    description: "Continuous water leakage flooding the footpath and wasting water.",
    status: "Verified",
    priority: "High",
    location: "Station Road",
    date: "2026-05-18",
    reporter: "Sneha Kapoor",
  },
  {
    id: "CC-2026-0458",
    title: "Broken drainage cover",
    category: "Drainage",
    description: "Open drainage cover is a serious hazard for pedestrians.",
    status: "Pending",
    priority: "High",
    location: "Green Park Extension",
    date: "2026-05-15",
    reporter: "Vikram Singh",
  },
  {
    id: "CC-2026-0450",
    title: "Faulty traffic signal at crossing",
    category: "Traffic Signal",
    description: "Signal stuck on red, causing major congestion at the intersection.",
    status: "Closed",
    priority: "Medium",
    location: "Central Square",
    date: "2026-05-10",
    reporter: "Ananya Das",
  },
];

export const TRACK_TIMELINE = [
  { stage: "Submitted", date: "2026-05-28 09:14", note: "Complaint received and logged." },
  { stage: "Verified", date: "2026-05-28 14:30", note: "Issue verified by ward inspector." },
  { stage: "Assigned", date: "2026-05-29 10:05", note: "Assigned to Officer R. Kulkarni (PWD)." },
  { stage: "In Progress", date: "2026-05-30 08:45", note: "Repair crew dispatched to location." },
];

export const LEADERBOARD = [
  { name: "Aarav Sharma", reports: 48, points: 2340, badge: "City Hero" },
  { name: "Priya Nair", reports: 39, points: 1980, badge: "Gold Reporter" },
  { name: "Rohan Mehta", reports: 31, points: 1540, badge: "Gold Reporter" },
  { name: "Sneha Kapoor", reports: 24, points: 1180, badge: "Silver Reporter" },
  { name: "Vikram Singh", reports: 18, points: 860, badge: "Silver Reporter" },
  { name: "Ananya Das", reports: 12, points: 540, badge: "Bronze Reporter" },
];

export const CATEGORY_CHART = [
  { name: "Pothole", value: 320 },
  { name: "Garbage", value: 280 },
  { name: "Streetlight", value: 210 },
  { name: "Water", value: 160 },
  { name: "Drainage", value: 120 },
  { name: "Traffic", value: 90 },
];

export const TREND_CHART = [
  { month: "Jan", reported: 240, resolved: 180 },
  { month: "Feb", reported: 300, resolved: 250 },
  { month: "Mar", reported: 280, resolved: 240 },
  { month: "Apr", reported: 360, resolved: 320 },
  { month: "May", reported: 420, resolved: 380 },
  { month: "Jun", reported: 390, resolved: 360 },
];
