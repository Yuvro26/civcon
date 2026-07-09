import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const user = new User({
    name: name?.trim() || "",
    email: email.toLowerCase().trim(),
    mobile: (mobile || "").replace(/\D/g, ""),
  });
  await user.setPassword(password);
  await user.save();

  const token = signToken(user);
  res.status(201).json({ token, user: user.toPublic() });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(user);
  res.json({ token, user: user.toPublic() });
});

// POST /api/auth/admin-login  — code + password based admin sign in
router.post("/admin-login", async (req, res) => {
  const { code, password } = req.body || {};
  if (!code || !password) {
    return res.status(400).json({ error: "Access code and password are required" });
  }
  if (code.trim().toUpperCase() !== (process.env.ADMIN_ACCESS_CODE || "").toUpperCase()) {
    return res.status(401).json({ error: "Invalid admin access code" });
  }

  const admin = await User.findOne({ role: "admin" });
  if (!admin || !(await admin.verifyPassword(password))) {
    return res.status(401).json({ error: "Invalid admin password" });
  }

  const token = signToken(admin);
  res.json({ token, user: admin.toPublic() });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toPublic() });
});

export default router;
