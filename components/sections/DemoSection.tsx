'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { processMeetingNotes } from '@/lib/aiProcessor';
import { SAMPLE_MEETING_NOTES } from '@/lib/constants';
import type { SummaryResult } from '@/lib/types';

type Tab = 'summary' | 'actionItems' | 'risks' | 'followUps';

const tabs: { id: Tab; label: string; color: string }[] = [
  { id: 'summary', label: 'Summary', color: 'text-cyan-400 border-cyan-400' },
  { id: 'actionItems', label: 'Action Items', color: 'text-indigo-400 border-indigo-400' },
  { id: 'risks', label: 'Risks', color: 'text-rose-400 border-rose-400' },
  { id: 'followUps', label: 'Follow-Ups', color: 'text-violet-400 border-violet-400' },
];

function SkeletonLine({ w = 'w-full' }: { w?: string }) {
  return <div className={`h-3 rounded-full bg-slate-800 animate-pulse ${w}`} />;
}

export default function DemoSection() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    const text = input.trim();
    if (!text) {
      setError('Please paste some meeting notes first.');
      return;
    }
    if (text.length < 20) {
      setError('Notes are too short — please provide more content.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await processMeetingNotes(text);
      setResult(data);
      setActiveTab('summary');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setInput(SAMPLE_MEETING_NOTES);
    setError('');
  }

  async function copyResult() {
    if (!result) return;
    const activeContent = activeTab === 'summary'
      ? result.summary
      : result[activeTab].join('\n');
    await navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getTabContent() {
    if (!result) return null;
    if (activeTab === 'summary') {
      return <p className="text-slate-300 leading-relaxed text-sm">{result.summary}</p>;
    }
    const items = result[activeTab];
    const dotColor =
      activeTab === 'actionItems' ? 'bg-indigo-500' :
      activeTab === 'risks' ? 'bg-rose-500' : 'bg-violet-500';
    return (
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section id="demo" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            Live Demo
          </span>
          <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight">
            See PulseMind{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              in action
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Paste your meeting notes and watch the AI extract insights in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden"
        >
          {/* Input area */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="meeting-notes" className="text-sm font-semibold text-slate-300">
                Meeting Notes
              </label>
              <button
                onClick={loadSample}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Load sample →
              </button>
            </div>
            <textarea
              id="meeting-notes"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste your meeting notes, transcript, or discussion here…"
              rows={8}
              className="w-full resize-none rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500/60 text-slate-300 placeholder-slate-600 text-sm p-4 outline-none transition-colors duration-200 font-mono"
              aria-label="Meeting notes input"
            />
            {error && (
              <p className="mt-2 text-sm text-rose-400 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-600">{input.length} chars · {input.trim().split(/\s+/).filter(Boolean).length} words</span>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-lg shadow-indigo-600/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analysing…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Generate Insights
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output area */}
          <div className="p-6">
            {loading && (
              <div className="space-y-4" aria-label="Loading results">
                <div className="flex gap-2 mb-4">
                  {tabs.map((t) => (
                    <div key={t.id} className="h-8 w-24 rounded-lg bg-slate-800 animate-pulse" />
                  ))}
                </div>
                <SkeletonLine />
                <SkeletonLine w="w-5/6" />
                <SkeletonLine w="w-4/6" />
                <SkeletonLine />
                <SkeletonLine w="w-3/4" />
              </div>
            )}

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Tabs */}
                <div className="flex flex-wrap gap-1 mb-5 border-b border-slate-800 pb-3">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === t.id
                          ? `bg-slate-800 ${t.color}`
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {t.label}
                      {t.id !== 'summary' && (
                        <span className="ml-1.5 text-xs opacity-70">
                          {result[t.id].length}
                        </span>
                      )}
                    </button>
                  ))}
                  {/* Copy button */}
                  <button
                    onClick={copyResult}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-200"
                    aria-label="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Tab content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {getTabContent()}
                </motion.div>
              </motion.div>
            )}

            {!loading && !result && (
              <div className="text-center py-12 text-slate-600">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <p className="text-sm">Paste your notes above and click Generate Insights</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
