import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from '@/components/TaskForm'; // TaskForm remains in its original location

const TaskFormModal = ({ showTaskForm, handleCloseForm, handleTaskSubmit, editingTask, categories }) => {
    return (
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
    );
};

export default TaskFormModal;