import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import { ExternalLink, Copy, Check, Terminal, Code2, Sparkles, ArrowRight, Github } from 'lucide-react';
import { LeetCodeIcon } from './LeetCodeIcon';

interface CodingProfilesSectionProps {
  onOpenGitHubHub?: () => void;
}

export const CodingProfilesSection: React.FC<CodingProfilesSectionProps> = ({ onOpenGitHubHub }) => {
  const [copiedLeetcode, setCopiedLeetcode] = useState(false);
  const [copiedGithub, setCopiedGithub] = useState(false);

  const handleCopy = (text: string, type: 'leetcode' | 'github') => {
    navigator.clipboard.writeText(text);
    if (type === 'leetcode') {
      setCopiedLeetcode(true);
      setTimeout(() => setCopiedLeetcode(false), 2000);
      trackEvent('page_view', 'copy_leetcode_id');
    } else {
      setCopiedGithub(true);
      setTimeout(() => setCopiedGithub(false), 2000);
      trackEvent('page_view', 'copy_github_id');
    }
  };

  return (
    <section id="coding" className="relative py-24 md:py-32 bg-[#080808] overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Problem Solving & Coding</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4">
            Competitive Programming & DSA
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Strengthening core computer science fundamentals through active algorithmic practice, data structures, and open-source engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* LeetCode Card */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-amber-500/[0.07] via-white/[0.02] to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <LeetCodeIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">LeetCode</h3>
                    <p className="text-xs font-mono text-amber-400">@{PERSONAL_INFO.leetcodeId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(PERSONAL_INFO.leetcodeId, 'leetcode')}
                    className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                    title="Copy LeetCode username"
                    aria-label="Copy LeetCode username"
                  >
                    {copiedLeetcode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={PERSONAL_INFO.social.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors"
                    title="Open LeetCode Profile in new tab"
                    aria-label="Open LeetCode Profile in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                Continuous problem-solving focusing on array manipulations, pointer discipline in C++, binary search optimization in O(log N), recursion trees, and algorithmic complexity.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-zinc-400 font-mono">Primary Language</div>
                  <div className="text-base font-bold text-white mt-0.5">C++ / C</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-zinc-400 font-mono">Core Focus</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">DSA & Algorithms</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">leetcode.com/u/{PERSONAL_INFO.leetcodeId}/</span>
              <a
                href={PERSONAL_INFO.social.leetcode}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* GitHub Hub Card */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                    <Github className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">GitHub</h3>
                    <p className="text-xs font-mono text-zinc-400">@{PERSONAL_INFO.githubId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(PERSONAL_INFO.githubId, 'github')}
                    className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                    title="Copy GitHub username"
                    aria-label="Copy GitHub username"
                  >
                    {copiedGithub ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={PERSONAL_INFO.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    title="Open GitHub Profile in new tab"
                    aria-label="Open GitHub Profile in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                Open-source repositories hosting interactive web applications, BGI Hackathon 2026 prototypes, C/C++ data structure implementations, and Python machine learning labs.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-zinc-400 font-mono">Public Repositories</div>
                  <div className="text-base font-bold text-white mt-0.5">7+ Projects</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-zinc-400 font-mono">Workflows</div>
                  <div className="text-base font-bold text-[#ff2a2a] mt-0.5">Git, CI & Terminal</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {onOpenGitHubHub ? (
                <button
                  type="button"
                  onClick={onOpenGitHubHub}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#ff2a2a]" />
                  <span>Launch Terminal Hub</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-zinc-500">github.com/{PERSONAL_INFO.githubId}</span>
              )}
              <a
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#ff2a2a] transition-colors"
              >
                <span>View Repositories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
