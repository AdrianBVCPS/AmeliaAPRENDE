import React, { useContext } from 'react';
import { GameContext } from '../App';
import { LEVELS } from '../constants';
import { Star, Gift, Wand2, Loader2 } from 'lucide-react';

interface WorldMapProps {
  onLevelSelect: (levelId: number) => void;
  onOpenStickers: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onLevelSelect, onOpenStickers }) => {
  const { progress, generateNewContent, isLoadingAI } = useContext(GameContext);

  return (
    <div className="flex flex-col items-center justify-start h-full p-6 overflow-y-auto no-scrollbar pb-32 bg-sky-50 relative">
      
      {/* Magic AI Button - Top Left */}
      <button 
        onClick={generateNewContent}
        disabled={isLoadingAI}
        className="absolute top-4 left-4 bg-purple-100 text-purple-600 p-3 rounded-full shadow-md border-2 border-purple-200 active:scale-95 transition-all z-10"
        aria-label="Magia IA"
      >
        {isLoadingAI ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
      </button>

      <h1 className="text-4xl font-print font-bold text-sky-600 mb-8 mt-4 text-center animate-wiggle drop-shadow-sm">
        Amelia Aprende Letras
      </h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {LEVELS.map((level) => {
          const score = progress.levelScores[level.id] || 0;

          return (
            <button
              key={level.id}
              onClick={() => onLevelSelect(level.id)}
              className={`
                relative aspect-square rounded-[2rem] p-4 flex flex-col items-center justify-center
                shadow-[0_8px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-2
                transition-all duration-200 border-4 border-white
                ${level.color}
                hover:brightness-105
              `}
            >
              <div className="text-6xl mb-3 filter drop-shadow-md transform transition-transform group-hover:scale-110">
                {level.icon}
              </div>
              
              <span className="font-print font-bold text-2xl text-slate-700 text-center leading-none tracking-tight">
                {level.title}
              </span>

              {/* Stars container */}
              <div className="mt-3 flex gap-1 bg-white/40 p-1 px-2 rounded-full">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${score >= star * 33 ? 'fill-yellow-400 text-yellow-500' : 'text-white'}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onOpenStickers}
        className="mt-10 bg-white border-4 border-yellow-300 rounded-full px-10 py-4 shadow-xl flex items-center gap-4 animate-bounce-slow hover:scale-105 transition-transform"
      >
        <Gift className="w-8 h-8 text-yellow-500" />
        <span className="font-print font-bold text-2xl text-yellow-600">Mis Premios</span>
      </button>
    </div>
  );
};