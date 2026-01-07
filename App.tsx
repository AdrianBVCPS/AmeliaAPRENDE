import React, { useState, useEffect, useRef } from 'react';
import { WorldMap } from './components/WorldMap';
import { CanvasBoard } from './components/CanvasBoard';
import { QuizGame } from './components/QuizGame';
import { WordBuilder } from './components/WordBuilder';
import { StickerAlbum } from './components/StickerAlbum';
import { GameContextType, UserProgress, FontMode, ScreenState, LevelData, Sticker } from './types';
import { generateMagicSession } from './services/geminiService';
import { playBrowserTTS, playSFX, stopAudio } from './services/audioService';
import { LEVELS, STICKERS } from './constants';
import { Type, Play, BookOpen, Sparkles, Home } from 'lucide-react';

export const GameContext = React.createContext<GameContextType>({} as GameContextType);

const MOTIVATIONS = [
  "¡Eres muy inteligente!",
  "¡Aprendes súper rápido!",
  "¡Sigue así, campeón/a!",
  "¡Lo has logrado!",
  "¡Qué gran esfuerzo!",
];

const App: React.FC = () => {
  const [fontMode, setFontMode] = useState<FontMode>('print');
  const [screen, setScreen] = useState<ScreenState>('MAP');
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [currentGameItemIndex, setCurrentGameItemIndex] = useState(0);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<Sticker | null>(null);
  
  // State to hold dynamic levels
  const [dynamicLevels, setDynamicLevels] = useState<LevelData[]>(LEVELS);
  const [dynamicStickers, setDynamicStickers] = useState<Sticker[]>(STICKERS);

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('ameliaProgress_v2');
    return saved ? JSON.parse(saved) : { 
      unlockedLevels: 99, 
      stickers: [], 
      levelScores: {} 
    };
  });

  useEffect(() => {
    localStorage.setItem('ameliaProgress_v2', JSON.stringify(progress));
  }, [progress]);

  const unlockSticker = () => {
    const locked = dynamicStickers.filter(s => !progress.stickers.includes(s.id));
    if (locked.length > 0) {
      const randomSticker = locked[Math.floor(Math.random() * locked.length)];
      setProgress(prev => ({
        ...prev,
        stickers: [...prev.stickers, randomSticker.id]
      }));
      return randomSticker;
    }
    return null;
  };

  const playAudio = async (text: string, isPrompt = false) => {
    playBrowserTTS(text);
  };

  const completeLevel = (levelId: number, score: number) => {
    setProgress(prev => ({
      ...prev,
      levelScores: { ...prev.levelScores, [levelId]: Math.max(score, prev.levelScores[levelId] || 0) }
    }));
    
    const sticker = unlockSticker();
    setEarnedSticker(sticker || dynamicStickers[0]); 
    playSFX('success');
    
    const phrase = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    playAudio(`¡Has ganado un premio! ${phrase}`);
  };

  const closeVictoryModal = () => {
    setEarnedSticker(null);
    setCurrentLevel(null);
    setScreen('MAP');
  };

  const handleGenerateContent = async () => {
    if (isLoadingAI) return;
    setIsLoadingAI(true);
    playSFX('pop');
    playAudio("¡Magia! Creando cosas nuevas para ti...");
    
    const magicData = await generateMagicSession();
    
    if (magicData) {
      // Inject new content into levels
      setDynamicLevels(prevLevels => {
          return prevLevels.map(lvl => {
              if (lvl.type === 'syllables') return { ...lvl, content: [...lvl.content, ...magicData.syllables] };
              if (lvl.type === 'words') return { ...lvl, content: [...lvl.content, ...magicData.words] };
              if (lvl.type === 'stories') return { ...lvl, content: [...lvl.content, ...magicData.stories] };
              return lvl;
          });
      });

      // Add new sticker
      setDynamicStickers(prev => [...prev, { ...magicData.newSticker, id: `ai-${Date.now()}` }]);
      
      playAudio("¡Listo! He creado nuevas palabras y un premio especial.");
    } else {
      playAudio("Ups, la varita mágica descansa.");
    }
    
    setIsLoadingAI(false);
  };

  const [showLevelModal, setShowLevelModal] = useState(false);

  const handleLevelSelect = (levelId: number) => {
    const level = dynamicLevels.find(l => l.id === levelId);
    if (level) {
      setCurrentLevel(level);
      setShowLevelModal(true);
    }
  };

  const handleLevelSuccess = () => {
     if (currentLevel && currentGameItemIndex < currentLevel.content.length - 1) {
       setTimeout(() => {
         setCurrentGameItemIndex(prev => prev + 1);
       }, 1500); 
     } else {
       completeLevel(currentLevel!.id, 100);
     }
  };

  return (
    <GameContext.Provider value={{
      fontMode,
      setFontMode,
      progress,
      unlockSticker,
      completeLevel,
      playAudio,
      currentLevel,
      setCurrentLevel,
      generateNewContent: handleGenerateContent,
      isLoadingAI
    }}>
      <div className={`h-full w-full relative transition-colors duration-500 overflow-hidden ${fontMode === 'cursive' ? 'font-cursive' : 'font-print'}`}>
        
        {/* Font Toggle moved to Right to avoid overlap with Exit button */}
        <button 
           onClick={() => setFontMode(prev => prev === 'print' ? 'cursive' : 'print')}
           className="fixed top-4 right-4 z-40 bg-white p-3 rounded-full shadow-lg border-4 border-blue-200 active:scale-90 transition-transform"
        >
          <Type className="w-8 h-8 text-blue-500" />
        </button>

        {screen === 'MAP' && (
          <WorldMap 
            onLevelSelect={handleLevelSelect} 
            onOpenStickers={() => setScreen('STICKERS')} 
          />
        )}

        {screen === 'STICKERS' && (
          <StickerAlbum onClose={() => setScreen('MAP')} />
        )}

        {screen === 'GAME_CANVAS' && currentLevel && (
          <CanvasBoard 
            target={currentLevel.content[currentGameItemIndex].text}
            onComplete={handleLevelSuccess}
            onExit={() => setScreen('MAP')}
          />
        )}

        {screen === 'GAME_QUIZ' && currentLevel && (
           <QuizGame 
             items={currentLevel.content}
             onComplete={(score) => completeLevel(currentLevel.id, score)}
             onExit={() => setScreen('MAP')}
           />
        )}

        {screen === 'GAME_BUILDER' && currentLevel && (
           <WordBuilder 
              item={currentLevel.content[currentGameItemIndex]}
              onComplete={handleLevelSuccess}
              onExit={() => setScreen('MAP')}
           />
        )}

        {/* Victory Modal */}
        {earnedSticker && (
           <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-pop">
              <div className="bg-white rounded-[3rem] p-8 max-w-sm w-full text-center shadow-2xl border-8 border-yellow-300 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-yellow-50 opacity-50 z-0"></div>
                 <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-yellow-600 font-print mb-2">¡Felicidades!</h2>
                    
                    <p className="text-lg text-yellow-700 font-bold mb-1">¡Has ganado un premio!</p>
                    <p className="text-lg text-slate-500 mb-6">{MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]}</p>
                    
                    <div className="text-9xl mb-6 animate-bounce-slow filter drop-shadow-lg">
                       {earnedSticker.emoji}
                    </div>
                    
                    <p className="text-lg font-bold text-yellow-800 bg-yellow-200 inline-block px-4 py-1 rounded-full mb-8">
                       {earnedSticker.name}
                    </p>

                    <button 
                       onClick={closeVictoryModal}
                       className="w-full bg-green-500 text-white font-bold text-2xl py-4 rounded-2xl shadow-[0_6px_0_rgba(21,128,61,0.3)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-2"
                    >
                       <Home className="w-8 h-8" />
                       <span>Volver al Mapa</span>
                    </button>
                 </div>
              </div>
           </div>
        )}

        {showLevelModal && currentLevel && !earnedSticker && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-pop border-4 border-white">
              <div className="text-6xl text-center mb-4">{currentLevel.icon}</div>
              <h2 className="text-4xl text-center font-bold text-slate-700 mb-2 font-print">{currentLevel.title}</h2>
              
              <div className="flex flex-col gap-4 mt-6">
                {(currentLevel.type !== 'letters') && (
                    <button 
                      onClick={() => { setShowLevelModal(false); setScreen('GAME_BUILDER'); setCurrentGameItemIndex(0); }}
                      className="bg-green-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm active:scale-95 transition-all"
                    >
                      <div className="bg-green-500 p-3 rounded-full text-white"><Sparkles className="w-8 h-8" /></div>
                      <span className="text-xl font-bold text-green-800 font-print">Construir</span>
                    </button>
                )}

                <button 
                  onClick={() => { setShowLevelModal(false); setScreen('GAME_CANVAS'); setCurrentGameItemIndex(0); }}
                  className="bg-orange-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm active:scale-95 transition-all"
                >
                  <div className="bg-orange-500 p-3 rounded-full text-white"><Play className="w-8 h-8" /></div>
                  <span className="text-xl font-bold text-orange-800 font-print">Escribir</span>
                </button>

                <button 
                  onClick={() => { setShowLevelModal(false); setScreen('GAME_QUIZ'); setCurrentGameItemIndex(0); }}
                  className="bg-blue-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm active:scale-95 transition-all"
                >
                   <div className="bg-blue-500 p-3 rounded-full text-white"><BookOpen className="w-8 h-8" /></div>
                   <span className="text-xl font-bold text-blue-800 font-print">Adivinar</span>
                </button>
              </div>

              <button 
                onClick={() => setShowLevelModal(false)}
                className="mt-8 w-full py-4 bg-slate-200 rounded-2xl text-slate-500 font-bold text-xl"
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContext.Provider>
  );
};

export default App;