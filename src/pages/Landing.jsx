import React from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaBookOpen, FaChartLine, FaArrowRight, FaCommentDots } from 'react-icons/fa';

const Landing = ({ onGetStarted, onLogin }) => {
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto btn-premium bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-size-200 animate-shimmer text-white text-lg py-4 px-10 rounded-full shadow-xl shadow-purple-500/25 flex items-center justify-center gap-3"
              >
                Start Your Journey
                <FaArrowRight className="text-sm" />
              </button>
              <button className="w-full sm:w-auto px-10 py-4 text-lg font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full backdrop-blur-md transition-all">
                See How It Works
              </button>
            </div>
          </motion.div>
        </header>

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

        {/* Testimonial */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-4xl text-purple-400 mb-6 opacity-50 font-serif">"</div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-relaxed font-display text-slate-200">
              SpeechGood created a safe environment where I felt comfortable practicing every single day. The gamification makes me want to come back.
            </h2>
            <div className="flex items-center justify-center gap-4 mt-8 pt-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                P
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-white">Priya S.</p>
                <p className="text-slate-400">Delhi, India</p>
              </div>
            </div>
          </motion.div>
        </section>

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
