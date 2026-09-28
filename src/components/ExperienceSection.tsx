import React from 'react';
import { EXPERIENCES, EDUCATION } from '../data/portfolioData';
import { Briefcase, Award, GraduationCap, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExperienceSectionProps {
  onPrintResume?: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onPrintResume }) => {
  const achievements = [
    {
      title: 'BGI Hackathon 2026 – Vision 2047 Finalist',
      organizer: 'Bansal Group of Institutes',
      year: '2026',
      description: 'Competed in the 24-hour national hackathon sprint. Designed and presented a future-ready digital solution to evaluating faculty and industry panels.',
    },
    {
      title: 'Class XII (Senior Secondary) Academic Merit',
      organizer: 'Secondary Board Examination',
      year: '2024',
      description: 'Secured 76% score in Physics, Chemistry, and Mathematics (PCM), building a rigorous foundation in analytical reasoning.',
    },
    {
      title: 'Class X (Secondary School) First Division',
      organizer: 'Secondary School Board',
      year: '2022',
      description: 'Achieved 73% academic score with strong foundational scores in Mathematics, Science, and Computer applications.',
    },
  ];

  return (
    <section id="experience" className="relative py-24 md:py-32 bg-[#080808] overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Journey & Track Record</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4">
            Internships & Work Experience
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            A chronological timeline of hands-on software development, competitive hackathon sprints, and core academic milestones.
          </p>
        </div>

        {/* Work Experience Timeline */}
        <div className="max-w-4xl mx-auto space-y-8 mb-24">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-[#ff2a2a]/40 transition-all duration-300 shadow-xl group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-[#ff2a2a] transition-colors">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-semibold text-zinc-300 mt-0.5">
                    {exp.company}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">
                    {exp.period}
                  </span>
                  <span>{exp.location}</span>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed font-normal mb-5">
                {exp.description}
              </p>

              <div className="space-y-2 mb-6">
                {exp.achievements.map((item, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-[#ff2a2a] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                {exp.technologies.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-mono text-zinc-400 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Beyond the Code / Key Achievements Section matching Akash */}
        <div className="mt-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display mb-3">
              Beyond the Code
            </h3>
            <p className="text-sm text-zinc-400 font-normal">
              Hackathons, academic credentials, and milestones defining my engineering journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {achievements.map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#ff2a2a]/40 transition-all duration-300 flex flex-col justify-between shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-[#ff2a2a]">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      {item.year}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white font-display mb-2 group-hover:text-[#ff2a2a] transition-colors leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-zinc-500">
                  {item.organizer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
