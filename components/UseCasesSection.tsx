'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import ScrollReveal from './ScrollReveal';
import { USE_CASES } from '@/lib/constants';

export default function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const activeCase = USE_CASES[activeTab];

  return (
    <SectionWrapper id="usecases" dark>
      <ScrollReveal>
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Built for Every Team
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Whether you run product sprints, sales calls, or board meetings — PulseMind adapts to your workflow.
          </p>
        </div>
      </ScrollReveal>

      {/* Tab bar */}
      <ScrollReveal delay={0.1}>
        <div className="flex overflow-x-auto gap-2 pb-2 mb-8 scrollbar-hide justify-center" role="tablist" aria-label="Use case categories">
          {USE_CASES.map((useCase, index) => (
            <button
              key={useCase.title}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tabpanel-${index}`}
              onClick={() => setActiveTab(index)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                activeTab === index
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-700/50'
              }`}
            >
              {useCase.title}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        >
          {/* Left: description + benefits */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">{activeCase.title}</h3>
              <p className="text-slate-400 leading-relaxed">{activeCase.description}</p>
            </div>

            <ul className="space-y-3" aria-label={`Benefits for ${activeCase.title}`}>
              {activeCase.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: example output */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-xs font-mono text-slate-500">example-output.txt</span>
            </div>
            <div className="p-5">
              <p className="text-sm font-mono text-cyan-300/90 leading-relaxed whitespace-pre-wrap">
                {activeCase.exampleOutput}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
