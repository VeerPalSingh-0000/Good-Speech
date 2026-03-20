import React, { memo } from 'react';
import { motion } from 'framer-motion';

const Mascot = ({ mood = 'happy', size = 120, className = "" }) => {
  // A friendly talking parrot mascot constructed entirely with SVG
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="parrot-body" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="parrot-wing" x1="30" y1="40" x2="60" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="parrot-beak" x1="60" y1="30" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fcd34d" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Tail */}
        <path d="M40 70 L20 95 C15 100 25 100 30 95 L50 75" fill="#047857" />
        <path d="M45 70 L30 100 C25 105 35 105 40 100 L55 75" fill="#fbbf24" />

        {/* Body */}
        <path d="M40 20 C20 30 20 70 50 80 C70 80 80 50 60 20 Z" fill="url(#parrot-body)" />

        {/* Head */}
        <circle cx="55" cy="30" r="18" fill="url(#parrot-body)" />

        {/* Beak */}
        <path d="M70 25 C85 25 90 35 80 40 C75 42 70 40 68 35 Z" fill="url(#parrot-beak)" />
        {mood === 'happy' && (
          <path d="M70 33 C85 33 80 45 78 45 C75 45 70 40 68 35 Z" fill="#b45309" />
        )}

        {/* Eye */}
        <circle cx="60" cy="25" r="5" fill="#ffffff" />
        {mood === 'sleepy' ? (
          <path d="M57 25 Q60 22 63 25" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        ) : (
          <circle cx="62" cy="25" r="2.5" fill="#1e293b" />
        )}

        {/* Wing - animate to wave if happy */}
        <motion.path 
          d="M35 45 C25 55 30 80 45 85 C60 85 55 55 35 45 Z" 
          fill="url(#parrot-wing)"
          animate={mood === 'happy' ? { rotate: [0, -10, 0, -10, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: "45px 45px" }}
        />

        {/* Sleepy bubbles */}
        {mood === 'sleepy' && (
          <motion.g
            animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <text x="75" y="15" fontSize="12" fill="#94a3b8" fontWeight="bold">Z</text>
            <text x="85" y="10" fontSize="8" fill="#94a3b8" fontWeight="bold">z</text>
          </motion.g>
        )}

        {/* Listening / Sound waves */}
        {mood === 'listening' && (
          <motion.g
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path d="M85 20 C90 25 90 35 85 40" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M90 15 C98 25 98 40 90 50" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" fill="none" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};

export default memo(Mascot);
