export const CASE_016 = {
  id: 'case-016',
  title: 'La ficha antigua',
  briefing:
    'Un policía retirado fue asesinado en su casa del Hawthorne. Antes de morir, había estado investigando por su cuenta al asesino serial. Logró enviar un mensaje final: "Coincide con un expediente antiguo". El naipe: un Diez de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200',
  difficulty: 4,
  scenes: [
    {
      id: 'scene-1',
      name: 'Casa del policía',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600',
      hotspots: [
        { id: 'h1', x: 35, y: 55, itemId: 'naipe-16' },
        { id: 'h2', x: 70, y: 45, itemId: 'expediente-16' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Sótano archivo',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600',
      hotspots: [
        { id: 'h3', x: 50, y: 60, itemId: 'caja-16' },
      ],
    },
  ],
  items: [
    { id: 'naipe-16', name: 'Diez de Picas', type: 'evidencia', icon: '🃏', result: 'Colocado sobre el pecho del policía.' },
    { id: 'expediente-16', name: 'Expediente antiguo', type: 'documento', icon: '📁', result: 'Caso sin resolver de hace 15 años. Mismo modus operandi.' },
    { id: 'caja-16', name: 'Caja con fotos', type: 'evidencia', icon: '📦', result: 'Fotos de sospechosos de hace 15 años. Una con anotación: "revisar antecedentes".' },
  ],
  suspects: [
    { id: 's1', name: 'Excompañero policía', alibi: 'Estaba en una reunión de veteranos.' },
    { id: 's2', name: 'Fiscal jubilado', alibi: 'Ayudaba al policía con el caso antiguo.' },
    { id: 's3', name: 'Periodista de investigación', alibi: 'Publicó un artículo sobre el caso hace un mes.' },
    { id: 's4', name: 'Exconvicto', alibi: 'Salió de prisión hace 5 años. Nuevo nombre.' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['expediente-16', 'caja-16'],
  },
  serialClue: {
    attribute: 'hasRecord',
    value: 'Si',
    text: 'El asesino tiene antecedentes penales: coincide con un expediente antiguo.',
  },
};