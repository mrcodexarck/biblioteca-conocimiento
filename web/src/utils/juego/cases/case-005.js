export const CASE_005 = {
  id: 'case-005',
  title: 'El mensajero del puerto',
  briefing: 'Un mensajero fue encontrado sin vida cerca del puerto de Portland. En su bolsillo llevaba una carta sin destinatario. El asesino huyó en una moto negra sin placas, según testigos. Este es el quinto eslabón de la cadena.',
  coverImage: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200',
  difficulty: 2,
  scenes: [
    {
      id: 'scene-1',
      name: 'Muelle abandonado',
      image: 'https://images.unsplash.com/photo-1560258018-c7db7645254e?w=1600',
      hotspots: [
        { id: 'h1', x: 30, y: 55, itemId: 'moto-1' },
        { id: 'h2', x: 70, y: 40, itemId: 'carta-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Almacén',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600',
      hotspots: [
        { id: 'h3', x: 45, y: 60, itemId: 'casco-1' },
        { id: 'h4', x: 75, y: 35, itemId: 'guante-2' },
      ],
    },
  ],
  items: [
    { id: 'moto-1', name: 'Huella de neumático', type: 'forense', icon: '🛞', result: 'Neumático de moto deportiva. Modelo común entre motociclistas.' },
    { id: 'carta-1', name: 'Carta sin destinatario', type: 'documento', icon: '✉️', result: 'Escrita en 3 idiomas distintos. El asesino domina varios idiomas.' },
    { id: 'casco-1', name: 'Casco olvidado', type: 'evidencia', icon: '🪖', result: 'Casco negro con rayón reciente. Sudor en el interior para análisis.' },
    { id: 'guante-2', name: 'Guante de cuero', type: 'forense', icon: '🧤', result: 'Marcas internas sugieren uso prolongado por motociclista.' },
  ],
  suspects: [
    { id: 's1', name: 'Repartidor nocturno', alibi: 'Dice que solo pasaba por la zona.' },
    { id: 's2', name: 'Dueño del almacén', alibi: 'Cerró a las 6 PM, según registros.' },
    { id: 's3', name: 'Vigilante del puerto', alibi: 'Estaba en su caseta toda la noche.' },
    { id: 's4', name: 'Mecánico de motos', alibi: 'Trabajaba en su taller hasta tarde.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['moto-1', 'guante-2'],
  },
  serialClue: {
    attribute: 'vehicle',
    value: 'Moto',
    text: 'El asesino huyó en una moto negra sin placas.',
  },
};