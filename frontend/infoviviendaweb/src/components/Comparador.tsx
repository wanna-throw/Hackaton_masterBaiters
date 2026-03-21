import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Globe, 
  Send, 
  Sparkles, 
  Scale, 
  Building2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Activity
} from 'lucide-react';

const API_URL_COMPARE = 'http://localhost:5000/api/compare';

interface ComparadorProps {
  onBack: () => void;
}

const Comparador: React.FC<ComparadorProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCompare = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(API_URL_COMPARE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error('Error al conectar con el comparador.');
      
      const data = await res.json();
      setResult(data.text);
    } catch (err: any) {
      setError(err.message || 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 bg-black flex flex-col font-sans overflow-hidden"
    >
      {/* Background Decor */}
      <div className="hero-grid opacity-20 pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] -z-10" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-6 border-b border-white/5 bg-black/60 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 p-px">
               <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                  <Scale size={20} className="text-white" />
               </div>
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none mb-0.5">Comparador Internacional</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">Análisis de Políticas de Vivienda</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-12">
           
           {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-12"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20">
                   <Globe size={40} className="text-white animate-pulse" />
                </div>
                <div>
                   <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Compara Mercados Globales</h2>
                   <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">Analiza y compara el impacto de las políticas de vivienda entre diferentes países. Introduce qué países y años quieres contrastar.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                   <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-500/20 text-emerald-400 rounded-md"><TrendingUp size={14} /></div>
                      <div>
                         <p className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Análisis de Impacto</p>
                         <p className="text-[11px] text-zinc-500">Compara cómo una misma ley afecta a España y Alemania.</p>
                      </div>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                      <div className="mt-1 p-1 bg-blue-500/20 text-blue-400 rounded-md"><Building2 size={14} /></div>
                      <div>
                         <p className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Datos Históricos</p>
                         <p className="text-[11px] text-zinc-500">Evalúa la evolución del precio de alquiler desde 2010.</p>
                      </div>
                   </div>
                </div>
              </motion.div>
           )}

           {loading && (
             <div className="h-[40vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                   <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                   <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" size={20} />
                </div>
                <p className="text-zinc-500 font-medium animate-pulse">Relacionando datos económicos internacionales...</p>
             </div>
           )}

           {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                 <div className="p-8 lg:p-12 rounded-[40px] bg-zinc-900/40 border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Scale size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                       <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                          <Activity className="animate-bounce" size={24} />
                       </div>
                       <h3 className="text-2xl font-bold text-white">Análisis Comparativo Gen AI</h3>
                    </div>
                    <div className="text-zinc-300 text-lg leading-loose space-y-4">
                       {renderText(result)}
                    </div>
                 </div>

                 <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                    <AlertCircle className="text-blue-400" size={20} />
                    <p className="text-xs text-blue-300 font-medium">Este análisis ha sido generado automáticamente para fines comparativos de vivienda.</p>
                 </div>
              </motion.div>
           )}

           {error && (
              <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 text-red-400 text-center font-medium">
                 ⚠️ {error}
              </div>
           )}
        </div>
      </div>

      {/* Input Section */}
      <footer className="shrink-0 p-6 lg:p-10 border-t border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
           <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                placeholder="Ej: Compara las políticas de España y de Argentina y dime cuales han tenido mejor impacto."
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-5 pl-8 pr-32 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/30 focus:bg-white/[0.08] transition-all duration-300"
              />
              <button
                onClick={handleCompare}
                disabled={!prompt.trim() || loading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                  prompt.trim() && !loading
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <span>Comparar</span>
                <Send size={16} />
              </button>
           </div>
           <p className="text-[10px] text-zinc-600 text-center uppercase tracking-[0.2em] font-bold">Únicamente comparativas internacionales de vivienda autorizadas</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Comparador;
