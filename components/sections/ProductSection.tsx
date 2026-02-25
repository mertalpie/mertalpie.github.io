'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Record or Paste',
    description:
      'Paste your meeting notes directly or connect your meeting platform — Zoom, Meet, Teams. We handle the rest.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="9" y1="22" x2="15" y2="22" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Analyzes',
    description:
      'Our AI processes context, decisions, and commitments — understanding the semantics of every conversation.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7l-1 3H9l-1-3C5.5 15.5 4 13 4 10a8 8 0 0 1 8-8z" />
        <line x1="9" y1="21" x2="15" y2="21" />
        <line x1="12" y1="14" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Instant Insights',
    description:
      'Get structured summaries, action items with owners, risks flagged, and follow-ups scheduled — in seconds.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const OUTPUTS = [
  { label: 'Summary', icon: '📋', desc: 'Concise 3-sentence overview of decisions made' },
  { label: 'Action Items', icon: '✅', desc: 'Owners assigned, deadlines captured automatically' },
  { label: 'Risks', icon: '⚠️', desc: 'Blockers and concerns surfaced proactively' },
  { label: 'Follow-Ups', icon: '📅', desc: 'Scheduled next steps and pending commitments' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProductSection() {
  return (
    <section id="product" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            How{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              PulseMind
            </span>{' '}
            Works
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-2xl mx-auto text-slate-400 text-lg">
            Three simple steps from raw meeting to structured insight.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-stretch justify-center mb-20">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex flex-col md:flex-row items-center flex-1">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group flex-1 mx-0 md:mx-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-600/25 transition-colors">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-indigo-500 tracking-widest mb-2">
                  STEP {step.number}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex items-center justify-center z-10 flex-shrink-0 -mx-1">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(99,102,241,0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* What you get */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h3
            variants={fadeUp}
            className="text-center text-2xl font-bold text-slate-100 mb-8"
          >
            What you get from every meeting
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OUTPUTS.map((out) => (
              <motion.div
                key={out.label}
                variants={fadeUp}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 text-center group"
              >
                <div className="text-4xl mb-4">{out.icon}</div>
                <h4 className="text-base font-bold text-slate-100 mb-2">{out.label}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{out.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
