import express from "express";
import Resume from "../models/Resume.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const doc = new Resume(req.body);
    await doc.save();
    res.status(201).json({ ok: true, resume: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get All
router.get("/", async (req, res) => {
  try {
    const list = await Resume.find().sort({ createdAt: -1 }).limit(50);
    res.json({ ok: true, list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
