import React from 'react';
import Mascot from './Mascot';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-8 p-4">
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mascot mood="happy" size={150} />
            </motion.div>
            
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-3xl font-bold animate-pulse bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-display">
                  SpeechGood
              </h2>
              
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-slate-400 text-sm font-medium ml-2">
                    Warming up...
                </p>
              </div>
            </div>
            
        </div>
    );
};

export default LoadingScreen;