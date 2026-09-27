import { AnalyticsEvent, AnalyticsSummary } from '../types/portfolio';

const STORAGE_KEY = 'deepak_portfolio_analytics_v1';
const SESSION_KEY = 'deepak_portfolio_session_v1';

type Listener = (summary: AnalyticsSummary) => void;
const listeners: Set<Listener> = new Set();

function initStorage(): AnalyticsSummary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pageViews: parsed.pageViews || 0,
        uniqueSessions: parsed.uniqueSessions || 0,
        resumeDownloads: parsed.resumeDownloads || 0,
        contactInquiries: parsed.contactInquiries || 0,
        projectViews: parsed.projectViews || {},
        blogReads: parsed.blogReads || {},
        totalDwellSeconds: parsed.totalDwellSeconds || 0,
        recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
      };
    }
  } catch (e) {
    console.warn('Analytics storage load error', e);
  }

  return {
    pageViews: 0,
    uniqueSessions: 0,
    resumeDownloads: 0,
    contactInquiries: 0,
    projectViews: {},
    blogReads: {},
    totalDwellSeconds: 0,
    recentEvents: [],
  };
}

let state: AnalyticsSummary = initStorage();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    listeners.forEach((listener) => {
      try {
        listener({ ...state });
      } catch (err) {
        console.error(err);
      }
    });
  } catch (e) {
    console.warn('Analytics storage save error', e);
  }
}

export function subscribeAnalytics(fn: Listener) {
  listeners.add(fn);
  fn({ ...state });
  return () => {
    listeners.delete(fn);
  };
}

export function getAnalyticsSummary(): AnalyticsSummary {
  return { ...state };
}

export function trackEvent(
  type: AnalyticsEvent['type'],
  target?: string,
  details?: Record<string, string | number>
) {
  const event: AnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    type,
    target,
    details,
  };

  // Update aggregations
  if (type === 'page_view') {
    state.pageViews += 1;
  } else if (type === 'resume_download') {
    state.resumeDownloads += 1;
  } else if (type === 'contact_submit') {
    state.contactInquiries += 1;
  } else if (type === 'project_click' && target) {
    state.projectViews[target] = (state.projectViews[target] || 0) + 1;
  } else if (type === 'blog_read' && target) {
    state.blogReads[target] = (state.blogReads[target] || 0) + 1;
  }

  // Keep last 40 events
  state.recentEvents = [event, ...state.recentEvents].slice(0, 40);
  saveState();
}

export function trackDwellIncrement(seconds: number) {
  state.totalDwellSeconds += seconds;
  saveState();
}

export function resetAnalytics() {
  state = {
    pageViews: 1,
    uniqueSessions: 1,
    resumeDownloads: 0,
    contactInquiries: 0,
    projectViews: {},
    blogReads: {},
    totalDwellSeconds: 0,
    recentEvents: [
      {
        id: `${Date.now()}-reset`,
        timestamp: Date.now(),
        type: 'page_view',
        target: 'session_reset',
        details: { note: 'Analytics counters cleared by user' }
      }
    ],
  };
  saveState();
}

export function exportAnalyticsJson(): string {
  return JSON.stringify(state, null, 2);
}

// Session initialization
export function initializeSessionTracker() {
  if (typeof window === 'undefined') return;

  const hasSession = sessionStorage.getItem(SESSION_KEY);
  if (!hasSession) {
    sessionStorage.setItem(SESSION_KEY, 'active');
    state.uniqueSessions += 1;
  }

  trackEvent('page_view', 'home', {
    referrer: document.referrer || 'direct',
    screenWidth: window.innerWidth,
    language: navigator.language,
  });

  // Track active dwell time every 5 seconds if document is visible
  let dwellTimer: number | null = null;
  const startDwellTimer = () => {
    if (dwellTimer) clearInterval(dwellTimer);
    dwellTimer = window.setInterval(() => {
      if (!document.hidden) {
        trackDwellIncrement(5);
      }
    }, 5000);
  };

  startDwellTimer();

  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (dwellTimer) clearInterval(dwellTimer);
    } else {
      startDwellTimer();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    if (dwellTimer) clearInterval(dwellTimer);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
