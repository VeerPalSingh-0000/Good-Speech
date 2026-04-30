import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaCamera, FaVideoSlash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function MirrorView() {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied or error:", err);
        setHasPermission(false);
        setError("Could not access camera. Please check your browser permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FaUser className="text-teal-500" />
            Virtual Mirror
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Look yourself in the eye and practice speaking confidently.
          </p>
        </div>
      </div>

      {/* Camera Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 aspect-video md:aspect-[4/3] flex items-center justify-center"
      >
        {hasPermission === null && (
          <div className="text-slate-400 flex flex-col items-center gap-3">
            <FaCamera className="text-4xl animate-pulse" />
            <p className="font-medium">Requesting camera access...</p>
          </div>
        )}

        {hasPermission === false && (
          <div className="text-rose-400 flex flex-col items-center gap-3 p-6 text-center">
            <FaVideoSlash className="text-5xl mb-2" />
            <p className="font-bold text-lg">Camera Access Denied</p>
            <p className="text-sm text-rose-300 max-w-sm">{error}</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            hasPermission ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "scaleX(-1)" }} // Mirrors the video
        />
        
        {/* Mirror Overlay / Frame */}
        {hasPermission && (
          <div className="absolute inset-0 pointer-events-none border-[8px] border-white/10 rounded-3xl">
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <div className="bg-black/50 backdrop-blur-md text-white/90 px-6 py-3 rounded-full text-sm font-medium border border-white/20">
                Maintain eye contact with yourself 👁️
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Prompts Section */}
      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 border border-teal-100 dark:border-teal-800/50">
        <h3 className="text-teal-800 dark:text-teal-300 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
          Practice Tips
        </h3>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">1.</span>
            Keep your shoulders relaxed and maintain a steady posture.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">2.</span>
            Look directly into your own eyes—not at your mouth.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">3.</span>
            Speak 5-6 simple sentences about your day, or just introduce yourself.
          </li>
        </ul>
      </div>
    </div>
  );
}
