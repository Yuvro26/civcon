import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { User } from "./models/User.js";
import { Staff } from "./models/Staff.js";

// Creates a default admin account and a couple of sample staff records.
// Run with:  npm run seed
async function seed() {
  await connectDB();

  const adminEmail = "admin@civicconnect.local";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({ name: "City Administrator", email: adminEmail, role: "admin" });
    await admin.setPassword("Admin@1234");
    await admin.save();
    console.log(`[seed] Created admin → ${adminEmail} / Admin@1234`);
  } else {
    console.log("[seed] Admin already exists, skipping");
  }

  const staffCount = await Staff.countDocuments();
  if (staffCount === 0) {
    await Staff.insertMany([
      { name: "Ravi Kumar", department: "Sanitation", designation: "Field Officer", zone: "North" },
      { name: "Anita Sharma", department: "Roads", designation: "Supervisor", zone: "South" },
    ]);
    console.log("[seed] Inserted sample staff");
  }

  await mongoose.disconnect();
  console.log("[seed] Done");
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
