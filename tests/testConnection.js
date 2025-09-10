const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables from a .env file

// MongoDB connection URL (use your actual connection string)
//const MONGO_URI ="mongodb+srv://aallodoctor:DUn1EJDV7zVLrjNQ@cluster0.aqgap.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/develop"
const MONGO_URI = process.env.dbUrlMongoDB
// Function to test connection
 const connectDB = async () => {
    console.log('\x1b[32m%s\x1b[0m', 'tests/testConnection.js:9 MONGO_URI', MONGO_URI);
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

connectDB();
