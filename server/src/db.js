import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || "civicconnect",
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`[db] Connected to MongoDB Atlas → database "${mongoose.connection.name}"`);
  return mongoose.connection;
}
