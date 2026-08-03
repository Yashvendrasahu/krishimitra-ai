import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Volume2, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  className?: string;
  autoSendOnFinish?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  onInterimTranscript,
  onListeningChange,
  className = "",
  autoSendOnFinish = false,
}) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [selectedLang, setSelectedLang] = useState<string>(
    language === "hi" ? "hi-IN" : "en-IN"
  );
  const [showLangSelector, setShowLangSelector] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Update default language when context language changes
  useEffect(() => {
    setSelectedLang(language === "hi" ? "hi-IN" : "en-IN");
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    }
    setIsListening(false);
    if (onListeningChange) onListeningChange(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === "hi"
          ? "आपके ब्राउज़र में आवाज़ से टाइपिंग (Web Speech API) समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें।"
          : "Voice recognition is not supported in this browser. Please type your query."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true; // Enable live interim results
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
        if (onListeningChange) onListeningChange(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript && onInterimTranscript) {
          onInterimTranscript(interimTranscript);
        }

        if (finalTranscript) {
          onTranscript(finalTranscript);
          setIsListening(false);
          if (onListeningChange) onListeningChange(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (onListeningChange) onListeningChange(false);

        if (event.error === "not-allowed" || event.error === "permission-denied") {
          alert(
            language === "hi"
              ? "माइक्रोफोन की अनुमति अस्वीकृत की गई है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफोन चालू करें।"
              : "Microphone permission was denied. Please allow microphone access in browser settings."
          );
        } else if (event.error === "no-speech") {
          // Silent timeout, no error alert needed
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (onListeningChange) onListeningChange(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      if (onListeningChange) onListeningChange(false);
    }
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Web Speech API not supported in this browser"
        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  const languages = [
    { code: "hi-IN", label: "हिंदी (Hindi)" },
    { code: "en-IN", label: "English (India)" },
    { code: "pa-IN", label: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "mr-IN", label: "मराठी (Marathi)" },
  ];

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* Voice Dictation Mic Button */}
      <button
        type="button"
        onClick={toggleListening}
        title={
          isListening
            ? language === "hi"
              ? "आवाज़ रिकॉर्डिंग रोकें (Click to Stop)"
              : "Stop listening"
            : language === "hi"
            ? "आवाज़ से बोलकर टाइप करें (Web Speech Dictation)"
            : "Click to speak using Web Speech API"
        }
        className={`relative inline-flex items-center justify-center p-2.5 rounded-xl font-medium transition-all shadow-sm ${
          isListening
            ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/40 ring-4 ring-red-500/20 animate-pulse"
            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
        } ${className}`}
      >
        {isListening ? (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <Mic className="w-5 h-5 animate-bounce" />
            <span className="text-xs font-bold hidden sm:inline">
              {language === "hi" ? "सुन रहा हूँ..." : "Listening..."}
            </span>
          </div>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Language Selector Dropdown Toggle */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLangSelector(!showLangSelector)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5"
          title="Change Voice Recognition Language"
        >
          <Globe className="w-3 h-3 text-emerald-600" />
          <span>{selectedLang.split("-")[0]}</span>
        </button>

        {showLangSelector && (
          <div className="absolute bottom-full mb-2 left-0 z-50 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 text-xs">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setSelectedLang(lang.code);
                  setShowLangSelector(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-slate-700/80 flex items-center justify-between ${
                  selectedLang === lang.code
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <span>{lang.label}</span>
                {selectedLang === lang.code && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

