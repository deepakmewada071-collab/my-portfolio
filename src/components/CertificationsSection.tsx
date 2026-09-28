import React from 'react';
import { CERTIFICATIONS } from '../data/portfolioData';
import { Award, ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  return (
    <section id="certificates" className="relative py-24 md:py-32 bg-[#0c0c0c] border-t border-b border-white/5 overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4">
            Verified Skills & Certifications
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Accredited credentials that validate my technical foundation, competitive achievements, and dedication to continuous software engineering excellence.
          </p>
        </div>

        {/* 4-column / responsive grid matching Akash's certificates layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {CERTIFICATIONS.map((cert, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#ff2a2a]/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:text-[#ff2a2a] group-hover:border-[#ff2a2a]/40 transition-colors">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {cert.year}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-2 group-hover:text-[#ff2a2a] transition-colors leading-snug">
                  {cert.name}
                </h3>

                <p className="text-xs text-zinc-400 font-medium mb-4">
                  {cert.issuer}
                </p>

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cert.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/5 border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500">{cert.credentialId}</span>
                <span className="inline-flex items-center gap-1 text-[#00d294] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
