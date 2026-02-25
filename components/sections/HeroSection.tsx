'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { scrollToSection } from '@/lib/utils';

const COMPANIES = ['Stripe', 'Notion', 'Linear', 'Vercel', 'Figma', 'Loom'];

export default function HeroSection() {
  const shouldReduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: shouldReduce ? {} : { staggerChildren: 0.18 } },
  };

  const item = {
    hidden: { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-16"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <motion.div variants={item} className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="10" fill="#6366f1" fillOpacity="0.2" />
              <path
                d="M4 16h4l3-8 4 16 3-11 3 6 3-3h6"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span className="text-2xl font-bold text-slate-100 tracking-tight">PulseMind AI</span>
        </motion.div>

        {/* Badge */}
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-Powered Meeting Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
        >
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Transform Meetings
          </span>
          <br />
          <span className="text-slate-100">into Actionable Insights</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed"
        >
          PulseMind AI automatically transcribes your meetings, extracts action items, surfaces
          risks, and delivers structured summaries — so your team can focus on doing instead of
          documenting.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            onClick={() => scrollToSection('demo')}
            className="px-8 py-4 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Try the Demo →
          </button>
          <button
            onClick={() => scrollToSection('product')}
            className="px-8 py-4 rounded-xl text-base font-semibold border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm"
          >
            See How It Works
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div variants={item} className="flex flex-col items-center gap-4 mt-6">
          <p className="text-sm text-slate-500 font-medium">
            Trusted by{' '}
            <span className="text-slate-300 font-semibold">2,000+ teams</span> worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {COMPANIES.map((company) => (
              <span
                key={company}
                className="text-sm font-semibold text-slate-600 hover:text-slate-400 transition-colors select-none"
              >
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-indigo-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
