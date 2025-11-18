
import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Conecte sua Balança',
    description: 'Plugue sua balança na porta serial/USB do computador e clique em "Conectar" no nosso sistema. Autorize o acesso no navegador e pronto!',
  },
  {
    number: '02',
    title: 'Realize a Pesagem',
    description: 'Coloque o item na balança. O peso será capturado automaticamente pelo sistema em tempo real.',
  },
  {
    number: '03',
    title: 'Lance os Dados',
    description: 'Preencha as informações do cliente e do produto. Salve ou exporte os dados da pesagem com um clique.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark">Comece a usar em 3 passos simples</h2>
          <p className="text-lg text-secondary mt-4 max-w-2xl mx-auto">
            Nosso processo é desenhado para ser intuitivo e direto ao ponto.
          </p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center bg-white p-6">
                 <div className="relative inline-block mb-4">
                  <span className="text-5xl font-extrabold text-primary/20">{step.number}</span>
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-2xl font-bold">{step.number}</span>
                 </div>
                <h3 className="text-xl font-semibold text-dark mb-3">{step.title}</h3>
                <p className="text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
