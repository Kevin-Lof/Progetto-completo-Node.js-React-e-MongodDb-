// Import mongoose library for MongoDB database connection
const mongoose = require('mongoose');

// Create an asynchronous function to connect to MongoDB
// 'async' allows us to use 'await' for handling asynchronous operations
const connectDB = async () => {
  
  // Try block - attempt to execute code, catch any errors
  try {
    
    // Attempt to connect to MongoDB using connection string from environment variables
    // 'await' pauses execution until the connection attempt completes
    // 'process.env.MONGODB_URI' gets the connection string from our .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // Log success message to console with database name
    // 'conn.connection.name' gives us the name of the connected database
    console.log(`MongoDB Connected: ${conn.connection.name}`);
    
  } catch (error) {
    // Catch block - executes if connection fails
    
    // Log error message to console showing what went wrong
    console.error('Database connection error:', error.message);
    
    // Exit the Node.js process with failure code (1 means error)
    // This stops the entire application if database connection fails
    process.exit(1);
  }
};

// Export the connectDB function so other files can import and use it
module.exports = connectDB;