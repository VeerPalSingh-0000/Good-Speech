import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaFolder, FaScroll, FaBookOpen, FaCrown, FaFeatherAlt, FaComments } from 'react-icons/fa';
import harryPotterImg from '../../../assets/hp.jpg';

const CategoryCard = ({ category, count, onSelect }) => {
  const getCategoryStyles = () => {
    switch (category) {
      case "Harry Potter":
        return {
          icon: <img src={harryPotterImg} alt="Harry Potter" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-full shadow-md" />,
          bgClass: "from-purple-100 to-fuchsia-50 dark:from-purple-900/40 dark:to-fuchsia-900/20",
          borderClass: "border-purple-200 dark:border-purple-700/50",
          textClass: "group-hover:text-purple-600 dark:group-hover:text-purple-400"
        };
      case "Hindi Classics":
      case "Hindi Folktales":
        return {
          icon: <FaCrown className="text-amber-500 dark:text-amber-400 text-3xl sm:text-4xl md:text-5xl drop-shadow-md" />,
          bgClass: "from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20",
          borderClass: "border-amber-200 dark:border-amber-700/50",
          textClass: "group-hover:text-amber-600 dark:group-hover:text-amber-400"
        };
      case "Classic Literature":
        return {
          icon: <FaFeatherAlt className="text-emerald-500 dark:text-emerald-400 text-3xl sm:text-4xl md:text-5xl drop-shadow-md" />,
          bgClass: "from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20",
          borderClass: "border-emerald-200 dark:border-emerald-700/50",
          textClass: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
        };

      case "Speech Therapy Standard":
        return {
          icon: <FaComments className="text-rose-500 dark:text-rose-400 text-3xl sm:text-4xl md:text-5xl drop-shadow-md" />,
          bgClass: "from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20",
          borderClass: "border-rose-200 dark:border-rose-700/50",
          textClass: "group-hover:text-rose-600 dark:group-hover:text-rose-400"
        };
      default:
        return {
          icon: <FaFolder className="text-slate-400 dark:text-slate-500 text-3xl sm:text-4xl md:text-5xl drop-shadow-md" />,
          bgClass: "from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800",
          borderClass: "border-slate-200 dark:border-slate-700",
          textClass: "group-hover:text-slate-600 dark:group-hover:text-slate-300"
        };
    }
  };

  const styles = getCategoryStyles();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(category)}
      className={`bg-gradient-to-br ${styles.bgClass} rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border ${styles.borderClass} cursor-pointer group p-4 sm:p-6 md:p-8 flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-6 relative`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 dark:bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
      
      <div
        className={`p-3 sm:p-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0 ${category === "Harry Potter" ? "p-1 sm:p-1 rounded-full" : ""}`}
      >
        {styles.icon}
      </div>
      <div className="text-left sm:text-center z-10 flex-1">
        <h3 className={`text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 ${styles.textClass} transition-colors line-clamp-2`}>
          {category}
        </h3>
        <div className="inline-flex items-center justify-center mt-1 sm:mt-2 px-3 py-1 bg-white/60 dark:bg-slate-800/60 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm border border-black/5 dark:border-white/5">
          {count} {count === 1 ? 'Story' : 'Stories'}
        </div>
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
