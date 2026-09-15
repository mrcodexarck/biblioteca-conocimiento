export const CASE_007 = {
  id: 'case-007',
  title: 'El club de boxeo',
  briefing: 'Un entrenador del club de boxeo fue hallado muerto en el ring. Los golpes que recibió fueron tan precisos que el forense concluyó: el asesino entrena boxeo. Alguien con muy buena técnica. Alguien que sabe golpear sin dejar marcas visibles.',
  coverImage: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Ring de boxeo',
      image: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=1600',
      hotspots: [
        { id: 'h1', x: 50, y: 60, itemId: 'guante-3' },
        { id: 'h2', x: 25, y: 45, itemId: 'venda-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Vestidor',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600',
      hotspots: [
        { id: 'h3', x: 60, y: 50, itemId: 'gafete-1' },
        { id: 'h4', x: 35, y: 70, itemId: 'peso-1' },
      ],
    },
  ],
  items: [
    { id: 'guante-3', name: 'Guante ensangrentado', type: 'forense', icon: '🥊', result: 'Con sangre de la víctima. Talla de guante: profesional.' },
    { id: 'venda-1', name: 'Venda olvidada', type: 'forense', icon: '🎗️', result: 'Venda profesional con sudor. Coincide con un luchador zurdo.' },
    { id: 'gafete-1', name: 'Gafete de socio', type: 'documento', icon: '🎫', result: 'Socio fundador del club. Alto rango en la federación.' },
    { id: 'peso-1', name: 'Peso de entrenamiento', type: 'evidencia', icon: '🏋️', result: 'Arma improvisada. Huellas parciales visibles.' },
  ],
  suspects: [
    { id: 's1', name: 'Boxeador retirado', alibi: 'Dice que dejó el deporte hace años.' },
    { id: 's2', name: 'Entrenador asistente', alibi: 'Estaba preparando una pelea.' },
    { id: 's3', name: 'Federado internacional', alibi: 'Llegó hace poco de un torneo.' },
    { id: 's4', name: 'Patrocinador del club', alibi: 'Solo pasa a revisar las finanzas.' },
  ],
  solution: {
    guiltyId: 's3',
    requiredEvidence: ['guante-3', 'venda-1'],
  },
  serialClue: {
    attribute: 'sport',
    value: 'Boxeo',
    text: 'Los golpes son de alguien entrenado profesionalmente en boxeo.',
  },
};