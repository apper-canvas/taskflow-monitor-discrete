import React from 'react';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon'; // ApperIcon remains in its original location

const SearchBar = ({ searchQuery, setSearchQuery, placeholder = "Search..." }) => {
    return (
        <div className="relative flex-1 max-w-md min-w-0">
            <ApperIcon
                name="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2" // Override default padding from Input atom
            />
        </div>
    );
};

export default SearchBar;