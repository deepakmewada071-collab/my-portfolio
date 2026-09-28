import React from 'react';
import { Search, PenTool, Code2, Rocket, Sparkles } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Research',
      description: 'I start by understanding goals, user requirements, computational complexity, and technical constraints to lay a rock-solid foundation for the project.',
      icon: Search,
      tag: 'Problem Analysis',
    },
    {
      number: '02',
      title: 'Design',
      description: 'Crafting clean software architecture, intuitive UI/UX workflows, responsive mobile-first layouts, and robust relational or document data models.',
      icon: PenTool,
      tag: 'System Architecture',
    },
    {
      number: '03',
      title: 'Develop',
      description: 'Writing clean, efficient, and well-structured code in C++, Python, and React with rigorous testing, algorithmic discipline, and zero unnecessary dependencies.',
      icon: Code2,
      tag: 'Clean Implementation',
    },
    {
      number: '04',
      title: 'Deploy',
      description: 'Deploying fast, accessible, and secure production-ready applications with continuous monitoring, SEO metadata, and performance optimization.',
      icon: Rocket,
      tag: 'Production Release',
    },
  ];

  return (
    <section id="process" className="relative py-24 md:py-32 bg-[#0c0c0c] border-t border-b border-white/5 overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4">
            Here's how I turn ideas into real-world applications
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            I follow a structured, creative, and highly technical approach to turn ideas into robust software and AI-powered web applications.
          </p>
        </div>

        {/* 4 Process Cards matching Akash's 01-04 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Step Number matching Akash */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl sm:text-5xl font-black font-display text-white/20 group-hover:text-[#ff2a2a] transition-colors">
                      {step.number}
                    </span>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:text-[#ff2a2a] group-hover:border-[#ff2a2a]/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white font-display mb-3 group-hover:text-[#ff2a2a] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                  {step.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
