import React, { useState, useMemo } from 'react';
import { Project } from '../types/portfolio';
import { PROJECTS } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import {
  ExternalLink,
  Github,
  Maximize2,
  X,
  Search,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Filter,
  Check,
  RotateCcw,
  Gamepad2,
} from 'lucide-react';

interface ProjectShowcaseProps {
  onSelectProject?: (project: Project) => void;
  onPlayGame?: (projectId: string) => void;
}

// Available curated technology filters including specific examples requested: React, Node.js, Cloud Architecture
const TECH_FILTER_OPTIONS = [
  'Algorithms',
  'C++',
  'Python',
  'React',
  'HTML5',
  'CSS3',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Git',
];

function projectMatchesTech(project: Project, tech: string): boolean {
  const normTech = tech.toLowerCase().trim();

  if (normTech === 'c++' || normTech === 'cpp' || normTech === 'c') {
    return project.techStack.some((t) => t.toLowerCase().includes('c++') || t.toLowerCase() === 'c');
  }

  if (normTech === 'algorithms') {
    return (
      project.category === 'game' ||
      project.techStack.some((t) => t.toLowerCase().includes('algorithm')) ||
      project.architectureHighlights.some((h) => h.toLowerCase().includes('algorithm') || h.toLowerCase().includes('binary search'))
    );
  }

  if (normTech === 'cloud architecture') {
    return (
      project.category === 'cloud' ||
      project.categoryLabel.toLowerCase().includes('cloud') ||
      project.summary.toLowerCase().includes('cloud') ||
      project.techStack.some((t) =>
        ['aws', 'kubernetes', 'docker', 'kafka', 'redis', 'cgroups', 'cloud'].some((keyword) =>
          t.toLowerCase().includes(keyword)
        )
      )
    );
  }

  if (normTech === 'react') {
    return project.techStack.some((t) => t.toLowerCase().includes('react'));
  }

  if (normTech === 'node.js' || normTech === 'nodejs') {
    return project.techStack.some((t) => t.toLowerCase().includes('node'));
  }

  if (normTech === 'python') {
    return project.techStack.some((t) => t.toLowerCase().includes('python'));
  }

  return project.techStack.some(
    (t) => t.toLowerCase() === normTech || t.toLowerCase().includes(normTech)
  );
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onPlayGame }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [techMatchMode, setTechMatchMode] = useState<'any' | 'all'>('any');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'game', label: 'Games & Logic' },
    { id: 'fullstack', label: 'Web Applications' },
    { id: 'ai', label: 'Innovation & Hackathons' },
  ];

  // Calculate project count for each tech filter
  const techCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TECH_FILTER_OPTIONS.forEach((tech) => {
      counts[tech] = PROJECTS.filter((p) => projectMatchesTech(p, tech)).length;
    });
    return counts;
  }, []);

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => {
      const exists = prev.includes(tech);
      const updated = exists ? prev.filter((t) => t !== tech) : [...prev, tech];
      trackEvent('filter_change', `tech_${tech}`, { active: !exists ? 'true' : 'false' });
      return updated;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedTechs([]);
    setSearchQuery('');
    trackEvent('filter_change', 'clear_all_filters');
  };

  const filteredProjects = PROJECTS.filter((project) => {
    // Category filter
    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory;

    // Technology stack filter
    let matchesTech = true;
    if (selectedTechs.length > 0) {
      if (techMatchMode === 'any') {
        matchesTech = selectedTechs.some((tech) => projectMatchesTech(project, tech));
      } else {
        matchesTech = selectedTechs.every((tech) => projectMatchesTech(project, tech));
      }
    }

    // Search query filter
    const matchesSearch =
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesTech && matchesSearch;
  });

  const handleOpenModal = (project: Project) => {
    setActiveModalProject(project);
    trackEvent('case_study_open', project.title, { projectId: project.id });
  };

  const handleCloseModal = () => {
    setActiveModalProject(null);
  };

  return (
    <section id="projects" className="py-24 md:py-32 bg-[#0c0c0c] border-t border-b border-white/5 relative overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header matching Akash */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider">
              <span>Selected Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
              Work that speaks for itself
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl font-normal">
              A curated selection of responsive web applications, algorithmic engines, and competitive hackathon prototypes built with rigorous standards.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 2) {
                  trackEvent('filter_change', 'project_search', { query: e.target.value });
                }
              }}
              placeholder="Search projects by tech or keyword..."
              aria-label="Filter projects by technology or title"
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ff2a2a] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Primary Category Filter Segmented Control */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto max-w-fit">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  trackEvent('filter_change', `category_${cat.id}`);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#ff2a2a] text-white shadow-md shadow-red-900/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Counter & Reset */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span>
              Showing <strong className="text-white">{filteredProjects.length}</strong> of{' '}
              <strong className="text-white">{PROJECTS.length}</strong> projects
            </span>
            {(selectedCategory !== 'all' || selectedTechs.length > 0 || searchQuery !== '') && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-[#ff2a2a] hover:text-red-400 transition-colors cursor-pointer underline underline-offset-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            )}
          </div>
        </div>

        {/* Technology Stack Filter Bar */}
        <div className="mb-10 bg-white/[0.025] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ff2a2a]" />
              <span className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider">
                Filter by Technology Stack
              </span>
              {selectedTechs.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-red-300 bg-red-950/80 border border-red-800/80 rounded-full">
                  {selectedTechs.length} active
                </span>
              )}
            </div>

            {/* Match Mode (AND / OR) & Clear */}
            <div className="flex items-center gap-3">
              {selectedTechs.length > 1 && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                  <span className="text-zinc-500">Logic:</span>
                  <button
                    type="button"
                    onClick={() => setTechMatchMode('any')}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      techMatchMode === 'any'
                        ? 'bg-[#ff2a2a] text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ANY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechMatchMode('all')}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      techMatchMode === 'all'
                        ? 'bg-[#ff2a2a] text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ALL
                  </button>
                </div>
              )}

              {selectedTechs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTechs([])}
                  className="text-[11px] font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Clear stack filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Technology Toggle Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {TECH_FILTER_OPTIONS.map((tech) => {
              const isSelected = selectedTechs.includes(tech);
              const count = techCounts[tech] || 0;
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#ff2a2a] border-[#ff2a2a] text-white font-semibold shadow-md shadow-red-900/30'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/20 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                  <span>{tech}</span>
                  <span
                    className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded ${
                      isSelected
                        ? 'bg-black/30 text-white'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active selection summary banner */}
          {selectedTechs.length > 0 && (
            <div className="pt-2 text-[11px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500">Filtered by:</span>
              {selectedTechs.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/60 text-blue-300"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className="hover:text-white"
                    title={`Remove ${tech} filter`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
            <p className="text-slate-300 text-sm font-medium">
              No engineering projects match the selected criteria.
            </p>
            {selectedTechs.length > 0 && (
              <p className="text-xs text-slate-400">
                Active stack filters: <strong className="text-white">{selectedTechs.join(', ')}</strong> ({techMatchMode.toUpperCase()} mode).
              </p>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff2a2a]/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Project Visual Preview */}
                <div
                  className="relative h-44 bg-gradient-to-br from-zinc-900 to-[#111111] p-5 flex flex-col justify-between border-b border-white/10 cursor-pointer overflow-hidden"
                  onClick={() => handleOpenModal(project)}
                >
                  {/* Subtle Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff2a2a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Top metadata strip inside preview */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ff2a2a]" />
                      <span>{project.categoryLabel}</span>
                    </span>
                    <span className="text-zinc-500">{project.year}</span>
                  </div>

                  {/* Center Architectural Miniature */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1">
                    <div className="text-center font-mono text-xs text-zinc-300 font-semibold group-hover:text-[#ff2a2a] transition-colors">
                      {project.id === 'number-guessing-game' && 'BINARY SEARCH O(log N) · DYNAMIC HINTS · HIGHSCORES'}
                      {project.id === 'social-commerce-local' && 'COMMUNITY DIRECT DISCOVERY · REACT · TAILWIND'}
                      {project.id === 'bgi-hackathon-project' && 'NATIONAL VISION 2047 · 36-HOUR PROTOTYPE'}
                      {project.id === 'deepak-portfolio-analytics' && 'CLIENT TELEMETRY · PRINT CSS A4 · ZERO BLOAT'}
                      {project.id === 'responsive-landing-page' && 'SEMANTIC HTML5 · ZERO-FRAMEWORK CSS · 100% FLUID'}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>{project.impactMetrics[0]}</span>
                    </div>
                  </div>

                  {/* Bottom hover bar */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-[#ff2a2a] font-medium">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>Examine Case Study</span>
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Project Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      onClick={() => handleOpenModal(project)}
                      className="text-lg font-bold text-white group-hover:text-[#ff2a2a] transition-colors cursor-pointer flex items-center justify-between font-display"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#ff2a2a] transition-colors shrink-0 ml-2" />
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-normal">
                      {project.summary}
                    </p>
                  </div>

                  {/* Clean unboxed tech stack metadata with clickable toggle functionality */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[11px] text-zinc-400 font-mono flex flex-wrap items-center gap-x-2 gap-y-1">
                      {project.techStack.map((tech, idx) => {
                        const isMatch = selectedTechs.some((st) =>
                          tech.toLowerCase().includes(st.toLowerCase()) ||
                          st.toLowerCase().includes(tech.toLowerCase())
                        );
                        return (
                          <React.Fragment key={tech}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTech(tech);
                              }}
                              className={`transition-colors cursor-pointer ${
                                isMatch
                                  ? 'text-[#ff2a2a] font-semibold underline underline-offset-2'
                                  : 'hover:text-white'
                              }`}
                              title={`Click to filter by ${tech}`}
                            >
                              {tech}
                            </button>
                            {idx < project.techStack.length - 1 && (
                              <span aria-hidden="true" className="text-zinc-600">·</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action links */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(project)}
                        className="text-[#ff2a2a] hover:text-red-400 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Deep-Dive</span>
                      </button>

                      {(project.isPlayable || project.id === 'number-guessing-game') && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayGame?.(project.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#ff2a2a] hover:bg-[#e40014] shadow-sm shadow-red-950 transition-colors cursor-pointer"
                          title="Play Number Guessing Game Live"
                        >
                          <Gamepad2 className="w-3.5 h-3.5" />
                          <span>Play Game</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackEvent('project_click', `github_${project.id}`)}
                          className="text-zinc-400 hover:text-white transition-colors"
                          title="View Source on GitHub"
                          aria-label={`View GitHub repository for ${project.title}`}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackEvent('project_click', `live_${project.id}`)}
                          className="text-slate-400 hover:text-white transition-colors"
                          title="Live Demo / Deployment"
                          aria-label={`View Live Deployment for ${project.title}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Case Study Modal */}
        {activeModalProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            <div className="bg-[#0b101c] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-8">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <span className="text-blue-400 font-semibold">{activeModalProject.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Production Case Study</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeModalProject.year}</span>
                  </div>
                  <h3 id="modal-project-title" className="text-2xl sm:text-3xl font-bold text-white font-display">
                    {activeModalProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
                  aria-label="Close case study dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Problem & Solution Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide">
                    The Engineering Challenge
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeModalProject.problem}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                    Architectural Solution
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeModalProject.solution}
                  </p>
                </div>
              </div>

              {/* Quantifiable Impact Metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                  Measured Production Outcomes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalProject.impactMetrics.map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                  Key Technical Innovations
                </h4>
                <ul className="space-y-2">
                  {activeModalProject.architectureHighlights.map((highlight, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 font-bold">›</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Unboxed */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">Technologies & Frameworks:</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-200 font-mono">
                  {activeModalProject.techStack.map((tech) => (
                    <span key={tech} className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
                {(activeModalProject.isPlayable || activeModalProject.id === 'number-guessing-game') && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseModal();
                      onPlayGame?.(activeModalProject.id);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 shadow-md shadow-emerald-950/40 transition-colors cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Play Live Game Now</span>
                  </button>
                )}
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('project_click', `modal_github_${activeModalProject.id}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
                {activeModalProject.liveUrl && (
                  <a
                    href={activeModalProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('project_click', `modal_live_${activeModalProject.id}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Deployment</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
