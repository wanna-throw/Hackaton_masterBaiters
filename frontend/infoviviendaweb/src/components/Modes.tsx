import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const tools = [
  {
    label: 'Simulador de Leyes',
    img: '/img/sim_leyes_card.png',
    desc: 'Propon tus leyes y ve como afectan a la gente y al país.',
    mode: 'habisim' as const,
  },
  {
    label: 'Sim. Hipoteca/Alquiler',
    img: '/img/sim_hipoteca_card.png',
    desc: 'Calcula cuotas, gastos e impuestos para tomar la mejor decisión financiera en tu próxima vivienda.',
    mode: 'hipotsim' as const,
  },
  {
    label: 'Estadísticas Históricas',
    img: '/img/estadisticas_card.png',
    desc: 'Visualiza la evolución de precios y tendencias del mercado inmobiliario en España.',
    type: 'dashboard',
  },
  {
    label: 'Comparador',
    img: '/img/comparador_card.png',
    desc: 'Compara diferentes legislaciones aplicadas en otros países y contrástalo con tu país.',
    type: 'comparador',
  },
];

const BlueTick = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="inline-block ml-1.5 flex-shrink-0">
    <path d="M1 6.5L4.5 10L10 2" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6.5L9.5 10L15 2" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ModesProps {
  onOpenSimulador: (mode: 'habisim' | 'hipotsim') => void;
  onOpenDashboard: () => void;
  onOpenComparador: () => void;
}

const Modes: React.FC<ModesProps> = ({ onOpenSimulador, onOpenDashboard, onOpenComparador }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="modes" className="relative pt-12 lg:pt-16 pb-28 lg:pb-36 bg-black overflow-hidden">
      <div className="modes-grid" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-16 text-center"
        >
          <span className="underline decoration-cyan-500 decoration-2 underline-offset-10">
            Nuestras Herramientas:
          </span>
        </motion.h2>
      </div>

      {/* 1×4 image button grid — full width */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-0">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.button
                type="button"
                onClick={() => {
                   if (tool.type === 'dashboard') onOpenDashboard();
                   else if (tool.type === 'comparador') onOpenComparador();
                   else onOpenSimulador(tool.mode as any);
                }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group relative aspect-square w-full overflow-hidden hover:brightness-110 transition-all duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                <img
                  src={tool.img}
                  alt={tool.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                  <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {tool.label}
                  </span>
                </div>
              </motion.button>

              {/* WhatsApp-style tooltip */}
              <AnimatePresence>
                {hovered === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-30 w-56 pointer-events-none"
                  >
                    <div className="relative bg-zinc-900 rounded-xl px-4 py-3 shadow-2xl shadow-black/60 border border-white/5">
                      {/* Bubble tail pointing up */}
                      <div className="absolute left-1/2 -translate-x-1/2 -top-[7px] w-3.5 h-3.5 bg-zinc-900 rotate-45 border-l border-t border-white/5" />
                      <p className="text-[13px] text-zinc-300 leading-relaxed">
                        {tool.desc}
                      </p>
                      <div className="flex items-center justify-end mt-1.5 gap-0.5">
                        <span className="text-[10px] text-zinc-600">21:37</span>
                        <BlueTick />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
    </section>
  );
};

export default Modes;
