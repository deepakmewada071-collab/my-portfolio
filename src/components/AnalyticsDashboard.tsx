import React, { useEffect, useState } from 'react';
import { AnalyticsSummary } from '../types/portfolio';
import {
  subscribeAnalytics,
  resetAnalytics,
  exportAnalyticsJson,
  trackEvent,
} from '../utils/analytics';
import {
  BarChart3,
  X,
  Users,
  Eye,
  Clock,
  Download,
  Mail,
  Activity,
  Trash2,
  FileDown,
  CheckCircle,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAnalytics((updated) => {
      setSummary(updated);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !summary) return null;

  const dwellMinutes = Math.floor(summary.totalDwellSeconds / 60);
  const dwellSeconds = summary.totalDwellSeconds % 60;

  const handleExport = () => {
    const jsonStr = exportAnalyticsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-engagement-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleSimulateAction = () => {
    trackEvent('project_click', 'Streamline Distributed Event Hub', {
      simulated: 'true',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-modal-title"
    >
      <div className="bg-[#0b101c] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Privacy-First Client Telemetry</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Real-Time Stream Active</span>
                </span>
              </div>
              <h3 id="analytics-modal-title" className="text-xl sm:text-2xl font-bold text-white font-display">
                Visitor Engagement & Performance Metrics
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close analytics modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Metric Cards (Tabular numerals font-mono) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-[#0e1422] p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Page Views</span>
              <Eye className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {summary.pageViews}
            </div>
            <div className="text-[10px] text-slate-500">Total sessions tracked</div>
          </div>

          <div className="bg-[#0e1422] p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Unique Visitors</span>
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {summary.uniqueSessions}
            </div>
            <div className="text-[10px] text-slate-500">Origin sessions</div>
          </div>

          <div className="bg-[#0e1422] p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Dwell</span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {dwellMinutes}m {dwellSeconds}s
            </div>
            <div className="text-[10px] text-slate-500">Unblurred reading time</div>
          </div>

          <div className="bg-[#0e1422] p-4 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Resume Downloads</span>
              <Download className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {summary.resumeDownloads}
            </div>
            <div className="text-[10px] text-slate-500">PDF & JSON exports</div>
          </div>

          <div className="bg-[#0e1422] p-4 rounded-xl border border-slate-800/80 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Inquiries</span>
              <Mail className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {summary.contactInquiries}
            </div>
            <div className="text-[10px] text-slate-500">Contact form leads</div>
          </div>
        </div>

        {/* Breakdown: Project Views & Blog Engagement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Views */}
          <div className="bg-[#0e1422] p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
              <span>Most Explored Projects</span>
              <span className="text-slate-500 font-normal">Interactions</span>
            </h4>
            {Object.keys(summary.projectViews).length === 0 ? (
              <p className="text-xs text-slate-500 py-3 italic">
                Click any project card or case study to log project view telemetry.
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(summary.projectViews).map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 truncate max-w-[240px]">{name}</span>
                    <span className="text-blue-400 font-bold tabular-nums">{count} clicks</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blog Reads */}
          <div className="bg-[#0e1422] p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
              <span>Technical Article Reads</span>
              <span className="text-slate-500 font-normal">Opens</span>
            </h4>
            {Object.keys(summary.blogReads).length === 0 ? (
              <p className="text-xs text-slate-500 py-3 italic">
                Open any article to track readership engagement metrics.
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(summary.blogReads).map(([title, count]) => (
                  <div key={title} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 truncate max-w-[240px]">{title}</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{count} reads</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Event Stream Log */}
        <div className="bg-[#0e1422] p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Real-Time Event Stream Log</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-500">
              {summary.recentEvents.length} events captured
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs pr-2">
            {summary.recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-2 bg-slate-900/60 rounded border border-slate-800/60 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-semibold">{ev.type}</span>
                  {ev.target && <span className="text-slate-300">› {ev.target}</span>}
                </div>
                <span className="text-slate-500 tabular-nums">
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copiedExport ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <FileDown className="w-4 h-4" />}
              <span>Export JSON Report</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateAction}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Test Event Dispatch
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all analytics counters for this session?')) {
                  resetAnalytics();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Counters</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
