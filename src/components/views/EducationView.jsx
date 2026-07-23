import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaQuestionCircle, FaLightbulb, FaBookOpen } from 'react-icons/fa';

const EducationView = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [openFaq, setOpenFaq] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);

  const tabs = [
    { id: 'articles', label: 'Knowledge Base', icon: <FaBookOpen /> },
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
      q: "How long should I practice before expecting meaningful improvement?",
      a: "Think in terms of months rather than days! Commit to at least 100 days of consistent practice to establish the habit. You may notice small improvements in the first 30 days, feel more comfortable managing blocks by 60–100 days, build stronger speech skills by 6 months, and generalize them to real life over 1 year."
    },
    {
      q: "Is self-practice enough or should I see a speech therapist?",
      a: "If your stammering is significant, combining your daily self-practice with a speech therapist specializing in stuttering is generally more effective than relying on self-practice alone."
    }
  ];

  const ARTICLES = [
    {
      id: 3,
      tag: "Roadmap",
      tagColor: "emerald",
      icon: "fas fa-road",
      title: "Realistic Stammering Practice Timeline & Expectations",
      preview: "Improvement happens in months, not days. Discover the 100-Day Habit rule and realistic milestones for long-term speech control.",
      content: "When practicing speech therapy techniques, it is essential to set realistic expectations. Stammering recovery is a long-term journey measured in months rather than days.\n\n• First 30 Days: Build consistency and learn to control muscle tension and breathing. You may notice small improvements in specific low-pressure situations.\n• 60–100 Days: You begin feeling more comfortable with your speech and become better at managing blocks through daily practice.\n• 6 Months: With regular practice and appropriate therapy, many people develop stronger speech-management skills and greater communication confidence.\n• 1 Year+: Long-term improvement is consolidated. Stammering can still fluctuate, but the goal is better communication and reduced struggle, not necessarily eliminating every single stammer.\n\nKey Strategy:\n- 100 Days → Establish the habit\n- 6 Months → Build stronger speech skills\n- 1 Year → Maintain and generalize skills to real-life situations\n\nFor significant stammering, combine your daily practice with a speech therapist specializing in stuttering for maximum progress."
    },
    {
      id: 1,
      tag: "Science",
      tagColor: "indigo",
      icon: "fas fa-brain",
      title: "The Neurobiology of Stammering",
      preview: "Research shows differences in the white matter tracts of the brain. Understanding this helps remove the stigma and shift the focus to practice.",
      content: "Stammering is a neurodevelopmental condition. Modern neuroimaging (like fMRI) has shown that people who stammer often have subtle differences in the brain's white matter tracts, specifically the arcuate fasciculus, which connects the language planning areas to the motor execution areas.\n\nBecause of these structural differences, the brain sometimes struggles to perfectly time the rapid sequence of muscle movements required for fluent speech. This means stammering is physical and neurological, not just 'in your head' or caused by anxiety.\n\nHowever, neuroplasticity—the brain's ability to rewire itself—means that with consistent practice of fluency shaping techniques, you can actually strengthen new neural pathways, leading to easier and smoother speech over time."
    },
    {
      id: 2,
      tag: "Psychology",
      tagColor: "fuchsia",
      icon: "fas fa-heart",
      title: "The Iceberg of Stuttering",
      preview: "The visible stutter is just the tip. The massive block of ice beneath the water represents shame, fear, and guilt that we must melt away.",
      content: "Psychologist Joseph Sheehan famously compared stuttering to an iceberg. The visible part above the water represents the physical blocks, prolongations, and repetitions that other people hear.\n\nHowever, the much larger portion of the iceberg lies hidden beneath the surface. This represents the negative emotions: shame, fear, guilt, anxiety, isolation, and denial. For many adults, the hidden emotional burden is far more debilitating than the physical speech disruptions.\n\nTrue fluency therapy isn't just about smoothing out your speech (chipping away at the top of the iceberg). It's also about 'melting' the bottom by accepting yourself, reducing avoidance behaviors, and communicating confidently regardless of whether you stutter or not."
    }
  ];

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
      {/* HEADER */}
      <div className="text-center space-y-4 mb-10 pt-6">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-[2rem] shadow-xl shadow-indigo-500/20 mb-4 border-b-[8px] border-indigo-600 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
          <FaGraduationCap className="text-white text-5xl drop-shadow-md" />
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-800 dark:text-white tracking-tight">
          Education Center
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-base sm:text-lg">
          Master your speech. Discover techniques, watch tutorials, and learn the science behind fluency.
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full mx-auto max-w-4xl mb-10">
        <div className="flex flex-row gap-2 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-3xl shadow-inner border-2 border-slate-200/50 dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-2xl font-extrabold transition-all border-2 ${activeTab === tab.id
                  ? 'bg-sky-500 dark:bg-sky-500 text-white border-sky-400 dark:border-sky-400 border-b-[6px] shadow-lg transform sm:-translate-y-1'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:border-b-[4px] hover:-translate-y-0.5'
                }`}
            >
              <span className="text-xl sm:text-xl">{tab.icon}</span>
              <span className="text-[11px] sm:text-base uppercase sm:normal-case tracking-wider sm:tracking-normal">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        key={activeTab}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto mt-8"
      >
        {activeTab === 'articles' && (
          <div className="flex flex-col gap-6">
            {ARTICLES.map((article) => {
              const isExpanded = expandedArticle === article.id;
              // Generate dynamic tailwind classes based on tagColor (assuming 'indigo' and 'fuchsia' as used above)
              const colorClasses = {
                indigo: {
                  bg: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500',
                  border: 'border-indigo-200 dark:border-indigo-500/40',
                  text: 'text-indigo-600 dark:text-indigo-400',
                  hoverText: 'group-hover:text-sky-500 dark:group-hover:text-sky-400',
                  hoverBorder: 'hover:border-sky-300 dark:hover:border-sky-500',
                  hoverShadow: 'hover:shadow-sky-500/20',
                  btnBg: 'bg-sky-500 hover:bg-sky-400 border-sky-600',
                },
                fuchsia: {
                  bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-500',
                  border: 'border-fuchsia-200 dark:border-fuchsia-500/40',
                  text: 'text-fuchsia-600 dark:text-fuchsia-400',
                  hoverText: 'group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-400',
                  hoverBorder: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-500',
                  hoverShadow: 'hover:shadow-fuchsia-500/20',
                  btnBg: 'bg-fuchsia-500 hover:bg-fuchsia-400 border-fuchsia-600',
                }
              }[article.tagColor];

              return (
                <div
                  key={article.id}
                  className={`p-8 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 border-b-[8px] transition-all group cursor-pointer flex flex-col h-full ${!isExpanded ? `${colorClasses.hoverBorder} hover:-translate-y-2 hover:shadow-2xl ${colorClasses.hoverShadow}` : ''
                    }`}
                  onClick={() => !isExpanded && setExpandedArticle(article.id)}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-xl font-bold border-b-4 ${colorClasses.bg} ${colorClasses.border}`}>
                      <i className={article.icon}></i>
                    </div>
                    <span className={`text-xs font-extrabold uppercase tracking-widest ${colorClasses.text}`}>{article.tag}</span>

                    {isExpanded && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedArticle(null); }}
                        className="ml-auto w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  <h3 className={`text-2xl font-display font-extrabold text-slate-800 dark:text-white mb-4 transition-colors leading-tight ${!isExpanded ? colorClasses.hoverText : ''}`}>
                    {article.title}
                  </h3>

                  <AnimatePresence mode="wait">
                    {!isExpanded ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col flex-1"
                      >
                        <p className="text-slate-600 dark:text-slate-400 text-base mb-8 leading-relaxed flex-1 font-medium">
                          {article.preview}
                        </p>
                        <button className={`flex items-center justify-center gap-2 text-white font-extrabold text-base border-b-[4px] active:border-b-0 active:translate-y-[4px] px-6 py-4 rounded-2xl transition-all w-full mt-auto ${colorClasses.btnBg}`}>
                          Read Article <i className="fas fa-arrow-right"></i>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="text-slate-600 dark:text-slate-300 text-base leading-relaxed font-medium space-y-4">
                          {article.content.split('\n\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedArticle(null); }}
                          className={`mt-8 flex items-center justify-center gap-2 text-white font-extrabold text-base border-b-[4px] active:border-b-0 active:translate-y-[4px] px-6 py-4 rounded-2xl transition-all w-full md:w-auto md:px-12 ${colorClasses.btnBg}`}
                        >
                          Close Article
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}



        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {FAQS.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-6 sm:px-8 text-left font-display font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex justify-between items-center gap-4 focus:outline-none"
                >
                  <span className="text-lg leading-tight">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${openFaq === index ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    <i className={`fas fa-chevron-down transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}></i>
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default EducationView;
