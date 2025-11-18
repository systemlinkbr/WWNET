// server.js

// ** 1. IMPORTAÇÃO DAS DEPENDÊNCIAS **
require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 

// ** 2. CONFIGURAÇÃO INICIAL **
const app = express();
const port = 4000;

// ** 3. CONFIGURAÇÃO DO GATEWAY DE PAGAMENTO (Abacate Pay) **
const abacatePayApiKey = process.env.ABACATE_PAY_API_KEY;
if (!abacatePayApiKey) {
  console.error("ERRO: A variável de ambiente ABACATE_PAY_API_KEY não foi definida.");
  console.log("Crie um arquivo .env na pasta 'backend' e adicione: ABACATE_PAY_API_KEY=SUA_CHAVE_AQUI");
  process.exit(1);
}

// ** 4. MIDDLEWARES **
app.use(cors()); 
app.use(express.json()); 

// ** 5. DEFINIÇÃO DAS ROTAS (ENDPOINTS) DA API **

// Rota para CRIAR um pagamento
app.post('/create-payment', async (req, res) => {
  try {
    const { name, email, cpf, phone } = req.body;
    console.log("BACKEND: Recebida requisição para criar pagamento com dados:", req.body);
    
    // Validação simples dos dados recebidos
    if (!name || !email || !cpf || !phone) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // APIs de pagamento geralmente esperam dados não formatados (apenas números)
    const cleanCpf = cpf.replace(/\D/g, '');
    const cleanPhone = phone.replace(/\D/g, '');


    // --- CHAMADA REAL PARA A API ABACATE PAY ---
    const abacateApiUrl = 'https://api.abacatepay.com/v1/pixQrCode/create';
    const payload = {
        amount: 500, // R$ 5,00 em centavos
        expiresIn: 3600, // Expira em 1 hora
        description: 'Acesso Vitalício - Balança Web Simples',
        customer: {
            name: name,
            cellphone: cleanPhone,
            email: email,
            taxId: cleanCpf
        },
        metadata: {
            externalId: `balanca-web-${Date.now()}`
        }
    };

    const abacatePayResponse = await fetch(abacateApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacatePayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!abacatePayResponse.ok) {
      const errorBody = await abacatePayResponse.text();
      console.error("Erro da API Abacate Pay:", errorBody);
      throw new Error(`Falha na comunicação com a Abacate Pay: ${abacatePayResponse.statusText}`);
    }
    
    // Assumindo que a resposta da API tem a seguinte estrutura:
    // { "id": "...", "qrCodeImageBase64": "...", "qrCodeCopyPaste": "..." }
    const paymentData = await abacatePayResponse.json();
    console.log("BACKEND: Pagamento PIX criado com sucesso:", paymentData.id);

    // Envia de volta para o frontend os dados necessários para exibir o PIX
    res.status(201).json({
      paymentId: paymentData.id,
      qrCode: `data:image/png;base64,${paymentData.qrCodeImageBase64}`,
      copiaECola: paymentData.qrCodeCopyPaste
    });

  } catch (error) {
    console.error("BACKEND: Erro ao criar PIX:", error);
    res.status(500).json({ error: 'Erro ao gerar o PIX.', details: error.message });
  }
});

// Rota para VERIFICAR o status de um pagamento
app.get('/payment-status/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    console.log(`BACKEND: Verificando status do pagamento ${paymentId}...`);

    // --- CHAMADA REAL PARA A API ABACATE PAY ---
    // Este endpoint é uma suposição, você deve ajustá-lo para o endpoint real da Abacate Pay
    const abacateApiUrl = `https://api.abacatepay.com/v1/pixQrCode/status/${paymentId}`;
    
    const apiResponse = await fetch(abacateApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${abacatePayApiKey}`,
      }
    });

    if (apiResponse.status === 404) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    if (!apiResponse.ok) {
      throw new Error(`Erro ao consultar status na Abacate Pay: ${apiResponse.statusText}`);
    }
    
    // Assumindo que a resposta da API tem a estrutura: { "id": "...", "status": "paid" | "pending" }
    const statusData = await apiResponse.json();
    
    let finalStatus = 'PENDING';
    // O frontend espera 'SUCCESS' para confirmar o pagamento
    if (statusData.status === 'paid' || statusData.status === 'approved') {
        finalStatus = 'SUCCESS';
    }
    
    console.log(`BACKEND: Status atual para ${paymentId}: ${finalStatus}`);
    res.json({ status: finalStatus });

  } catch (error) {
    console.error(`BACKEND: Erro ao verificar status do pagamento ${req.params.id}:`, error.message);
    res.status(500).json({ error: 'Erro ao verificar o status do pagamento.' });
  }
});


// ** 6. INICIALIZAÇÃO DO SERVIDOR **
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
