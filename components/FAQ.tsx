
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h4 className="text-lg font-medium text-dark">{question}</h4>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 text-secondary">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'Quais balanças são compatíveis?',
      answer: 'Nosso software é compatível com a maioria das balanças que possuem saída de dados via porta serial (RS-232) ou emuladores de porta serial via USB. Marcas como Toledo, Filizola, Urano, entre outras, geralmente funcionam bem.',
    },
    {
      question: 'Preciso instalar algum driver?',
      answer: 'Na maioria dos casos, não. Sistemas operacionais modernos (Windows, macOS, Linux) costumam reconhecer os adaptadores USB-Serial automaticamente. O acesso é feito pela API Web Serial, nativa em navegadores como Google Chrome e Microsoft Edge.',
    },
    {
      question: 'O pagamento é seguro?',
      answer: 'Sim. O pagamento é processado através de um gateway de pagamentos seguro que gera um QR Code PIX. Não armazenamos nenhuma informação do seu pagamento.',
    },
    {
      question: 'Como recebo o acesso após o pagamento?',
      answer: 'Após a confirmação do pagamento PIX, você receberá um link de acesso e uma chave de licença vitalícia no e-mail informado durante a compra. O acesso é imediato.',
    },
    {
      question: 'Posso usar em mais de um computador?',
      answer: 'Sim, sua licença é vinculada ao seu e-mail. Você pode acessar o software de qualquer computador que tenha um navegador compatível, basta fazer login.',
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark">Dúvidas Frequentes</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
