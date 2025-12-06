import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import suggestRoutes from "./routes/suggest.js";
import matchRoutes from "./routes/match.js";

const app = express();

// Debug logs
console.log("DEBUG_GROQ:", process.env.GROQ_API_KEY);
console.log("DEBUG_MONGO:", process.env.MONGO_URL);

// Middleware
app.use(cors());
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("Resume Builder API is running");
});

// Routes
app.use("/api/suggest", suggestRoutes);
app.use("/api/match", matchRoutes);

// Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo Error:", err));

// Dynamic port for deployment
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
