import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  tasks 
}) {
  const getCategoryCount = (categoryName) => {
    if (categoryName === 'all') {
      return tasks.filter(task => !task.archived).length;
    }
    return tasks.filter(task => 
      task.category === categoryName && !task.archived
    ).length;
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      work: 'Briefcase',
      personal: 'User',
      shopping: 'ShoppingCart',
      health: 'Heart',
      finance: 'DollarSign',
    };
    return icons[categoryName] || 'Tag';
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      work: 'text-primary',
      personal: 'text-success',
      shopping: 'text-accent',
      health: 'text-error',
      finance: 'text-info',
    };
    return colors[categoryName] || 'text-gray-600';
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
        Categories
      </h2>
      
      <div className="space-y-1">
        {/* All Tasks */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategorySelect('all')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <ApperIcon 
              name="Inbox" 
              size={16} 
              className={selectedCategory === 'all' ? 'text-white' : 'text-gray-500'} 
            />
            <span className="font-medium">All Tasks</span>
          </div>
          <span className={`text-sm px-2 py-1 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {getCategoryCount('all')}
          </span>
        </motion.button>

        {/* Category List */}
        {categories.map(category => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategorySelect(category.name)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
              selectedCategory === category.name
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon 
                name={getCategoryIcon(category.name)} 
                size={16} 
                className={selectedCategory === category.name 
                  ? 'text-white' 
                  : getCategoryColor(category.name)
                } 
              />
              <span className="font-medium capitalize">
                {category.name}
              </span>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${
              selectedCategory === category.name
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {getCategoryCount(category.name)}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed</span>
            <span className="font-medium text-success">
              {tasks.filter(task => task.completed && !task.archived).length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium text-gray-900">
              {tasks.filter(task => !task.completed && !task.archived).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}