import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaCamera, 
  FaVideoSlash, 
  FaMicrophone, 
  FaPowerOff, 
  FaRedo,
  FaVideo,
  FaStop,
  FaLightbulb
} from "react-icons/fa";
import BackButton from "../ui/BackButton";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { uploadToGoogleDrive } from "../../lib/googleDrive";

export default function MirrorView() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const { getGoogleDriveToken } = useAuth();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const handleBack = useCallback(() => {
    stopCamera();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [stopCamera, navigate]);

  const startCamera = useCallback(async () => {
    try {
      stopCamera();

      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      videoStreamRef.current = videoStream;

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioStreamRef.current = audioStream;

      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }

      mediaRecorderRef.current = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        try {
          toast.loading("Requesting Drive permission...", { id: 'driveUpload' });
          let token = await getGoogleDriveToken();
          
          toast.loading("Uploading to Google Drive...", { id: 'driveUpload' });
          const fileName = `Mirror_Practice_${new Date().toISOString().slice(0,10)}.webm`;
          try {
            await uploadToGoogleDrive(audioBlob, fileName, token);
          } catch (retryErr) {
            console.warn("Retrying Drive upload with fresh account...", retryErr);
            token = await getGoogleDriveToken(true);
            await uploadToGoogleDrive(audioBlob, fileName, token);
          }
          
          toast.success("Saved to Google Drive!", { id: 'driveUpload' });
        } catch (error) {
          console.error("Drive upload failed:", error);
          toast.error(error.message || "Failed to upload to Google Drive.", { id: 'driveUpload' });
        } finally {
          stopCamera();
        }
      };

      setHasPermission(true);
      setIsCameraActive(true);
      setError("");
    } catch (err) {
      console.error("Camera/Mic access denied or error:", err);
      setHasPermission(false);
      setIsCameraActive(false);
      setError("Could not access camera or microphone. Please check your browser permissions.");
    }
  }, [getGoogleDriveToken, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setRecordSeconds(0);
    }
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (!isCameraActive) {
        startCamera().then(() => {
          audioChunksRef.current = [];
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.start();
            setIsRecording(true);
          }
        });
      } else {
        audioChunksRef.current = [];
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.start();
          setIsRecording(true);
        }
      }
    }
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800/90 backdrop-blur-lg p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 font-display">
              <FaVideo className="text-teal-500" />
              Virtual Mirror
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Look yourself in the eye, watch your facial expressions, and practice speaking with confidence.
            </p>
          </div>
        </div>

        {isCameraActive && (
          <button
            onClick={stopCamera}
            className="px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition flex items-center gap-1.5 border border-rose-200 dark:border-rose-800/60 shadow-sm shrink-0"
            title="Turn off camera & light"
          >
            <FaPowerOff size={13} />
            <span className="hidden sm:inline">Turn Off Camera</span>
          </button>
        )}
      </div>

      {/* Main Camera Viewport Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 aspect-video md:aspect-[16/10] flex items-center justify-center group"
      >
        {/* Background Video (Absolute Positioned so it doesn't break flex layout) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isCameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Live Indicator Badge on Video Feed */}
        {isCameraActive && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live Camera</span>
          </div>
        )}

        {/* State 1: Requesting Permission */}
        {hasPermission === null && (
          <div className="relative z-10 text-slate-300 flex flex-col items-center gap-4 p-8 text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-3xl animate-pulse">
              <FaCamera />
            </div>
            <div>
              <p className="font-bold text-lg text-white">Starting Virtual Mirror...</p>
              <p className="text-xs text-slate-400 mt-1">Please allow camera and microphone access if prompted by your browser.</p>
            </div>
          </div>
        )}

        {/* State 2: Permission Denied */}
        {hasPermission === false && (
          <div className="relative z-10 text-rose-300 flex flex-col items-center gap-4 p-8 text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl">
              <FaVideoSlash />
            </div>
            <div>
              <p className="font-bold text-xl text-white">Camera Access Blocked</p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={startCamera}
              className="mt-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <FaRedo /> Try Again
            </button>
          </div>
        )}

        {/* State 3: Camera Off / Standby Screen (Centred Glassmorphism UI) */}
        {hasPermission === true && !isCameraActive && (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 backdrop-blur-xl">
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-md flex flex-col items-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-teal-400 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Camera Offline • Privacy Safe</span>
              </div>

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-4xl shadow-2xl my-2">
                <FaPowerOff />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white font-display">Virtual Mirror Ready</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Your camera light is turned off. Whenever you're ready to practice your speech, click below to turn on the camera.
                </p>
              </div>

              <button
                onClick={startCamera}
                className="mt-4 px-8 py-3.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-500 text-white font-display font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 border border-teal-400/30"
              >
                <FaVideo className="text-lg" />
                <span>Turn On Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Recording Controls Overlay (Visible when camera active) */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-20">
            <div /> {/* Spacer */}

            <div className="pointer-events-auto flex items-center justify-center gap-4">
              {isRecording ? (
                <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl p-2 pl-5 pr-3 rounded-full border border-rose-500/40 shadow-2xl">
                  <div className="flex items-center gap-2.5 text-rose-400 font-mono font-bold text-sm tracking-wider">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span>REC {formatTimer(recordSeconds)}</span>
                  </div>

                  <button
                    onClick={handleToggleRecording}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full shadow-lg transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
                  >
                    <FaStop /> Stop & Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleToggleRecording}
                  className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-display font-extrabold text-sm rounded-full shadow-2xl shadow-teal-900/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-teal-400/30"
                >
                  <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse border-2 border-white" />
                  <span>Start Practice Recording</span>
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Practice Tips Section */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700">
        <h3 className="text-teal-600 dark:text-teal-400 font-extrabold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
          <FaLightbulb className="text-teal-500" />
          Mirror Practice Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-900/50 border border-teal-100/80 dark:border-slate-700/80">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center mb-2">1</span>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Eye Contact & Posture</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Look directly into your eyes in the mirror. Relax your neck and shoulders.</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-900/50 border border-teal-100/80 dark:border-slate-700/80">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center mb-2">2</span>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Mouth Movements</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Observe lip and jaw articulation while pronouncing tricky vowels and consonants.</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-900/50 border border-teal-100/80 dark:border-slate-700/80">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center mb-2">3</span>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Pacing & Breathing</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Take deep diaphragmatic breaths before each sentence to maintain steady flow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


