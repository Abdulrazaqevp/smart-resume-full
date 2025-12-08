import express from "express";
import Resume from "../models/Resume.js";

const router = express.Router();

// Create Resume
router.post("/", async (req, res) => {
  try {
    const doc = new Resume(req.body);
    await doc.save();
    res.status(201).json({ ok: true, resume: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get All Resumes
router.get("/", async (req, res) => {
  try {
    const list = await Resume.find().sort({ createdAt: -1 }).limit(50);
    res.json({ ok: true, list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get One Resume
router.get("/:id", async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, resume: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Update Resume
router.put("/:id", async (req, res) => {
  try {
    const doc = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, resume: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Delete Resume
router.delete("/:id", async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
