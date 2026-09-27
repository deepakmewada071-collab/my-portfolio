import React, { useState, useEffect } from 'react';
import {
  EXPERIENCES as INITIAL_EXPERIENCES,
  SKILL_GROUPS as INITIAL_SKILL_GROUPS,
  EDUCATION as INITIAL_EDUCATION,
  CERTIFICATIONS as INITIAL_CERTIFICATIONS,
  PERSONAL_INFO,
} from '../data/portfolioData';
import { ExperienceItem, SkillGroup, EducationItem, CertificationItem } from '../types/portfolio';
import { trackEvent } from '../utils/analytics';
import { AddResumeItemModal } from './AddResumeItemModal';
import {
  Download,
  Printer,
  FileCode,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle,
  CheckCircle2,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Code2,
  FileText,
} from 'lucide-react';

interface ResumeSectionProps {
  onPrintResume: () => void;
}

const STORAGE_KEYS = {
  EXPERIENCE: 'deepak_portfolio_custom_experience_v9',
  SKILLS: 'deepak_portfolio_custom_skills_v9',
  EDUCATION: 'deepak_portfolio_custom_education_v9',
  CERTS: 'deepak_portfolio_custom_certs_v9',
};

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onPrintResume }) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'certifications' | 'education' | 'full'>('experience');
  const [copiedText, setCopiedText] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dynamic state loaded from localStorage or initialized with defaults
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
      return stored ? JSON.parse(stored) : INITIAL_EXPERIENCES;
    } catch {
      return INITIAL_EXPERIENCES;
    }
  });

  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return stored ? JSON.parse(stored) : INITIAL_SKILL_GROUPS;
    } catch {
      return INITIAL_SKILL_GROUPS;
    }
  });

  const [education, setEducation] = useState<EducationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EDUCATION);
      return stored ? JSON.parse(stored) : INITIAL_EDUCATION;
    } catch {
      return INITIAL_EDUCATION;
    }
  });

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CERTS);
      return stored ? JSON.parse(stored) : INITIAL_CERTIFICATIONS;
    } catch {
      return INITIAL_CERTIFICATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(experiences));
    } catch (e) {
      console.warn(e);
    }
  }, [experiences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skillGroups));
    } catch (e) {
      console.warn(e);
    }
  }, [skillGroups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
    } catch (e) {
      console.warn(e);
    }
  }, [education]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certifications));
    } catch (e) {
      console.warn(e);
    }
  }, [certifications]);

  const handleAddExperience = (item: ExperienceItem) => {
    setExperiences([item, ...experiences]);
    trackEvent('resume_view', 'add_experience_item', { role: item.role, company: item.company });
  };

  const handleAddSkill = (category: string, skillName: string, level: number, experience: string) => {
    setSkillGroups((prev) => {
      const existingGroupIndex = prev.findIndex((g) => g.category.toLowerCase() === category.toLowerCase());
      if (existingGroupIndex >= 0) {
        const updated = [...prev];
        updated[existingGroupIndex] = {
          ...updated[existingGroupIndex],
          skills: [...updated[existingGroupIndex].skills, { name: skillName, level, experience }],
        };
        return updated;
      } else {
        return [...prev, { category, skills: [{ name: skillName, level, experience }] }];
      }
    });
    trackEvent('resume_view', 'add_skill_item', { skill: skillName, category });
  };

  const handleAddCertification = (item: CertificationItem) => {
    setCertifications([item, ...certifications]);
    trackEvent('resume_view', 'add_certification_item', { name: item.name });
  };

  const handleAddEducation = (item: EducationItem) => {
    setEducation([item, ...education]);
    trackEvent('resume_view', 'add_education_item', { degree: item.degree });
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset resume to original production defaults?')) {
      setExperiences(INITIAL_EXPERIENCES);
      setSkillGroups(INITIAL_SKILL_GROUPS);
      setEducation(INITIAL_EDUCATION);
      setCertifications(INITIAL_CERTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.EXPERIENCE);
      localStorage.removeItem(STORAGE_KEYS.SKILLS);
      localStorage.removeItem(STORAGE_KEYS.EDUCATION);
      localStorage.removeItem(STORAGE_KEYS.CERTS);
    }
  };

  const handleDownloadJSON = () => {
    trackEvent('resume_download', 'json_format');
    const resumeData = {
      basics: {
        name: PERSONAL_INFO.name,
        label: PERSONAL_INFO.role,
        phone: PERSONAL_INFO.phone,
        email: PERSONAL_INFO.email,
        github: PERSONAL_INFO.social.github,
        githubId: PERSONAL_INFO.githubId,
        linkedin: PERSONAL_INFO.social.linkedin,
        linkedinId: PERSONAL_INFO.linkedinId,
        leetcode: PERSONAL_INFO.social.leetcode,
        leetcodeId: PERSONAL_INFO.leetcodeId,
        summary: PERSONAL_INFO.bio,
        location: PERSONAL_INFO.location,
      },
      work: experiences.map((exp) => ({
        name: exp.company,
        position: exp.role,
        startDate: exp.period.split('–')[0].trim(),
        endDate: exp.period.split('–')[1]?.trim() || 'Present',
        summary: exp.description,
        highlights: exp.achievements,
        technologies: exp.technologies,
      })),
      skills: skillGroups.map((group) => ({
        name: group.category,
        keywords: group.skills.map((s) => s.name),
      })),
      education: education.map((edu) => ({
        institution: edu.institution,
        area: edu.degree,
        studyType: 'Bachelor / Master',
        startDate: edu.period.split('–')[0]?.trim() || '',
        endDate: edu.period.split('–')[1]?.trim() || '',
        honors: edu.honors,
        highlights: edu.highlights,
      })),
      certificates: certifications.map((cert) => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.year,
        credentialId: cert.credentialId,
        skills: cert.skills,
        category: cert.category,
      })),
    };

    const blob = new Blob([JSON.stringify(resumeData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Deepak_Mewada_Resume.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPlainText = () => {
    trackEvent('resume_view', 'copy_plain_text');
    const plain = `DEEPAK MEWADA
Phone: ${PERSONAL_INFO.phone}
Email: ${PERSONAL_INFO.email}
GitHub: ${PERSONAL_INFO.social.github} (ID: ${PERSONAL_INFO.githubId})
LinkedIn: ${PERSONAL_INFO.social.linkedin} (ID: ${PERSONAL_INFO.linkedinId})
LeetCode: ${PERSONAL_INFO.social.leetcode} (ID: ${PERSONAL_INFO.leetcodeId})
Location: ${PERSONAL_INFO.location}

CAREER OBJECTIVE
${PERSONAL_INFO.bio}

EDUCATION
${education.map((ed) => `${ed.degree} | ${ed.institution} (${ed.period}) - ${ed.honors}\n${ed.highlights ? ed.highlights.map(h => `• ${h}`).join('\n') : ''}`).join('\n\n')}

TECHNICAL SKILLS
${skillGroups.map((g) => `${g.category}: ${g.skills.map((s) => s.name).join(', ')}`).join('\n')}

CERTIFICATIONS & CREDENTIALS
${certifications.map((c) => `• ${c.name} — ${c.issuer} (${c.year})${c.credentialId ? ` [ID: ${c.credentialId}]` : ''}${c.skills && c.skills.length > 0 ? `\n  Skills: ${c.skills.join(', ')}` : ''}`).join('\n\n')}

PROJECTS & EXPERIENCE
${experiences.map(
  (e) => `
${e.role.toUpperCase()} | ${e.company}
${e.period} · ${e.location}
${e.description}
Key Achievements:
${e.achievements.map((a) => `• ${a}`).join('\n')}
Technologies: ${e.technologies.join(', ')}`
).join('\n\n')}
`;

    navigator.clipboard.writeText(plain);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <section id="experience" className="py-20 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase font-mono">
              Qualifications & Career
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Experience & Professional Resume
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl">
              Academic background, real-world development projects, competitive hackathons, technical skills, and active leadership initiatives.
            </p>
          </div>

          {/* Download, Add & Print Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Action: Add to Resume */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              title="Add a new work experience, technical skill, certification, or degree"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add to Resume</span>
            </button>

            <button
              type="button"
              onClick={onPrintResume}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm shadow-blue-900/30 cursor-pointer"
              title="Print or Save as Clean PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
              title="Download standard JSON Schema Resume"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPlainText}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
              title="Copy ATS Plain Text format to clipboard"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-blue-400" />
                  <span>Copy ATS</span>
                </>
              )}
            </button>

            {/* Quick reset to original state */}
            {(experiences.length !== INITIAL_EXPERIENCES.length ||
              education.length !== INITIAL_EDUCATION.length ||
              certifications.length !== INITIAL_CERTIFICATIONS.length) && (
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="p-2.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
                title="Reset resume back to default data"
                aria-label="Reset resume to defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Section View Tabs & Add Shortcut Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-slate-800/80 pb-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('experience');
                trackEvent('filter_change', 'resume_tab_experience');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'experience'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Experience ({experiences.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('skills');
                trackEvent('filter_change', 'resume_tab_skills');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Skills ({skillGroups.reduce((acc, g) => acc + g.skills.length, 0)})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('certifications');
                trackEvent('filter_change', 'resume_tab_certifications');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'certifications'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certifications ({certifications.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('education');
                trackEvent('filter_change', 'resume_tab_education');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'education'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education ({education.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('full');
                trackEvent('filter_change', 'resume_tab_full_document');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'full'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full ATS Resume View</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Interactive & printable in sync</span>
          </div>
        </div>

        {/* Tab 1: Work History */}
        {activeTab === 'experience' && (
          <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800/80">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-10 group">
                {/* Timeline Dot */}
                <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#0b0f17] border-2 border-blue-500 group-hover:scale-125 transition-transform" />

                <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-6 sm:p-7 space-y-4 shadow-lg shadow-black/20">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                        <span>{exp.role}</span>
                        {exp.id.startsWith('custom-') && (
                          <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded">
                            New Addition
                          </span>
                        )}
                      </h3>
                      <div className="text-sm font-medium text-blue-400">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      <span>{exp.period}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
                      Key Quantified Contributions
                    </div>
                    <ul className="space-y-1.5">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clean unboxed technologies with '·' separator */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 font-mono">
                    <span className="text-slate-500">Stack:</span>
                    {exp.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="text-slate-300">{tech}</span>
                        {idx < exp.technologies.length - 1 && (
                          <span aria-hidden="true" className="text-slate-600">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Skills Matrix */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillGroups.map((group) => (
              <div
                key={group.category}
                className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-6 space-y-4"
              >
                <h3 className="text-base font-bold text-white font-display flex items-center justify-between border-b border-slate-800 pb-3">
                  <span>{group.category}</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">
                    {group.skills.length} proficiencies
                  </span>
                </h3>

                <div className="space-y-3.5">
                  {group.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-200 font-medium">{skill.name}</span>
                        <span className="text-slate-400 tabular-nums">
                          {skill.experience} · {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Certifications Showcase */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0e1422] border border-slate-800 rounded-xl">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white font-display">
                    Industry & Technical Certifications
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Accredited technical credentials in C, C++, Python, Hackathon Innovation, and Artificial Intelligence & Machine Learning (AIML).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full">
                  {certifications.length} Verified Credentials
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Cert</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e1422] border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 space-y-3 transition-all flex flex-col justify-between shadow-lg shadow-black/10"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white leading-snug">{cert.name}</h4>
                      <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <div className="text-xs text-blue-400 font-medium">
                      {cert.issuer}
                    </div>

                    <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span>Issued: {cert.year}</span>
                      {cert.credentialId && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-300">ID: {cert.credentialId}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        Verified Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Education Showcase */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0e1422] border border-slate-800 rounded-xl">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white font-display">
                    Academic Background & Education
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Computer Science & Engineering specialization in Artificial Intelligence & Machine Learning (AIML).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-blue-400 bg-blue-950/80 border border-blue-800/80 px-3 py-1 rounded-full">
                  5th Semester Active
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-6 sm:p-7 space-y-4 shadow-lg shadow-black/10 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white">{edu.degree}</h4>
                      <div className="text-sm text-blue-400 font-medium">{edu.institution}</div>
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span className="text-slate-300 font-bold">{edu.period}</span>
                      {edu.honors && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-emerald-400 font-medium">{edu.honors}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {edu.highlights && edu.highlights.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Key Academic Highlights & Coursework
                      </div>
                      <ul className="space-y-1.5">
                        {edu.highlights.map((h, i) => (
                          <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-blue-400 font-bold">›</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Complete ATS Resume Document View */}
        {activeTab === 'full' && (
          <div className="bg-[#0a0f18] border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">
            {/* Document Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Full Formatted ATS Resume Document
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrintResume}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyPlainText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy Plain ATS'}</span>
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-8 font-sans">
              {/* Header Info */}
              <div className="border-b border-slate-800 pb-6 space-y-2">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{PERSONAL_INFO.name}</h3>
                <div className="text-sm text-blue-400 font-semibold">{PERSONAL_INFO.role}</div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 font-mono pt-1">
                  <span><strong>Phone:</strong> {PERSONAL_INFO.phone}</span>
                  <span><strong>Email:</strong> {PERSONAL_INFO.email}</span>
                  <span><strong>GitHub:</strong> {PERSONAL_INFO.social.github} (@{PERSONAL_INFO.githubId})</span>
                  <span><strong>LinkedIn:</strong> {PERSONAL_INFO.social.linkedin}</span>
                  <span><strong>LeetCode:</strong> {PERSONAL_INFO.social.leetcode} (@{PERSONAL_INFO.leetcodeId})</span>
                  <span><strong>Location:</strong> {PERSONAL_INFO.location}</span>
                </div>
              </div>

              {/* 1. Career Objective */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1">
                  Career Objective
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {PERSONAL_INFO.bio}
                </p>
              </div>

              {/* 2. Technical Skills Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1">
                  Technical Skills & Competencies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {skillGroups.map((g) => (
                    <div key={g.category} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      <strong className="text-blue-400 block mb-1 font-mono">{g.category}:</strong>
                      <span className="text-slate-300 leading-relaxed">
                        {g.skills.map((s) => `${s.name} (${s.experience})`).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Professional Experience & Projects */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1">
                  Experience & Engineering Projects
                </h4>
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                        <div className="font-bold text-white text-sm">
                          {exp.role} — <span className="text-blue-400 font-semibold">{exp.company}</span>
                        </div>
                        <div className="font-mono text-slate-400">{exp.period} · {exp.location}</div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                      <ul className="space-y-1 pl-4 list-disc text-xs text-slate-300">
                        {exp.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                      <div className="text-[11px] font-mono text-slate-400 pt-1">
                        <strong>Technologies:</strong> {exp.technologies.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Education */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1">
                  Education & Academic Qualifications
                </h4>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-white text-sm">
                        <span>{edu.degree} — {edu.institution}</span>
                        <span className="font-mono text-slate-400 text-xs">{edu.period}</span>
                      </div>
                      <div className="text-emerald-400 font-medium">{edu.honors}</div>
                      {edu.highlights && edu.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 pt-1">
                          {edu.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Certifications & Credentials */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1">
                  Certifications & Verified Credentials ({certifications.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/40 rounded border border-slate-800/80">
                      <div className="font-semibold text-white">{cert.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        {cert.issuer} ({cert.year}){cert.credentialId ? ` · ID: ${cert.credentialId}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Clean Printable Resume Template (Targeted by @media print) */}
      <div id="resume-printable" className="hidden print-only max-w-4xl mx-auto p-8 font-sans bg-white text-black">
        <div className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{PERSONAL_INFO.name}</h1>
          <p className="text-base font-semibold text-gray-800">{PERSONAL_INFO.role}</p>
          <div className="text-xs text-gray-700 mt-2 flex flex-wrap gap-x-6 gap-y-1">
            <span><strong>Phone:</strong> {PERSONAL_INFO.phone}</span>
            <span><strong>Email:</strong> {PERSONAL_INFO.email}</span>
            <span><strong>GitHub:</strong> {PERSONAL_INFO.social.github} (ID: {PERSONAL_INFO.githubId})</span>
            <span><strong>LinkedIn:</strong> {PERSONAL_INFO.social.linkedin} (ID: {PERSONAL_INFO.linkedinId})</span>
            <span><strong>LeetCode:</strong> {PERSONAL_INFO.social.leetcode} (ID: {PERSONAL_INFO.leetcodeId})</span>
            <span><strong>Location:</strong> {PERSONAL_INFO.location}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Career Objective
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">{PERSONAL_INFO.bio}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="text-xs text-gray-700 space-y-2">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-black">
                  <span>{edu.degree} — {edu.institution}</span>
                  <span>{edu.period}</span>
                </div>
                <div className="text-gray-600 font-medium">{edu.honors}</div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 mt-0.5 space-y-0.5">
                    {edu.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Technical Skills & Strengths
          </h2>
          <div className="text-xs text-gray-700 space-y-1">
            {skillGroups.map((g) => (
              <div key={g.category}>
                <strong>{g.category}:</strong> {g.skills.map((s) => s.name).join(', ')}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Certifications & Credentials ({certifications.length})
          </h2>
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
            {certifications.map((cert, i) => (
              <li key={i}>
                <strong>{cert.name}</strong> — {cert.issuer} ({cert.year})
                {cert.credentialId && <span className="text-gray-500 ml-1">· ID: {cert.credentialId}</span>}
                {cert.skills && cert.skills.length > 0 && (
                  <span className="text-gray-600 block pl-4 italic">Skills: {cert.skills.join(', ')}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Projects, Hackathons & Extracurricular Activities
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between text-xs font-bold text-black">
                <span>{exp.role} — {exp.company}</span>
                <span>{exp.period}</span>
              </div>
              <div className="text-xs italic text-gray-600 mb-0.5">{exp.location}</div>
              <p className="text-xs text-gray-700 mb-1">{exp.description}</p>
              <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                {exp.achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="text-[11px] text-gray-600 mt-1">
                  <strong>Technologies / Skills:</strong> {exp.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal: Add Item to Resume */}
      <AddResumeItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExperience={handleAddExperience}
        onAddSkill={handleAddSkill}
        onAddCertification={handleAddCertification}
        onAddEducation={handleAddEducation}
        existingCategories={skillGroups.map((g) => g.category)}
      />
    </section>
  );
};

