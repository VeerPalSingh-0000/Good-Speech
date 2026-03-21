import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

export const useSpeechRecognition = (language = 'hi-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Get half-finished results
    recognition.lang = language;

    recognition.onresult = (event) => {
      let currentFinal = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentFinal += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      if (currentFinal) {
        setTranscript((prev) => prev + ' ' + currentFinal.trim());
      }
      setInterimTranscript(currentInterim);
    };

    let localError = false;

    recognition.onerror = (event) => {
      console.warn('Speech recognition warning:', event.error);
      if (['not-allowed', 'network', 'no-speech'].includes(event.error)) {
        localError = true;
        setIsListening(false);
        
        if (event.error === 'network') {
           toast.error("Speech Recognition disconnected. Ensure you are online and using Google Chrome or Microsoft Edge. Some browsers (like Brave/Firefox) block this feature.", { duration: 5000 });
        } else if (event.error === 'not-allowed') {
           toast.error("Microphone access denied.");
        }
      }
    };

    recognition.onend = () => {
      // If we are still supposed to be listening and there was no critical error, restart (continuous fallback)
      if (isListening && !localError) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isListening]);

  const startListening = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    try {
      setTranscript('');
      setInterimTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
    }
  }, [supported]);

  const stopListening = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    setIsListening(false);
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error(e);
    }
  }, [supported]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Utility to map spoken words vs target text
  const compareToTarget = useCallback((targetText) => {
    if (!targetText) return [];
    
    // Simple word splitter breaking on spaces and punctuation
    const targetWords = targetText.trim().split(/[\s,।;|\\n!?]+/);
    const spokenWords = transcript.trim().split(/[\s,।;|\\n!?]+/);

    return targetWords.map((word, index) => {
      const matchFound = spokenWords.some(w => 
        w.toLowerCase().includes(word.toLowerCase()) || 
        word.toLowerCase().includes(w.toLowerCase())
      );
      
      return {
        word,
        isCorrect: matchFound,
      };
    });
  }, [transcript]);

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript: (transcript + ' ' + interimTranscript).trim(),
    supported,
    startListening,
    stopListening,
    resetTranscript,
    compareToTarget
  };
};
