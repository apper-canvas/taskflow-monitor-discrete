import React from 'react';
import ProgressRing from '@/components/molecules/ProgressRing';
import SearchBar from '@/components/molecules/SearchBar';
import SortDropdown from '@/components/molecules/SortDropdown';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DashboardHeader = ({
    progressPercentage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    onAddTaskClick,
}) => {
    return (
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-full">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-heading font-bold text-gray-900">
                            TaskFlow
                        </h1>
                        <ProgressRing percentage={progressPercentage} />
                    </div>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder="Search tasks..."
                    />
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                    <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                    <Button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onAddTaskClick}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium flex items-center space-x-2"
                    >
                        <ApperIcon name="Plus" size={16} />
                        <span>Add Task</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;