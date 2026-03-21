const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/img/LOGOINFOVIVIENDA.png"
              alt="InfoVivienda"
              className="h-7 opacity-60"
            />
            <span className="text-zinc-600">|</span>
            <p className="text-zinc-500 text-sm">
              © 2026 InfoVivienda — Hackathon Project
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-zinc-500 hover:text-white transition-colors duration-300"
            >
              Términos de uso
            </a>
            <a
              href="#"
              className="text-sm text-zinc-500 hover:text-white transition-colors duration-300"
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
