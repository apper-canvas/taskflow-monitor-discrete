import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, className, inputClassName, ...inputProps }) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <Input id={id} className={inputClassName} {...inputProps} />
        </div>
    );
};

export default FormField;