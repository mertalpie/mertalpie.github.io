'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { USE_CASES } from '@/lib/constants';

export default function UseCasesSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="usecases" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            Use Cases
          </span>
          <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight">
            Built for every team,{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              every meeting
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Whether you're running a sprint, closing a deal, or running the boardroom — PulseMind
            adapts to your context.
          </p>
        </motion.div>

        {/* Tab list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
          role="tablist"
          aria-label="Use case tabs"
        >
          {USE_CASES.map((uc, i) => (
            <button
              key={uc.title}
              role="tab"
              aria-selected={active === i}
              aria-controls={`panel-${i}`}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                active === i
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700'
              }`}
            >
              {uc.title}
            </button>
          ))}
        </motion.div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`panel-${active}`}
            role="tabpanel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
          >
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: description + benefits */}
              <div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">
                  {USE_CASES[active].title}
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {USE_CASES[active].description}
                </p>
                <ul className="space-y-3">
                  {USE_CASES[active].benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: example output */}
              <div className="flex flex-col justify-center">
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">
                  <p className="text-xs text-slate-500 font-mono mb-3">// Example output</p>
                  <p className="text-sm text-green-400 font-mono leading-relaxed">
                    {USE_CASES[active].exampleOutput}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
