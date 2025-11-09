import { Question, ChatbotProfile } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'En una escala del 1 (muy agotado/a) al 5 (lleno/a de energía), ¿cómo te sientes ahora mismo?',
    type: 'scale',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 2,
    text: 'En la última semana, ¿has sentido más ganas de buscar conversaciones o de evitarlas?',
    type: 'multiple-choice',
    options: ['Buscar conversaciones', 'Evitarlas', 'Una mezcla de ambos'],
  },
  {
    id: 3,
    text: 'Cuando piensas en conocer a alguien nuevo, ¿cuál es tu primer sentimiento?',
    type: 'multiple-choice',
    options: ['Emoción', 'Curiosidad', 'Nerviosismo', 'Cansancio', 'Escepticismo'],
    helperText: 'Ej: Emoción, Curiosidad, Nerviosismo, Cansancio, Escepticismo',
  },
  {
    id: 4,
    text: '¿Cuál de estas opciones te parece más difícil?',
    type: 'multiple-choice',
    options: ['Iniciar una conversación', 'Mantener una conversación'],
  },
  {
    id: 5,
    text: '¿Te resulta fácil hablar de tus propios sentimientos y experiencias?',
    type: 'multiple-choice',
    options: ['Sí, bastante fácil', 'Depende de la persona', 'No, es difícil'],
  },
  {
    id: 6,
    text: '¿Con qué frecuencia te preocupa lo que los demás piensan de ti después de una interacción social?',
    type: 'multiple-choice',
    options: ['Rara vez o nunca', 'A veces', 'Muy a menudo'],
  },
  {
    id: 7,
    text: "Cuando estás con otros, ¿sientes que eres más tu 'verdadero yo' o que estás 'interpretando un papel'?",
    type: 'multiple-choice',
    options: ["Mi 'verdadero yo'", "Estoy 'interpretando un papel'"],
  },
  {
    id: 8,
    text: '¿Cuál es tu principal objetivo al conectar con gente nueva?',
    type: 'multiple-choice',
    options: [
      'Encontrar amigos con intereses comunes',
      'Encontrar una pareja romántica',
      'Practicar mis habilidades sociales',
      'Aún no estoy seguro/a',
    ],
  },
  {
    id: 9,
    text: "¿Qué tan fácil te resulta establecer límites (por ejemplo, decir 'no' o 'no me siento cómodo/a con eso')?",
    type: 'multiple-choice',
    options: ['Muy fácil', 'Más o menos', 'Es muy difícil'],
  },
  {
    id: 10,
    text: 'Si tienes una experiencia social difícil, ¿cuál es tu primera reacción?',
    type: 'multiple-choice',
    options: [
      'Intento aprender de ella',
      'Me frustro con la otra persona',
      'Tiendo a culparme y a sentirme mal por un tiempo',
    ],
  },
  {
    id: 11,
    text: '¿Sientes una sensación de soledad que te gustaría cambiar?',
    type: 'multiple-choice',
    options: ['Sí', 'No', 'Un poco'],
  },
  {
    id: 12,
    text: 'Para terminar, ¿qué palabra describe mejor lo que buscas aquí?',
    type: 'multiple-choice',
    options: ['Confianza', 'Comprensión', 'Conexión', 'Calma'],
    helperText: 'Ej: Confianza, Comprensión, Conexión, Calma',
  },
];


export const PRACTICE_PROMPTS: string[] = [
  "¿Qué es algo que te hizo sonreír hoy?",
  "Describe un desafío reciente y cómo te sentiste al enfrentarlo.",
  "¿Cuál es una cosa por la que estás agradecido/a ahora mismo?",
  "Si pudieras decirle una cosa a tu yo del pasado, ¿qué sería?",
  "Escribe sobre un lugar donde te sientas en completa paz.",
  "¿Cuál es una pequeña meta que podrías lograr esta semana?",
];

export const CHATBOT_PROFILES: ChatbotProfile[] = [
  {
    id: 'sofia',
    name: 'Sofía',
    avatar: 'avatar1',
    bio: 'Amante del arte, la poesía y las conversaciones profundas. Siempre buscando inspiración en los pequeños detalles.',
    personality: ['Creativa', 'Reflexiva', 'Empática']
  },
  {
    id: 'leo',
    name: 'Leo',
    avatar: 'avatar2',
    bio: 'Viajero, fotógrafo y contador de historias. Hablemos de tu próximo gran viaje o del último libro que te atrapó.',
    personality: ['Aventurero', 'Curioso', 'Optimista']
  },
  {
    id: 'clara',
    name: 'Clara',
    avatar: 'avatar3',
    bio: 'Programadora y aficionada a los puzzles. Disfruto de una buena charla sobre tecnología, ciencia o cualquier acertijo lógico.',
    personality: ['Analítica', 'Ingeniosa', 'Directa']
  },
  {
    id: 'mateo',
    name: 'Mateo',
    avatar: 'avatar4',
    bio: 'Guitarrista y amante de la música indie. Busco conversaciones tranquilas y compartir buenas vibras.',
    personality: ['Relajado', 'Amable', 'Introvertido']
  }
];