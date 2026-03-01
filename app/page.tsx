'use client';
import { motion } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/ui/MagneticButton';
import GlassCard from '@/components/ui/GlassCard';
import { Cpu, Network, Zap } from 'lucide-react';

const NeuralBrain = dynamic(() => import('@/components/3d/NeuralBrain'), { ssr: false });

export default function NeuravoxHome() {
  const springTransition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <div className="min-h-screen bg-background text-white selection:bg-neon-purple selection:text-white overflow-hidden">
        
        {/* Glow Effects */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-neon-blue/20 blur-[120px] mix-blend-screen animate-glow-pulse pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-neon-purple/20 blur-[150px] mix-blend-screen animate-glow-pulse pointer-events-none" />

        {/* 3D WebGL Background */}
        <NeuralBrain />

        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-40">
          
          {/* 1. HERO SECTION */}
          <section className="min-h-[90vh] flex flex-col items-center justify-center text-center mt-[-10vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={springTransition}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              <span className="text-sm text-gray-300 font-medium tracking-wide">NEURAVOX OS 2.0 LIVE</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
            >
              The Intelligence <br/> Layer for the Future.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light mb-12"
            >
              Powerful artificial intelligence platform providing autonomous reasoning agents and cognitive infrastructure for elite enterprises.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.3 }}
            >
              <MagneticButton>Initialize Sequence</MagneticButton>
            </motion.div>
          </section>

          {/* 2. FEATURES SECTION */}
          <section className="py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard 
                title="Autonomous Agents" 
                desc="Self-correcting neural pathways that solve complex engineering tasks without human intervention."
                icon={Cpu}
              />
              <GlassCard 
                title="Cognitive Mesh" 
                desc="Real-time distributed predictive systems adapting to your enterprise data streams instantly."
                icon={Network}
              />
              <GlassCard 
                title="Hyper-Execution" 
                desc="Execute complex API and infrastructure orchestrations in milliseconds using LLM backbones."
                icon={Zap}
              />
            </div>
          </section>

        </main>
      </div>
    </ReactLenis>
  );
}
