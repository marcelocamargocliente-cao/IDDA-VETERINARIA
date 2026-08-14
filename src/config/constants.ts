// Constantes da Clínica IDDA Veterinária
export const CLINIC_CONFIG = {
  name: 'IDDA Veterinária',
  fullName: 'IDDA — Instituto de Diagnóstico e Atendimento Veterinário',
  tagline: 'Cuidado, Diagnóstico Preciso & Saúde Animal com Amor',
  
  // Telefones
  phone: {
    whatsapp: '5521986260484',              // Sem formatação para API do WhatsApp
    whatsappFormatted: '(21) 98626-0484',     // Com formatação para exibição
    contact: '(21) 99857-0710',             // Telefone de contato / chamadas
    contactClean: '21998570710',            // Sem formatação para tel:
  },

  // URLs utilitárias
  whatsappUrl: (message = 'Olá! Gostaria de mais informações sobre os serviços da IDDA Veterinária.') => 
    `https://wa.me/5521986260484?text=${encodeURIComponent(message)}`,

  // Endereço
  address: {
    street: 'Estrada do Tutóia, 520, Loja 2',
    neighborhood: 'Cosmos',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    cep: '23060-275',
    full: 'Estrada do Tutóia, 520, Loja 2 - Cosmos, Rio de Janeiro - RJ, CEP: 23060-275',
    mapsUrl: 'https://maps.google.com/?q=Estrada+do+Tutóia,+520,+Cosmos,+Rio+de+Janeiro+-+RJ,+23060-275',
  },

  // Redes Sociais & Links
  social: {
    instagram: '@iddaveterinaria',
    instagramUrl: 'https://instagram.com/iddaveterinaria',
    facebook: 'IDDA Veterinária',
  },

  // Horários de Atendimento
  hours: 'Atendimento Veterinário e Procedimentos Agendados',
  hoursDetail: 'Consultas clínicas, exames laboratoriais, raio-x, ultrassom e cirurgias com hora marcada.',

  // Admin Config
  admin: {
    email: 'iddaveterinaria@gmail.com',
  },
};

export default CLINIC_CONFIG;
