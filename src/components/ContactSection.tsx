import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';
import { ContactMessage } from '../types/portfolio';
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy, Check, Github, Linkedin, MessageSquare, AlertCircle, ExternalLink } from 'lucide-react';
import { LeetCodeIcon } from './LeetCodeIcon';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'Internship & Job Opportunity',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<ContactMessage | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);
  const [copiedGithub, setCopiedGithub] = useState(false);
  const [copiedLeetcode, setCopiedLeetcode] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please specify a subject.';
    if (!formData.message.trim() || formData.message.length < 15) {
      errs.message = 'Please provide a message with at least 15 characters.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      const newMsg: ContactMessage = {
        id: `msg-${Date.now()}`,
        ...formData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      try {
        const stored = localStorage.getItem('deepak_contact_messages');
        const msgs = stored ? JSON.parse(stored) : [];
        localStorage.setItem('deepak_contact_messages', JSON.stringify([newMsg, ...msgs]));
      } catch (err) {
        console.warn(err);
      }

      trackEvent('contact_submit', formData.type, {
        subject: formData.subject,
        emailDomain: formData.email.split('@')[1] || 'unknown',
      });

      setIsSubmitting(false);
      setSubmittedMessage(newMsg);
      setFormData({
        name: '',
        email: '',
        subject: '',
        type: 'Consulting & Architecture',
        message: '',
      });
    }, 700);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    trackEvent('page_view', 'copy_email');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#0c0c0c] border-t border-b border-white/5 relative overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info & Availability */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-bold text-[#ff2a2a] uppercase tracking-wider font-mono">
                Get in Touch
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
                Let's Build Something Together
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                Whether you're looking for an AI-integrated application, software project collaboration, or a dedicated B.Tech engineering intern, my inbox is always open.
              </p>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-white/[0.025] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">DIRECT INBOX</div>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="text-sm font-semibold text-white hover:text-blue-400 transition-colors">
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                  title="Copy email address"
                  aria-label="Copy email address to clipboard"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">PHONE / WHATSAPP</div>
                    <a href={`tel:${PERSONAL_INFO.phone}`} className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors">
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(PERSONAL_INFO.phone);
                    setCopiedPhone(true);
                    trackEvent('page_view', 'copy_phone');
                    setTimeout(() => setCopiedPhone(false), 2500);
                  }}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                  title="Copy phone number"
                  aria-label="Copy phone number to clipboard"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* LinkedIn Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">LINKEDIN PROFILE / ID</div>
                    <a
                      href={PERSONAL_INFO.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors flex items-center gap-1.5"
                    >
                      <span className="font-mono text-xs sm:text-sm">deepak-mewada-795a2932b</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(PERSONAL_INFO.social.linkedin);
                      setCopiedLinkedin(true);
                      trackEvent('page_view', 'copy_linkedin_url');
                      setTimeout(() => setCopiedLinkedin(false), 2500);
                    }}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                    title="Copy LinkedIn URL"
                    aria-label="Copy LinkedIn URL to clipboard"
                  >
                    {copiedLinkedin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={PERSONAL_INFO.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                    title="Open LinkedIn Profile in new tab"
                    aria-label="Open LinkedIn Profile in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* GitHub Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-white">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">GITHUB PROFILE / ID</div>
                    <a
                      href={PERSONAL_INFO.social.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors flex items-center gap-1.5"
                    >
                      <span className="font-mono text-xs sm:text-sm">{PERSONAL_INFO.githubId}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(PERSONAL_INFO.githubId);
                      setCopiedGithub(true);
                      trackEvent('page_view', 'copy_github_id');
                      setTimeout(() => setCopiedGithub(false), 2500);
                    }}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                    title="Copy GitHub ID"
                    aria-label="Copy GitHub ID to clipboard"
                  >
                    {copiedGithub ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={PERSONAL_INFO.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                    title="Open GitHub Profile in new tab"
                    aria-label="Open GitHub Profile in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* LeetCode Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                    <LeetCodeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">LEETCODE CODING ID</div>
                    <a
                      href={PERSONAL_INFO.social.leetcode}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5"
                    >
                      <span className="font-mono text-xs sm:text-sm">{PERSONAL_INFO.leetcodeId}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(PERSONAL_INFO.leetcodeId);
                      setCopiedLeetcode(true);
                      trackEvent('page_view', 'copy_leetcode_id');
                      setTimeout(() => setCopiedLeetcode(false), 2500);
                    }}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                    title="Copy LeetCode ID"
                    aria-label="Copy LeetCode ID to clipboard"
                  >
                    {copiedLeetcode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={PERSONAL_INFO.social.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
                    title="Open LeetCode Profile in new tab"
                    aria-label="Open LeetCode Profile in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">COLLEGE & LOCATION</div>
                  <div className="text-sm font-semibold text-white">{PERSONAL_INFO.location}</div>
                  <div className="text-[11px] text-slate-400">Bansal Institute of Science & Technology</div>
                </div>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-300 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 animate-pulse" />
              <div>
                <strong>Current Status:</strong> {PERSONAL_INFO.availability}. Typical response turnaround within 24 business hours.
              </div>
            </div>

            {/* Professional Profiles */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={PERSONAL_INFO.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/30">
              <h3 className="text-xl font-bold text-white font-display mb-1">Send a Message</h3>
              <p className="text-xs text-slate-400 mb-6">
                All submissions are securely logged and delivered directly to Deepak Mewada.
              </p>

              {submittedMessage ? (
                <div
                  className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-6 text-center space-y-4"
                  role="status"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white font-display">
                      Message Dispatched Successfully
                    </h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Thank you, <strong className="text-white">{submittedMessage.name}</strong>. Your inquiry regarding "{submittedMessage.subject}" has been received. I'll get back to you at{' '}
                      <span className="text-blue-300 underline">{submittedMessage.email}</span> shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmittedMessage(null)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-1">
                      <label htmlFor="contact-name" className="block text-xs font-mono text-slate-300 font-medium">
                        Your Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        placeholder="Alex Morgan"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          errors.name ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.name && (
                        <p id="name-error" className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="block text-xs font-mono text-slate-300 font-medium">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        placeholder="alex@company.com"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          errors.email ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Inquiry Type */}
                    <div className="space-y-1">
                      <label htmlFor="contact-type" className="block text-xs font-mono text-slate-300 font-medium">
                        Engagement Scope
                      </label>
                      <select
                        id="contact-type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="Internship & Full-Time Opportunity">Internship & Full-Time Opportunity</option>
                        <option value="Web & Software Project Collaboration">Web & Software Project Collaboration</option>
                        <option value="Hackathon Team / Tech Initiative">Hackathon Team / Tech Initiative</option>
                        <option value="Open Source & Networking">Open Source & Networking</option>
                        <option value="General Conversation">General Conversation</option>
                      </select>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-1">
                      <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-300 font-medium">
                        Subject Line <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        placeholder="e.g. Software Engineering Internship / Project Collaboration"
                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          errors.subject ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.subject && (
                        <p id="subject-error" className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.subject}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1">
                    <label htmlFor="contact-message" className="block text-xs font-mono text-slate-300 font-medium">
                      Project Details / Message <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      placeholder="Tell me about your architectural goals, current bottlenecks, team timeline, or project scope..."
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-900 border rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        errors.message ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button matching Akash's red CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-xs font-bold text-white bg-[#ff2a2a] hover:bg-[#e40014] rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,42,42,0.35)] hover:shadow-[0_0_35px_rgba(255,42,42,0.5)] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
