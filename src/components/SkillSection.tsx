import React from 'react';
import { Code, Layers, Server, Brain, Terminal, Database, Sparkles } from 'lucide-react';

export const SkillSection: React.FC = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code,
      color: 'text-[#ff2a2a]',
      skills: [
        { name: 'C', percentage: 92, note: 'Certified · Memory & Pointers' },
        { name: 'C++', percentage: 92, note: 'Certified · OOP & STL' },
        { name: 'Python', percentage: 86, note: 'AIML · Logic & Data Models' },
      ],
    },
    {
      title: 'Web Technologies',
      icon: Layers,
      color: 'text-blue-400',
      skills: [
        { name: 'HTML5', percentage: 68, note: 'Semantic Structure & WCAG' },
        { name: 'CSS3', percentage: 64, note: 'Grid, Flexbox & Responsive' },
        { name: 'Tailwind CSS', percentage: 62, note: 'Utility-first Modern Styling' },
      ],
    },
    {
      title: 'Backend & Frameworks',
      icon: Server,
      color: 'text-emerald-400',
      skills: [
        { name: 'Node.js', percentage: 82, note: 'Runtime & Server Scripting' },
        { name: 'Express.js', percentage: 80, note: 'Routing & Middleware' },
        { name: 'RESTful APIs', percentage: 88, note: 'JSON Endpoints & Integration' },
      ],
    },
    {
      title: 'AI & Data Foundations',
      icon: Brain,
      color: 'text-purple-400',
      skills: [
        { name: 'Machine Learning', percentage: 85, note: 'Supervised Learning & Models' },
        { name: 'NumPy & Pandas', percentage: 84, note: 'Data Preprocessing & Analysis' },
        { name: 'Algorithmic Heuristics', percentage: 90, note: 'Binary Search & Proximity' },
      ],
    },
    {
      title: 'Tools & Platforms',
      icon: Terminal,
      color: 'text-amber-400',
      skills: [
        { name: 'VS Code', percentage: 95, note: 'Primary IDE & Extensions' },
        { name: 'Git & GitHub', percentage: 88, note: 'Version Control & Repositories' },
        { name: 'Vercel / Cloud', percentage: 85, note: 'Deployment & CI/CD' },
      ],
    },
    {
      title: 'Core CS Concepts',
      icon: Database,
      color: 'text-rose-400',
      skills: [
        { name: 'Data Structures (DSA)', percentage: 88, note: 'Arrays, Trees, Graphs, DP' },
        { name: 'Object-Oriented (OOP)', percentage: 92, note: 'Encapsulation, Polymorphism' },
        { name: 'Algorithmic Problem Solving', percentage: 94, note: 'Optimal Time & Space O(N)' },
      ],
    },
  ];

  return (
    <section id="skills" className="relative py-24 md:py-32 bg-[#080808] overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Stack</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4">
            My Skillset
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            A comprehensive overview of my programming languages, frameworks, AI tools, and engineering concepts.
          </p>
        </div>

        {/* 6 Categorized Skill Cards matching Akash */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white/[0.025] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {cat.title}
                  </h3>
                </div>

                <div className="space-y-5">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-200">
                          {skill.name}
                        </span>
                        <span className="font-mono font-bold text-[#ff2a2a]">
                          {skill.percentage}%
                        </span>
                      </div>

                      {/* Progress Bar with red/gradient fill matching Akash */}
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-600 via-[#ff2a2a] to-rose-500 transition-all duration-1000 shadow-[0_0_10px_rgba(255,42,42,0.4)]"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-zinc-500 font-mono">
                        {skill.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
