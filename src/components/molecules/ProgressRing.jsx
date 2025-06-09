import React from 'react';

const ProgressRing = ({ percentage }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-10 h-10">
            <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    fill="none"
                />
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    stroke="#5B21B6"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="progress-ring"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};

export default ProgressRing;