import * as React from "react";
import { useState } from "react";
import { linkedinData } from "./data";
import type { LinkedInProfile } from "./types";
import clsx from "clsx";

export function XpPage() {
  const profile = linkedinData[0];
  const [activeSection, setActiveSection] = useState<"about" | "experience" | "education" | "skills">("about");

  return (
    <div className="w-full h-full bg-[#e5e5e5] overflow-auto font-sans text-black">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-[#dfe8f6] to-[#c8d5e8] border-b-2 border-[#a0a0a0] px-3 sm:px-6 py-2 sm:py-3">
        <h1 className="text-base sm:text-lg font-bold text-[#003366]">
          {profile.firstName} {profile.lastName}
        </h1>
        {profile.headline && (
          <p className="text-[10px] sm:text-xs text-gray-700 mt-1">{profile.headline}</p>
        )}
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="sm:hidden bg-[#ece9d8] border-b border-gray-400 flex overflow-x-auto">
        <NavTab
          active={activeSection === "about"}
          onClick={() => setActiveSection("about")}
          label="About"
        />
        <NavTab
          active={activeSection === "experience"}
          onClick={() => setActiveSection("experience")}
          label="Experience"
        />
        <NavTab
          active={activeSection === "education"}
          onClick={() => setActiveSection("education")}
          label="Education"
        />
        <NavTab
          active={activeSection === "skills"}
          onClick={() => setActiveSection("skills")}
          label="Skills"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row">
        {/* Sidebar - Desktop */}
        <div className="hidden sm:block w-48 bg-[#f0f0f0] border-r-2 border-[#a0a0a0] p-3 shrink-0">
          <SidebarNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-6 bg-white min-h-0">
          {/* Mobile: Show only active section */}
          <div className="sm:hidden">
            {activeSection === "about" && <AboutSection profile={profile} />}
            {activeSection === "experience" && <ExperienceSection profile={profile} />}
            {activeSection === "education" && <EducationSection profile={profile} />}
            {activeSection === "skills" && <SkillsSection profile={profile} />}
          </div>

          {/* Desktop: Show all sections */}
          <div className="hidden sm:block space-y-6">
            <AboutSection profile={profile} />
            <ExperienceSection profile={profile} />
            <EducationSection profile={profile} />
            <SkillsSection profile={profile} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-3 sm:px-6 py-1 text-[9px] sm:text-[10px] text-gray-600 text-center">
        Last updated: {new Date().toLocaleDateString()} | Powered by Internet Explorer 6
      </div>
    </div>
  );
}

function NavTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 text-[10px] sm:text-xs font-semibold border-b-2 transition-colors whitespace-nowrap",
        active
          ? "bg-white border-[#003366] text-[#003366]"
          : "bg-[#ece9d8] border-transparent text-gray-600 hover:bg-gray-100"
      )}
    >
      {label}
    </button>
  );
}

function SidebarNav({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: "about" | "experience" | "education" | "skills") => void;
}) {
  const links = [
    { id: "about" as const, label: "About" },
    { id: "experience" as const, label: "Experience" },
    { id: "education" as const, label: "Education" },
    { id: "skills" as const, label: "Skills" },
  ];

  return (
    <div className="space-y-1">
      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => onSectionChange(link.id)}
          className={clsx(
            "w-full text-left px-3 py-2 text-xs rounded-sm border transition-colors",
            activeSection === link.id
              ? "bg-[#dfe8f6] border-[#003366] text-[#003366] font-bold"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          )}
          style={{
            boxShadow: activeSection === link.id
              ? "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)"
              : undefined,
          }}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
}

function AboutSection({ profile }: { profile: LinkedInProfile }) {
  return (
    <Section title="About">
      <div className="space-y-4">
        {/* Profile Picture */}
        {profile.profilePicture && (
          <div className="flex justify-center sm:justify-start">
            <img
              src={profile.profilePicture}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-gray-400 rounded-sm object-cover"
            />
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-[#f9f9f9] border border-gray-300 p-3 rounded-sm">
          <InfoRow label="Name" value={`${profile.firstName} ${profile.lastName}`} />
          {profile.vanityName && (
            <InfoRow label="LinkedIn" value={`linkedin.com/in/${profile.vanityName}`} />
          )}
          {profile.locale && (
            <InfoRow label="Locale" value={profile.locale} />
          )}
        </div>

        {/* Headline */}
        {profile.headline && (
          <div className="bg-[#f9f9f9] border border-gray-300 p-3 rounded-sm">
            <h3 className="text-xs sm:text-sm font-bold text-[#003366] mb-2">Summary</h3>
            <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.headline}
            </p>
          </div>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <div className="bg-[#f9f9f9] border border-gray-300 p-3 rounded-sm">
            <h3 className="text-xs sm:text-sm font-bold text-[#003366] mb-2">Languages</h3>
            <div className="space-y-1">
              {profile.languages.map((lang, idx) => (
                <div key={idx} className="text-[10px] sm:text-xs text-gray-700">
                  <span className="font-semibold">{lang.language}:</span> {lang.proficiency}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function ExperienceSection({ profile }: { profile: LinkedInProfile }) {
  return (
    <Section title="Experience">
      <div className="space-y-4">
        {profile.positions.length === 0 ? (
          <p className="text-[10px] sm:text-xs text-gray-500">No experience listed.</p>
        ) : (
          profile.positions.map((pos, idx) => (
            <div
              key={idx}
              className="bg-[#f9f9f9] border border-gray-300 p-3 sm:p-4 rounded-sm hover:border-[#003366] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-[#003366] mb-1">
                    {pos.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pos.companyLogo && (
                      <img
                        src={pos.companyLogo}
                        alt={pos.companyName}
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                      {pos.companyName}
                    </span>
                    {pos.location && (
                      <span className="text-[9px] sm:text-[10px] text-gray-500">
                        ({pos.location})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-600 shrink-0">
                  {pos.startDate && (
                    <span>
                      {formatDate(pos.startDate)} - {pos.isCurrent ? "Present" : pos.endDate ? formatDate(pos.endDate) : "Unknown"}
                    </span>
                  )}
                </div>
              </div>

              {pos.description && (
                <div className="mt-2 text-[10px] sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {pos.description}
                </div>
              )}

              {pos.skills && pos.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {pos.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#dfe8f6] text-[#003366] px-2 py-0.5 rounded text-[9px] sm:text-[10px] border border-[#a0a0a0]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {pos.images && pos.images.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pos.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-full h-auto border border-gray-300 rounded-sm"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Section>
  );
}

function EducationSection({ profile }: { profile: LinkedInProfile }) {
  const allEducation = [
    ...(profile.educations || []),
    ...(profile.diplomas || []),
  ];

  return (
    <Section title="Education">
      <div className="space-y-4">
        {allEducation.length === 0 ? (
          <p className="text-[10px] sm:text-xs text-gray-500">No education listed.</p>
        ) : (
          allEducation.map((edu, idx) => (
            <div
              key={idx}
              className="bg-[#f9f9f9] border border-gray-300 p-3 sm:p-4 rounded-sm"
            >
              <h3 className="text-xs sm:text-sm font-bold text-[#003366] mb-1">
                {edu.schoolName}
              </h3>
              {(edu.degree || edu.fieldOfStudy) && (
                <p className="text-[10px] sm:text-xs text-gray-700 mb-2">
                  {edu.degree && <span>{edu.degree}</span>}
                  {edu.degree && edu.fieldOfStudy && <span> in </span>}
                  {edu.fieldOfStudy && <span>{edu.fieldOfStudy}</span>}
                </p>
              )}
              {(edu.startDate || edu.endDate || (edu as any).startYear) && (
                <p className="text-[9px] sm:text-[10px] text-gray-600">
                  {(edu as any).startYear
                    ? `${(edu as any).startYear}${(edu as any).endYear ? ` - ${(edu as any).endYear}` : ""}`
                    : edu.startDate
                    ? `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : "Present"}`
                    : ""}
                </p>
              )}
              {(edu as any).grade && (
                <p className="text-[9px] sm:text-[10px] text-gray-600 mt-1">
                  Grade: {(edu as any).grade}
                </p>
              )}
              {edu.images && edu.images.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {edu.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-full h-auto border border-gray-300 rounded-sm"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Section>
  );
}

function SkillsSection({ profile }: { profile: LinkedInProfile }) {
  return (
    <Section title="Skills">
      <div className="space-y-4">
        {profile.skills.length === 0 ? (
          <p className="text-[10px] sm:text-xs text-gray-500">No skills listed.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#dfe8f6] text-[#003366] px-3 py-1.5 rounded-sm text-[10px] sm:text-xs font-semibold border border-[#a0a0a0] hover:bg-[#c8d5e8] transition-colors cursor-default"
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-sm sm:text-base font-bold text-[#003366] mb-3 pb-2 border-b-2 border-[#003366]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-1 text-[10px] sm:text-xs">
      <span className="font-semibold text-gray-700 w-20 sm:w-24 shrink-0">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Unknown";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  } catch {
    return dateString;
  }
}
