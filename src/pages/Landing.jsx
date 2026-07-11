// src/pages/Landing.jsx

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform,
  useMotionTemplate
} from "framer-motion";
import {
  FaMicrophoneAlt,
  FaBook,
  FaArrowRight,
  FaChevronDown,
  FaMagic,
  FaMedal,
} from "react-icons/fa";

// ---------------------------------------------------------
// Interactive Components
// ---------------------------------------------------------

// 1. Magnetic Button
const MagneticButton = ({ children, className, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX * 0.3); // Magnetic pull strength
    y.set(mouseY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// 2. 3D Tilt Card
const TiltCard = ({ children, className, delay = 0 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div 
        style={{ transform: "translateZ(40px)" }} 
        className="h-full flex flex-col bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 pointer-events-none"
      >
        {children}
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------
// Main Landing Page
// ---------------------------------------------------------

const Landing = ({ onGetStarted, onLogin }) => {
  const howItWorksRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  
  // Interactive background glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    {
      q: "Is this for kids or adults?",
      a: "Both! While our interactive games are designed to be engaging, the core therapy principles apply to all ages. Adults appreciate the precise tracking, analytics, and guided practice.",
    },
    {
      q: "Do I need special equipment?",
      a: "No special equipment is required. You simply need a smartphone, tablet, or computer with a built-in microphone and a standard web browser.",
    },
    {
      q: "Is my personal data secure?",
      a: "Yes. We prioritize your privacy. All voice recordings are processed locally on your device and are never transmitted to or stored on our servers.",
    },
  ];

  // Staggered text animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  
  const wordVars = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden relative">
      
      {/* Interactive Cursor Glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 mix-blend-multiply hidden md:block"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.08), transparent 80%)`,
        }}
      />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-200 rounded-full mix-blend-multiply filter blur-[120px]" 
        />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50"
            >
              <FaMicrophoneAlt className="text-white text-lg" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-slate-800 relative overflow-hidden">
              SpeechGood
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-6 items-center"
          >
            <button
              onClick={onLogin}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden sm:block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-indigo-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Log in
            </button>
            <MagneticButton
              onClick={onGetStarted}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-full shadow-md shadow-indigo-200 transition-colors"
            >
              Get Started
            </MagneticButton>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-40 pb-24 px-6 max-w-5xl mx-auto text-center flex flex-col items-center min-h-[85vh] justify-center">
        <div className="space-y-8 max-w-3xl flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide shadow-sm cursor-default"
          >
            <FaMagic className="text-indigo-500 animate-pulse" /> Introducing SpeechGood 2.0
          </motion.div>

          <motion.h1
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
          >
            {"Discover Your Super Voice.".split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVars} className="inline-block mr-3 mb-2 last:mr-0">
                {word === "Voice." ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                    {word}
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            The modern, interactive way to practice speech every day. Enhance your pronunciation, read guided stories, and track your progress with beautiful analytics.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full"
          >
            <MagneticButton
              onClick={onGetStarted}
              className="group w-full sm:w-auto bg-slate-900 text-white text-lg py-4 px-8 rounded-full font-medium shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2 overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Practicing Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Hover sweep effect */}
              <div className="absolute inset-0 bg-slate-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            </MagneticButton>
            
            <button
              onClick={() => scrollToSection(howItWorksRef)}
              className="group w-full sm:w-auto bg-white/50 backdrop-blur-sm hover:bg-white text-slate-700 border border-slate-200 hover:border-slate-300 text-lg py-4 px-8 rounded-full font-medium transition-all"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section ref={howItWorksRef} className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4"
            >
              A Complete Therapy Toolkit
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600"
            >
              Everything you need to improve your speech, thoughtfully designed into one elegant platform.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {[
              {
                icon: FaMicrophoneAlt,
                title: "Real-time Feedback",
                desc: "Practice specific sounds and receive instant, visual feedback on your pronunciation accuracy.",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                border: "border-indigo-100",
              },
              {
                icon: FaBook,
                title: "Guided Reading",
                desc: "Read interactive stories with pacing controls and intelligent highlighting to build fluency.",
                color: "text-violet-600",
                bg: "bg-violet-50",
                border: "border-violet-100",
              },
              {
                icon: FaMedal,
                title: "Progress Analytics",
                desc: "Track your daily streaks, review your improvement over time, and celebrate your milestones.",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100",
              },
            ].map((feature, idx) => (
              <TiltCard key={idx} delay={idx * 0.15} className="w-full">
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 border ${feature.border}`}>
                  <feature.icon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Common Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-slate-300 transition-colors shadow-sm group"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 font-semibold text-lg flex justify-between items-center text-slate-800"
              >
                <span className="group-hover:text-indigo-600 transition-colors">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className={`text-slate-400 ${openFaq === i ? 'text-indigo-600' : ''}`}
                >
                  <FaChevronDown />
                </motion.div>
              </button>

              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Decorative glows inside CTA */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 origin-center" 
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 origin-center" 
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Begin your journey today.
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join users who are improving their speech with our beautiful, interactive platform.
            </p>
            
            <MagneticButton
              onClick={onGetStarted}
              className="group bg-white text-slate-900 text-lg py-5 px-12 rounded-full font-semibold shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center mx-auto gap-3 relative overflow-hidden"
            >
               <span className="relative z-10 flex items-center gap-2">
                Get Started for Free
                <FaArrowRight className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </span>
              <div className="absolute inset-0 bg-indigo-50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-500 border-t border-slate-200 bg-slate-50">
        <p className="text-sm font-medium">© {new Date().getFullYear()} SpeechGood. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;

