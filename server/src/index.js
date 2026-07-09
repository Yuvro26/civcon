import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import issueRoutes from "./routes/issues.js";
import staffRoutes from "./routes/staff.js";
import contactRoutes from "./routes/contact.js";
import statsRoutes from "./routes/stats.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / tools with no origin, and any configured origin.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "civicconnect-mongo-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

// 404 + error handlers
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = Number(process.env.PORT) || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[api] Listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("[fatal] Could not start server:", err.message);
    process.exit(1);
  });
