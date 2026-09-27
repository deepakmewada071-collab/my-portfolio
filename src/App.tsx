import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ResumeSection } from './components/ResumeSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GitHubHubModal } from './components/GitHubHubModal';
import { NumberGuessingGameModal } from './components/NumberGuessingGameModal';
import { Footer } from './components/Footer';
import { SkipLink } from './components/SkipLink';
import { initializeSessionTracker, trackEvent } from './utils/analytics';

export default function App() {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isGitHubHubOpen, setIsGitHubHubOpen] = useState(false);
  const [isNumberGameOpen, setIsNumberGameOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('projects');

  useEffect(() => {
    // Initialize privacy-respecting session engagement tracker
    const cleanupSession = initializeSessionTracker();

    // Intersection observer to track section visibility and highlight active nav item
    const sectionIds = ['projects', 'experience', 'blog', 'contact'];
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
          { threshold: 0.25 }
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
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* WCAG Accessibility Skip Link */}
      <SkipLink />

      {/* Header following strict 3-zone contract */}
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
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
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

        {/* Selected Projects Showcase */}
        <ProjectShowcase
          onPlayGame={(projectId) => {
            trackEvent('page_view', `play_game_${projectId}`);
            setIsNumberGameOpen(true);
          }}
        />

        {/* Experience & Downloadable Resume Section */}
        <ResumeSection onPrintResume={handlePrintResume} />

        {/* Technical Blog & Insights Section */}
        <BlogSection />

        {/* Contact Form Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onDownloadResume={handlePrintResume}
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
