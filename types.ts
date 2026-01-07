export type FontMode = 'print' | 'cursive';

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  unlocked: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  color: string;
  icon: string;
  type: 'letters' | 'syllables' | 'words' | 'stories';
  content: GameItem[];
}

export interface GameItem {
  id: string;
  text: string; // Display text (e.g., "A", "MA", "SOL")
  phonetic: string; // How it sounds (e.g., "aaaa")
  prompt: string; // Intro question (e.g., "¿Cuál es la letra A?")
  constructionParts?: string[]; // For builder mode
  emoji?: string; // Visual icon for the word/story
}

export interface UserProgress {
  unlockedLevels: number;
  stickers: string[]; // IDs of unlocked stickers
  levelScores: Record<number, number>; // Level ID -> Percentage 0-100
}

export type ScreenState = 'MAP' | 'GAME_SELECT' | 'GAME_CANVAS' | 'GAME_QUIZ' | 'GAME_BUILDER' | 'STICKERS';

export interface GameContextType {
  fontMode: FontMode;
  setFontMode: (mode: FontMode) => void;
  progress: UserProgress;
  unlockSticker: () => void;
  completeLevel: (levelId: number, score: number) => void;
  playAudio: (text: string, isPrompt?: boolean) => Promise<void>;
  currentLevel: LevelData | null;
  setCurrentLevel: (level: LevelData | null) => void;
  generateNewContent: () => Promise<void>;
  isLoadingAI: boolean;
}