import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);


const Pricing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchase = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="pricing" className="py-20 bg-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">Acesso Simples, Preço Único</h2>
            <p className="text-lg text-secondary mb-8">Sem mensalidades ou taxas escondidas. Pague uma vez, use para sempre.</p>
            <div className="mb-8">
              <span className="text-5xl md:text-6xl font-extrabold text-dark">R$ 5,00</span>
              <span className="text-secondary ml-2">/ pagamento único</span>
            </div>
            <ul className="text-left max-w-sm mx-auto space-y-3 mb-10">
              <li className="flex items-center">
                <CheckIcon className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-secondary">Acesso vitalício ao software</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-secondary">Conexão com balanças seriais</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-secondary">Lançamento de dados básicos</span>
              </li>
               <li className="flex items-center">
                <CheckIcon className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-secondary">Suporte via e-mail</span>
              </li>
            </ul>
            <button
              onClick={handlePurchase}
              className="w-full max-w-sm mx-auto bg-primary text-white font-bold px-8 py-4 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-lg text-lg"
            >
              Comprar Agora via PIX
            </button>
          </div>
        </div>
      </section>
      {isModalOpen && <PaymentModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Pricing;