export const CASE_004 = {
  id: 'case-004',
  title: 'El carbunclo azul',
  briefing: 'Un famoso carbunclo azul, valorado en una fortuna, ha desaparecido del hotel Cosmopolitan. La policía arrestó a un limpiabotas inocente, pero Holmes sabe que el verdadero ladrón está en libertad. La única pista es un ganso de Navidad. Holmes debe encontrar la joya antes de que sea demasiado tarde.',
  coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
  difficulty: 2,
  scenes: [
    {
      id: 'scene-1',
      name: 'Hotel Cosmopolitan',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 55, itemId: 'ventana-1' },
        { id: 'h2', x: 75, y: 30, itemId: 'cama-2' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Mercado de Covent Garden',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 50, itemId: 'ganso-1' },
        { id: 'h4', x: 25, y: 70, itemId: 'sombrero-1' },
      ],
    },
    {
      id: 'scene-3',
      name: 'Casa del Sr. Ryder',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600',
      hotspots: [
        { id: 'h5', x: 60, y: 40, itemId: 'cuchillo-1' },
        { id: 'h6', x: 30, y: 65, itemId: 'periodico-1' },
      ],
    },
  ],
  items: [
    { id: 'ventana-1', name: 'Ventana forzada', type: 'evidencia', icon: '🪟', result: 'La ventana fue forzada desde dentro. El ladrón conocía el hotel.' },
    { id: 'cama-2', name: 'Cama revuelta', type: 'evidencia', icon: '🛏️', result: 'Bajo la cama, un botón de un uniforme de botones.' },
    { id: 'ganso-1', name: 'Ganso de Navidad', type: 'evidencia', icon: '🦢', result: 'Dentro del ganso, el carbunclo azul. El ladrón no sabía que estaba ahí.' },
    { id: 'sombrero-1', name: 'Sombrero de copa', type: 'documento', icon: '🎩', result: 'Iniciales "J.H." — pertenece a James Ryder.' },
    { id: 'cuchillo-1', name: 'Cuchillo de cocina', type: 'evidencia', icon: '🔪', result: 'Con plumas de ganso. Usado para abrir el ganso.' },
    { id: 'periodico-1', name: 'Periódico', type: 'documento', icon: '📰', result: 'Anuncio de recompensa por el carbunclo. James Ryder lo vio.' },
  ],
  suspects: [
    { id: 's1', name: 'James Ryder', alibi: 'Dice que encontró el ganso en el mercado.' },
    { id: 's2', name: 'John Horner', alibi: 'Limpiabotas arrestado injustamente.' },
    { id: 's3', name: 'Catherine Cusack', alibi: 'Dama de compañía de la condesa.' },
    { id: 's4', name: 'Comisionado de policía', alibi: 'Investiga el robo.' },
  ],
  solution: {
    guiltyId: 's1',
    requiredEvidence: ['ganso-1', 'sombrero-1'],
  },
};