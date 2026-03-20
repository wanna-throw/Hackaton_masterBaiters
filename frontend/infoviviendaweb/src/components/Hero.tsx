import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Hero = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log('Searching for:', query);
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background effects */}
      <div className="hero-grid" />
      <div className="hero-glow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-pulse-line" />
      <div
        className="hero-glow bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 animate-pulse-line"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-line" />
      <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-line" />
      <div className="absolute left-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse-line" />
      <div className="absolute right-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse-line" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 lg:px-8 text-center pt-24 pb-12 flex flex-col items-center gap-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.15]"
        >
          Tu asistente inteligente para la{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
              vivienda
            </span>
            <svg
              className="absolute -bottom-3 left-0 w-full h-3 text-cyan-400/40"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,6 Q50,0 100,6 T200,6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </span>{' '}
          y{' '}
          <span className="text-white/80">legislación</span>
        </motion.h1>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="w-full max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-zinc-900/80 border border-white/10 rounded-3xl p-4 backdrop-blur-xl focus-within:border-cyan-500/40 transition-all duration-500">
              <div className="pl-6 text-zinc-500">
                <Search size={28} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe lo que buscas, ej: ¿Cómo me afecta la nueva ley de alquileres?"
                className="w-full py-7 px-5 text-lg sm:text-xl text-white placeholder:text-zinc-600 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-5 rounded-2xl hover:brightness-110 transition-all duration-300 hover:scale-105"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
