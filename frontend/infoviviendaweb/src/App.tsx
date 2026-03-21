import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Modes from './components/Modes';
import ComoFunciona from './components/ComoFunciona';
import Footer from './components/Footer';
import Simulador from './components/Simulador';
import Dashboard from './components/Dashboard';

export default function App() {
  const [showSimulador, setShowSimulador] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [simMode, setSimMode] = useState<'habisim' | 'hipotsim'>('habisim');

  const openSimulador = (mode: 'habisim' | 'hipotsim' = 'habisim') => {
    setSimMode(mode);
    setShowSimulador(true);
  };

  const openDashboard = () => {
    setShowDashboard(true);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-cyan-500/20 selection:text-white">
      <Navbar onOpenSimulador={openSimulador} onOpenDashboard={openDashboard} />
      <main>
        <Hero 
          onOpenSimulador={openSimulador} 
          onOpenDashboard={openDashboard}
        />
        <Modes 
          onOpenSimulador={openSimulador} 
          onOpenDashboard={openDashboard}
        />
        <ComoFunciona />
      </main>
      <Footer />

      {/* Global Simulador overlay */}
      <AnimatePresence>
        {showSimulador && (
          <Simulador
            initialMode={simMode}
            onBack={() => setShowSimulador(false)}
          />
        )}
      </AnimatePresence>

      {/* Global Dashboard overlay */}
      <AnimatePresence>
        {showDashboard && (
          <Dashboard
            onBack={() => setShowDashboard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
