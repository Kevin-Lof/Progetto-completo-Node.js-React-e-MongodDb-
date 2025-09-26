
// Import React hooks for state management and lifecycle
import React, { useState, useEffect } from 'react';

// Import our custom CSS styles
import './App.css';

// Import all our custom components
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats'; //it's a plus, you don't need to create it.

// Import our API service for backend communication
import * as taskService from './services/taskService';

// Main App component - this is the root of our application
function App() {
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // State to store all tasks from the database
  // useState returns [currentValue, setterFunction]
  const [tasks, setTasks] = useState([]);
  
  // State to handle loading status during API calls
  const [loading, setLoading] = useState(true);
  
  // State to handle and display error messages
  const [error, setError] = useState('');
  
  // State to store task being edited (null when not editing)
  const [editingTask, setEditingTask] = useState(null);
  
  // ========================================
  // LOAD TASKS ON COMPONENT MOUNT
  // ========================================
  
  // useEffect runs when component mounts and when dependencies change
  useEffect(() => {
    // Call function to fetch tasks from API
    fetchTasks();
  }, []); // Empty dependency array means run only once on mount
  
  // ========================================
  // API FUNCTIONS
  // ========================================
  
  // Function to fetch all tasks from the backend
  const fetchTasks = async () => {
    try {
      // Set loading to true while fetching
      setLoading(true);
      
      // Clear any previous errors
      setError('');
      
      // Call our API service to get tasks
      const fetchedTasks = await taskService.getAllTasks();
      
      // Update state with fetched tasks
      setTasks(fetchedTasks);
      
    } catch (err) {
      // Handle any errors during fetch
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      // Always set loading to false when done (success or error)
      setLoading(false);
    }
  };
  
  // Function to create a new task
  const handleCreateTask = async (taskData) => {
    try {
      // Clear any previous errors
      setError('');
      
      // Call API service to create new task
      const newTask = await taskService.createTask(taskData);
      
      // Add new task to beginning of tasks array (newest first)
      setTasks([newTask, ...tasks]);
      
    } catch (err) {
      // Handle creation errors
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    }
  };
  
  // Function to update an existing task
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      // Clear any previous errors
      setError('');
      
      // Call API service to update task
      const updatedTask = await taskService.updateTask(taskId, taskData);
      
      // Update the task in our tasks array
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      
      // Clear editing state
      setEditingTask(null);
      
    } catch (err) {
      // Handle update errors
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };
  
  // Function to delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      // Clear any previous errors
      setError('');
      
      // Call API service to delete task
      await taskService.deleteTask(taskId);
      
      // Remove task from our tasks array
      setTasks(tasks.filter(task => task._id !== taskId));
      
    } catch (err) {
      // Handle deletion errors
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };
  
  // Function to toggle task completion status
  const handleToggleComplete = async (taskId, completed) => {
    try {
      // Update task with new completion status
      await handleUpdateTask(taskId, { completed });
    } catch (err) {
      // Error handling is already done in handleUpdateTask
      console.error('Error toggling task completion:', err);
    }
  };
  
  // Function to start editing a task
  const handleEditTask = (task) => {
    // Set the task to be edited
    setEditingTask(task);
  };
  
  // Function to cancel editing
  const handleCancelEdit = () => {
    // Clear editing state
    setEditingTask(null);
  };
  
  // ========================================
  // RENDER COMPONENT
  // ========================================
  
  return (
    <div className="app">
      {/* Main header */}
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently</p>
      </header>
      
      {/* Main content area */}
      <main className="app-main">
        
        {/* Display error message if any */}
        {error && (
          <div className="error-message">
            {error}
            {/* Button to retry loading tasks */}
            <button onClick={fetchTasks} className="retry-btn">
              Retry
            </button>
          </div>
        )}
        
        {/* Task creation/editing form */}
        <section className="form-section">
          <TaskForm
            onSubmit={editingTask ? 
              // If editing, call update function
              (data) => handleUpdateTask(editingTask._id, data) : 
              // If not editing, call create function
              handleCreateTask
            }
            initialData={editingTask}
            isEditing={!!editingTask}
            onCancel={handleCancelEdit}
          />
        </section>
        
        {/* Task statistics */}
        <section className="stats-section">
          <TaskStats tasks={tasks} />
        </section>
        
        {/* Task list */}
        <section className="list-section">
          {loading ? (
            // Show loading message while fetching
            <div className="loading">Loading tasks...</div>
          ) : (
            // Show task list when loaded
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </section>
        
      </main>
      
      {/* Footer */}
      <footer className="app-footer">
        <p>Built with React and Node.js</p>
      </footer>
    </div>
  );
}

// Export App component as default export
export default App;
