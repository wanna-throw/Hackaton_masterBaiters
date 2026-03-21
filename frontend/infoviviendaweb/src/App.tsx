import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Modes from './components/Modes';
import ComoFunciona from './components/ComoFunciona';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-cyan-500/20 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Modes />
        <ComoFunciona />
      </main>
      <Footer />
    </div>
  );
}
