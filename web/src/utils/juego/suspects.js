/* =========================================================
   30 SOSPECHOSOS - "EL CÍRCULO DE PORTLAND"
   Sin pistas de género. Solo rasgos no obvios.
   ========================================================= */

export const ATTRIBUTES = {
  ageRange: {
    label: 'Edad',
    options: {
      '20-25': '20-25 años',
      '25-30': '25-30 años',
      '30-35': '30-35 años',
      '35-40': '35-40 años',
      '40-50': '40-50 años',
      '50+': 'Más de 50 años',
    },
  },
  hair: {
    label: 'Cabello',
    options: {
      'negro azabache': 'Negro azabache',
      'castaño oscuro': 'Castaño oscuro',
      'castaño claro': 'Castaño claro',
      rubio: 'Rubio',
      'rubio oscuro': 'Rubio oscuro',
      rojo: 'Rojo',
      canoso: 'Canoso',
      teñido: 'Teñido',
    },
  },
  eyes: {
    label: 'Ojos',
    options: {
      marrones: 'Marrones',
      miel: 'Miel',
      azules: 'Azules',
      'azul grisáceo': 'Azul grisáceo',
      verdes: 'Verdes',
      negros: 'Negros',
      heterocromia: 'Heterocromía',
    },
  },
  height: {
    label: 'Altura',
    options: {
      'muy bajo': 'Muy bajo (<1.60m)',
      bajo: 'Bajo (1.60-1.70m)',
      medio: 'Medio (1.70-1.80m)',
      alto: 'Alto (1.80-1.90m)',
      'muy alto': 'Muy alto (>1.90m)',
    },
  },
  weight: {
    label: 'Complexión',
    options: {
      delgado: 'Delgado',
      atlético: 'Atlético',
      medio: 'Medio',
      robusto: 'Robusto',
      obeso: 'Obeso',
    },
  },
  bloodType: {
    label: 'Tipo de sangre',
    options: {
      'A+': 'A+', 'A-': 'A-',
      'B+': 'B+', 'B-': 'B-',
      'O+': 'O+', 'O-': 'O-',
      'AB+': 'AB+', 'AB-': 'AB-',
    },
  },
  maritalStatus: {
    label: 'Estado civil',
    options: {
      Soltero: 'Soltero/a',
      Casado: 'Casado/a',
      Divorciado: 'Divorciado/a',
      Viudo: 'Viudo/a',
    },
  },
  hasRecord: {
    label: 'Antecedentes penales',
    options: {
      Si: 'Con antecedentes',
      No: 'Sin antecedentes',
      Menor: 'Antecedentes menores',
    },
  },
  dominantHand: {
    label: 'Mano dominante',
    options: {
      diestro: 'Diestro',
      zurdo: 'Zurdo',
      ambidiestro: 'Ambidiestro',
    },
  },
  occupation: {
    label: 'Ocupación',
    options: {
      Arquitecto: 'Arquitecto/a',
      Doctor: 'Doctor/a',
      Abogado: 'Abogado/a',
      Ingeniero: 'Ingeniero/a',
      Profesor: 'Profesor/a',
      Periodista: 'Periodista',
      Chef: 'Chef',
      Escritor: 'Escritor/a',
      Musico: 'Músico/a',
      Fotografo: 'Fotógrafo/a',
      Detective: 'Detective privado',
      Empresario: 'Empresario/a',
    },
  },
  district: {
    label: 'Distrito',
    options: {
      'Pearl District': 'Pearl District',
      'Alberta Arts': 'Alberta Arts',
      Hawthorne: 'Hawthorne',
      Sellwood: 'Sellwood',
      'Nob Hill': 'Nob Hill',
      Laurelhurst: 'Laurelhurst',
      Irvington: 'Irvington',
      Montavilla: 'Montavilla',
      Downtown: 'Downtown',
    },
  },
  feature: {
    label: 'Rasgo distintivo',
    options: {
      Cicatriz: 'Cicatriz en la cara',
      Quemadura: 'Quemadura antigua',
      Lunar: 'Lunar visible',
      Gafas: 'Gafas',
      Pendiente: 'Pendiente',
      None: 'Ninguno',
    },
  },
  birthMonth: {
    label: 'Mes de nacimiento',
    options: {
      Ene: 'Enero', Feb: 'Febrero', Mar: 'Marzo', Abr: 'Abril',
      May: 'Mayo', Jun: 'Junio', Jul: 'Julio', Ago: 'Agosto',
      Sep: 'Septiembre', Oct: 'Octubre', Nov: 'Noviembre', Dic: 'Diciembre',
    },
  },
  // ============ NUEVOS ATRIBUTOS NO OBVIOS ============
  tattoo: {
    label: 'Tatuaje',
    options: {
      Ninguno: 'Sin tatuajes',
      Dragon: 'Dragón en el brazo',
      Rosa: 'Rosa en la muñeca',
      Ancla: 'Ancla en el antebrazo',
      Estrella: 'Estrella en el cuello',
      Serpiente: 'Serpiente en la espalda',
      Mariposa: 'Mariposa en el tobillo',
      Leon: 'León en el pecho',
      Ave: 'Ave en el hombro',
    },
  },
  pet: {
    label: 'Mascota',
    options: {
      Ninguna: 'Sin mascota',
      Gato: 'Tiene gato',
      Perro: 'Tiene perro',
      Loro: 'Tiene loro',
      Pez: 'Tiene peces',
      Conejo: 'Tiene conejo',
      Serpiente: 'Tiene serpiente',
    },
  },
  vehicle: {
    label: 'Vehículo',
    options: {
      Ninguno: 'Sin vehículo',
      Moto: 'Moto',
      'Auto rojo': 'Auto rojo',
      'Auto negro': 'Auto negro',
      'Camioneta': 'Camioneta',
      Bicicleta: 'Bicicleta',
      Taxi: 'Usa taxi siempre',
    },
  },
  languages: {
    label: 'Idiomas',
    options: {
      1: 'Solo 1 idioma',
      2: 'Habla 2 idiomas',
      3: 'Habla 3 idiomas',
      '4+': 'Habla 4+ idiomas',
    },
  },
  sport: {
    label: 'Deporte',
    options: {
      Ninguno: 'No practica deporte',
      Boxeo: 'Practica boxeo',
      Yoga: 'Practica yoga',
      Natacion: 'Practica natación',
      Ajedrez: 'Juega ajedrez',
      Tenis: 'Juega tenis',
      Escalada: 'Practica escalada',
      Correr: 'Corre maratones',
    },
  },
  allergy: {
    label: 'Alergia',
    options: {
      Ninguna: 'Sin alergias',
      Penicilina: 'Alérgico a penicilina',
      Lactosa: 'Alérgico a la lactosa',
      Gluten: 'Alérgico al gluten',
      Cacahuetes: 'Alérgico a cacahuetes',
      Mariscos: 'Alérgico a mariscos',
      Polen: 'Alérgico al polen',
    },
  },
  music: {
    label: 'Música favorita',
    options: {
      Clasica: 'Música clásica',
      Jazz: 'Jazz',
      Rock: 'Rock',
      Electronica: 'Electrónica',
      Reggaeton: 'Reggaetón',
      Cumbia: 'Cumbia',
      Opera: 'Ópera',
      Ninguna: 'Ninguna en especial',
    },
  },
  zodiac: {
    label: 'Signo zodiacal',
    options: {
      Aries: 'Aries', Tauro: 'Tauro', Geminis: 'Géminis', Cancer: 'Cáncer',
      Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Escorpio: 'Escorpio',
      Sagitario: 'Sagitario', Capricornio: 'Capricornio', Acuario: 'Acuario', Piscis: 'Piscis',
    },
  },
};

/* =========================================================
   ASESINO: Diego Vargas (s02)
   ========================================================= */
export const KILLER_ID = 's02';

export const SUSPECTS = [
  { id: 's01', name: 'Marcus Bell', ageRange: '40-50', hair: 'negro azabache', eyes: 'marrones', height: 'medio', weight: 'robusto', bloodType: 'A+', maritalStatus: 'Casado', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Periodista', district: 'Alberta Arts', feature: 'Pendiente', birthMonth: 'Jul', tattoo: 'Ninguno', pet: 'Perro', vehicle: 'Auto negro', languages: 2, sport: 'Ninguno', allergy: 'Ninguna', music: 'Rock', zodiac: 'Cancer' },

  { id: 's02', name: 'Diego Vargas', ageRange: '30-35', hair: 'castaño oscuro', eyes: 'azul grisáceo', height: 'muy alto', weight: 'atlético', bloodType: 'AB-', maritalStatus: 'Divorciado', hasRecord: 'Si', dominantHand: 'zurdo', occupation: 'Arquitecto', district: 'Pearl District', feature: 'Cicatriz', birthMonth: 'Mar', tattoo: 'Serpiente', pet: 'Serpiente', vehicle: 'Moto', languages: '4+', sport: 'Boxeo', allergy: 'Penicilina', music: 'Clasica', zodiac: 'Piscis' },

  { id: 's03', name: 'Sarah Chen', ageRange: '30-35', hair: 'negro azabache', eyes: 'marrones', height: 'medio', weight: 'medio', bloodType: 'O+', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Doctor', district: 'Pearl District', feature: 'None', birthMonth: 'May', tattoo: 'Estrella', pet: 'Gato', vehicle: 'Bicicleta', languages: 3, sport: 'Yoga', allergy: 'Lactosa', music: 'Jazz', zodiac: 'Tauro' },

  { id: 's04', name: 'Robert Kessler', ageRange: '40-50', hair: 'rubio', eyes: 'verdes', height: 'alto', weight: 'medio', bloodType: 'B+', maritalStatus: 'Casado', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Abogado', district: 'Hawthorne', feature: 'Gafas', birthMonth: 'Feb', tattoo: 'Ninguno', pet: 'Perro', vehicle: 'Auto negro', languages: 2, sport: 'Tenis', allergy: 'Ninguna', music: 'Clasica', zodiac: 'Acuario' },

  { id: 's05', name: 'Elena Ortiz', ageRange: '20-25', hair: 'castaño claro', eyes: 'marrones', height: 'medio', weight: 'delgado', bloodType: 'A-', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Fotografo', district: 'Hawthorne', feature: 'Lunar', birthMonth: 'Ago', tattoo: 'Mariposa', pet: 'Gato', vehicle: 'Bicicleta', languages: 2, sport: 'Yoga', allergy: 'Gluten', music: 'Electronica', zodiac: 'Leo' },

  { id: 's06', name: 'Thomas Riley', ageRange: '25-30', hair: 'castaño oscuro', eyes: 'marrones', height: 'bajo', weight: 'delgado', bloodType: 'O-', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Chef', district: 'Sellwood', feature: 'None', birthMonth: 'Nov', tattoo: 'Ancla', pet: 'Perro', vehicle: 'Moto', languages: 1, sport: 'Correr', allergy: 'Mariscos', music: 'Rock', zodiac: 'Escorpio' },

  { id: 's07', name: 'Naomi Foster', ageRange: '30-35', hair: 'rubio', eyes: 'azules', height: 'alto', weight: 'atlético', bloodType: 'B-', maritalStatus: 'Divorciado', hasRecord: 'Si', dominantHand: 'diestro', occupation: 'Arquitecto', district: 'Pearl District', feature: 'Cicatriz', birthMonth: 'Mar', tattoo: 'Rosa', pet: 'Gato', vehicle: 'Auto rojo', languages: 2, sport: 'Escalada', allergy: 'Ninguna', music: 'Rock', zodiac: 'Aries' },

  { id: 's08', name: 'Victor Alvarez', ageRange: '30-35', hair: 'negro azabache', eyes: 'marrones', height: 'muy alto', weight: 'robusto', bloodType: 'AB+', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Ingeniero', district: 'Laurelhurst', feature: 'Quemadura', birthMonth: 'Dic', tattoo: 'Leon', pet: 'Perro', vehicle: 'Camioneta', languages: 2, sport: 'Boxeo', allergy: 'Ninguna', music: 'Rock', zodiac: 'Sagitario' },

  { id: 's09', name: 'Hannah Brooks', ageRange: '40-50', hair: 'castaño oscuro', eyes: 'verdes', height: 'medio', weight: 'medio', bloodType: 'A+', maritalStatus: 'Divorciado', hasRecord: 'No', dominantHand: 'zurdo', occupation: 'Abogado', district: 'Irvington', feature: 'Gafas', birthMonth: 'Abr', tattoo: 'Ninguno', pet: 'Gato', vehicle: 'Auto negro', languages: 3, sport: 'Yoga', allergy: 'Polen', music: 'Clasica', zodiac: 'Tauro' },

  { id: 's10', name: 'Jonathan Price', ageRange: '50+', hair: 'canoso', eyes: 'azules', height: 'alto', weight: 'medio', bloodType: 'O+', maritalStatus: 'Viudo', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Profesor', district: 'Nob Hill', feature: 'Gafas', birthMonth: 'Ene', tattoo: 'Ninguno', pet: 'Perro', vehicle: 'Auto negro', languages: 3, sport: 'Ajedrez', allergy: 'Ninguna', music: 'Opera', zodiac: 'Capricornio' },

  { id: 's11', name: 'Amelia Grant', ageRange: '20-25', hair: 'rubio', eyes: 'azules', height: 'bajo', weight: 'delgado', bloodType: 'A-', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Chef', district: 'Alberta Arts', feature: 'None', birthMonth: 'Jun', tattoo: 'Rosa', pet: 'Conejo', vehicle: 'Bicicleta', languages: 1, sport: 'Yoga', allergy: 'Lactosa', music: 'Reggaeton', zodiac: 'Geminis' },

  { id: 's12', name: 'Andrés Barajas', ageRange: '40-50', hair: 'castaño claro', eyes: 'marrones', height: 'medio', weight: 'robusto', bloodType: 'B+', maritalStatus: 'Casado', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Fotografo', district: 'Montavilla', feature: 'Lunar', birthMonth: 'Sep', tattoo: 'Ave', pet: 'Perro', vehicle: 'Camioneta', languages: 2, sport: 'Ninguno', allergy: 'Mariscos', music: 'Cumbia', zodiac: 'Virgo' },

  { id: 's13', name: 'Fiona Walsh', ageRange: '50+', hair: 'canoso', eyes: 'azules', height: 'medio', weight: 'medio', bloodType: 'AB+', maritalStatus: 'Viudo', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Profesor', district: 'Nob Hill', feature: 'Gafas', birthMonth: 'Oct', tattoo: 'Ninguno', pet: 'Gato', vehicle: 'Ninguno', languages: 3, sport: 'Ajedrez', allergy: 'Polen', music: 'Clasica', zodiac: 'Libra' },

  { id: 's14', name: 'David Nakamura', ageRange: '30-35', hair: 'negro azabache', eyes: 'marrones', height: 'muy alto', weight: 'atlético', bloodType: 'A+', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Arquitecto', district: 'Alberta Arts', feature: 'None', birthMonth: 'May', tattoo: 'Dragon', pet: 'Serpiente', vehicle: 'Moto', languages: 2, sport: 'Escalada', allergy: 'Ninguna', music: 'Electronica', zodiac: 'Tauro' },

  { id: 's15', name: 'Priya Patel', ageRange: '30-35', hair: 'negro azabache', eyes: 'marrones', height: 'medio', weight: 'delgado', bloodType: 'O+', maritalStatus: 'Casado', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Ingeniero', district: 'Laurelhurst', feature: 'Pendiente', birthMonth: 'Feb', tattoo: 'Ninguno', pet: 'Gato', vehicle: 'Auto rojo', languages: 3, sport: 'Yoga', allergy: 'Lactosa', music: 'Clasica', zodiac: 'Acuario' },

  { id: 's16', name: 'Gregory Stone', ageRange: '50+', hair: 'canoso', eyes: 'miel', height: 'bajo', weight: 'obeso', bloodType: 'B-', maritalStatus: 'Divorciado', hasRecord: 'Si', dominantHand: 'diestro', occupation: 'Periodista', district: 'Sellwood', feature: 'Pendiente', birthMonth: 'Nov', tattoo: 'Ninguno', pet: 'Perro', vehicle: 'Auto negro', languages: 1, sport: 'Ninguno', allergy: 'Mariscos', music: 'Jazz', zodiac: 'Escorpio' },

  { id: 's17', name: 'Laura Winters', ageRange: '20-25', hair: 'rubio', eyes: 'verdes', height: 'muy alto', weight: 'atlético', bloodType: 'A+', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Arquitecto', district: 'Pearl District', feature: 'Lunar', birthMonth: 'Jul', tattoo: 'Mariposa', pet: 'Gato', vehicle: 'Bicicleta', languages: 2, sport: 'Correr', allergy: 'Gluten', music: 'Electronica', zodiac: 'Cancer' },

  { id: 's18', name: 'Miguel Santos', ageRange: '20-25', hair: 'negro azabache', eyes: 'azules', height: 'medio', weight: 'atlético', bloodType: 'O-', maritalStatus: 'Soltero', hasRecord: 'Menor', dominantHand: 'zurdo', occupation: 'Musico', district: 'Hawthorne', feature: 'Quemadura', birthMonth: 'Ago', tattoo: 'Dragon', pet: 'Ninguno', vehicle: 'Moto', languages: 2, sport: 'Boxeo', allergy: 'Ninguna', music: 'Rock', zodiac: 'Leo' },

  { id: 's19', name: 'Rachel Adams', ageRange: '40-50', hair: 'rojo', eyes: 'verdes', height: 'medio', weight: 'medio', bloodType: 'AB-', maritalStatus: 'Divorciado', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Periodista', district: 'Montavilla', feature: 'Cicatriz', birthMonth: 'Mar', tattoo: 'Ninguno', pet: 'Perro', vehicle: 'Auto rojo', languages: 3, sport: 'Tenis', allergy: 'Penicilina', music: 'Jazz', zodiac: 'Piscis' },

  { id: 's20', name: 'Samuel Kaplan', ageRange: '30-35', hair: 'rubio oscuro', eyes: 'verdes', height: 'muy alto', weight: 'atlético', bloodType: 'AB-', maritalStatus: 'Casado', hasRecord: 'No', dominantHand: 'zurdo', occupation: 'Doctor', district: 'Pearl District', feature: 'Gafas', birthMonth: 'May', tattoo: 'Ninguno', pet: 'Gato', vehicle: 'Auto negro', languages: 3, sport: 'Natacion', allergy: 'Ninguna', music: 'Clasica', zodiac: 'Tauro' },

  { id: 's21', name: 'Isabella Romano', ageRange: '30-35', hair: 'castaño claro', eyes: 'marrones', height: 'alto', weight: 'delgado', bloodType: 'O+', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Fotografo', district: 'Sellwood', feature: 'Lunar', birthMonth: 'Feb', tattoo: 'Mariposa', pet: 'Gato', vehicle: 'Bicicleta', languages: 2, sport: 'Yoga', allergy: 'Lactosa', music: 'Electronica', zodiac: 'Acuario' },

  { id: 's22', name: 'Oliver Bennett', ageRange: '40-50', hair: 'castaño oscuro', eyes: 'marrones', height: 'alto', weight: 'obeso', bloodType: 'B+', maritalStatus: 'Casado', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Escritor', district: 'Irvington', feature: 'Pendiente', birthMonth: 'Ene', tattoo: 'Ninguno', pet: 'Perro', vehicle: 'Camioneta', languages: 3, sport: 'Ajedrez', allergy: 'Ninguna', music: 'Opera', zodiac: 'Capricornio' },

  { id: 's23', name: 'Valentina Cruz', ageRange: '20-25', hair: 'negro azabache', eyes: 'marrones', height: 'medio', weight: 'delgado', bloodType: 'A-', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Musico', district: 'Alberta Arts', feature: 'Lunar', birthMonth: 'Dic', tattoo: 'Estrella', pet: 'Conejo', vehicle: 'Bicicleta', languages: 2, sport: 'Yoga', allergy: 'Cacahuetes', music: 'Reggaeton', zodiac: 'Sagitario' },

  { id: 's24', name: 'Henry Walsh', ageRange: '50+', hair: 'canoso', eyes: 'verdes', height: 'medio', weight: 'medio', bloodType: 'A+', maritalStatus: 'Viudo', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Abogado', district: 'Nob Hill', feature: 'None', birthMonth: 'Jun', tattoo: 'Ninguno', pet: 'Gato', vehicle: 'Auto negro', languages: 2, sport: 'Ajedrez', allergy: 'Ninguna', music: 'Opera', zodiac: 'Geminis' },

  { id: 's25', name: 'Nadia Hassan', ageRange: '30-35', hair: 'castaño claro', eyes: 'marrones', height: 'bajo', weight: 'delgado', bloodType: 'B-', maritalStatus: 'Soltero', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Doctor', district: 'Pearl District', feature: 'Gafas', birthMonth: 'Oct', tattoo: 'Ninguno', pet: 'Gato', vehicle: 'Auto rojo', languages:'4+', allergy: 'Gluten', music: 'Clasica', zodiac: 'Libra' },

  { id: 's26', name: "Patrick O'Brien", ageRange: '25-30', hair: 'rojo', eyes: 'verdes', height: 'alto', weight: 'atlético', bloodType: 'O+', maritalStatus: 'Soltero', hasRecord: 'Menor', dominantHand: 'diestro', occupation: 'Chef', district: 'Laurelhurst', feature: 'Lunar', birthMonth: 'Abr', tattoo: 'Ancla', pet: 'Perro', vehicle: 'Moto', languages: 1, sport: 'Correr', allergy: 'Mariscos', music: 'Rock', zodiac: 'Aries' },

  { id: 's27', name: 'Yuki Tanaka', ageRange: '40-50', hair: 'negro azabache', eyes: 'marrones', height: 'bajo', weight: 'delgado', bloodType: 'AB+', maritalStatus: 'Divorciado', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Escritor', district: 'Irvington', feature: 'None', birthMonth: 'Jul', tattoo: 'Ninguno', pet: 'Pez', vehicle: 'Bicicleta', languages:'4+',sport: 'Ajedrez', allergy: 'Ninguna', music: 'Clasica', zodiac: 'Cancer' },

  { id: 's28', name: 'Andrés Molina', ageRange: '30-35', hair: 'castaño oscuro', eyes: 'marrones', height: 'bajo', weight: 'robusto', bloodType: 'O-', maritalStatus: 'Soltero', hasRecord: 'Si', dominantHand: 'zurdo', occupation: 'Musico', district: 'Montavilla', feature: 'Cicatriz', birthMonth: 'Mar', tattoo: 'Dragon', pet: 'Ninguno', vehicle: 'Moto', languages: 2, sport: 'Ninguno', allergy: 'Ninguna', music: 'Rock', zodiac: 'Piscis' },

  { id: 's29', name: 'Katherine Hayes', ageRange: '50+', hair: 'canoso', eyes: 'verdes', height: 'medio', weight: 'medio', bloodType: 'A-', maritalStatus: 'Viudo', hasRecord: 'No', dominantHand: 'diestro', occupation: 'Abogado', district: 'Hawthorne', feature: 'Cicatriz', birthMonth: 'Nov', tattoo: 'Ninguno', pet: 'Perro', vehicle: 'Auto negro', languages: 3, sport: 'Ninguno', allergy: 'Polen', music: 'Jazz', zodiac: 'Escorpio' },

  { id: 's30', name: 'Diana Sterling', ageRange: '30-35', hair: 'rojo', eyes: 'azules', height: 'alto', weight: 'atlético', bloodType: 'B+', maritalStatus: 'Divorciado', hasRecord: 'Menor', dominantHand: 'diestro', occupation: 'Periodista', district: 'Montavilla', feature: 'Pendiente', birthMonth: 'Sep', tattoo: 'Ave', pet: 'Loro', vehicle: 'Auto rojo', languages: 3, sport: 'Correr', allergy: 'Cacahuetes', music: 'Rock', zodiac: 'Virgo' },
];