export const CASE_003 = {
  id: 'case-003',
  title: 'La banda de lunares',
  briefing: 'La joven Helen Stoner acude a Holmes aterrada. Su hermana murió misteriosamente hace dos años, justo antes de casarse, y ahora Helen teme correr la misma suerte. Su padrastro, el Dr. Grimesby Roylott, un hombre violento y excéntrico, mantiene animales exóticos en la casa familiar. Las últimas palabras de su hermana fueron: "La banda de lunares".',
  coverImage: 'https://images.unsplash.com/photo-1509248961102-9b29a3f9f2e4?w=1200',
  difficulty: 4,
  scenes: [
    {
      id: 'scene-1',
      name: 'Habitación de Helen',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600',
      hotspots: [
        { id: 'h1', x: 30, y: 60, itemId: 'campana-1' },
        { id: 'h2', x: 70, y: 45, itemId: 'cama-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Habitación del Dr. Roylott',
      image: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=1600',
      hotspots: [
        { id: 'h3', x: 50, y: 50, itemId: 'silla-1' },
        { id: 'h4', x: 20, y: 70, itemId: 'caja-1' },
      ],
    },
    {
      id: 'scene-3',
      name: 'Jardín',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1600',
      hotspots: [
        { id: 'h5', x: 60, y: 60, itemId: 'silbato-1' },
        { id: 'h6', x: 40, y: 35, itemId: 'leche-1' },
      ],
    },
  ],
  items: [
    { id: 'campana-1', name: 'Campana de servicio', type: 'evidencia', icon: '🔔', result: 'La cuerda de la campana es falsa. No está conectada a ninguna campana.' },
    { id: 'cama-1', name: 'Cama de Helen', type: 'evidencia', icon: '🛏️', result: 'La cama está atornillada al suelo, justo debajo de la cuerda falsa.' },
    { id: 'silla-1', name: 'Silla del Dr.', type: 'evidencia', icon: '🪑', result: 'La silla tiene marcas de garras en el reposabrazos. Algo trepó por ella.' },
    { id: 'caja-1', name: 'Caja fuerte', type: 'documento', icon: '🧰', result: 'Contiene un testamento que deja toda la herencia al Dr. Roylott si Helen muere.' },
    { id: 'silbato-1', name: 'Silbato', type: 'evidencia', icon: '🔊', result: 'Silbato usado para llamar a la serpiente. No es un silbato común.' },
    { id: 'leche-1', name: 'Plato de leche', type: 'evidencia', icon: '🥛', result: 'Leche con veneno para atraer a la serpiente.' },
  ],
  suspects: [
    { id: 's1', name: 'Dr. Grimesby Roylott', alibi: 'Dice que estaba durmiendo.' },
    { id: 's2', name: 'Helen Stoner', alibi: 'Es la víctima que pide ayuda.' },
    { id: 's3', name: 'Sra. Stoner', alibi: 'Madre fallecida.' },
    { id: 's4', name: 'Médico de la familia', alibi: 'Certificó la muerte de la hermana.' },
  ],
  solution: {
    guiltyId: 's1',
    requiredEvidence: ['campana-1', 'leche-1'],
  },
};