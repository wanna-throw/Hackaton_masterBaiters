import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  ArrowLeft,
  TrendingDown, 
  TrendingUp, 
  Euro, 
  Waves, 
  Home, 
  Key, 
  Scaling, 
  Users, 
  Briefcase, 
  LineChart as LineChartIcon,
  Percent,
  Warehouse,
  Construction,
  ChevronDown,
  AlertTriangle,
  Calendar,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardProps {
  onBack: () => void;
}

const statsConfig = [
  // Económicas
  { id: 'inflacion', label: 'Inflación', icon: <TrendingUp size={18} />, unit: '%', category: 'economicas' },
  { id: 'interes', label: 'Interés', icon: <Percent size={18} />, unit: '%', category: 'economicas' },
  { id: 'sueldo_medio', label: 'Sueldo Medio', icon: <Briefcase size={18} />, unit: '€', category: 'economicas' },
  { id: 'pib_per_capita', label: 'PIB per Cápita', icon: <Scaling size={18} />, unit: '€', category: 'economicas' },
  
  // Vivienda (Variables)
  { id: 'viviendas_venta', label: 'Viviendas en Venta', icon: <Warehouse size={18} />, unit: '', category: 'vivienda_vars' },
  { id: 'viviendas_vacias', label: 'Viviendas Vacías', icon: <Warehouse size={18} />, unit: '', category: 'vivienda_vars' },
  { id: 'pct_alquiler', label: 'Porcentaje Alquiler', icon: <Percent size={18} />, unit: '%', category: 'vivienda_vars' },
  { id: 'nuevas_construcciones', label: 'Nuevas Construcciones', icon: <Construction size={18} />, unit: '', category: 'vivienda_vars' },

  // Vivienda (Precios)
  { id: 'precio_medio_vivienda', label: 'Precio Medio Vivienda', icon: <Euro size={18} />, unit: '€/m2', category: 'vivienda_precios' },
  { id: 'alquiler_medio', label: 'Alquiler Medio', icon: <Home size={18} />, unit: '€', category: 'vivienda_precios' },
  { id: 'min_renta_hipoteca', label: 'Min. Renta Hipoteca', icon: <Key size={18} />, unit: '€', category: 'vivienda_precios' },
  { id: 'ratio_comprador_vivienda', label: 'Ratio Comprador/Vivienda', icon: <Users size={18} />, unit: '', category: 'vivienda_precios' },

  // Sociedad
  { id: 'cambio_poblacional', label: 'Cambio Poblacional', icon: <Users size={18} />, unit: '%', category: 'sociedad' },
  { id: 'indice_catastrofes', label: 'Índice Catástrofes', icon: <Waves size={18} />, unit: '/10', category: 'sociedad' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-lg shadow-xl">
        <p className="text-zinc-500 text-[10px] mb-1">{label}</p>
        <p className="text-cyan-400 font-bold text-sm">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const AnomalyAnalysis = ({ rawPoints }: { rawPoints: any[] }) => {
  const anomalies = [];

  // 1. Detect 2008 Crash (Construction drop)
  const crisis2008 = rawPoints.find(p => p.year?.toString().startsWith('2008-05') && p.nuevas_construcciones < 10000);
  if (crisis2008) {
    anomalies.push({
      year: '2008',
      title: 'Crisis Inmobiliaria',
      desc: 'Colapso súbito del 85% en nuevas construcciones. Los tipos de interés bajaron drásticamente para intentar reactivar el consumo.',
      severity: 'high',
      icon: <TrendingDown className="text-red-500" />
    });
  }

  // 2. Detect COVID-19 (Catastrophe index spike)
  const covid = rawPoints.find(p => p.indice_catastrofes > 0.5);
  if (covid) {
    anomalies.push({
      year: '2020',
      title: 'Shock Pandemia',
      desc: 'Salto anómalo en el índice de catástrofes. Paralización temporal del mercado y estabilización atípica de precios.',
      severity: 'medium',
      icon: <Zap className="text-yellow-500" />
    });
  }

  // 3. Detect Inflation Spike 2022
  const inflationSpike = rawPoints.find(p => p.inflacion > 0.08);
  if (inflationSpike) {
    anomalies.push({
      year: '2022',
      title: 'Crisis Inflacionaria',
      desc: 'La inflación superó el 8% (máximo histórico del set). Fuerte pérdida de poder adquisitivo frente al precio de vivienda.',
      severity: 'high',
      icon: <TrendingUp className="text-orange-500" />
    });
  }

  if (anomalies.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-cyan-400" size={24} />
        <h2 className="text-2xl font-bold text-white tracking-tight">Detección de Anomalías Históricas</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {anomalies.map((anno, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border ${anno.severity === 'high' ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/20 bg-amber-500/5'} backdrop-blur-md hover:border-white/10 transition-colors duration-500`}
          >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <Calendar size={14} />
                  {anno.year}
               </div>
               {anno.icon}
            </div>
            <h4 className="text-white font-bold mb-2">{anno.title}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{anno.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface CollapsibleProps {
  title: string;
  icon: React.ReactNode;
  items: any[];
}

const CollapsibleSection: React.FC<CollapsibleProps> = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-white/5 rounded-3xl overflow-hidden bg-zinc-900/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 lg:p-8 hover:bg-white/5 transition-colors duration-300 cursor-pointer text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400">
            {icon}
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">{title}</h2>
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-zinc-500 font-bold uppercase tracking-widest">
            {items.length} KPIs
          </span>
        </div>
        <ChevronDown 
          size={24} 
           className={`text-zinc-500 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="p-6 lg:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((stat, idx) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-zinc-900/40 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-800 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-500">
                        {stat.icon}
                      </div>
                      <div>
                        <h4 className="text-zinc-300 text-sm font-medium leading-none mb-1">{stat.label}</h4>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Histórico</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-32 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stat.data}>
                        <defs>
                          <linearGradient id={`gradient-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey="year" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip 
                          content={<CustomTooltip />} 
                          cursor={{ stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#22d3ee"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill={`url(#gradient-${stat.id})`}
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Valor actual</span>
                        <span className="text-xl font-bold text-white tracking-tight">
                          {stat.data.length > 0 ? stat.data[stat.data.length - 1].value.toLocaleString() : 'N/A'}{stat.unit}
                        </span>
                     </div>
                     <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${stat.uptrend ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                        {stat.uptrend ? '+' : '-'}{stat.pctChange || '0.0'}%
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [rawPoints, setRawPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch('/datos.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data as any[];
            setRawPoints(parsedData);
            
            const mapped = statsConfig.map(stat => {
              const historicalData = parsedData.map(row => {
                let val = row[stat.id] || 0;
                // If the unit is %, multiply by 100 as the CSV has decimals
                if (stat.unit === '%') val = val * 100;
                // Multiply catastrophe index by 10 to get a 1-10 scale
                if (stat.id === 'indice_catastrofes') val = val * 10;
                return {
                  year: row.year?.toString() || 'Unknown',
                  value: val
                };
              });

              const last = historicalData[historicalData.length - 1]?.value || 0;
              const prev = historicalData[historicalData.length - 2]?.value || 0;
              const pctChange = prev !== 0 ? ((last - prev) / prev * 100).toFixed(1) : '0.0';

              return {
                ...stat,
                data: historicalData,
                uptrend: last >= prev,
                pctChange: Math.abs(parseFloat(pctChange))
              };
            });

            setDashboardData(mapped);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching/parsing CSV:', error);
        setLoading(false);
      }
    };

    fetchCSV();
  }, []);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col"
    >
      {/* Background */}
      <div className="hero-grid opacity-20 pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5 bg-black/60 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="text-sm font-medium">Volver al mapa</span>
          </button>
          
          <div className="h-4 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-2.5">
            <LineChartIcon className="text-cyan-400" size={22} />
            <h1 className="text-xl font-bold text-white tracking-tight">Dashboard Estadístico</h1>
            <span className="text-xs text-zinc-500 hidden sm:inline px-2 py-0.5 rounded-full border border-white/5 ml-2">Análisis de Anomalías Activo</span>
          </div>
        </div>
      </header>

      {/* Main Content scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar bg-black/40">
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
          {loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-zinc-500 font-medium">Escaneando datos históricos...</p>
            </div>
          ) : (
            <>
              {/* Anomalies Section */}
              <AnomalyAnalysis rawPoints={rawPoints} />

              {/* Grouped Sections */}
              <div className="space-y-8 pb-12">
                {[
                  { id: 'economicas', label: 'Variables Económicas', icon: <Briefcase size={20} /> },
                  { id: 'vivienda_vars', label: 'Variables de Vivienda', icon: <Warehouse size={20} /> },
                  { id: 'vivienda_precios', label: 'Precios de Vivienda', icon: <Euro size={20} /> },
                  { id: 'sociedad', label: 'Sociedad', icon: <Users size={20} /> },
                ].map((section) => (
                  <CollapsibleSection
                    key={section.id}
                    title={section.label}
                    icon={section.icon}
                    items={dashboardData.filter(d => d.category === section.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
