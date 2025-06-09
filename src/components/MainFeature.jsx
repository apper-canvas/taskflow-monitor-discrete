import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import CategoryFilter from './CategoryFilter';
import { format, isToday, isTomorrow, isOverdue } from 'date-fns';

export default function MainFeature({ 
  tasks, 
  categories, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('created'); // created, priority, dueDate

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => !task.archived);

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [tasks, selectedCategory, searchQuery, sortBy]);

  // Calculate progress
  const completedTasks = tasks.filter(task => task.completed && !task.archived).length;
  const totalTasks = tasks.filter(task => !task.archived).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await onTaskUpdate(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        await onTaskCreate(taskData);
      }
      setShowTaskForm(false);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Progress ring component
  const ProgressRing = ({ percentage }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            stroke="#5B21B6"
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="progress-ring"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-full">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                TaskFlow
              </h1>
              <ProgressRing percentage={progressPercentage} />
            </div>
            
            <div className="flex-1 max-w-md min-w-0">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={16} 
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="created">Sort by Created</option>
              <option value="priority">Sort by Priority</option>
              <option value="dueDate">Sort by Due Date</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span>Add Task</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            tasks={tasks}
          />
        </aside>

        {/* Task List */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-full overflow-hidden">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mb-8"
                >
                  {searchQuery || selectedCategory !== 'all' ? (
                    <ApperIcon name="SearchX" className="w-16 h-16 text-gray-300 mx-auto" />
                  ) : (
                    <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
                  )}
                </motion.div>
                
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No tasks found' 
                    : 'No tasks yet'
                  }
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Create your first task to get organized and boost productivity'
                  }
                </p>
                
                {!searchQuery && selectedCategory === 'all' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTaskForm(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium flex items-center space-x-2 mx-auto"
                  >
                    <ApperIcon name="Plus" size={16} />
                    <span>Create First Task</span>
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ 
                        duration: 0.2,
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      layout
                    >
                      <TaskCard
                        task={task}
                        onUpdate={onTaskUpdate}
                        onDelete={onTaskDelete}
                        onEdit={handleEditTask}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <TaskForm
                  categories={categories}
                  onSubmit={handleTaskSubmit}
                  onCancel={handleCloseForm}
                  initialData={editingTask}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}