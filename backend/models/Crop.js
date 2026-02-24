const mongoose = require('mongoose');

const nutrientRequirementSchema = new mongoose.Schema({
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  sulfur: Number,
  calcium: Number,
  magnesium: Number,
  micronutrients: [{
    name: String,
    amount: Number
  }]
});

const growthStageSchema = new mongoose.Schema({
  stage: String,
  duration: Number,
  nutrientMultiplier: {
    nitrogen: { type: Number, default: 1 },
    phosphorus: { type: Number, default: 1 },
    potassium: { type: Number, default: 1 }
  }
});

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  scientificName: String,
  category: {
    type: String,
    enum: ['cereal', 'legume', 'vegetable', 'fruit', 'oilseed', 'fiber', 'forage', 'other'],
    required: true
  },
  nutrientRequirements: nutrientRequirementSchema,
  optimalPh: {
    min: { type: Number, min: 0, max: 14 },
    max: { type: Number, min: 0, max: 14 }
  },
  growthStages: [growthStageSchema],
  growingSeason: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter', 'year-round']
  },
  daysToMaturity: {
    type: Number,
    min: 1
  },
  waterRequirement: {
    type: String,
    enum: ['low', 'moderate', 'high']
  },
  climateSuitability: [{
    type: String,
    enum: ['tropical', 'subtropical', 'temperate', 'arid', 'mediterranean']
  }],
  soilPreferences: {
    texture: [String],
    drainage: String
  },
  expectedYield: {
    value: Number,
    unit: String
  },
  marketPrice: {
    value: Number,
    currency: String,
    unit: String
  },
  sustainabilityScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
