// src/features/hindi/components/views/RecordsView.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { formatTime, formatSafeDate, calculateQuality } from '../../utilities/helpers';
import { FaTrash } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const RecordsView = ({ records, deleteRecord }) => {

  const soundRecords = (records?.sounds || []).sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));
  const varnmalaRecords = (records?.varnmala || []).sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));
  const storyRecords = (records?.stories || []).sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="p-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">प्रगति रिकॉर्ड</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl mx-auto">Track your improvement over time with detailed session records and progress analytics.</p>
      </motion.div>

      {/* Sound Records Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-4">स्वर अभ्यास रिकॉर्ड</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700">
                <th className="p-4 rounded-tl-lg">स्वर</th>
                <th className="p-4">समय</th>
                <th className="p-4">दिनांक</th>
                <th className="p-4 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {soundRecords.length > 0 ? soundRecords.map(rec => (
                <tr key={rec.id}>
                  <td className="p-4 font-bold text-purple-600 text-2xl">{rec.sound}</td>
                  <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                  <td className="p-4">
                    <button onClick={() => deleteRecord(rec.id)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No sound records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Varnmala Records Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-4">वर्णमाला अभ्यास रिकॉर्ड</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700">
                <th className="p-4 rounded-tl-lg">समय</th>
                <th className="p-4">गुणवत्ता</th>
                <th className="p-4">दिनांक</th>
                <th className="p-4 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {varnmalaRecords.length > 0 ? varnmalaRecords.map(rec => (
                <tr key={rec.id}>
                  <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                  <td className="p-4 font-semibold">{rec.quality || calculateQuality(rec.time / 10)}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                  <td className="p-4">
                    <button onClick={() => deleteRecord(rec.id)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No alphabet records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Stories Records Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-4">पठन अभ्यास रिकॉर्ड</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700">
                <th className="p-4 rounded-tl-lg">कहानी</th>
                <th className="p-4">समय</th>
                <th className="p-4">प्रतिशत</th>
                <th className="p-4">दिनांक</th>
                <th className="p-4 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {storyRecords.length > 0 ? storyRecords.map(rec => (
                <tr key={rec.id}>
                  <td className="p-4 font-bold max-w-xs truncate">{rec.storyTitle || "N/A"}</td>
                  <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                  <td className="p-4 font-semibold">{rec.percentage || 0}%</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                  <td className="p-4">
                    <button onClick={() => deleteRecord(rec.id)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No story records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default RecordsView;
