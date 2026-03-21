import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingView = ({ userSettings, updateUserSettings, completeOnboarding }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    languagePreference: userSettings?.languagePreference || 'Hindi',
    speechGoals: userSettings?.speechGoals || [],
    practiceTime: userSettings?.practiceTime || 15,
  });

  const goalsOptions = [
    { id: 'stuttering', label: 'Reduce Stuttering' },
    { id: 'pronunciation', label: 'Improve Pronunciation' },
    { id: 'confidence', label: 'Build Speaking Confidence' },
    { id: 'breathing', label: 'Better Breath Control' },
  ];

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const toggleGoal = (goalId) => {
    setPreferences((prev) => {
      const g = prev.speechGoals;
      return {
        ...prev,
        speechGoals: g.includes(goalId) ? g.filter(i => i !== goalId) : [...g, goalId]
      };
    });
  };

  const handleFinish = async () => {
    await updateUserSettings({
      ...preferences,
      hasCompletedOnboarding: true,
    });
    if (completeOnboarding) completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 dark:bg-slate-900 overflow-y-auto pt-10 pb-10 px-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="mb-8 flex justify-between items-center px-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-2 w-12 rounded-full ${step >= i ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`} />
            ))}
          </div>
          <button onClick={handleFinish} className="text-sm text-slate-500 hover:text-purple-600 font-medium">Skip</button>
        </div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">👋</div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome to SpeechGood!</h2>
                  <p className="text-slate-500 dark:text-slate-400">Let's set up your personalized speech therapy journey.</p>
                </div>
                <div className="space-y-4 mt-8 text-center flex flex-col items-center">
                  <button onClick={handleNext} className="w-full py-4 text-xl font-bold bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition">Get Started</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Language Preference</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Which language would you like to practice in primarily?</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Hindi', 'English'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setPreferences({ ...preferences, languagePreference: lang })}
                      className={`p-6 rounded-xl border-2 font-bold text-lg transition-all ${preferences.languagePreference === lang ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-purple-300'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">What are your goals?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Select all that apply.</p>
                <div className="space-y-3">
                  {goalsOptions.map(goal => {
                    const isSelected = preferences.speechGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${isSelected ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'}`}
                      >
                        <span className="font-medium text-lg">{goal.label}</span>
                        {isSelected && <i className="fas fa-check-circle text-purple-600 text-xl"></i>}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Daily Practice Time</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Consistency is key! How many minutes can you practice daily?</p>
                <div className="mb-12">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-4xl font-black text-purple-600">{preferences.practiceTime}</span>
                    <span className="text-lg text-slate-500 font-medium">Minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={preferences.practiceTime}
                    onChange={(e) => setPreferences({ ...preferences, practiceTime: parseInt(e.target.value) })}
                    className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>5m</span>
                    <span>30m</span>
                    <span>60m</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute bottom-0 w-full p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex justify-between">
            {step > 1 ? (
              <button onClick={handleBack} className="px-6 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">Back</button>
            ) : <div />}
            {step > 1 && step < 4 && (
              <button onClick={handleNext} className="px-8 py-2 bg-purple-600 text-white font-bold rounded-lg shadow hover:bg-purple-700 transition">Continue</button>
            )}
            {step === 4 && (
              <button onClick={handleFinish} className="px-8 py-2 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition">Finish Setup</button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingView;
