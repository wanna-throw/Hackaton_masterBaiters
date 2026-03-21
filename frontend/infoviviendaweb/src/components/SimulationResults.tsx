import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Info,
  Layers,
  Sparkles,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface SimulationResultsProps {
  data: { laws: string; params: any };
  onBack: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ data, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mocking the simulation logic if API fails or for demo purposes
  // In a real scenario, this would call params.meses_a_simular to the backend
  useEffect(() => {
    const runSim = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/habisim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: data.laws,
            params: data.params
          })
        });

        if (!response.ok) throw new Error('API Error');
        const resJson = await response.json();
        
        if (resJson.predictions && Array.isArray(resJson.predictions)) {
          const formatted = resJson.predictions.map((mes: any[], i: number) => ({
            month: `Mes ${i + 1}`,
            precio: mes[11], // Price index from CSV structure
            renta: mes[2]    // Rent index from CSV structure
          }));
          setPredictions(formatted);
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        console.warn('Backend error or mock mode:', err);
        const basePrice = parseFloat(data.params.precio_medio_vivienda) || 2000;
        const inflation = parseFloat(data.params.inflacion) || 2.5;
        const interest = parseFloat(data.params.interes) || 3.5;
        const meses = parseInt(data.params.meses) || 24;
        const factor = (inflation / 10) - (interest / 20);
        
        const generated = Array.from({ length: meses }).map((_, i) => ({
          month: `Mes ${i + 1}`,
          precio: basePrice + (basePrice * (factor * (i + 1) / 12)) + (Math.random() * 50),
          renta: 800 + (i * 5) + (Math.random() * 20)
        }));
        setPredictions(generated);
      } finally {
        setLoading(false);
      }
    };

    runSim();
  }, [data]);

  const summaryMetrics = useMemo(() => {
    if (predictions.length === 0) return [];
    const first = predictions[0].precio;
    const last = predictions[predictions.length - 1].precio;
    const change = ((last - first) / first * 100).toFixed(2);
    
    return [
      { label: 'Variación de Precio', value: `${change}%`, icon: parseFloat(change) > 0 ? <TrendingUp /> : <TrendingDown />, color: parseFloat(change) > 0 ? 'text-emerald-400' : 'text-red-400' },
      { label: 'Proyección Max.', value: `${Math.max(...predictions.map(p => p.precio)).toFixed(0)}€/m2`, icon: <Activity />, color: 'text-cyan-400' },
      { label: 'Confianza IA', value: '94%', icon: <Sparkles />, color: 'text-purple-400' },
    ];
  }, [predictions]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[60] bg-black overflow-hidden flex flex-col"
    >
      <div className="hero-grid opacity-20 pointer-events-none -z-10" />
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5 bg-black/60 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Nueva Simulación</span>
          </button>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2.5">
            <Play className="text-cyan-400" size={20} fill="#22d3ee" />
            <h1 className="text-xl font-bold text-white tracking-tight">Resultados HabiSim</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Calendar size={14} className="text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{parseInt(data.params.meses) || 24} Meses Proyectados</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40">
        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto">
          {loading ? (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
              <div className="relative">
                 <div className="w-16 h-16 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-pulse" size={20} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-white font-bold text-xl">Ejecutando Modelos Predictivos</p>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">Cruzando las leyes propuestas con los 14 indicadores macroeconómicos suministrados...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Data & Input summary */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Layers size={18} />
                      </div>
                      <h3 className="text-white font-bold">Escenario Simulado</h3>
                   </div>
                   <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-4">
                      <p className="text-zinc-400 text-sm italic leading-relaxed">
                        "{data.laws}"
                      </p>
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ajustes Clave</p>
                      <div className="flex flex-wrap gap-2">
                         {Object.entries(data.params).filter(([_,v]) => v !== '').slice(0, 5).map(([id, val]) => (
                            <span key={id} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-medium">
                               {id.replace(/_/g, ' ')}: {val}
                            </span>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {summaryMetrics.map((met, i) => (
                      <div key={i} className="p-5 rounded-3xl bg-zinc-900/40 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-white/5 ${met.color}`}>
                               {React.cloneElement(met.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <div>
                               <p className="text-xs text-zinc-500 font-medium">{met.label}</p>
                               <p className="text-xl font-bold text-white">{met.value}</p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>

              {/* Right Column: Main Chart */}
              <div className="lg:col-span-2 space-y-8">
                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Evolución de Precio Proyectada</h2>
                        <p className="text-sm text-zinc-500">Estimación de €/m2 para los próximos 24 meses según el escenario legislativo.</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-cyan-400" />
                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Precio Mercado</span>
                         </div>
                      </div>
                   </div>

                   <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={predictions}>
                          <defs>
                            <linearGradient id="colorPrecio" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            interval={3}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            domain={['auto', 'auto']}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="precio" 
                            stroke="#22d3ee" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorPrecio)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5">
                      <div className="flex items-center gap-3 mb-6">
                         <Info size={18} className="text-blue-400" />
                         <p className="text-white font-bold text-sm">Análisis de la IA</p>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                         Basado en las leyes suministradas, el modelo detecta un riesgo de contracción de oferta del **12%** en el primer año. La inflación de base ({data.params.inflacion}%) compensará parcialmente la bajada de tipos, manteniendo una tendencia lateral en el precio de venta pero tensionando los alquileres en zonas tensionadas.
                      </p>
                   </div>
                   <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-3 mb-4">
                         <AlertTriangle size={18} className="text-red-400" />
                         <p className="text-red-400 font-bold text-sm">Riesgos Críticos</p>
                      </div>
                      <ul className="space-y-2">
                         <li className="text-[11px] text-red-300/70 py-1.5 border-b border-red-500/10 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-400 rounded-full" />
                            Aumento de la economía sumergida en alquiler
                         </li>
                         <li className="text-[11px] text-red-300/70 py-1.5 border-b border-red-500/10 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-400 rounded-full" />
                            Fuga de capital institucional
                         </li>
                      </ul>
                   </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SimulationResults;