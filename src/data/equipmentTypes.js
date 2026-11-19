export const EQUIPMENT_TYPES = [
  {
    id: 'caixa_ventilacao',
    name: 'Caixa de Ventilação / Ar Externo',
    shortName: 'Caixa de Ventilação',
    tagPrefix: 'VAE',
    description: 'Caixa com gabinete acústico/térmico, plenum, ventilador e estágios de filtragem (G4, M5, etc.).',
    hasFilters: true,
    hasDamper: false,
    typicalRotors: ['Limit Load (Pás p/ Trás)', 'Sirocco (Pás p/ Frente)', 'Airfoil'],
  },
  {
    id: 'ventilador_centrifugo',
    name: 'Ventilador / Exaustor Centrífugo',
    shortName: 'Ventilador Centrífugo',
    tagPrefix: 'VE',
    description: 'Ventilador centrífugo carcaça em voluta, com acoplamento direto ou por polias e correias.',
    hasFilters: false,
    hasDamper: true,
    typicalRotors: ['Pás Voltadas para Trás (Backward)', 'Airfoil de Alto Rendimento', 'Radiais (Poeiras / Cavacos)', 'Limit Load'],
  },
  {
    id: 'exaustor_geral',
    name: 'Exaustor Centrífugo de Ambientes',
    shortName: 'Exaustor Centrífugo',
    tagPrefix: 'EX',
    description: 'Exaustor para sanitários, vestiários, salas técnicas ou renovação geral.',
    hasFilters: false,
    hasDamper: true,
    typicalRotors: ['Pás Voltadas para Trás', 'Sirocco', 'Limit Load'],
  },
  {
    id: 'pressurizacao_escada',
    name: 'Ventilador de Pressurização de Escadas',
    shortName: 'Pressurização de Escada',
    tagPrefix: 'VPE',
    description: 'Sistema crítico de segurança contra incêndio com alta pressão estática e damper de contrafluxo.',
    hasFilters: true,
    hasDamper: true,
    typicalRotors: ['Airfoil de Alta Pressão', 'Pás Voltadas para Trás'],
  },
  {
    id: 'ventilador_axial',
    name: 'Ventilador Axial / Tubular',
    shortName: 'Ventilador Axial',
    tagPrefix: 'VA',
    description: 'Ventilador para montagem em parede, telhado ou duto em linha de altas vazões e baixas pressões.',
    hasFilters: false,
    hasDamper: true,
    typicalRotors: ['Hélice em Alumínio Aero-dinâmico', 'Hélice em Polímero de Alta Resistência'],
  }
];

export const APPLICATION_OPTIONS = [
  'Renovação de Ar Externo (Conforto)',
  'Pressurização de Escadas de Emergência',
  'Exaustão de Sanitários e Vestiários',
  'Exaustão de Cozinhas Profissionais / Gordura',
  'Exaustão de Salas de Máquinas / Subestação',
  'Exaustão de Gases / Áreas Químicas',
  'Insuflamento de Ar Filtrado',
  'Ar de Combustão / Caldeiras / Geradores',
  'Climatização e Distribuição por Dutos'
];

export const VOLTAGE_OPTIONS = [
  '220/380V - Trifásico - 60Hz',
  '380/660V - Trifásico - 60Hz',
  '440V - Trifásico - 60Hz',
  '220V - Monofásico - 60Hz',
  '127V - Monofásico - 60Hz'
];

export const STARTER_OPTIONS = [
  'Partida Direta',
  'Estrela-Triângulo',
  'Inversor de Frequência (VFD)',
  'Soft-Starter'
];

export const FILTER_TYPES = [
  'Sem Filtro',
  'Filtro G4 (Descartável Plano)',
  'Filtro G4 (Plissado Alta Capacidade)',
  'Filtro M5 (Bolsa / Alta Eficiência)',
  'Filtro G4 + M5 (Duplo Estágio)',
  'Filtro G4 + F7 (Filtro Fino)',
  'Filtro Absoluto HEPA (H13/H14)'
];

export const FILTER_SAQUE_OPTIONS = [
  'Lado Direito (Sentido do Fluxo)',
  'Lado Esquerdo (Sentido do Fluxo)',
  'Superior (Por Cima)',
  'Inferior (Por Baixo)'
];

export const MOUNTING_DISCHARGE_POSITIONS = [
  'RD 0° (Horizontal Baixo Direito)',
  'RD 90° (Vertical Superior Direito)',
  'RD 270° (Vertical Inferior Direito)',
  'RD 315° (Descarga Inclinada Direita)',
  'LG 0° (Horizontal Baixo Esquerdo)',
  'LG 90° (Vertical Superior Esquerdo)',
  'LG 270° (Vertical Inferior Esquerdo)',
  'LG 315° (Descarga Inclinada Esquerda)'
];
