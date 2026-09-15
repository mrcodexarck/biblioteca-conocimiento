export const CASE_002 = {
  id: 'case-002',
  title: 'La Liga de los Pelirrojos',
  briefing: 'El Sr. Wilson, un prestamista pelirrojo, ha sido víctima de un extraño engaño. Un anuncio le ofreció un trabajo bien pagado por copiar la Enciclopedia Británica, pero un día la oficina desapareció sin dejar rastro. Holmes sospecha que el propósito real era alejarlo de su negocio de empeños. Tu misión es descubrir el motivo real de esta farsa.',
  coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Tienda de empeños',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600',
      hotspots: [
        { id: 'h1', x: 35, y: 65, itemId: 'libro-1' },
        { id: 'h2', x: 65, y: 40, itemId: 'llave-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Oficina abandonada',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
      hotspots: [
        { id: 'h3', x: 50, y: 55, itemId: 'anuncio-1' },
        { id: 'h4', x: 20, y: 75, itemId: 'carta-1' },
      ],
    },
    {
      id: 'scene-3',
      name: 'Túnel subterráneo',
      image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1600',
      hotspots: [
        { id: 'h5', x: 70, y: 50, itemId: 'pico-1' },
        { id: 'h6', x: 30, y: 30, itemId: 'mapa-1' },
      ],
    },
  ],
  items: [
    { id: 'libro-1', name: 'Enciclopedia Británica', type: 'documento', icon: '📚', result: 'Páginas copiadas a mano. Solo las primeras 50 páginas de cada tomo.' },
    { id: 'llave-1', name: 'Llave antigua', type: 'evidencia', icon: '🔑', result: 'Llave que abre la puerta trasera de la tienda. No es del Sr. Wilson.' },
    { id: 'anuncio-1', name: 'Anuncio de la liga', type: 'documento', icon: '📰', result: 'Firmado por "Duncan Ross". Nombre falso.' },
    { id: 'carta-1', name: 'Carta amenazante', type: 'documento', icon: '✉️', result: 'Amenaza al Sr. Wilson para que no investigue. Menciona un banco cercano.' },
    { id: 'pico-1', name: 'Pico de minero', type: 'evidencia', icon: '⛏️', result: 'Usado para cavar un túnel hacia la bóveda del banco.' },
    { id: 'mapa-1', name: 'Plano del banco', type: 'documento', icon: '🗺️', result: 'Muestra la ubicación de la bóveda y el túnel que la conecta con la tienda de empeños.' },
  ],
  suspects: [
    { id: 's1', name: 'John Clay', alibi: 'Dice ser un comerciante de seda.' },
    { id: 's2', name: 'Duncan Ross', alibi: 'Afirma ser el fundador de la liga.' },
    { id: 's3', name: 'Sr. Wilson', alibi: 'Es la víctima que reportó el engaño.' },
    { id: 's4', name: 'Archie (empleado)', alibi: 'Trabaja en la tienda de empeños.' },
  ],
  solution: {
    guiltyId: 's1',
    requiredEvidence: ['mapa-1', 'pico-1'],
  },
};