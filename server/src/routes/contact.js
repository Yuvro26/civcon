import { Router } from "express";
import { ContactMessage } from "../models/ContactMessage.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/contact  — public: anyone can send a message
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required" });
  }
  const doc = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ message: doc });
});

// GET /api/contact  — admin: list all messages
router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ messages });
});

export default router;
