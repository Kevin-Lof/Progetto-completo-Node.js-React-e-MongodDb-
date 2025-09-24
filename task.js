// Import mongoose library to create schemas and models for MongoDB
const mongoose = require('mongoose');

// Create a new schema definition - this is like a blueprint for our Task documents
const taskSchema = new mongoose.Schema({
  
  // Title field definition
  title: {
    // Data type is String
    type: String,
    
    // This field is required - cannot create task without it
    required: true,
    
    // Automatically remove whitespace from beginning and end of string
    trim: true
  },
  
  // Description field definition
  description: {
    // Data type is String
    type: String,
    
    // Remove whitespace from beginning and end
    trim: true,
    
    // Default value if none provided - empty string
    default: 'default value'
  },
  
  // Completed status field definition
  completed: {
    // Data type is Boolean (true/false)
    type: Boolean,
    
    // Default value when creating new task - false means not completed
    default: false
  },
  
  // Priority level field definition
  priority: {
    // Data type is String
    type: String,
    
    // Enum means only these specific values are allowed
    enum: ['low', 'medium', 'high'],
    
    // Default priority level if none specified
    default: 'medium'
  }
  
}, {
  // Schema options object
  
  // Automatically add 'createdAt' and 'updatedAt' timestamps to each document
  timestamps: true
});

// Create a model from our schema and export it
// 'Task' is the model name, MongoDB will create a collection called 'tasks'
// The model gives us methods to interact with the database (create, find, update, delete)
module.exports = mongoose.model('Task', taskSchema);