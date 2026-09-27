import React, { useState, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';
import { BarChart3, Download, Menu, X, ArrowUpRight, Github } from 'lucide-react';

interface HeaderProps {
  onOpenAnalytics: () => void;
  onDownloadResume: () => void;
  onOpenGitHubHub?: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAnalytics,
  onDownloadResume,
  onOpenGitHubHub,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Articles', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (name: string) => {
    setMobileMenuOpen(false);
    trackEvent('page_view', `nav_${name.toLowerCase()}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#0b0f17]/90 backdrop-blur-md border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
          : 'bg-[#0b0f17]/60 backdrop-blur-sm border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white hover:text-blue-400 transition-colors flex items-center gap-2 group"
          aria-label="Deepak Mewada – Homepage"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
          <span>Deepak Mewada</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.name)}
                className={`relative py-1 transition-colors hover:text-white ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenGitHubHub && (
            <button
              type="button"
              onClick={onOpenGitHubHub}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700/70 rounded-lg hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
              title="Open GitHub Developer Hub"
              aria-label="Open GitHub Developer Hub"
            >
              <Github className="w-3.5 h-3.5 text-white" />
              <span className="font-mono">GitHub Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded font-mono">
                6
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAnalytics}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700/70 rounded-lg hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
            title="Open Live Visitor Analytics"
            aria-label="View live engagement analytics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            <span className="tabular-nums">Live Analytics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={onDownloadResume}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm shadow-blue-900/40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CV</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          {onOpenGitHubHub && (
            <button
              type="button"
              onClick={onOpenGitHubHub}
              className="p-2 text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 rounded-lg"
              aria-label="Open GitHub Hub"
            >
              <Github className="w-4 h-4 text-white" />
            </button>
          )}
          <button
            type="button"
            onClick={onOpenAnalytics}
            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 rounded-lg"
            aria-label="View analytics"
          >
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 rounded-lg"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0b0f17] border-b border-slate-800 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => handleNavClick(link.name)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {onOpenGitHubHub && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGitHubHub();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:text-white"
              >
                <Github className="w-4 h-4" />
                <span>Open GitHub Developer Hub</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadResume();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              <Download className="w-4 h-4" />
              <span>Download CV (Printable PDF)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
