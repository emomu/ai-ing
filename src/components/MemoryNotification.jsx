import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MemoryNotification.css';

const MemoryNotification = ({ show, isDark }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`memory-notification ${isDark ? 'dark' : 'light'}`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="memory-icon"
          >
            💾
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="memory-text"
          >
            Memory Saved
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemoryNotification;
