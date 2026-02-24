const mongoose = require('mongoose');

const soilSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  phLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  nitrogen: {
    type: Number,
    required: true,
    min: 0
  },
  phosphorus: {
    type: Number,
    required: true,
    min: 0
  },
  potassium: {
    type: Number,
    required: true,
    min: 0
  },
  organicMatter: {
    type: Number,
    min: 0,
    max: 100
  },
  moistureContent: {
    type: Number,
    min: 0,
    max: 100
  },
  soilTexture: {
    type: String,
    enum: ['sandy', 'loamy', 'clay', 'silty', 'sandy-loam', 'clay-loam', 'silty-loam']
  },
  cationExchangeCapacity: {
    type: Number,
    min: 0
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  testMethod: {
    type: String,
    enum: ['lab', 'field-kit', 'sensor', 'estimated']
  }
}, { timestamps: true });

module.exports = mongoose.model('Soil', soilSchema);
