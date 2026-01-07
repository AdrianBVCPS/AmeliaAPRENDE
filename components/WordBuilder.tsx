import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../App';
import { GameItem } from '../types';
import { ArrowRight, RotateCw, Volume2, Eye } from 'lucide-react';
import { playSFX } from '../services/audioService';
import { ParticleExplosion } from './UI/Particles';

interface WordBuilderProps {
  item: GameItem;
  onComplete: () => void;
  onExit: () => void;
}

export const WordBuilder: React.FC<WordBuilderProps> = ({ item, onComplete, onExit }) => {
  const { playAudio, fontMode } = useContext(GameContext);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [availableParts, setAvailableParts] = useState<{id: number, val: string, used: boolean}[]>([]);
  const [showSuccessParticles, setShowSuccessParticles] = useState(false);

  useEffect(() => {
    // Init level
    if (item.constructionParts) {
      // Filter out spaces from logic so child only builds letters
      const nonSpaceParts = item.constructionParts.filter(p => p.trim() !== '');
      
      setSlots(new Array(nonSpaceParts.length).fill(null));
      
      const parts = nonSpaceParts.map((val, idx) => ({
        id: idx,
        val: val,
        used: false
      })).sort(() => 0.5 - Math.random()); // Shuffle
      
      setAvailableParts(parts);
      playAudio(item.prompt, true);
    }
    setShowSuccessParticles(false);
  }, [item, playAudio]);

  const handlePartClick = (partId: number, val: string) => {
    // Find first empty slot
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) return; // Full

    playSFX('pop');
    playAudio(val); 

    const newSlots = [...slots];
    newSlots[emptyIndex] = val;
    setSlots(newSlots);

    setAvailableParts(prev => prev.map(p => p.id === partId ? { ...p, used: true } : p));

    // Check completion
    if (emptyIndex === slots.length - 1) {
      validate(newSlots);
    }
  };

  const handleSlotClick = (index: number) => {
    const val = slots[index];
    if (!val) return;

    playSFX('pop');
    playAudio("Borrado"); 
    
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);

    // Find the part in available and un-use it
    setAvailableParts(prev => {
      const parts = [...prev];
      const partIndex = parts.findIndex(p => p.val === val && p.used);
      if (partIndex !== -1) parts[partIndex].used = false;
      return parts;
    });
  };

  const validate = (currentSlots: (string | null)[]) => {
    const builtWord = currentSlots.join('');
    // Compare against the non-space version of target
    const targetWord = item.constructionParts?.filter(p => p.trim() !== '').join('') || '';

    if (builtWord === targetWord) {
      setShowSuccessParticles(true);
      setTimeout(() => {
        playSFX('success');
        playAudio(`¡Excelente! ${item.phonetic}`);
        onComplete();
      }, 500);
    } else {
        setTimeout(() => {
             playSFX('fail');
             playAudio("Casi casi, inténtalo de nuevo.");
        }, 500);
    }
  };

  const reset = () => {
     // Re-filter spaces for reset logic
     const len = item.constructionParts?.filter(p => p.trim() !== '').length || 0;
     setSlots(new Array(len).fill(null));
     setAvailableParts(prev => prev.map(p => ({...p, used: false})));
     playSFX('pop');
  };

  return (
    <div className="flex flex-col h-full bg-orange-50/50 relative overflow-hidden">
       {showSuccessParticles && <ParticleExplosion x={window.innerWidth / 2} y={window.innerHeight / 2} />}
       
       <div className="flex justify-between items-center p-4 z-10">
        <button onClick={onExit} className="text-slate-500">
           <ArrowRight className="rotate-180 w-8 h-8" />
        </button>
        <button onClick={() => playAudio(item.prompt)} className="bg-white p-2 rounded-full shadow-sm text-blue-500">
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-4 px-4 overflow-y-auto pb-20">
        
        {/* VISUAL MODEL */}
        <div className="mb-6 flex flex-col items-center animate-pop">
            <div className="text-slate-400 text-lg font-print mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5" /> Mira y construye:
            </div>
            
            <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-sm border-2 border-orange-100">
                {item.emoji && (
                    <span className="text-6xl animate-bounce-slow filter drop-shadow-sm">{item.emoji}</span>
                )}
                <div className={`
                    text-5xl font-bold text-slate-700 tracking-wider
                    ${fontMode === 'cursive' ? 'font-cursive' : 'font-print'}
                `}>
                    {item.text}
                </div>
            </div>
        </div>
        
        {/* Slots Area */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 min-h-[90px] bg-white/60 p-4 rounded-3xl w-full max-w-2xl border-4 border-dashed border-orange-200">
          {slots.map((slot, idx) => (
             <button
               key={idx}
               onClick={() => handleSlotClick(idx)}
               className={`
                 w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-b-4 flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-sm
                 transition-all text-slate-800
                 ${slot ? 'bg-orange-100 border-orange-300' : 'bg-slate-50 border-slate-200'}
                 ${fontMode === 'cursive' ? 'font-cursive' : 'font-print'}
               `}
             >
               {slot}
             </button>
          ))}
        </div>

        {/* Parts Pool */}
        <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
          {availableParts.map((part) => (
            <button
              key={part.id}
              onClick={() => handlePartClick(part.id, part.val)}
              disabled={part.used}
              className={`
                px-5 py-3 sm:px-6 sm:py-4 rounded-2xl text-2xl sm:text-3xl font-bold shadow-[0_6px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-2 transition-all bg-white
                text-slate-800 min-w-[3.5rem]
                ${part.used ? 'opacity-0 pointer-events-none' : 'opacity-100 border-2 border-slate-100'}
                ${fontMode === 'cursive' ? 'font-cursive' : 'font-print'}
              `}
            >
              {part.val}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex justify-center absolute bottom-4 left-0 right-0 pointer-events-none">
         <button onClick={reset} className="pointer-events-auto p-4 rounded-full bg-slate-200 text-slate-500 active:scale-95 transition-transform shadow-md">
            <RotateCw className="w-8 h-8" />
         </button>
      </div>
    </div>
  );
};