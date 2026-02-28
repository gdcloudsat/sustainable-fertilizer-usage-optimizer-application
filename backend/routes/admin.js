const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Fertilizer = require('../models/Fertilizer');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// ==================== USER MANAGEMENT ====================

// Get all users with pagination and filtering
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (activate/block)
router.patch('/users/:id/status', [
  body('status').isIn(['active', 'blocked']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== DASHBOARD STATS ====================

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalFertilizers = await Fertilizer.countDocuments();
    const totalCrops = await Crop.countDocuments();

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeUsers,
      totalFertilizers,
      totalCrops,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== FERTILIZER MANAGEMENT ====================

// Get all fertilizers
router.get('/fertilizers', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }

    const fertilizers = await Fertilizer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Fertilizer.countDocuments(query);

    res.json({
      fertilizers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching fertilizers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create fertilizer
router.post('/fertilizers', async (req, res) => {
  try {
    const fertilizer = new Fertilizer(req.body);
    await fertilizer.save();
    
    res.status(201).json(fertilizer);
  } catch (error) {
    console.error('Error creating fertilizer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single fertilizer
router.get('/fertilizers/:id', async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findById(req.params.id);
    
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }

    res.json(fertilizer);
  } catch (error) {
    console.error('Error fetching fertilizer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update fertilizer
router.put('/fertilizers/:id', async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }

    res.json(fertilizer);
  } catch (error) {
    console.error('Error updating fertilizer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete fertilizer
router.delete('/fertilizers/:id', async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findByIdAndDelete(req.params.id);
    
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }

    res.json({ message: 'Fertilizer deleted successfully' });
  } catch (error) {
    console.error('Error deleting fertilizer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== CROP MANAGEMENT ====================

// Get all crops
router.get('/crops', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } }
      ];
    }

    const crops = await Crop.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Crop.countDocuments(query);

    res.json({
      crops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create crop
router.post('/crops', async (req, res) => {
  try {
    const crop = new Crop(req.body);
    await crop.save();
    
    res.status(201).json(crop);
  } catch (error) {
    console.error('Error creating crop:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single crop
router.get('/crops/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json(crop);
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update crop
router.put('/crops/:id', async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json(crop);
  } catch (error) {
    console.error('Error updating crop:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete crop
router.delete('/crops/:id', async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
