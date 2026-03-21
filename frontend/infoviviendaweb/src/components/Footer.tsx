import React from 'react';

const creators = [
  { name: 'Arnau Sole de la Cruz', role: 'Front/Back/App Architecture', link: 'https://www.linkedin.com/in/arnau-sole-de-la-cruz/' },
  { name: 'Dario Alexander Plesa Plesa', role: 'AI Model training/AI integration/Backend', link: 'https://www.linkedin.com/in/dario-alexander-plesa-76b101329/' },
  { name: 'Brenda Puig Pulido', role: 'Backend/Backend structure/Functionalities', link: 'https://www.linkedin.com/' },
  { name: 'Sergi Molina Sánchez', role: 'Data collection/AI training/Data architecture', link: 'https://www.linkedin.com/in/sergi-molina-s%C3%A0nchez-893161245/' },
];

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <img
              src="/img/LOGOINFOVIVIENDA.png"
              alt="InfoVivienda"
              className="h-9 mb-6 opacity-80"
            />
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Democratizando el acceso a la información inmobiliaria y legislativa mediante Inteligencia Artificial avanzada.
            </p>
          </div>

          {/* Creators Section */}
          <div className="md:col-span-1 lg:col-span-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Creadores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {creators.map((creator) => (
                <a
                  key={creator.name}
                  href={creator.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-0.5"
                >
                  <span className="text-zinc-300 text-[14px] group-hover:text-cyan-400 transition-colors duration-300">
                    {creator.name}
                  </span>
                  <span className="text-zinc-600 text-[11px] group-hover:text-zinc-500 transition-colors duration-300">
                    {creator.role}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="text-zinc-600 text-xs tracking-tight">
              © 2026 InfoVivienda — Hackathon Project MasterBaiters
            </p>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-xs text-zinc-600 hover:text-white transition-colors duration-300"
            >
              Términos de uso
            </a>
            <a
              href="#"
              className="text-xs text-zinc-600 hover:text-white transition-colors duration-300"
            >
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
