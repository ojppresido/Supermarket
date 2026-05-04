const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.log('No MongoDB URI provided. Running without database connection.');
      console.log('Note: Database features will not be available until MongoDB is configured.');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Continuing without database connection...');
    // Don't exit the process, allow the server to run without DB
  }
};

module.exports = connectDB;
