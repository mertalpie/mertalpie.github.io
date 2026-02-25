import SectionWrapper from './SectionWrapper';
import ScrollReveal from './ScrollReveal';

const STEPS = [
  {
    number: '01',
    title: 'Paste Your Notes',
    description: 'Upload a recording, paste transcript, or connect your meeting platform directly. PulseMind handles any format — audio, video, or raw text.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Analyzes',
    description: "Our large language model transcribes speech, identifies speakers, and understands context — extracting meaning from every word spoken.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a8 8 0 0 1 8 8c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 8-8z" />
        <circle cx="12" cy="10" r="3" />
        <path d="M9.5 7.5 8 6M14.5 7.5 16 6M9.5 12.5 8 14M14.5 12.5 16 14" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get Results',
    description: 'Receive a structured summary with action items, decisions, risks, and follow-ups — delivered to your inbox, Slack, or project management tool.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export default function ProductSection() {
  return (
    <SectionWrapper id="product" dark>
      <ScrollReveal>
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            How PulseMind AI Works
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Three simple steps to transform any meeting into structured, actionable intelligence.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {/* Connecting lines (desktop only) */}
        <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-indigo-500/50 to-indigo-500/50" style={{ transform: 'translateY(-50%)' }} />

        {STEPS.map((step, index) => (
          <ScrollReveal key={step.number} delay={index * 0.15}>
            <div className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 hover:border-indigo-500/30 transition-all duration-300 group">
              {/* Number badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/30">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 mt-4 group-hover:bg-indigo-500/20 transition-colors duration-300">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>

              {/* Arrow between steps (desktop) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-500/60">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
