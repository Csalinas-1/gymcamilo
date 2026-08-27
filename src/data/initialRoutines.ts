import type { WorkoutDay } from '../types/workout'

export const INITIAL_ROUTINES: WorkoutDay[] = [
  {
    id: 'lunes-leg-day',
    dayName: 'Lunes',
    title: 'Piernas, Glúteos & Core',
    tagline: 'Fuerza + Hipertrofia y Estabilidad',
    banner: '/assets/banner_leg_day.jpg',
    accentColor: 'emerald',
    exercises: [
      {
        id: 'lun-prensa-45',
        name: 'Prensa 45°',
        targetMuscles: 'Cuádriceps, Glúteos',
        defaultSets: 4,
        repRange: '10-12',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Hack squat / Smith',
        objective: 'Fuerza + masa',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=prensa+45+grados+tecnica+correcta',
        techniqueCues: [
          'Pies a la anchura de hombros en el centro de la plataforma',
          'Bajar de forma controlada hasta ~90° sin despegar la zona lumbar del respaldo',
          'Empujar con los talones y no bloquear las rodillas al extender'
        ]
      },
      {
        id: 'lun-rdl-mancuernas',
        name: 'Peso muerto rumano con mancuernas',
        targetMuscles: 'Isquiotibiales, Glúteos',
        defaultSets: 3,
        repRange: '10',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Curl femoral',
        objective: 'Masa muscular',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=peso+muerto+rumano+mancuernas+tecnica',
        techniqueCues: [
          'Mantener la espalda neutra y hombros bloqueados hacia atrás',
          'Empujar las caderas hacia atrás flexionando ligeramente las rodillas',
          'Sentir la tensión en isquiotibiales al bajar'
        ]
      },
      {
        id: 'lun-ext-cuadriceps',
        name: 'Extensión de cuádriceps',
        targetMuscles: 'Cuádriceps',
        defaultSets: 3,
        repRange: '12-15',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Máquina extensión Smart Fit',
        objective: 'Hipertrofia',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=extension+de+cuadriceps+maquina+tecnica',
        techniqueCues: [
          'Alinear el eje de la rodilla con el pivote de la máquina',
          'Pausa de 1 segundo arriba apretando los cuádriceps',
          'Controlar la bajada en 2-3 segundos'
        ]
      },
      {
        id: 'lun-curl-femoral',
        name: 'Curl femoral',
        targetMuscles: 'Isquiotibiales',
        defaultSets: 3,
        repRange: '12-15',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Máquina curl tumbado / sentado',
        objective: 'Hipertrofia',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+femoral+maquina+tecnica',
        techniqueCues: [
          'Mantener las caderas pegadas al banco durante toda la flexión',
          'Evitar dar tirones con la espalda baja'
        ]
      },
      {
        id: 'lun-gemelos',
        name: 'Gemelos',
        targetMuscles: 'Pantorrillas',
        defaultSets: 3,
        repRange: '15-20',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Prensa para pantorrillas',
        objective: 'Fortalecimiento',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=elevacion+de+talones+gemelos+prensa',
        techniqueCues: [
          'Rango de recorrido completo: estirar abajo 1s y contraer arriba 1s'
        ]
      },
      {
        id: 'lun-pallof-press',
        name: 'Pallof press',
        targetMuscles: 'Core / Antirotación',
        defaultSets: 3,
        repRange: '12 por lado',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Polea a la altura del pecho',
        objective: 'Estabilidad',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=pallof+press+polea+tecnica',
        techniqueCues: [
          'Postura atlética, abdomen activo, extender brazos sin permitir que el torso rote'
        ]
      },
      {
        id: 'lun-caminata-inclinada',
        name: 'Caminata inclinada',
        targetMuscles: 'Cardiovascular',
        defaultSets: 1,
        repRange: '10 min',
        restSeconds: 0,
        restText: '—',
        alternative: 'Bicicleta / Elíptica',
        objective: 'Gasto calórico',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=caminata+inclinada+cinta+cardio',
        techniqueCues: [
          'Inclinación 8-12%, velocidad 4.5-5.5 km/h sin sostenerse de las barras'
        ]
      }
    ]
  },
  {
    id: 'martes-upper-body',
    dayName: 'Martes',
    title: 'Torso: Empuje & Tirón',
    tagline: 'Pectoral, Espalda, Hombros y Brazos',
    banner: '/assets/banner_upper_body.jpg',
    accentColor: 'cyan',
    exercises: [
      {
        id: 'mar-press-pecho-maq',
        name: 'Press de pecho en máquina',
        targetMuscles: 'Pectoral, Tríceps',
        defaultSets: 4,
        repRange: '8-12',
        restSeconds: 75,
        restText: '75 s',
        alternative: 'Press con mancuernas',
        objective: 'Fuerza + masa',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=press+de+pecho+en+maquina+tecnica',
        techniqueCues: [
          'Ajustar el asiento para que los agarres queden a la altura del esternón',
          'Retraer escápulas y sacar el pecho',
          'Empujar sin despegar la espalda del respaldo'
        ]
      },
      {
        id: 'mar-remo-sentado',
        name: 'Remo sentado',
        targetMuscles: 'Espalda, Bíceps',
        defaultSets: 4,
        repRange: '10-12',
        restSeconds: 75,
        restText: '75 s',
        alternative: 'Remo en máquina Smart Fit',
        objective: 'Fuerza + masa',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=remo+sentado+polea+baja+tecnica',
        techniqueCues: [
          'Tirar de los codos hacia atrás pegados al torso',
          'Apretar los dorsales 1 segundo en máxima contracción',
          'No balancear el tronco'
        ]
      },
      {
        id: 'mar-jalon-pecho',
        name: 'Jalón al pecho',
        targetMuscles: 'Dorsales, Bíceps',
        defaultSets: 3,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Dominadas asistidas',
        objective: 'Masa muscular',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=jalon+al+pecho+polea+alta+tecnica',
        techniqueCues: [
          'Agarre ligeramente más ancho que los hombros',
          'Llevar la barra hacia la parte superior del pecho tirando con los codos'
        ]
      },
      {
        id: 'mar-press-hombros-maq',
        name: 'Press de hombros en máquina',
        targetMuscles: 'Deltoides, Tríceps',
        defaultSets: 3,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Mancuernas sentado',
        objective: 'Hipertrofia',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=press+de+hombro+en+maquina+tecnica',
        techniqueCues: [
          'Codos apuntando ligeramente hacia adelante (~45°), no abiertos en exceso',
          'Empuje fluido hasta casi bloquear codos'
        ]
      },
      {
        id: 'mar-curl-biceps',
        name: 'Curl de bíceps',
        targetMuscles: 'Bíceps',
        defaultSets: 3,
        repRange: '12-15',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Polea / Mancuernas',
        objective: 'Hipertrofia',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+de+biceps+mancuernas+tecnica',
        techniqueCues: [
          'Mantener los codos fijos al costado del cuerpo',
          'Girar la muñeca hacia afuera en la subida (supinación)'
        ]
      },
      {
        id: 'mar-triceps-cuerda',
        name: 'Tríceps con cuerda',
        targetMuscles: 'Tríceps',
        defaultSets: 3,
        repRange: '12-15',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Barra recta en polea',
        objective: 'Hipertrofia',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=extension+triceps+cuerda+polea+tecnica',
        techniqueCues: [
          'Abrir la cuerda en la parte inferior para máxima activación del tríceps'
        ]
      },
      {
        id: 'mar-bici-estatica',
        name: 'Bicicleta estática',
        targetMuscles: 'Cardiovascular',
        defaultSets: 1,
        repRange: '10-12 min',
        restSeconds: 0,
        restText: '—',
        alternative: 'Elíptica',
        objective: 'Gasto calórico',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=cardio+bicicleta+estatica+gimnasio',
        techniqueCues: [
          'Cadencia constante 75-85 RPM con resistencia moderada'
        ]
      }
    ]
  },
  {
    id: 'miercoles-full-body',
    dayName: 'Miércoles',
    title: 'Full Body Balance & Acondicionamiento',
    tagline: 'Entrenamiento Integral y Capacidad Atlética',
    banner: '/assets/banner_full_body.jpg',
    accentColor: 'purple',
    exercises: [
      {
        id: 'mie-prensa-45',
        name: 'Prensa 45°',
        targetMuscles: 'Piernas, Glúteos',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Hack / Smith',
        objective: 'Full body',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=prensa+45+grados+tecnica',
        techniqueCues: ['Ritmo constante, enfoque en control excéntrico']
      },
      {
        id: 'mie-press-pecho-maq',
        name: 'Press pecho máquina',
        targetMuscles: 'Pectoral, Tríceps',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Mancuernas',
        objective: 'Full body',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=press+pecho+maquina+tecnica',
        techniqueCues: ['Contracción sostenida 1s']
      },
      {
        id: 'mie-remo-sentado',
        name: 'Remo sentado',
        targetMuscles: 'Espalda, Bíceps',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Remo máquina',
        objective: 'Full body',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=remo+sentado+tecnica',
        techniqueCues: ['Retracción escapular potente']
      },
      {
        id: 'mie-curl-femoral',
        name: 'Curl femoral',
        targetMuscles: 'Isquiotibiales',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Máquina',
        objective: 'Full body',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+femoral+maquina',
        techniqueCues: ['Control de fase excéntrica']
      },
      {
        id: 'mie-jalon-pecho',
        name: 'Jalón al pecho',
        targetMuscles: 'Dorsales, Bíceps',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Polea / Máquina',
        objective: 'Full body',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=jalon+pecho+polea',
        techniqueCues: ['Codos hacia las caderas']
      },
      {
        id: 'mie-pallof-press',
        name: 'Pallof press',
        targetMuscles: 'Core',
        defaultSets: 3,
        repRange: '10 por lado',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Polea',
        objective: 'Estabilidad',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=pallof+press+polea',
        techniqueCues: ['Glúteos y core apretados']
      },
      {
        id: 'mie-bici-intervalos',
        name: 'Bicicleta (Intervalos)',
        targetMuscles: 'Cardiovascular',
        defaultSets: 3,
        repRange: '2 min rápido + 1 min suave',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Elíptica',
        objective: 'Acondicionamiento',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=intervalos+bicicleta+hiit+cardio',
        techniqueCues: [
          '2 min a alta intensidad (RPE 8) + 1 min de recuperación activa (RPE 4)'
        ]
      }
    ]
  },
  {
    id: 'jueves-quad-strength',
    dayName: 'Jueves',
    title: 'Pierna: Fuerza & Estabilidad',
    tagline: 'Cuádriceps, Box Squat y Glúteo Medio',
    banner: '/assets/banner_leg_day.jpg',
    accentColor: 'emerald',
    exercises: [
      {
        id: 'jue-prensa-45',
        name: 'Prensa 45°',
        targetMuscles: 'Cuádriceps, Glúteos',
        defaultSets: 4,
        repRange: '8-10',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Hack / Smith',
        objective: 'Fuerza',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=prensa+45+grados+pesado',
        techniqueCues: [
          'Mayor carga que el lunes, profundidad controlada, empuje potente'
        ]
      },
      {
        id: 'jue-sentadilla-banco',
        name: 'Sentadilla a banco / box',
        targetMuscles: 'Piernas, Glúteos',
        defaultSets: 3,
        repRange: '8-10',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Smith machine squat',
        objective: 'Fuerza functional',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=box+squat+sentadilla+al+cajon+tecnica',
        techniqueCues: [
          'Tocar el banco suavemente sin perder tensión y subir con explosividad'
        ]
      },
      {
        id: 'jue-curl-femoral',
        name: 'Curl femoral',
        targetMuscles: 'Isquiotibiales',
        defaultSets: 3,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Máquina femoral',
        objective: 'Hipertrofia',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+femoral+tecnica',
        techniqueCues: ['Pausa en la contracción']
      },
      {
        id: 'jue-ext-cuadriceps',
        name: 'Extensión de cuádriceps',
        targetMuscles: 'Cuádriceps',
        defaultSets: 3,
        repRange: '12-15',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Máquina extensión',
        objective: 'Hipertrofia',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=extension+de+cuadriceps+maquina',
        techniqueCues: ['Tensión continua en el cuádriceps']
      },
      {
        id: 'jue-abductores',
        name: 'Abductores',
        targetMuscles: 'Glúteo medio',
        defaultSets: 3,
        repRange: '15',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Máquina abductora Smart Fit',
        objective: 'Estabilidad',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=maquina+abductores+gluteo+tecnica',
        techniqueCues: [
          'Abrir manteniendo el control, aguantar 1s en apertura máxima'
        ]
      },
      {
        id: 'jue-gemelos',
        name: 'Gemelos',
        targetMuscles: 'Pantorrillas',
        defaultSets: 3,
        repRange: '15-20',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Prensa',
        objective: 'Fortalecimiento',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=gemelos+en+prensa+tecnica',
        techniqueCues: ['Estiramiento profundo en cada rep']
      },
      {
        id: 'jue-cardio-eliptica',
        name: 'Bicicleta / Elíptica',
        targetMuscles: 'Cardiovascular',
        defaultSets: 1,
        repRange: '10 min',
        restSeconds: 0,
        restText: '—',
        alternative: 'Cualquiera disponible',
        objective: 'Gasto calórico',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=eliptica+cardio+gimnasio',
        techniqueCues: ['Ritmo constante de moderada intensidad']
      }
    ]
  },
  {
    id: 'viernes-rugby-power',
    dayName: 'Viernes',
    title: 'Rugby Conditioning & Potencia',
    tagline: 'Fuerza Dinámica, Contacto & Capacidad Anaeróbica',
    banner: '/assets/banner_rugby_conditioning.jpg',
    accentColor: 'amber',
    exercises: [
      {
        id: 'vie-calentamiento-cardio',
        name: 'Bicicleta / Elíptica suave',
        targetMuscles: 'Cardiovascular',
        defaultSets: 1,
        repRange: '5 min',
        restSeconds: 0,
        restText: '—',
        alternative: 'Cualquiera disponible',
        objective: 'Calentamiento',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=calentamiento+cardio+gimnasio',
        techniqueCues: ['Aumentar gradualmente la temperatura corporal']
      },
      {
        id: 'vie-press-pecho-rugby',
        name: 'Press pecho máquina',
        targetMuscles: 'Pectoral, Tríceps',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Mancuernas',
        objective: 'Rugby / Empuje explosivo',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=press+de+pecho+rugby+potencia',
        techniqueCues: ['Fase concéntrica explosiva (fuerza de choque/tackle)']
      },
      {
        id: 'vie-remo-polea-rugby',
        name: 'Remo máquina / polea',
        targetMuscles: 'Espalda, Bíceps',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Remo disponible',
        objective: 'Rugby / Tracción',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=remo+polea+traccion+espalda',
        techniqueCues: ['Estabilidad de tronco y tracción firme']
      },
      {
        id: 'vie-prensa-rugby',
        name: 'Prensa',
        targetMuscles: 'Piernas, Glúteos',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 75,
        restText: '60-90 s',
        alternative: 'Hack / Smith',
        objective: 'Rugby / Potencia tren inferior',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=prensa+45+potencia+piernas',
        techniqueCues: ['Empuje continuo y reactivo']
      },
      {
        id: 'vie-jalon-pecho-rugby',
        name: 'Jalón al pecho',
        targetMuscles: 'Dorsales, Bíceps',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Máquina asistida',
        objective: 'Rugby',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=jalon+al+pecho+dorsales',
        techniqueCues: ['Fijar bien las piernas en los rodillos']
      },
      {
        id: 'vie-curl-femoral-rugby',
        name: 'Curl femoral',
        targetMuscles: 'Isquiotibiales',
        defaultSets: 3,
        repRange: '12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Máquina',
        objective: 'Rugby / Prevención lesiones sprint',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+femoral+prevencion+isquios',
        techniqueCues: ['Fortalecer isquios para protección en carreras y frenadas']
      },
      {
        id: 'vie-core-pallof-rugby',
        name: 'Core / Pallof press',
        targetMuscles: 'Core',
        defaultSets: 3,
        repRange: '10 por lado',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Polea',
        objective: 'Rugby / Resistencia a la rotación en contacto',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=pallof+press+para+deportes+contacto',
        techniqueCues: ['Bloqueo abdominal firme simulando postura de scrum/ruck']
      },
      {
        id: 'vie-intervalos-bici',
        name: 'Intervalos bicicleta',
        targetMuscles: 'Cardiovascular',
        defaultSets: 5,
        repRange: '1 min rápido + 2 min suave',
        restSeconds: 0,
        restText: '—',
        alternative: 'Elíptica',
        objective: 'Acondicionamiento / HIIT Rugby',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=intervalos+alta+intensidad+bicicleta',
        techniqueCues: [
          '5 rondas: 1 minuto sprint máximo (RPE 9-10) + 2 minutos pedaleo suave regenerativo'
        ]
      }
    ]
  }
]
