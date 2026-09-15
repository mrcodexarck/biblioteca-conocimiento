export const CASE_003 = {
  id: 'case-003',
  title: 'La marca en la piel',
  briefing:
    'Una arquitecta del Pearl District fue atacada en su estudio. Sobrevivió lo suficiente para describir al asesino antes de morir: "Un hombre muy alto... con una serpiente tatuada en la espalda". Esta vez el naipe fue un Tres de Picas. El asesino se está volviendo más audaz.',
  coverImage:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Estudio de arquitectura',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
      hotspots: [
        { id: 'h1', x: 35, y: 55, itemId: 'naipe-3' },
        { id: 'h2', x: 65, y: 40, itemId: 'planos-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Cuarto de revelado',
      image:
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 60, itemId: 'foto-1' },
        { id: 'h4', x: 25, y: 45, itemId: 'guante-4' },
      ],
    },
  ],
  items: [
    {
      id: 'naipe-3',
      name: 'Tres de Picas',
      type: 'evidencia',
      icon: '🃏',
      result: 'Firmado con un pequeño dibujo de serpiente en el reverso.',
    },
    {
      id: 'planos-1',
      name: 'Planos del edificio',
      type: 'documento',
      icon: '📐',
      result: 'Marcados con una X donde ocurriría el ataque. El asesino conocía el lugar.',
    },
    {
      id: 'foto-1',
      name: 'Fotografía revelada',
      type: 'evidencia',
      icon: '📸',
      result: 'Captura borrosa del asesino huyendo. Se ve el tatuaje en la espalda: una serpiente.',
    },
    {
      id: 'guante-4',
      name: 'Guante quirúrgico',
      type: 'forense',
      icon: '🧤',
      result: 'Restos de sudor. ADN parcial con antecedentes penales.',
    },
  ],
  suspects: [
    { id: 's1', name: 'Colega arquitecto', alibi: 'Dice que trabajaba desde casa.' },
    { id: 's2', name: 'Promotor inmobiliario', alibi: 'Le interesaba comprar el edificio.' },
    { id: 's3', name: 'Antiguo cliente', alibi: 'Estaba en la ciudad por negocios.' },
    { id: 's4', name: 'Fotógrafo urbano', alibi: 'Documentaba la zona esa noche.' },
  ],
  solution: {
    guiltyId: 's1',
    requiredEvidence: ['foto-1', 'guante-4'],
  },
  serialClue: {
    attribute: 'tattoo',
    value: 'Serpiente',
    text: 'La víctima describió al asesino con una serpiente tatuada en la espalda.',
  },
};