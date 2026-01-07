// Simple audio context singleton for SFX only
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const stopAudio = () => {
  // Stop Browser TTS
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

// Helper to find the best Spanish voice
const getBestVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  
  // Priority list for more natural voices
  // 1. Google Español (usually smooth)
  // 2. Microsoft Paulina/Monica (Windows natural)
  // 3. Any 'es-ES' or 'es-MX'
  
  const googleVoice = voices.find(v => v.lang.startsWith('es') && v.name.includes('Google'));
  if (googleVoice) return googleVoice;

  const naturalVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Paulina') || v.name.includes('Monica')));
  if (naturalVoice) return naturalVoice;

  return voices.find(v => v.lang.startsWith('es')) || null;
};

export const playBrowserTTS = (text: string) => {
    stopAudio();
    
    // Some browsers need a moment to load voices
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => playBrowserTTS(text);
        return;
    }

    const u = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    if (voice) {
        u.voice = voice;
    }
    u.lang = 'es-ES';
    u.rate = 0.85; // Slightly slower for kids
    u.pitch = 1.1; // Slightly higher pitch is friendlier
    window.speechSynthesis.speak(u);
};


// Simple SFX synthesis
export const playSFX = (type: 'success' | 'fail' | 'pop') => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'success') {
    // Nice major chord arpeggio
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } else if (type === 'fail') {
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.type = 'sawtooth';
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } else {
    // Pop sound
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }
};