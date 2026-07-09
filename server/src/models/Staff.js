import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    zone: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    assignedCount: { type: Number, default: 0 },
    resolvedCount: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Staff = mongoose.model("Staff", staffSchema);
