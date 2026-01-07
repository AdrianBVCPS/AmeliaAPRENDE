import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../App';
import { GameItem } from '../types';
import { ArrowRight, Volume2, Wand2, Loader2 } from 'lucide-react';
import { playSFX } from '../services/audioService';
import { ParticleExplosion } from './UI/Particles';

interface QuizGameProps {
  items: GameItem[];
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ items, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<GameItem[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [correctParticle, setCorrectParticle] = useState<{x: number, y: number} | null>(null);
  
  const { playAudio, fontMode, generateNewContent, isLoadingAI } = useContext(GameContext);
  const currentItem = items[currentIndex];

  useEffect(() => {
    if (currentIndex >= items.length) {
        setCurrentIndex(0);
    }
    startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, items]);

  const startRound = () => {
    if (!items[currentIndex]) return;
    
    setMistakes(0);
    setWrongOptions([]);
    setCorrectParticle(null);

    const distractors = items
      .filter(i => i.id !== items[currentIndex].id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const roundOptions = [items[currentIndex], ...distractors].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    setTimeout(() => {
      // Prepend "Cuál es" for better flow in quiz mode
      playAudio(`¿Cuál es... ${items[currentIndex].prompt}?`, true);
    }, 500);
  };

  const handleOptionClick = async (item: GameItem, e: React.MouseEvent) => {
    if (wrongOptions.includes(item.id)) return;

    if (item.id === currentItem.id) {
      setCorrectParticle({ x: e.clientX, y: e.clientY });
      playSFX('success');
      playAudio('¡Muy bien!');
      
      setTimeout(() => {
        if (currentIndex < items.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          onComplete(100);
        }
      }, 1500);

    } else {
      playSFX('fail');
      playAudio(item.phonetic); 
      setMistakes(prev => prev + 1);
      
      if (mistakes >= 2) {
        setWrongOptions(prev => [...prev, item.id]);
      }
    }
  };

  useEffect(() => {
    if (mistakes >= 3) {
       const availableWrong = options.filter(o => o.id !== currentItem.id && !wrongOptions.includes(o.id));
       if (availableWrong.length > 0) {
         setWrongOptions(prev => [...prev, availableWrong[0].id]);
       }
    }
  }, [mistakes, options, wrongOptions, currentItem?.id]);

  if (!currentItem) return null;

  return (
    <div className="flex flex-col h-full bg-blue-50">
      <div className="flex justify-between items-center p-4">
        <button onClick={onExit} className="text-slate-500">
           <ArrowRight className="rotate-180 w-8 h-8" />
        </button>
        <div className="flex gap-2">
           {items.map((_, idx) => (
             <div key={idx} className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-blue-500' : idx < currentIndex ? 'bg-green-400' : 'bg-slate-300'}`} />
           ))}
        </div>
        
        <div className="w-8"></div> {/* Spacer since magic button is on Map now */}

        <button onClick={() => playAudio(`¿Cuál es... ${currentItem.prompt}?`, true)} className="bg-white p-2 rounded-full shadow-sm text-blue-500">
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-print text-center text-slate-600 mb-8 animate-bounce-slow max-w-sm">
          ¿Cuál es... {currentItem.prompt}?
        </h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {options.map((opt) => {
            const isHidden = wrongOptions.includes(opt.id);
            const isCorrect = opt.id === currentItem.id;
            
            return (
              <button
                key={opt.id}
                onClick={(e) => handleOptionClick(opt, e)}
                disabled={isHidden || !!correctParticle}
                className={`
                  aspect-square rounded-3xl bg-white shadow-[0_6px_0_rgba(0,0,0,0.1)] 
                  flex flex-col gap-2 items-center justify-center font-bold select-none
                  transition-all duration-300 border-4 text-slate-800
                  ${isHidden ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
                  ${correctParticle && isCorrect ? 'bg-green-100 border-green-400 scale-110' : 'border-white active:scale-95'}
                  ${fontMode === 'cursive' ? 'font-cursive' : 'font-print'}
                `}
              >
                {opt.emoji && <span className="text-4xl">{opt.emoji}</span>}
                <span className="text-4xl">{opt.text.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {correctParticle && <ParticleExplosion x={correctParticle.x} y={correctParticle.y} />}
    </div>
  );
};