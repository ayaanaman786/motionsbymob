import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Film, Sparkles, AlertCircle, ArrowRight, CornerDownLeft } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  "Inquire about booking a custom shoot",
  "Explain the 'Quiet Authority' aesthetic",
  "Discuss OEM+ styling and alignment",
  "Review the cinematic portfolio"
];

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Welcome to Motions by MOB. I am your cinematic producer and creative consultant. Let us discuss the planning, lens calibration, or visual choreography of your custom automotive film. How shall we begin?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Hide notification after initial timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText) return;

    if (!textToSend) {
      setInput('');
    }
    setError(null);

    // Append user message
    const updatedMessages = [...messages, { role: 'user', text: messageText } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from MOB Producer.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Mechanical connection offline. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div id="gemini-chatbot-root" className="fixed bottom-6 left-6 z-50 select-none font-sans">
      
      {/* Floating Notification Badge */}
      {showNotification && !isOpen && (
        <div className="absolute bottom-16 left-0 w-64 bg-zinc-900/90 border border-white/20 p-3 shadow-2xl rounded-sm transition-all duration-300">
          <div className="flex items-start justify-between">
            <span className="outfit-editorial text-[11px] text-[#ff2a2a] tracking-widest uppercase font-bold">
              [ CREATIVE CONSULTATION ]
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
              }}
              className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="outfit-editorial text-[11px] text-zinc-300 uppercase leading-relaxed mt-1.5">
            Discuss production framing, cinematic lenses, or choreography with our lead producer.
          </p>
          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-zinc-900/90 border-l border-b border-white/10 rotate-45" />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNotification(false);
        }}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border ${
          isOpen
            ? 'bg-[#ff2a2a] border-[#ff2a2a] text-white rotate-90 shadow-[0_0_20px_#ff2a2a]'
            : 'bg-zinc-900/90 hover:bg-black border-white/15 text-zinc-300 hover:text-white shadow-[0_4px_24px_rgba(0,0,0,0.8)]'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-[#ff2a2a] border-2 border-black rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          className="absolute bottom-16 left-0 w-80 sm:w-96 h-[500px] bg-[#050505]/95 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-md rounded-sm flex flex-col overflow-hidden"
          style={{ transformOrigin: 'bottom left' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4 bg-black/40">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-pulse" />
              <div>
                <span className="outfit-editorial text-[11px] text-white tracking-widest uppercase font-bold block">
                  MOB CREATIVE PRODUCER
                </span>
                <span className="outfit-editorial text-[7px] text-zinc-400 uppercase block tracking-wider">
                  AI CONSULTING ENGAGED // ONLINE
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-zinc-600" />
              <span className="outfit-editorial text-[7px] text-zinc-400 uppercase font-mono">
                CALIBRE // GEMINI 3.5
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
          >
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Speaker Identity Indicator */}
                <span className="outfit-editorial text-[6px] text-zinc-600 uppercase tracking-widest mb-1 select-none">
                  {msg.role === 'user' ? 'CLIENT_INQUIRY' : 'MOB_PRODUCER_DECISION'}
                </span>

                <div 
                  className={`max-w-[85%] text-xs py-2.5 px-3.5 rounded-sm uppercase tracking-wider leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-zinc-900 text-zinc-100 border border-white/5 font-mono'
                      : 'bg-zinc-900/80 text-zinc-300 border-l-2 border-[#ff2a2a] border-y border-r border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Error Display */}
            {error && (
              <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#ff2a2a] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="outfit-editorial text-[11px] text-[#ff2a2a] tracking-widest block font-bold">
                    SYSTEM EXCEPTION // ERROR
                  </span>
                  <p className="outfit-editorial text-[11px] text-zinc-300 uppercase leading-normal">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Loading / Thinking Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="outfit-editorial text-[6px] text-zinc-600 uppercase tracking-widest mb-1 select-none animate-pulse">
                  CALCULATING FRAME_RATE...
                </span>
                <div className="bg-zinc-900/80 text-zinc-400 border-l-2 border-zinc-700 border-y border-r border-white/5 text-xs py-2.5 px-3.5 rounded-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="font-mono text-[11px] text-zinc-600 tracking-widest uppercase ml-1">
                    FOCUSING OPTICS
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Quick suggestions / Help Chips */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 bg-black/20 border-t border-white/5 space-y-1.5">
              <span className="outfit-editorial text-[7px] text-zinc-600 uppercase tracking-widest block">
                SUGGESTED DISCUSSIONS // PRESET
              </span>
              <div className="flex flex-wrap gap-1">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-[#ff2a2a]/30 py-1 px-2 rounded-sm text-[11px] outfit-editorial text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 uppercase"
                  >
                    {sug} <ArrowRight className="w-2 h-2 text-[#ff2a2a]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input Footer */}
          <div className="p-4 border-t border-white/10 bg-zinc-900/60 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="PROPOSE PRODUCTION PLANS..."
                className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-[#ff2a2a] focus:outline-none text-xs py-2 px-3 pr-8 rounded-sm uppercase tracking-wider text-zinc-200 placeholder:text-zinc-600 font-mono disabled:opacity-40"
              />
              <div className="absolute right-2 top-2.5 flex items-center gap-1 text-zinc-700 pointer-events-none">
                <CornerDownLeft className="w-3 h-3" />
              </div>
            </div>

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-[#ff2a2a] disabled:bg-zinc-900 hover:bg-[#ff4d4d] border border-[#ff2a2a] disabled:border-white/5 text-white disabled:text-zinc-600 p-2 rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Decorative tech footer */}
          <div className="bg-black border-t border-white/5 px-4 py-1.5 flex justify-between items-center text-[6px] outfit-editorial text-zinc-600 uppercase select-none">
            <span>PROJ_COMPLIANCE: VERIFIED</span>
            <span>MOTIONSBYMOB // EXECUTIVE SERVICE</span>
          </div>

        </div>
      )}

    </div>
  );
}
