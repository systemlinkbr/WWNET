
import React from 'react';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
    ),
    title: 'Conexão Serial Direta',
    description: 'Conecte sua balança digital diretamente ao navegador via porta serial, sem a necessidade de softwares intermediários.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12c0-5.25-4.25-9.5-9.5-9.5S2.5 6.75 2.5 12s4.25 9.5 9.5 9.5"/><path d="M12 18c3.5 0 6.5-1.5 6.5-3.5S15.5 11 12 11s-6.5 1.5-6.5 3.5 3 3.5 6.5 3.5"/><path d="M12 11V3"/></svg>
    ),
    title: '100% no Navegador',
    description: 'Acesse de qualquer computador com Google Chrome ou Edge. Não há nada para baixar ou instalar.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
    ),
    title: 'Lançamento de Dados',
    description: 'Registre informações essenciais como nome do cliente, produto e observações junto com cada pesagem.',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark">Tudo que você precisa para pesagens simples</h2>
          <p className="text-lg text-secondary mt-4 max-w-2xl mx-auto">
            Foco na simplicidade e eficiência para agilizar seu trabalho diário.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary/10 text-primary w-14 h-14 rounded-full flex items-center justify-center mb-5">
                {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">{feature.title}</h3>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
