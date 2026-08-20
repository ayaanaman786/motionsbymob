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
  const abortControllerRef = useRef<AbortController | null>(null);

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
      // Abort any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortControllerRef.current.signal,
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
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error(err);
      setError(err.message || 'Mechanical connection offline. Please retry.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#050505] border-l border-white/5 shadow-2xl z-[101] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-6 bg-black">
          <div>
            <span className="outfit-editorial text-xs text-zinc-400 tracking-widest uppercase block mb-1">
              — CONSULTATION
            </span>
            <span className="brutal text-xl text-white tracking-tight uppercase">
              MOB Producer
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-white transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Feed */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        >
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] text-sm py-3 px-4 rounded-sm font-light leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-black'
                    : 'bg-zinc-900 text-zinc-300'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Error Display */}
          {error && (
            <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-sm flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <p className="text-xs text-white leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-zinc-500 p-4">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse delay-150" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Quick suggestions / Help Chips */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 py-4 border-t border-white/5 space-y-2">
            <span className="outfit-editorial text-[10px] text-zinc-600 uppercase tracking-widest block">
              SUGGESTED DISCUSSIONS
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="bg-zinc-900 hover:bg-zinc-800 py-1.5 px-3 rounded-sm text-xs text-zinc-400 hover:text-white transition-colors text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Input Footer */}
        <div className="p-6 border-t border-white/5 bg-[#050505] flex flex-col gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type your message..."
            className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-white focus:outline-none text-sm py-3 px-4 rounded-sm text-zinc-200 placeholder:text-zinc-600 disabled:opacity-40 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-full bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-500 py-3 rounded-sm font-medium transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            Send Message <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
}
