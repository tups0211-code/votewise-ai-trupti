import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Globe, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponse } from '../lib/gemini';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot = () => {
  const { language: globalLanguage } = useLanguage();
  const [chatLanguage, setChatLanguage] = useState(globalLanguage);

  useEffect(() => {
    setChatLanguage(globalLanguage);
  }, [globalLanguage]);

  const tLocal = (section: string, key: string) => {
    try {
      const sectionData = (translations as any)[chatLanguage][section];
      if (sectionData && sectionData[key]) return sectionData[key];
    } catch (e) {}
    return key;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: tLocal('chat', 'defaultMsg'), sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Update default message on language change
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([{ id: '1', text: tLocal('chat', 'defaultMsg'), sender: 'bot' }]);
    }
  }, [chatLanguage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLanguages(false);
      }
    };
    if (showLanguages) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguages]);
  
  // Speech Recognition setup
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      if (recognition.current) {
        recognition.current.lang = chatLanguage === 'Hindi' ? 'hi-IN' : chatLanguage === 'Marathi' ? 'mr-IN' : 'en-US';
        recognition.current.start();
        setIsListening(true);
      } else {
        alert("Your browser doesn't support voice recognition.");
      }
    }
  };

  const speakText = (text: string) => {
    if (!isSpeakingEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (chatLanguage === 'Hindi') utterance.lang = 'hi-IN';
    else if (chatLanguage === 'Marathi') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-US';
    
    window.speechSynthesis.speak(utterance);
  };

  const languages = ['English', 'Hindi', 'Marathi'] as const;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMessage = { id: Date.now().toString(), text: userText, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getGeminiResponse(userText, chatLanguage);
    
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: aiResponse, sender: 'bot' }]);
    setIsLoading(false);
    
    speakText(aiResponse);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-slate-800 transition-all z-50 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open VoteWise AI Assistant"
          >
            <Sparkles className="w-6 h-6 absolute top-4 right-4 text-cyan-bright animate-pulse" />
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] md:w-[400px] h-[650px] max-h-[85vh] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] flex flex-col z-50 overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between relative shrink-0 z-20">
              {/* Decorative Header Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-electric/20 rounded-full blur-[40px] pointer-events-none"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                  <Bot size={24} className="text-cyan-bright" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight tracking-tight">{tLocal('chat', 'demo')}</h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-accent' : 'bg-orange-500 animate-pulse'}`}></span> {isOnline ? tLocal('chat', 'online') : tLocal('chat', 'offline')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                  className={`p-2 rounded-xl transition-colors ${isSpeakingEnabled ? 'text-cyan-bright bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  title={isSpeakingEnabled ? "Mute AI Voice" : "Enable AI Voice"}
                >
                  {isSpeakingEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <div className="relative" ref={langDropdownRef}>
                  <button 
                    onClick={() => setShowLanguages(!showLanguages)}
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                  >
                    <Globe size={16} /> {chatLanguage.substring(0, 2)}
                  </button>
                  <AnimatePresence>
                    {showLanguages && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-3 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                      >
                        {languages.map(lang => (
                          <button
                            key={lang}
                            onClick={() => { setChatLanguage(lang); setShowLanguages(false); }}
                            className={`w-full text-left px-5 py-3 text-sm transition-colors ${chatLanguage === lang ? 'font-bold text-blue-electric bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
                          >
                            {lang}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors ml-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-5 overflow-y-auto bg-slate-50 space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                  Speaking in {chatLanguage}
                </span>
              </div>
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-auto border border-white">
                      <Bot size={16} className="text-slate-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-[1.25rem] text-[15px] leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-br-sm'
                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                    } whitespace-pre-wrap`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-auto border border-white">
                    <Bot size={16} className="text-slate-600" />
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-[1.25rem] rounded-bl-sm shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSend} className="flex gap-2 relative bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-200 focus-within:ring-2 focus-within:ring-blue-electric/20 focus-within:border-blue-electric/50 transition-all">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    isListening 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? tLocal('chat', 'listening') : tLocal('chat', 'placeholder')}
                  className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-2 w-full min-w-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send Message"
                  className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-3 mb-1">
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">{tLocal('chat', 'powered')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
