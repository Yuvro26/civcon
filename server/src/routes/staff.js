import { Router } from "express";
import { Staff } from "../models/Staff.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// All staff endpoints are admin-only.
router.use(requireAuth, requireAdmin);

router.get("/", async (_req, res) => {
  const staff = await Staff.find().sort({ createdAt: -1 });
  res.json({ staff });
});

router.post("/", async (req, res) => {
  const staff = await Staff.create(req.body || {});
  res.status(201).json({ staff });
});

router.patch("/:id", async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body || {}, {
    new: true,
    runValidators: true,
  });
  if (!staff) return res.status(404).json({ error: "Staff not found" });
  res.json({ staff });
});

router.delete("/:id", async (req, res) => {
  const deleted = await Staff.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Staff not found" });
  res.json({ ok: true });
});

export default router;
