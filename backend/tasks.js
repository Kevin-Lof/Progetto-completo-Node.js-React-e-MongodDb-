// Import Express framework to create router
const express = require('express');

// Import our Task model to interact with the database
const Task = require('../Progetto-completo-Node.js-React-e-MongodDb-/task');

// Create a new router instance - this will handle all task-related routes
const router = express.Router();

// ========================================
// GET /api/tasks - Retrieve all tasks
// ========================================
router.get('/', async (req, res) => {
  
  // Try block - attempt to execute database operation
  try {
    
    // Find all tasks in the database
    // {} means no filter - get everything
    // .sort() orders results by createdAt field, newest first (-1 = descending)
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    
    // Send successful HTTP response with status code 200
    res.status(200).json({
      // Indicate the operation was successful
      success: true,
      
      // Include count of how many tasks were found
      count: tasks.length,
      
      // Include the actual task data
      data: tasks
    });
    
  } catch (error) {
    // Catch block - handle any errors that occurred
    
    // Send error HTTP response with status code 500 (Internal Server Error)
    res.status(500).json({
      // Indicate the operation failed
      success: false,
      
      // Generic error message for client
      message: 'Server Error',
      
      // Specific error details for debugging
      error: error.message
    });
  }
});

// ========================================
// GET /api/tasks/:id - Retrieve single task by ID
// ========================================
router.get('/:id', async (req, res) => {
  
  // Try block - attempt database operation
  try {
    
    // Find task by ID from URL parameters
    // req.params.id contains the ID from the URL (e.g., /api/tasks/12345)
    const task = await Task.findById(req.params.id);
    
    // Check if task was found in database
    if (!task) {
      // Return early with 404 Not Found if task doesn't exist
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Send successful response with the found task
    res.status(200).json({
      success: true,
      data: task
    });
    
  } catch (error) {
    // Catch block - handle errors (like invalid ID format)
    
    // Send 400 Bad Request - client sent invalid data
    res.status(400).json({
      success: false,
      message: 'Invalid task ID',
      error: error.message
    });
  }
});

// ========================================
// POST /api/tasks - Create new task
// ========================================
router.post('/', async (req, res) => {
  
  // Try block - attempt to create new task
  try {
    
    // Create new task using data from request body
    // req.body contains the JSON data sent by the client
    // Task.create() validates the data against our schema and saves to database
    const task = await Task.create(req.body);
    
    // Send successful response with status 201 (Created)
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
    
  } catch (error) {
    // Catch block - handle validation errors or other issues
    
    // Send 400 Bad Request - client sent invalid data
    res.status(400).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
});

// ========================================
// PUT /api/tasks/:id - Update existing task
// ========================================
router.put('/:id', async (req, res) => {
  
  // Try block - attempt to update task
  try {
    
    // Find task by ID and update with new data
    const task = await Task.findByIdAndUpdate(
      // First parameter: which document to update (using ID from URL)
      req.params.id,
      
      // Second parameter: new data to update with (from request body)
      req.body,
      
      // Third parameter: options object
      {
        // Return the updated document instead of the original
        new: true,
        
        // Run schema validation on the updated data
        runValidators: true
      }
    );
    
    // Check if task was found and updated
    if (!task) {
      // Return 404 if task with given ID doesn't exist
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Send successful response with updated task data
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
    
  } catch (error) {
    // Catch block - handle validation errors or invalid ID
    
    // Send 400 Bad Request
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

// ========================================
// DELETE /api/tasks/:id - Delete task
// ========================================
router.delete('/:id', async (req, res) => {
  
  // Try block - attempt to delete task
  try {
    
    // Find task by ID and remove it from database
    // This returns the deleted task data or null if not found
    const task = await Task.findByIdAndDelete(req.params.id);
    
    // Check if task existed and was deleted
    if (!task) {
      // Return 404 if task with given ID doesn't exist
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Send successful response confirming deletion
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      
      // Include deleted task data for confirmation
      data: task
    });
    
  } catch (error) {
    // Catch block - handle errors like invalid ID format
    
    // Send 400 Bad Request
    res.status(400).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
});

// Export the router so it can be imported and used in server.js
module.exports = router;