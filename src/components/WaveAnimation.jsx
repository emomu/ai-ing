import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WaveAnimation.css';

const WaveAnimation = ({ isActive, isDark }) => {
  const bars = Array.from({ length: 5 }, (_, i) => i);

  const barVariants = {
    inactive: {
      scaleY: 0.3,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    active: (i) => ({
      scaleY: [0.3, 1, 0.5, 1, 0.3],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="wave-animation">
      {bars.map((i) => (
        <motion.div
          key={i}
          className={`wave-bar ${isDark ? 'dark' : 'light'}`}
          custom={i}
          variants={barVariants}
          initial="inactive"
          animate={isActive ? 'active' : 'inactive'}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
