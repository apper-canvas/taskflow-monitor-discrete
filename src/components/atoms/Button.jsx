import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, ...rest }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            {...rest} // Passes framer-motion props like whileHover, whileTap, and standard button props
        >
            {children}
        </motion.button>
    );
};

export default Button;