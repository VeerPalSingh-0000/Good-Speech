// src/features/hindi/components/views/HistoryView.jsx

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatTime,
  formatSafeDate,
  calculateQuality,
} from "../../utilities/helpers";

const HistoryView = ({ records }) => {
  const [openSection, setOpenSection] = useState("sounds");

  const stats = useMemo(() => {
    const allRecords = [
      ...(records.sounds || []),
      ...(records.varnmala || []),
      ...(records.stories || []),
    ];
    const totalSessions = allRecords.length;
    const totalTime = allRecords.reduce((sum, r) => sum + (r.time || 0), 0);
    const bestSound =
      records.sounds && records.sounds.length > 0
        ? Math.max(...records.sounds.map((r) => r.time || 0))
        : 0;

    return {
      totalSessions,
      totalTime: formatTime(totalTime),
      bestSound: formatTime(bestSound),
    };
  }, [records]);

  // THIS ENTIRE BLOCK IS THE CORRECTED LOGIC
  const { soundRecordsByDate, sortedDates } = useMemo(() => {
    const groupedByStandardDate = {};
    (records.sounds || []).forEach((rec) => {
      try {
        const date = rec.timestamp?.seconds
          ? new Date(rec.timestamp.seconds * 1000)
          : new Date(rec.timestamp);
        if (isNaN(date.getTime())) return;

        const dateKey = date.toDateString(); // Use a standard, parsable format e.g., "Mon Jul 28 2025"
        if (!groupedByStandardDate[dateKey]) {
          groupedByStandardDate[dateKey] = [];
        }
        groupedByStandardDate[dateKey].push(rec);
      } catch (e) {
        /* Ignore records with invalid timestamps */
      }
    });

    const finalPivotedData = {};
    for (const dateKey in groupedByStandardDate) {
      // Sort records for the day by timestamp, oldest first
      const dayRecords = groupedByStandardDate[dateKey].sort(
        (a, b) =>
          (a.timestamp?.seconds || a.timestamp) -
          (b.timestamp?.seconds || b.timestamp)
      );

      const displayDate = formatSafeDate(dayRecords[0].timestamp); // Get the pretty formatted date
      finalPivotedData[displayDate] = {};
      let sessionCounter = 1;
      const soundsInCurrentSession = new Set();

      dayRecords.forEach((rec) => {
        // If we've already seen this sound in this round, it must be a new session
        if (soundsInCurrentSession.has(rec.sound)) {
          sessionCounter++;
          soundsInCurrentSession.clear();
        }

        if (!finalPivotedData[displayDate][sessionCounter]) {
          finalPivotedData[displayDate][sessionCounter] = {};
        }

        finalPivotedData[displayDate][sessionCounter][rec.sound] = rec;
        soundsInCurrentSession.add(rec.sound);
      });
    }

    // Create a map from the pretty display date to the original timestamp for reliable sorting
    const dateSortMap = {};
    Object.keys(groupedByStandardDate).forEach((dateKey) => {
      const displayDate = formatSafeDate(
        groupedByStandardDate[dateKey][0].timestamp
      );
      dateSortMap[displayDate] = new Date(dateKey).getTime();
    });

    const sortedDisplayDates = Object.keys(finalPivotedData).sort(
      (a, b) => dateSortMap[b] - dateSortMap[a]
    );

    return {
      soundRecordsByDate: finalPivotedData,
      sortedDates: sortedDisplayDates,
    };
  }, [records.sounds]);

  const SectionHeader = ({ title, recordCount, sectionKey, icon }) => (
    <div
      className="p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-lg hover:shadow-xl"
      onClick={() =>
        setOpenSection(openSection === sectionKey ? null : sectionKey)
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <i className={`${icon} text-white text-xl`}></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {recordCount} कुल रिकॉर्ड
            </p>
          </div>
        </div>
        <i
          className={`fas fa-chevron-down text-2xl text-slate-500 transform transition-transform duration-300 ${
            openSection === sectionKey ? "rotate-180" : ""
          }`}
        ></i>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="p-4 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          अभ्यास इतिहास
        </h2>
        <p className="text-slate-500 mt-2">
          यहाँ आपके सभी सत्रों का विस्तृत विश्लेषण है।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-lg">कुल सत्र</h4>
          <p className="text-3xl font-bold text-blue-500">
            {stats.totalSessions}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-lg">कुल समय</h4>
          <p className="text-3xl font-bold font-mono text-green-500">
            {stats.totalTime}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-lg">सर्वश्रेष्ठ स्वर समय</h4>
          <p className="text-3xl font-bold font-mono text-purple-500">
            {stats.bestSound}
          </p>
        </div>
      </div>

      {/* Sound Records Section */}
      <div className="space-y-4">
        <SectionHeader
          title="स्वर अभ्यास रिकॉर्ड"
          recordCount={records.sounds?.length || 0}
          sectionKey="sounds"
          icon="fas fa-microphone"
        />
        <AnimatePresence>
          {openSection === "sounds" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-inner space-y-6">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <h4 className="font-bold text-lg mb-2 pl-2">{date}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-700">
                            <th className="p-4 rounded-tl-lg">S.No.</th>
                            <th className="p-4 text-center">आ</th>
                            <th className="p-4 text-center">ई</th>
                            <th className="p-4 text-center">ऊ</th>
                            <th className="p-4 rounded-tr-lg text-center">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {Object.keys(soundRecordsByDate[date]).map(
                            (session) => {
                              const sessionData =
                                soundRecordsByDate[date][session];
                              const hasNewBest = Object.values(
                                sessionData
                              ).some((rec) => rec.isNewBest);
                              return (
                                <tr key={session}>
                                  <td className="p-4 font-bold">{session}</td>
                                  {["आ", "ई", "ऊ"].map((sound) => (
                                    <td
                                      key={sound}
                                      className="p-4 text-center font-mono"
                                    >
                                      {sessionData[sound] ? (
                                        <span
                                          className={
                                            sessionData[sound].isNewBest
                                              ? "text-yellow-500 font-bold"
                                              : ""
                                          }
                                        >
                                          {formatTime(sessionData[sound].time)}
                                          {sessionData[sound].isNewBest &&
                                            " 🏆"}
                                        </span>
                                      ) : (
                                        "--"
                                      )}
                                    </td>
                                  ))}
                                  {/* THE FIX: Added a ternary operator to show a placeholder */}
                                  <td className="p-4 text-center">
                                    {hasNewBest ? (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs font-bold rounded-full">
                                        New Best!
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">--</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
                {sortedDates.length === 0 && (
                  <p className="p-8 text-center text-slate-500">
                    No sound records yet.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Varnmala  section */}
      <div className="space-y-4">
        <SectionHeader
          title="वर्णमाला अभ्यास रिकॉर्ड"
          recordCount={records.varnmala?.length || 0}
          sectionKey="varnmala"
          icon="fas fa-list"
        />
        {openSection === "varnmala" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-inner">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="p-4 rounded-tl-lg w-16">क्र.सं.</th>
                    <th className="p-4 rounded-tl-lg">समय</th>
                    <th className="p-4">गुणवत्ता</th>
                    <th className="p-4 rounded-tr-lg">दिनांक</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {(records.varnmala || []).map((rec, i) => (
                    <tr key={i}>
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        {i + 1}
                      </td>
                      <td className="p-4 font-mono">{formatTime(rec.time)}</td>
                      <td className="p-4 font-semibold">
                        {rec.quality || calculateQuality(rec.time / 10)}
                      </td>
                      <td className="p-4">{formatSafeDate(rec.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
      {/* Stories section */}
      <div className="space-y-4">
    <SectionHeader
        title="पठन अभ्यास रिकॉर्ड"
        recordCount={records.stories?.length || 0}
        sectionKey="stories"
        icon="fas fa-book"
    />
    {openSection === "stories" && (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
        >
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-inner">
                {/* Check if there are any records to display */}
                {(records.stories || []).length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                {/* S.No. Column */}
                                <th className="p-4 rounded-tl-lg w-16">क्र.सं.</th>

                                {/* Story Title Column */}
                                <th className="p-4">कहानी</th>

                                {/* Time Column */}
                                <th className="p-4">समय</th>

                                {/* Date Column */}
                                <th className="p-4 rounded-tr-lg">दिनांक</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {(records.stories || []).map((rec, i) => (
                                <tr
                                    key={rec.id || i}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    {/* S.No. Data */}
                                    <td className="p-4 text-slate-500 dark:text-slate-400">
                                        {i + 1}
                                    </td>

                                    {/* ✅ CORRECTED Story Title Data */}
                                    <td
                                        className="p-4 font-semibold max-w-xs truncate"
                                        title={rec.storyTitle}
                                    >
                                        {rec.storyTitle || "N/A"}
                                    </td>

                                    {/* Time Data */}
                                    <td className="p-4 font-mono">
                                        {formatTime(rec.time)}
                                    </td>

                                    {/* Date Data */}
                                    <td className="p-4">{formatSafeDate(rec.timestamp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    // Message to show when there are no records
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <p>No story records found.</p>
                        <p className="text-sm mt-1">
                            Complete a reading session to see your records here.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    )}
</div>
    </div>
  );
};

export default HistoryView;
