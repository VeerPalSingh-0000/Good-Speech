import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaFolder, FaScroll } from 'react-icons/fa';
import harryPotterImg from '../../../assets/hp.jpg';

const CategoryCard = ({ category, count, onSelect }) => {
  const getIcon = () => {
    if (category === "Harry Potter") {
      return (
        <img
          src={harryPotterImg}
          alt="Harry Potter"
          className="w-24 h-24 object-cover rounded-full border-2 border-purple-200"
        />
      );
    }
    if (category === "Hindi Folktales") {
      return (
        <FaScroll size={64} className="text-orange-500 dark:text-orange-400" />
      );
    }
    return <FaFolder size={64} className="text-yellow-400" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(category)}
      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100 dark:border-slate-700 cursor-pointer group p-8 flex flex-col items-center justify-center gap-4"
    >
      <div
        className={`p-4 bg-white dark:bg-slate-700 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 ${category === "Harry Potter" ? "p-1" : ""}`}
      >
        {getIcon()}
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {category}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {count} Stories
        </p>
      </div>
    </motion.div>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryCard;
