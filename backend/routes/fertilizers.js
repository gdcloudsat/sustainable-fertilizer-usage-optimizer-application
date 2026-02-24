const express = require('express');
const Fertilizer = require('../models/Fertilizer');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all fertilizers
router.get('/', async (req, res) => {
  try {
    const { type, organic, search } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    if (organic === 'true') {
      query.organicCertified = true;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const fertilizers = await Fertilizer.find(query).sort({ name: 1 });
    res.json(fertilizers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single fertilizer
router.get('/:id', async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findById(req.params.id);
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }
    res.json(fertilizer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create fertilizer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const fertilizer = new Fertilizer(req.body);
    await fertilizer.save();
    res.status(201).json(fertilizer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update fertilizer
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }
    res.json(fertilizer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete fertilizer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findByIdAndDelete(req.params.id);
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }
    res.json({ message: 'Fertilizer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sustainable fertilizers (high sustainability score)
router.get('/sustainable/top', async (req, res) => {
  try {
    const fertilizers = await Fertilizer.find({
      sustainabilityScore: { $gte: 70 }
    }).sort({ sustainabilityScore: -1 }).limit(10);
    res.json(fertilizers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
