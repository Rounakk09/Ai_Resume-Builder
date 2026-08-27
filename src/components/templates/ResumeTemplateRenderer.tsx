import React from 'react';
import { ResumeData, TemplateType, CertificationItem } from '../../types';

interface ResumeTemplateProps {
  data: ResumeData;
  scale?: number;
}

function getFullName(data: ResumeData): string {
  if (data.personalDetails.fullName?.trim()) {
    return data.personalDetails.fullName.trim();
  }
  const combined = `${data.personalDetails.firstName || ''} ${data.personalDetails.lastName || ''}`.trim();
  return combined || 'Your Name';
}

function getCertText(cert: string | CertificationItem): { name: string; details?: string; url?: string } {
  if (typeof cert === 'string') {
    return { name: cert };
  }
  const parts = [];
  if (cert.issuer) parts.push(cert.issuer);
  if (cert.issueDate) parts.push(cert.issueDate);
  return {
    name: cert.name,
    details: parts.join(' • '),
    url: cert.credentialUrl,
  };
}

export const MinimalistTemplate: React.FC<ResumeTemplateProps> = ({ data }) => {
  const { personalDetails, summary, experience, education, skills, projects, certifications } = data;
  const fullName = getFullName(data);
  const locationOrAddress = personalDetails.address || personalDetails.location;
  const portfolioOrWeb = personalDetails.portfolio || personalDetails.website;

  return (
    <div className="w-full bg-white text-[#1E293B] p-8 md:p-10 text-[12.5px] leading-relaxed font-sans min-h-full">
      {/* Header */}
      <header className="border-b-2 border-[#1E40AF] pb-5 mb-5">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A] uppercase mb-1">
          {fullName}
        </h1>
        {personalDetails.jobTitle && (
          <div className="text-[#1E40AF] font-semibold text-base mb-2.5">
            {personalDetails.jobTitle}
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#475569]">
          {personalDetails.email && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-[#1E40AF]">Email:</span> {personalDetails.email}
            </span>
          )}
          {personalDetails.phone && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-[#1E40AF]">Phone:</span> {personalDetails.phone}
            </span>
          )}
          {locationOrAddress && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-[#1E40AF]">Location:</span> {locationOrAddress}
            </span>
          )}
          {personalDetails.linkedin && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-[#1E40AF]">LinkedIn:</span> {personalDetails.linkedin}
            </span>
          )}
          {portfolioOrWeb && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-[#1E40AF]">Portfolio:</span> {portfolioOrWeb}
            </span>
          )}
        </div>
      </header>

      {/* Body: 2 Columns */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="col-span-2 space-y-5">
          {/* Summary */}
          {summary && (
            <section>
              <h2 className="text-[#0F172A] font-bold text-xs uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs leading-relaxed text-[#334155]">
                {summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-[#0F172A] font-bold text-xs uppercase tracking-widest border-b border-gray-200 pb-1 mb-3">
                Experience
              </h2>
              <div className="space-y-3.5">
                {experience.map((item) => {
                  const durationStr = item.duration || `${item.startDate || ''}${item.startDate ? ' – ' : ''}${item.isPresent ? 'Present' : (item.endDate || '')}`;
                  return (
                    <div key={item.id} className="relative pl-3 border-l-2 border-[#E2E8F0]">
                      <div className="absolute w-2 h-2 bg-[#1E40AF] rounded-full -left-[5px] top-1.5"></div>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="font-bold text-xs text-[#0F172A]">{item.jobTitle || 'Role'}</h3>
                        <span className="text-[11px] font-semibold text-[#64748B]">
                          {durationStr}
                        </span>
                      </div>
                      <div className="text-[#1E40AF] font-medium text-xs mb-1">
                        {item.company} {item.location ? `• ${item.location}` : ''}
                      </div>
                      {item.description && (
                        <p className="text-xs text-[#334155] mb-1 leading-normal">{item.description}</p>
                      )}
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-xs text-[#334155] marker:text-[#94A3B8]">
                          {item.bullets.map((b, i) => (
                            <li key={i} className="leading-snug">{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-[#0F172A] font-bold text-xs uppercase tracking-widest border-b border-gray-200 pb-1 mb-2.5">
                Key Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex items-center justify-between font-bold text-[#0F172A]">
                      <span>{proj.title}</span>
                      {proj.githubUrl && (
                        <span className="text-[11px] text-[#1E40AF] font-normal">{proj.githubUrl}</span>
                      )}
                    </div>
                    {proj.technologies && (
                      <div className="text-[11px] text-[#1E40AF] font-semibold mt-0.5">
                        Technologies: {proj.technologies}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-[11.5px] text-[#334155] mt-1 leading-snug">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="col-span-1 space-y-5">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-[#0F172A] font-bold text-xs uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">
                Core Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-slate-100 text-[#334155] text-[11px] font-medium rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-[#0F172A] font-bold text-xs uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => {
                  const yearsStr = edu.startYear || edu.endYear 
                    ? `${edu.startYear || ''}${edu.startYear && edu.endYear ? ' – ' : ''}${edu.endYear || ''}`
                    : `${edu.startDate || ''}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate || ''}`;
                  return (
                    <div key={edu.id}>
                      <h3 className="font-bold text-xs text-[#0F172A]">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                      </h3>
                      <div className="text-[11px] text-[#64748B] font-medium">{edu.institution}</div>
                      {yearsStr && (
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">{yearsStr}</div>
                      )}
                      {edu.highlights && (
                        <p className="text-[11px] text-[#475569] mt-0.5 italic">{edu.highlights}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-[#0F172A] font-bold text-xs uppercase tracking-widest border-b border-gray-200 pb-1 mb-2">
                Certifications
              </h2>
              <div className="space-y-2 text-xs text-[#334155]">
                {certifications.map((cert, index) => {
                  const { name, details, url } = getCertText(cert);
                  return (
                    <div key={index} className="border-l border-blue-200 pl-2">
                      <div className="font-semibold text-xs text-[#0F172A]">{name}</div>
                      {details && <div className="text-[10.5px] text-[#64748B]">{details}</div>}
                      {url && <div className="text-[10px] text-[#1E40AF] truncate">{url}</div>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const ExecutiveTemplate: React.FC<ResumeTemplateProps> = ({ data }) => {
  const { personalDetails, summary, experience, education, skills, projects, certifications } = data;
  const fullName = getFullName(data);
  const locationOrAddress = personalDetails.address || personalDetails.location;
  const portfolioOrWeb = personalDetails.portfolio || personalDetails.website;

  return (
    <div className="w-full bg-[#FCFCF9] text-[#1F2421] p-8 md:p-10 text-[12.5px] leading-relaxed font-serif min-h-full border-t-4 border-[#1E3A8A]">
      {/* Header */}
      <header className="text-center pb-5 border-b border-slate-300 mb-5 font-sans">
        <h1 className="text-3xl font-bold tracking-wide uppercase text-[#0B132B]">
          {fullName}
        </h1>
        {personalDetails.jobTitle && (
          <div className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-widest mt-1">
            {personalDetails.jobTitle}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-[#4A5568] mt-2.5">
          {locationOrAddress && <span>{locationOrAddress}</span>}
          {personalDetails.email && <span>• {personalDetails.email}</span>}
          {personalDetails.phone && <span>• {personalDetails.phone}</span>}
          {personalDetails.linkedin && <span>• {personalDetails.linkedin}</span>}
          {portfolioOrWeb && <span>• {portfolioOrWeb}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0B132B] border-b border-slate-300 pb-1 mb-2 font-sans">
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-[#2D3748]">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0B132B] border-b border-slate-300 pb-1 mb-2.5 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((item) => {
              const durationStr = item.duration || `${item.startDate || ''}${item.startDate ? ' – ' : ''}${item.isPresent ? 'Present' : (item.endDate || '')}`;
              return (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-sans">
                    <span className="font-bold text-sm text-[#0B132B]">{item.company}</span>
                    <span className="text-xs text-[#4A5568] font-medium">{durationStr}</span>
                  </div>
                  <div className="text-xs italic text-[#1E3A8A] mb-1 font-sans">
                    {item.jobTitle} {item.location ? `| ${item.location}` : ''}
                  </div>
                  {item.description && (
                    <p className="text-xs text-[#2D3748] mb-1 leading-normal">{item.description}</p>
                  )}
                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-[#2D3748]">
                      {item.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0B132B] border-b border-slate-300 pb-1 mb-2.5 font-sans">
            Strategic Projects & Initiatives
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-xs text-[#0B132B]">{proj.title}</span>
                  {proj.githubUrl && <span className="text-[11px] text-[#1E3A8A]">{proj.githubUrl}</span>}
                </div>
                {proj.technologies && (
                  <div className="text-[11px] font-sans text-[#4A5568] italic">Stack: {proj.technologies}</div>
                )}
                {proj.description && (
                  <p className="text-xs text-[#2D3748] mt-0.5 leading-normal">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education, Skills, & Certifications Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0B132B] border-b border-slate-300 pb-1 mb-2 font-sans">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => {
                const yearsStr = edu.startYear || edu.endYear 
                  ? `${edu.startYear || ''}${edu.startYear && edu.endYear ? ' – ' : ''}${edu.endYear || ''}`
                  : `${edu.startDate || ''}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate || ''}`;
                return (
                  <div key={edu.id} className="text-xs">
                    <div className="font-bold text-[#0B132B] font-sans">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </div>
                    <div className="text-[#4A5568]">{edu.institution}</div>
                    {yearsStr && <div className="text-[11px] text-[#718096] font-sans">{yearsStr}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Skills & Certifications */}
        <div className="space-y-4">
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#0B132B] border-b border-slate-300 pb-1 mb-2 font-sans">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 border border-slate-300 text-[#2D3748] text-[11px] rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#0B132B] border-b border-slate-300 pb-1 mb-2 font-sans">
                Executive Credentials
              </h2>
              <div className="space-y-1.5 font-sans text-xs text-[#2D3748]">
                {certifications.map((cert, index) => {
                  const { name, details } = getCertText(cert);
                  return (
                    <div key={index}>
                      <span className="font-semibold text-[#0B132B]">• {name}</span>
                      {details && <span className="text-[11px] text-[#718096] ml-1.5">({details})</span>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const CreativeTemplate: React.FC<ResumeTemplateProps> = ({ data }) => {
  const { personalDetails, summary, experience, education, skills, projects, certifications } = data;
  const fullName = getFullName(data);
  const locationOrAddress = personalDetails.address || personalDetails.location;
  const portfolioOrWeb = personalDetails.portfolio || personalDetails.website;

  return (
    <div className="w-full bg-white text-[#1E293B] text-[12.5px] leading-relaxed flex min-h-full font-sans">
      {/* Dark Sidebar */}
      <div className="w-1/3 bg-[#1E1B4B] text-white p-6 md:p-8 flex flex-col justify-between">
        <div>
          {/* Avatar / Monogram */}
          <div className="w-14 h-14 rounded-xl bg-[#4338CA] text-white flex items-center justify-center text-xl font-bold mb-3 shadow-md">
            {personalDetails.firstName?.[0] || fullName[0] || 'G'}{(personalDetails.lastName?.[0]) || ''}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            {fullName}
          </h1>
          {personalDetails.jobTitle && (
            <div className="text-[#A5B4FC] text-xs font-medium uppercase tracking-wider mb-5">
              {personalDetails.jobTitle}
            </div>
          )}

          {/* Contact */}
          <div className="space-y-2 text-xs text-[#E0E7FF] mb-6 border-t border-indigo-800/80 pt-3">
            {personalDetails.email && (
              <div className="truncate"><span className="text-[#818CF8] font-bold">M:</span> {personalDetails.email}</div>
            )}
            {personalDetails.phone && (
              <div><span className="text-[#818CF8] font-bold">P:</span> {personalDetails.phone}</div>
            )}
            {locationOrAddress && (
              <div><span className="text-[#818CF8] font-bold">L:</span> {locationOrAddress}</div>
            )}
            {personalDetails.linkedin && (
              <div className="truncate"><span className="text-[#818CF8] font-bold">IN:</span> {personalDetails.linkedin}</div>
            )}
            {portfolioOrWeb && (
              <div className="truncate"><span className="text-[#818CF8] font-bold">W:</span> {portfolioOrWeb}</div>
            )}
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#C7D2FE] mb-2">
                Skills & Tools
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-indigo-900/60 border border-indigo-700/60 text-[#E0E7FF] text-[10px] font-medium rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#C7D2FE] mb-2">
                Education
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => {
                  const yearsStr = edu.startYear || edu.endYear 
                    ? `${edu.startYear || ''}${edu.startYear && edu.endYear ? ' – ' : ''}${edu.endYear || ''}`
                    : `${edu.startDate || ''}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate || ''}`;
                  return (
                    <div key={edu.id} className="text-xs">
                      <div className="font-semibold text-white">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                      </div>
                      <div className="text-[#A5B4FC] text-[11px]">{edu.institution}</div>
                      {yearsStr && <div className="text-[#818CF8] text-[10px]">{yearsStr}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#C7D2FE] mb-2">
                Certifications
              </h2>
              <div className="space-y-1.5 text-xs text-[#E0E7FF]">
                {certifications.map((cert, index) => {
                  const { name } = getCertText(cert);
                  return (
                    <div key={index} className="text-[11px]">
                      • {name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6 md:p-8 space-y-5">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1E1B4B] border-b-2 border-[#4F46E5] pb-1 mb-2">
              Profile Summary
            </h2>
            <p className="text-xs leading-relaxed text-[#334155]">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1E1B4B] border-b-2 border-[#4F46E5] pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((item) => {
                const durationStr = item.duration || `${item.startDate || ''}${item.startDate ? ' – ' : ''}${item.isPresent ? 'Present' : (item.endDate || '')}`;
                return (
                  <div key={item.id} className="relative pl-3 border-l-2 border-[#C7D2FE]">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-xs text-[#0F172A]">{item.jobTitle}</h3>
                      <span className="text-[10px] font-semibold bg-indigo-50 text-[#4338CA] px-2 py-0.5 rounded">
                        {durationStr}
                      </span>
                    </div>
                    <div className="text-[#4F46E5] font-semibold text-xs mb-1">
                      {item.company}
                    </div>
                    {item.description && (
                      <p className="text-xs text-[#334155] mb-1">{item.description}</p>
                    )}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-xs text-[#334155]">
                        {item.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1E1B4B] border-b-2 border-[#4F46E5] pb-1 mb-2.5">
              Projects & Portfolios
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  <div className="flex justify-between font-bold text-xs text-[#0F172A]">
                    <span>{proj.title}</span>
                    {proj.githubUrl && (
                      <span className="text-[10px] text-[#4F46E5] font-normal">{proj.githubUrl}</span>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[10.5px] text-[#4F46E5] font-medium mt-0.5">Tech: {proj.technologies}</div>
                  )}
                  {proj.description && (
                    <p className="text-xs text-[#334155] mt-1">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export const ModernTemplate: React.FC<ResumeTemplateProps> = ({ data }) => {
  const { personalDetails, summary, experience, education, skills, projects, certifications } = data;
  const fullName = getFullName(data);
  const locationOrAddress = personalDetails.address || personalDetails.location;
  const portfolioOrWeb = personalDetails.portfolio || personalDetails.website;

  return (
    <div className="w-full bg-white text-[#1E293B] p-8 md:p-10 text-[12.5px] leading-relaxed font-sans min-h-full">
      {/* Top Banner Header */}
      <header className="bg-[#0F172A] text-white p-6 rounded-lg mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
              {fullName}
            </h1>
            {personalDetails.jobTitle && (
              <div className="text-[#38BDF8] font-medium text-sm mt-0.5">
                {personalDetails.jobTitle}
              </div>
            )}
          </div>
          <div className="text-xs text-slate-300 space-y-1 text-right">
            {personalDetails.email && <div>{personalDetails.email}</div>}
            {personalDetails.phone && <div>{personalDetails.phone}</div>}
            {locationOrAddress && <div>{locationOrAddress}</div>}
            {personalDetails.linkedin && <div className="text-[#38BDF8]">{personalDetails.linkedin}</div>}
            {portfolioOrWeb && <div className="text-[#38BDF8]">{portfolioOrWeb}</div>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded mb-2">
            Summary
          </h2>
          <p className="text-xs leading-relaxed text-[#334155] px-1">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded mb-2.5">
            Experience
          </h2>
          <div className="space-y-3.5 px-1">
            {experience.map((item) => {
              const durationStr = item.duration || `${item.startDate || ''}${item.startDate ? ' – ' : ''}${item.isPresent ? 'Present' : (item.endDate || '')}`;
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-xs text-[#0F172A]">
                      {item.jobTitle} <span className="text-[#0284C7] font-semibold">@ {item.company}</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">{durationStr}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-[#334155] leading-normal">{item.description}</p>
                  )}
                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-[#334155]">
                      {item.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded mb-2.5">
            Projects
          </h2>
          <div className="grid grid-cols-2 gap-3 px-1">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 border border-slate-200 rounded text-xs">
                <div className="font-bold text-[#0F172A] flex justify-between">
                  <span>{proj.title}</span>
                  {proj.githubUrl && <span className="text-[10px] text-[#0284C7] font-normal">{proj.githubUrl}</span>}
                </div>
                {proj.technologies && (
                  <div className="text-[10.5px] text-[#0284C7] font-medium mt-0.5">Stack: {proj.technologies}</div>
                )}
                {proj.description && (
                  <p className="text-[11px] text-[#475569] mt-1 leading-snug">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2-Column Grid: Education, Skills, Certifications */}
      <div className="grid grid-cols-2 gap-5 px-1">
        {/* Left: Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => {
                const yearsStr = edu.startYear || edu.endYear 
                  ? `${edu.startYear || ''}${edu.startYear && edu.endYear ? ' – ' : ''}${edu.endYear || ''}`
                  : `${edu.startDate || ''}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate || ''}`;
                return (
                  <div key={edu.id} className="text-xs">
                    <div className="font-bold text-[#0F172A]">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </div>
                    <div className="text-slate-600">{edu.institution}</div>
                    {yearsStr && <div className="text-[10px] text-slate-400">{yearsStr}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Right: Skills & Certifications */}
        <div className="space-y-4">
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded mb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[#334155] text-[10.5px] font-medium rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded mb-2">
                Certifications
              </h2>
              <div className="space-y-1 text-xs text-[#334155]">
                {certifications.map((cert, index) => {
                  const { name, details } = getCertText(cert);
                  return (
                    <div key={index} className="text-[11px]">
                      <span className="font-semibold text-[#0F172A]">• {name}</span>
                      {details && <span className="text-slate-500 ml-1">({details})</span>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const ResumeTemplateRenderer: React.FC<{ data: ResumeData; template?: TemplateType }> = ({
  data,
  template,
}) => {
  const chosenTemplate = template || data.template;
  switch (chosenTemplate) {
    case 'executive':
      return <ExecutiveTemplate data={data} />;
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'minimalist':
    default:
      return <MinimalistTemplate data={data} />;
  }
};
