'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToSection } from '@/lib/utils';

const ROTATING_WORDS = ['momentum', 'action items', 'clear decisions'];
const COMPANIES = ['TechCorp', 'InnovateCo', 'StartupXYZ', 'DataFlow', 'CloudSync'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                AI-Powered Meeting Intelligence
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Turn meetings into{' '}
              <span className="relative inline-block text-indigo-400">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="inline-block"
                  >
                    {ROTATING_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              PulseMind AI automatically transcribes, summarizes, and extracts action items from your meetings — so your team can focus on what matters, not note-taking.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={() => scrollToSection('demo')}
                className="px-6 py-3 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Try Demo
              </button>
              <button
                onClick={() => scrollToSection('product')}
                className="px-6 py-3 rounded-xl text-base font-semibold border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Learn More
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-medium">Trusted by 2,000+ teams</p>
              <div className="flex flex-wrap items-center gap-4">
                {COMPANIES.map((company) => (
                  <span key={company} className="text-sm font-semibold text-slate-600 hover:text-slate-400 transition-colors">
                    {company}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: floating mockup card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-6 overflow-hidden">
              {/* Mockup header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-slate-500 font-mono">meeting-summary.ai</span>
              </div>

              {/* Meeting title */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Weekly Product Sync</p>
                  <p className="text-xs text-slate-500">4 attendees · 47 min</p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">AI Summary</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Dashboard redesign approved. API rate limiting fix ready for review. Q1 board presentation scheduled for March 5th.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Action Items</p>
                  <ul className="space-y-1.5">
                    {['Raj to review PR #847 by EOD', 'Marcus to file monitoring ticket', 'Sarah to send bug bash calendar invite'].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-slate-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">Risks Flagged</p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <svg className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-xs text-yellow-300">Mobile app beta at risk — 3 open P1 bugs</span>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
