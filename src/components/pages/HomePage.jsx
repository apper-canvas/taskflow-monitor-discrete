import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // framer-motion is used in original Home.jsx
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import TaskDashboardOrganism from '@/components/organisms/TaskDashboardOrganism';
import Button from '@/components/atoms/Button'; // For the retry button

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [tasksData, categoriesData] = await Promise.all([
                    taskService.getAll(),
                    categoryService.getAll()
                ]);
                setTasks(tasksData);
                setCategories(categoriesData);
            } catch (err) {
                setError(err.message || 'Failed to load data');
                toast.error('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleTaskCreate = async (taskData) => {
        try {
            const newTask = await taskService.create(taskData);
            setTasks(prev => [newTask, ...prev]);
            toast.success('Task created successfully');
            return newTask;
        } catch (err) {
            toast.error('Failed to create task');
            throw err;
        }
    };

    const handleTaskUpdate = async (id, updates) => {
        try {
            const updatedTask = await taskService.update(id, updates);
            setTasks(prev => prev.map(task =>
                task.id === id ? updatedTask : task
            ));
            if (updates.completed !== undefined) {
                toast.success(updates.completed ? 'Task completed!' : 'Task reopened');
            } else {
                toast.success('Task updated');
            }
            return updatedTask;
        } catch (err) {
            toast.error('Failed to update task');
            throw err;
        }
    };

    const handleTaskDelete = async (id) => {
        try {
            await taskService.delete(id);
            setTasks(prev => prev.filter(task => task.id !== id));
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-full overflow-hidden">
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-sm"
                            >
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-y-auto p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center py-12"
                >
                    <div className="bg-error/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
                    >
                        Retry
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <TaskDashboardOrganism
                tasks={tasks}
                categories={categories}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
            />
        </div>
    );
};

export default HomePage;