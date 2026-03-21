import { motion } from 'motion/react';

const tools = [
  { label: 'Simulador de Leyes', img: '/img/sim_leyes_card.png' },
  { label: 'Sim. Hipoteca/Alquiler', img: '/img/sim_hipoteca_card.png' },
  { label: 'Estadísticas Históricas', img: '/img/estadisticas_card.png' },
  { label: 'Comparador', img: '/img/comparador_card.png' },
];

const Modes = () => {
  return (
    <section id="modes" className="relative py-28 lg:py-36 bg-black overflow-hidden">
      <div className="modes-grid" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-16"
        >
          <span className="underline decoration-cyan-500 decoration-2 underline-offset-8">
            Nuestras Herramientas:
          </span>
        </motion.h2>

        {/* 1×4 image button grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.label}
              type="button"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/8 hover:border-cyan-500/40 transition-all duration-500 cursor-pointer"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

              {/* Image */}
              <img
                src={tool.img}
                alt={tool.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {tool.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Modes;
