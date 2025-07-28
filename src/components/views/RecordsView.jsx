// src/features/hindi/components/views/RecordsView.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime, formatSafeDate, calculateQuality } from '../../utilities/helpers';
import { FaTrash } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const SectionHeader = ({ title, recordCount, sectionKey, icon, isOpen, onClick }) => (
  <motion.div
    variants={itemVariants}
    className="p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-lg hover:shadow-xl"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <i className={`${icon} text-white text-xl`}></i>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{recordCount} कुल रिकॉर्ड</p>
        </div>
      </div>
      <i className={`fas fa-chevron-down text-2xl text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
    </div>
  </motion.div>
);

const RecordsView = ({ records, deleteRecord }) => {
  const [openSection, setOpenSection] = useState('sounds'); // Default to open 'sounds' section

  const soundRecords = (records?.sounds || []).sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));
  const varnmalaRecords = (records?.varnmala || []).sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));
  const storyRecords = (records?.stories || []).sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="p-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">प्रगति रिकॉर्ड</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl mx-auto">Track your improvement over time with detailed session records and progress analytics.</p>
      </motion.div>

      {/* Sound Records Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <SectionHeader title="स्वर अभ्यास रिकॉर्ड" recordCount={soundRecords.length} sectionKey="sounds" icon="fas fa-microphone" isOpen={openSection === 'sounds'} onClick={() => setOpenSection(openSection === 'sounds' ? null : 'sounds')} />
        <AnimatePresence>
        {openSection === 'sounds' && (
          <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-700"><tr><th className="p-4 rounded-tl-lg">स्वर</th><th className="p-4">समय</th><th className="p-4">दिनांक</th><th className="p-4 rounded-tr-lg">Action</th></tr></thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {soundRecords.length > 0 ? soundRecords.map(rec => (
                      <tr key={rec.id}>
                        <td className="p-4 font-bold text-purple-600 text-2xl">{rec.sound}</td>
                        <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                        <td className="p-4"><button onClick={() => deleteRecord(rec.id)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button></td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="p-8 text-center text-slate-500">No sound records yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      {/* Varnmala Records Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <SectionHeader title="वर्णमाला अभ्यास रिकॉर्ड" recordCount={varnmalaRecords.length} sectionKey="varnmala" icon="fas fa-list" isOpen={openSection === 'varnmala'} onClick={() => setOpenSection(openSection === 'varnmala' ? null : 'varnmala')} />
        <AnimatePresence>
        {openSection === 'varnmala' && (
          <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-700"><tr><th className="p-4 rounded-tl-lg">समय</th><th className="p-4">गुणवत्ता</th><th className="p-4">दिनांक</th><th className="p-4 rounded-tr-lg">Action</th></tr></thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {varnmalaRecords.length > 0 ? varnmalaRecords.map(rec => (
                      <tr key={rec.id}>
                        <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                        <td className="p-4 font-semibold">{rec.quality || calculateQuality(rec.time / 10)}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                        <td className="p-4"><button onClick={() => deleteRecord(rec.id)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button></td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="p-8 text-center text-slate-500">No alphabet records yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      {/* Stories Records Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <SectionHeader title="पठन अभ्यास रिकॉर्ड" recordCount={storyRecords.length} sectionKey="stories" icon="fas fa-book" isOpen={openSection === 'stories'} onClick={() => setOpenSection(openSection === 'stories' ? null : 'stories')} />
        <AnimatePresence>
        {openSection === 'stories' && (
          <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-700"><tr><th className="p-4 rounded-tl-lg">कहानी</th><th className="p-4">समय</th><th className="p-4">प्रतिशत</th><th className="p-4">दिनांक</th><th className="p-4 rounded-tr-lg">Action</th></tr></thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {storyRecords.length > 0 ? storyRecords.map(rec => (
                      <tr key={rec.id}>
                        <td className="p-4 font-bold max-w-xs truncate">{rec.storyTitle || "N/A"}</td>
                        <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                        <td className="p-4 font-semibold">{rec.percentage || 0}%</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                        <td className="p-4"><button onClick={() => deleteRecord(rec.id)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button></td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-8 text-center text-slate-500">No story records yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default RecordsView;
