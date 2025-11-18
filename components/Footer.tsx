
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Balança Web Simples. Todos os direitos reservados.</p>
        <p className="text-sm text-gray-400 mt-2">Uma solução inovadora da StartApp Soluções Digitais.</p>
      </div>
    </footer>
  );
};

export default Footer;
