import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon'; // ApperIcon remains in its original location
import TaskCard from '@/components/TaskCard'; // TaskCard remains in its original location
import Button from '@/components/atoms/Button';

const TaskListSection = ({
    filteredTasks,
    searchQuery,
    selectedCategory,
    onTaskUpdate,
    onTaskDelete,
    onEditTask,
    onCreateFirstTaskClick,
}) => {
    return (
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
                            <Button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onCreateFirstTaskClick}
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium flex items-center space-x-2 mx-auto"
                            >
                                <ApperIcon name="Plus" size={16} />
                                <span>Create First Task</span>
                            </Button>
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
                                        onEdit={onEditTask}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TaskListSection;