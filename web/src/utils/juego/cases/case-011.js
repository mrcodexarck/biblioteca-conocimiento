export const CASE_011 = {
  id: 'case-011',
  title: 'El rostro marcado',
  briefing:
    'Un joyero del Nob Hill fue asesinado en su tienda. La cámara de seguridad captó al asesino de frente por un segundo: un hombre con una cicatriz profunda en la mejilla izquierda. Esta vez el naipe fue un Cinco de Picas, dejado sobre el mostrador.',
  coverImage: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Joyería del Nob Hill',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600',
      hotspots: [
        { id: 'h1', x: 35, y: 55, itemId: 'naipe-11' },
        { id: 'h2', x: 70, y: 40, itemId: 'camara-11' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Trastienda',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 60, itemId: 'guante-11' },
      ],
    },
  ],
  items: [
    { id: 'naipe-11', name: 'Cinco de Picas', type: 'evidencia', icon: '🃏', result: 'Colocado sobre el mostrador. Sin huellas, firma limpia.' },
    { id: 'camara-11', name: 'Grabación de seguridad', type: 'evidencia', icon: '📹', result: 'Captura clara: cicatriz profunda en la mejilla izquierda.' },
    { id: 'guante-11', name: 'Guante quirúrgico', type: 'forense', icon: '🧤', result: 'Sudor en el interior. Sin coincidencia en bases previas.' },
  ],
  suspects: [
    { id: 's1', name: 'Empleado de la joyería', alibi: 'Estaba en el banco depositando.' },
    { id: 's2', name: 'Comprador habitual', alibi: 'Asegura haber salido 2 horas antes.' },
    { id: 's3', name: 'Vigilante de la cuadra', alibi: 'Dice que no vio a nadie con cicatriz.' },
    { id: 's4', name: 'Visitante nocturno', alibi: 'Nadie lo recuerda, pero la cámara lo captó.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['camara-11', 'guante-11'],
  },
  serialClue: {
    attribute: 'feature',
    value: 'Cicatriz',
    text: 'La cámara captó al asesino: tiene una cicatriz profunda en la mejilla izquierda.',
  },
};