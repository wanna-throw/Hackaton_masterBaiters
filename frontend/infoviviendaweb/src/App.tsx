import React, { useState } from 'react';
import { 
  Search, 
  Scale, 
  Calculator, 
  LineChart, 
  ArrowLeftRight, 
  Menu, 
  X, 
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-700 tracking-tight">InfoVivienda</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Simuladores</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Estadísticas</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Comparador</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">¿Cómo funciona?</a>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm">
              Iniciar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a href="#" className="block px-3 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Simuladores</a>
              <a href="#" className="block px-3 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Estadísticas</a>
              <a href="#" className="block px-3 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Comparador</a>
              <a href="#" className="block px-3 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg">¿Cómo funciona?</a>
              <div className="pt-4">
                <button className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-medium">
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // Mock routing logic based on query
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
        >
          Tu asistente inteligente para la <span className="text-blue-600">vivienda</span> y <span className="text-blue-600">legislación</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto"
        >
          Resuelve tus dudas legales, calcula hipotecas y analiza el mercado inmobiliario con el poder de la Inteligencia Artificial.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-xl group-focus-within:bg-blue-600/20 transition-all" />
            <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-xl focus-within:border-blue-500 transition-all">
              <div className="pl-4 text-slate-400">
                <Search size={24} />
              </div>
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe lo que buscas, ej: ¿Cómo me afecta la nueva ley de alquileres?"
                className="w-full py-4 px-4 text-lg text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-slate-500 font-medium">Sugerencias:</span>
            {['Ley de vivienda 2024', 'Simulador hipoteca', 'Precio m2 Madrid', 'Ayudas alquiler'].map((tag) => (
              <button 
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface ToolCardProps {
  title: string;
  icon: any;
  description: string;
  key?: number | string;
}

const ToolCard = ({ title, icon: Icon, description }: ToolCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
        Explorar herramienta <ChevronRight size={18} className="ml-1" />
      </div>
    </motion.div>
  );
};

const ToolsSection = () => {
  const tools = [
    {
      title: "Simulador de leyes",
      icon: Scale,
      description: "Analiza cómo te afectan las nuevas normativas de vivienda y alquiler de forma personalizada."
    },
    {
      title: "Simulador de Hipoteca/Alquiler",
      icon: Calculator,
      description: "Calcula cuotas, gastos e impuestos para tomar la mejor decisión financiera en tu próxima vivienda."
    },
    {
      title: "Estadísticas Históricas",
      icon: LineChart,
      description: "Visualiza la evolución de los precios y tendencias del mercado inmobiliario en tu zona."
    },
    {
      title: "Comparador de leyes y estadísticas",
      icon: ArrowLeftRight,
      description: "Compara diferentes escenarios legislativos y datos de mercado para entender el impacto real."
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Explora nuestras herramientas</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Diseñadas para darte claridad y control sobre tus decisiones inmobiliarias.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <ToolCard 
              key={index} 
              title={tool.title} 
              icon={tool.icon} 
              description={tool.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-700">InfoVivienda</span>
            <span className="text-slate-400">|</span>
            <p className="text-slate-500 text-sm">© 2026 Hackathon Project</p>
          </div>
          
          <div className="flex space-x-8">
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Términos de uso</a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Política de Privacidad</a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <ToolsSection />
        
        {/* Extra Info Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-600 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Cómo funciona InfoVivienda?</h2>
                  <p className="text-blue-100 text-lg mb-8">
                    Nuestra IA procesa miles de páginas de legislación y datos de mercado en tiempo real para ofrecerte respuestas precisas y herramientas de simulación avanzadas.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Consultas en lenguaje natural",
                      "Datos actualizados de fuentes oficiales",
                      "Simulaciones personalizadas sin registro"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="bg-white/20 p-1 rounded-full">
                          <ChevronRight size={16} />
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl w-full lg:w-96">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-white text-blue-600 p-2 rounded-lg">
                      <Info size={20} />
                    </div>
                    <span className="font-bold">Dato del día</span>
                  </div>
                  <p className="text-blue-50 italic mb-4">
                    "El precio del alquiler en zonas tensionadas se ha visto reducido un 5% tras la aplicación de la nueva ley de vivienda."
                  </p>
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
