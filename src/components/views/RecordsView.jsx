import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime, formatSafeDate, calculateQuality } from '../../utilities/helpers';
import { FaTrash, FaMicrophone, FaList, FaBook, FaChevronDown } from 'react-icons/fa';

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

const SectionHeader = ({ title, recordCount, icon, isOpen, onClick }) => (
    <div
        className="p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-lg hover:shadow-xl"
        onClick={onClick}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    {icon}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{recordCount} कुल रिकॉर्ड</p>
                </div>
            </div>
            <FaChevronDown className={`text-2xl text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
    </div>
);

const RecordsView = ({
    records = { sounds: [], varnmala: [], stories: [] },
    deleteRecord = () => console.error("CRASH PREVENTED: The 'deleteRecord' function was not passed to the RecordsView component.")
}) => {
    const [openSection, setOpenSection] = useState('sounds');

    const soundRecords = [...(records?.sounds || [])].sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));
    const varnmalaRecords = [...(records?.varnmala || [])].sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));
    const storyRecords = [...(records?.stories || [])].sort((a,b) => (b.timestamp?.seconds || b.timestamp) - (a.timestamp?.seconds || a.timestamp));

    const sections = [
        { 
            key: 'sounds', 
            title: 'स्वर अभ्यास रिकॉर्ड', 
            icon: <FaMicrophone size={20} />, 
            records: soundRecords,
            headers: ['स्वर', 'समय', 'दिनांक', 'Action'],
            renderRow: (rec) => (
                <tr key={rec.id}>
                    <td className="p-4 font-bold text-purple-600 text-2xl">{rec.sound}</td>
                    <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                    <td className="p-4"><button onClick={() => deleteRecord(rec.id, 'sounds')} aria-label={`Delete record for ${rec.sound}`} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button></td>
                </tr>
            )
        },
        { 
            key: 'varnmala', 
            title: 'वर्णमाला अभ्यास रिकॉर्ड', 
            icon: <FaList size={20} />, 
            records: varnmalaRecords,
            headers: ['समय', 'गुणवत्ता', 'दिनांक', 'Action'],
            renderRow: (rec) => (
                <tr key={rec.id}>
                    <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                    <td className="p-4 font-semibold">{rec.quality || calculateQuality(rec.time / 10)}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                    <td className="p-4"><button onClick={() => deleteRecord(rec.id, 'varnmala')} aria-label={`Delete record from ${formatSafeDate(rec.timestamp)}`} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button></td>
                </tr>
            )
        },
        { 
            key: 'stories', 
            title: 'पठन अभ्यास रिकॉर्ड', 
            icon: <FaBook size={20} />, 
            records: storyRecords,
            headers: ['कहानी', 'समय', 'प्रतिशत', 'दिनांक', 'Action'],
            renderRow: (rec) => (
                 <tr key={rec.id}>
                    <td className="p-4 font-bold max-w-xs truncate">{rec.storyTitle || "N/A"}</td>
                    <td className="p-4 font-mono text-lg">{formatTime(rec.time)}</td>
                    <td className="p-4 font-semibold">{rec.percentage || 0}%</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatSafeDate(rec.timestamp)}</td>
                    <td className="p-4"><button onClick={() => deleteRecord(rec.id, 'stories')} aria-label={`Delete record for ${rec.storyTitle}`} className="text-slate-400 hover:text-red-500 transition-colors"><FaTrash /></button></td>
                </tr>
            )
        }
    ];

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

            {sections.map(section => (
                <motion.div key={section.key} variants={itemVariants} className="space-y-4">
                    <SectionHeader 
                        title={section.title} 
                        recordCount={section.records.length} 
                        icon={section.icon}
                        isOpen={openSection === section.key} 
                        onClick={() => setOpenSection(openSection === section.key ? null : section.key)} 
                    />
                    <AnimatePresence>
                        {openSection === section.key && (
                            <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden">
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-inner">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-100 dark:bg-slate-700">
                                                <tr>
                                                    {section.headers.map((header, index) => (
                                                        <th key={header} className={`p-4 ${index === 0 ? 'rounded-tl-lg' : ''} ${index === section.headers.length - 1 ? 'rounded-tr-lg' : ''}`}>{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {section.records.length > 0 ? (
                                                    section.records.map(section.renderRow)
                                                ) : (
                                                    <tr><td colSpan={section.headers.length} className="p-8 text-center text-slate-500">No records yet for this section.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </motion.div>
    );
};


SectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
    recordCount: PropTypes.number.isRequired,
    icon: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

RecordsView.propTypes = {
    records: PropTypes.shape({
        sounds: PropTypes.array,
        varnmala: PropTypes.array,
        stories: PropTypes.array,
    }),
    deleteRecord: PropTypes.func, // Changed to not required, as we now have a default
};

export default RecordsView;