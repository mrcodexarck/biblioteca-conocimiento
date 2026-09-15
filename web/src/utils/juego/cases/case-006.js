export const CASE_006 = {
  id: 'case-006',
  title: 'El políglota silencioso',
  briefing: 'Una profesora de idiomas apareció sin vida en su apartamento del centro. Un testigo escuchó al sospechoso hablar perfectamente en 4 idiomas distintos antes de huir. Nadie en Portland habla tantos idiomas... o eso creían.',
  coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Apartamento',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600',
      hotspots: [
        { id: 'h1', x: 35, y: 55, itemId: 'libro-2' },
        { id: 'h2', x: 70, y: 40, itemId: 'nota-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Pasillo del edificio',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600',
      hotspots: [
        { id: 'h3', x: 50, y: 60, itemId: 'camara-1' },
      ],
    },
    {
      id: 'scene-3',
      name: 'Azotea',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600',
      hotspots: [
        { id: 'h4', x: 40, y: 50, itemId: 'cuerda-1' },
      ],
    },
  ],
  items: [
    { id: 'libro-2', name: 'Libro subrayado', type: 'documento', icon: '📚', result: 'Anotaciones en 4 idiomas: ruso, mandarín, árabe y alemán.' },
    { id: 'nota-1', name: 'Nota amenazante', type: 'documento', icon: '📝', result: 'Escrita en tres alfabetos distintos. Firma: una serpiente dibujada.' },
    { id: 'camara-1', name: 'Grabación de seguridad', type: 'evidencia', icon: '📹', result: 'Una silueta alta sale por la azotea. Habla por teléfono en otro idioma.' },
    { id: 'cuerda-1', name: 'Cuerda de escalada', type: 'forense', icon: '🧵', result: 'Usada por alguien con experiencia en deportes extremos.' },
  ],
  suspects: [
    { id: 's1', name: 'Traductor profesional', alibi: 'Estaba traduciendo un documento urgente.' },
    { id: 's2', name: 'Vecino del 3B', alibi: 'Dice que dormía profundamente.' },
    { id: 's3', name: 'Guía turístico', alibi: 'Habla solo 2 idiomas, según su jefe.' },
    { id: 's4', name: 'Profesor internacional', alibi: 'Llegó hace poco al país. Nadie lo conoce.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['libro-2', 'nota-1'],
  },
  serialClue: {
    attribute: 'languages',
    value: '4+',
    text: 'El testigo lo oyó hablar perfectamente en 4 idiomas distintos.',
  },
};