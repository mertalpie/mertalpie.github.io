'use client';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ElementType } from 'react';

interface GlassCardProps {
  title: string;
  desc: string;
  icon: ElementType<{ className?: string }>;
}

export default function GlassCard({ title, desc, icon: Icon }: GlassCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative max-w-md rounded-3xl border border-border bg-surface px-8 py-10 backdrop-blur-2xl hover:border-white/20 transition-colors duration-500"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 240, 255, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">
        <Icon className="w-10 h-10 text-neon-blue mb-6 stroke-[1.5]" />
        <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-400 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
