import React from "react";
import {
  Edit2,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  Globe,
  FileText,
  Users,
} from "lucide-react";
import type { ApplicationState } from "../../store/useApplicationStore";

interface ReviewSlideProps {
  data: ApplicationState;
  onEdit: (stepId: string) => void; // New callback for navigation
}

export default function ReviewSlide({ data, onEdit }: ReviewSlideProps) {
  // Helper Component for Sections
  const Section = ({
    title,
    stepId,
    icon: Icon,
    children,
  }: {
    title: string;
    stepId: string; // The ID of the slide to jump to
    icon?: React.ElementType;
    children: React.ReactNode;
  }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4 shadow-sm hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
            {title}
          </h4>
        </div>
        <button
          onClick={() => onEdit(stepId)}
          className="text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded-full"
          title="Edit this section"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );

  // Helper Component for Data Rows
  const Row = ({
    label,
    value,
    isLong = false,
  }: {
    label: string;
    value: any;
    isLong?: boolean;
  }) => {
    if (!value && value !== 0 && value !== false) return null; // Don't render empty rows

    return (
      <div
        className={`${
          isLong ? "col-span-1" : "grid grid-cols-1 sm:grid-cols-3 gap-2"
        }`}
      >
        <span className="text-gray-500 font-medium text-xs sm:text-sm">
          {label}
        </span>
        <span
          className={`text-gray-900 font-medium ${
            isLong
              ? "block mt-1 p-3 bg-gray-50 rounded-lg text-sm border border-gray-100 whitespace-pre-wrap"
              : "sm:col-span-2 wrap-break-word"
          }`}
        >
          {Array.isArray(value) ? value.join(", ") : value.toString()}
        </span>
      </div>
    );
  };

  const isFounder = data.role === "founder";
  const track = data.venture.track;

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-10">
      {/* Alert Banner */}
      <div className="flex gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 items-start">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          Please review your details carefully. You can click the{" "}
          <strong>Edit icon</strong> to make changes. Once submitted, your
          application cannot be edited.
        </p>
      </div>

      {/* --- SECTION 1: IDENTITY & BACKGROUND --- */}

      {isFounder ? (
        <>
          <Section title="Personal Details" stepId="identity" icon={User}>
            <Row label="Full Name" value={data.founder.fullName} />
            <Row label="Email" value={data.founder.email} />
            <Row label="Phone" value={data.founder.phone} />
            <Row label="Current Role" value={data.founder.currentRole} />
            <Row
              label="Location"
              value={`${data.founder.city}, ${data.founder.country}`}
            />
          </Section>

          <Section
            title="Background & Experience"
            stepId="background"
            icon={Briefcase}
          >
            <Row
              label="Education"
              value={`${data.founder.educationLevel} (${data.founder.college})`}
            />
            <Row label="Discipline" value={data.founder.discipline} />
            <Row
              label="Experience"
              value={`${data.founder.yearsExperience} Years`}
            />
            <Row
              label="Primary Strength"
              value={data.founder.primaryStrength}
            />
            <Row isLong label="Bio" value={data.founder.bio} />
          </Section>

          <Section title="Online Presence" stepId="links" icon={Globe}>
            <Row label="LinkedIn" value={data.founder.linkedinUrl} />
            <Row label="Portfolio / GitHub" value={data.founder.portfolioUrl} />
            <Row label="Google Scholar" value={data.founder.scholarUrl} />
          </Section>
        </>
      ) : (
        // INNOVATOR VIEW
        <>
          <Section title="Personal Details" stepId="identity" icon={User}>
            <Row label="Full Name" value={data.innovator.leadName} />
            <Row label="Email" value={data.innovator.email} />
            <Row label="Phone" value={data.innovator.phone} />
            <Row label="LinkedIn" value={data.innovator.linkedinUrl} />
          </Section>

          <Section
            title="Professional Profile"
            stepId="status"
            icon={Briefcase}
          >
            <Row
              label="Current Status"
              value={data.innovator.professionalStatus}
            />
            <Row label="Role" value={data.innovator.currentRole} />
            <Row label="Organization" value={data.innovator.organization} />
            <Row label="Primary Skill" value={data.innovator.primarySkill} />
            <Row
              label="Experience"
              value={`${data.innovator.yearsExperience} Years`}
            />
            <Row label="Education" value={data.innovator.educationLevel} />
            <Row isLong label="Bio" value={data.innovator.bio} />
          </Section>

          <Section title="Location" stepId="location" icon={Globe}>
            <Row
              label="Based In"
              value={`${data.innovator.city}, ${data.innovator.country}`}
            />
          </Section>
        </>
      )}

      {/* --- SECTION 2: VENTURE / PROJECT (Founders Only) --- */}

      {isFounder && (
        <>
          <Section
            title="Venture Identity"
            stepId="track_selection"
            icon={Briefcase}
          >
            <Row
              label="Selected Track"
              value={track?.toUpperCase().replace("_", " ")}
            />
            <Row label="Vertical" value={data.venture.vertical} />
            <Row label="Tech Focus" value={data.venture.techCategory} />

            {/* Track Specifics */}
            {track === "startup" && (
              <>
                <Row
                  label="Organization"
                  value={data.venture.organizationName}
                />
                <Row label="Reg. Year" value={data.venture.registrationYear} />
                <Row label="Legal Entity" value={data.venture.legalEntity} />
                <Row label="Website" value={data.venture.website} />
                <Row
                  isLong
                  label="Funding Status"
                  value={data.venture.fundingDetails}
                />
              </>
            )}

            {track === "researcher" && (
              <>
                <Row
                  label="Project Name"
                  value={data.venture.organizationName}
                />
                <Row label="Institute" value={data.venture.instituteName} />
                <Row
                  label="DSIR Certified"
                  value={data.venture.isDsirCertified ? "Yes" : "No"}
                />
              </>
            )}

            {track === "innovator_residence" && (
              <>
                <Row
                  label="Project Name"
                  value={data.venture.organizationName}
                />
                <Row label="Commitment" value={data.venture.commitment} />
                <Row
                  isLong
                  label="Motivation"
                  value={data.venture.motivation}
                />
                <Row
                  isLong
                  label="Support Needed"
                  value={data.venture.supportNeeded}
                />
              </>
            )}
          </Section>

          <Section title="The Pitch" stepId="problem_solution" icon={FileText}>
            <Row
              isLong
              label="Problem Statement"
              value={data.venture.problemStatement}
            />
            <Row
              isLong
              label="Proposed Solution"
              value={data.venture.solutionDescription}
            />
          </Section>

          <Section title="Innovation & Market" stepId="innovation" icon={Globe}>
            <Row
              isLong
              label="Tech Innovation / USP"
              value={data.venture.techInnovation}
            />
            <Row isLong label="Key Risks" value={data.venture.keyRisks} />
            <Row label="Current TRL" value={data.venture.trlLevel} />
            <Row
              isLong
              label="Target Audience"
              value={data.venture.targetUsers}
            />
            <Row
              isLong
              label="Market Validation"
              value={data.venture.marketValidation}
            />
          </Section>

          {data.coFounders.length > 0 && (
            <Section title="Team Structure" stepId="co_founders" icon={Users}>
              <div className="grid gap-2 mb-4">
                {data.coFounders.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {c.name}
                      </span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-500">{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Row
                isLong
                label="Team History & Equity"
                value={data.venture.teamHistory}
              />
            </Section>
          )}
        </>
      )}

      {/* --- SECTION 3: UPLOADS --- */}
      <Section title="Documents" stepId="uploads" icon={CheckCircle}>
        <div className="flex gap-4 flex-wrap">
          {Object.entries(data.uploads).map(([key, val]) => {
            if (!val) return null;
            return (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            );
          })}
          {Object.values(data.uploads).every((v) => !v) && (
            <span className="text-gray-400 italic">No files uploaded</span>
          )}
        </div>
      </Section>
    </div>
  );
}
