// src/pages/Landing.jsx - Maximalist, Child-Focused, Vibrant Purple Design

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophoneAlt,
  FaBook,
  FaStar,
  FaGamepad,
  FaRocket,
  FaPlay,
  FaChevronDown,
  FaMagic,
  FaMedal,
} from "react-icons/fa";

// Reusable floating animation for background elements
const floatingAnimation = {
  y: ["-20px", "20px"],
  rotate: [-10, 10],
  transition: {
    duration: 4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  },
};

const Landing = ({ onGetStarted, onLogin }) => {
  const howItWorksRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    {
      q: "Is this for kids or adults?",
      a: "Both! While our games and stories are designed to be incredibly fun and engaging for children, adults love the tracking, analytics, and guided practice just as much. The core therapy principles apply to all ages.",
    },
    {
      q: "Do I need special equipment?",
      a: "Nope! Just a phone, tablet, or computer with a built-in microphone and a web browser. No fancy headsets required!",
    },
    {
      q: "Will my child's data be private?",
      a: "Absolutely. We take privacy seriously. All voice recordings are processed directly on your device and are never sent to or stored on our servers.",
    },
  ];

  return (
    <div className="min-h-screen bg-violet-700 font-sans overflow-x-hidden selection:bg-amber-400 selection:text-violet-900 relative">
      {/* Maximalist Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Giant glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[120px] opacity-40" />

        {/* Floating shapes */}
        <motion.div
          animate={floatingAnimation}
          className="absolute top-[15%] right-[10%] text-6xl text-amber-400 opacity-80"
        >
          <FaStar />
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          transition={{
            delay: 1,
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-[40%] left-[5%] text-7xl text-fuchsia-400 opacity-60"
        >
          <FaMagic />
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          transition={{
            delay: 2,
            duration: 4.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-[20%] right-[15%] text-8xl text-cyan-400 opacity-50"
        >
          <FaRocket />
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between gap-4 p-4 md:px-8 max-w-7xl mx-auto relative z-20 mt-4">
        <motion.div
          whileHover={{ scale: 1.05, rotate: -5 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center border-4 border-violet-900 shadow-[4px_4px_0px_rgba(76,29,149,1)]">
            <FaGamepad className="text-3xl text-violet-900" />
          </div>
          <span
            className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_4px_0_rgba(76,29,149,1)]"
            style={{ WebkitTextStroke: "2px #4c1d95" }}
          >
            SpeechGood
          </span>
        </motion.div>

        <div className="flex gap-4 items-center">
          <button
            onClick={onLogin}
            className="text-white hover:text-amber-400 font-bold text-xl transition-colors hidden sm:block drop-shadow-md"
          >
            Log In
          </button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{
              scale: 0.95,
              y: 4,
              boxShadow: "0px 0px 0px rgba(76,29,149,1)",
            }}
            onClick={onGetStarted}
            className="bg-amber-400 text-violet-900 font-black text-base sm:text-lg py-2 px-4 sm:py-3 sm:px-8 rounded-full border-4 border-violet-900 shadow-[6px_6px_0px_rgba(76,29,149,1)] transition-all"
          >
            Play Now!
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-12 pb-32 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="space-y-8 w-full flex flex-col items-center"
        >
          {/* Fun Badge */}
          <motion.div
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-fuchsia-500 border-4 border-violet-900 text-white text-lg font-black tracking-wide shadow-[4px_4px_0px_rgba(76,29,149,1)] transform -rotate-2"
          >
            <FaStar className="text-amber-300 text-xl" />
            Play, Practice, and Shine!
          </motion.div>

          <h1
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] text-white drop-shadow-[0_6px_0_rgba(76,29,149,1)]"
            style={{ WebkitTextStroke: "3px #4c1d95" }}
          >
            Discover Your <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-[0_6px_0_rgba(76,29,149,1)]"
              style={{ WebkitTextStroke: "3px #4c1d95" }}
            >
              Super Voice!
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-violet-100 max-w-2xl mx-auto font-bold leading-relaxed bg-violet-900/40 p-6 rounded-3xl border-2 border-violet-400/30 backdrop-blur-sm">
            The most fun way to practice speech every single day. Read magical
            stories, play sound games, and watch your confidence soar!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 w-full max-w-xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{
                scale: 0.95,
                y: 6,
                boxShadow: "0px 0px 0px rgba(76,29,149,1)",
              }}
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-fuchsia-500 text-white text-2xl py-5 px-10 rounded-full font-black flex items-center justify-center gap-4 border-4 border-violet-900 shadow-[8px_8px_0px_rgba(76,29,149,1)] transition-all"
            >
              Start Adventure <FaRocket className="text-2xl" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{
                scale: 0.95,
                y: 4,
                boxShadow: "0px 0px 0px rgba(76,29,149,1)",
              }}
              onClick={() => scrollToSection(howItWorksRef)}
              className="w-full sm:w-auto bg-cyan-400 text-violet-900 border-4 border-violet-900 text-xl py-5 px-10 rounded-full font-black shadow-[6px_6px_0px_rgba(76,29,149,1)] transition-all"
            >
              How it works
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Features - Bubbly Toy Box Style */}
      <section
        ref={howItWorksRef}
        className="py-32 bg-cyan-400 border-t-8 border-violet-900 relative"
      >
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full">
          {/* SVG wave separator */}
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16 text-cyan-400 fill-current"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C75.29,31.25,152.88,58.8,230.12,68.62Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white drop-shadow-[0_4px_0_rgba(76,29,149,1)]"
              style={{ WebkitTextStroke: "2px #4c1d95" }}
            >
              Your Magical Toolkit
            </h2>
            <p className="text-2xl text-violet-900 font-bold max-w-2xl mx-auto bg-white/40 p-4 rounded-3xl border-4 border-violet-900">
              Everything you need to level up your speaking powers!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: FaMicrophoneAlt,
                title: "Magic Mic",
                desc: "Speak into the magic microphone to practice sounds. Get instant, colorful feedback!",
                color: "bg-fuchsia-400",
              },
              {
                icon: FaBook,
                title: "Story Quests",
                desc: "Read amazing stories where words highlight as you go. You control the speed of the adventure!",
                color: "bg-amber-400",
              },
              {
                icon: FaMedal,
                title: "Hero Trophies",
                desc: "Earn points, level up, and unlock awesome badges every time you practice.",
                color: "bg-emerald-400",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", bounce: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -10, rotate: idx % 2 === 0 ? 2 : -2 }}
                className={`${feature.color} p-8 rounded-[3rem] border-8 border-violet-900 shadow-[12px_12px_0px_rgba(76,29,149,1)] flex flex-col items-center text-center relative overflow-hidden`}
              >
                {/* Decorative highlight inside card */}
                <div className="absolute top-4 left-6 w-16 h-8 bg-white/40 rounded-full blur-md transform -rotate-12" />

                <div className="w-24 h-24 bg-white text-violet-900 rounded-full flex items-center justify-center text-5xl mb-8 shadow-[4px_4px_0px_rgba(76,29,149,1)] border-4 border-violet-900">
                  <feature.icon />
                </div>
                <h3
                  className="text-3xl font-black mb-4 text-white drop-shadow-[0_3px_0_rgba(76,29,149,1)]"
                  style={{ WebkitTextStroke: "1px #4c1d95" }}
                >
                  {feature.title}
                </h3>
                <p className="text-violet-900 font-bold text-xl leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Building Blocks */}
      <section className="py-32 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-white drop-shadow-[0_4px_0_rgba(76,29,149,1)]"
            style={{ WebkitTextStroke: "2px #4c1d95" }}
          >
            Parents Ask...
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              layout // Enables smooth layout transitions for siblings
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.3, delay: i * 0.1 }}
              className={`border-4 border-violet-900 rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_rgba(76,29,149,1)] relative z-20 ${i % 2 === 0 ? "bg-fuchsia-600" : "bg-amber-500"
                }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full text-left p-6 font-black text-2xl flex justify-between items-center text-white hover:bg-white/10 transition-colors"
              >
                <span className="pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-12 h-12 min-w-[3rem] bg-white rounded-full flex items-center justify-center border-4 border-violet-900 shadow-[4px_4px_0px_rgba(76,29,149,1)]"
                >
                  <FaChevronDown className="text-violet-900" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="bg-white border-t-4 border-violet-900"
                  >
                    <div className="p-8 font-bold text-xl text-violet-900 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Massive CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-fuchsia-500 border-t-8 border-violet-900">
        {/* Background stars */}
        <div className="absolute top-10 left-10 text-6xl text-amber-400 opacity-50">
          <FaStar />
        </div>
        <div className="absolute bottom-10 right-10 text-8xl text-cyan-400 opacity-50">
          <FaStar />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white drop-shadow-[0_8px_0_rgba(76,29,149,1)]"
            style={{ WebkitTextStroke: "3px #4c1d95" }}
          >
            Ready to Play?
          </motion.h2>
          <p className="text-2xl text-violet-900 font-bold mb-12 bg-white p-6 rounded-3xl border-4 border-violet-900 shadow-[8px_8px_0px_rgba(76,29,149,1)] inline-block">
            Join the fun and start your speech journey right now!
          </p>
          <br />
          <motion.button
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{
              scale: 0.9,
              boxShadow: "0px 0px 0px rgba(76,29,149,1)",
            }}
            onClick={onGetStarted}
            className="bg-amber-400 text-violet-900 text-3xl py-6 px-16 rounded-full font-black border-8 border-violet-900 shadow-[12px_12px_0px_rgba(76,29,149,1)] hover:bg-yellow-300 transition-colors inline-flex items-center gap-4"
          >
            Let's Go! <FaRocket />
          </motion.button>
        </div>
      </section>

      {/* Chunky Footer */}
      <footer className="text-center py-10 font-bold text-xl border-t-8 border-violet-900 bg-violet-800 text-violet-300">
        <p>© 2026 SpeechGood. Built for fun and learning!</p>
      </footer>
    </div>
  );
};

export default Landing;
