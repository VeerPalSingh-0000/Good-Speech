import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaBookOpen, FaChartLine, FaArrowRight, FaCommentDots, FaPlay, FaCheck, FaTimes, FaChevronDown } from 'react-icons/fa';

const Landing = ({ onGetStarted, onLogin }) => {
  const howItWorksRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 flex justify-center items-center pointer-events-none opacity-40">
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-purple-600/30 to-pink-500/30 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaCommentDots className="text-xl text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              SpeechGood
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={onLogin} 
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted} 
              className="btn-premium bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg shadow-purple-500/30"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Empowering better communication today
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight font-display">
              Overcome Stammering with <br className="hidden md:block" />
              <span className="text-gradient-primary animate-shimmer">
                Daily Practice
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Your personal, judgement-free zone for speech therapy. Track your progress, read engaging stories, and practice at your own pace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full max-w-xl mx-auto">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-1/2 btn-premium bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-size-200 animate-shimmer text-white text-lg py-4 px-8 rounded-full shadow-xl shadow-purple-500/25 flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                Start Your Journey
                <FaArrowRight className="text-sm" />
              </button>
              <button 
                onClick={() => scrollToSection(howItWorksRef)}
                className="w-full sm:w-1/2 px-8 py-4 text-lg font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 rounded-full backdrop-blur-md transition-all active:scale-95 shadow-lg"
              >
                See How It Works
              </button>
            </div>
          </motion.div>
        </header>

        {/* See It In Action (Demo Preview) */}
        <section className="relative px-4 pb-24 -mt-16 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden glass-card shadow-2xl shadow-purple-500/10 border-2 border-slate-700/50"
          >
            <div className="bg-slate-800/80 h-10 w-full flex items-center px-4 gap-2 border-b border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="aspect-video bg-slate-900 relative flex items-center justify-center group cursor-pointer overflow-hidden">
              <img src="https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=1200" alt="App Preview Interface" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute w-20 h-20 bg-purple-600/90 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 ring-4 ring-purple-500/30">
                <FaPlay className="ml-1" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Preview */}
        <section className="bg-slate-900/80 backdrop-blur-3xl border-t border-slate-800 py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-indigo-500/30">
                <FaMicrophone />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Guided Exercises</h3>
              <p className="text-slate-400 leading-relaxed">
                Practice complex words and sounds with real-time feedback and structured daily routines.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="w-14 h-14 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-pink-500/30">
                <FaBookOpen />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Interactive Reading</h3>
              <p className="text-slate-400 leading-relaxed">
                Read engaging Hindi stories and folk tales. Control reading speed, highlight words, and master fluency.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-cyan-500/30">
                <FaChartLine />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Advanced Analytics</h3>
              <p className="text-slate-400 leading-relaxed">
                Watch yourself grow with detailed charts tracking your practice time, speed, and accuracy over weeks.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">Loved by our Community</h2>
            <p className="text-slate-400 text-lg">See how daily practice is changing lives in India and beyond.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 rounded-3xl relative">
              <div className="text-4xl text-purple-400 opacity-20 absolute top-6 left-6 font-serif">"</div>
              <p className="text-slate-300 relative z-10 italic mb-8 mt-4">"SpeechGood created a safe environment where I felt comfortable practicing every single day. The gamification makes me want to come back."</p>
              <div className="flex items-center gap-4 border-t border-slate-700/50 pt-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-xl font-bold text-white">P</div>
                <div>
                  <p className="font-bold text-white">Priya S.</p>
                  <p className="text-sm text-slate-400">Delhi, India</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-8 rounded-3xl relative">
              <div className="text-4xl text-pink-400 opacity-20 absolute top-6 left-6 font-serif">"</div>
              <p className="text-slate-300 relative z-10 italic mb-8 mt-4">"I used to fear speaking Hindi at family gatherings. The Varnmala practice actually showed me exactly where my tongue was slipping up."</p>
              <div className="flex items-center gap-4 border-t border-slate-700/50 pt-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-xl font-bold text-white">R</div>
                <div>
                  <p className="font-bold text-white">Rahul K.</p>
                  <p className="text-sm text-slate-400">Mumbai, India</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-8 rounded-3xl relative md:col-span-2 lg:col-span-1">
              <div className="text-4xl text-emerald-400 opacity-20 absolute top-6 left-6 font-serif">"</div>
              <p className="text-slate-300 relative z-10 italic mb-8 mt-4">"The real-time highlighting when reading stories is fantastic. I finally feel in control of my breathing instead of rushing through words."</p>
              <div className="flex items-center gap-4 border-t border-slate-700/50 pt-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-xl font-bold text-white">A</div>
                <div>
                  <p className="font-bold text-white">Amit V.</p>
                  <p className="text-sm text-slate-400">Bangalore, India</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing / Feature Comparison */}
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">Choose Your Path</h2>
            <p className="text-slate-400 text-lg">Start free, upgrade when you need advanced features.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Free Tier */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-slate-700 relative">
              <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
              <div className="text-4xl font-bold text-white mb-6">₹0<span className="text-lg text-slate-500 font-normal"> / forever</span></div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex gap-3"><FaCheck className="text-emerald-500 shrink-0 mt-1" /> Basic Vowel sounds practice</li>
                <li className="flex gap-3"><FaCheck className="text-emerald-500 shrink-0 mt-1" /> Limited community stories</li>
                <li className="flex gap-3"><FaCheck className="text-emerald-500 shrink-0 mt-1" /> 7-day Analytics history</li>
                <li className="flex gap-3 opacity-50"><FaTimes className="text-rose-500 shrink-0 mt-1" /> Real-time Speech-to-Text feedback</li>
                <li className="flex gap-3 opacity-50"><FaTimes className="text-rose-500 shrink-0 mt-1" /> Premium Curated Guides</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-600">Start Free</button>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-[2.5rem] relative bg-gradient-to-b from-purple-900/80 to-slate-900 border border-purple-500/50 shadow-2xl shadow-purple-900/50">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg">Most Popular</div>
              <h3 className="text-2xl font-bold text-purple-300 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-6">₹299<span className="text-lg text-purple-300/60 font-normal"> / month</span></div>
              <ul className="space-y-4 mb-8 text-slate-200">
                <li className="flex gap-3"><FaCheck className="text-pink-500 shrink-0 mt-1" /> Everything in Basic</li>
                <li className="flex gap-3"><FaCheck className="text-pink-500 shrink-0 mt-1" /> Advanced Consonant & Varnmala Practice</li>
                <li className="flex gap-3"><FaCheck className="text-pink-500 shrink-0 mt-1" /> Live Speech-to-Text Pronunciation Checks</li>
                <li className="flex gap-3"><FaCheck className="text-pink-500 shrink-0 mt-1" /> Lifetime Analytics & Exporting</li>
                <li className="flex gap-3"><FaCheck className="text-pink-500 shrink-0 mt-1" /> WhatsApp Notification Reminders</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-4 rounded-full btn-premium bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold transition-all shadow-xl shadow-pink-500/20 active:scale-95">Upgrade Later inside App</button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 max-w-3xl mx-auto border-t border-slate-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-display mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Is this a replacement for a Speech Therapist?", a: "No. SpeechGood is designed to be a companion tool. It works perfectly alongside professional speech therapy by providing you a structured way to complete your daily 'homework' and track progress." },
              { q: "Do I need special equipment?", a: "Just an internet connection, a modern browser (like Chrome), and a built-in microphone on your phone or computer." },
              { q: "Will my data be private?", a: "Yes, we utilize Firebase for secure student authentication. Your voice recordings are processed directly in your browser using the Web Speech API and are never stored on our servers." }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-700/50 rounded-2xl bg-slate-800/30 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left p-6 font-bold flex justify-between items-center text-slate-200 hover:bg-slate-800/50 transition-colors">
                  {faq.q}
                  <FaChevronDown className={`transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-purple-400' : 'text-slate-500'}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-6 pt-0 text-slate-400 border-t border-slate-700/50 mt-2 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: `
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "Is this a replacement for a Speech Therapist?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. SpeechGood is designed to be a companion tool. It works perfectly alongside professional speech therapy by providing you a structured way to complete your daily homework and track progress."
            }
          }]
        }
        `}} />

        {/* Final CTA */}
        <section className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 rounded-[3rem] p-12 md:p-24 text-center glass overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Ready to find your voice?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of others taking control of their speech journey today. It's free to get started.
            </p>
            <button 
              onClick={onGetStarted}
              className="btn-premium bg-white text-slate-900 text-lg py-4 px-12 rounded-full font-bold shadow-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
            >
              Create Free Account
            </button>
          </div>
        </section>

        {/* Super simple footer */}
        <footer className="text-center py-8 text-slate-500 border-t border-white/5">
          <p>© 2026 SpeechGood. Built for the community.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
