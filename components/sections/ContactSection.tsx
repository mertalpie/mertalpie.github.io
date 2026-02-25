'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ContactFormData } from '@/lib/types';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function validate(data: ContactFormData): Partial<Record<keyof ContactFormData, string>> {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};
  if (!data.name.trim()) errors.name = 'Name is required.';
  if (!data.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email.';
  if (!data.message.trim()) errors.message = 'Message is required.';
  if (data.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
}

export default function ContactSection() {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setStatus('submitting');
    // Simulate API call (client-side only for static export)
    await new Promise((r) => setTimeout(r, 1000));
    console.log('[PulseMind] Contact form submission:', form);
    setStatus('success');
    setForm({ name: '', email: '', company: '', message: '' });
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterError('Enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterStatus('submitting');
    await new Promise((r) => setTimeout(r, 800));
    console.log('[PulseMind] Newsletter subscription:', newsletterEmail);
    setNewsletterStatus('success');
    setNewsletterEmail('');
  }

  return (
    <section id="contact" className="relative py-24 px-4 bg-slate-950/40">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-4">
            Contact
          </span>
          <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight">
            Get in{' '}
            <span className="bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">
              touch
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Questions, enterprise inquiries, or just want to say hello — we&apos;re here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h3 className="text-lg font-bold text-slate-100 mb-5">Send us a message</h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-slate-200 font-semibold">Message sent!</p>
                <p className="text-sm text-slate-500">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                    Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    autoComplete="name"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-200 placeholder-slate-600 text-sm outline-none transition-colors duration-200 focus:border-indigo-500/60 ${errors.name ? 'border-rose-500/70' : 'border-slate-800'}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    autoComplete="email"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-200 placeholder-slate-600 text-sm outline-none transition-colors duration-200 focus:border-indigo-500/60 ${errors.email ? 'border-rose-500/70' : 'border-slate-800'}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme Corp (optional)"
                    autoComplete="organization"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-sm outline-none transition-colors duration-200 focus:border-indigo-500/60"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    rows={4}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-200 placeholder-slate-600 text-sm outline-none transition-colors duration-200 resize-none focus:border-indigo-500/60 ${errors.message ? 'border-rose-500/70' : 'border-slate-800'}`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-rose-400">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-lg shadow-indigo-600/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right side: info + newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Quick info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-100">We&apos;re here to help</h3>
              {[
                { icon: '✉️', title: 'Email', value: 'hello@pulsemind.ai' },
                { icon: '💬', title: 'Support', value: 'support@pulsemind.ai' },
                { icon: '🏢', title: 'Enterprise', value: 'enterprise@pulsemind.ai' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-slate-500">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-base font-bold text-slate-100 mb-1">Stay in the loop</h3>
              <p className="text-sm text-slate-500 mb-4">
                Get product updates, AI insights, and early access to new features.
              </p>

              {newsletterStatus === 'success' ? (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  You&apos;re subscribed! Welcome aboard.
                </div>
              ) : (
                <form onSubmit={handleNewsletter} noValidate className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => { setNewsletterEmail(e.target.value); setNewsletterError(''); }}
                      placeholder="your@email.com"
                      aria-label="Newsletter email"
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-200 placeholder-slate-600 text-sm outline-none transition-colors duration-200 focus:border-indigo-500/60 ${newsletterError ? 'border-rose-500/70' : 'border-slate-800'}`}
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'submitting'}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 whitespace-nowrap"
                    >
                      {newsletterStatus === 'submitting' ? '…' : 'Subscribe'}
                    </button>
                  </div>
                  {newsletterError && (
                    <p className="text-xs text-rose-400">{newsletterError}</p>
                  )}
                  <p className="text-xs text-slate-600">No spam. Unsubscribe at any time.</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
