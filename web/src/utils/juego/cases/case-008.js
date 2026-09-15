export const CASE_008 = {
  id: 'case-008',
  title: 'El antibiótico prohibido',
  briefing: 'Una farmacéutica del Pearl District fue encontrada sin vida en su laboratorio. En la escena, junto al cuerpo, había un frasco de antibióticos alternativos a la penicilina. El asesino dejó su rastro médico sin saberlo.',
  coverImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Laboratorio',
      image: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 55, itemId: 'frasco-1' },
        { id: 'h2', x: 70, y: 40, itemId: 'receta-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Despacho',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 60, itemId: 'historial-1' },
      ],
    },
  ],
  items: [
    { id: 'frasco-1', name: 'Frasco de antibiótico', type: 'evidencia', icon: '💊', result: 'Antibiótico alternativo a la penicilina. Receta a nombre desconocido.' },
    { id: 'receta-1', name: 'Receta médica', type: 'documento', icon: '📋', result: 'Paciente alérgico a la penicilina. Firma del doctor borrada.' },
    { id: 'historial-1', name: 'Historial clínico', type: 'documento', icon: '🗂️', result: 'Lista de pacientes alérgicos. Uno de ellos es desconocido.' },
  ],
  suspects: [
    { id: 's1', name: 'Químico del laboratorio', alibi: 'Estaba cerrando el turno de noche.' },
    { id: 's2', name: 'Médico asociado', alibi: 'Recetaba a varios pacientes ese día.' },
    { id: 's3', name: 'Visitador médico', alibi: 'Solo vino a dejar muestras.' },
    { id: 's4', name: 'Paciente desconocido', alibi: 'Nadie lo ha visto antes en el laboratorio.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['frasco-1', 'historial-1'],
  },
  serialClue: {
    attribute: 'allergy',
    value: 'Penicilina',
    text: 'En la escena había un frasco de antibióticos alternativos: el asesino es alérgico a la penicilina.',
  },
};