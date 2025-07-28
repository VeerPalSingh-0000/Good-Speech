import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

// THE FIX: Added a default empty array for navItems to prevent crashes.
const Footer = ({ navItems = [], setCurrentView }) => {

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: <FaTwitter /> },
    { name: 'GitHub', href: 'https://github.com/VeerPalSingh-0000', icon: <FaGithub /> },
    { name: 'LinkedIn', href: '#', icon: <FaLinkedin /> },
  ];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <i className="fas fa-comment text-xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">SpeechGood</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Your professional partner in enhancing communication skills through modern, effective therapy exercises.
            </p>
          </div>

          {/* Quick Links Section - Dynamically generated from props */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((link) => (
                <li key={link.key}>
                  <motion.button
                    onClick={() => setCurrentView(link.key)}
                    className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left w-full"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Connect With Us</h3>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 text-2xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} SpeechGood. All rights reserved. Built with passion and technology.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
