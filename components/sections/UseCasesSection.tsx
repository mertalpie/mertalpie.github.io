'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { USE_CASES } from '@/lib/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function UseCasesSection() {
  const [active, setActive] = useState(0);
  const current = USE_CASES[active];

  return (
    <section id="usecases" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Use Cases
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Built for every{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              type of meeting
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-2xl mx-auto text-slate-400 text-lg">
            Whether you&apos;re closing deals or shipping sprints, PulseMind adapts to your context.
          </motion.p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {USE_CASES.map((uc, i) => (
            <button
              key={uc.title}
              onClick={() => setActive(i)}
              className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                active === i
                  ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700'
              }`}
            >
              {uc.title}
              {active === i && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* Left: Info */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-2xl font-bold text-slate-100 mb-3">{current.title}</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">{current.description}</p>
              <ul className="space-y-3">
                {current.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline
                          points="2 5 4 7 8 3"
                          stroke="#818cf8"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-slate-300 text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Example output */}
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-xs text-slate-600 font-mono ml-1">pulsemind — output</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  AI Summary
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed font-mono">
                &ldquo;{current.exampleOutput}&rdquo;
              </p>
              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-xs text-emerald-400 font-medium">Sent to Notion and Slack</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
