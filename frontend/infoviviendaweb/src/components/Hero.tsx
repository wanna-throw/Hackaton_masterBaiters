import React, { useState } from 'react';
import { Search, ArrowRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Respuesta from './Respuesta';
import Simulador from './Simulador';

interface HeroProps {
  onOpenSimulador: (mode: 'habisim' | 'hipotsim') => void;
  onOpenDashboard: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenSimulador, onOpenDashboard }) => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [showRespuesta, setShowRespuesta] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [resumeHistory, setResumeHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query);
    setResumeHistory(false);
    setShowRespuesta(true);
    setHasHistory(true);
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background effects */}
      <div className="hero-grid" />
      <div className="hero-glow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-pulse-line" />
      <div
        className="hero-glow bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 animate-pulse-line"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-line" />
      <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-line" />
      <div className="absolute left-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse-line" />
      <div className="absolute right-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse-line" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 lg:px-8 text-center pt-24 pb-12 flex flex-col items-center gap-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.15]"
        >
          Tu asistente inteligente para la{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
              vivienda
            </span>
            <svg
              className="absolute -bottom-3 left-0 w-full h-3 text-cyan-400/40"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,6 Q50,0 100,6 T200,6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </span>{' '}
          y{' '}
          <span className="text-white/80">legislación</span>
        </motion.h1>

        {/* Mode selection buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          {[
            { label: 'Simulador de Leyes', img: '/img/simulador_leyes.png', type: 'simulador', mode: 'habisim' as const },
            { label: 'Dashboard Estadístico', img: '/img/dashboard_estadistico.png', type: 'dashboard' },
          ].map((mode) => (
            <button
              key={mode.label}
              type="button"
              onClick={() => {
                if (mode.type === 'simulador') onOpenSimulador(mode.mode!);
                else onOpenDashboard();
              }}
              className="group relative w-64 rounded-2xl overflow-hidden border border-white/8 hover:border-cyan-500/40 transition-all duration-500 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              <img
                src={mode.img}
                alt={mode.label}
                className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {mode.label}
                </span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="w-full max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-zinc-900/80 border border-white/10 rounded-2xl p-2 backdrop-blur-xl focus-within:border-cyan-500/40 transition-all duration-500">
              <div className="pl-4 text-zinc-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pregunta sobre vivienda, leyes o hipotecas..."
                className="w-full py-4 px-3 text-base text-white placeholder:text-zinc-600 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-3 rounded-xl hover:brightness-110 transition-all duration-300 hover:scale-105"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          {/* Autocomplete suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-5"
          >
            {[
              '¿Cómo me afecta la ley de alquileres?',
              'Calcular hipoteca',
              'Precio medio alquiler Barcelona',
              'Comparar leyes de vivienda',
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="px-4 py-2 text-sm text-zinc-400 bg-white/5 border border-white/8 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 transition-all duration-300 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating history button */}
      <AnimatePresence>
        {hasHistory && !showRespuesta && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => {
              setResumeHistory(true);
              setShowRespuesta(true);
            }}
            className="fixed bottom-8 right-8 z-40 group flex items-center gap-2.5 bg-zinc-900/90 border border-cyan-500/30 hover:border-cyan-400/60 rounded-full pl-5 pr-6 py-3 backdrop-blur-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
          >
            <MessageSquare size={18} className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors duration-300">
              Ver historial
            </span>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full-screen AI response panel */}
      <AnimatePresence>
        {showRespuesta && (
          <Respuesta
            query={submittedQuery}
            resumeHistory={resumeHistory}
            onBack={() => setShowRespuesta(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
