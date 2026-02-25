'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Paste or record your meeting notes',
    description:
      'Drop in raw meeting notes, transcripts, or uploaded audio. PulseMind accepts text from any source — Zoom, Google Meet, Teams, or a plain notepad.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'AI analyses and structures the content',
    description:
      'Our LLM engine reads the full context, identifies speakers, topics, decisions, and commitments — then organises everything into a structured format.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Review and act on insights instantly',
    description:
      'Get a clean summary, a prioritised action list, flagged risks, and follow-up tasks — all in seconds. Export to Notion, Slack, or your project tracker.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductSection() {
  return (
    <section id="product" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight">
            From chaos to clarity in{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              three steps
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            PulseMind transforms unstructured meeting content into structured intelligence
            — automatically, accurately, every time.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="relative flex flex-col gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors duration-300 group"
            >
              {/* Step number accent */}
              <span className="absolute top-4 right-4 text-6xl font-black text-slate-800 group-hover:text-indigo-900/40 transition-colors duration-300 select-none">
                {step.step}
              </span>

              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/15 text-indigo-400 border border-indigo-500/20">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-100">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual demo preview card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-slate-500 font-mono">pulsemind — meeting-output.json</span>
          </div>
          <div className="p-6 font-mono text-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-500 text-xs mb-2">// Input</p>
              <div className="space-y-1 text-slate-400 text-xs leading-relaxed">
                <p><span className="text-cyan-400">&quot;notes&quot;</span>: <span className="text-amber-300">&quot;Q2 planning — budget approved $4.2M...&quot;</span></p>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-2">// AI Output</p>
              <div className="space-y-2 text-xs leading-relaxed">
                <p><span className="text-cyan-400">&quot;summary&quot;</span>: <span className="text-green-400">&quot;Q2 budget approved at $4.2M. Three initiatives prioritised...&quot;</span></p>
                <p><span className="text-indigo-400">&quot;actionItems&quot;</span>: [<span className="text-amber-300">&quot;CFO to present forecast by Mar 15&quot;</span>, ...]</p>
                <p><span className="text-rose-400">&quot;risks&quot;</span>: [<span className="text-amber-300">&quot;Supply chain delays flagged&quot;</span>]</p>
                <p><span className="text-violet-400">&quot;followUps&quot;</span>: [<span className="text-amber-300">&quot;Schedule board review for Q3&quot;</span>]</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
