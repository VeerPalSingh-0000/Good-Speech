import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ onClick, label = "Back", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, x: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`group inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold border border-slate-200/80 dark:border-slate-800/90 hover:border-purple-500/40 dark:hover:border-purple-500/40 backdrop-blur-xl transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/10 ${className}`}
    >
      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform duration-300 shrink-0">
        <FaArrowLeft size={11} />
      </div>
      <span>{label}</span>
    </motion.button>
  );
};

export default BackButton;
