import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
  children,
  onClick,
  className = '',
  icon = null,
  disabled = false,
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {/* Pulsing Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'currentColor', opacity: 0.1 }}
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{
          scale: [1, 1.5, 1, 1.2, 1],
          opacity: [0, 0.1, 0, 0.05, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />
      
      {/* Ripple Effect on Tap */}
       <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'currentColor', opacity: 0.2 }}
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{
          scale: 4,
          opacity: [0.2, 0],
          transition: { duration: 0.5 },
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span>{children}</span>
      </span>
    </motion.button>
  );
};

export default AnimatedButton;
