import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useProfileAvatar } from '../utils/useProfileAvatar';
import { Code2, Brain, Terminal, Cpu, GraduationCap, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { avatarUrl } = useProfileAvatar();

  const pillars = [
    {
      title: 'Python & AI Foundations',
      description: 'Building data models, machine learning algorithms, and intelligent backend automation.',
      icon: Brain,
      color: 'text-[#ff2a2a] bg-[#ff2a2a]/10 border-[#ff2a2a]/20',
    },
    {
      title: 'C & C++ Systems Logic',
      description: 'Rigorous pointer discipline, memory management, and efficient algorithmic problem solving.',
      icon: Terminal,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Web Technologies & Architecture',
      description: 'Crafting responsive, accessible, and high-performance interfaces with HTML5, CSS3, and Tailwind CSS.',
      icon: Code2,
      color: 'text-[#00d294] bg-[#00d294]/10 border-[#00d294]/20',
    },
    {
      title: 'Competitive DSA',
      description: 'Active practice in binary search, recursion, complexity optimization, and data structures.',
      icon: Cpu,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#0c0c0c] border-t border-b border-white/5 overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left: Bio Content */}
          <div className="lg:col-span-8">
            {/* Red Hello! Tag matching Akash's signature badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hello!</span>
            </div>

            {/* Main Statement Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display mb-8">
              Hi, my name is <span className="text-[#ff2a2a]">Deepak Mewada</span>, a motivated B.Tech student based in Bhopal, India, dedicated to crafting innovative, AI-integrated web applications with modern technologies.
            </h2>

            {/* Descriptive Bio */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              Currently pursuing my 5th semester in <strong className="text-white">Computer Science Engineering (AIML)</strong> at <strong className="text-white">Bansal Institute of Science and Technology, Bhopal</strong>. I combine deep curiosity for low-level systems efficiency in C/C++ with rapid software prototyping in Python and modern web architecture. Passionate about solving real-world challenges, from local commerce platforms to national hackathon innovations.
            </p>
          </div>

          {/* Right: Deepak's Profile Portrait Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-[320px] rounded-2xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/10 shadow-2xl overflow-hidden group">
              <div className="rounded-xl bg-[#111114] p-5 flex flex-col items-center text-center">
                {/* Photo with glowing ring */}
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#ff2a2a]/40 shadow-xl mb-4 relative bg-zinc-900">
                  <img
                    src={avatarUrl}
                    alt="Deepak Mewada Profile"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/deepak-photo.svg';
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-1 right-1 p-1 rounded-full bg-[#080808] border border-white/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00d294]" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white font-display">Deepak Mewada</h3>
                <p className="text-xs text-[#ff2a2a] font-mono font-medium mt-0.5">
                  B.Tech CSE (AIML) · Sem 5
                </p>

                <div className="mt-3 pt-3 border-t border-white/10 w-full space-y-1.5 text-xs text-zinc-400 font-mono text-left">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">BIST, Bhopal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>Bhopal, MP, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Tech Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#ff2a2a] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 4 Stats Cards matching Akash's metrics section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-white/10">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white font-display mb-1">
              Sem 5
            </div>
            <div className="text-xs font-semibold text-[#ff2a2a] uppercase tracking-wider">
              B.Tech CSE (AIML)
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">BIST Bhopal</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white font-display mb-1">
              76%
            </div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Class XII Board
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">Physics, Chem, Math</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white font-display mb-1">
              10+
            </div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Projects & Repos
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">C++, Python, Web</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white font-display mb-1 text-[#ff2a2a]">
              Finalist
            </div>
            <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              BGI Hackathon 2026
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">National Vision 2047</div>
          </div>
        </div>
      </div>
    </section>
  );
};
