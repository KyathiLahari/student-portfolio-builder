import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import portfolioRoutes from "./routes/portfolioRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Student Portfolio API is running." });
});

app.use("/api/portfolio", portfolioRoutes);

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is missing. Create backend/.env first.");
    await mongoose.connect(mongoUri);
    // Older versions used a unique index on profileId, which prevents saving multiple portfolios.
    // Drop only that legacy index; existing portfolio documents themselves are preserved.
    const indexes = await mongoose.connection.collection("portfolios").indexes().catch(() => []);
    const oldUniqueProfileIndex = indexes.find((index) => index.name === "profileId_1" && index.unique);
    if (oldUniqueProfileIndex) {
      await mongoose.connection.collection("portfolios").dropIndex("profileId_1");
      console.log("Updated legacy portfolio index for multiple saved portfolios.");
    }
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
