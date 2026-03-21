import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react';

interface RespuestaProps {
  query: string;
  onBack: () => void;
}

const Respuesta: React.FC<RespuestaProps> = ({ query, onBack }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);

  // Simulated AI response (replace with real API call later)
  const fullResponse = `Según la legislación vigente en España, te proporciono la siguiente información sobre tu consulta: "${query}".

La Ley de Vivienda 12/2023 establece un marco normativo que regula diversos aspectos del mercado inmobiliario español. A continuación, te resumo los puntos más relevantes:

**1. Zonas tensionadas**
Las comunidades autónomas pueden declarar zonas de mercado residencial tensionado cuando el coste medio de la hipoteca o alquiler supere el 30% de la renta media de los hogares de la zona.

**2. Regulación de alquileres**
En estas zonas tensionadas, se aplican límites a los precios del alquiler tanto para grandes tenedores como para pequeños propietarios, utilizando como referencia el Índice de Precios de Referencia.

**3. Protección frente a desahucios**
Se refuerzan las medidas de protección para personas vulnerables, incluyendo la ampliación de plazos y la obligatoriedad de ofrecer alternativas habitacionales.

**4. Incentivos fiscales**
Se establecen bonificaciones de hasta el 90% en el IRPF para propietarios que reduzcan el precio del alquiler en zonas tensionadas.

**5. Vivienda asequible**
Se crea la categoría de "vivienda asequible incentivada" con beneficios fiscales y urbanísticos para promover el acceso a la vivienda.

> 💡 **Recomendación**: Te sugiero consultar con un asesor legal especializado para analizar cómo estas regulaciones aplican a tu situación particular.

¿Necesitas más detalles sobre algún punto en concreto?`;

  // Typing animation effect
  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        setDisplayedText(fullResponse.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [isTyping, fullResponse]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullResponse);
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
        // Blockquote
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

      // Empty line
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
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
            {/* Query bubble */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Tu consulta
              </p>
              <div className="bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-white/90 text-base">
                {query}
              </div>
            </motion.div>

            {/* AI response */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center">
                  <img src="./logoinfoviviendasintexto.png" alt="Logo" className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  InfoVivienda IA
                </p>
                {isTyping && (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1 ml-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animation-delay-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animation-delay-400" />
                  </motion.div>
                )}
              </div>

              <div className="bg-white/[0.02] border border-white/6 rounded-2xl px-6 py-6 text-white/85 text-[15px] leading-relaxed backdrop-blur-sm">
                {renderText(displayedText)}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 align-text-bottom"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="border-t border-white/5 bg-black/60 backdrop-blur-xl px-6 lg:px-12 py-4"
        >
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <input
              type="text"
              placeholder="Haz una pregunta de seguimiento..."
              className="w-full py-3 px-4 text-sm text-white placeholder:text-zinc-600 bg-white/5 border border-white/8 rounded-xl outline-none focus:border-cyan-500/40 transition-all duration-300"
            />
            <button className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-3 rounded-xl hover:brightness-110 transition-all duration-300 hover:scale-105 cursor-pointer">
              <Sparkles size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Respuesta;
