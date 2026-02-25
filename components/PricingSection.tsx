'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import ScrollReveal from './ScrollReveal';
import { PRICING_PLANS } from '@/lib/constants';
import type { PricingPlan } from '@/lib/types';
import { cn } from '@/lib/utils';

const SECURITY_BADGES = [
  { label: 'SOC 2 Certified', icon: 'shield' },
  { label: 'GDPR Compliant', icon: 'shield' },
  { label: '256-bit Encryption', icon: 'lock' },
  { label: '99.9% Uptime', icon: 'check' },
];

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PricingCard({ plan, yearly }: { plan: PricingPlan; yearly: boolean }) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
  const isHighlighted = plan.highlighted;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-8 transition-all duration-300',
        isHighlighted
          ? 'border-2 border-indigo-500 bg-slate-800/80 shadow-2xl shadow-indigo-500/20 scale-105'
          : 'border border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
      )}
    >
      {isHighlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-100 mb-1">{plan.name}</h3>
        <p className="text-sm text-slate-400">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${plan.name}-${price}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-4xl font-extrabold text-slate-100"
            >
              {price === 0 ? 'Free' : `$${price}`}
            </motion.span>
          </AnimatePresence>
          {price > 0 && (
            <span className="text-slate-500 mb-1 text-sm">/mo{yearly ? ' (billed yearly)' : ''}</span>
          )}
        </div>
        {yearly && price > 0 && (
          <p className="text-xs text-green-400 mt-1 font-medium">Save 20% with yearly billing</p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={cn(
          'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950',
          isHighlighted
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 focus:ring-indigo-500'
            : 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-slate-100 focus:ring-slate-500'
        )}
      >
        {plan.cta}
      </button>
    </div>
  );
}

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <SectionWrapper id="pricing">
      <ScrollReveal>
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Start for free. Scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn('text-sm font-medium', !yearly ? 'text-slate-100' : 'text-slate-500')}>Monthly</span>
            <button
              onClick={() => setYearly((y) => !y)}
              role="switch"
              aria-checked={yearly}
              aria-label="Toggle yearly billing"
              className={cn(
                'relative inline-flex w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950',
                yearly ? 'bg-indigo-600' : 'bg-slate-700'
              )}
            >
              <span
                className={cn(
                  'inline-block w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 translate-y-0.5',
                  yearly ? 'translate-x-6' : 'translate-x-0.5'
                )}
              />
            </button>
            <span className={cn('text-sm font-medium', yearly ? 'text-slate-100' : 'text-slate-500')}>
              Yearly
              <span className="ml-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full">-20%</span>
            </span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} yearly={yearly} />
          ))}
        </div>
      </ScrollReveal>

      {/* Security badges */}
      <ScrollReveal delay={0.2}>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
          {SECURITY_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors">
              <span className="text-slate-500">
                {badge.icon === 'lock' ? <LockIcon /> : badge.icon === 'check' ? <CheckCircleIcon /> : <ShieldIcon />}
              </span>
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
