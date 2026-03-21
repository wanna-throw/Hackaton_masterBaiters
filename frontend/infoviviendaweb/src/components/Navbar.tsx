import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const simSubLinks = [
  { label: 'Sim de Leyes', mode: 'habisim' as const },
  { label: 'Sim de Hipoteca/Alquiler', mode: 'hipotsim' as const },
];

const navLinks = [
  { label: 'Estadísticas', href: '#modes' },
  { label: 'Comparador', href: '#modes' },
  { label: '¿Cómo funciona?', href: '#como-funciona' },
];

interface NavbarProps {
  onOpenSimulador: (mode: 'habisim' | 'hipotsim') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenSimulador }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [simMobileOpen, setSimMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSimOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 ml-[150px]">
            <a href="#">
              <img
                src="/img/LOGOINFOVIVIENDA.png"
                alt="InfoVivienda"
                className="h-15"
              />
            </a>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10 ml-auto mr-[50px]">
            {/* Simuladores dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSimOpen(!simOpen)}
                className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-300 nav-link cursor-pointer"
              >
                Simuladores
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${simOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {simOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
                  >
                    {simSubLinks.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => { setSimOpen(false); onOpenSimulador(sub.mode); }}
                        className="block w-full text-left px-5 py-3.5 text-sm text-zinc-400 hover:text-cyan-300 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other links */}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-300 nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 pt-2 pb-8 space-y-1">
              {/* Simuladores accordion */}
              <button
                onClick={() => setSimMobileOpen(!simMobileOpen)}
                className="flex items-center justify-between w-full px-4 py-4 text-base font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Simuladores
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${simMobileOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {simMobileOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {simSubLinks.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => { setIsOpen(false); setSimMobileOpen(false); onOpenSimulador(sub.mode); }}
                        className="block w-full text-left pl-8 pr-4 py-3 text-sm font-medium text-zinc-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Other links */}
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-4 text-base font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
