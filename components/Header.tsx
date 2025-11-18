
import React from 'react';

const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16-4-4-4 4M12 12V4" />
    <path d="M20 7h-2" />
    <path d="M6 7H4" />
    <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ScaleIcon className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-dark">Balança Web</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Funcionalidades</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">Como Funciona</a>
          <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Preço</a>
          <a href="#faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</a>
        </nav>
        <a href="#pricing" className="bg-primary text-white font-semibold px-5 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-md">
          Comprar Agora
        </a>
      </div>
    </header>
  );
};

export default Header;
