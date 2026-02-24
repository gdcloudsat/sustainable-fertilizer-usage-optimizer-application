const mongoose = require('mongoose');
const { seedDatabase } = require('./seedData');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sustainable_fertilizer');
    console.log('Connected to MongoDB');
    
    // Seed data
    await seedDatabase();
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
