import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { VoiceInputButton } from "../components/VoiceInputButton";
import { ChatMessage } from "../types";
import { storageService } from "../lib/firebase";

export const AiChat: React.FC = () => {
  const { language, t, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const { activeFarm, profile } = useFarm();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    storageService.getChatHistory()
  );
  const [inputText, setInputText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const presetQuestions = [
    "मेरी गेहूं की फसल में पीले पत्ते आ रहे हैं।",
    "आज आजादपुर मंडी में टमाटर का भाव क्या है?",
    "बारिश कब होगी और छिड़काव रोकूं या नहीं?",
    "1 एकड़ गेहूं में कितना यूरिया और डीएपी डालें?",
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || inputText).trim();
    if (!queryText && !selectedImage) return;

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: queryText || "Uploaded crop leaf image for diagnosis",
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = storageService.saveChatMessage(userMsg);
    setMessages(updated);

    setInputText("");
    const imagePayload = selectedImage;
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryText,
          language,
          imageBase64: imagePayload || undefined,
          farmContext: {
            farmerName: profile.name,
            district: profile.district,
            state: profile.state,
            activeCrop: activeFarm?.cropName,
            activeArea: activeFarm?.areaAcres,
            soilType: activeFarm?.soilType,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Server error responding to query");
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: "msg_" + Date.now(),
        sender: "assistant",
        text: data.text || "Thank you for asking. Here is the agricultural recommendation.",
        hindiText: data.hindiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedQuestions: data.suggestedQuestions,
      };

      const finalHistory = storageService.saveChatMessage(assistantMsg);
      setMessages(finalHistory);

      // Auto read response if user is on Hindi or requested audio
      if (data.text) {
        speakText(data.text);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: "msg_err_" + Date.now(),
        sender: "assistant",
        text: "I experienced a network issue. Please check your internet connection and try asking again.",
        hindiText: "क्षमा करें, नेटवर्क में समस्या आ रही है। कृपया पुनः प्रयास करें।",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      storageService.clearChatHistory();
      setMessages(storageService.getChatHistory());
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl p-4 border border-emerald-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {t("aiChat")}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Hindi & English Voice-enabled Gemini AI Agronomist
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold flex items-center gap-1 animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline">Stop Audio</span>
            </button>
          )}

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 dark:bg-slate-950/70 p-4 border-x border-emerald-100 dark:border-slate-800 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm ${
                  isUser
                    ? "bg-slate-800 text-white dark:bg-slate-700"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-emerald-100 dark:border-slate-800 rounded-tl-none"
                  }`}
                >
                  {/* Image Attachment preview */}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-2xl overflow-hidden border border-white/20 max-w-xs">
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded crop preview"
                        className="w-full h-auto object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-line font-sans">
                    {language === "hi" && msg.hindiText ? msg.hindiText : msg.text}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.hindiText || msg.text)}
                        className="hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggested follow-up chips */}
                {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-300 font-medium transition-colors border border-emerald-200/50 dark:border-slate-700"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-[80%] items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-emerald-100 dark:border-slate-800 flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>KrishiMitra AI is thinking... (कृषि मित्र उत्तर तैयार कर रहा है...)</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Questions Slider */}
      <div className="bg-white dark:bg-slate-900 px-4 py-2 border-x border-t border-emerald-100 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-b-3xl p-3 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-2">
        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border-2 border-emerald-500"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Live Listening Banner */}
        {isListening && (
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-2 animate-pulse">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              <span className="font-bold shrink-0">
                {language === "hi" ? "बोलिए..." : "Listening..."}
              </span>
              <span className="truncate italic font-medium text-slate-800 dark:text-slate-100">
                "{interimText || inputText || (language === "hi" ? "आवाज़ रिकॉर्ड हो रही है..." : "Speak your query now...")}"
              </span>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Attach crop leaf image"
          >
            <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>

          <VoiceInputButton
            onTranscript={(text) => {
              setInputText(text);
              setInterimText("");
              handleSend(text);
            }}
            onInterimTranscript={(text) => {
              setInterimText(text);
              setInputText(text);
            }}
            onListeningChange={(listening) => {
              setIsListening(listening);
              if (!listening) setInterimText("");
            }}
          />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === "hi"
                ? "सवाल पूछें या 🎤 बोलकर टाइप करें..."
                : "Ask anything or 🎤 tap microphone to dictate..."
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-500 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          />

          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || loading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-colors shadow-md shadow-emerald-600/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
