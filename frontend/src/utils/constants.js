export const GAME_CONSTANTS = {
  POINTS_PER_CORRECT_ANSWER: 100,
  MAX_QUESTIONS: 10,
  TIME_LIMIT_PER_QUESTION: 30, // segundos
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100
};

export const SCORE_MESSAGES = {
  PERFECT: { message: "¡Perfecto! 🏆", threshold: 100 },
  EXCELLENT: { message: "¡Excelente! 🌟", threshold: 80 },
  GOOD: { message: "¡Muy bien! 👍", threshold: 60 },
  FAIR: { message: "¡Bien! 👌", threshold: 40 },
  PRACTICE: { message: "¡Sigue practicando! 💪", threshold: 0 }
};

export const CATEGORIES = {
  GEOGRAPHY: 'Geografía',
  HISTORY: 'Historia',
  SCIENCE: 'Ciencia',
  LITERATURE: 'Literatura',
  ART: 'Arte',
  CULTURE: 'Cultura',
  TECHNOLOGY: 'Tecnología',
  SPORTS: 'Deportes',
  ENTERTAINMENT: 'Entretenimiento'
};
