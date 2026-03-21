import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Modes from './components/Modes';
import ComoFunciona from './components/ComoFunciona';
import Footer from './components/Footer';
import Simulador from './components/Simulador';
import Dashboard from './components/Dashboard';
import SimulationResults from './components/SimulationResults';
import Comparador from './components/Comparador';

export default function App() {
  const [showSimulador, setShowSimulador] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSimulationResults, setShowSimulationResults] = useState(false);
  const [showComparador, setShowComparador] = useState(false);
  const [simMode, setSimMode] = useState<'habisim' | 'hipotsim'>('habisim');
  const [simulationData, setSimulationData] = useState<{ laws: string, params: any } | null>(null);

  const openSimulador = (mode: 'habisim' | 'hipotsim' = 'habisim') => {
    setSimMode(mode);
    setShowSimulador(true);
  };

  const openDashboard = () => {
    setShowDashboard(true);
  };

  const openComparador = () => {
    setShowComparador(true);
  };

  const handleStartSimulation = (laws: string, params: any) => {
    setSimulationData({ laws, params });
    setShowSimulador(false);
    setShowSimulationResults(true);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-cyan-500/20 selection:text-white">
      <Navbar 
        onOpenSimulador={openSimulador} 
        onOpenDashboard={openDashboard} 
        onOpenComparador={openComparador}
      />
      <main>
        <Hero 
          onOpenSimulador={openSimulador} 
          onOpenDashboard={openDashboard}
        />
        <Modes 
          onOpenSimulador={openSimulador} 
          onOpenDashboard={openDashboard}
          onOpenComparador={openComparador}
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
            onSimulate={handleStartSimulation}
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

      {/* Simulation Results Overlay */}
      <AnimatePresence>
        {showSimulationResults && simulationData && (
          <SimulationResults 
            data={simulationData}
            onBack={() => setShowSimulationResults(false)}
          />
        )}
      </AnimatePresence>

      {/* Global Comparador Overlay */}
      <AnimatePresence>
        {showComparador && (
          <Comparador 
            onBack={() => setShowComparador(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
