import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaQuestionCircle, FaLightbulb, FaPlayCircle, FaBookOpen } from 'react-icons/fa';

const EducationView = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [openFaq, setOpenFaq] = useState(null);

  const tabs = [
    { id: 'articles', label: 'Knowledge Base', icon: <FaBookOpen /> },
    { id: 'tips', label: 'Techniques & Tips', icon: <FaLightbulb /> },
    { id: 'videos', label: 'Video Guides', icon: <FaPlayCircle /> },
    { id: 'faq', label: 'FAQs', icon: <FaQuestionCircle /> }
  ];

  const FAQS = [
    {
      q: "What causes stammering/stuttering?",
      a: "Stammering is a multifaceted condition. It's often linked to differences in brain activity related to speech production, genetics, and environmental factors. It is NOT caused by anxiety or lower intelligence, though anxiety can make it worse."
    },
    {
      q: "Can stammering be completely cured?",
      a: "While there is no universally accepted 'cure' for adults, stammering can be highly managed. Many adults achieve a high degree of fluency and dramatically reduce struggle behavior using techniques like prolonged speech, block modifications, and breathing therapy."
    },
    {
      q: "Why do I stammer more when I'm tired or stressed?",
      a: "Stress triggers the 'fight or flight' response, which increases muscle tension, including the muscles in your vocal cords and diaphragm. Tiredness reduces cognitive resources available to employ fluency techniques smoothly."
    },
    {
      q: "Is it okay to tell people I stammer?",
      a: "Yes! 'Voluntary stuttering' or simply disclosing that you stammer often relieves the enormous pressure of trying to hide it, which ironically can make you more fluent."
    }
  ];

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="p-4 text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <FaGraduationCap className="text-emerald-500" />
          Education Center
        </h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Understand your speech. Discover techniques, watch tutorials, and learn the science behind fluency.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full max-w-2xl mx-auto shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700 min-h-[500px]">
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:shadow-md transition">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full mb-4 inline-block">Science</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">The Neurobiology of Stammering</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                Research shows differences in the white matter tracts of the brain that connect speech planning and motor execution areas...
              </p>
              <button className="text-emerald-500 font-bold text-sm hover:underline">Read Article &rarr;</button>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:shadow-md transition">
              <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full mb-4 inline-block">Psychology</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">The Iceberg of Stuttering</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                Coined by Joseph Sheehan, the visible stutter is just the tip. The massive block of ice beneath the water represents shame, fear, and guilt...
              </p>
              <button className="text-emerald-500 font-bold text-sm hover:underline">Read Article &rarr;</button>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">Essential Fluency Strategies</h3>
            <div className="grid gap-4">
              <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl transition">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 flex items-center justify-center font-bold text-lg shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Prolonged Speech</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Stretching out the first sound or syllable of a word (e.g., "m-m-m-mother") to reduce vocal cord tension before full vocalization.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl transition">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 flex items-center justify-center font-bold text-lg shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Light Articulatory Contacts</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Touching your lips, tongue, or palate very softly when making consonant sounds (like p, b, t, k) to avoid getting 'stuck' or blocked on hard plosives.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 flex items-center justify-center font-bold text-lg shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Cancellation/Pull-outs (Stuttering Modification)</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">When you feel a block, pause completely, release tension, and say the word again smoothly. Instead of fighting the block, modify it mid-way.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="text-center py-12">
            <FaPlayCircle className="text-6xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Video Guides Coming Soon</h3>
            <p className="text-slate-500">We are curating the best YouTube tutorials for stammering therapy...</p>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4 max-w-3xl mx-auto">
             {FAQS.map((faq, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/30">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex justify-between items-center"
                  >
                    <span>{faq.q}</span>
                    <i className={`fas fa-chevron-down shrink-0 transition-transform ${openFaq === index ? 'rotate-180 text-emerald-500' : 'text-slate-400'}`}></i>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                         <div className="px-6 py-4 pt-0 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 mt-2">
                           {faq.a}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
             ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default EducationView;
