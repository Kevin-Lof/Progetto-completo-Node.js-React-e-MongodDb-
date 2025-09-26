// Import axios for making HTTP requests
import axios from 'axios';

// ========================================
// API CONFIGURATION
// ========================================

// Get API base URL from environment variables
// This allows us to easily change the backend URL for different environments
// eslint-disable-next-line no-undef
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default configuration
const api = axios.create({
  // Set base URL for all requests
  baseURL: `${API_URL}/api`,
  
  // Set default headers
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Set request timeout (5 seconds)
  timeout: 5000,
});

// ========================================
// REQUEST INTERCEPTOR
// ========================================

// Add request interceptor to log outgoing requests (helpful for debugging) (it's useful, I suggest to you
//to create this interceptor, but it can be avoidable)
api.interceptors.request.use(
  (config) => {
    // Log request details in development
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === 'development') {
      console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    }
    return config;
  },
  (error) => {
    // Log request errors
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

// Add response interceptor to handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.data);
    }
    
    // Return the data part of response (our API sends data in response.data.data)
    return response.data.data || response.data;
  },
  (error) => {
    // Handle different types of errors
    
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      console.error('API Error Response:', error.response.data);
      
      // Extract error message from response
      const errorMessage = error.response.data.message || 'An error occurred';
      throw new Error(errorMessage);
      
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network Error:', error.request);
      throw new Error('Network error. Please check your internet connection.');
      
    } else {
      // Something else happened in setting up the request
      console.error('Request Setup Error:', error.message);
      throw new Error('Request failed. Please try again.');
    }
  }
);

// ========================================
// API FUNCTIONS
// ========================================

// Get all tasks from the server
export const getAllTasks = async () => {
  try {
    // Make GET request to /api/tasks endpoint
    const response = await api.get('/tasks');
    
    // Return the tasks data
    return response;
    
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching tasks:', error);
    
    // Re-throw error so component can handle it
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    // Make GET request to /api/tasks/:id endpoint
    const response = await api.get(`/tasks/${taskId}`);
    
    // Return the task data
    return response;
    
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    // Validate required fields before sending
    if (!taskData.title || taskData.title.trim() === '') {
      throw new Error('Task title is required');
    }
    
    // Make POST request to /api/tasks endpoint with task data
    const response = await api.post('/tasks', taskData);
    
    // Return the created task
    return response;
    
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    // Validate task ID
    if (!taskId) {
      throw new Error('Task ID is required for update');
    }
    
    // Make PUT request to /api/tasks/:id endpoint with updated data
    const response = await api.put(`/tasks/${taskId}`, taskData);
    
    // Return the updated task
    return response;
    
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    // Validate task ID
    if (!taskId) {
      throw new Error('Task ID is required for deletion');
    }
    
    // Make DELETE request to /api/tasks/:id endpoint
    const response = await api.delete(`/tasks/${taskId}`);
    
    // Return confirmation
    return response;
    
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Check if API is accessible (health check)
export const checkApiHealth = async () => {
  try {
    // Make request to root endpoint
    const response = await axios.get(API_URL);
    
    // Return true if API responds
    return response.status === 200;
    
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Export API instance for advanced usage if needed
export { api };