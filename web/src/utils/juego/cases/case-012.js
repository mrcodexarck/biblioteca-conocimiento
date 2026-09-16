export const CASE_012 = {
  id: 'case-012',
  title: 'El gigante en la niebla',
  briefing:
    'Una farmacéutica del Downtown apareció muerta en el estacionamiento del edificio. Los testigos lo describen como "un hombre gigante". Los forenses determinaron por la marca de la herida que el asesino mide más de 1.90 metros. El naipe: un Seis de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200',
  difficulty: 4,
  scenes: [
    {
      id: 'scene-1',
      name: 'Estacionamiento',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 60, itemId: 'naipe-12' },
        { id: 'h2', x: 70, y: 45, itemId: 'huella-12' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Azotea del edificio',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 55, itemId: 'cuerda-12' },
      ],
    },
  ],
  items: [
    { id: 'naipe-12', name: 'Seis de Picas', type: 'evidencia', icon: '🃏', result: 'Debajo del cuerpo. Sin huellas.' },
    { id: 'huella-12', name: 'Huella de zapato', type: 'forense', icon: '👞', result: 'Talla 47, huella extremadamente grande.' },
    { id: 'cuerda-12', name: 'Cuerda de rappel', type: 'evidencia', icon: '🪢', result: 'El asesino escapó por la azotea. Usó cuerda profesional.' },
  ],
  suspects: [
    { id: 's1', name: 'Jefe de seguridad', alibi: 'Revisaba las cámaras en su oficina.' },
    { id: 's2', name: 'Exjugador de baloncesto', alibi: 'Dice que se retiró hace años.' },
    { id: 's3', name: 'Vigilante del turno noche', alibi: 'Estaba en la garita del nivel 2.' },
    { id: 's4', name: 'Empleado del piso 15', alibi: 'Nadie lo ha visto en persona, solo por email.' },
  ],
  solution: {
    guiltyId: 's2',
    requiredEvidence: ['huella-12', 'cuerda-12'],
  },
  serialClue: {
    attribute: 'height',
    value: 'muy alto',
    text: 'Las huellas y los testigos confirman: el asesino mide más de 1.90m.',
  },
};