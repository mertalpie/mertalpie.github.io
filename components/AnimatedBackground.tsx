'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Particle {
  id: number;
  cx: number;
  cy: number;
  r: number;
  color: string;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

const COLORS = [
  'rgba(99,102,241,0.18)',
  'rgba(6,182,212,0.14)',
  'rgba(59,130,246,0.16)',
  'rgba(139,92,246,0.12)',
  'rgba(6,182,212,0.20)',
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    r: 1.5 + Math.random() * 3.5,
    color: COLORS[i % COLORS.length],
    duration: 8 + Math.random() * 14,
    delay: Math.random() * 8,
    dx: (Math.random() - 0.5) * 12,
    dy: (Math.random() - 0.5) * 12,
  }));
}

const AnimatedBackground = memo(function AnimatedBackground() {
  const shouldReduce = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  // Generate particles client-side only to avoid SSR/hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    setParticles(generateParticles(30));
  }, []);

  useEffect(() => {
    if (shouldReduce) return;
    let targetX = 0;
    let targetY = 0;

    function onMouseMove(e: MouseEvent) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function tick() {
      setMouse((prev) => ({
        x: prev.x + (targetX - prev.x) * 0.05,
        y: prev.y + (targetY - prev.y) * 0.05,
      }));
      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduce]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* Dark radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 100%, rgba(6,182,212,0.06) 0%, transparent 60%), #020617',
        }}
      />

      {/* SVG layer: grid + particles */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(148,163,184,0.04)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {particles.map((p) => {
          const parallaxX = shouldReduce ? 0 : mouse.x * 20 * (p.r / 5);
          const parallaxY = shouldReduce ? 0 : mouse.y * 20 * (p.r / 5);

          return (
            <motion.circle
              key={p.id}
              r={p.r}
              fill={p.color}
              initial={{ cx: `${p.cx}%`, cy: `${p.cy}%`, opacity: 0 }}
              animate={
                shouldReduce
                  ? { cx: `${p.cx}%`, cy: `${p.cy}%`, opacity: 0.6 }
                  : {
                      cx: [
                        `calc(${p.cx}% + ${parallaxX}px)`,
                        `calc(${p.cx + p.dx}% + ${parallaxX}px)`,
                        `calc(${p.cx}% + ${parallaxX}px)`,
                      ],
                      cy: [
                        `calc(${p.cy}% + ${parallaxY}px)`,
                        `calc(${p.cy + p.dy}% + ${parallaxY}px)`,
                        `calc(${p.cy}% + ${parallaxY}px)`,
                      ],
                      opacity: [0, 0.8, 0.4, 0.8, 0],
                    }
              }
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : {
                      duration: p.duration,
                      delay: p.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            />
          );
        })}
      </svg>
    </div>
  );
});

export default AnimatedBackground;
