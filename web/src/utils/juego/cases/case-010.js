export const CASE_010 = {
  id: 'case-010',
  title: 'El signo del zodiaco',
  briefing: 'Un astrólogo del Alberta Arts fue hallado sin vida en su estudio. En la pared, escrito con sangre, apareció el símbolo de Piscis. El asesino quiso dejar claro su signo. Es la pista más directa hasta ahora.',
  coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200',
  difficulty: 4,
  scenes: [
    {
      id: 'scene-1',
      name: 'Estudio astrológico',
      image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1600',
      hotspots: [
        { id: 'h1', x: 30, y: 50, itemId: 'simbolo-1' },
        { id: 'h2', x: 70, y: 60, itemId: 'carta-2' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Biblioteca oculta',
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600',
      hotspots: [
        { id: 'h3', x: 50, y: 55, itemId: 'diario-1' },
      ],
    },
  ],
  items: [
    { id: 'simbolo-1', name: 'Símbolo de Piscis', type: 'evidencia', icon: '♓', result: 'Escrito con sangre en la pared. Deliberado y limpio.' },
    { id: 'carta-2', name: 'Carta astral', type: 'documento', icon: '📜', result: 'Carta astral del propio asesino. Coincide con Piscis.' },
    { id: 'diario-1', name: 'Diario del astrólogo', type: 'documento', icon: '📔', result: 'Última entrada: "Un Piscis me visitó hoy. Peligroso."' },
  ],
  suspects: [
    { id: 's1', name: 'Cliente regular', alibi: 'Estaba en su casa leyendo.' },
    { id: 's2', name: 'Periodista esotérico', alibi: 'Cubría un evento en Downtown.' },
    { id: 's3', name: 'Astrólogo rival', alibi: 'Asegura que la víctima era su amigo.' },
    { id: 's4', name: 'Hombre enigmático', alibi: 'No dio nombre al entrar al estudio.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['simbolo-1', 'diario-1'],
  },
  serialClue: {
    attribute: 'zodiac',
    value: 'Piscis',
    text: 'Un símbolo de Piscis quedó grabado en la pared con sangre. Su signo.',
  },
};