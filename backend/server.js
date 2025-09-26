// Import Express.js framework for creating web server
const express = require('express');

// Import CORS middleware to handle Cross-Origin Resource Sharing
const cors = require('cors');

// Import dotenv to load environment variables from .env file
const dotenv = require('dotenv');

// Import our custom database connection function
const connectDB = require('../Progetto-completo-Node.js-React-e-MongodDb-/database');

// ========================================
// INITIAL SETUP
// ========================================

// Load environment variables from .env file into process.env
// This must be called before using any environment variables
dotenv.config();

// Create Express application instance
// This 'app' object will handle all HTTP requests and responses
const app = express();

// Connect to MongoDB database using our custom function
// This establishes the database connection when server starts
connectDB();

// ========================================
// MIDDLEWARE SETUP
// ========================================

// Enable CORS (Cross-Origin Resource Sharing)
// This allows our API to accept requests from different domains
// Essential for React frontend running on different port
app.use(cors());

// Parse incoming JSON data in request bodies
// Without this, req.body would be undefined for JSON requests
// Converts JSON strings to JavaScript objects automatically
app.use(express.json());

// Parse incoming URL-encoded data (form submissions)
// extended: true allows for rich objects and arrays in URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROUTES SETUP
// ========================================

// Mount task routes at '/api/tasks' path
// All routes defined in './routes/tasks' will be prefixed with '/api/tasks'
// For example: GET /api/tasks, POST /api/tasks, etc.
app.use('/api/tasks', require('./routes/tasks'));

// Root route - provides API information and documentation
// This responds to GET requests to the root URL '/'
app.get('/', (req, res) => {
  
  // Send JSON response with API information
  res.json({
    // Welcome message
    message: 'Welcome to Task Manager API',
    
    // API version
    version: '1.0.0',
    
    // Available endpoints documentation
    endpoints: {
      'GET /api/tasks': 'Get all tasks',
      'GET /api/tasks/:id': 'Get single task',
      'POST /api/tasks': 'Create new task',
      'PUT /api/tasks/:id': 'Update task',
      'DELETE /api/tasks/:id': 'Delete task'
    }
  });
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

// 404 handler - catches all undefined routes
// '*' means "match any route that hasn't been handled above"
app.use('*', (req, res) => {
  
  // Send 404 Not Found response
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler - catches all unhandled errors
// Must have 4 parameters (err, req, res, next) to be recognized as error handler
app.use((err, req, res, next) => {
  
  // Log error details to console for debugging
  console.error(err.stack);
  
  // Send 500 Internal Server Error response
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    
    // Only show detailed error in development mode for security
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ========================================
// SERVER STARTUP
// ========================================

// Get port number from environment variables or use default 5000
// process.env.PORT is often set by hosting platforms
const PORT = process.env.PORT || 5000;

// Start the server listening on specified port
// Callback function runs when server successfully starts
app.listen(PORT, () => {
  
  // Log confirmation messages to console
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the API`);
});