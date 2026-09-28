import React, { useState, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';
import { useProfileAvatar } from '../utils/useProfileAvatar';
import { Download, Menu, X, Sparkles, Send, Github } from 'lucide-react';
import { LeetCodeIcon } from './LeetCodeIcon';

interface HeaderProps {
  onOpenAnalytics: () => void;
  onDownloadResume: () => void;
  onOpenGitHubHub?: () => void;
  onOpenAskAi?: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAnalytics,
  onDownloadResume,
  onOpenGitHubHub,
  onOpenAskAi,
  activeSection,
}) => {
  const { avatarUrl } = useProfileAvatar();
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
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Process', href: '#process' },
    { name: 'Projects', href: '#projects' },
    { name: 'Coding', href: '#coding' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (name: string) => {
    setMobileMenuOpen(false);
    trackEvent('page_view', `nav_${name.toLowerCase()}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-white/10 shadow-xl shadow-black/50 py-3.5'
          : 'bg-[#080808]/60 backdrop-blur-sm border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand wordmark with circular profile avatar */}
        <a
          href="#"
          className="text-lg sm:text-xl font-black tracking-tight text-white hover:opacity-90 transition-opacity flex items-center gap-2.5 group"
          aria-label="Deepak Mewada – Homepage"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#ff2a2a]/50 bg-zinc-800 shrink-0 shadow-sm">
            <img
              src={avatarUrl}
              alt="Deepak"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/deepak-photo.svg';
              }}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span>Deepak Mewada</span>
          <span className="text-[#ff2a2a] text-2xl font-black animate-pulse leading-none">.</span>
        </a>

        {/* Clean text navigation links */}
        <nav
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = (!id && activeSection === 'home') || activeSection === id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.name)}
                className={`relative py-1 text-xs uppercase tracking-wider font-semibold transition-colors hover:text-white ${
                  isActive ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ff2a2a] rounded-full shadow-[0_0_8px_#ff2a2a]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons: Ask AI + Hire Me / Contact */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenAskAi && (
            <button
              type="button"
              onClick={onOpenAskAi}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all cursor-pointer hover:border-red-500/40"
              title="Open Ask Deepak AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff2a2a]" />
              <span>Ask AI</span>
            </button>
          )}

          <a
            href="https://leetcode.com/u/deepak5457/"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-amber-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            title="LeetCode @deepak5457"
            aria-label="LeetCode Profile"
          >
            <LeetCodeIcon className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://github.com/deepakmewada071-collab"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            title="GitHub @deepakmewada071-collab"
            aria-label="GitHub Profile"
          >
            <Github className="w-3.5 h-3.5" />
          </a>

          <a
            href="#contact"
            onClick={() => handleNavClick('Hire Me')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#ff2a2a] hover:bg-[#e40014] rounded-full transition-all shadow-[0_0_20px_rgba(255,42,42,0.35)] hover:shadow-[0_0_25px_rgba(255,42,42,0.5)] cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Hire Me</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          {onOpenAskAi && (
            <button
              type="button"
              onClick={onOpenAskAi}
              className="p-2 text-zinc-300 hover:text-white bg-white/5 border border-white/10 rounded-lg"
              aria-label="Ask Deepak AI"
            >
              <Sparkles className="w-4 h-4 text-[#ff2a2a]" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white bg-white/5 border border-white/10 rounded-lg cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-6 py-5 space-y-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.name)}
                className="py-2 text-sm font-semibold text-zinc-300 hover:text-white hover:text-[#ff2a2a] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={() => handleNavClick('Hire Me')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#ff2a2a] hover:bg-[#e40014] rounded-xl shadow-lg shadow-red-900/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Hire Me / Get in Touch</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadResume();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-200 bg-white/5 border border-white/10 rounded-xl hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
