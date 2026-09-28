import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillSection } from './components/SkillSection';
import { ProcessSection } from './components/ProcessSection';
import { ProjectShowcase } from './components/ProjectShowcase';
import { CodingProfilesSection } from './components/CodingProfilesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { CertificationsSection } from './components/CertificationsSection';
import { SoftSkillsSection } from './components/SoftSkillsSection';
import { ResumeSection } from './components/ResumeSection';
import { ContactSection } from './components/ContactSection';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GitHubHubModal } from './components/GitHubHubModal';
import { NumberGuessingGameModal } from './components/NumberGuessingGameModal';
import { AskMeAiDrawer } from './components/AskMeAiDrawer';
import { Footer } from './components/Footer';
import { SkipLink } from './components/SkipLink';
import { initializeSessionTracker, trackEvent } from './utils/analytics';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isGitHubHubOpen, setIsGitHubHubOpen] = useState(false);
  const [isNumberGameOpen, setIsNumberGameOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Initialize privacy-respecting session engagement tracker
    const cleanupSession = initializeSessionTracker();

    // Intersection observer to track section visibility and highlight active nav item
    const sectionIds = ['about', 'skills', 'process', 'projects', 'coding', 'experience', 'certificates', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
                trackEvent('page_view', `section_${id}`);
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => {
      if (cleanupSession) cleanupSession();
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handlePrintResume = () => {
    trackEvent('resume_download', 'print_pdf_trigger');
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col font-sans selection:bg-[#ff2a2a]/30 selection:text-white">
      {/* WCAG Accessibility Skip Link */}
      <SkipLink />

      {/* Header following Akash's navbar with red period branding */}
      <Header
        activeSection={activeSection}
        onOpenAnalytics={() => {
          trackEvent('page_view', 'open_analytics_modal');
          setIsAnalyticsOpen(true);
        }}
        onDownloadResume={handlePrintResume}
        onOpenGitHubHub={() => {
          trackEvent('page_view', 'open_github_hub');
          setIsGitHubHubOpen(true);
        }}
        onOpenAskAi={() => {
          trackEvent('page_view', 'open_ask_ai_from_header');
          setIsAskAiOpen(true);
        }}
      />

      {/* Main Content Area mirroring Akash Portfolio Architecture */}
      <main id="main-content" className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onDownloadResume={handlePrintResume}
          onOpenGitHubHub={() => {
            trackEvent('page_view', 'open_github_hub_from_hero');
            setIsGitHubHubOpen(true);
          }}
          onPlayNumberGame={() => {
            trackEvent('page_view', 'open_number_game_from_hero');
            setIsNumberGameOpen(true);
          }}
        />

        {/* 2. Hello! / About Section */}
        <AboutSection />

        {/* 3. My Skillset / Technical Stack */}
        <SkillSection />

        {/* 4. My Process (01 Research, 02 Design, 03 Develop, 04 Deploy) */}
        <ProcessSection />

        {/* 5. Work that speaks for itself / Projects */}
        <ProjectShowcase
          onPlayGame={(projectId) => {
            trackEvent('page_view', `play_game_${projectId}`);
            setIsNumberGameOpen(true);
          }}
        />

        {/* 6. Competitive Programming & Coding Profiles (LeetCode @deepak5457 & GitHub) */}
        <CodingProfilesSection
          onOpenGitHubHub={() => {
            trackEvent('page_view', 'open_github_hub_from_coding');
            setIsGitHubHubOpen(true);
          }}
        />

        {/* 7. Internships & Work Experience + Beyond the Code */}
        <ExperienceSection onPrintResume={handlePrintResume} />

        {/* 8. Verified Skills & Certifications */}
        <CertificationsSection />

        {/* 9. More Than Just Code (Core Attributes) */}
        <SoftSkillsSection />

        {/* 10. Interactive ATS Resume Builder & Printable PDF */}
        <ResumeSection onPrintResume={handlePrintResume} />

        {/* 11. Let's Build Something Together / Contact Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onDownloadResume={handlePrintResume}
      />

      {/* Floating Ask Deepak AI Button matching Akash's floating prompt */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => {
            trackEvent('page_view', 'open_floating_ask_ai');
            setIsAskAiOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#ff2a2a] hover:bg-[#e40014] text-white font-bold text-xs shadow-[0_0_30px_rgba(255,42,42,0.45)] hover:shadow-[0_0_40px_rgba(255,42,42,0.6)] hover:scale-105 transition-all cursor-pointer"
          title="Open Ask Deepak AI"
          aria-label="Open Ask Deepak AI Assistant"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Deepak AI</span>
        </button>
      </div>

      {/* Ask Deepak AI Drawer */}
      <AskMeAiDrawer
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
      />

      {/* Live Visitor Engagement Telemetry Dashboard */}
      <AnalyticsDashboard
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* GitHub Developer Hub & Repository Terminal */}
      <GitHubHubModal
        isOpen={isGitHubHubOpen}
        onClose={() => setIsGitHubHubOpen(false)}
      />

      {/* Interactive Number Guessing Game Modal */}
      <NumberGuessingGameModal
        isOpen={isNumberGameOpen}
        onClose={() => setIsNumberGameOpen(false)}
      />
    </div>
  );
}
