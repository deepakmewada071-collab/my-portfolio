import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { LeetCodeIcon } from './LeetCodeIcon';

interface FooterProps {
  onOpenAnalytics: () => void;
  onDownloadResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAnalytics, onDownloadResume }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', 'scroll_to_top');
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#080c14] py-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright */}
        <div className="space-y-1 text-center md:text-left">
          <div className="text-sm font-bold text-white font-display">
            {PERSONAL_INFO.name}
          </div>
          <p className="text-slate-500">
            © {new Date().getFullYear()} Deepak Mewada. All rights reserved. Built with React & Tailwind CSS.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-medium">
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#experience" className="hover:text-white transition-colors">Experience</a>
          <a href="#blog" className="hover:text-white transition-colors">Articles</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <button
            type="button"
            onClick={onOpenAnalytics}
            className="hover:text-white transition-colors cursor-pointer text-blue-400 font-mono"
          >
            Telemetry
          </button>
          <button
            type="button"
            onClick={onDownloadResume}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Resume
          </button>
        </div>

        {/* Socials & Back to Top */}
        <div className="flex items-center gap-4">
          <a
            href={PERSONAL_INFO.social.github}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.social.leetcode}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
            aria-label="LeetCode Profile"
            title={`LeetCode: @${PERSONAL_INFO.leetcodeId}`}
          >
            <LeetCodeIcon className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors ml-2"
            aria-label="Back to top of page"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
