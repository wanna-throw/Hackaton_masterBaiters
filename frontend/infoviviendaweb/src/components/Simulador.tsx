import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Send,
  ChevronDown,
  Sparkles,
  ArrowLeftRight,
  Settings,
  Users,
  Play,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/chat';
const API_URL_HABISIM = 'http://localhost:5000/api/habisim'; // Placeholder TODO: Connect to backend

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
  onSimulate?: (laws: string, params: any) => void;
}

const HABISIM_SYSTEM = `Actúa como "HabiSim", un simulador de impacto legislativo de vivienda. El usuario te proporcionará leyes (reales o ficticias) que quiere simular. Junto con los parámetros estadísticos que te dé, debes analizar cómo esas leyes afectarían al mercado de vivienda español. Responde con un análisis estructurado: impacto en alquileres, impacto en compraventa, efectos en propietarios, efectos en inquilinos, y una conclusión general. Usa datos realistas como referencia. Tono: profesional y analítico. Español de España.`;

const HIPOTSIM_SYSTEM = `Actúa como "HipotSim", un simulador de hipotecas por chat. El usuario te hará preguntas sobre hipotecas y tú debes guiarlo paso a paso para simular su hipoteca ideal. Pregúntale datos como: precio de la vivienda, ahorros, ingresos mensuales, tipo de interés preferido (fijo/variable/mixto), plazo deseado, etc. Con esa información, calcula la cuota mensual estimada, el total de intereses, y da recomendaciones. Usa la fórmula francesa de amortización. Tono: cercano, profesional y útil. Español de España.`;

const HABISIM_PARAMS_CONFIG = [
  { id: 'min_renta_hipoteca', label: 'Min. Renta Hipoteca (€)', placeholder: '1200', max: 4000 },
  { id: 'interes', label: 'Interés (%)', placeholder: '3.5', max: 50 },
  { id: 'alquiler_medio', label: 'Alquiler Medio (€)', placeholder: '800', max: 20000 },
  { id: 'inflacion', label: 'Inflación (%)', placeholder: '2.8', max: 1000 },
  { id: 'cambio_poblacional', label: 'Cambio Poblacional (%)', placeholder: '0.5', max: 50 },
  { id: 'sueldo_medio', label: 'Sueldo Medio (€)', placeholder: '2100', max: 20000 },
  { id: 'pib_per_capita', label: 'PIB per Cápita (€)', placeholder: '28000', max: 200000 },
  { id: 'viviendas_venta', label: 'Viviendas en Venta', placeholder: '450000', max: 50000000 },
  { id: 'pct_alquiler', label: 'Porcentaje Alquiler (%)', placeholder: '24.2', max: 80 },
  { id: 'viviendas_vacias', label: 'Viviendas Vacías', placeholder: '3400000', max: 50000000 },
  { id: 'nuevas_construcciones', label: 'Nuevas Construcciones', placeholder: '85000', max: 10000000 },
  { id: 'precio_medio_vivienda', label: 'Precio Medio Vivienda (€/m2)', placeholder: '2100', max: 100000 },
  { id: 'indice_catastrofes', label: 'Índice Catástrofes (1-10)', placeholder: '2', max: 10 },
  { id: 'ratio_comprador_vivienda', label: 'Ratio Comprador/Vivienda', placeholder: '3.1', max: 10000 },
  { id: 'meses', label: 'Duración (Meses)', placeholder: '24', max: 24 },
];

const Simulador: React.FC<SimuladorProps> = ({ initialMode = 'habisim', onBack, onSimulate }) => {
  const [mode, setMode] = useState<SimMode>(initialMode);
  const [prompt, setPrompt] = useState('');
  const [showParams, setShowParams] = useState(false);
  const [hParams, setHParams] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const chatHistoryRef = useRef<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText, messages]);

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
    setHParams({});
    chatHistoryRef.current = [];
  };

  const sendMessage = async (userPrompt: string) => {
    // If HabiSim, trigger simulation instead of chat
    if (mode === 'habisim' && onSimulate) {
      onSimulate(userPrompt, hParams);
      return;
    }

    setError('');
    setIsLoading(true);
    setIsTyping(false);
    setDisplayedText('');

    setMessages((prev) => [...prev, { role: 'user', text: userPrompt }]);

    let fullPrompt = userPrompt;
    if (chatHistoryRef.current.length === 0) {
      const systemCtx = mode === 'habisim' ? HABISIM_SYSTEM : HIPOTSIM_SYSTEM;

      let paramsText = '';
      if (mode === 'habisim' && Object.keys(hParams).length > 0) {
        paramsText = '\n\nParámetros estadísticos proporcionados para esta simulación:\n' +
          Object.entries(hParams)
            .filter(([_, val]) => (val as string).trim() !== '')
            .map(([id, val]) => {
              const label = HABISIM_PARAMS_CONFIG.find(c => c.id === id)?.label;
              return `- ${label}: ${val}`;
            }).join('\n');
      }

      fullPrompt = `${systemCtx}${paramsText}\n\n---\nConsulta del usuario:\n${userPrompt}`;
    }

    const targetUrl = mode === 'habisim' ? API_URL_HABISIM : API_URL;

    // If HabiSim, trigger navigation to results (which will handle the fetch to API_URL_HABISIM)
    if (mode === 'habisim' && onSimulate) {
      onSimulate(userPrompt, hParams);
      return;
    }

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          history: chatHistoryRef.current,
        }),
      });

      if (!res.ok) throw new Error('Error en la comunicación con el servidor');

      const data = await res.json();
      const aiResponse = data.text;

      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'user', parts: [{ text: fullPrompt }] },
        { role: 'model', parts: [{ text: aiResponse }] },
      ];

      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
      startTypingAnimation(aiResponse);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  const startTypingAnimation = (text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 10);
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const modeContent = {
    habisim: {
      name: 'HabiSim',
      subtitle: 'Simulador Legislativo AI',
      icon: <img src="/img/diputados.png" alt="HabiSim" className="w-full h-full object-cover rounded-xl" />,
      accent: 'from-cyan-400 to-blue-500',
      description: 'Evalúa el impacto de nuevas leyes de vivienda en el mercado real.',
      placeholder: 'Escribe las leyes que querrías implementar en la simulación...',
      img: '/img/diputados.png'
    },
    hipotsim: {
      name: 'HipotSim',
      subtitle: 'Asesor Hipotecario AI',
      icon: <img src="/img/hipoteca.png" alt="HipotSim" className="w-full h-full object-cover rounded-xl" />,
      accent: 'from-emerald-400 to-teal-500',
      description: 'Simula tu hipoteca ideal y recibe asesoramiento financiero personalizado.',
      placeholder: 'Describe qué tipo de vivienda quieres comprar y tus ahorros...',
      img: '/img/hipoteca.png'
    },
  };

  const current = modeContent[mode];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col font-sans"
    >
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="hero-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] -z-10" />

        <header className="flex items-center justify-between px-6 lg:px-12 py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-6">
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

            <div className="h-4 w-px bg-white/10 mx-2" />

            <div className="flex items-center gap-3">
              <div
                className={`w-16 h-10 rounded-xl bg-gradient-to-br ${current.accent} p-px overflow-hidden shadow-lg`}
              >
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <img src={current.img} alt={current.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-none mb-0.5">
                  {current.name}
                </h1>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-none">
                  {current.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => switchMode('habisim')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${mode === 'habisim'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              HabiSim
            </button>
            <button
              onClick={() => switchMode('hipotsim')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${mode === 'hipotsim'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              HipotSim
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div
                  className={`w-full max-w-2xl aspect-[21/9] rounded-3xl bg-gradient-to-br ${current.accent} mx-auto mb-8 p-px overflow-hidden shadow-2xl flex items-center justify-center`}
                >
                  <img src={current.img} alt={current.name} className="w-full h-full object-cover rounded-3xl" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Bienvenido a {current.name}
                </h2>
                <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
                  {current.description}
                </p>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-full ${msg.role === 'user'
                      ? 'bg-white/10'
                      : `bg-gradient-to-br ${current.accent}`
                      } flex items-center justify-center`}
                  >
                    {msg.role === 'user' ? (
                      <Users size={14} className="text-white" />
                    ) : (
                      <img src={current.img} alt={current.name} className="w-full h-full object-cover rounded-full" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {msg.role === 'user' ? 'Tú' : current.name}
                  </p>
                </div>
                <div
                  className={`border rounded-2xl px-6 py-6 text-white/85 text-[15px] leading-relaxed backdrop-blur-sm ${msg.role === 'user'
                    ? 'bg-white/[0.03] border-white/10 ml-12'
                    : 'bg-white/[0.02] border-white/6 mr-12'
                    }`}
                >
                  {renderText(msg.text)}
                </div>
              </motion.div>
            ))}

            {isLoading && !isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center overflow-hidden`}
                >
                  <img src={current.img} alt={current.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1.5 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-zinc-500 font-medium animate-pulse">
                    Procesando simulación
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

            {isTyping && displayedText && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center overflow-hidden`}
                  >
                    <img src={current.img} alt={current.name} className="w-full h-full object-cover" />
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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-300 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 bg-black/60 backdrop-blur-xl">
          <AnimatePresence>
            {mode === 'habisim' && showParams && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-b border-white/5"
              >
                <div className="max-w-3xl mx-auto px-6 lg:px-8 py-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings size={14} className="text-cyan-400" />
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      Parámetros Macroeconómicos de la Simulación
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {HABISIM_PARAMS_CONFIG.map((param) => (
                      <div key={param.id}>
                        <label className="text-[10px] font-bold text-zinc-500 mb-1 block uppercase tracking-tight">
                          {param.label}
                        </label>
                        <input
                          type="number"
                          value={hParams[param.id] || ''}
                          max={param.max}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (param.max && val > param.max) return;
                            setHParams({ ...hParams, [param.id]: e.target.value });
                          }}
                          placeholder={`Ej: ${param.placeholder}`}
                          className="w-full py-2 px-3 text-xs text-white placeholder:text-zinc-600 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/40 focus:bg-white/[0.08] transition-all duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="max-w-3xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (prompt.trim() && !isLoading) sendMessage(prompt);
                      }
                    }}
                    placeholder={current.placeholder}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-6 pr-32 text-white placeholder:text-zinc-500 outline-none focus:border-white/20 transition-all duration-300 resize-none min-h-[56px] max-h-32 text-sm"
                    rows={1}
                  />
                  <button
                    onClick={() => prompt.trim() && !isLoading && sendMessage(prompt)}
                    disabled={!prompt.trim() || isLoading}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${prompt.trim() && !isLoading
                      ? `bg-gradient-to-br ${current.accent} text-black shadow-lg shadow-cyan-500/20`
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                      }`}
                  >
                    {mode === 'habisim' ? (
                      <>
                        <span className="text-xs font-bold uppercase tracking-wider">Simular</span>
                        <Play size={16} fill="black" />
                      </>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  {mode === 'habisim' && (
                    <button
                      onClick={() => setShowParams(!showParams)}
                      className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${showParams ? 'text-cyan-400' : 'text-zinc-500 hover:text-white'
                        }`}
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${showParams ? 'rotate-180' : ''
                          }`}
                      />
                      {showParams ? 'Ocultar Parámetros' : 'Ver Parámetros Avanzados'}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => switchMode(mode === 'habisim' ? 'hipotsim' : 'habisim')}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeftRight size={16} />
                  Cambiar a {mode === 'habisim' ? 'HipotSim' : 'HabiSim'}
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
};

export default Simulador;
