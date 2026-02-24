const express = require('express');
const Recommendation = require('../models/Recommendation');
const Soil = require('../models/Soil');
const Crop = require('../models/Crop');
const Fertilizer = require('../models/Fertilizer');
const authMiddleware = require('../middleware/auth');
const recommendationEngine = require('../services/recommendationEngine');

const router = express.Router();

// Get all recommendations for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.user._id })
      .populate('soilId', 'testDate phLevel nitrogen phosphorus potassium')
      .populate('cropId', 'name category')
      .populate('recommendations.fertilizer', 'name type npkRatio price')
      .sort({ generatedAt: -1 });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single recommendation
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('soilId')
      .populate('cropId')
      .populate('recommendations.fertilizer');

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new recommendation
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { soilId, cropId, farmSize, weatherData } = req.body;

    if (!soilId || !cropId) {
      return res.status(400).json({ message: 'Soil ID and Crop ID are required' });
    }

    // Verify soil belongs to user
    const soil = await Soil.findOne({ _id: soilId, userId: req.user._id });
    if (!soil) {
      return res.status(404).json({ message: 'Soil data not found' });
    }

    // Get crop data
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Get all fertilizers
    const fertilizers = await Fertilizer.find();

    // Generate recommendation
    const recommendationData = await recommendationEngine.generate({
      soil,
      crop,
      fertilizers,
      farmSize: farmSize || 1,
      weatherData
    });

    // Save recommendation
    const recommendation = new Recommendation({
      userId: req.user._id,
      soilId,
      cropId,
      ...recommendationData
    });

    await recommendation.save();

    // Populate and return
    await recommendation.populate('recommendations.fertilizer');
    await recommendation.populate('soilId');
    await recommendation.populate('cropId');

    res.status(201).json(recommendation);
  } catch (error) {
    console.error('Recommendation generation error:', error);
    res.status(500).json({ message: 'Failed to generate recommendation', error: error.message });
  }
});

// Update recommendation status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    const recommendation = await Recommendation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete recommendation
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const recommendation = await Recommendation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    res.json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sustainability report
router.get('/:id/sustainability', authMiddleware, async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('recommendations.fertilizer');

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    const report = {
      nitrogenUseEfficiency: recommendation.sustainabilityMetrics.nitrogenUseEfficiency,
      phosphorusUseEfficiency: recommendation.sustainabilityMetrics.phosphorusUseEfficiency,
      potassiumUseEfficiency: recommendation.sustainabilityMetrics.potassiumUseEfficiency,
      carbonFootprintReduction: recommendation.sustainabilityMetrics.carbonFootprintReduction,
      soilHealthScore: recommendation.sustainabilityMetrics.soilHealthScore,
      overallSustainabilityScore: recommendation.sustainabilityMetrics.overallSustainabilityScore,
      environmentalImpact: calculateEnvironmentalImpact(recommendation),
      sustainabilityTips: generateSustainabilityTips(recommendation)
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

function calculateEnvironmentalImpact(recommendation) {
  let totalImpact = 0;
  
  recommendation.recommendations.forEach(rec => {
    if (rec.fertilizer && rec.fertilizer.environmentalImpact) {
      const riskScores = { low: 1, medium: 2, high: 3 };
      totalImpact += riskScores[rec.fertilizer.environmentalImpact.waterPollutionRisk] || 2;
    }
  });
  
  const avgImpact = totalImpact / recommendation.recommendations.length;
  
  if (avgImpact <= 1.5) return 'low';
  if (avgImpact <= 2.5) return 'medium';
  return 'high';
}

function generateSustainabilityTips(recommendation) {
  const tips = [];
  
  if (recommendation.sustainabilityMetrics.nitrogenUseEfficiency < 70) {
    tips.push('Consider split application of nitrogen to improve efficiency');
  }
  
  if (recommendation.sustainabilityMetrics.carbonFootprintReduction < 10) {
    tips.push('Look for organic alternatives to reduce carbon footprint');
  }
  
  tips.push('Monitor soil health regularly to track improvements');
  tips.push('Consider crop rotation to naturally improve soil nutrients');
  
  return tips;
}

module.exports = router;
