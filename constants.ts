import { LevelData, Sticker } from './types';

export const STICKERS: Sticker[] = [
  { id: 's1', emoji: '🦁', name: 'León', unlocked: false },
  { id: 's2', emoji: '🚀', name: 'Cohete', unlocked: false },
  { id: 's3', emoji: '🌟', name: 'Estrella', unlocked: false },
  { id: 's4', emoji: '🦄', name: 'Unicornio', unlocked: false },
  { id: 's5', emoji: '🦕', name: 'Dino', unlocked: false },
  { id: 's6', emoji: '🍦', name: 'Helado', unlocked: false },
  { id: 's7', emoji: '🌈', name: 'Arcoiris', unlocked: false },
  { id: 's8', emoji: '🐶', name: 'Perrito', unlocked: false },
  { id: 's9', emoji: '👑', name: 'Corona', unlocked: false },
  { id: 's10', emoji: '🎸', name: 'Guitarra', unlocked: false },
];

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: 'Vocales',
    color: 'bg-pastel-pink',
    icon: '🅰️',
    type: 'letters',
    content: [
      { id: 'a', text: 'A', phonetic: 'aaa', prompt: 'La letra A', constructionParts: ['A'], emoji: '🐝' },
      { id: 'e', text: 'E', phonetic: 'eee', prompt: 'La letra E', constructionParts: ['E'], emoji: '🐘' },
      { id: 'i', text: 'I', phonetic: 'iii', prompt: 'La letra I', constructionParts: ['I'], emoji: '🏝️' },
      { id: 'o', text: 'O', phonetic: 'ooo', prompt: 'La letra O', constructionParts: ['O'], emoji: '🐻' },
      { id: 'u', text: 'U', phonetic: 'uuu', prompt: 'La letra U', constructionParts: ['U'], emoji: '🍇' },
    ]
  },
  {
    id: 2,
    title: 'Consonantes',
    color: 'bg-pastel-blue',
    icon: '🤠',
    type: 'letters',
    content: [
      { id: 'm', text: 'M', phonetic: 'mmm', prompt: 'La letra M', constructionParts: ['M'], emoji: '🤱' },
      { id: 'p', text: 'P', phonetic: 'ppp', prompt: 'La letra P', constructionParts: ['P'], emoji: '👨' },
      { id: 's', text: 'S', phonetic: 'sss', prompt: 'La letra S', constructionParts: ['S'], emoji: '☀️' },
      { id: 'l', text: 'L', phonetic: 'lll', prompt: 'La letra L', constructionParts: ['L'], emoji: '🌙' },
      { id: 't', text: 'T', phonetic: 'ttt', prompt: 'La letra T', constructionParts: ['T'], emoji: '🚂' },
      { id: 'd', text: 'D', phonetic: 'ddd', prompt: 'La letra D', constructionParts: ['D'], emoji: '👆' },
      { id: 'n', text: 'N', phonetic: 'nnn', prompt: 'La letra N', constructionParts: ['N'], emoji: '☁️' },
      { id: 'f', text: 'F', phonetic: 'fff', prompt: 'La letra F', constructionParts: ['F'], emoji: '🌸' },
      { id: 'b', text: 'B', phonetic: 'bbb', prompt: 'La letra B', constructionParts: ['B'], emoji: '⛵' },
      { id: 'c', text: 'C', phonetic: 'kkk', prompt: 'La letra C', constructionParts: ['C'], emoji: '🏠' },
    ]
  },
  {
    id: 4,
    title: 'Sílabas',
    color: 'bg-pastel-yellow',
    icon: '🧩',
    type: 'syllables',
    content: [
      { id: 'ma', text: 'MA', phonetic: 'ma', prompt: 'La sílaba MA', constructionParts: ['M', 'A'], emoji: '🖐️' },
      { id: 'pa', text: 'PA', phonetic: 'pa', prompt: 'La sílaba PA', constructionParts: ['P', 'A'], emoji: '🦆' },
      { id: 'sa', text: 'SA', phonetic: 'sa', prompt: 'La sílaba SA', constructionParts: ['S', 'A'], emoji: '🐸' },
      { id: 'la', text: 'LA', phonetic: 'la', prompt: 'La sílaba LA', constructionParts: ['L', 'A'], emoji: '✏️' },
      { id: 'me', text: 'ME', phonetic: 'me', prompt: 'La sílaba ME', constructionParts: ['M', 'E'], emoji: '🍈' },
      { id: 'ti', text: 'TI', phonetic: 'ti', prompt: 'La sílaba TI', constructionParts: ['T', 'I'], emoji: '💇' },
      { id: 'no', text: 'NO', phonetic: 'no', prompt: 'La sílaba NO', constructionParts: ['N', 'O'], emoji: '🚫' },
      { id: 'tu', text: 'TU', phonetic: 'tu', prompt: 'La sílaba TU', constructionParts: ['T', 'U'], emoji: '👉' },
    ]
  },
  {
    id: 6,
    title: 'Palabras',
    color: 'bg-pastel-purple',
    icon: '📚',
    type: 'words',
    content: [
      { id: 'sol', text: 'SOL', phonetic: 'sol', prompt: 'La palabra SOL', constructionParts: ['S', 'O', 'L'], emoji: '☀️' },
      { id: 'pan', text: 'PAN', phonetic: 'pan', prompt: 'La palabra PAN', constructionParts: ['P', 'A', 'N'], emoji: '🍞' },
      { id: 'mar', text: 'MAR', phonetic: 'mar', prompt: 'La palabra MAR', constructionParts: ['M', 'A', 'R'], emoji: '🌊' },
      { id: 'luz', text: 'LUZ', phonetic: 'luz', prompt: 'La palabra LUZ', constructionParts: ['L', 'U', 'Z'], emoji: '💡' },
      { id: 'oso', text: 'OSO', phonetic: 'oso', prompt: 'La palabra OSO', constructionParts: ['O', 'S', 'O'], emoji: '🐻' },
      { id: 'luna', text: 'LUNA', phonetic: 'luna', prompt: 'La palabra LUNA', constructionParts: ['L', 'U', 'N', 'A'], emoji: '🌙' },
      { id: 'gato', text: 'GATO', phonetic: 'gato', prompt: 'La palabra GATO', constructionParts: ['G', 'A', 'T', 'O'], emoji: '🐱' },
      { id: 'casa', text: 'CASA', phonetic: 'casa', prompt: 'La palabra CASA', constructionParts: ['C', 'A', 'S', 'A'], emoji: '🏠' },
    ]
  },
  {
    id: 7,
    title: 'Historias',
    color: 'bg-pastel-orange',
    icon: '📖',
    type: 'stories',
    content: [
      { id: 'h1', text: 'EL OSO RIE', phonetic: 'el oso rie', prompt: 'El oso ríe', constructionParts: ['E', 'L', ' ', 'O', 'S', 'O', ' ', 'R', 'I', 'E'], emoji: '😂' },
      { id: 'h2', text: 'MAMA ME AMA', phonetic: 'mama me ama', prompt: 'Mamá me ama', constructionParts: ['M', 'A', 'M', 'A', ' ', 'M', 'E', ' ', 'A', 'M', 'A'], emoji: '❤️' },
      { id: 'h3', text: 'LA LUNA SALE', phonetic: 'la luna sale', prompt: 'La luna sale', constructionParts: ['L', 'A', ' ', 'L', 'U', 'N', 'A', ' ', 'S', 'A', 'L', 'E'], emoji: '🌃' },
      { id: 'h4', text: 'MI PERRO CORRE', phonetic: 'mi perro corre', prompt: 'Mi perro corre', constructionParts: ['M', 'I', ' ', 'P', 'E', 'R', 'R', 'O', ' ', 'C', 'O', 'R', 'R', 'E'], emoji: '🐕' },
      { id: 'h5', text: 'EL SOL BRILLA', phonetic: 'el sol brilla', prompt: 'El sol brilla', constructionParts: ['E', 'L', ' ', 'S', 'O', 'L', ' ', 'B', 'R', 'I', 'L', 'L', 'A'], emoji: '😎' },
    ]
  }
];