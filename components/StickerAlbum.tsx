import React, { useContext } from 'react';
import { GameContext } from '../App';
import { STICKERS } from '../constants';
import { ArrowRight } from 'lucide-react';

export const StickerAlbum: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { progress } = useContext(GameContext);

  return (
    <div className="absolute inset-0 z-50 bg-yellow-50 flex flex-col overflow-hidden">
      <div className="p-4 flex items-center gap-4 bg-yellow-200 shadow-sm">
        <button onClick={onClose} className="text-yellow-800">
          <ArrowRight className="rotate-180 w-8 h-8" />
        </button>
        <h1 className="text-2xl font-print font-bold text-yellow-900">Mi Álbum</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto grid grid-cols-3 gap-4 auto-rows-min content-start">
        {STICKERS.map((sticker) => {
          const isUnlocked = progress.stickers.includes(sticker.id);
          return (
            <div 
              key={sticker.id}
              className={`
                aspect-square rounded-2xl border-4 flex items-center justify-center text-5xl relative
                ${isUnlocked ? 'bg-white border-yellow-300 shadow-md rotate-1' : 'bg-gray-200 border-gray-300 opacity-50'}
              `}
            >
              {isUnlocked ? sticker.emoji : '?'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
