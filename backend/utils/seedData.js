const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const Fertilizer = require('../models/Fertilizer');

const crops = [
  {
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'cereal',
    nutrientRequirements: {
      nitrogen: 120,
      phosphorus: 60,
      potassium: 80,
      sulfur: 20
    },
    optimalPh: { min: 6.0, max: 7.0 },
    growingSeason: 'winter',
    daysToMaturity: 120,
    waterRequirement: 'moderate',
    climateSuitability: ['temperate', 'mediterranean'],
    expectedYield: { value: 3000, unit: 'kg/acre' },
    marketPrice: { value: 0.25, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 75
  },
  {
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'cereal',
    nutrientRequirements: {
      nitrogen: 150,
      phosphorus: 60,
      potassium: 120,
      sulfur: 15
    },
    optimalPh: { min: 5.5, max: 6.5 },
    growingSeason: 'summer',
    daysToMaturity: 140,
    waterRequirement: 'high',
    climateSuitability: ['tropical', 'subtropical'],
    expectedYield: { value: 4500, unit: 'kg/acre' },
    marketPrice: { value: 0.35, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 65
  },
  {
    name: 'Corn',
    scientificName: 'Zea mays',
    category: 'cereal',
    nutrientRequirements: {
      nitrogen: 180,
      phosphorus: 80,
      potassium: 140,
      sulfur: 25
    },
    optimalPh: { min: 5.8, max: 7.0 },
    growingSeason: 'summer',
    daysToMaturity: 110,
    waterRequirement: 'high',
    climateSuitability: ['temperate', 'subtropical', 'tropical'],
    expectedYield: { value: 5000, unit: 'kg/acre' },
    marketPrice: { value: 0.20, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 70
  },
  {
    name: 'Soybean',
    scientificName: 'Glycine max',
    category: 'legume',
    nutrientRequirements: {
      nitrogen: 40,
      phosphorus: 50,
      potassium: 90,
      sulfur: 15
    },
    optimalPh: { min: 6.0, max: 7.0 },
    growingSeason: 'summer',
    daysToMaturity: 100,
    waterRequirement: 'moderate',
    climateSuitability: ['temperate', 'subtropical'],
    expectedYield: { value: 2500, unit: 'kg/acre' },
    marketPrice: { value: 0.45, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 85
  },
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetable',
    nutrientRequirements: {
      nitrogen: 100,
      phosphorus: 60,
      potassium: 150,
      sulfur: 20,
      calcium: 30
    },
    optimalPh: { min: 6.0, max: 6.8 },
    growingSeason: 'spring',
    daysToMaturity: 80,
    waterRequirement: 'moderate',
    climateSuitability: ['temperate', 'subtropical', 'mediterranean'],
    expectedYield: { value: 15000, unit: 'kg/acre' },
    marketPrice: { value: 0.80, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 72
  },
  {
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'vegetable',
    nutrientRequirements: {
      nitrogen: 140,
      phosphorus: 70,
      potassium: 180,
      sulfur: 25
    },
    optimalPh: { min: 5.0, max: 6.0 },
    growingSeason: 'spring',
    daysToMaturity: 100,
    waterRequirement: 'high',
    climateSuitability: ['temperate', 'subtropical'],
    expectedYield: { value: 20000, unit: 'kg/acre' },
    marketPrice: { value: 0.30, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 68
  },
  {
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'fiber',
    nutrientRequirements: {
      nitrogen: 160,
      phosphorus: 70,
      potassium: 130,
      sulfur: 20
    },
    optimalPh: { min: 5.5, max: 7.0 },
    growingSeason: 'spring',
    daysToMaturity: 160,
    waterRequirement: 'moderate',
    climateSuitability: ['subtropical', 'tropical', 'arid'],
    expectedYield: { value: 800, unit: 'kg/acre' },
    marketPrice: { value: 1.50, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 60
  },
  {
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'other',
    nutrientRequirements: {
      nitrogen: 200,
      phosphorus: 80,
      potassium: 200,
      sulfur: 30
    },
    optimalPh: { min: 6.0, max: 7.5 },
    growingSeason: 'year-round',
    daysToMaturity: 365,
    waterRequirement: 'high',
    climateSuitability: ['tropical', 'subtropical'],
    expectedYield: { value: 60000, unit: 'kg/acre' },
    marketPrice: { value: 0.035, currency: 'USD', unit: 'kg' },
    sustainabilityScore: 62
  }
];

const fertilizers = [
  {
    name: 'Urea',
    type: 'inorganic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 46,
      phosphorus: 0,
      potassium: 0
    },
    form: 'granular',
    applicationMethod: ['broadcast', 'fertigation'],
    releaseRate: 'fast',
    price: { value: 0.45, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 2.5,
      waterPollutionRisk: 'high',
      soilHealthImpact: 'neutral'
    },
    sustainabilityScore: 40,
    organicCertified: false,
    manufacturer: 'Generic'
  },
  {
    name: 'Diammonium Phosphate (DAP)',
    type: 'inorganic',
    category: 'compound',
    nutrientContent: {
      nitrogen: 18,
      phosphorus: 46,
      potassium: 0
    },
    form: 'granular',
    applicationMethod: ['broadcast', 'banding'],
    releaseRate: 'medium',
    price: { value: 0.65, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 3.0,
      waterPollutionRisk: 'medium',
      soilHealthImpact: 'neutral'
    },
    sustainabilityScore: 50,
    organicCertified: false,
    manufacturer: 'Generic'
  },
  {
    name: 'Muriate of Potash (MOP)',
    type: 'inorganic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 60
    },
    form: 'granular',
    applicationMethod: ['broadcast', 'banding'],
    releaseRate: 'medium',
    price: { value: 0.55, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 1.5,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'neutral'
    },
    sustainabilityScore: 55,
    organicCertified: false,
    manufacturer: 'Generic'
  },
  {
    name: 'NPK 15-15-15',
    type: 'inorganic',
    category: 'complex',
    nutrientContent: {
      nitrogen: 15,
      phosphorus: 15,
      potassium: 15
    },
    form: 'granular',
    applicationMethod: ['broadcast'],
    releaseRate: 'medium',
    price: { value: 0.70, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 2.8,
      waterPollutionRisk: 'medium',
      soilHealthImpact: 'neutral'
    },
    sustainabilityScore: 52,
    organicCertified: false,
    manufacturer: 'Generic'
  },
  {
    name: 'Compost',
    type: 'organic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 1.5,
      phosphorus: 1.0,
      potassium: 1.5
    },
    form: 'powder',
    applicationMethod: ['broadcast'],
    releaseRate: 'slow',
    price: { value: 0.15, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 0.2,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'positive'
    },
    sustainabilityScore: 95,
    organicCertified: true,
    manufacturer: 'Local Organic'
  },
  {
    name: 'Vermicompost',
    type: 'organic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 2.0,
      phosphorus: 1.5,
      potassium: 1.0
    },
    form: 'powder',
    applicationMethod: ['broadcast', 'side-dress'],
    releaseRate: 'slow',
    price: { value: 0.35, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 0.1,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'positive'
    },
    sustainabilityScore: 98,
    organicCertified: true,
    manufacturer: 'EcoWorm Farms'
  },
  {
    name: 'Bone Meal',
    type: 'organic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 3,
      phosphorus: 15,
      potassium: 0
    },
    form: 'powder',
    applicationMethod: ['banding', 'side-dress'],
    releaseRate: 'slow',
    price: { value: 0.80, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 0.3,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'positive'
    },
    sustainabilityScore: 88,
    organicCertified: true,
    manufacturer: 'Natural Fertilizers Co'
  },
  {
    name: 'Seaweed Extract',
    type: 'organic',
    category: 'specialty',
    nutrientContent: {
      nitrogen: 1,
      phosphorus: 0.5,
      potassium: 5,
      micronutrients: [
        { name: 'Iron', percentage: 0.1 },
        { name: 'Zinc', percentage: 0.05 }
      ]
    },
    form: 'liquid',
    applicationMethod: ['foliar', 'fertigation'],
    releaseRate: 'fast',
    price: { value: 2.50, currency: 'USD', unit: 'liter' },
    environmentalImpact: {
      carbonFootprint: 0.15,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'positive'
    },
    sustainabilityScore: 92,
    organicCertified: true,
    manufacturer: 'Ocean Harvest'
  },
  {
    name: 'Ammonium Nitrate',
    type: 'inorganic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 34,
      phosphorus: 0,
      potassium: 0
    },
    form: 'granular',
    applicationMethod: ['broadcast', 'side-dress'],
    releaseRate: 'fast',
    price: { value: 0.50, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 3.2,
      waterPollutionRisk: 'high',
      soilHealthImpact: 'neutral'
    },
    sustainabilityScore: 35,
    organicCertified: false,
    manufacturer: 'Generic'
  },
  {
    name: 'Rock Phosphate',
    type: 'organic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 0,
      phosphorus: 30,
      potassium: 0
    },
    form: 'powder',
    applicationMethod: ['broadcast'],
    releaseRate: 'slow',
    price: { value: 0.40, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 0.5,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'positive'
    },
    sustainabilityScore: 82,
    organicCertified: true,
    manufacturer: 'Mineral Resources'
  },
  {
    name: 'Blood Meal',
    type: 'organic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 12,
      phosphorus: 0,
      potassium: 0
    },
    form: 'powder',
    applicationMethod: ['side-dress', 'banding'],
    releaseRate: 'medium',
    price: { value: 1.20, currency: 'USD', unit: 'kg' },
    environmentalImpact: {
      carbonFootprint: 0.4,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'positive'
    },
    sustainabilityScore: 85,
    organicCertified: true,
    manufacturer: 'Organic Nutrients'
  },
  {
    name: 'Fish Emulsion',
    type: 'organic',
    category: 'specialty',
    nutrientContent: {
      nitrogen: 5,
      phosphorus: 2,
      potassium: 2
    },
    form: 'liquid',
    applicationMethod: ['foliar', 'fertigation'],
    releaseRate: 'fast',
    price: { value: 3.00, currency: 'USD', unit: 'liter' },
    environmentalImpact: {
      carbonFootprint: 0.25,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'positive'
    },
    sustainabilityScore: 90,
    organicCertified: true,
    manufacturer: 'Ocean Proteins'
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Crop.deleteMany({});
    await Fertilizer.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert crops
    const insertedCrops = await Crop.insertMany(crops);
    console.log(`Inserted ${insertedCrops.length} crops`);
    
    // Insert fertilizers
    const insertedFertilizers = await Fertilizer.insertMany(fertilizers);
    console.log(`Inserted ${insertedFertilizers.length} fertilizers`);
    
    console.log('Database seeding completed successfully!');
    return { crops: insertedCrops, fertilizers: insertedFertilizers };
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

module.exports = { seedDatabase, crops, fertilizers };
