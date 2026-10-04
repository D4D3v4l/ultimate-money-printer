/**
 * Datos de demostración de AprendeAventura.
 *
 * Todo lo que ves en las vistas proviene de este archivo. Está tipado y es
 * deliberadamente "plano" (sin JSX ni iconos) para que sea trivial sustituirlo
 * por un `loader` de TanStack Router que llame a una API real.
 */

/* -------------------------------------------------------------------------- */
/* Estudiante                                                                  */
/* -------------------------------------------------------------------------- */

export const student = {
  name: "Mateo",
  initials: "MA",
  grade: "4.º Primaria",
  cycle: "Ciclo Escolar 2024–2025",
}

/* -------------------------------------------------------------------------- */
/* Mi Portal                                                                   */
/* -------------------------------------------------------------------------- */

export const portal = {
  phase: "Fase de Diagnóstico",
  diagnostic: {
    badge: "Paso obligatorio",
    recommendation: "Recomendado",
    estimatedTime: "25 min aprox.",
    title: "Evaluación Diagnóstica Inicial",
    description:
      "12 reactivos interactivos diseñados para identificar tus competencias actuales en Matemáticas y Comprensión Lectora. Esta prueba no tiene límite de tiempo estricto y servirá para calibrar tu ritmo de aprendizaje.",
    progress: 0,
    meta: [
      { label: "Preguntas", value: "12 reactivos" },
      { label: "Modalidad", value: "Ritmo libre" },
      { label: "Estado actual", value: "Pendiente", pending: true },
    ],
    emptyProgressNote:
      "Sin intentos registrados hoy. Al dar clic inicias el primer ejercicio.",
  },
  learningPathPreview: {
    title: "Ruta de Aprendizaje",
    status: "Bloqueado",
    description:
      "Disponible al completar la evaluación diagnóstica. Incluye el acompañamiento continuo de tus 2 tutores guía:",
    footNote: "Tutores asignados listos para activarse.",
  },
  history: {
    title: "Historial y Progreso",
    completedLabel: "Evaluaciones completadas",
    completed: 0,
    total: 1,
    stage: "Fase diagnóstica inicial",
    status: "Pendiente",
    progress: 0,
    description:
      "Una vez enviadas tus respuestas, este panel mostrará el desglose detallado de tus fortalezas y las áreas prioritarias a reforzar.",
  },
  guidelines: [
    {
      title: "Lectura pausada",
      description:
        "Lee cada enunciado y las opciones con atención antes de elegir tu respuesta.",
    },
    {
      title: "Descansos libres",
      description:
        "Puedes tomar pequeñas pausas si lo requieres; tu avance se guarda de manera automática.",
    },
    {
      title: "Plan personalizado",
      description:
        "Tus respuestas permitirán armar un plan de estudio a tu medida exacta, sin calificaciones punitivas.",
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* Diagnóstico                                                                 */
/* -------------------------------------------------------------------------- */

export type DiagnosticOption = {
  key: string
  label: string
  description: string
}

/** Figura geométrica de apoyo. Hoy sólo existe el pastel fraccionado. */
export type DiagnosticFigure = {
  kind: "pie"
  total: number
  highlighted: number
  highlightedLabel: string
  restLabel: string
  note: string
}

export type DiagnosticQuestion = {
  id: number
  block: string
  prompt: string
  hint: string
  points: number
  passage?: string
  figure?: DiagnosticFigure
  options: DiagnosticOption[]
}

export const diagnosticMeta = {
  estimatedTime: "25 min aprox.",
  total: 12,
  passingLabel: "Paso obligatorio",
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    block: "Bloque 1: Razonamiento y Fracciones",
    prompt:
      "Una pizza se dividió en 6 porciones iguales. Ana se comió 3 porciones. ¿Qué fracción de la pizza se comió Ana?",
    hint: "Representa la parte consumida sobre el total de porciones.",
    points: 1,
    options: [
      { key: "A", label: "3/6", description: "Tres sextos del total" },
      { key: "B", label: "1/2", description: "La mitad del total" },
      { key: "C", label: "1/3", description: "Un tercio del total" },
      { key: "D", label: "3/4", description: "Tres cuartos del total" },
    ],
  },
  {
    id: 2,
    block: "Bloque 1: Razonamiento y Fracciones",
    prompt:
      "Esta cinta se dividió en 4 partes iguales. Leo pintó 3 de esas partes. ¿Qué fracción pintó Leo?",
    hint: "Observa cuántas partes del total quedaron pintadas.",
    points: 1,
    figure: {
      kind: "pie",
      total: 4,
      highlighted: 3,
      highlightedLabel: "Partes pintadas (3 partes)",
      restLabel: "Parte sin pintar (1 parte)",
      note: "Total = 4 unidades congruentes",
    },
    options: [
      { key: "A", label: "3/4", description: "Tres cuartos del total" },
      { key: "B", label: "1/4", description: "Un cuarto del total" },
      { key: "C", label: "3/3", description: "Tres tercios del total" },
      { key: "D", label: "4/3", description: "Cuatro tercios del total" },
    ],
  },
  {
    id: 3,
    block: "Bloque 1: Razonamiento y Fracciones",
    prompt: "¿Cuál de estas fracciones representa la mayor cantidad?",
    hint: "Compara primero los denominadores y después los numeradores.",
    points: 1,
    options: [
      { key: "A", label: "3/8", description: "Tres octavos" },
      { key: "B", label: "2/8", description: "Dos octavos" },
      { key: "C", label: "5/8", description: "Cinco octavos" },
      { key: "D", label: "1/8", description: "Un octavo" },
    ],
  },
  {
    id: 4,
    block: "Bloque 1: Razonamiento y Fracciones",
    prompt:
      "Un pastel redondo se dividió en 8 porciones iguales. Si se han consumido 5 porciones, ¿qué fracción del pastel queda disponible?",
    hint: "Observa la representación gráfica geométrica antes de responder.",
    points: 1,
    figure: {
      kind: "pie",
      total: 8,
      highlighted: 5,
      highlightedLabel: "Porciones consumidas (5 partes)",
      restLabel: "Porciones disponibles restantes (3 partes)",
      note: "Total = 8 unidades congruentes",
    },
    options: [
      { key: "A", label: "3/8", description: "Tres octavos del total" },
      { key: "B", label: "5/8", description: "Cinco octavos del total" },
      { key: "C", label: "2/8", description: "Dos octavos del total" },
      { key: "D", label: "1/4", description: "Un cuarto del total" },
    ],
  },
  {
    id: 5,
    block: "Bloque 2: Comprensión Lectora Literal",
    passage:
      "Cada mañana, Luna sale de su casa a las siete en punto. Camina dos calles y llega a la escuela. Es la primera estudiante en llegar.",
    prompt: "¿A qué hora sale Luna de su casa?",
    hint: "Busca el dato explícito sobre la hora de salida.",
    points: 1,
    options: [
      { key: "A", label: "7:00", description: "Siete en punto" },
      { key: "B", label: "6:30", description: "Seis y media" },
      { key: "C", label: "7:30", description: "Siete y media" },
      { key: "D", label: "8:00", description: "Ocho en punto" },
    ],
  },
  {
    id: 6,
    block: "Bloque 2: Comprensión Lectora Literal",
    passage:
      "El equipo de fútbol de la escuela ganó tres partidos, perdió uno y no empató ninguno. La entrenadora dijo que el esfuerzo de los niños fue constante todo el mes.",
    prompt: "¿Cuántos partidos ganó el equipo de fútbol?",
    hint: "Fíjate en la cantidad que el texto indica de forma directa.",
    points: 1,
    options: [
      { key: "A", label: "1 partido", description: "Uno" },
      { key: "B", label: "2 partidos", description: "Dos" },
      { key: "C", label: "3 partidos", description: "Tres" },
      { key: "D", label: "4 partidos", description: "Cuatro" },
    ],
  },
  {
    id: 7,
    block: "Bloque 2: Comprensión Lectora Literal",
    passage:
      "Al terminar la clase, Nico se lavó las manos con jabón y agua, luego las secó con una toalla de papel antes de comer su refrigerio.",
    prompt: "¿Con qué secó Nico sus manos?",
    hint: "El objeto aparece después de la acción de lavar.",
    points: 1,
    options: [
      { key: "A", label: "Con una toalla de papel", description: "Secado con papel" },
      { key: "B", label: "Con un paño de tela", description: "Secado con tela" },
      { key: "C", label: "Con aire", description: "Secado al viento" },
      { key: "D", label: "Con su camiseta", description: "Secado con ropa" },
    ],
  },
  {
    id: 8,
    block: "Bloque 2: Comprensión Lectora Literal",
    passage:
      "La biblioteca de la escuela abrió sus puertas a las ocho de la mañana y cerró a las cuatro de la tarde. Los martes y jueves el horario se extiende una hora más.",
    prompt: "¿A qué hora cierra la biblioteca los martes?",
    hint: "Aplica el cambio de horario que menciona el texto.",
    points: 1,
    options: [
      { key: "A", label: "A las 3:00", description: "Tres de la tarde" },
      { key: "B", label: "A las 4:00", description: "Cuatro de la tarde" },
      { key: "C", label: "A las 5:00", description: "Cinco de la tarde" },
      { key: "D", label: "A las 8:00", description: "Ocho de la tarde" },
    ],
  },
  {
    id: 9,
    block: "Bloque 3: Comprensión Lectora Inferencial",
    passage:
      "Aunque llovía, los estudiantes decidieron jugar al aire libre: se pusieron impermeables, saltaron charcos y rieron durante una hora. Cuando el cielo se despejó, ninguno quiso entrar.",
    prompt: "¿Qué nos dice la decisión de jugar bajo la lluvia?",
    hint: "La elección del grupo revela su actitud ante la dificultad.",
    points: 1,
    options: [
      {
        key: "A",
        label: "Que divertirse les importaba más que el mal tiempo",
        description: "Priorizaron la convivencia",
      },
      {
        key: "B",
        label: "Que en realidad no estaba lloviendo",
        description: "El texto se contradice",
      },
      {
        key: "C",
        label: "Que la profesora se lo había prohibido",
        description: "Decisión de la profesora",
      },
      {
        key: "D",
        label: "Que tenían miedo de mojarse",
        description: "Evitaban el agua",
      },
    ],
  },
  {
    id: 10,
    block: "Bloque 3: Comprensión Lectora Inferencial",
    passage:
      "Don Tomás guardaba las herramientas del jardín en un cajón bajo, pero cada mañana las encontraba esparcidas por el patio. Un día, su nieta colgó las herramientas en un panel de la pared. Desde entonces, todo sigue en su lugar.",
    prompt: "¿Qué nos dice el cambio que hizo la nieta de Don Tomás?",
    hint: "Fíjate en qué cambió exactamente y en qué pasó después.",
    points: 1,
    options: [
      {
        key: "A",
        label: "Que a Don Tomás le gustaba tener todo revuelto",
        description: "Problema de carácter",
      },
      {
        key: "B",
        label: "Que cambiar dónde se guardaba resolvió el problema",
        description: "Solución práctica",
      },
      {
        key: "C",
        label: "Que la nieta quería que Don Tomás trabajara menos",
        description: "Intención oculta",
      },
      {
        key: "D",
        label: "Que las herramientas se habían perdido",
        description: "Confusión con el texto",
      },
    ],
  },
  {
    id: 11,
    block: "Bloque 3: Comprensión Lectora Inferencial",
    passage:
      "Elena practicaba piano casi todos los días, aunque los fines de semana tuviera otros planes. Su hermana menor, en cambio, sólo tocaba cuando alguien la escuchaba.",
    prompt: "¿Qué diferencia se observa entre Elena y su hermana?",
    hint: "Compara la relación de cada una con el instrumento.",
    points: 1,
    options: [
      {
        key: "A",
        label: "Las dos tocaban con la misma frecuencia",
        description: "Mismo hábito",
      },
      {
        key: "B",
        label: "Elena sostiene una rutina y su hermana depende del público",
        description: "Constancia frente a aprobación",
      },
      {
        key: "C",
        label: "Elena toca mejor que su hermana",
        description: "No se deduce del texto",
      },
      {
        key: "D",
        label: "Su hermana no sabe tocar el piano",
        description: "Contradice el texto",
      },
    ],
  },
  {
    id: 12,
    block: "Bloque 3: Comprensión Lectora Inferencial",
    passage:
      "En el concurso de lectura cada participante debía leer un libro y escribir por qué lo recomendaba. Varios leyeron el mismo título, pero las reseñas fueron muy distintas.",
    prompt: "¿Por qué las reseñas del mismo libro fueron tan distintas?",
    hint: "La respuesta está en lo que cada lector hizo, no en el libro.",
    points: 1,
    options: [
      {
        key: "A",
        label: "Porque algunos leyeron el libro equivocado",
        description: "Error de lectura",
      },
      {
        key: "B",
        label: "Porque su propósito y su experiencia de lectura fueron distintos",
        description: "Lectura subjetiva",
      },
      {
        key: "C",
        label: "Porque nadie terminó el libro",
        description: "Sin respaldo en el texto",
      },
      {
        key: "D",
        label: "Porque el libro tiene varias versiones",
        description: "No se menciona",
      },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Resultados y brechas                                                        */
/* -------------------------------------------------------------------------- */

/** Tonos disponibles mapeados a las variantes de `Badge`. */
export type ReportTone = "primary" | "secondary" | "destructive"

export type ReportCompetency = {
  id: string
  name: string
  score: number
  status: string
  tone: ReportTone
  rootCause: string
}

export const report = {
  title: "Reporte de Diagnóstico Académico",
  eyebrow: "Evaluación Formativa Inicial",
  appliedOn: "24 de octubre",
  period: "Periodo lectivo 2024",
  globalScore: {
    label: "Desempeño Global",
    value: 68,
    level: "Nivel medio",
    note: "Promedio ponderado de 4 áreas evaluadas",
  },
  highlight: {
    label: "Competencia destacada",
    value: 90,
    name: "Comprensión lectora literal",
    note: "Retención y rescate de información explícita",
  },
  focus: {
    label: "Foco de intervención",
    value: 45,
    name: "Fracciones y representación numérica",
    note: "Módulo 1 de la ruta formativa sugerida",
  },
  gapAnalysis: {
    title: "Diagnóstico de Causas de Brecha",
    description:
      "Análisis cualitativo basado en respuestas y patrones de error detectados.",
  },
  competencies: [
    {
      id: "fracciones",
      name: "Fracciones y representación numérica",
      score: 45,
      status: "Requiere refuerzo",
      tone: "destructive",
      rootCause:
        "Dificultad para asociar numerador con partes restantes vs. partes tomadas en problemas contextualizados con material gráfico.",
    },
    {
      id: "inferencia",
      name: "Comprensión lectora inferencial",
      score: 55,
      status: "En desarrollo",
      tone: "secondary",
      rootCause:
        "Dificultad en la identificación de ideas implícitas y deducción de intenciones en textos narrativos de más de 3 párrafos.",
    },
    {
      id: "calculo",
      name: "Cálculo de operaciones básicas",
      score: 85,
      status: "Consolidado",
      tone: "primary",
      rootCause:
        "Excelente dominio de sumas y restas con reagrupación; fluidez en cálculo mental simple sin vacilación.",
    },
  ] satisfies ReportCompetency[],
  nextStep: {
    label: "Siguiente paso recomendado",
    title: "Ruta de nivelación asignada",
    modules: 3,
    description:
      "Se han estructurado 3 módulos priorizados de 15 minutos diarios para abordar las dificultades conceptuales detectadas en fracciones e inferencias.",
  },
}

/* -------------------------------------------------------------------------- */
/* Ruta de aprendizaje                                                         */
/* -------------------------------------------------------------------------- */

export type Tutor = {
  id: string
  name: string
  initials: string
  role: string
  specialty: string
  description: string
  quote: string
}

export type PathItem =
  | {
      kind: "lesson"
      code: string
      title: string
      description: string
      status: "done" | "current" | "locked"
    }
  | {
      kind: "checkpoint"
      title: string
      description: string
      meta: string
      action: string
    }

export type PathModule = {
  id: number
  state: "active" | "upcoming" | "scheduled"
  badge: string
  focus?: string
  tutor?: string
  lockedNote?: string
  title: string
  description: string
  items: PathItem[]
}

export const tutors: Tutor[] = [
  {
    id: "aurelio",
    name: "Búho Aurelio",
    initials: "BA",
    role: "Tutor de lógica",
    specialty: "Matemáticas y razonamiento",
    description:
      "Especialista en ayudarte a razonar fracciones y números paso a paso. Divide problemas grandes en fragmentos comprensibles.",
    quote: "«Ver la fracción como un dibujo lo aclara todo.»",
  },
  {
    id: "pandi",
    name: "Pandi",
    initials: "PA",
    role: "Guía de estrategias",
    specialty: "Lectura atenta y comprensión",
    description:
      "Te acompaña en la lectura atenta y técnicas de resolución sin prisa. Detecta pistas clave en oraciones complejas.",
    quote: "«Respira hondo y busca la pista oculta en el párrafo.»",
  },
]

export const learningPath = {
  eyebrow: "Plan de estudio adaptativo activo",
  title: "Ruta de Nivelación Personalizada",
  description:
    "Diseñado a partir de tu diagnóstico inicial. Aborda de forma prioritaria las brechas en fracciones visuales y comprensión inferencial.",
  goalLabel: "Meta trimestral",
  goal: "Nivel 4.º Primaria consolidado",
  progress: {
    value: 25,
    label: "Progreso general de nivelación",
    modulesAdvanced: 1,
    totalModules: 4,
    note: "Próxima evaluación intermedia en 2 lecciones",
  },
  badges: {
    lessonsDone: "1 lección superada",
    timeLeft: "~40 min restantes hoy",
  },
  modules: [
    {
      id: 1,
      state: "active",
      badge: "Módulo activo",
      focus: "Foco prioritario: Matemáticas",
      tutor: "Acompaña: Búho Aurelio",
      title: "Módulo 1: Fracciones con sentido visual",
      description:
        "Aprender a descomponer la unidad, comparar tamaños y comprender el valor real de numeradores y denominadores mediante modelos gráficos geométricos.",
      items: [
        {
          kind: "lesson",
          code: "1.1",
          title: "Lección 1.1: Partes de un todo y denominadores",
          description:
            "Identificación de cortes equitativos en figuras circulares y rectangulares.",
          status: "done",
        },
        {
          kind: "lesson",
          code: "1.2",
          title: "Lección 1.2: El numerador: lo que tomo vs. lo que queda",
          description:
            "Diferenciación activa entre la cantidad seleccionada y el residuo del entero.",
          status: "current",
        },
        {
          kind: "checkpoint",
          title: "Control de progreso con Búho Aurelio",
          description:
            "Mini prueba interactiva para confirmar que el razonamiento fraccionario está consolidado.",
          meta: "5 preguntas guiadas",
          action: "Ver temario",
        },
      ],
    },
    {
      id: 2,
      state: "upcoming",
      badge: "Siguiente etapa",
      focus: "Foco prioritario: Lenguaje y comprensión",
      tutor: "Acompaña: Pandi",
      lockedNote: "Desbloquea al completar el Módulo 1",
      title: "Módulo 2: Pistas ocultas en la lectura (comprensión inferencial)",
      description:
        "Descubrimiento de causas implícitas, intenciones de personajes y deducciones sin prisa, con el método de lectura reflexiva de Pandi.",
      items: [
        {
          kind: "lesson",
          code: "2.1",
          title: "Lección 2.1: Detectives del texto: lo que no se dice explícito",
          description: "Inferencia a partir de pistas implícitas.",
          status: "locked",
        },
        {
          kind: "lesson",
          code: "2.2",
          title: "Lección 2.2: Contexto y significado de palabras desconocidas",
          description: "Construcción de vocabulario por contexto.",
          status: "locked",
        },
        {
          kind: "checkpoint",
          title: "Control de inferencias con Pandi (4 casos prácticos)",
          description:
            "Cuatro textos breves para aplicar el método de lectura reflexiva.",
          meta: "4 casos prácticos",
          action: "Ver temario",
        },
      ],
    },
    {
      id: 3,
      state: "scheduled",
      badge: "Programado",
      title: "Módulo 3: Resolución de problemas integrados",
      description:
        "Articulación de lenguaje y cálculo para situaciones cotidianas de nivel 4.º con apoyo conjunto.",
      items: [],
    },
  ] satisfies PathModule[],
  rationale: {
    title: "Por qué esta ruta",
    description:
      "Tu diagnóstico reflejó 90% en operatoria básica pero dificultades al transformar fracciones en porciones reales. El plan ajusta esa relación antes de avanzar.",
  },
  weekly: {
    title: "Ritmo sugerido",
    detail: "15 minutos diarios • Lun a Jue",
    action: "Ajustar",
  },
}

/* -------------------------------------------------------------------------- */
/* Rutas por tema (home)                                                       */
/* -------------------------------------------------------------------------- */

/** Icono asociado a una ruta. La equivalencia con lucide vive en la vista. */
export type RouteIcon = "fraction" | "reading" | "problems"

/**
 * Estado de una historia. El estado de la ruta se deriva de sus historias, no
 * se almacena: así es imposible que ambos se desincronicen.
 */
export type StoryStatus = "done" | "current" | "locked"

export type Story = {
  id: string
  title: string
  description: string
  status: StoryStatus
  /** Duración estimada de la historia. */
  duration: string
  /** Puntos que se ganan al completarla. */
  points: number
}

/** Una ruta por tema: el acordeón que agrupa las historias de una materia. */
export type ThemeRoute = {
  id: string
  theme: string
  subject: string
  icon: RouteIcon
  tutor: string
  summary: string
  stories: Story[]
}

export const topicSearch = {
  label: "Tema libre",
  placeholder:
    "Escribe un tema libre (ej: Los Piratas, El Espacio, Fracciones)...",
  action: "Crear Misión",
  emptyError: "Escribe un tema para crear una aventura personal.",
  created: "Misión personalizada en preparación",
}

export const routesSection = {
  eyebrow: "Rutas por tema",
  title: "Tu Ruta de Misiones",
  description:
    "Hay una ruta por tema. Abre la que estés trabajando para ver las historias que necesitas hacer y continúa justo donde la dejaste.",
  storiesUnit: "historias",
  viewAllAction: "Ver ruta completa",
  statusLabels: {
    active: "En curso",
    completed: "Completada",
    locked: "Bloqueada",
  },
}

export const themeRoutes: ThemeRoute[] = [
  {
    id: "fracciones",
    theme: "Fracciones con sentido visual",
    subject: "Matemáticas",
    icon: "fraction",
    tutor: "Búho Aurelio",
    summary:
      "Divide un todo en partes iguales y aprende a leer el numerador como la parte que tomas, no la que queda.",
    stories: [
      {
        id: "fracciones-1",
        title: "El pastel de la abuela",
        description:
          "Ana se comió 3 de 6 porciones iguales. Representa qué fracción del pastel se llevó.",
        status: "done",
        duration: "5 min",
        points: 20,
      },
      {
        id: "fracciones-2",
        title: "El botín del capitán",
        description:
          "Reparte 12 monedas de oro entre 3 amigos sin que sobre ni falte ninguna.",
        status: "current",
        duration: "7 min",
        points: 20,
      },
      {
        id: "fracciones-3",
        title: "La cinta de Leo",
        description:
          "Leo pintó 3 de 4 partes de una cinta. Compara su resultado con la mitad.",
        status: "locked",
        duration: "6 min",
        points: 15,
      },
    ],
  },
  {
    id: "inferencia",
    theme: "Pistas ocultas en la lectura",
    subject: "Lengua",
    icon: "reading",
    tutor: "Pandi",
    summary:
      "Lee entre líneas: descubre intenciones, causas y motivos que el texto no dice de forma explícita.",
    stories: [
      {
        id: "inferencia-1",
        title: "Jugaron bajo la lluvia",
        description:
          "El grupo decidió jugar con la lluvia encima. ¿Qué nos dice esa decisión?",
        status: "locked",
        duration: "8 min",
        points: 20,
      },
      {
        id: "inferencia-2",
        title: "El cajón de Don Tomás",
        description:
          "La nieta cambió dónde se guardaban las herramientas. Explica por qué funcionó.",
        status: "locked",
        duration: "8 min",
        points: 20,
      },
      {
        id: "inferencia-3",
        title: "Dos reseñas del mismo libro",
        description:
          "Dos personas recomendaron el mismo título y escribieron cosas distintas. ¿Por qué?",
        status: "locked",
        duration: "6 min",
        points: 15,
      },
    ],
  },
  {
    id: "problemas",
    theme: "Resolución de problemas integrados",
    subject: "Matemáticas y Lengua",
    icon: "problems",
    tutor: "Búho Aurelio y Pandi",
    summary:
      "Lee un problema de la vida diaria, identifica los datos que importan y elige la operación correcta.",
    stories: [
      {
        id: "problemas-1",
        title: "La excursión de la clase",
        description:
          "Calcula el costo de los cuadernos y los lápices, y cuánto paga cada alumno.",
        status: "locked",
        duration: "10 min",
        points: 25,
      },
      {
        id: "problemas-2",
        title: "El pedido del kiosco",
        description:
          "Reparte la cuenta del kiosco entre cuatro amigos y comprueba que el total cuadra.",
        status: "locked",
        duration: "10 min",
        points: 25,
      },
      {
        id: "problemas-3",
        title: "El presupuesto del viaje",
        description:
          "Elige una excursión que quepa en el presupuesto sin pasarte de los tres números.",
        status: "locked",
        duration: "12 min",
        points: 30,
      },
    ],
  },
]
