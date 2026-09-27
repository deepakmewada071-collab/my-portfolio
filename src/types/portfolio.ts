export interface Project {
  id: string;
  title: string;
  category: 'cloud' | 'fullstack' | 'ai' | 'oss' | 'game';
  categoryLabel: string;
  summary: string;
  detailedDescription: string;
  problem: string;
  solution: string;
  impactMetrics: string[];
  techStack: string[];
  year: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  architectureHighlights: string[];
  themeColor: string; // Tailwind color accent
  isPlayable?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  content: string[];
  featured?: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  honors: string;
  highlights: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  skills?: string[];
  category?: 'programming' | 'hackathon' | 'web' | 'aiml' | 'leadership';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level: number; experience: string }[];
}

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: 'page_view' | 'project_click' | 'case_study_open' | 'resume_download' | 'resume_view' | 'blog_read' | 'contact_submit' | 'filter_change' | 'game_action';
  target?: string;
  details?: Record<string, string | number>;
}

export interface AnalyticsSummary {
  pageViews: number;
  uniqueSessions: number;
  resumeDownloads: number;
  contactInquiries: number;
  projectViews: Record<string, number>;
  blogReads: Record<string, number>;
  totalDwellSeconds: number;
  recentEvents: AnalyticsEvent[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
  cloneUrl: string;
  updatedAt: string;
  topics: string[];
}
