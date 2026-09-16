export const CASE_019 = {
  id: 'case-019',
  title: 'El plano del asesino',
  briefing:
    'Un ingeniero del Laurelhurst fue asesinado en su estudio de trabajo. Sobre el escritorio, unos planos arquitectónicos marcados con símbolos extraños. Los planos eran de edificios donde ya había matado. El asesino conoce de arquitectura. El naipe: un Rey de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
  difficulty: 4,
  scenes: [
    {
      id: 'scene-1',
      name: 'Estudio del ingeniero',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 55, itemId: 'naipe-19' },
        { id: 'h2', x: 70, y: 40, itemId: 'planos-19' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Archivo de planos',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 60, itemId: 'sello-19' },
      ],
    },
  ],
  items: [
    { id: 'naipe-19', name: 'Rey de Picas', type: 'evidencia', icon: '🃏', result: 'Sobre los planos. Firma del asesino.' },
    { id: 'planos-19', name: 'Planos marcados', type: 'documento', icon: '📐', result: 'Marcas en edificios donde ya ocurrieron asesinatos. El asesino planea cada crimen.' },
    { id: 'sello-19', name: 'Sello profesional', type: 'evidencia', icon: '🔖', result: 'Sello de arquitecto de un estudio del Pearl District. Firma borrada.' },
  ],
  suspects: [
    { id: 's1', name: 'Colega ingeniero', alibi: 'Trabajaba en un proyecto en Downtown.' },
    { id: 's2', name: 'Profesor de arquitectura', alibi: 'Daba clase esa noche.' },
    { id: 's3', name: 'Estudiante avanzado', alibi: 'Estaba en la biblioteca pública.' },
    { id: 's4', name: 'Arquitecto consultor', alibi: 'Visitaba Portland por trabajo. Nadie lo ha visto antes.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['planos-19', 'sello-19'],
  },
  serialClue: {
    attribute: 'occupation',
    value: 'Arquitecto',
    text: 'Los planos y sellos profesionales confirman: el asesino es arquitecto.',
  },
};