import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
}

export const ParticleExplosion: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#FFD1DC', '#AEC6CF', '#B0E57C', '#FDFD96', '#FFB347'];
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: 0,
      y: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      speed: 2 + Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full animate-pop"
          style={{
            backgroundColor: p.color,
            transform: `translate(${Math.cos(p.angle) * p.speed * 20}px, ${Math.sin(p.angle) * p.speed * 20}px)`,
            opacity: 0,
            transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
          }}
        />
      ))}
    </div>
  );
};
