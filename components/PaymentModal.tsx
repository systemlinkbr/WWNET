import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPixPayment, checkPixStatus } from '../services/paymentService';
import { PaymentStatus, PixData, UserInfo } from '../types';

interface PaymentModalProps {
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.FORM);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [formData, setFormData] = useState<UserInfo>({ name: '', email: '', phone: '', cpf: '' });
  const [formErrors, setFormErrors] = useState<Partial<UserInfo>>({});
  const pollingInterval = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);
  
  const validateForm = (): boolean => {
      const errors: Partial<UserInfo> = {};
      if (!formData.name) errors.name = 'Nome é obrigatório';
      if (!formData.email) errors.email = 'E-mail é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'E-mail inválido';
      if (!formData.phone) errors.phone = 'Telefone é obrigatório';
      else if (formData.phone.replace(/\D/g, '').length < 10) errors.phone = 'Telefone inválido';
      if (!formData.cpf) errors.cpf = 'CPF é obrigatório';
      else if (formData.cpf.replace(/\D/g, '').length !== 11) errors.cpf = 'CPF inválido';

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setStatus(PaymentStatus.GENERATING);
    try {
      const data = await createPixPayment(formData);
      setPixData(data);
      setStatus(PaymentStatus.PENDING);
    } catch (error) {
      console.error("Falha ao gerar PIX:", error);
      setStatus(PaymentStatus.ERROR);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'cpf') {
        maskedValue = value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .substring(0, 14);
    } else if (name === 'phone') {
        const cleaned = value.replace(/\D/g, '').substring(0, 11);
        if (cleaned.length <= 10) {
            // Formato (XX) XXXX-XXXX para 10 dígitos ou menos
            maskedValue = cleaned
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            // Formato (XX) XXXXX-XXXX para 11 dígitos
            maskedValue = cleaned
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        }
    }
    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };


  useEffect(() => {
    if (status === PaymentStatus.PENDING && pixData?.paymentId) {
      const paymentId = pixData.paymentId;
      pollingInterval.current = window.setInterval(async () => {
        try {
          const result = await checkPixStatus(paymentId);
          if (result.status === 'SUCCESS') {
            setStatus(PaymentStatus.SUCCESS);
          }
        } catch (err) {
          console.error("Erro ao verificar status do pagamento:", err);
          setStatus(PaymentStatus.ERROR);
        }
      }, 3000); // Consulta o status a cada 3 segundos
    }

    if (status !== PaymentStatus.PENDING) {
        stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [status, pixData, stopPolling]);

  const copyToClipboard = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.copiaECola);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const renderForm = () => (
    <>
      <h3 className="text-2xl font-bold text-center mb-1 text-dark">Finalize sua Compra</h3>
      <p className="text-center text-secondary mb-6">Preencha seus dados para gerar o PIX.</p>
      <form onSubmit={handleGeneratePix} noValidate>
        <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (com DDD)</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="(00) 00000-0000" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>
             <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
            </div>
        </div>
        <button type="submit" className="w-full mt-6 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-lg text-lg">
          Gerar QR Code PIX
        </button>
      </form>
    </>
  );

  const renderContent = () => {
    switch (status) {
      case PaymentStatus.FORM:
        return renderForm();
      case PaymentStatus.GENERATING:
        return (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Gerando seu PIX...</p>
          </div>
        );
      case PaymentStatus.PENDING:
        return pixData && (
          <>
            <h3 className="text-2xl font-bold text-center mb-4 text-dark">Pague com PIX para liberar seu acesso</h3>
            <div className="flex flex-col items-center">
              <img src={pixData.qrCode} alt="PIX QR Code" className="w-56 h-56 rounded-lg bg-white p-2 shadow-md" />
              <p className="mt-4 text-sm text-center text-secondary">Abra o app do seu banco e escaneie o código</p>
            </div>
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">Ou use o PIX Copia e Cola:</label>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  readOnly
                  value={pixData.copiaECola}
                  className="w-full p-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                  aria-label="Código PIX Copia e Cola"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors"
                >
                  {copySuccess ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
            <div className="mt-6 text-center text-secondary">
              <p>Aguardando confirmação do pagamento...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                <div className="bg-primary h-2.5 rounded-full w-full animate-pulse"></div>
              </div>
            </div>
          </>
        );
      case PaymentStatus.SUCCESS:
        return (
          <div className="text-center p-8">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Pagamento Confirmado!</h3>
            <p className="text-secondary">Seu acesso foi liberado! Enviamos um e-mail com sua chave de licença e instruções de acesso. Verifique sua caixa de entrada e spam.</p>
            <button
              onClick={onClose}
              className="mt-6 bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Fechar
            </button>
          </div>
        );
      case PaymentStatus.ERROR:
        return (
           <div className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-12 h-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Ocorreu um erro</h3>
            <p className="text-secondary">Não foi possível processar seu pagamento. Por favor, feche e tente novamente.</p>
            <button
              onClick={onClose}
              className="mt-6 bg-secondary text-white font-semibold px-6 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Fechar
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-light rounded-xl shadow-2xl w-full max-w-md relative p-6 md:p-8">
        {status !== PaymentStatus.GENERATING && (
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Fechar modal"
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentModal;
