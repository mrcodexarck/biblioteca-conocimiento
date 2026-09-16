export const CASE_018 = {
  id: 'case-018',
  title: 'El mes grabado en el arma',
  briefing:
    'Un cocinero del Montavilla fue asesinado en el callejón detrás de su restaurante. El arma del crimen, un cuchillo de chef profesional, tenía grabado un número: 15/03. El asesino personaliza sus herramientas. El naipe: una Reina de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Callejón trasero',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600',
      hotspots: [
        { id: 'h1', x: 35, y: 60, itemId: 'naipe-18' },
        { id: 'h2', x: 70, y: 40, itemId: 'cuchillo-18' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Cocina del restaurante',
      image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 55, itemId: 'pedido-18' },
      ],
    },
  ],
  items: [
    { id: 'naipe-18', name: 'Reina de Picas', type: 'evidencia', icon: '🃏', result: 'Metida en el bolsillo del cocinero asesinado.' },
    { id: 'cuchillo-18', name: 'Cuchillo profesional', type: 'evidencia', icon: '🔪', result: 'Grabado: "15/03". Mismo número que otros casos.' },
    { id: 'pedido-18', name: 'Pedido especial', type: 'documento', icon: '🧾', result: 'Una mesa pidió algo fuera del menú y pagó con billete de $100.' },
  ],
  suspects: [
    { id: 's1', name: 'Cocinero suplente', alibi: 'Terminó su turno a las 10 PM.' },
    { id: 's2', name: 'Dueño del restaurante', alibi: 'Estaba en una cena privada.' },
    { id: 's3', name: 'Mesero veterano', alibi: 'Servía a la mesa especial esa noche.' },
    { id: 's4', name: 'Cliente de la mesa especial', alibi: 'Nadie lo conocía. Comió solo. Se fue sin dejar propina.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['cuchillo-18', 'pedido-18'],
  },
  serialClue: {
    attribute: 'birthMonth',
    value: 'Mar',
    text: 'La fecha "15/03" aparece en cada arma usada. El asesino nació en marzo.',
  },
};