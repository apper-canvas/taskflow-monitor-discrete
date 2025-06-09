import React from 'react';

const SortDropdown = ({ sortBy, setSortBy }) => {
    return (
        <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        >
            <option value="created">Sort by Created</option>
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
        </select>
    );
};

export default SortDropdown;