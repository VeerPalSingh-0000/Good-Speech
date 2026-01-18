// src/components/Footer.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', href: '#', icon: <FaTwitter /> },
    { name: 'GitHub', href: 'https://github.com/VeerPalSingh-0000', icon: <FaGithub /> },
    { name: 'LinkedIn', href: '#', icon: <FaLinkedin /> },
  ];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Copyright */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <i className="fas fa-comment text-sm text-white"></i>
               </div>
               <span className="font-bold text-slate-800 dark:text-white text-lg">SpeechGood</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Built with passion and technology.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 text-xl transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;