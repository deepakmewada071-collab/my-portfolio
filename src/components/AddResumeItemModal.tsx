import React, { useState } from 'react';
import {
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  X,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { ExperienceItem, CertificationItem, EducationItem } from '../types/portfolio';

export interface AddResumeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExperience: (item: ExperienceItem) => void;
  onAddSkill: (category: string, skillName: string, level: number, experience: string) => void;
  onAddCertification: (item: CertificationItem) => void;
  onAddEducation: (item: EducationItem) => void;
  existingCategories: string[];
}

export const AddResumeItemModal: React.FC<AddResumeItemModalProps> = ({
  isOpen,
  onClose,
  onAddExperience,
  onAddSkill,
  onAddCertification,
  onAddEducation,
  existingCategories,
}) => {
  const [activeType, setActiveType] = useState<'experience' | 'skill' | 'certification' | 'education'>('experience');

  // Experience state
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('Remote');
  const [expPeriod, setExpPeriod] = useState('2024 – Present');
  const [expType, setExpType] = useState('Full-Time');
  const [expDescription, setExpDescription] = useState('');
  const [expAchievements, setExpAchievements] = useState<string[]>(['']);
  const [expTech, setExpTech] = useState('');

  // Skill state
  const [skillCategory, setSkillCategory] = useState(existingCategories[0] || 'Core Languages');
  const [customCategory, setCustomCategory] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(90);
  const [skillExperience, setSkillExperience] = useState('4 yrs');

  // Certification state
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('2025');

  // Education state
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduPeriod, setEduPeriod] = useState('2018 – 2022');
  const [eduHonors, setEduHonors] = useState('');
  const [eduHighlight, setEduHighlight] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAchievementChange = (index: number, val: string) => {
    const copy = [...expAchievements];
    copy[index] = val;
    setExpAchievements(copy);
  };

  const addAchievementField = () => {
    setExpAchievements([...expAchievements, '']);
  };

  const removeAchievementField = (index: number) => {
    if (expAchievements.length > 1) {
      setExpAchievements(expAchievements.filter((_, i) => i !== index));
    }
  };

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expCompany.trim()) return;

    const achievementsFiltered = expAchievements
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const techArray = expTech
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newExp: ExperienceItem = {
      id: `custom-exp-${Date.now()}`,
      role: expRole.trim(),
      company: expCompany.trim(),
      location: expLocation.trim(),
      period: expPeriod.trim(),
      type: expType.trim(),
      description: expDescription.trim() || `Contributed as ${expRole} at ${expCompany}.`,
      achievements:
        achievementsFiltered.length > 0
          ? achievementsFiltered
          : ['Led core architecture and platform deliverables.'],
      technologies: techArray.length > 0 ? techArray : ['TypeScript', 'Cloud Systems'],
    };

    onAddExperience(newExp);
    setNotification('Experience successfully added to resume!');
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const cat = skillCategory === '__custom__' ? (customCategory.trim() || 'Additional Skills') : skillCategory;
    onAddSkill(cat, skillName.trim(), Number(skillLevel), skillExperience.trim() || '3 yrs');

    setNotification(`Skill "${skillName}" added to ${cat}!`);
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) return;

    onAddCertification({
      name: certName.trim(),
      issuer: certIssuer.trim(),
      year: certYear.trim() || new Date().getFullYear().toString(),
    });

    setNotification(`Certification "${certName}" added!`);
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  const handleEduSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduDegree.trim() || !eduInstitution.trim()) return;

    onAddEducation({
      degree: eduDegree.trim(),
      institution: eduInstitution.trim(),
      period: eduPeriod.trim(),
      honors: eduHonors.trim(),
      highlights: eduHighlight.trim() ? [eduHighlight.trim()] : [],
    });

    setNotification(`Education credential added!`);
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-resume-title"
    >
      <div className="bg-[#0b101c] border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider mb-1">
              Resume Editor
            </div>
            <h3 id="add-resume-title" className="text-xl sm:text-2xl font-bold text-white font-display">
              Add Item to Resume
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Custom additions are instantly reflected across the interactive tabs, ATS text export, JSON schema, and printable PDF.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close add resume dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification pill */}
        {notification && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Type Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveType('experience')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeType === 'experience'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('skill')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeType === 'skill'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skill</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('certification')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeType === 'certification'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('education')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeType === 'education'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education</span>
          </button>
        </div>

        {/* Form: Experience */}
        {activeType === 'experience' && (
          <form onSubmit={handleExperienceSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Job Title / Role *</label>
                <input
                  type="text"
                  required
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  placeholder="e.g. Lead Cloud Architect"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Company Name *</label>
                <input
                  type="text"
                  required
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google, or Scale AI"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Employment Period</label>
                <input
                  type="text"
                  value={expPeriod}
                  onChange={(e) => setExpPeriod(e.target.value)}
                  placeholder="2023 – Present"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Location</label>
                <input
                  type="text"
                  value={expLocation}
                  onChange={(e) => setExpLocation(e.target.value)}
                  placeholder="San Francisco, CA / Remote"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Type</label>
                <select
                  value={expType}
                  onChange={(e) => setExpType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Contract / Fractional">Contract / Fractional</option>
                  <option value="Advisory">Advisory</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Role Overview / Summary</label>
              <textarea
                rows={2}
                value={expDescription}
                onChange={(e) => setExpDescription(e.target.value)}
                placeholder="Brief summary of domain responsibilities, system scope, and team size..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Key Achievements Bullet points */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Key Quantified Achievements</label>
                <button
                  type="button"
                  onClick={addAchievementField}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px] font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Achievement Bullet</span>
                </button>
              </div>

              {expAchievements.map((ach, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-[11px]">{idx + 1}.</span>
                  <input
                    type="text"
                    value={ach}
                    onChange={(e) => handleAchievementChange(idx, e.target.value)}
                    placeholder="e.g. Optimized database query latency by 64% using partitioned indices..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  {expAchievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAchievementField(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Technologies (Comma separated)</label>
              <input
                type="text"
                value={expTech}
                onChange={(e) => setExpTech(e.target.value)}
                placeholder="e.g. Go, Kubernetes, Kafka, React 19, TypeScript, AWS"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                Save Experience
              </button>
            </div>
          </form>
        )}

        {/* Form: Skill */}
        {activeType === 'skill' && (
          <form onSubmit={handleSkillSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Skill Group / Category</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {existingCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__custom__">+ Create New Category</option>
                </select>
              </div>

              {skillCategory === '__custom__' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">New Category Name</label>
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. AI / Machine Learning Ops"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-slate-300 font-medium">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Rust, GraphQL, or Terraform"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-slate-300 font-medium">Years of Experience</label>
                <input
                  type="text"
                  value={skillExperience}
                  onChange={(e) => setSkillExperience(e.target.value)}
                  placeholder="e.g. 5 yrs"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-slate-300 font-medium">Proficiency ({skillLevel}%)</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="2"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(Number(e.target.value))}
                  className="w-full mt-2 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </form>
        )}

        {/* Form: Certification */}
        {activeType === 'certification' && (
          <form onSubmit={handleCertSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Certification Title *</label>
              <input
                type="text"
                required
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="e.g. Google Cloud Professional Cloud Architect"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Google Cloud / Linux Foundation"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Year Issued</label>
                <input
                  type="text"
                  value={certYear}
                  onChange={(e) => setCertYear(e.target.value)}
                  placeholder="e.g. 2025"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                Add Certification
              </button>
            </div>
          </form>
        )}

        {/* Form: Education */}
        {activeType === 'education' && (
          <form onSubmit={handleEduSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Degree & Major *</label>
              <input
                type="text"
                required
                value={eduDegree}
                onChange={(e) => setEduDegree(e.target.value)}
                placeholder="e.g. Master of Science in Distributed Computer Systems"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={eduInstitution}
                  onChange={(e) => setEduInstitution(e.target.value)}
                  placeholder="e.g. University of California, Berkeley"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Graduation / Study Period</label>
                <input
                  type="text"
                  value={eduPeriod}
                  onChange={(e) => setEduPeriod(e.target.value)}
                  placeholder="e.g. 2018 – 2020"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Honors or Distinction</label>
              <input
                type="text"
                value={eduHonors}
                onChange={(e) => setEduHonors(e.target.value)}
                placeholder="e.g. Magna Cum Laude / Dean's Honors List"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Key Coursework / Focus Highlight</label>
              <input
                type="text"
                value={eduHighlight}
                onChange={(e) => setEduHighlight(e.target.value)}
                placeholder="e.g. Thesis in Byzantine Fault Tolerance & Raft Consensus protocols"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                Add Education
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
