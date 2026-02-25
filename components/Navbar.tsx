'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '@/lib/constants';
import { scrollToSection } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateActiveSection = useCallback(() => {
    const sectionIds = ['home', ...NAV_ITEMS.map((item) => item.href.replace('#', ''))];
    for (const id of [...sectionIds].reverse()) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100) {
          setActiveSection(id);
          return;
        }
      }
    }
    setActiveSection('home');
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [updateActiveSection]);

  function handleNavClick(href: string) {
    const id = href.replace('#', '');
    scrollToSection(id);
    setMobileOpen(false);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50 shadow-lg shadow-slate-950/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="PulseMind AI — Go to home"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <rect width="32" height="32" rx="8" fill="#6366f1" fillOpacity="0.15" />
              <path
                d="M4 16h4l3-8 4 16 3-11 3 6 3-3h6"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
              PulseMind
            </span>
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const id = item.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-indigo-400 bg-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => handleNavClick('#demo')}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Try Demo
            </button>
          </div>

          {/* Mobile: ThemeToggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden backdrop-blur-xl bg-slate-900/95 border-b border-slate-800/50"
          >
            <ul className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const id = item.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
              <li className="pt-2">
                <button
                  onClick={() => handleNavClick('#demo')}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-200"
                >
                  Try Demo
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
