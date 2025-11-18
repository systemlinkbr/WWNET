import { PixData, UserInfo } from '../types';

// A URL base do seu backend. Usar um caminho relativo assume que o backend
// está sendo servido no mesmo domínio que o frontend (via proxy).
const API_BASE_URL = '';

/**
 * **REAL: Criar o Pagamento via Backend**
 *
 * Esta função se comunica com o seu backend para criar um pagamento PIX de forma segura.
 */
export const createPixPayment = async (userData: UserInfo): Promise<PixData> => {
  console.log("FRONTEND: Enviando dados do cliente para o backend...", userData);

  const response = await fetch(`${API_BASE_URL}/create-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido ao criar pagamento.' }));
    throw new Error(errorData.error || 'Falha ao criar o pagamento PIX.');
  }

  const data: PixData = await response.json();
  console.log("FRONTEND: Dados do PIX recebidos do backend:", data);
  return data;
};


/**
 * **REAL: Verificar Status do Pagamento via Backend**
 *
 * Esta função consulta o seu backend para saber o status de um pagamento.
 */
export const checkPixStatus = async (paymentId: string): Promise<{ status: 'PENDING' | 'SUCCESS' }> => {
  console.log(`FRONTEND: Consultando status para o pagamento ${paymentId}...`);
  
  const response = await fetch(`${API_BASE_URL}/payment-status/${paymentId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido ao verificar status.' }));
    throw new Error(errorData.error || `Falha ao verificar status do pagamento.`);
  }

  const data = await response.json();
  console.log(`FRONTEND: Status recebido do backend: ${data.status}`);
  return data;
};