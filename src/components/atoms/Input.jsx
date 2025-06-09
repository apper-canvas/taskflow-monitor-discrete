import React from 'react';

const Input = ({ className, ...rest }) => {
    return (
        <input
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
            {...rest} // Passes standard input props like type, placeholder, value, onChange
        />
    );
};

export default Input;