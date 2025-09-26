// Import React hooks for state and effects
import React, { useState, useEffect } from 'react';

// Import icons from react-icons library
import { FiPlus, FiEdit, FiX } from 'react-icons/fi';

// TaskForm component for creating and editing tasks
const TaskForm = ({ onSubmit, initialData, isEditing, onCancel }) => {
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Form data state - stores all form field values
  const [formData, setFormData] = useState({
    title: '',           // Task title
    description: '',     // Task description
    priority: 'medium'   // Task priority (default: medium)
  });
  
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // ========================================
  // POPULATE FORM WHEN EDITING
  // ========================================
  
  // useEffect to populate form data when editing a task
  useEffect(() => {
    if (initialData && isEditing) {
      // If we have initial data and we're in edit mode, populate form
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium'
      });
      
      // Clear any previous errors
      setErrors({});
      
    } else {
      // If not editing, reset form to empty state
      setFormData({
        title: '',
        description: '',
        priority: 'medium'
      });
      setErrors({});
    }
  }, [initialData, isEditing]); // Re-run when initialData or isEditing changes
  
  // ========================================
  // FORM HANDLING FUNCTIONS
  // ========================================
  
  // Handle input field changes
  const handleInputChange = (e) => {
    // Get field name and value from the event target
    const { name, value } = e.target;
    
    // Update form data with new value
    setFormData(prev => ({
      ...prev,        // Spread previous data
      [name]: value   // Update specific field
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form data before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Check if title is provided and not just whitespace
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Validate description length (optional field)
    if (formData.description.length > 250) {
      newErrors.description = 'Description must be less than 250 characters';
    }
    
    // Set errors state
    setErrors(newErrors);
    
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Validate form data
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    
    try {
      // Set submitting state to show loading
      setIsSubmitting(true);
      
      // Prepare data for submission (trim whitespace)
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority
      };
      
      // Call parent component's submit handler
      await onSubmit(dataToSubmit);
      
      // Reset form only if not editing (creating new task)
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium'
        });
      }
      
      // Clear any errors
      setErrors({});
      
    } catch (error) {
      // Handle submission errors
      console.error('Form submission error:', error);
      
      // Set general error message
      setErrors({
        submit: error.message || 'Failed to save task. Please try again.'
      });
      
    } finally {
      // Always stop loading state - (we use finally block to underline that we want execute this code every time)
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel button click (for editing mode)
  const handleCancel = () => {
    // Clear form data
    setFormData({
      title: '',
      description: '',
      priority: 'medium'
    });
    
    // Clear errors
    setErrors({});
    
    // Call parent cancel handler
    if (onCancel) {
      onCancel();
    }
  };
  
  // ========================================
  // RENDER COMPONENT
  // ========================================
  
  return (
    <div className="task-form-container">
      
      {/* Form header with title and icon */}
      <div className="form-header">
        <h2>
          {/* Show different icon and text based on mode */}
          {isEditing ? (
            <>
              <FiEdit className="form-icon" />
              Edit Task
            </>
          ) : (
            <>
              <FiPlus className="form-icon" />
              Add New Task
            </>
          )}
        </h2>
      </div>
      
      {/* The actual form */}
      <form onSubmit={handleSubmit} className="task-form">
        
        {/* Title input field */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title..."
            disabled={isSubmitting}
            maxLength={100}
          />
          {/* Show error message if validation fails */}
          {errors.title && (
            <span className="error-text">{errors.title}</span>
          )}
        </div>
        
        {/* Description textarea field */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter task description (optional)..."
            disabled={isSubmitting}
            rows={3}
            maxLength={250}
          />
          {/* Show character count */}
          <small className="char-count">
            {formData.description.length}/250
          </small>
          {/* Show error message if validation fails */}
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>
        
        {/* Priority select field */}
        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="form-select"
            disabled={isSubmitting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        {/* Form submission errors */}
        {errors.submit && (
          <div className="form-error">
            {errors.submit}
          </div>
        )}
        
        {/* Form action buttons */}
        <div className="form-actions">
          
          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? (
              // Show loading state
              <>
                <span className="loading-spinner"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              // Show normal state
              <>
                {isEditing ? (
                  <>
                    <FiEdit className="btn-icon" />
                    Update Task
                  </>
                ) : (
                  <>
                    <FiPlus className="btn-icon" />
                    Add Task
                  </>
                )}
              </>
            )}
          </button>
          
          {/* Cancel button (only show in edit mode) */}
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              <FiX className="btn-icon" />
              Cancel
            </button>
          )}
          
        </div>
        
      </form>
      
    </div>
  );
};

// Export component as default
export default TaskForm;