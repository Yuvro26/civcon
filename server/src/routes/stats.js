import { Router } from "express";
import { Issue } from "../models/Issue.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

const RESOLVED = ["Resolved", "Closed"];
const IN_PROGRESS = ["Verified", "Assigned", "In Progress"];

// GET /api/stats  — admin dashboard summary
router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [total, pending, inProgress, resolved, today] = await Promise.all([
    Issue.countDocuments(),
    Issue.countDocuments({ status: "Pending" }),
    Issue.countDocuments({ status: { $in: IN_PROGRESS } }),
    Issue.countDocuments({ status: { $in: RESOLVED } }),
    Issue.countDocuments({ createdAt: { $gte: startOfDay } }),
  ]);

  res.json({ total, pending, in_progress: inProgress, resolved, today });
});

// GET /api/stats/categories  — counts grouped by category
router.get("/categories", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await Issue.aggregate([
    { $group: { _id: "$category", value: { $sum: 1 } } },
    { $project: { _id: 0, name: "$_id", value: 1 } },
    { $sort: { value: -1 } },
  ]);
  res.json({ categories: rows });
});

export default router;
