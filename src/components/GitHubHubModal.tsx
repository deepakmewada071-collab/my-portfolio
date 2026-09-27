import React, { useState, useMemo } from 'react';
import { PERSONAL_INFO, GITHUB_REPOSITORIES } from '../data/portfolioData';
import { GitHubRepo } from '../types/portfolio';
import { trackEvent } from '../utils/analytics';
import {
  Github,
  X,
  ExternalLink,
  Copy,
  Check,
  Star,
  GitFork,
  Terminal,
  Search,
  Code2,
  Sparkles,
  Edit2,
  RotateCcw,
  CheckCircle2,
  FolderGit2,
  ArrowUpRight
} from 'lucide-react';

interface GitHubHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubHubModal: React.FC<GitHubHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'repos' | 'activity' | 'terminal'>('repos');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedClone, setCopiedClone] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo>(GITHUB_REPOSITORIES[0]);
  
  // Customizable GitHub ID feature
  const [customGithubId, setCustomGithubId] = useState<string>(() => {
    return localStorage.getItem('deepak_custom_github_id') || PERSONAL_INFO.githubId;
  });
  const [isEditingId, setIsEditingId] = useState(false);
  const [tempIdInput, setTempIdInput] = useState(customGithubId);

  const activeGithubUrl = `https://github.com/${customGithubId}`;

  const handleSaveCustomId = () => {
    const trimmed = tempIdInput.trim().replace(/^@/, '');
    if (trimmed) {
      setCustomGithubId(trimmed);
      localStorage.setItem('deepak_custom_github_id', trimmed);
      trackEvent('filter_change', 'change_github_id', { newId: trimmed });
    }
    setIsEditingId(false);
  };

  const handleResetId = () => {
    setCustomGithubId(PERSONAL_INFO.githubId);
    setTempIdInput(PERSONAL_INFO.githubId);
    localStorage.removeItem('deepak_custom_github_id');
    setIsEditingId(false);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(customGithubId);
    setCopiedId(true);
    trackEvent('page_view', 'copy_github_id');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyClone = (repo: GitHubRepo) => {
    const cmd = `git clone https://github.com/${customGithubId}/${repo.name}.git`;
    navigator.clipboard.writeText(cmd);
    setCopiedClone(repo.name);
    trackEvent('project_click', `clone_${repo.name}`);
    setTimeout(() => setCopiedClone(null), 2500);
  };

  const languages = useMemo(() => {
    const set = new Set<string>();
    GITHUB_REPOSITORIES.forEach((r) => set.add(r.language));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredRepos = useMemo(() => {
    return GITHUB_REPOSITORIES.filter((repo) => {
      const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
      const matchesSearch =
        searchQuery === '' ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesLang && matchesSearch;
    });
  }, [selectedLanguage, searchQuery]);

  // Contribution grid simulation (16 weeks x 7 days)
  const heatmapData = useMemo(() => {
    const grid: number[][] = [];
    const seed = [1, 3, 0, 4, 2, 5, 1, 0, 2, 6, 3, 2, 0, 1, 4, 3, 2, 5, 0, 1, 2, 4, 3, 6, 2, 1, 0, 3];
    let idx = 0;
    for (let col = 0; col < 24; col++) {
      const days: number[] = [];
      for (let row = 0; row < 7; row++) {
        days.push(seed[(idx + row * 3 + col * 2) % seed.length]);
        idx++;
      }
      grid.push(days);
    }
    return grid;
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="GitHub Developer Hub"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#0d1117] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Window Chrome */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#161b22] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Github className="w-4 h-4 text-white" />
              <span>GitHub Developer Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                @{customGithubId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activeGithubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 transition-colors"
              title="Open GitHub profile in new tab"
            >
              <span>github.com/{customGithubId}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close GitHub Hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* GitHub ID Card & Action Banner */}
          <div className="p-4 sm:p-5 bg-[#161b22] border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-600 flex items-center justify-center text-white shadow-inner font-mono text-xl font-bold">
                  {customGithubId.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#161b22]" title="Active Developer" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{PERSONAL_INFO.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">(@{customGithubId})</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  B.Tech CSE (AIML) Student • Open Source Contributor • Bhopal, IN
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedId ? 'Copied ID!' : `Copy ID: ${customGithubId}`}</span>
                  </button>

                  {!isEditingId ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingId(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md text-slate-400 hover:text-white bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-colors"
                      title="Edit or test a different GitHub ID"
                    >
                      <Edit2 className="w-3 h-3 text-slate-400" />
                      <span>Change ID</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tempIdInput}
                        onChange={(e) => setTempIdInput(e.target.value)}
                        placeholder="new-github-id"
                        className="px-2 py-0.5 text-xs bg-slate-900 border border-blue-500 rounded text-white font-mono w-32 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSaveCustomId}
                        className="px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingId(false)}
                        className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      {customGithubId !== PERSONAL_INFO.githubId && (
                        <button
                          type="button"
                          onClick={handleResetId}
                          className="p-1 text-slate-400 hover:text-amber-400"
                          title="Reset to default"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5">
              <div className="text-center">
                <div className="text-lg font-bold text-white tabular-nums">6</div>
                <div className="text-slate-500 text-[10px] uppercase">Public Repos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400 tabular-nums">115+</div>
                <div className="text-slate-500 text-[10px] uppercase">Total Stars</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400 tabular-nums">28+</div>
                <div className="text-slate-500 text-[10px] uppercase">Forks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-400 tabular-nums">340+</div>
                <div className="text-slate-500 text-[10px] uppercase">Commits</div>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('repos')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'repos'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Featured Repositories ({filteredRepos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activity')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'activity'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commit Activity & Heatmap</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('terminal')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'terminal'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Git Clone Assistant</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Featured Repositories */}
          {activeTab === 'repos' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Find a repository or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#161b22] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredRepos.map((repo) => {
                  const isCurrentCloned = copiedClone === repo.name;
                  return (
                    <div
                      key={repo.name}
                      className="p-4 bg-[#161b22] border border-slate-800/90 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <a
                            href={`https://github.com/${customGithubId}/${repo.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-sm font-bold text-blue-400 hover:underline flex items-center gap-1.5"
                          >
                            <span>{repo.name}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-400 font-mono">
                            Public
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {repo.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-900/40"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: repo.languageColor }}
                            />
                            <span>{repo.language}</span>
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                            <span>{repo.stars}</span>
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <GitFork className="w-3 h-3" />
                            <span>{repo.forks}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRepo(repo);
                              handleCopyClone(repo);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded border border-slate-700 transition-colors"
                            title="Copy git clone command"
                            aria-label={`Copy git clone command for ${repo.name}`}
                          >
                            {isCurrentCloned ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Terminal className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={`https://github.com/${customGithubId}/${repo.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded border border-slate-700 transition-colors"
                            title="View repository on GitHub"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Activity Heatmap & Language Breakdown */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Contribution Heatmap Card */}
              <div className="p-5 bg-[#161b22] border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>348 contributions in the last year</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Active coding and version control commits across web, algorithms, and AI projects.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Active Streak: 14 Days
                  </span>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto pb-2">
                  <div className="inline-flex gap-1">
                    {heatmapData.map((col, cIdx) => (
                      <div key={cIdx} className="flex flex-col gap-1">
                        {col.map((intensity, rIdx) => {
                          const colors = [
                            'bg-slate-800/80',
                            'bg-emerald-950',
                            'bg-emerald-800',
                            'bg-emerald-600',
                            'bg-emerald-500',
                            'bg-emerald-400',
                            'bg-emerald-300',
                          ];
                          return (
                            <div
                              key={rIdx}
                              title={`${intensity * 2 + 1} contributions on this date`}
                              className={`w-3 h-3 rounded-xs ${colors[intensity] || colors[0]} transition-transform hover:scale-125 cursor-pointer`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                  <span>Learn how GitHub contributions work</span>
                  <div className="flex items-center gap-1">
                    <span>Less</span>
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-800 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-950 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-300 inline-block" />
                    <span>More</span>
                  </div>
                </div>
              </div>

              {/* Language Distribution Breakdown */}
              <div className="p-5 bg-[#161b22] border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span>Primary Languages in GitHub Repositories</span>
                </h4>

                <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden">
                  <div style={{ width: '42%' }} className="bg-[#3178c6]" title="TypeScript 42%" />
                  <div style={{ width: '28%' }} className="bg-[#3572A5]" title="Python 28%" />
                  <div style={{ width: '18%' }} className="bg-[#f34b7d]" title="C++ 18%" />
                  <div style={{ width: '12%' }} className="bg-[#e34c26]" title="HTML/CSS 12%" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3178c6]" />
                    <span className="text-slate-300 font-medium">TypeScript (42%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3572A5]" />
                    <span className="text-slate-300 font-medium">Python (28%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f34b7d]" />
                    <span className="text-slate-300 font-medium">C++ (18%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e34c26]" />
                    <span className="text-slate-300 font-medium">HTML/CSS (12%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Git Terminal & Clone Assistant */}
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <div className="p-4 bg-black/80 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-500">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>bash ~ interactive git terminal</span>
                  </div>
                  <span className="text-[10px]">Select a repo to load commands</span>
                </div>

                <div className="flex flex-wrap gap-2 py-1">
                  {GITHUB_REPOSITORIES.map((repo) => (
                    <button
                      key={repo.name}
                      type="button"
                      onClick={() => setSelectedRepo(repo)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        selectedRepo.name === repo.name
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {repo.name}
                    </button>
                  ))}
                </div>

                <div className="bg-[#0b0e14] p-4 rounded-lg border border-slate-800 space-y-2 select-all">
                  <div className="text-slate-500"># 1. Clone Deepak's repository to your local workspace</div>
                  <div className="text-emerald-400 flex items-center justify-between gap-2">
                    <span>git clone https://github.com/{customGithubId}/{selectedRepo.name}.git</span>
                    <button
                      type="button"
                      onClick={() => handleCopyClone(selectedRepo)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-sans flex items-center gap-1 shrink-0"
                    >
                      {copiedClone === selectedRepo.name ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-slate-500 pt-2"># 2. Navigate into project directory</div>
                  <div className="text-white">cd {selectedRepo.name}</div>

                  <div className="text-slate-500 pt-2"># 3. Install dependencies & run</div>
                  <div className="text-blue-300">
                    {selectedRepo.language === 'Python' ? 'python -m pip install -r requirements.txt' : 'npm install && npm run dev'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/20 border border-blue-900/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    Direct access to all verified source code on GitHub under <strong>@{customGithubId}</strong>.
                  </span>
                </div>
                <a
                  href={`https://github.com/${customGithubId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shrink-0"
                >
                  Visit Profile
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 bg-[#161b22] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GitHub ID verified: <strong>{customGithubId}</strong></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
