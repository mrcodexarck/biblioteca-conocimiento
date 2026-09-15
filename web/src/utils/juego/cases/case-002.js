export const CASE_002 = {
  id: 'case-002',
  title: 'La sangre delatora',
  briefing:
    'Una empresaria del Downtown fue asesinada en su despacho. La víctima se defendió: bajo sus uñas quedaron restos de piel y sangre del agresor. Los laboratorios confirman que el tipo de sangre del asesino es poco común. Este es el segundo naipe encontrado: un Dos de Picas.',
  coverImage:
    'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200',
  difficulty: 2,
  scenes: [
    {
      id: 'scene-1',
      name: 'Despacho de la víctima',
      image:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 55, itemId: 'naipe-2' },
        { id: 'h2', x: 70, y: 35, itemId: 'uanas-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Baño privado',
      image:
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 50, itemId: 'venda-2' },
      ],
    },
  ],
  items: [
    {
      id: 'naipe-2',
      name: 'Dos de Picas',
      type: 'evidencia',
      icon: '🃏',
      result: 'Dejado sobre el escritorio. Sin huellas. Firma del asesino.',
    },
    {
      id: 'uanas-1',
      name: 'Restos bajo las uñas',
      type: 'forense',
      icon: '🔬',
      result: 'Contiene sangre del agresor: tipo AB- (muy poco común).',
    },
    {
      id: 'venda-2',
      name: 'Venda ensangrentada',
      type: 'forense',
      icon: '🩹',
      result: 'El asesino se curó rápido. Está herido en el antebrazo.',
    },
  ],
  suspects: [
    { id: 's1', name: 'Asistente ejecutivo', alibi: 'Estaba en una reunión en otro piso.' },
    { id: 's2', name: 'Exsocio comercial', alibi: 'Perdió un juicio contra la víctima hace un mes.' },
    { id: 's3', name: 'Contador externo', alibi: 'Solo entregaba reportes mensuales.' },
    { id: 's4', name: 'Visitante nocturno', alibi: 'Entró sin autorización al despacho.' },
  ],
  solution: {
    guiltyId: 's2',
    requiredEvidence: ['uanas-1', 'venda-2'],
  },
  serialClue: {
    attribute: 'bloodType',
    value: 'AB-',
    text: 'Sangre seca bajo la uña de la víctima: tipo AB-. Poco común entre la población.',
  },
};