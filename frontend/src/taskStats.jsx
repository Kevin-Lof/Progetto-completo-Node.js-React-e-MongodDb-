// Import React for component creation
import React from 'react';

// Import icons for statistics display
import { 
  FiCheckCircle, 
  FiCircle, 
  FiAlertCircle, 
  FiBarChart3,
  FiTrendingUp
} from 'react-icons/fi';

// TaskStats component to display task statistics and progress
const TaskStats = ({ tasks }) => {
  
  // ========================================
  // CALCULATE STATISTICS
  // ========================================
  
  // Calculate total number of tasks
  const totalTasks = tasks.length;
  
  // Calculate completed tasks
  const completedTasks = tasks.filter(task => task.completed).length;
  
  // Calculate active (incomplete) tasks
  const activeTasks = totalTasks - completedTasks;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  // Calculate tasks by priority
  const tasksByPriority = tasks.reduce((acc, task) => {
    // Count tasks for each priority level
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });
  
  // Calculate completed tasks by priority
  const completedByPriority = tasks
    .filter(task => task.completed)
    .reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, { high: 0, medium: 0, low: 0 });
  
  // Calculate today's tasks (created today)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  
  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }).length; //(not so useful)
  
  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  // Get motivational message based on completion rate
  const getMotivationalMessage = () => {
    if (totalTasks === 0) {
      return "Ready to start your productivity journey!";
    } else if (completionPercentage === 100) {
      return "🎉 Amazing! All tasks completed!";
    } else if (completionPercentage >= 80) {
      return "🚀 You're doing great! Almost there!";
    } else if (completionPercentage >= 50) {
      return "💪 Good progress! Keep it up!";
    } else if (completionPercentage >= 20) {
      return "📈 You're making progress!";
    } else {
      return "🎯 Let's get those tasks done!";
    }
  };
  
  // Get priority color class
  const getPriorityColorClass = (priority) => {
    return `priority-${priority}`;
  };
  
  // ========================================
  // RENDER COMPONENT
  // ========================================
  
  return (
    <div className="task-stats-container">
      
      {/* Stats header */}
      <div className="stats-header">
        <h2>
          <FiBarChart3 className="stats-icon" />
          Statistics
        </h2>
        <div className="motivational-message">
          {getMotivationalMessage()}
        </div>
      </div>
      
      {/* Main statistics grid */}
      <div className="stats-grid">
        
        {/* Total tasks card */}
        <div className="stat-card total">
          <div className="stat-icon-container">
            <FiBarChart3 className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        
        {/* Completed tasks card */}
        <div className="stat-card completed">
          <div className="stat-icon-container">
            <FiCheckCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        {/* Active tasks card */}
        <div className="stat-card active">
          <div className="stat-icon-container">
            <FiCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{activeTasks}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        
        {/* Today's tasks card */}
        <div className="stat-card today">
          <div className="stat-icon-container">
            <FiTrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{todaysTasks}</div>
            <div className="stat-label">Created Today</div>
          </div>
        </div>
        
      </div>
      
      {/* Progress section */}
      {totalTasks > 0 && (
        <div className="progress-section">
          
          {/* Progress bar */}
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-label">Overall Progress</span>
              <span className="progress-percentage">{completionPercentage}%</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            
            <div className="progress-details">
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </div>
          </div>
          
        </div>
      )}
      
      {/* Priority breakdown section */}
      {totalTasks > 0 && (
        <div className="priority-section">
          
          <h3 className="section-title">
            <FiAlertCircle className="section-icon" />
            Tasks by Priority
          </h3>
          
          <div className="priority-stats">
            
            {/* High priority */}
            <div className="priority-item">
              <div className="priority-header">
                <span className={`priority-dot ${getPriorityColorClass('high')}`}></span>
                <span className="priority-name">High Priority</span>
                <span className="priority-count">
                  {tasksByPriority.high} total
                </span>
              </div>
              
              {tasksByPriority.high > 0 && (
                <div className="priority-progress">
                  <div className="priority-bar">
                    <div 
                      className={`priority-fill ${getPriorityColorClass('high')}`}
                      style={{ 
                        width: `${(completedByPriority.high / tasksByPriority.high) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="priority-completion">
                    {completedByPriority.high}/{tasksByPriority.high} done
                  </span>
                </div>
              )}
            </div>
            
            {/* Medium priority */}
            <div className="priority-item">
              <div className="priority-header">
                <span className={`priority-dot ${getPriorityColorClass('medium')}`}></span>
                <span className="priority-name">Medium Priority</span>
                <span className="priority-count">
                  {tasksByPriority.medium} total
                </span>
              </div>
              
              {tasksByPriority.medium > 0 && (
                <div className="priority-progress">
                  <div className="priority-bar">
                    <div 
                      className={`priority-fill ${getPriorityColorClass('medium')}`}
                      style={{ 
                        width: `${(completedByPriority.medium / tasksByPriority.medium) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="priority-completion">
                    {completedByPriority.medium}/{tasksByPriority.medium} done
                  </span>
                </div>
              )}
            </div>
            
            {/* Low priority */}
            <div className="priority-item">
              <div className="priority-header">
                <span className={`priority-dot ${getPriorityColorClass('low')}`}></span>
                <span className="priority-name">Low Priority</span>
                <span className="priority-count">
                  {tasksByPriority.low} total
                </span>
              </div>
              
              {tasksByPriority.low > 0 && (
                <div className="priority-progress">
                  <div className="priority-bar">
                    <div 
                      className={`priority-fill ${getPriorityColorClass('low')}`}
                      style={{ 
                        width: `${(completedByPriority.low / tasksByPriority.low) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="priority-completion">
                    {completedByPriority.low}/{tasksByPriority.low} done
                  </span>
                </div>
              )}
            </div>
            
          </div>
          
        </div>
      )}
      
      {/* Empty state message */}
      {totalTasks === 0 && (
        <div className="empty-stats">
          <div className="empty-icon">
            <FiBarChart3 />
          </div>
          <h3>No Statistics Yet</h3>
          <p>Create some tasks to see your progress statistics here!</p>
        </div>
      )}
      
    </div>
  );
};

// Export component as default
export default TaskStats;