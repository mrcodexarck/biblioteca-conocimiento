export const CASE_001 = {
  id: 'case-001',
  title: 'El primer naipe',
  briefing:
    'Un contador del Pearl District fue hallado muerto en su oficina. Junto al cuerpo, el asesino dejó un As de Picas. El forense encontró una herida profunda: el ataque vino desde atrás y con la mano izquierda. Es la primera víctima de lo que la prensa ya llama "El Círculo de Portland".',
  coverImage:
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
  difficulty: 2,
  scenes: [
    {
      id: 'scene-1',
      name: 'Oficina del contador',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
      hotspots: [
        { id: 'h1', x: 30, y: 55, itemId: 'naipe-1' },
        { id: 'h2', x: 70, y: 45, itemId: 'taza-1' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Pasillo del edificio',
      image:
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600',
      hotspots: [
        { id: 'h3', x: 45, y: 60, itemId: 'grabacion-1' },
        { id: 'h4', x: 75, y: 35, itemId: 'cigarro-1' },
      ],
    },
  ],
  items: [
    {
      id: 'naipe-1',
      name: 'As de Picas',
      type: 'evidencia',
      icon: '🃏',
      result: 'Naipe limpio, sin huellas. Dejado intencionalmente como firma.',
    },
    {
      id: 'taza-1',
      name: 'Taza de café',
      type: 'forense',
      icon: '☕',
      result: 'Dos tazas: el contador había recibido visita antes de morir.',
    },
    {
      id: 'grabacion-1',
      name: 'Grabación de seguridad',
      type: 'evidencia',
      icon: '📹',
      result: 'Una silueta muy alta sale del edificio a las 22:47. Se agacha al pasar por la puerta.',
    },
    {
      id: 'cigarro-1',
      name: 'Colilla de cigarro',
      type: 'forense',
      icon: '🚬',
      result: 'Marca poco común. Restos de saliva para análisis de ADN.',
    },
  ],
  suspects: [
    { id: 's1', name: 'Socio del contador', alibi: 'Dice que se fue antes de las 8 PM.' },
    { id: 's2', name: 'Vigilante nocturno', alibi: 'Estaba en la garita del sótano.' },
    { id: 's3', name: 'Cliente misterioso', alibi: 'Nadie lo vio entrar. Reservó con nombre falso.' },
    { id: 's4', name: 'Asistente personal', alibi: 'Estaba en su casa cuidando a su gato.' },
  ],
  solution: {
    guiltyId: 's3',
    requiredEvidence: ['naipe-1', 'grabacion-1'],
  },
  serialClue: {
    attribute: 'dominantHand',
    value: 'zurdo',
    text: 'El forense determinó que el ataque vino de un zurdo. El asesino es zurdo.',
  },
};