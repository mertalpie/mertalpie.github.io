'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ContactFormData } from '@/lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Name is required.';
  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.message.trim()) {
    errors.message = 'Message is required.';
  } else if (data.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters.';
  }
  return errors;
}

export default function ContactSection() {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Newsletter state
  const [newsletter, setNewsletter] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSuccess(true);
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletter || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletter)) return;
    await new Promise((r) => setTimeout(r, 600));
    setNewsletterSuccess(true);
  }

  const fieldCls = (err?: string) =>
    `w-full bg-slate-950/60 border rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
      err
        ? 'border-rose-500/60 focus:ring-rose-500'
        : 'border-slate-700 focus:ring-indigo-500'
    }`;

  return (
    <section id="contact" className="py-24 relative">
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
            Contact
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Get in{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              touch
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl mx-auto text-slate-400 text-lg">
            Have questions or want a custom demo? We&apos;d love to hear from you.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">Message sent!</h3>
                  <p className="text-slate-400 text-sm">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={fieldCls(errors.name)}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={fieldCls(errors.email)}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Company <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company"
                    className={fieldCls()}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className={fieldCls(errors.message)}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-rose-400">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-500/20"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right side: info + newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            {/* Contact info */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 mb-5">Other ways to reach us</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email', value: 'hello@pulsemind.ai', icon: '✉️' },
                  { label: 'Enterprise Sales', value: 'sales@pulsemind.ai', icon: '💼' },
                  { label: 'Support', value: 'support@pulsemind.ai', icon: '🛟' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                      <p className="text-sm text-slate-300">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900/60 border border-indigo-800/30">
              <h3 className="text-lg font-bold text-slate-100 mb-2">Stay in the loop</h3>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                Get product updates, AI insights, and productivity tips — delivered monthly.
              </p>
              {newsletterSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  You&apos;re subscribed!
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    value={newsletter}
                    onChange={(e) => setNewsletter(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
