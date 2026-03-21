import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Send,
  ChevronDown,
  Sparkles,
  Building2,
  Landmark,
  ArrowLeftRight,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/chat';

type SimMode = 'habisim' | 'hipotsim';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface DisplayMessage {
  role: 'user' | 'ai';
  text: string;
}

interface SimuladorProps {
  initialMode?: SimMode;
  onBack: () => void;
}

const HABISIM_SYSTEM = `Actúa como "HabiSim", un simulador de impacto legislativo de vivienda. El usuario te proporcionará leyes (reales o ficticias) que quiere simular. Junto con los parámetros que te dé (renta media anual, precio medio anual, etc.), debes analizar cómo esas leyes afectarían al mercado de vivienda español. Responde con un análisis estructurado: impacto en alquileres, impacto en compraventa, efectos en propietarios, efectos en inquilinos, y una conclusión general. Usa datos realistas como referencia. Tono: profesional y analítico. Español de España.`;

const HIPOTSIM_SYSTEM = `Actúa como "HipotSim", un simulador de hipotecas por chat. El usuario te hará preguntas sobre hipotecas y tú debes guiarlo paso a paso para simular su hipoteca ideal. Pregúntale datos como: precio de la vivienda, ahorros, ingresos mensuales, tipo de interés preferido (fijo/variable/mixto), plazo deseado, etc. Con esa información, calcula la cuota mensual estimada, el total de intereses, y da recomendaciones. Usa la fórmula francesa de amortización. Tono: cercano, profesional y útil. Español de España.`;

const Simulador: React.FC<SimuladorProps> = ({ initialMode = 'habisim', onBack }) => {
  const [mode, setMode] = useState<SimMode>(initialMode);
  const [prompt, setPrompt] = useState('');
  const [showParams, setShowParams] = useState(false);
  const [rentaMedia, setRentaMedia] = useState('');
  const [precioMedio, setPrecioMedio] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const chatHistoryRef = useRef<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync mode if initialMode changes while mounted
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText, messages]);

  // Reset chat when switching modes
  const switchMode = (newMode: SimMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setMessages([]);
    setDisplayedText('');
    setIsLoading(false);
    setIsTyping(false);
    setError('');
    setPrompt('');
    setShowParams(false);
    setRentaMedia('');
    setPrecioMedio('');
    chatHistoryRef.current = [];
  };

  const sendMessage = async (userPrompt: string) => {
    setError('');
    setIsLoading(true);
    setIsTyping(false);
    setDisplayedText('');

    setMessages((prev) => [...prev, { role: 'user', text: userPrompt }]);

    // Build the full prompt with system context for first message
    let fullPrompt = userPrompt;
    if (chatHistoryRef.current.length === 0) {
      const systemCtx = mode === 'habisim' ? HABISIM_SYSTEM : HIPOTSIM_SYSTEM;
      fullPrompt = `${systemCtx}\n\n---\nConsulta del usuario:\n${userPrompt}`;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          history: chatHistoryRef.current,
        }),
      });

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);

      const data = await res.json();
      const aiText: string = data.text || 'No se recibió respuesta.';

      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'user', parts: [{ text: fullPrompt }] },
        { role: 'model', parts: [{ text: aiText }] },
      ];

      setIsLoading(false);
      setIsTyping(true);

      let idx = 0;
      const interval = setInterval(() => {
        if (idx < aiText.length) {
          setDisplayedText(aiText.slice(0, idx + 1));
          idx++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
          setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);
          setDisplayedText('');
        }
      }, 8);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Error de conexión.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || isTyping) return;

    let finalPrompt = prompt;

    // Append manual params for HabiSim if set
    if (mode === 'habisim' && (rentaMedia || precioMedio)) {
      const params: string[] = [];
      if (rentaMedia) params.push(`Renta media anual: ${rentaMedia}€`);
      if (precioMedio) params.push(`Precio medio anual: ${precioMedio}€`);
      finalPrompt += `\n\nParámetros manuales:\n${params.join('\n')}`;
    }

    setPrompt('');
    sendMessage(finalPrompt);
  };

  // Simple markdown renderer (reused pattern)
  const renderText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const boldParts = line.split(/(\*\*.*?\*\*)/g);
      const rendered = boldParts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="text-cyan-300 font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });

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
      if (line.trim() === '') return <div key={i} className="h-3" />;
      return (
        <p key={i} className="leading-relaxed">
          {rendered}
        </p>
      );
    });
  };

  const modeConfig = {
    habisim: {
      name: 'HabiSim',
      description: 'Simulador de impacto legislativo',
      icon: <Landmark size={18} />,
      accent: 'from-cyan-500 to-blue-500',
      placeholder: 'Escribe las leyes que querrías implementar en la simulación...',
    },
    hipotsim: {
      name: 'HipotSim',
      description: 'Simulador de hipotecas por chat',
      icon: <Building2 size={18} />,
      accent: 'from-emerald-500 to-cyan-500',
      placeholder: 'Pregunta sobre tu hipoteca ideal...',
    },
  };

  const current = modeConfig[mode];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* Background */}
      <div className="hero-grid" />
      <div className="hero-glow top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 animate-pulse-line" />
      <div
        className="hero-glow bottom-1/3 left-1/3 -translate-x-1/2 translate-y-1/2 animate-pulse-line"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-line" />

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
            <div className={`text-transparent bg-clip-text bg-gradient-to-r ${current.accent}`}>
              {current.icon}
            </div>
            <span className="text-sm font-semibold text-white">{current.name}</span>
            <span className="text-xs text-zinc-500 hidden sm:inline">— {current.description}</span>
          </div>

          <div className="w-20" /> {/* Spacer for centering */}
        </motion.header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10 space-y-6">
            {/* HabiSim banner image */}
            {mode === 'habisim' && messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/8"
              >
                <img
                  src="/img/diputados.png"
                  alt="Congreso de los Diputados"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Simulador legislativo</p>
                  <p className="text-lg font-bold text-white">HabiSim</p>
                </div>
              </motion.div>
            )}
            {/* HipotSim banner image */}
            {mode === 'hipotsim' && messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/8"
              >
                <img
                  src="/img/hipoteca.png"
                  alt="Simulador de hipotecas"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Simulador de hipotecas</p>
                  <p className="text-lg font-bold text-white">HipotSim</p>
                </div>
              </motion.div>
            )}
            {/* Welcome message */}
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center py-16"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${current.accent} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  {React.cloneElement(current.icon, {
                    size: 28,
                    className: 'text-black',
                  })}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{current.name}</h2>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  {mode === 'habisim'
                    ? 'Introduce las leyes que quieres simular y ajusta los parámetros para ver su impacto en el mercado de vivienda.'
                    : 'Cuéntame sobre tu situación y te ayudaré a simular la hipoteca ideal para ti, paso a paso.'}
                </p>
              </motion.div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {msg.role === 'user' ? (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                      Tu simulación
                    </p>
                    <div className="bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-white/90 text-sm whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center`}
                      >
                        {React.cloneElement(current.icon, {
                          size: 14,
                          className: 'text-black',
                        })}
                      </div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        {current.name}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/6 rounded-2xl px-6 py-6 text-white/85 text-[15px] leading-relaxed backdrop-blur-sm">
                      {renderText(msg.text)}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center`}
                >
                  {React.cloneElement(current.icon, {
                    size: 14,
                    className: 'text-black',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {current.name} está simulando
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

            {/* Typing */}
            {isTyping && displayedText && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center`}
                  >
                    {React.cloneElement(current.icon, {
                      size: 14,
                      className: 'text-black',
                    })}
                  </div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {current.name}
                  </p>
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

            {/* Error */}
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

        {/* Bottom section */}
        <div className="border-t border-white/5 bg-black/60 backdrop-blur-xl">
          {/* HabiSim collapsible parameters */}
          <AnimatePresence>
            {mode === 'habisim' && showParams && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-b border-white/5"
              >
                <div className="max-w-3xl mx-auto px-6 lg:px-8 py-4">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    Parámetros manuales
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">
                        Renta media anual (€)
                      </label>
                      <input
                        type="number"
                        value={rentaMedia}
                        onChange={(e) => setRentaMedia(e.target.value)}
                        placeholder="Ej: 25000"
                        className="w-full py-2.5 px-3 text-sm text-white placeholder:text-zinc-600 bg-white/5 border border-white/8 rounded-xl outline-none focus:border-cyan-500/40 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">
                        Precio medio anual (€)
                      </label>
                      <input
                        type="number"
                        value={precioMedio}
                        onChange={(e) => setPrecioMedio(e.target.value)}
                        placeholder="Ej: 180000"
                        className="w-full py-2.5 px-3 text-sm text-white placeholder:text-zinc-600 bg-white/5 border border-white/8 rounded-xl outline-none focus:border-cyan-500/40 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar + mode switcher */}
          <div className="px-6 lg:px-12 py-4">
            <div className="max-w-3xl mx-auto">
              {/* HabiSim params toggle */}
              {mode === 'habisim' && (
                <button
                  type="button"
                  onClick={() => setShowParams(!showParams)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-cyan-300 transition-colors duration-300 mb-3 cursor-pointer"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${showParams ? 'rotate-180' : ''}`}
                  />
                  {showParams ? 'Ocultar parámetros' : 'Parámetros manuales'}
                </button>
              )}

              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={current.placeholder}
                  disabled={isLoading || isTyping}
                  className="w-full py-3 px-4 text-sm text-white placeholder:text-zinc-600 bg-white/5 border border-white/8 rounded-xl outline-none focus:border-cyan-500/40 transition-all duration-300 disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={isLoading || isTyping || !prompt.trim()}
                  className={`flex-shrink-0 bg-gradient-to-r ${current.accent} text-black p-3 rounded-xl hover:brightness-110 transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-40 disabled:hover:scale-100`}
                >
                  <Send size={18} />
                </button>
              </form>

              {/* Mode switcher */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'habisim' ? 'hipotsim' : 'habisim')}
                  className="group flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <ArrowLeftRight
                    size={14}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  Cambiar a{' '}
                  <span className="font-semibold text-zinc-300 group-hover:text-cyan-300 transition-colors">
                    {mode === 'habisim' ? 'HipotSim' : 'HabiSim'}
                  </span>
                </button>

                {/* Active mode indicator */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${current.accent} animate-pulse`}
                  />
                  <span className="text-xs text-zinc-500">
                    Modo activo: <span className="text-zinc-300">{current.name}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Simulador;
