'use client';

import { motion } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/constants';

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Loved by teams who care about{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              results
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, si) => (
                  <svg key={si} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-slate-400 leading-relaxed flex-1">&quot;{t.content}&quot;</p>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
