'use client';

import SectionWrapper from './SectionWrapper';
import ScrollReveal from './ScrollReveal';
import { FEATURES, TESTIMONIALS } from '@/lib/constants';
import type { Feature, Testimonial } from '@/lib/types';

const ICON_MAP: Record<string, React.ReactNode> = {
  mic: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  brain: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  'check-square': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  'shield-alert': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  plug: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12M5 12H2a10 10 0 0 0 20 0h-3" />
      <path d="M9 12V7l-3-2M15 12V7l3-2" />
      <line x1="8" y1="7" x2="16" y2="7" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
};

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <ScrollReveal delay={index * 0.08}>
      <div
        className="group relative p-6 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 cursor-default"
        style={{ transform: 'scale(1)', transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors duration-300">
          {ICON_MAP[feature.icon] ?? ICON_MAP['brain']}
        </div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">{feature.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
      </div>
    </ScrollReveal>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">{testimonial.name}</p>
          <p className="text-xs text-slate-500">{testimonial.role} · {testimonial.company}</p>
        </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed italic">&quot;{testimonial.content}&quot;</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <SectionWrapper id="features">
      <ScrollReveal>
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to transform chaotic meetings into structured outcomes — built for teams that value speed and clarity.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>

      {/* Testimonials sub-section */}
      <ScrollReveal>
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-slate-100 mb-2">What Our Users Say</h3>
          <p className="text-slate-400">Join thousands of teams already saving hours every week.</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial, index) => (
          <ScrollReveal key={testimonial.name} delay={index * 0.1}>
            <TestimonialCard testimonial={testimonial} />
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
