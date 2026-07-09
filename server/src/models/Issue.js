import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    url: String,
    name: String,
    type: String,
  },
  { _id: false },
);

const issueSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "General" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    attachments: { type: [attachmentSchema], default: [] },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Pending",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Auto-generate a ticket id like CC-2026-0001 when missing.
issueSchema.pre("save", async function assignTicket(next) {
  if (this.ticketId) return next();
  const year = new Date().getFullYear();
  const count = await mongoose.model("Issue").countDocuments();
  this.ticketId = `CC-${year}-${String(count + 1).padStart(4, "0")}`;
  next();
});

export const Issue = mongoose.model("Issue", issueSchema);
