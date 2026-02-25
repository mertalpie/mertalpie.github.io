'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PRICING_PLANS } from '@/lib/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Pricing
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Simple,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl mx-auto text-slate-400 text-lg">
            Start free. Upgrade as you grow. No hidden fees.
          </motion.p>

          {/* Toggle */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${!yearly ? 'text-slate-100' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setYearly((y) => !y)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                yearly ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
              aria-label="Toggle yearly billing"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  yearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${yearly ? 'text-slate-100' : 'text-slate-500'}`}>
              Yearly
            </span>
            {yearly && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                Save 20%
              </span>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          {PRICING_PLANS.map((plan) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isFree = plan.monthlyPrice === 0;

            return (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wide shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-100 mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-slate-100">
                      {isFree ? 'Free' : `$${price}`}
                    </span>
                    {!isFree && (
                      <span className="text-slate-400 text-sm pb-1.5">/mo</span>
                    )}
                  </div>
                  {!isFree && yearly && (
                    <p className="text-xs text-emerald-400 mt-1">
                      Billed as ${price * 12}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <polyline
                            points="2 5 4 7 8 3"
                            stroke="#818cf8"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                    plan.highlighted
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-sm text-slate-600 mt-8"
        >
          All paid plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
