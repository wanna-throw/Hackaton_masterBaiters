import React from 'react';
import { motion } from 'motion/react';
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

// Mock data generation for 2018-2025
const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
const generateData = (min: number, max: number, trend: 'up' | 'down' | 'volatile') => {
  let val = min + (max - min) / 2;
  return years.map((year) => {
    const change = (Math.random() - 0.5) * (max - min) * 0.2;
    const trendEffect = trend === 'up' ? 0.05 : trend === 'down' ? -0.05 : 0;
    val = Math.max(min, Math.min(max, val + change + (max - min) * trendEffect));
    return { year, value: Math.round(val * 100) / 100 };
  });
};

const statsConfig = [
  { id: 'min_renta_hipoteca', label: 'Min. Renta Hipoteca', icon: <Key size={18} />, unit: '€', trend: 'up', min: 800, max: 1500 },
  { id: 'interes', label: 'Interés', icon: <Percent size={18} />, unit: '%', trend: 'up', min: 0.5, max: 4.5 },
  { id: 'alquiler_medio', label: 'Alquiler Medio', icon: <Home size={18} />, unit: '€', trend: 'up', min: 600, max: 1200 },
  { id: 'inflacion', label: 'Inflación', icon: <TrendingUp size={18} />, unit: '%', trend: 'up', min: 1, max: 10 },
  { id: 'cambio_poblacional', label: 'Cambio Poblacional', icon: <Users size={18} />, unit: '%', trend: 'up', min: -0.5, max: 1.5 },
  { id: 'sueldo_medio', label: 'Sueldo Medio', icon: <Briefcase size={18} />, unit: '€', trend: 'up', min: 1800, max: 2500 },
  { id: 'pib_per_capita', label: 'PIB per Cápita', icon: <Scaling size={18} />, unit: '€', trend: 'up', min: 25000, max: 32000 },
  { id: 'viviendas_venta', label: 'Viviendas en Venta', icon: <Warehouse size={18} />, unit: '', trend: 'down', min: 100000, max: 500000 },
  { id: 'pct_alquiler', label: 'Porcentaje Alquiler', icon: <Percent size={18} />, unit: '%', trend: 'up', min: 20, max: 30 },
  { id: 'viviendas_vacias', label: 'Viviendas Vacías', icon: <Warehouse size={18} />, unit: '', trend: 'down', min: 1000000, max: 3500000 },
  { id: 'nuevas_construcciones', label: 'Nuevas Construcciones', icon: <Construction size={18} />, unit: '', trend: 'up', min: 50000, max: 150000 },
  { id: 'precio_medio_vivienda', label: 'Precio Medio Vivienda', icon: <Euro size={18} />, unit: '€/m2', trend: 'up', min: 1500, max: 2800 },
  { id: 'indice_catastrofes', label: 'Índice Catástrofes', icon: <Waves size={18} />, unit: '/10', trend: 'volatile', min: 1, max: 8 },
  { id: 'ratio_comprador_vivienda', label: 'Ratio Comprador/Vivienda', icon: <Users size={18} />, unit: '', trend: 'up', min: 1.5, max: 4.5 },
];

const dashboardData = statsConfig.map((stat) => ({
  ...stat,
  data: generateData(stat.min, stat.max, stat.trend as any),
}));

interface DashboardProps {
  onBack: () => void;
}

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

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col"
    >
      {/* Background */}
      <div className="hero-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] -z-10" />

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
            <span className="text-xs text-zinc-500 hidden sm:inline px-2 py-0.5 rounded-full border border-white/5 ml-2">Datos en tiempo real (Simulados)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Future filters can go here */}
        </div>
      </header>

      {/* Main Content scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40">
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
          {/* Summary Banner */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-zinc-500 text-sm mb-1">Tendencia de Precios</p>
              <h3 className="text-2xl font-bold text-white mb-2">+8.4% anual</h3>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <TrendingUp size={14} />
                <span>Máximo histórico</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-zinc-500 text-sm mb-1">Stock de Vivienda</p>
              <h3 className="text-2xl font-bold text-white mb-2">-15.2% stock</h3>
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold">
                <TrendingDown size={14} />
                <span>Escala de escasez</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-500/10 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-zinc-500 text-sm mb-1">Interés Euribor (Mock)</p>
              <h3 className="text-2xl font-bold text-white mb-2">3.85%</h3>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold">
                <TrendingUp size={14} />
                <span>Estabilización detectada</span>
              </div>
            </div>
          </div>

          {/* Grid of Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardData.map((stat, idx) => (
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
                      <XAxis 
                        dataKey="year" 
                        hide 
                      />
                      <YAxis 
                        hide 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                      />
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
                        {stat.data[stat.data.length - 1].value.toLocaleString()}{stat.unit}
                      </span>
                   </div>
                   <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                      {stat.trend === 'up' ? '+' : '-'}{(Math.random() * 5 + 1).toFixed(1)}%
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
