export const CASE_013 = {
  id: 'case-013',
  title: 'La agilidad del cazador',
  briefing:
    'Un entrenador personal apareció estrangulado en su gimnasio del Alberta Arts. El forense notó algo inusual: el asesino tuvo que ser lo bastante fuerte para someter a un atleta y lo bastante ágil para escapar por una ventana del segundo piso sin dejar rastro. Complexión atlética confirmada. El naipe: un Siete de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
  difficulty: 4,
  scenes: [
    {
      id: 'scene-1',
      name: 'Gimnasio privado',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600',
      hotspots: [
        { id: 'h1', x: 30, y: 55, itemId: 'naipe-13' },
        { id: 'h2', x: 65, y: 40, itemId: 'pesa-13' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Ventana del segundo piso',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600',
      hotspots: [
        { id: 'h3', x: 50, y: 60, itemId: 'tela-13' },
      ],
    },
  ],
  items: [
    { id: 'naipe-13', name: 'Siete de Picas', type: 'evidencia', icon: '🃏', result: 'Debajo del banco de pesas.' },
    { id: 'pesa-13', name: 'Pesa de 20kg', type: 'forense', icon: '🏋️', result: 'Usada como contrapeso para inmovilizar a la víctima.' },
    { id: 'tela-13', name: 'Fibra de ropa deportiva', type: 'forense', icon: '🧵', result: 'Restos de lycra sintética. Prenda técnica de alta gama.' },
  ],
  suspects: [
    { id: 's1', name: 'Compañero de entrenamiento', alibi: 'Terminó su rutina antes de las 8 PM.' },
    { id: 's2', name: 'Dueño del gimnasio', alibi: 'Estaba en su oficina del piso 3.' },
    { id: 's3', name: 'Cliente nuevo', alibi: 'Solo vino a inscribirse. Sin membresía aún.' },
    { id: 's4', name: 'Fisicoculturista', alibi: 'Dice que solo usa las máquinas a mediodía.' },
  ],
  solution: {
    guiltyId: 's3',
    requiredEvidence: ['pesa-13', 'tela-13'],
  },
  serialClue: {
    attribute: 'weight',
    value: 'atlético',
    text: 'Los forenses confirman: complexión atlética, no musculosa, sino de alguien entrenado.',
  },
};