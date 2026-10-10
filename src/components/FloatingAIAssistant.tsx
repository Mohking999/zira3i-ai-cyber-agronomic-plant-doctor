import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Loader2, 
  HelpCircle,
  Sprout
} from 'lucide-react';
import { Language, ThemeMode, WeatherTelemetry } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FloatingAIAssistantProps {
  telemetry: WeatherTelemetry | null;
  farmRegionName: string;
  lang: Language;
  theme: ThemeMode;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  telemetry,
  farmRegionName,
  lang,
  theme,
}) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: lang === 'ar'
        ? 'مرحباً بك! أنا د. زرعي، المستشار الزراعي الرقمي المعتمد. كيف يمكنني مساعدتك في محصولك، تشخيص الأمراض، أو تنظيم الري اليوم؟'
        : lang === 'fr'
          ? 'Bonjour ! Je suis Dr. Zira3i, votre agronome virtuel spécialisé en cultures méditerranéennes. Comment puis-je vous aider aujourd\'hui ?'
          : 'Hello! I am Dr. Zira3i, your cyber-agronomist plant doctor. How can I assist with your crops, disease diagnostics, or irrigation scheduling today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition for FAB
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US';

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInputQuery(text);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US';
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (overrideText?: string) => {
    const query = overrideText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const farmContext = {
        region: farmRegionName,
        temp: telemetry?.temperature,
        humidity: telemetry?.humidity,
        et0: telemetry?.et0,
        wind: telemetry?.windSpeed,
      };

      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      historyPayload.push({ role: 'user', content: query });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          farmContext,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Agronomic query failed.');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to connect to Dr. Zira3i. Please verify your connection or Gemini key.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black shadow-[0_0_25px_rgba(0,230,118,0.45)] hover:shadow-[0_0_35px_rgba(0,230,118,0.7)] hover:scale-105 transition-all duration-300"
          title={t.askAgronomist}
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">
            {lang === 'ar' ? 'د. زرعي' : 'Dr. Zira3i'}
          </span>
        </button>
      )}

      {/* Floating Interactive Chat Drawer */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
            isDark 
              ? 'bg-[#0c1412]/95 border-emerald-500/40 shadow-[0_0_50px_rgba(0,230,118,0.2)]' 
              : 'bg-white/95 border-emerald-600/30 shadow-2xl'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-emerald-500/20 bg-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.aiChatTitle}
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 3.8 Flash • Online
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-black/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Questions Chips */}
          <div className="px-3 py-2 border-b border-emerald-500/10 overflow-x-auto scrollbar-none flex items-center gap-1.5 bg-black/20">
            <button
              onClick={() => handleSend(t.q1)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 whitespace-nowrap hover:bg-emerald-500/20"
            >
              {t.q1}
            </button>
            <button
              onClick={() => handleSend(t.q2)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap hover:bg-cyan-500/20"
            >
              {t.q2}
            </button>
            <button
              onClick={() => handleSend(t.q3)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap hover:bg-amber-500/20"
            >
              {t.q3}
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-none shadow-md'
                      : isDark
                        ? 'bg-[#142420] text-zinc-100 border border-emerald-500/20 rounded-bl-none'
                        : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[9px] block text-right mt-1 font-mono ${
                    msg.role === 'user' ? 'text-slate-800' : 'text-zinc-500'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dr. Zira3i is calculating agronomic recommendation...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box & Voice Button */}
          <div className="p-3 border-t border-emerald-500/20 bg-black/20 flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title="Speak question"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.typeMessage}
              className={`flex-1 p-2.5 rounded-xl text-xs sm:text-sm border transition-all ${
                isDark
                  ? 'bg-black/50 border-emerald-500/30 text-white placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none'
                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none'
              }`}
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputQuery.trim()}
              className={`p-2.5 rounded-xl font-bold transition-all ${
                isLoading || !inputQuery.trim()
                  ? 'bg-zinc-800 text-zinc-500'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
