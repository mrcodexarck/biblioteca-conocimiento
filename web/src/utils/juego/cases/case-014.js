export const CASE_014 = {
  id: 'case-014',
  title: 'El cabello en la almohada',
  briefing:
    'Una novelista del Irvington fue hallada sin vida en su habitación. El asesino se sentó en la cama a esperarla, y en la almohada quedaron varios cabellos castaño oscuro. ADN confirmado: coincide con el asesino. El naipe: un Ocho de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Dormitorio de la novelista',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 55, itemId: 'naipe-14' },
        { id: 'h2', x: 70, y: 45, itemId: 'almohada-14' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Estudio de escritura',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 50, itemId: 'manuscrito-14' },
      ],
    },
  ],
  items: [
    { id: 'naipe-14', name: 'Ocho de Picas', type: 'evidencia', icon: '🃏', result: 'Sobre la mesita de noche. Firma del asesino.' },
    { id: 'almohada-14', name: 'Cabellos en la almohada', type: 'forense', icon: '🔬', result: 'Cabello castaño oscuro. Raíz intacta: ADN completo disponible.' },
    { id: 'manuscrito-14', name: 'Manuscrito inacabado', type: 'documento', icon: '📄', result: 'La novela narraba "un asesino de Portland que dejaba naipes". La víctima sabía demasiado.' },
  ],
  suspects: [
    { id: 's1', name: 'Editor', alibi: 'Esperaba el manuscrito para publicar.' },
    { id: 's2', name: 'Fans obsesivo', alibi: 'Enviaba cartas desde hacía meses.' },
    { id: 's3', name: 'Vecino del piso 5', alibi: 'Dice que ella no salió en días.' },
    { id: 's4', name: 'Investigador amateur', alibi: 'Estaba rastreando al asesino por su cuenta.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['almohada-14', 'manuscrito-14'],
  },
  serialClue: {
    attribute: 'hair',
    value: 'castaño oscuro',
    text: 'ADN confirmado: el cabello del asesino es castaño oscuro.',
  },
};