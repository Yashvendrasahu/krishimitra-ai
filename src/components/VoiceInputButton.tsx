import React, { useState, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, className = "" }) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please type your message.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onTranscript(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={isListening}
      title={isListening ? "Listening... (सुन रहा हूँ...)" : "Click to speak in Hindi/English"}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-xl font-medium transition-all ${
        isListening
          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
          : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300"
      } ${className}`}
    >
      {isListening ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
      {isListening && (
        <span className="ml-2 text-xs font-semibold animate-pulse">
          {language === "hi" ? "सुन रहा हूँ..." : "Listening..."}
        </span>
      )}
    </button>
  );
};
