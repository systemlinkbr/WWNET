import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-dark leading-tight mb-4">
          Pesagem Simples e Rápida, <br className="hidden md:block" />
          Direto do seu Navegador.
        </h1>
        <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto mb-8">
          Conecte sua balança, registre seus dados e otimize seu tempo. Sem instalações, sem complicações. Acesso vitalício por um pagamento único.
        </p>
        <div className="flex justify-center items-center gap-4">
          <a href="#pricing" className="bg-primary text-white font-bold px-8 py-4 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-lg text-lg">
            Adquirir por R$ 5,00
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;