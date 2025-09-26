// Import React hooks and components
import React, { useState, useMemo } from 'react';

// Import icons from react-icons library
import { 
  FiCheck, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiAlertCircle,
  FiClock
} from 'react-icons/fi';

// TaskList component to display and manage tasks
const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Filter state - controls which tasks are visible
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  
  // Sort state - controls task ordering
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'priority', 'alphabetical'
  
  // Loading states for individual tasks (for optimistic updates)
  const [loadingTasks, setLoadingTasks] = useState(new Set());
  
  // ========================================
  // MEMOIZED COMPUTED VALUES
  // ========================================
  
  // Filter and sort tasks based on current filter and sort settings
  const filteredAndSortedTasks = useMemo(() => {
    
    // First, filter tasks based on selected filter
    let filtered = tasks.filter(task => {
      switch (filter) {
        case 'active':
          // Show only incomplete tasks
          return !task.completed;
        case 'completed':
          // Show only completed tasks
          return task.completed;
        case 'all':
        default:
          // Show all tasks
          return true;
      }
    });
    
    // Then, sort filtered tasks based on selected sort option
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          // Sort by creation date, oldest first
          return new Date(a.createdAt) - new Date(b.createdAt);
          
        case 'priority':
          // Sort by priority level (high > medium > low)
          { const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority]; }
          
        case 'alphabetical':
          // Sort by title alphabetically
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
          
        case 'newest':
        default:
          // Sort by creation date, newest first (default)
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    return sorted;
    
  }, [tasks, filter, sortBy]); // Recompute when tasks, filter, or sortBy changes
  
  // ========================================
  // EVENT HANDLERS
  // ========================================
  
  // Handle task completion toggle with loading state
  const handleToggleComplete = async (taskId, completed) => {
    try {
      // Add task to loading set
      setLoadingTasks(prev => new Set(prev).add(taskId));
      
      // Call parent handler
      await onToggleComplete(taskId, completed);
      
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      // Remove task from loading set
      setLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };
  
  // Handle task deletion with confirmation
  const handleDelete = async (taskId, taskTitle) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${taskTitle}"?\nThis action cannot be undone.`
    );
    
    if (!confirmed) {
      return; // User cancelled
    }
    
    try {
      // Add task to loading set
      setLoadingTasks(prev => new Set(prev).add(taskId));
      
      // Call parent handler
      await onDelete(taskId);
      
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      // Remove task from loading set
      setLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };
  
  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  // Get priority icon based on priority level - (that's a plus method, not necessary)
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FiAlertCircle className="priority-icon high" />;
      case 'low':
        return <FiClock className="priority-icon low" />;
      case 'medium':
      default:
        return <FiClock className="priority-icon medium" />;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      // Show "X hours ago" for recent tasks
      const hours = Math.floor(diffInHours);
      return hours === 0 ? 'Just now' : `${hours}h ago`;
    } else {
      // Show actual date for older tasks
      return date.toLocaleDateString();
    }
  };
  
  // ========================================
  // RENDER COMPONENT
  // ========================================
  
  return (
    <div className="task-list-container">
      
      {/* List header with filters and controls */}
      <div className="list-header">
        <h2>
          <FiFilter className="header-icon" />
          Tasks ({filteredAndSortedTasks.length})
        </h2>
        
        {/* Filter and sort controls */}
        <div className="list-controls">
          
          {/* Filter dropdown */}
          <div className="control-group">
            <label htmlFor="filter">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="control-select"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* Sort dropdown */}
          <div className="control-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          
        </div>
      </div>
      
      {/* Task list */}
      <div className="task-list">
        
        {/* Show message if no tasks match filter */}
        {filteredAndSortedTasks.length === 0 ? (
          <div className="empty-state">
            {tasks.length === 0 ? (
              // No tasks at all
              <div>
                <h3>No tasks yet!</h3>
                <p>Create your first task using the form above.</p>
              </div>
            ) : (
              // No tasks match current filter
              <div>
                <h3>No tasks found</h3>
                <p>Try changing your filter settings.</p>
              </div>
            )}
          </div>
        ) : (
          // Show filtered tasks
          filteredAndSortedTasks.map((task) => (
            <div
              key={task._id}
              className={`task-item ${task.completed ? 'completed' : 'active'} ${
                loadingTasks.has(task._id) ? 'loading' : ''
              }`}
            >
              
              {/* Task completion checkbox */}
              <div className="task-checkbox">
                <button
                  onClick={() => handleToggleComplete(task._id, !task.completed)}
                  className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
                  disabled={loadingTasks.has(task._id)}
                  aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {task.completed && <FiCheck className="check-icon" />}
                </button>
              </div>
              
              {/* Task content */}
              <div className="task-content">
                
                {/* Task header with title and priority */}
                <div className="task-header">
                  <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="task-priority">
                    {getPriorityIcon(task.priority)}
                    <span className={`priority-text ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                {/* Task description (if exists) */}
                {task.description && (
                  <p className="task-description">
                    {task.description}
                  </p>
                )}
                
                {/* Task metadata */} //optional
                <div className="task-meta">
                  <span className="task-date">
                    Created {formatDate(task.createdAt)}
                  </span>
                  {task.updatedAt !== task.createdAt && (
                    <span className="task-date">
                      • Updated {formatDate(task.updatedAt)}
                    </span>
                  )}
                </div>
                
              </div>
              
              {/* Task actions */}
              <div className="task-actions">
                
                {/* Edit button */}
                <button
                  onClick={() => onEdit(task)}
                  className="action-btn edit-btn"
                  disabled={loadingTasks.has(task._id)}
                  aria-label="Edit task"
                  title="Edit task"
                >
                  <FiEdit2 className="action-icon" />
                </button>
                
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(task._id, task.title)}
                  className="action-btn delete-btn"
                  disabled={loadingTasks.has(task._id)}
                  aria-label="Delete task"
                  title="Delete task"
                >
                  <FiTrash2 className="action-icon" />
                </button>
                
              </div>
              
              {/* Loading overlay for individual task */}
              {loadingTasks.has(task._id) && (
                <div className="task-loading-overlay">
                  <span className="loading-spinner"></span>
                </div>
              )}
              
            </div>
          ))
        )}
        
      </div>
      
      {/* List footer with summary */}
      {tasks.length > 0 && (
        <div className="list-footer">
          <p className="task-summary">
            Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
            {filter !== 'all' && ` (${filter})`}
          </p>
        </div>
      )}
      
    </div>
  );
};

// Export component as default
export default TaskList;