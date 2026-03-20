import { Scale, Calculator, LineChart, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface ModeCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  index: number;
}

const ModeCard = ({ title, icon: Icon, description, index }: ModeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="mode-card group cursor-pointer"
    >
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-500 transition-all duration-500">
        <Icon size={26} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm mb-6">{description}</p>
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 group-hover:text-cyan-400 transition-colors duration-300">
        <span>Explorar</span>
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
};

const modes = [
  {
    title: 'Simulador de leyes',
    icon: Scale,
    description:
      'Analiza cómo te afectan las nuevas normativas de vivienda y alquiler de forma personalizada.',
  },
  {
    title: 'Simulador de Hipoteca/Alquiler',
    icon: Calculator,
    description:
      'Calcula cuotas, gastos e impuestos para tomar la mejor decisión financiera en tu próxima vivienda.',
  },
  {
    title: 'Estadísticas Históricas',
    icon: LineChart,
    description:
      'Visualiza la evolución de los precios y tendencias del mercado inmobiliario en tu zona.',
  },
  {
    title: 'Comparador de leyes y estadísticas',
    icon: ArrowLeftRight,
    description:
      'Compara diferentes escenarios legislativos y datos de mercado para entender el impacto real.',
  },
];

const Modes = () => {
  return (
    <section id="modes" className="py-32 lg:py-40 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8"
          >
            <span className="text-sm text-cyan-400 font-medium">Herramientas</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Explora nuestras herramientas
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 max-w-2xl mx-auto text-lg"
          >
            Diseñadas para darte claridad y control sobre tus decisiones inmobiliarias.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {modes.map((mode, index) => (
            <ModeCard
              key={mode.title}
              title={mode.title}
              icon={mode.icon}
              description={mode.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Modes;
