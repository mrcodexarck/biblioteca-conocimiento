export const CASE_015 = {
  id: 'case-015',
  title: 'La mirada del abismo',
  briefing:
    'Un recepcionista del Hotel Cosmopolitan fue asesinado en el pasillo del piso 8. Un huésped insomne se cruzó con el asesino en el ascensor y no pudo olvidar sus ojos: gris azulados, casi transparentes. El naipe: un Nueve de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Pasillo del piso 8',
      image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 55, itemId: 'naipe-15' },
        { id: 'h2', x: 70, y: 40, itemId: 'tarjeta-15' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Ascensor',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 60, itemId: 'grabacion-15' },
      ],
    },
  ],
  items: [
    { id: 'naipe-15', name: 'Nueve de Picas', type: 'evidencia', icon: '🃏', result: 'Debajo del cuerpo. Firma intacta.' },
    { id: 'tarjeta-15', name: 'Tarjeta magnética', type: 'evidencia', icon: '💳', result: 'Llave de habitación 802. El huésped no recuerda haberla usado.' },
    { id: 'grabacion-15', name: 'Grabación del ascensor', type: 'evidencia', icon: '📹', result: 'Captura borrosa: ojos muy claros, casi transparentes.' },
  ],
  suspects: [
    { id: 's1', name: 'Huésped del 805', alibi: 'Estaba cenando en el restaurante.' },
    { id: 's2', name: 'Botones del turno noche', alibi: 'Ayudaba en la recepción del lobby.' },
    { id: 's3', name: 'Mujer del 803', alibi: 'Dice que se acostó temprano.' },
    { id: 's4', name: 'Hombre del 802', alibi: 'Nunca se registró en recepción, pero ocupaba la habitación.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['tarjeta-15', 'grabacion-15'],
  },
  serialClue: {
    attribute: 'eyes',
    value: 'azul grisáceo',
    text: 'Testigo clave: "Sus ojos eran gris azulados, casi transparentes. No los olvidaré".',
  },
};