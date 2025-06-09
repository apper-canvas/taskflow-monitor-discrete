import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';

export default function TaskCard({ task, onUpdate, onDelete, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await onUpdate(task.id, { completed: !task.completed });
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        setIsDeleting(false);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error';
      case 'medium': return 'border-accent';
      case 'low': return 'border-info';
      default: return 'border-gray-300';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-primary/10 text-primary',
      personal: 'bg-success/10 text-success',
      shopping: 'bg-accent/10 text-accent',
      health: 'bg-error/10 text-error',
      finance: 'bg-info/10 text-info',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`;
    return format(date, 'MMM d');
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'text-error';
    if (isToday(date)) return 'text-accent';
    return 'text-gray-600';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${getPriorityColor(task.priority)} 
        hover:shadow-md transition-all ${task.completed ? 'opacity-70' : ''} ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="task-checkbox flex-shrink-0 mt-0.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleComplete}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
              ${task.completed 
                ? 'bg-primary border-primary text-white' 
                : 'border-gray-300 hover:border-primary'
              }`}
            disabled={isDeleting}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Check" size={12} />
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium break-words ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-3 mt-2">
                {/* Category Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                  {task.category}
                </span>

                {/* Priority */}
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-error' :
                    task.priority === 'medium' ? 'bg-accent' : 'bg-info'
                  }`} />
                  <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                </div>

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" size={12} className="text-gray-400" />
                    <span className={`text-xs ${getDueDateColor(task.dueDate)}`}>
                      {formatDueDate(task.dueDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isDeleting}
              >
                <ApperIcon name="Edit2" size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-error transition-colors"
                disabled={isDeleting}
              >
                <ApperIcon name="Trash2" size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}