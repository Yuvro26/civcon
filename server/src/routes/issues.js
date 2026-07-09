import { Router } from "express";
import { Issue } from "../models/Issue.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/issues  — create a new report (auth required)
router.post("/", requireAuth, async (req, res) => {
  const { title, category, priority, description, location, imageUrl, attachments, isAnonymous } =
    req.body || {};
  if (!title) return res.status(400).json({ error: "Title is required" });

  const issue = new Issue({
    title,
    category,
    priority,
    description,
    location,
    imageUrl,
    attachments,
    isAnonymous: Boolean(isAnonymous),
    userId: req.user._id,
  });
  await issue.save();
  res.status(201).json({ issue });
});

// GET /api/issues  — admins see all, users see their own
router.get("/", requireAuth, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { userId: req.user._id };
  const issues = await Issue.find(filter).sort({ createdAt: -1 });
  res.json({ issues });
});

// GET /api/issues/track/:ticketId  — public lookup by ticket id
router.get("/track/:ticketId", async (req, res) => {
  const issue = await Issue.findOne({
    ticketId: req.params.ticketId.trim().toUpperCase(),
  }).select("ticketId title category priority description location imageUrl attachments status createdAt updatedAt");
  if (!issue) return res.status(404).json({ error: "No report found for that ticket" });
  res.json({ issue });
});

// PATCH /api/issues/:id/status  — admin updates status
router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  );
  if (!issue) return res.status(404).json({ error: "Issue not found" });
  res.json({ issue });
});

// DELETE /api/issues/:id  — admin only
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const deleted = await Issue.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Issue not found" });
  res.json({ ok: true });
});

export default router;
