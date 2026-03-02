'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const WireSpherePanel = dynamic(() => import('@/components/3d/WireSpherePanel'), { ssr: false });

function NeuralParticleField({ boosted }: { boosted: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const pointer = { x: -1000, y: -1000 };
    const particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const onMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const radius = boosted ? 160 : 110;
      const speedFactor = boosted ? 1.9 : 1;

      particles.forEach((particle, index) => {
        particle.x += particle.vx * speedFactor;
        particle.y += particle.vy * speedFactor;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          particle.x -= dx * 0.0025;
          particle.y -= dy * 0.0025;
        }

        context.fillStyle = '#00F0FF';
        context.globalAlpha = boosted ? 0.85 : 0.5;
        context.beginPath();
        context.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
        context.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const lineDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (lineDistance < 120) {
            context.globalAlpha = ((120 - lineDistance) / 120) * (boosted ? 0.8 : 0.35);
            context.strokeStyle = '#7A00FF';
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      });
      context.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [boosted]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-75 pointer-events-none" />;
}

export default function NeuravoxHome() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const [query, setQuery] = useState('Predict global energy demand 2035');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');
  const [feedTick, setFeedTick] = useState(0);
  const fullResponse =
    'Projection complete: 2035 global demand reaches 31.4 PWh (+18.7%), with APAC responsible for 52% of net growth and renewable storage latency dropping 23%.';

  useEffect(() => {
    let isMounted = true;
    import('gsap').then(({ gsap }) => {
      if (isMounted && heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 40, letterSpacing: '0.35em' },
          { opacity: 1, y: 0, letterSpacing: '0.02em', duration: 1.2, ease: 'power3.out' },
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isProcessing || output.length >= fullResponse.length) return undefined;
    const timer = setTimeout(() => setOutput(fullResponse.slice(0, output.length + 2)), 24);
    return () => clearTimeout(timer);
  }, [isProcessing, output, fullResponse]);

  useEffect(() => {
    const timer = setInterval(() => setFeedTick((value) => value + 1), 1500);
    return () => clearInterval(timer);
  }, []);

  function handleDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsProcessing(true);
    setOutput('');
    setTimeout(() => setIsProcessing(false), 2600);
  }

  const feedItems = useMemo(
    () => [
      `Neural cluster sync ${98.12 + (feedTick % 3) / 10}%`,
      `Synthetic latency ${13 + (feedTick % 5)}ms`,
      `Signal confidence ${94.2 + (feedTick % 4) / 10}%`,
    ],
    [feedTick],
  );

  return (
    <ReactLenis root options={{ lerp: 0.06, smoothWheel: true }}>
      <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        <NeuralParticleField boosted={isProcessing} />
        <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_20%_10%,rgba(0,240,255,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(122,0,255,0.2),transparent_40%),linear-gradient(160deg,#050505_35%,#0a0420_100%)]" />
        <div className="pointer-events-none fixed inset-0 z-[1] opacity-30 neural-grid" />

        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-20 pt-24 md:px-10">
          <section id="home" className="relative min-h-[92vh] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl md:p-14">
            <div className="absolute inset-0 opacity-35 noise-layer" />
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#9af8ff]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00F0FF]" />
                NEURAVOX — The Cognitive Interface
              </p>
            </motion.div>
            <h1 ref={heroTitleRef} className="max-w-4xl text-5xl font-bold leading-[0.95] text-white md:text-7xl">
              Where Human Thought Meets Synthetic Intelligence.
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-7 max-w-2xl text-lg text-slate-300"
            >
              An internal-grade cinematic interface designed for predictive cognition, autonomous decisioning, and real-time synthetic reasoning.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group mt-10 rounded-xl border border-[#00F0FF]/50 bg-[#070d18] px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#c6fbff] shadow-[0_0_40px_rgba(0,240,255,0.16)] transition-all hover:border-[#7A00FF] hover:shadow-[0_0_50px_rgba(122,0,255,0.26)]"
            >
              Initialize Cognitive Link
            </motion.button>
            <div className="pointer-events-none absolute right-[-8%] top-[18%] flex h-64 w-64 items-center justify-center rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/5 shadow-[0_0_120px_rgba(0,240,255,0.24)] md:h-80 md:w-80">
              <div className="h-4/5 w-4/5 animate-spin-slow rounded-full border border-dashed border-[#7A00FF]/50" />
              <div className="absolute h-2/3 w-2/3 animate-pulse rounded-full border border-[#00F0FF]/70" />
              <div className="absolute h-1/3 w-1/3 rounded-full bg-[#00F0FF]/30 blur-xl" />
            </div>
          </section>

          <section id="demo" className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Interactive AI Demo</h2>
            <p className="mt-3 text-slate-300">Terminal simulation with neural-wave processing and synthetic forecast rendering.</p>
            <form onSubmit={handleDemo} className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
              <label htmlFor="ai-query" className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-400">Input Signal</label>
              <input
                id="ai-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-lg border border-[#00F0FF]/30 bg-[#050810] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#00F0FF]"
              />
              <button type="submit" className="mt-4 rounded-lg border border-[#7A00FF]/60 bg-[#130422] px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-100">
                Run Simulation
              </button>
              {isProcessing && <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 animate-neural-wave bg-gradient-to-r from-[#00F0FF] to-[#7A00FF]" /></div>}
              <p className="mt-4 min-h-14 font-mono text-sm leading-relaxed text-[#9af8ff]">{output || 'Awaiting cognition request…'}</p>
            </form>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">Energy Forecast 2035</p>
                <div className="flex h-40 items-end gap-3">
                  {[44, 57, 72, 88, 96].map((height, index) => (
                    <motion.div
                      key={height}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-[#00F0FF]/35 to-[#7A00FF]/85"
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">Neural Audio Wave</p>
                <div className="flex h-40 items-center gap-2">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <motion.span
                      key={index}
                      animate={{ height: ['15%', `${20 + ((index + feedTick) % 6) * 12}%`, '15%'] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.04 }}
                      className="w-1.5 rounded-full bg-[#00F0FF]/80"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="capabilities" className="grid gap-6 md:grid-cols-3">
            {['Predictive Intelligence', 'Autonomous Optimization', 'Synthetic Reasoning'].map((title) => (
              <motion.article
                key={title}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#00F0FF]/35 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:left-full group-hover:opacity-100" />
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm text-slate-300">Adaptive inference modules continuously refine outcomes across uncertain and dynamic environments.</p>
              </motion.article>
            ))}
          </section>

          <section id="datapanel" className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">Animated Network Graph</p>
              <svg viewBox="0 0 320 180" className="h-48 w-full">
                {[
                  [24, 28], [94, 44], [148, 26], [222, 54], [282, 28], [62, 132], [142, 146], [228, 122], [292, 138],
                ].map(([x, y], index, arr) => (
                  <g key={`${x}-${y}`}>
                    {arr[index + 1] && <motion.line x1={x} y1={y} x2={arr[index + 1][0]} y2={arr[index + 1][1]} stroke="#7A00FF" strokeOpacity="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: index * 0.06 }} />}
                    <motion.circle cx={x} cy={y} r="4" fill="#00F0FF" animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.08 }} />
                  </g>
                ))}
              </svg>
            </div>
            <div className="grid gap-4">
              <div className="h-52 overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-2">
                <WireSpherePanel />
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">Live Data Feed</p>
                {feedItems.map((item) => (
                  <p key={item} className="text-sm text-[#a8f8ff]">{item}</p>
                ))}
              </div>
            </div>
          </section>

          <footer className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 px-6 py-12 text-center">
            <div className="absolute inset-0 opacity-30 neural-grid" />
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">NEURAVOX — Internal Prototype</p>
              <div className="mx-auto mt-4 h-[2px] w-full max-w-xl overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 animate-neural-wave bg-gradient-to-r from-[#00F0FF] via-white to-[#7A00FF]" />
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ReactLenis>
  );
}
