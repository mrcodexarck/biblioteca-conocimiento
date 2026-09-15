export const CASE_001 = {
  id: 'case-001',
  title: 'El robo del collar de esmeraldas',
  briefing:
    'Durante la gala benéfica anual de la familia Vanderbilt, un collar valorado en $50.000 desapareció de la caja fuerte del despacho. Cinco invitados tuvieron acceso a la zona privada. Solo uno de ellos es el culpable.',
  coverImage:
    'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200',
  difficulty: 2,
  scenes: [
    {
      id: 'scene-1',
      name: 'Salón principal',
      image:
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600',
      hotspots: [
        { id: 'h1', x: 25, y: 60, itemId: 'foto-1' },
        { id: 'h2', x: 70, y: 45, itemId: 'copa-1' },
        { id: 'h3', x: 50, y: 80, itemId: 'panuelo-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Despacho privado',
      image:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600',
      hotspots: [
        { id: 'h4', x: 40, y: 55, itemId: 'guante-1' },
        { id: 'h5', x: 75, y: 30, itemId: 'huella-1' },
      ],
    },
    {
      id: 'scene-3',
      name: 'Jardín trasero',
      image:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600',
      hotspots: [
        { id: 'h6', x: 55, y: 70, itemId: 'collar-1' },
        { id: 'h7', x: 20, y: 40, itemId: 'cigarro-1' },
      ],
    },
  ],
  items: [
    {
      id: 'foto-1',
      name: 'Foto firmada',
      type: 'documento',
      icon: '📸',
      result:
        'Fotografía con dedicatoria: "Para Andrea, con cariño. — L.V."',
    },
    {
      id: 'copa-1',
      name: 'Copa de champán',
      type: 'forense',
      icon: '🥂',
      result: 'Restos de labial rojo intenso. Coincide con Andrea Ruiz.',
    },
    {
      id: 'panuelo-1',
      name: 'Pañuelo de seda',
      type: 'documento',
      icon: '🧣',
      result: 'Bordado con iniciales "C.M." — Carlos Mendoza.',
    },
    {
      id: 'guante-1',
      name: 'Guante de látex',
      type: 'forense',
      icon: '🧤',
      result: 'Con restos de sudor. ADN coincide con Andrea Ruiz.',
    },
    {
      id: 'huella-1',
      name: 'Huella dactilar',
      type: 'forense',
      icon: '🔍',
      result: 'Huella parcial en la caja fuerte. Coincide con Andrea Ruiz.',
    },
    {
      id: 'collar-1',
      name: 'Collar enterrado',
      type: 'evidencia',
      icon: '💎',
      result: 'El collar robado, enterrado bajo un arbusto del jardín.',
    },
    {
      id: 'cigarro-1',
      name: 'Colilla de cigarro',
      type: 'forense',
      icon: '🚬',
      result: 'Marca que solo fuma Laura Vanderbilt.',
    },
  ],
  suspects: [
    {
      id: 's1',
      name: 'Andrea Ruiz',
      alibi: 'Bailaba en la pista central cuando apagaron las luces.',
    },
    {
      id: 's2',
      name: 'Carlos Mendoza',
      alibi: 'Estaba en el bar pidiendo un whisky.',
    },
    {
      id: 's3',
      name: 'Laura Vanderbilt',
      alibi: 'Recibía a los invitados en la entrada principal.',
    },
    {
      id: 's4',
      name: 'Miguel Torres',
      alibi: 'Estaba en el baño arreglándose la corbata.',
    },
    {
      id: 's5',
      name: 'Sofía Herrera',
      alibi: 'Atendía una llamada de trabajo en el pasillo.',
    },
  ],
  solution: {
    guiltyId: 's1',
    requiredEvidence: ['guante-1', 'huella-1'],
  },
};