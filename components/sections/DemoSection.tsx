'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_MEETING_NOTES } from '@/lib/constants';
import { simulateSummarize } from '@/lib/summarize';
import type { SummaryResult } from '@/lib/types';

type Tab = 'summary' | 'actions' | 'risks' | 'followups';

const TABS: { id: Tab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'actions', label: 'Action Items' },
  { id: 'risks', label: 'Risks' },
  { id: 'followups', label: 'Follow-Ups' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function SkeletonLine({ w = 'w-full' }: { w?: string }) {
  return <div className={`h-3.5 rounded-full bg-slate-800 animate-pulse ${w}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 pt-2">
      <SkeletonLine />
      <SkeletonLine w="w-5/6" />
      <SkeletonLine w="w-4/6" />
      <SkeletonLine />
      <SkeletonLine w="w-3/4" />
    </div>
  );
}

function ResultContent({ tab, result }: { tab: Tab; result: SummaryResult }) {
  if (tab === 'summary') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Meeting Summary</span>
          <CopyButton text={result.summary} />
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
      </div>
    );
  }

  const items =
    tab === 'actions'
      ? result.actionItems
      : tab === 'risks'
      ? result.risks
      : result.followUps;

  const label =
    tab === 'actions' ? 'Action Items' : tab === 'risks' ? 'Risks Detected' : 'Follow-Ups';

  const dotColor =
    tab === 'actions'
      ? 'bg-indigo-400'
      : tab === 'risks'
      ? 'bg-rose-400'
      : 'bg-cyan-400';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <CopyButton text={items.join('\n')} />
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DemoSection() {
  const [text, setText] = useState(SAMPLE_MEETING_NOTES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  async function handleGenerate() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await simulateSummarize(text);
      setResult(res);
      setActiveTab('summary');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="demo" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Live Demo
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            See{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              PulseMind in Action
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-slate-400 text-lg">
            Paste your meeting notes below and watch the AI extract insights instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-4"
          >
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Meeting Notes</span>
                <button
                  onClick={() => setText(SAMPLE_MEETING_NOTES)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Load sample
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={14}
                placeholder="Paste your meeting notes here..."
                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all leading-relaxed"
              />
              {error && (
                <p className="text-sm text-rose-400 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </p>
              )}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Generate Insights →'
                )}
              </button>
            </div>
          </motion.div>

          {/* Right: Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 min-h-[400px] flex flex-col">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-xs text-slate-600 font-mono ml-1">pulsemind — insights</span>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-5 flex-wrap">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={!result && !loading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      activeTab === tab.id && (result || loading)
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-500 hover:text-slate-300 disabled:cursor-default'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content area */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {!result && !loading && (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center py-12 gap-4"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm font-medium">Your insights will appear here</p>
                        <p className="text-slate-600 text-xs mt-1">Paste meeting notes and click Generate</p>
                      </div>
                    </motion.div>
                  )}

                  {loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <LoadingSkeleton />
                    </motion.div>
                  )}

                  {result && !loading && (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ResultContent tab={activeTab} result={result} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
