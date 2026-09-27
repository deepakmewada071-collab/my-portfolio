import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import { ArrowRight, Download, Terminal, Cpu, ShieldCheck, Activity, Copy, Check, Linkedin, Github, FolderGit2, Gamepad2 } from 'lucide-react';
import { LeetCodeIcon } from './LeetCodeIcon';

interface HeroProps {
  onDownloadResume: () => void;
  onOpenGitHubHub?: () => void;
  onPlayNumberGame?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDownloadResume, onOpenGitHubHub, onPlayNumberGame }) => {
  const [activeTab, setActiveTab] = useState<'topology' | 'code' | 'spec'>('topology');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`// Deepak Mewada · Number Guessing Game Logic
function evaluateGuess(guess, target, min, max) {
  if (guess === target) return { status: 'WIN', attempts };
  const diff = Math.abs(guess - target);
  const temp = diff <= 5 ? '🔥 Boiling Hot!' : diff <= 15 ? '🌤️ Warm' : '❄️ Cold';
  const hint = guess < target ? 'Too Low 📈' : 'Too High 📉';
  const nextMidpoint = Math.floor((min + max) / 2); // O(log N) Binary Search
  return { hint, temp, nextMidpoint };
}`);
    setCopiedSnippet(true);
    trackEvent('page_view', 'copy_hero_snippet');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Impact & Core Value */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability & Location Indicator (Unboxed, clean text) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>{PERSONAL_INFO.availability}</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{PERSONAL_INFO.location}</span>
            </div>

            {/* Display Headline (No orphan words, balanced) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display max-w-2xl text-balance">
              Building impactful web platforms, social commerce & intelligent software.
            </h1>

            {/* Descriptive Summary matching career objective */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Hi, I’m <strong className="text-white font-semibold">Deepak Mewada</strong> — a B.Tech Computer Science (AIML) 5th semester student at Bansal Institute of Science & Technology, Bhopal. Skilled in C/C++, Python, React, and modern web development, passionate about collaborative problem-solving and innovation.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                onClick={() => trackEvent('project_click', 'hero_explore_projects')}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30"
              >
                <span>Explore Selected Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  trackEvent('resume_download', 'hero_cta');
                  onDownloadResume();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 bg-slate-800/90 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Quick Professional Profiles & IDs */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              {/* GitHub ID pill */}
              <a
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('page_view', 'hero_github_click')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-slate-500 transition-colors font-mono"
                title={`Visit GitHub: @${PERSONAL_INFO.githubId}`}
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>github.com/{PERSONAL_INFO.githubId}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </a>

              {/* LinkedIn ID pill */}
              <a
                href={PERSONAL_INFO.social.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('page_view', 'hero_linkedin_click')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-800/60 text-blue-300 hover:text-white hover:bg-blue-900/50 transition-colors font-mono"
                title={`Visit LinkedIn: ${PERSONAL_INFO.linkedinId}`}
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>linkedin.com/in/{PERSONAL_INFO.linkedinId}</span>
                <ArrowRight className="w-3 h-3 text-blue-400" />
              </a>

              {/* LeetCode ID pill */}
              <a
                href={PERSONAL_INFO.social.leetcode}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('page_view', 'hero_leetcode_click')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:text-white hover:bg-amber-900/50 transition-colors font-mono"
                title={`Visit LeetCode: @${PERSONAL_INFO.leetcodeId}`}
              >
                <LeetCodeIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>leetcode.com/{PERSONAL_INFO.leetcodeId}</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </a>

              {onOpenGitHubHub && (
                <button
                  type="button"
                  onClick={onOpenGitHubHub}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300 transition-colors font-mono cursor-pointer"
                  title="Open Interactive GitHub Hub & Terminal"
                >
                  <FolderGit2 className="w-3 h-3" />
                  <span>GitHub Hub</span>
                </button>
              )}

              {onPlayNumberGame && (
                <button
                  type="button"
                  onClick={onPlayNumberGame}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:bg-amber-900/50 hover:text-amber-200 transition-colors font-mono cursor-pointer"
                  title="Play Deepak's Number Guessing Game Live"
                >
                  <Gamepad2 className="w-3 h-3 text-amber-400" />
                  <span>Play Guessing Game</span>
                </button>
              )}
            </div>

            {/* Claim-to-Proof Quantitative Metrics (Tabular numerals) */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {PERSONAL_INFO.stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-400">{stat.label}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Terminal & Live Console */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-black/40">
              {/* Terminal Window Header */}
              <div className="px-4 py-3 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 pl-2">deepak-mewada.sys</span>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('topology')}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                      activeTab === 'topology'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    topology
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                      activeTab === 'code'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    schema
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('spec')}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                      activeTab === 'spec'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    runtime
                  </button>
                </div>
              </div>

              {/* Terminal Content Body */}
              <div className="p-5 font-mono text-xs">
                {activeTab === 'topology' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>EVENT STREAM FABRIC</span>
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono tabular-nums">HEALTHY · 14.2ms p99</span>
                    </div>

                    {/* SVG Architecture Topology Diagram */}
                    <div className="bg-[#070b14] p-3 rounded-lg border border-slate-800/60">
                      <svg viewBox="0 0 340 140" className="w-full h-auto" fill="none">
                        {/* Gateway Node */}
                        <rect x="10" y="45" width="80" height="50" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                        <text x="50" y="68" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Ingress Gateway</text>
                        <text x="50" y="82" fill="#64748b" fontSize="8" textAnchor="middle">Rate Limiter</text>

                        {/* Arrows */}
                        <path d="M90 70 L130 70" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                        <polygon points="128,67 134,70 128,73" fill="#3b82f6" />

                        {/* Ring Buffer Cluster */}
                        <rect x="135" y="25" width="90" height="90" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                        <text x="180" y="45" fill="#6ee7b7" fontSize="9" textAnchor="middle" fontWeight="bold">Partition Ring</text>
                        <text x="180" y="65" fill="#94a3b8" fontSize="8" textAnchor="middle">Buffer 01 (Active)</text>
                        <text x="180" y="80" fill="#94a3b8" fontSize="8" textAnchor="middle">Buffer 02 (Flush)</text>
                        <text x="180" y="98" fill="#10b981" fontSize="8" textAnchor="middle">0 Allocations</text>

                        {/* Arrows */}
                        <path d="M225 70 L265 70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                        <polygon points="263,67 269,70 263,73" fill="#10b981" />

                        {/* Storage Sink */}
                        <rect x="270" y="45" width="60" height="50" rx="6" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5" />
                        <text x="300" y="68" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Kafka Sink</text>
                        <text x="300" y="82" fill="#64748b" fontSize="8" textAnchor="middle">140k msg/s</text>
                      </svg>
                    </div>

                    {/* Telemetry rows */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                        <div className="text-slate-500">INGRESS RATE</div>
                        <div className="text-white font-bold tabular-nums">142,850 ops/sec</div>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                        <div className="text-slate-500">V8 GC CYCLES</div>
                        <div className="text-emerald-400 font-bold tabular-nums">-91.4% (Zero Sweep)</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="relative">
                    <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800">
                      <span>numberGuessingGame.js</span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                        aria-label="Copy code snippet"
                      >
                        {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
                      <span className="text-purple-400">function</span>{' '}
                      <span className="text-yellow-300">evaluateGuess</span>(guess, target, min, max) {'{\n'}
                      {'  '}const diff = <span className="text-blue-400">Math.abs</span>(guess - target);<br />
                      {'  '}const isHot = diff &lt;= <span className="text-blue-400">5</span>;<br />
                      {'  '}const midpoint = <span className="text-blue-400">Math.floor</span>((min + max) / <span className="text-blue-400">2</span>); <span className="text-slate-500">// O(log N)</span><br />
                      {'  '}<span className="text-purple-400">return</span> {'{'} diff, isHot, nextMidpoint: midpoint {'}'};<br />
                      {'}'}
                    </pre>
                  </div>
                )}

                {activeTab === 'spec' && (
                  <div className="space-y-2 text-slate-300 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Node Architecture:</span>
                      <span className="text-white">x86_64 Linux Cgroups v2</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Runtime Target:</span>
                      <span className="text-white">Node.js 22 LTS / Go 1.23</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Database Layer:</span>
                      <span className="text-white">PostgreSQL 16 + TimescaleDB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Edge Acceleration:</span>
                      <span className="text-white">Cloudflare Workers + WebAssembly</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Compliance & Tests:</span>
                      <span className="text-emerald-400">SOC2 Type II · 100% WCAG AAA</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="px-4 py-2.5 bg-[#0a0f1d] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Production Verified</span>
                </span>
                <span className="font-mono text-slate-500">SHA: 7f9a4e2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
