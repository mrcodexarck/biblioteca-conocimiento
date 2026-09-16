export const CASE_020 = {
  id: 'case-020',
  title: 'El As de Picas',
  briefing:
    'El círculo se cierra. Un arquitecto del Pearl District fue hallado muerto en su propio estudio. En su mano tenía un As de Picas — el mismo naipe con el que empezó todo. Pero esta vez, junto al cuerpo, hay un archivo con el nombre completo del asesino. Este es el final de la historia.',
  coverImage: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200',
  difficulty: 5,
  scenes: [
    {
      id: 'scene-1',
      name: 'Estudio del arquitecto',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
      hotspots: [
        { id: 'h1', x: 35, y: 55, itemId: 'naipe-20' },
        { id: 'h2', x: 70, y: 40, itemId: 'archivo-20' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Oficina oculta',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 55, itemId: 'foto-20' },
        { id: 'h4', x: 25, y: 70, itemId: 'moto-20' },
      ],
    },
  ],
  items: [
    { id: 'naipe-20', name: 'As de Picas', type: 'evidencia', icon: '🃏', result: 'En la mano de la víctima. El ciclo se cierra.' },
    { id: 'archivo-20', name: 'Archivo clasificado', type: 'documento', icon: '📁', result: 'Contiene el nombre completo, foto y dirección del asesino. Diego Vargas.' },
    { id: 'foto-20', name: 'Fotografía revelada', type: 'evidencia', icon: '📸', result: 'Selfie oculta del asesino frente al espejo. Se ve la serpiente en la espalda.' },
    { id: 'moto-20', name: 'Llave de moto', type: 'evidencia', icon: '🔑', result: 'Llave de la moto negra sin placas que usa el asesino.' },
  ],
  suspects: [
    { id: 's1', name: 'Colega arquitecto', alibi: 'Asegura que la víctima era su mejor amigo.' },
    { id: 's2', name: 'Secretaria del estudio', alibi: 'Estaba de vacaciones esos días.' },
    { id: 's3', name: 'Cliente del arquitecto', alibi: 'Solo pasó a firmar unos papeles.' },
    { id: 's4', name: 'Diego Vargas', alibi: 'Arquitecto del Pearl District. Divorciado. Sin coartada verificable.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['archivo-20', 'foto-20'],
  },
  serialClue: {
    attribute: 'district',
    value: 'Pearl District',
    text: 'El asesino opera y vive en el Pearl District. Su nombre: Diego Vargas.',
  },
};