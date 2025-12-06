const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');

// Create
router.post('/', async (req, res) => {
  try {
    const doc = new Resume(req.body);
    await doc.save();
    res.status(201).json({ ok: true, resume: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const list = await Resume.find().sort({ createdAt: -1 }).limit(50);
    res.json({ ok: true, list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, resume: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const doc = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok: true, resume: doc });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
