import React, { useRef, useEffect, useState, useContext } from 'react';
import { Trash2, Check, Sparkles, ArrowRight, Pencil, Hand } from 'lucide-react';
import { GameContext } from '../App';
import { validateHandwriting } from '../services/geminiService';
import { playSFX, stopAudio } from '../services/audioService';

interface CanvasBoardProps {
  target: string;
  onComplete: (success: boolean) => void;
  onExit: () => void;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ target, onComplete, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [validating, setValidating] = useState(false);
  const { fontMode, playAudio } = useContext(GameContext);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const isDrawing = useRef(false);

  // Initialize Canvas
  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 20; 
        ctx.strokeStyle = '#2563EB'; // Blue
      }
    };

    initCanvas();
    setTimeout(initCanvas, 100); 

    window.addEventListener('resize', initCanvas);
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      window.removeEventListener('resize', initCanvas);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      stopAudio();
    };
  }, [target]);

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (validating) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawing.current = true;
    setHasDrawn(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current || validating) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const currentPos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.quadraticCurveTo(
      lastPos.current.x, 
      lastPos.current.y, 
      (lastPos.current.x + currentPos.x) / 2, 
      (lastPos.current.y + currentPos.y) / 2
    );
    ctx.stroke();

    lastPos.current = currentPos;
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      playAudio('Borrado');
      playSFX('pop');
    }
  };

  const checkDrawing = async () => {
    if (!hasDrawn) return;
    setValidating(true);
    playSFX('pop');
    
    const result = await validateHandwriting("", target);
    
    setValidating(false);
    playAudio(result.feedback);
    playSFX('success');
    onComplete(true);
  };

  const getFontSize = (text: string) => {
      const len = text.length;
      if (len <= 1) return 200;
      if (len <= 4) return 120;
      if (len <= 8) return 80;
      return 50;
  };

  const fontSize = getFontSize(target);
  const fontFamily = fontMode === 'cursive' ? '"Dancing Script", cursive' : '"Comic Neue", cursive';

  return (
    <div className="flex flex-col h-full bg-blue-50 relative select-none overflow-hidden">
      <div className="flex justify-between items-center p-2 px-4 z-10 bg-white shadow-sm h-16 shrink-0">
        <button onClick={onExit} className="text-slate-500 hover:text-red-500 bg-slate-100 p-2 rounded-full">
           <ArrowRight className="rotate-180 w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 text-blue-800">
           <Pencil className="w-5 h-5" />
           <span className="font-print font-bold text-lg">Escribe:</span>
        </div>
        <div className="w-8"></div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 relative mx-2 my-2 rounded-3xl overflow-hidden shadow-inner bg-[#fffdf5] border-4 border-slate-300 touch-none"
      >
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#000 2px, transparent 2px)',
            backgroundSize: '100% 25%'
          }}
        ></div>
        
        {/* TRACING GUIDE LAYER */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg 
            viewBox="0 0 400 200" 
            preserveAspectRatio="xMidYMid meet" 
            className="w-full h-full p-4"
          >
             <defs>
                <clipPath id="revealMask">
                    <rect x="0" y="0" width="400" height="200">
                        <animate 
                            attributeName="width" 
                            from="0" 
                            to="400" 
                            dur="3.5s" 
                            repeatCount="indefinite"
                        />
                    </rect>
                </clipPath>
             </defs>
             
             {/* 1. Base Layer (Light Gray) - The "Paper" guide */}
             <text 
               x="50%" 
               y="55%" 
               textAnchor="middle" 
               dominantBaseline="middle"
               fontSize={fontSize}
               fontFamily={fontFamily}
               fontWeight="bold"
               fill="#e2e8f0" 
             >
               {target}
             </text>

             {/* 2. Animated Layer (Dark Gray) - Simulating stroke fill */}
             <text 
               x="50%" 
               y="55%" 
               textAnchor="middle" 
               dominantBaseline="middle"
               fontSize={fontSize}
               fontFamily={fontFamily}
               fontWeight="bold"
               fill="#94a3b8"
               clipPath="url(#revealMask)"
             >
               {target}
             </text>
          </svg>
        </div>
        
        {/* Animated Hand Helper */}
        {!hasDrawn && (
            <div className="absolute inset-0 pointer-events-none z-30">
                <style>
                    {`
                    @keyframes moveHand {
                        0% { transform: translateX(10%) translateY(50%) scale(1); opacity: 0; }
                        10% { opacity: 1; }
                        80% { transform: translateX(80%) translateY(50%) scale(1); opacity: 1; }
                        100% { transform: translateX(80%) translateY(50%) scale(1); opacity: 0; }
                    }
                    `}
                </style>
                <div 
                    className="absolute top-[40%] left-0 w-full h-full" 
                    style={{ animation: 'moveHand 3.5s linear infinite' }}
                >
                    <Hand className="w-12 h-12 text-slate-500 fill-slate-200 -rotate-12" />
                </div>
            </div>
        )}

        {/* Start Point Indicator */}
        {!hasDrawn && (
            <div className="absolute top-1/2 left-[10%] sm:left-[20%] -translate-y-1/2 animate-bounce z-40">
                <div className="relative">
                    <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/80 px-2 py-1 rounded text-xs font-bold text-green-700 whitespace-nowrap">
                        INICIO
                    </span>
                </div>
            </div>
        )}

        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          onPointerCancel={stopDrawing}
          className="w-full h-full touch-none cursor-crosshair z-20 relative block"
        />
      </div>

      <div className="h-24 bg-white flex items-center justify-center gap-6 pb-2 px-4 z-10 shrink-0">
        <button 
          onClick={clearCanvas}
          className="w-16 h-16 rounded-2xl bg-red-100 flex flex-col items-center justify-center shadow-sm active:scale-95 transition-all border-2 border-red-200"
        >
          <Trash2 className="w-8 h-8 text-red-500" />
        </button>

        <button
          onClick={checkDrawing}
          disabled={!hasDrawn || validating}
          className={`
            h-16 px-12 rounded-2xl flex items-center gap-4 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all
            ${!hasDrawn ? 'bg-gray-100 text-gray-300' : 'bg-green-500 text-white animate-pulse'}
          `}
        >
          {validating ? (
            <Sparkles className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <Check className="w-8 h-8" />
              <span className="font-print font-bold text-xl">LISTO</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};