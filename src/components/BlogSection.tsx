import React, { useState } from 'react';
import { BlogPost } from '../types/portfolio';
import { BLOG_POSTS } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import { Search, BookOpen, Clock, Calendar, ArrowRight, X, Heart, Share2, Check } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('deepak_blog_likes');
      return stored ? JSON.parse(stored) : { 'zero-allocation-event-streams': 28, 'scaling-postgres-50k-qps': 42 };
    } catch {
      return {};
    }
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const allTags = ['all', ...Array.from(new Set(BLOG_POSTS.flatMap((p) => p.tags)))];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleOpenArticle = (post: BlogPost) => {
    setActiveArticle(post);
    trackEvent('blog_read', post.title, { articleId: post.id });
  };

  const handleLike = (articleId: string) => {
    const updated = { ...likes, [articleId]: (likes[articleId] || 0) + 1 };
    setLikes(updated);
    try {
      localStorage.setItem('deepak_blog_likes', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    trackEvent('page_view', `like_${articleId}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="blog" className="py-20 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase font-mono">
              Technical Writing & Insights
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Engineering Notes & Architecture
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl">
              In-depth essays on database scaling, memory management in high-throughput microservices, and modern frontend performance.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              aria-label="Filter articles by keyword"
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Filter tags (functional buttons with segmented control style) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto mb-10 max-w-fit">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tag === 'all' ? 'All Topics' : tag}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handleOpenArticle(post)}
              className="group bg-[#0e1422] border border-slate-800/80 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20"
            >
              <div className="space-y-3">
                {/* Clean unboxed metadata with '·' separator (anti-pill) */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="text-blue-400 font-medium">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors font-display">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
              </div>

              {/* Bottom footer: tags + read action */}
              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400 font-mono">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span>{tag}</span>
                      {idx < Math.min(post.tags.length, 3) - 1 && (
                        <span aria-hidden="true" className="text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Article Reader Modal */}
        {activeArticle && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-article-title"
          >
            <div className="bg-[#0b101c] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-10 space-y-6 my-8">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-blue-400 font-semibold">{activeArticle.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{activeArticle.date}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeArticle.readTime}</span>
                    </span>
                  </div>

                  <h3 id="modal-article-title" className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {activeArticle.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors ml-4"
                  aria-label="Close article modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {activeArticle.content.map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4
                        key={index}
                        className="text-lg font-bold text-white font-display pt-3 text-balance border-b border-slate-800/60 pb-1"
                      >
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                    return (
                      <div key={index} className="pl-4 border-l-2 border-blue-500/60 text-slate-200 font-mono text-xs sm:text-sm py-0.5">
                        {paragraph}
                      </div>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>

              {/* Reader Interactions & Footer */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLike(activeArticle.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-900/60 rounded-lg hover:bg-rose-900/60 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span className="font-mono tabular-nums">{likes[activeArticle.id] || 0} Applause</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
