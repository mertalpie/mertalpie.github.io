import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans overflow-x-hidden relative">
      {/* Abstract 3D Glowing Fluid Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050508]">
        {/* Blue Glow */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-50 bg-gradient-to-br from-blue-600 to-cyan-400 top-[-10%] left-[-10%] animate-pulse" 
          style={{ animationDuration: '10s' }} 
        />
        {/* Purple Glow */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-50 bg-gradient-to-br from-purple-700 to-fuchsia-400 bottom-[-10%] right-[-5%] animate-pulse" 
          style={{ animationDuration: '12s', animationDelay: '2s' }} 
        />
        {/* Emerald Glow */}
        <div 
          className="absolute w-[450px] h-[450px] rounded-full blur-[140px] opacity-40 bg-gradient-to-br from-cyan-500 to-emerald-400 top-[40%] left-[30%] animate-pulse" 
          style={{ animationDuration: '15s', animationDelay: '5s' }} 
        />
      </div>

      {/* Main Structured Content */}
      <div className="max-w-7xl mx-auto px-8 py-32">
        <header className="mb-24 text-left">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-[#8892b0] bg-clip-text text-transparent">
            mertalp.me
          </h1>
          <p className="text-xl text-[#8892b0] max-w-2xl font-light leading-relaxed">
            Premium tech aesthetics. Exploring the intersection of deep engineering and minimalist, high-fidelity user experiences.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">Scalable Systems</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Architecting backend infrastructure designed for high availability and premium performance.
              </p>
            </div>
            <div className="mt-8 px-5 py-2 bg-white/5 rounded-full text-sm text-slate-200 border border-white/10 self-start uppercase tracking-wider">
              Engineering
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">Immersive UI/UX</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Crafting sleek, futuristic interfaces using glassmorphism, fluid animations, and generous negative space.
              </p>
            </div>
            <div className="mt-8 px-5 py-2 bg-white/5 rounded-full text-sm text-slate-200 border border-white/10 self-start uppercase tracking-wider">
              Design
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">Data Insights</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Transforming complex, high-volume datasets into clean, accessible, and structured insights.
              </p>
            </div>
            <div className="mt-8 px-5 py-2 bg-white/5 rounded-full text-sm text-slate-200 border border-white/10 self-start uppercase tracking-wider">
              Analytics
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
