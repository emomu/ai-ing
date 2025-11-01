import React from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = '' }) => {
  const sizes = {
    small: '24px',
    medium: '40px',
    large: '60px',
  };

  return (
    <div className="loading-spinner-container">
      <motion.div
        className="loading-spinner"
        style={{ width: sizes[size], height: sizes[size] }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="spinner-ring"></div>
      </motion.div>
      {message && (
        <motion.p
          className="loading-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
