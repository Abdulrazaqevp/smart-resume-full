import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FORCE dotenv to load from correct file
console.log("Attempting to load .env from:", path.join(__dirname, ".env"));
dotenv.config({ path: path.join(__dirname, ".env") });

// SHOW VALUES — must NOT be undefined
console.log("ENV CHECK:");
console.log("GROQ_API_KEY =", process.env.GROQ_API_KEY);
console.log("MONGO_URL =", process.env.MONGO_URL);
console.log("PORT =", process.env.PORT);

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import resumeRoutes from "./routes/resumes.js";
import suggestRoutes from "./routes/suggest.js";
import matchRoutes from "./routes/match.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/api/suggest", suggestRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/resumes", resumeRoutes);

// DB connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo Error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

console.log("ADMIN_API_KEY LOADED:", !!process.env.ADMIN_API_KEY);
