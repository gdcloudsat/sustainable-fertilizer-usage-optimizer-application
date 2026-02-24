const express = require('express');
const Crop = require('../models/Crop');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all crops
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const crops = await Crop.find(query).sort({ name: 1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single crop
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create crop (admin only - would need admin middleware)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update crop
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete crop
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get crop categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Crop.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
