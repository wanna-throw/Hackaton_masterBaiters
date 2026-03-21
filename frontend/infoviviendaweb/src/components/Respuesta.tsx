import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Copy, Check, Send } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/chat';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface RespuestaProps {
  query: string;
  resumeHistory?: boolean;
  onBack: () => void;
}

// Module-level cache so chat survives unmount/remount
let cachedMessages: { role: 'user' | 'ai'; text: string }[] = [];
let cachedHistory: ChatMessage[] = [];

const Respuesta: React.FC<RespuestaProps> = ({ query, resumeHistory = false, onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>(
    resumeHistory ? cachedMessages : []
  );
  const [displayedText, setDisplayedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [error, setError] = useState('');
  const chatHistoryRef = useRef<ChatMessage[]>(resumeHistory ? cachedHistory : []);
  const fullResponseRef = useRef('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

  // Sync cache whenever messages change
  useEffect(() => {
    cachedMessages = messages;
    cachedHistory = chatHistoryRef.current;
  }, [messages]);

  // Scroll to bottom when new content arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText, messages]);

  // Send initial query on mount (skip if resuming history)
  useEffect(() => {
    if (hasSentInitial.current) return;
    hasSentInitial.current = true;
    if (!resumeHistory) {
      // Clear cache for new conversation
      cachedMessages = [];
      cachedHistory = [];
      sendMessage(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (prompt: string) => {
    setError('');
    setIsLoading(true);
    setIsTyping(false);
    setDisplayedText('');
    fullResponseRef.current = '';

    // Add user message to display
    setMessages((prev) => [...prev, { role: 'user', text: prompt }]);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: chatHistoryRef.current,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      const aiText: string = data.text || 'No se recibió respuesta.';

      // Update chat history for context
      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'model', parts: [{ text: aiText }] },
      ];

      fullResponseRef.current = aiText;
      setIsLoading(false);
      setIsTyping(true);

      // Start typing animation
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < aiText.length) {
          setDisplayedText(aiText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
          // Add final AI message to messages array
          setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);
          setDisplayedText('');
        }
      }, 8);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Error de conexión con el servidor.');
    }
  };

  const handleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim() || isLoading || isTyping) return;
    const msg = followUp;
    setFollowUp('');
    sendMessage(msg);
  };

  const handleCopy = () => {
    const allAiText = messages
      .filter((m) => m.role === 'ai')
      .map((m) => m.text)
      .join('\n\n');
    const textToCopy = allAiText || fullResponseRef.current || displayedText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like rendering
  const renderText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold text
      const boldParts = line.split(/(\*\*.*?\*\*)/g);
      const rendered = boldParts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="text-cyan-300 font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('> ')) {
          return (
            <span key={j} className="text-cyan-200/80">
              {part.slice(2)}
            </span>
          );
        }
        return <span key={j}>{part}</span>;
      });

      // Handle blockquote lines
      if (line.startsWith('> ')) {
        return (
          <div
            key={i}
            className="border-l-2 border-cyan-500/50 pl-4 py-2 my-2 bg-cyan-500/5 rounded-r-lg"
          >
            {rendered}
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={i} className="h-3" />;
      }

      return (
        <p key={i} className="leading-relaxed">
          {rendered}
        </p>
      );
    });
  };

  // Get completed messages (all except the currently typing one)
  const completedMessages = messages;
  // Check if we're currently showing a typing animation
  const showTypingBubble = isTyping && displayedText;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="hero-grid" />
      <div className="hero-glow top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 animate-pulse-line" />
      <div
        className="hero-glow bottom-1/3 left-1/3 -translate-x-1/2 translate-y-1/2 animate-pulse-line"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-line" />
      <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-line" />

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5 bg-black/60 backdrop-blur-xl"
        >
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="text-sm font-medium">Volver</span>
          </button>

          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-400" />
            <span className="text-sm font-semibold text-white">
              Respuesta IA
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-zinc-400 hover:text-cyan-300 transition-colors duration-300 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-400" />
                <span className="text-sm text-green-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="text-sm">Copiar</span>
              </>
            )}
          </button>
        </motion.header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10 space-y-6">
            {/* Render completed messages */}
            {completedMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {msg.role === 'user' ? (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                      Tu consulta
                    </p>
                    <div className="bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-white/90 text-base">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black to-black flex items-center justify-center">
                        <img src="img/logoinfoviviendasintexto.png" alt="Logo" className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        InfoVivienda IA
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/6 rounded-2xl px-6 py-6 text-white/85 text-[15px] leading-relaxed backdrop-blur-sm">
                      {renderText(msg.text)}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black to-black flex items-center justify-center">
                  <img src="img/logoinfoviviendasintexto.png" alt="Logo" className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    InfoVivienda IA está pensando
                  </p>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1 ml-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Currently typing AI response */}
            {showTypingBubble && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black to-black flex items-center justify-center">
                    <img src="img/logoinfoviviendasintexto.png" alt="Logo" className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    InfoVivienda IA
                  </p>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1 ml-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </motion.div>
                </div>
                <div className="bg-white/[0.02] border border-white/6 rounded-2xl px-6 py-6 text-white/85 text-[15px] leading-relaxed backdrop-blur-sm">
                  {renderText(displayedText)}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 align-text-bottom"
                  />
                </div>
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-300 text-sm"
              >
                ⚠️ {error}. Demasiados intentos para la API gratuita, esto es solo una demo ;).
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom bar — follow-up input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="border-t border-white/5 bg-black/60 backdrop-blur-xl px-6 lg:px-12 py-4"
        >
          <form
            onSubmit={handleFollowUp}
            className="max-w-3xl mx-auto flex items-center gap-3"
          >
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Haz una pregunta de seguimiento..."
              disabled={isLoading || isTyping}
              className="w-full py-3 px-4 text-sm text-white placeholder:text-zinc-600 bg-white/5 border border-white/8 rounded-xl outline-none focus:border-cyan-500/40 transition-all duration-300 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={isLoading || isTyping || !followUp.trim()}
              className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-3 rounded-xl hover:brightness-110 transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Respuesta;
