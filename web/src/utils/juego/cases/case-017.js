export const CASE_017 = {
  id: 'case-017',
  title: 'El anillo solitario',
  briefing:
    'Una médica del Pearl District fue asesinada en su consultorio. En su mano tenía un anillo que no era suyo: un anillo de divorcio masculino, grabado con la fecha 15 de marzo. El asesino dejó caer parte de su historia. El naipe: una Jota de Picas.',
  coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200',
  difficulty: 3,
  scenes: [
    {
      id: 'scene-1',
      name: 'Consultorio médico',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600',
      hotspots: [
        { id: 'h1', x: 40, y: 55, itemId: 'naipe-17' },
        { id: 'h2', x: 70, y: 40, itemId: 'anillo-17' },
      ],
    },
    {
      id: 'scene-2',
      name: 'Sala de espera',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600',
      hotspots: [
        { id: 'h3', x: 55, y: 60, itemId: 'registro-17' },
      ],
    },
  ],
  items: [
    { id: 'naipe-17', name: 'Jota de Picas', type: 'evidencia', icon: '🃏', result: 'Dejado sobre el escritorio médico.' },
    { id: 'anillo-17', name: 'Anillo de divorcio', type: 'evidencia', icon: '💍', result: 'Grabado interior: "Marzo 15 - Hasta que la muerte nos separe".' },
    { id: 'registro-17', name: 'Registro de pacientes', type: 'documento', icon: '📋', result: 'Un paciente acudió el día anterior bajo un nombre falso. Estaba divorciado.' },
  ],
  suspects: [
    { id: 's1', name: 'Enfermera del turno', alibi: 'Salió 20 minutos antes del crimen.' },
    { id: 's2', name: 'Paciente con cita', alibi: 'Canceló la cita esa misma mañana.' },
    { id: 's3', name: 'Administrador', alibi: 'Estaba en su oficina revisando expedientes.' },
    { id: 's4', name: 'Paciente sin cita', alibi: 'Nadie lo recuerda, pero firmó como "Diego M."' },
  ],
  solution: {
    guiltyId: 's4',
    requiredEvidence: ['anillo-17', 'registro-17'],
  },
  serialClue: {
    attribute: 'maritalStatus',
    value: 'Divorciado',
    text: 'El anillo de divorcio olvidado en la escena: el asesino está divorciado.',
  },
};