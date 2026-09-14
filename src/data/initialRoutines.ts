import type { WorkoutDay } from '../types/workout'

export const INITIAL_ROUTINES: WorkoutDay[] = [
  {
    id: 'lunes-pecho-triceps',
    dayName: 'Lunes',
    title: 'Pecho + Tríceps',
    tagline: 'Fuerza 12 semanas • Máx. 40 min',
    banner: '/assets/banner_upper_body.jpg',
    accentColor: 'cyan',
    exercises: [
      {
        id: 'lun-press-pecho-maquina',
        name: 'Press de pecho en máquina',
        targetMuscles: 'Pectoral',
        defaultSets: 3,
        repRange: '5-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Press banca con barra / mancuernas',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=press+de+pecho+en+maquina+tecnica+correcta',
        techniqueCues: [
          'Ajusta el asiento para que las manijas queden a la altura del pecho',
          'Deja 2 repeticiones en reserva (RIR 2) y controla la bajada 2-3 segundos'
        ]
      },
      {
        id: 'lun-press-inclinado-mancuernas',
        name: 'Press inclinado con mancuernas',
        targetMuscles: 'Pectoral superior',
        defaultSets: 3,
        repRange: '6-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Press inclinado en máquina',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=press+inclinado+con+mancuernas+tecnica',
        techniqueCues: [
          'Banco a 30-45° y muñecas alineadas con los codos',
          'Baja hasta sentir el estiramiento del pecho sin perder la retracción escapular'
        ]
      },
      {
        id: 'lun-aperturas-peck-deck',
        name: 'Aperturas en peck deck',
        targetMuscles: 'Pectoral',
        defaultSets: 2,
        repRange: '8-10',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Aperturas con mancuernas / poleas',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=aperturas+peck+deck+tecnica',
        techniqueCues: [
          'Codos ligeramente flexionados y fijos durante todo el recorrido',
          'Pausa de 1 segundo al juntar y vuelve controlando el estiramiento'
        ]
      },
      {
        id: 'lun-triceps-polea-cuerda',
        name: 'Extensión de tríceps en polea con cuerda',
        targetMuscles: 'Tríceps',
        defaultSets: 3,
        repRange: '8-10',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Extensión en máquina / fondos entre bancos',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=extension+triceps+polea+cuerda+tecnica',
        techniqueCues: [
          'Codos pegados al torso y abre la cuerda al final',
          'Extiende completo sin balancear el cuerpo'
        ]
      },
      {
        id: 'lun-triceps-sobre-cabeza',
        name: 'Extensión por encima de la cabeza en polea',
        targetMuscles: 'Tríceps',
        defaultSets: 2,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Extensión con mancuerna a dos manos',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=extension+triceps+sobre+cabeza+polea+tecnica',
        techniqueCues: [
          'Da un paso al frente y mantén el core firme para no arquear la espalda',
          'Enfoca la tensión en la cabeza larga del tríceps'
        ]
      }
    ]
  },
  {
    id: 'martes-piernas-cuadriceps',
    dayName: 'Martes',
    title: 'Piernas – Cuádriceps',
    tagline: 'Fuerza 12 semanas • Máx. 40 min',
    banner: '/assets/banner_leg_day.jpg',
    accentColor: 'emerald',
    exercises: [
      {
        id: 'mar-prensa-piernas',
        name: 'Prensa de piernas',
        targetMuscles: 'Cuádriceps / Glúteos',
        defaultSets: 3,
        repRange: '5-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Hack squat / Smith',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=prensa+de+piernas+tecnica+correcta',
        techniqueCues: [
          'Pies a la anchura de hombros en el centro de la plataforma',
          'Baja controlado hasta ~90° sin despegar la lumbar y empuja con los talones'
        ]
      },
      {
        id: 'mar-sentadilla-hack',
        name: 'Sentadilla hack en máquina',
        targetMuscles: 'Cuádriceps',
        defaultSets: 3,
        repRange: '6-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Prensa / sentadilla en Smith',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=sentadilla+hack+maquina+tecnica',
        techniqueCues: [
          'Espalda y cadera pegadas al respaldo durante todo el recorrido',
          'Baja al máximo rango sin dolor y sube sin bloquear las rodillas'
        ]
      },
      {
        id: 'mar-extension-piernas',
        name: 'Extensión de piernas en máquina',
        targetMuscles: 'Cuádriceps',
        defaultSets: 2,
        repRange: '8-10',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Extensión unilateral',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=extension+de+piernas+maquina+tecnica',
        techniqueCues: [
          'Alinea el eje de la rodilla con el pivote de la máquina',
          'Pausa de 1 segundo arriba apretando el cuádriceps y controla la bajada'
        ]
      },
      {
        id: 'mar-patada-gluteo',
        name: 'Patada de glúteo en máquina o polea',
        targetMuscles: 'Glúteos',
        defaultSets: 2,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Hip thrust / puente a una pierna',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=patada+de+gluteo+en+maquina+tecnica',
        techniqueCues: [
          'Extiende la cadera sin arquear la espalda baja',
          'Aprieta el glúteo 1 segundo en el punto más alto'
        ]
      },
      {
        id: 'mar-talones-maquina',
        name: 'Elevación de talones en máquina',
        targetMuscles: 'Pantorrillas',
        defaultSets: 2,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Elevación de talones con mancuernas',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=elevacion+de+talones+en+maquina+tecnica',
        techniqueCues: [
          'Baja el talón al máximo estiramiento y sube hasta la punta',
          'Pausa arriba 1 segundo sin rebotar'
        ]
      }
    ]
  },
  {
    id: 'miercoles-espalda-biceps',
    dayName: 'Miércoles',
    title: 'Espalda + Bíceps',
    tagline: 'Fuerza 12 semanas • Máx. 40 min',
    banner: '/assets/banner_upper_body.jpg',
    accentColor: 'purple',
    exercises: [
      {
        id: 'mie-jalon-pecho',
        name: 'Jalón al pecho en polea',
        targetMuscles: 'Dorsales',
        defaultSets: 3,
        repRange: '5-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Dominadas asistidas / jalón agarre neutro',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=jalon+al+pecho+polea+tecnica',
        techniqueCues: [
          'Pecho arriba y lleva los codos hacia las costillas',
          'Tira con la espalda, no con los brazos; controla la subida'
        ]
      },
      {
        id: 'mie-remo-sentado-polea',
        name: 'Remo sentado en polea',
        targetMuscles: 'Espalda media',
        defaultSets: 3,
        repRange: '6-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Remo en máquina / barra T',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=remo+sentado+en+polea+tecnica',
        techniqueCues: [
          'Torso estable y junta los omóplatos en cada repetición',
          'Evita balanceos: el movimiento nace en la espalda'
        ]
      },
      {
        id: 'mie-remo-unilateral-maquina',
        name: 'Remo unilateral en máquina',
        targetMuscles: 'Dorsales',
        defaultSets: 2,
        repRange: '8-10 por lado',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Remo con mancuerna a una mano',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=remo+unilateral+en+maquina+tecnica',
        techniqueCues: [
          'Apoya bien el pecho y estira el dorsal abajo',
          'Lleva el codo hacia la cadera sin rotar el torso'
        ]
      },
      {
        id: 'mie-face-pull',
        name: 'Face pull en polea',
        targetMuscles: 'Deltoide posterior',
        defaultSets: 2,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Pájaros en peck deck / banda elástica',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=face+pull+polea+tecnica',
        techniqueCues: [
          'Cuerda a la altura de la cara y codos altos',
          'Abre hacia afuera pensando en rotación externa'
        ]
      },
      {
        id: 'mie-curl-barra-ez',
        name: 'Curl con barra EZ',
        targetMuscles: 'Bíceps',
        defaultSets: 3,
        repRange: '6-10',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Curl con mancuernas / curl en polea',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+con+barra+ez+tecnica',
        techniqueCues: [
          'Codos fijos al costado y sube sin balancear',
          'Controla la bajada 2-3 segundos sin soltar la tensión'
        ]
      }
    ]
  },
  {
    id: 'jueves-piernas-femoral-gluteos',
    dayName: 'Jueves',
    title: 'Piernas – Femoral + Glúteos',
    tagline: 'Fuerza 12 semanas • Máx. 40 min',
    banner: '/assets/banner_leg_day.jpg',
    accentColor: 'emerald',
    exercises: [
      {
        id: 'jue-curl-femoral-sentado',
        name: 'Curl femoral sentado',
        targetMuscles: 'Isquiotibiales',
        defaultSets: 3,
        repRange: '6-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Curl femoral tumbado',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+femoral+sentado+tecnica',
        techniqueCues: [
          'Ajusta el pivote a la altura de la rodilla y el rodillo sobre el tendón',
          'Flexiona al máximo y baja controlando sin despegar la cadera'
        ]
      },
      {
        id: 'jue-rdl-mancuernas',
        name: 'Peso muerto rumano con mancuernas',
        targetMuscles: 'Glúteos / Isquiotibiales',
        defaultSets: 3,
        repRange: '6-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Peso muerto rumano con barra',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=peso+muerto+rumano+con+mancuernas+tecnica',
        techniqueCues: [
          'Espalda neutra y hombros bloqueados hacia atrás',
          'Empuja las caderas hacia atrás con rodillas semiflexionadas y siente el estiramiento'
        ]
      },
      {
        id: 'jue-pull-through',
        name: 'Pull through en polea',
        targetMuscles: 'Glúteos',
        defaultSets: 2,
        repRange: '8-10',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Hip thrust / buenos días con banda',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=pull+through+polea+tecnica',
        techniqueCues: [
          'Hinge de cadera sin redondear la espalda',
          'Aprieta los glúteos al final del movimiento'
        ]
      },
      {
        id: 'jue-abduccion-cadera',
        name: 'Abducción de cadera en máquina',
        targetMuscles: 'Glúteos',
        defaultSets: 2,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Abducción en polea / banda',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=abduccion+de+cadera+en+maquina+tecnica',
        techniqueCues: [
          'Torso ligeramente inclinado al frente para enfatizar el glúteo',
          'Abre controlado y evita rebotar al cerrar'
        ]
      },
      {
        id: 'jue-talones-sentado',
        name: 'Elevación de talones sentado',
        targetMuscles: 'Pantorrillas',
        defaultSets: 2,
        repRange: '10-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Elevación de talones en prensa',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=elevacion+de+talones+sentado+tecnica',
        techniqueCues: [
          'Rodillas a 90° y rango completo: estiramiento abajo, contracción arriba',
          'Pausa de 1 segundo en la cima'
        ]
      }
    ]
  },
  {
    id: 'viernes-hombros-brazos-core',
    dayName: 'Viernes',
    title: 'Hombros + Brazos + Core',
    tagline: 'Fuerza 12 semanas • Máx. 40 min',
    banner: '/assets/banner_full_body.jpg',
    accentColor: 'amber',
    exercises: [
      {
        id: 'vie-press-hombros-maquina',
        name: 'Press de hombros en máquina',
        targetMuscles: 'Deltoides',
        defaultSets: 3,
        repRange: '5-8',
        restSeconds: 90,
        restText: '90 s',
        alternative: 'Press militar con mancuernas',
        objective: 'Fuerza – RIR 2',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=press+de+hombros+en+maquina+tecnica',
        techniqueCues: [
          'Manijas a la altura de los hombros y core firme',
          'Sube sin bloquear los codos y baja hasta el mentón'
        ]
      },
      {
        id: 'vie-elevaciones-laterales',
        name: 'Elevaciones laterales con mancuernas',
        targetMuscles: 'Deltoides lateral',
        defaultSets: 2,
        repRange: '8-12',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Elevaciones en polea / máquina',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=elevaciones+laterales+mancuernas+tecnica',
        techniqueCues: [
          'Ligera inclinación al frente y codos ligeramente flexionados',
          'Sube hasta la línea del hombro sin encoger el cuello'
        ]
      },
      {
        id: 'vie-curl-barra-ez',
        name: 'Curl de bíceps con barra EZ',
        targetMuscles: 'Bíceps',
        defaultSets: 2,
        repRange: '8-10',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Curl alterno con mancuernas',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=curl+de+biceps+con+barra+ez+tecnica',
        techniqueCues: [
          'Codos pegados al torso, sin usar impulso de cadera',
          'Aprieta el bíceps arriba y baja en 2-3 segundos'
        ]
      },
      {
        id: 'vie-triceps-cuerda',
        name: 'Extensión de tríceps con cuerda',
        targetMuscles: 'Tríceps',
        defaultSets: 2,
        repRange: '8-10',
        restSeconds: 60,
        restText: '60 s',
        alternative: 'Extensión en máquina / patada de tríceps',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=extension+de+triceps+con+cuerda+tecnica',
        techniqueCues: [
          'Codos fijos al costado y extiende completo',
          'Abre la cuerda al final para mayor contracción'
        ]
      },
      {
        id: 'vie-crunch-maquina',
        name: 'Crunch en máquina o polea',
        targetMuscles: 'Core',
        defaultSets: 2,
        repRange: '10-15',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Crunch abdominal en suelo',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=crunch+en+maquina+tecnica',
        techniqueCues: [
          'Flexiona la columna llevando el esternón hacia la pelvis',
          'Evita tirar con los brazos: el abdomen hace el trabajo'
        ]
      },
      {
        id: 'vie-plancha-abdominal',
        name: 'Plancha abdominal',
        targetMuscles: 'Core',
        defaultSets: 2,
        repRange: '30-45 seg',
        restSeconds: 45,
        restText: '45 s',
        alternative: 'Plancha con peso / dead bug',
        objective: 'Hipertrofia – RIR 1',
        defaultVideoUrl: 'https://www.youtube.com/results?search_query=plancha+abdominal+tecnica',
        techniqueCues: [
          'Cuerpo en línea recta: cadera ni arriba ni abajo',
          'Aprieta glúteos y abdomen; respira sostenido'
        ]
      }
    ]
  }
]
