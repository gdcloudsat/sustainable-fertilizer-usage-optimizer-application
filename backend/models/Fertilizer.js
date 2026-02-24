const mongoose = require('mongoose');

const nutrientContentSchema = new mongoose.Schema({
  nitrogen: { type: Number, default: 0 },
  phosphorus: { type: Number, default: 0 },
  potassium: { type: Number, default: 0 },
  sulfur: { type: Number, default: 0 },
  calcium: { type: Number, default: 0 },
  magnesium: { type: Number, default: 0 },
  micronutrients: [{
    name: String,
    percentage: Number
  }]
});

const fertilizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['organic', 'inorganic', 'bio-fertilizer', 'micronutrient', 'specialty'],
    required: true
  },
  category: {
    type: String,
    enum: ['straight', 'compound', 'complex', 'mixed', 'slow-release', 'controlled-release', 'specialty']
  },
  nutrientContent: nutrientContentSchema,
  npkRatio: {
    type: String
  },
  form: {
    type: String,
    enum: ['granular', 'powder', 'liquid', 'pellet', 'prill']
  },
  applicationMethod: [{
    type: String,
    enum: ['broadcast', 'fertigation', 'foliar', 'banding', 'side-dress', 'top-dress']
  }],
  releaseRate: {
    type: String,
    enum: ['fast', 'medium', 'slow']
  },
  price: {
    value: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    unit: { type: String, default: 'kg' }
  },
  environmentalImpact: {
    carbonFootprint: Number,
    waterPollutionRisk: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    soilHealthImpact: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    }
  },
  sustainabilityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  organicCertified: {
    type: Boolean,
    default: false
  },
  manufacturer: String,
  storageInstructions: String,
  compatibility: [String]
}, { timestamps: true });

fertilizerSchema.pre('save', function(next) {
  if (this.nutrientContent) {
    const n = this.nutrientContent.nitrogen || 0;
    const p = this.nutrientContent.phosphorus || 0;
    const k = this.nutrientContent.potassium || 0;
    this.npkRatio = `${n}-${p}-${k}`;
  }
  next();
});

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
