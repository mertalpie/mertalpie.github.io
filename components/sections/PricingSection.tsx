'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PRICING_PLANS } from '@/lib/constants';

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-24 px-4 bg-slate-950/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight">
            Simple,{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-slate-900 rounded-full px-2 py-1.5 border border-slate-800">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                !yearly ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                yearly ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Yearly
              <span className="text-xs text-green-400 font-semibold">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlighted
                  ? 'bg-indigo-600/10 border-indigo-500/50 shadow-xl shadow-indigo-600/10'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-end gap-2">
                <span className="text-4xl font-extrabold text-slate-100">
                  {plan.monthlyPrice === 0
                    ? 'Free'
                    : `$${yearly ? plan.yearlyPrice : plan.monthlyPrice}`}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span className="text-slate-500 text-sm pb-1">/mo</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-indigo-400' : 'text-slate-500'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 shadow-lg shadow-indigo-600/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: '🔒', text: 'SOC 2 Type II' },
            { icon: '🛡️', text: 'GDPR Compliant' },
            { icon: '✅', text: 'No credit card required' },
            { icon: '🔄', text: 'Cancel anytime' },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 text-sm text-slate-500">
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
