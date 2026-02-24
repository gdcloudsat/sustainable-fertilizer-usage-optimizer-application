const mongoose = require('mongoose');

const fertilizerApplicationSchema = new mongoose.Schema({
  fertilizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fertilizer',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg/acre'
  },
  applicationTiming: String,
  applicationMethod: String,
  cost: {
    type: Number,
    required: true
  }
});

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  soilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Soil',
    required: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  recommendations: [fertilizerApplicationSchema],
  totalCost: {
    type: Number,
    required: true
  },
  expectedYield: {
    value: Number,
    unit: String
  },
  estimatedRevenue: {
    type: Number
  },
  profitEstimate: {
    type: Number
  },
  sustainabilityMetrics: {
    nitrogenUseEfficiency: Number,
    phosphorusUseEfficiency: Number,
    potassiumUseEfficiency: Number,
    carbonFootprintReduction: Number,
    soilHealthScore: Number,
    waterQualityImpact: String,
    overallSustainabilityScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  weatherConsiderations: {
    rainfallForecast: String,
    temperatureRange: String,
    applicationTiming: String
  },
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'active', 'applied', 'completed'],
    default: 'draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
