// AurisAI — Vercel Serverless Function
// Redireciona para WhatsApp sem expor o número no HTML

const MESSAGES = {
  lista:  'Olá! Tenho interesse no AurisAI para minha clínica de audiologia. Gostaria de saber mais.',
  demo:   'Olá! Gostaria de agendar uma demonstração do AurisAI para minha clínica.',
  piloto: 'Olá! Quero ser uma clínica piloto do AurisAI. Pode me contar mais?',
  rede:   'Olá! Tenho uma rede de clínicas e quero conhecer o plano Rede do AurisAI.',
  email:  null,
};

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PHONE = process.env.WA_PHONE;
  if (!PHONE) {
    return res.status(500).json({ error: 'Configuração ausente' });
  }

  const tipo  = req.query.tipo  || 'lista';
  const email = req.query.email || '';

  if (!MESSAGES.hasOwnProperty(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }

  let message = MESSAGES[tipo];

  if (tipo === 'email' && email) {
    const safeEmail = email.replace(/[^a-zA-Z0-9@._+-]/g, '').slice(0, 100);
    message = 'Olá! Tenho interesse no AurisAI. Meu e-mail: ' + safeEmail;
  }

  if (!message) {
    return res.status(400).json({ error: 'Mensagem inválida' });
  }

  const waUrl = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message);

  res.setHeader('Cache-Control', 'no-store');
  res.redirect(302, waUrl);
};
