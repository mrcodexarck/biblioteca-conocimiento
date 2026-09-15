export const CASE_009 = {
  id: 'case-009',
  title: 'La sinfonía de la muerte',
  briefing: 'Un violinista de la Filarmónica de Portland murió durante un ensayo. Testigos aseguran que la música clásica seguía sonando cuando encontraron el cuerpo. El asesino dejó su banda sonora favorita como firma.',
  coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Sala de conciertos',
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 50, itemId: 'violin-1' },
        { id: 'h2', x: 70, y: 60, itemId: 'parlante-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Camerino',
      image: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 45, itemId: 'disco-1' },
      ],
    },
  ],
  items: [
    { id: 'violin-1', name: 'Violín roto', type: 'evidencia', icon: '🎻', result: 'Instrumento valioso destruido con violencia inusual.' },
    { id: 'parlante-1', name: 'Parlante portátil', type: 'evidencia', icon: '🔊', result: 'Reproduciendo una sinfonía de Mahler en loop.' },
    { id: 'disco-1', name: 'Disco de vinilo', type: 'evidencia', icon: '💿', result: 'Edición limitada. Solo 50 copias en el mundo.' },
  ],
  suspects: [
    { id: 's1', name: 'Director de orquesta', alibi: 'Estaba en su camerino revisando partituras.' },
    { id: 's2', name: 'Violinista suplente', alibi: 'Llegó tarde al ensayo.' },
    { id: 's3', name: 'Productor musical', alibi: 'Solo asistió como espectador.' },
    { id: 's4', name: 'Coleccionista de música', alibi: 'Nadie lo invitó al evento.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['parlante-1', 'disco-1'],
  },
  serialClue: {
    attribute: 'music',
    value: 'Clasica',
    text: 'Dejaba música clásica sonando al momento de matar. Su firma.',
  },
};