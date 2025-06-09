import React, { useState, useMemo } from 'react';
import CategoryFilter from '@/components/CategoryFilter'; // CategoryFilter remains in its original location
import DashboardHeader from '@/components/organisms/DashboardHeader';
import TaskListSection from '@/components/organisms/TaskListSection';
import TaskFormModal from '@/components/organisms/TaskFormModal';

const TaskDashboardOrganism = ({
    tasks,
    categories,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
}) => {
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
            // Error handling (toast) is managed by the HomePage component
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

    return (
        <div className="h-screen flex flex-col overflow-hidden max-w-full">
            <DashboardHeader
                progressPercentage={progressPercentage}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onAddTaskClick={() => setShowTaskForm(true)}
            />

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
                <TaskListSection
                    filteredTasks={filteredTasks}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    onTaskUpdate={onTaskUpdate}
                    onTaskDelete={onTaskDelete}
                    onEditTask={handleEditTask}
                    onCreateFirstTaskClick={() => setShowTaskForm(true)}
                />
            </div>

            {/* Task Form Modal */}
            <TaskFormModal
                showTaskForm={showTaskForm}
                handleCloseForm={handleCloseForm}
                handleTaskSubmit={handleTaskSubmit}
                editingTask={editingTask}
                categories={categories}
            />
        </div>
    );
};

export default TaskDashboardOrganism;