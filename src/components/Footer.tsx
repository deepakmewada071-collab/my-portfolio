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
    <footer className="border-t border-white/10 bg-[#080808] py-14 text-zinc-400 text-xs relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Copyright matching Akash */}
        <div className="space-y-1.5 text-center md:text-left">
          <a
            href="#"
            className="text-lg font-black tracking-tight text-white hover:opacity-90 transition-opacity inline-flex items-center gap-1 group font-display"
          >
            <span>Deepak Mewada</span>
            <span className="text-[#ff2a2a] text-2xl font-black">.</span>
          </a>
          <p className="text-zinc-500 font-normal">
            © {new Date().getFullYear()} Deepak Mewada. All rights reserved. Built with Python, C++, React & modern web standards.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-300 font-medium">
          <a href="#" className="hover:text-[#ff2a2a] transition-colors">Home</a>
          <a href="#about" className="hover:text-[#ff2a2a] transition-colors">About</a>
          <a href="#skills" className="hover:text-[#ff2a2a] transition-colors">Skills</a>
          <a href="#process" className="hover:text-[#ff2a2a] transition-colors">Process</a>
          <a href="#projects" className="hover:text-[#ff2a2a] transition-colors">Projects</a>
          <a href="#coding" className="hover:text-[#ff2a2a] transition-colors">Coding</a>
          <a href="#experience" className="hover:text-[#ff2a2a] transition-colors">Experience</a>
          <a href="#certificates" className="hover:text-[#ff2a2a] transition-colors">Certificates</a>
          <a href="#contact" className="hover:text-[#ff2a2a] transition-colors">Contact</a>
        </div>

        {/* Socials & Back to Top */}
        <div className="flex items-center gap-3">
          <a
            href={PERSONAL_INFO.social.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            aria-label="GitHub Profile"
            title={`GitHub @${PERSONAL_INFO.githubId}`}
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            aria-label="LinkedIn Profile"
            title={`LinkedIn: ${PERSONAL_INFO.linkedinId}`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.social.leetcode}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-zinc-400 hover:text-amber-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            aria-label="LeetCode Profile"
            title={`LeetCode: @${PERSONAL_INFO.leetcodeId}`}
          >
            <LeetCodeIcon className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            aria-label="Send Email"
            title={`Email: ${PERSONAL_INFO.email}`}
          >
            <Mail className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors cursor-pointer ml-1"
            aria-label="Back to top of page"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
