import React from 'react';
import { Lightbulb, RefreshCw, Users, MessageSquare, Palette, Clock, BookOpen, Target, Sparkles } from 'lucide-react';

export const SoftSkillsSection: React.FC = () => {
  const attributes = [
    {
      title: 'Problem Solving',
      description: 'Deconstructing complex algorithmic and real-world hurdles into clean, modular, and optimized solutions.',
      icon: Target,
    },
    {
      title: 'Adaptability',
      description: 'Rapidly mastering new technologies, frameworks, and switching fluidly between low-level C++ and high-level React.',
      icon: RefreshCw,
    },
    {
      title: 'Team Collaboration',
      description: 'Coordinating effectively during high-intensity 24-hour hackathon sprints and group software builds.',
      icon: Users,
    },
    {
      title: 'Communication',
      description: 'Articulating technical decisions, computational complexity, and system architecture with absolute clarity.',
      icon: MessageSquare,
    },
    {
      title: 'Creativity',
      description: 'Approaching UI/UX challenges and data constraints with fresh perspectives and inventive engineering patterns.',
      icon: Palette,
    },
    {
      title: 'Time Management',
      description: 'Prioritizing core MVP deliverables and shipping complete applications under strict competitive sprint deadlines.',
      icon: Clock,
    },
    {
      title: 'Self-Learning',
      description: 'Constantly self-educating in AI & Machine Learning, competitive programming, and modern web architectures.',
      icon: BookOpen,
    },
    {
      title: 'Persistence',
      description: 'Disciplined debugging, test case verification, and relentless optimization until performance targets are met.',
      icon: Lightbulb,
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-[#080808] overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Attributes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4">
            More Than Just Code
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Essential interpersonal and engineering virtues that elevate software quality, team agility, and continuous innovation.
          </p>
        </div>

        {/* 8 Attribute Cards Grid matching Akash */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {attributes.map((attr, idx) => {
            const Icon = attr.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/10 hover:border-[#ff2a2a]/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#ff2a2a] group-hover:border-[#ff2a2a]/40 transition-colors mb-5">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-2 group-hover:text-[#ff2a2a] transition-colors">
                  {attr.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  {attr.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
