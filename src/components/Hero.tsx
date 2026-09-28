import React, { useRef, useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import { useProfileAvatar } from '../utils/useProfileAvatar';
import { useBackgroundPhoto } from '../utils/useBackgroundPhoto';
import { PhotoUploadModal } from './PhotoUploadModal';
import {
  ArrowRight,
  Download,
  Play,
  Mail,
  Github,
  Linkedin,
  Sparkles,
  Code2,
  Brain,
  Camera,
  Upload,
  CheckCircle2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { LeetCodeIcon } from './LeetCodeIcon';

interface HeroProps {
  onDownloadResume: () => void;
  onOpenGitHubHub?: () => void;
  onPlayNumberGame?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDownloadResume, onOpenGitHubHub, onPlayNumberGame }) => {
  const { avatarUrl, isUploading, updateAvatar, resetAvatar } = useProfileAvatar();
  const { bgUrl } = useBackgroundPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalTab, setPhotoModalTab] = useState<'avatar' | 'background'>('avatar');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateAvatar(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await updateAvatar(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to drop avatar:', err);
    }
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#080808]">
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload profile photo"
      />

      {/* Dynamic Background Image (Deepak at Bhopal Plaza Campus / Custom Photo) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-25 filter blur-[1px] scale-105"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        {/* Dark Vignette & Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/95 via-[#080808]/85 to-[#080808]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/95 via-transparent to-[#080808]/95" />
      </div>

      {/* Top subtle red radial ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#ff2a2a]/15 to-transparent rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability Pill & Background Change Trigger */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#00d294] animate-pulse" />
                <span>Available for Software & AIML Opportunities</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">Bhopal, India</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPhotoModalTab('background');
                  setIsPhotoModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer backdrop-blur-sm"
                title="Change or upload custom background photo"
              >
                <Layers className="w-3.5 h-3.5 text-[#ff2a2a]" />
                <span>Background Photo</span>
              </button>
            </div>

            {/* Display Headline with Red Accent & Deepak's Photo right beside it */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Photo placed directly beside Hi, I'm Deepak */}
              <div
                onClick={() => setIsPhotoModalOpen(true)}
                className="relative group shrink-0 cursor-pointer"
                title="Deepak's photo – Click to update"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-tr from-[#ff2a2a] via-[#ff6b4a] to-emerald-400 shadow-[0_0_30px_rgba(255,42,42,0.45)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                  <div className="w-full h-full rounded-[14px] sm:rounded-[22px] overflow-hidden bg-zinc-950 border-2 border-[#0e0e11] relative">
                    <img
                      src={avatarUrl}
                      alt="Deepak Mewada"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/deepak-photo.svg';
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                      <Camera className="w-5 h-5 text-[#ff2a2a] mb-0.5" />
                      <span className="text-[9px] font-bold font-mono uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                </div>
                {/* Online Active Status */}
                <div className="absolute -bottom-1 -right-1 p-0.5 bg-[#080808] rounded-full border border-white/20 shadow-md">
                  <span className="block w-3 h-3 rounded-full bg-[#00d294] animate-pulse" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] font-display">
                  Hi, I'm <span className="text-[#ff2a2a] drop-shadow-[0_0_30px_rgba(255,42,42,0.4)]">Deepak</span>,
                  <br />
                  <span className="text-zinc-100 font-extrabold text-2xl sm:text-3xl lg:text-4xl">
                    Full Stack Developer & AI Enthusiast
                  </span>
                </h1>
              </div>
            </div>

            {/* Subtitle statement */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-normal">
              I build modern web applications with AI integration, using <strong className="text-white font-medium">Python</strong>, <strong className="text-white font-medium">C++</strong>, <strong className="text-white font-medium">Tailwind CSS</strong>, and cutting-edge technologies.
            </p>

            {/* Action Buttons matching Akash */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#projects"
                onClick={() => trackEvent('project_click', 'hero_view_work')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#ff2a2a] hover:bg-[#e40014] rounded-full transition-all shadow-[0_0_25px_rgba(255,42,42,0.35)] hover:shadow-[0_0_35px_rgba(255,42,42,0.5)] hover:scale-105 cursor-pointer"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                onClick={() => trackEvent('page_view', 'hero_contact_me')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>Contact Me</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  trackEvent('resume_download', 'hero_cta');
                  onDownloadResume();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all cursor-pointer"
                title="Download Deepak's CV / Resume"
              >
                <Download className="w-4 h-4 text-[#ff2a2a]" />
                <span>Download Resume</span>
              </button>

              {onPlayNumberGame && (
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('page_view', 'hero_play_game');
                    onPlayNumberGame();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/60 rounded-full transition-all cursor-pointer"
                  title="Play Algorithmic Number Guessing Game"
                >
                  <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Play Reel</span>
                </button>
              )}
            </div>

            {/* Quick Profiles Strip: LeetCode + GitHub + LinkedIn */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <a
                href={PERSONAL_INFO.social.leetcode}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/30 border border-amber-700/40 text-amber-300 hover:text-white hover:border-amber-500 transition-colors"
                title="LeetCode Profile: @deepak5457"
              >
                <LeetCodeIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>leetcode.com/{PERSONAL_INFO.leetcodeId}</span>
              </a>

              <a
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-colors"
                title="GitHub Profile: @deepakmewada071-collab"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>github.com/{PERSONAL_INFO.githubId}</span>
              </a>

              <a
                href={PERSONAL_INFO.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/30 border border-blue-700/40 text-blue-300 hover:text-white hover:border-blue-500 transition-colors"
                title="LinkedIn Profile: deepak-mewada-795a2932b"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Avatar Card with Real Photo Support */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Outer red ambient blur behind card */}
            <div className="absolute w-72 h-72 bg-[#ff2a2a]/20 rounded-full blur-[90px] -z-10 pointer-events-none" />

            <div className="relative w-full max-w-[360px] rounded-2xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/10 shadow-2xl overflow-hidden group">
              {/* Inner card surface */}
              <div className="w-full rounded-xl bg-[#0e0e0e] flex flex-col items-center justify-between p-6 relative overflow-hidden">
                {/* Background technical code matrix pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

                {/* Top card header */}
                <div className="w-full flex items-center justify-between z-10 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold tracking-wider">
                    DEEPAK_PROFILE.sh
                  </span>
                </div>

                {/* Center Developer Avatar / Deepak's Real Photo Frame */}
                <div className="my-auto text-center z-10 space-y-3.5 w-full flex flex-col items-center">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="relative group/avatar cursor-pointer"
                    title="Click to set or update Deepak's photo"
                  >
                    {/* Glowing outer ring */}
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#ff2a2a] via-[#ff6b4a] to-emerald-500 shadow-[0_0_35px_rgba(255,42,42,0.35)] transition-transform duration-300 group-hover/avatar:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 border-2 border-[#0e0e0e] relative flex items-center justify-center">
                        <img
                          src={avatarUrl}
                          alt="Deepak Mewada"
                          onError={(e) => {
                            // Fallback to svg illustration
                            (e.currentTarget as HTMLImageElement).src = '/deepak-photo.svg';
                          }}
                          className="w-full h-full object-cover object-top"
                        />

                        {/* Hover Overlay with Camera Icon */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                          <Camera className="w-6 h-6 text-[#ff2a2a] mb-1" />
                          <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                            {isUploading ? 'Uploading...' : 'Update Photo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Online status indicator badge */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#0e0e0e] border-2 border-white/20 flex items-center justify-center shadow-lg">
                      <span className="w-3 h-3 rounded-full bg-[#00d294] animate-pulse" />
                    </div>
                  </div>

                  {/* Deepak Name & Title */}
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Deepak Mewada</h3>
                    <p className="text-xs text-[#ff2a2a] font-mono font-medium mt-0.5">
                      B.Tech CSE (AIML) · Sem 5
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-[240px] mx-auto leading-tight">
                      Bansal Institute of Science and Technology, Bhopal
                    </p>
                  </div>

                  {/* Photo Upload / Change Action Bar */}
                  <div className="w-full pt-1 flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ff2a2a] hover:bg-[#e40014] text-white text-xs font-bold font-mono transition-all hover:scale-105 cursor-pointer shadow-lg shadow-red-950/40"
                      title="Update Deepak's photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{avatarUrl.startsWith('data:') ? 'Update My Photo' : 'Upload My Photo'}</span>
                    </button>

                    {uploadSuccess && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 animate-in fade-in duration-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Photo applied successfully!</span>
                      </div>
                    )}
                  </div>

                  {/* Skills badges */}
                  <div className="pt-2 flex items-center justify-center gap-1.5 font-mono text-[10px] text-zinc-400 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-blue-300">C / C++</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300">Python</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300">HTML / CSS</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">Tailwind</span>
                  </div>
                </div>

                {/* Bottom card footer */}
                <div className="w-full pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400 z-10">
                  <span className="flex items-center gap-1 text-[#00d294]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d294]" />
                    Online & Active
                  </span>
                  <span className="text-zinc-500">Bhopal, MP</span>
                </div>
              </div>

              {/* Floating Tech Badge 1: Python (Top-Left) */}
              <div className="absolute -top-3 -left-3 px-3 py-1.5 rounded-xl bg-[#111111]/90 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce [animation-duration:3s]">
                <Code2 className="w-4 h-4 text-[#3572A5]" />
                <span className="text-xs font-bold text-white font-mono">Python</span>
              </div>

              {/* Floating Tech Badge 2: Tailwind (Top-Right) */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl bg-[#111111]/90 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce [animation-duration:3.6s]">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono">Tailwind</span>
              </div>

              {/* Floating Tech Badge 3: AI / ML (Bottom-Right) */}
              <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl bg-[#111111]/90 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce [animation-duration:4s]">
                <Brain className="w-4 h-4 text-[#ff2a2a]" />
                <span className="text-xs font-bold text-white font-mono">AI / ML</span>
              </div>

              {/* Floating Tech Badge 4: C++ (Bottom-Left) */}
              <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-xl bg-[#111111]/90 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce [animation-duration:3.2s]">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-white font-mono">C++</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload / Update Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        initialTab={photoModalTab}
      />
    </section>
  );
};
