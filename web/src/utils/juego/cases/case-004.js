export const CASE_004 = {
  id: 'case-004',
  title: 'El terrario del silencio',
  briefing:
    'Un investigador privado fue encontrado muerto en su apartamento del Pearl District. Antes de morir había estado siguiendo al asesino y había hecho un descubrimiento perturbador: el hombre que buscaba acababa de comprar un terrario para serpientes. Esa información le costó la vida. El naipe: un Cuatro de Picas.',
  coverImage:
    'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Apartamento del detective',
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 50, itemId: 'naipe-4' },
        { id: 'h2', x: 70, y: 60, itemId: 'notas-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Tienda de mascotas exóticas',
      image:
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 55, itemId: 'recibo-1' },
      ],
    },
    {
      id: 'scene-3',
      name: 'Domicilio del sospechoso',
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600',
      hotspots: [
        { id: 'h4', x: 30, y: 60, itemId: 'terrario-1' },
      ],
    },
  ],
  items: [
    {
      id: 'naipe-4',
      name: 'Cuatro de Picas',
      type: 'evidencia',
      icon: '🃏',
      result: 'Colocado sobre el pecho del investigador. Firma macabra.',
    },
    {
      id: 'notas-1',
      name: 'Notas del detective',
      type: 'documento',
      icon: '📓',
      result: 'Anotaciones: "El sospechoso compró un terrario para serpientes el martes."',
    },
    {
      id: 'recibo-1',
      name: 'Recibo de tienda',
      type: 'documento',
      icon: '🧾',
      result: 'Compra de un terrario profesional y alimento para serpientes. Pagó en efectivo.',
    },
    {
      id: 'terrario-1',
      name: 'Terrario vacío',
      type: 'evidencia',
      icon: '🐍',
      result: 'En el domicilio del sospechoso. La serpiente desapareció misteriosamente.',
    },
  ],
  suspects: [
    { id: 's1', name: 'Vendedor de mascotas', alibi: 'Dice que solo vendió el terrario.' },
    { id: 's2', name: 'Excompañero policía', alibi: 'Ayudaba a la víctima con la investigación.' },
    { id: 's3', name: 'Informante anónimo', alibi: 'Nadie sabe su verdadero nombre.' },
    { id: 's4', name: 'Vecino del piso 12', alibi: 'Dice que escuchó gritos pero no salió.' },
  ],
  solution: {
    guiltyId: 's3',
    requiredEvidence: ['notas-1', 'recibo-1'],
  },
  serialClue: {
    attribute: 'pet',
    value: 'Serpiente',
    text: 'El asesino compró un terrario para serpientes. Es su mascota.',
  },
};