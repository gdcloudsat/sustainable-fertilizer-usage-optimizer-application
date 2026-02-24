const express = require('express');
const { body, validationResult } = require('express-validator');
const Soil = require('../models/Soil');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all soil tests for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const soils = await Soil.find({ userId: req.user._id }).sort({ testDate: -1 });
    res.json(soils);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single soil test
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const soil = await Soil.findOne({ _id: req.params.id, userId: req.user._id });
    if (!soil) {
      return res.status(404).json({ message: 'Soil test not found' });
    }
    res.json(soil);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new soil test
router.post('/', authMiddleware, [
  body('phLevel').isFloat({ min: 0, max: 14 }).withMessage('pH level must be between 0 and 14'),
  body('nitrogen').isFloat({ min: 0 }).withMessage('Nitrogen must be a positive number'),
  body('phosphorus').isFloat({ min: 0 }).withMessage('Phosphorus must be a positive number'),
  body('potassium').isFloat({ min: 0 }).withMessage('Potassium must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const soil = new Soil({
      userId: req.user._id,
      ...req.body
    });

    await soil.save();
    res.status(201).json(soil);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update soil test
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const soil = await Soil.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!soil) {
      return res.status(404).json({ message: 'Soil test not found' });
    }

    res.json(soil);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete soil test
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const soil = await Soil.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!soil) {
      return res.status(404).json({ message: 'Soil test not found' });
    }

    res.json({ message: 'Soil test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get soil health assessment
router.get('/:id/assessment', authMiddleware, async (req, res) => {
  try {
    const soil = await Soil.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!soil) {
      return res.status(404).json({ message: 'Soil test not found' });
    }

    // Simple assessment logic
    const assessment = {
      phStatus: getPhStatus(soil.phLevel),
      nitrogenStatus: getNutrientStatus(soil.nitrogen, 'nitrogen'),
      phosphorusStatus: getNutrientStatus(soil.phosphorus, 'phosphorus'),
      potassiumStatus: getNutrientStatus(soil.potassium, 'potassium'),
      overallHealth: calculateOverallHealth(soil)
    };

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

function getPhStatus(ph) {
  if (ph < 5.5) return { status: 'acidic', recommendation: 'Add lime to raise pH' };
  if (ph > 7.5) return { status: 'alkaline', recommendation: 'Add sulfur to lower pH' };
  return { status: 'optimal', recommendation: 'pH is in good range' };
}

function getNutrientStatus(value, nutrient) {
  const thresholds = {
    nitrogen: { low: 20, high: 50 },
    phosphorus: { low: 15, high: 40 },
    potassium: { low: 100, high: 200 }
  };

  const t = thresholds[nutrient];
  if (value < t.low) return { status: 'deficient', level: value };
  if (value > t.high) return { status: 'excessive', level: value };
  return { status: 'adequate', level: value };
}

function calculateOverallHealth(soil) {
  let score = 100;
  
  // pH penalty
  if (soil.phLevel < 5.5 || soil.phLevel > 7.5) score -= 15;
  
  // Nutrient penalties
  if (soil.nitrogen < 20) score -= 10;
  if (soil.phosphorus < 15) score -= 10;
  if (soil.potassium < 100) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

module.exports = router;
