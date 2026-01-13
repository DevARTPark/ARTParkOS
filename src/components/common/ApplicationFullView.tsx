import React, { useState } from "react";
import {
  User,
  Building2,
  FileText,
  Linkedin,
  Globe,
  Download,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

// --- TYPES ---
// (You can move these to a shared types file later)
interface ApplicationFullViewProps {
  applicationData: any; // The JSON from OnboardingApplication
  assessmentData?: any; // The record from InnovationAssessment
}

export default function ApplicationFullView({
  applicationData,
  assessmentData,
}: ApplicationFullViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "venture" | "team">(
    "overview"
  );

  const { founder, venture, innovator, uploads } = applicationData;

  // Helper to safely get assessment values
  const score = assessmentData?.totalScore || 0;
  const bucket = assessmentData?.bucket || "PENDING";
  const dimensions = assessmentData?.dimensionScores || {};

  // Color logic for the score
  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-green-600 bg-green-50 border-green-200";
    if (s >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getBucketBadge = (b: string) => {
    switch (b) {
      case "GREEN":
        return <Badge variant="success">High Potential</Badge>;
      case "YELLOW":
        return <Badge variant="warning">Review Required</Badge>;
      case "RED":
        return <Badge variant="danger">Not Ready</Badge>;
      default:
        return <Badge variant="neutral">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {venture?.organizationName ||
                innovator?.teamName ||
                "Untitled Venture"}
            </h1>
            {getBucketBadge(bucket)}
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {venture?.track === "startup"
                ? "Startup Track"
                : venture?.track === "researcher"
                ? "Researcher Track"
                : "Innovator Track"}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {venture?.vertical || "General Deep Tech"}
            </span>
          </div>
        </div>

        {/* Score Card */}
        <div
          className={`px-6 py-3 rounded-xl border-2 flex flex-col items-center ${getScoreColor(
            score
          )}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">
            Innovation Score
          </span>
          <span className="text-3xl font-bold">{score}/100</span>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview & Score
          </TabButton>
          <TabButton
            active={activeTab === "venture"}
            onClick={() => setActiveTab("venture")}
          >
            Venture Details
          </TabButton>
          <TabButton
            active={activeTab === "team"}
            onClick={() => setActiveTab("team")}
          >
            Team & Founder
          </TabButton>
        </nav>
      </div>

      {/* --- TAB CONTENT --- */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pitch Summary */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Problem Statement
                  </h4>
                  <p className="text-gray-800 leading-relaxed">
                    {venture?.problemStatement ||
                      "No problem statement provided."}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Proposed Solution
                  </h4>
                  <p className="text-gray-800 leading-relaxed">
                    {venture?.solutionDescription || "No solution provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Uploads */}
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DocButton label="Pitch Deck" url={uploads?.pitchDeck} />
                  <DocButton label="Budget Plan" url={uploads?.budgetDoc} />
                  <DocButton
                    label="Demo Video"
                    url={uploads?.demoVideo}
                    isLink
                  />
                  <DocButton label="Other Docs" url={uploads?.otherDocs} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Breakdown */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Assessment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {Object.entries(dimensions).map(([key, val]: any) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span
                        className={
                          val < 10 ? "text-red-600 font-bold" : "text-gray-900"
                        }
                      >
                        {val}/20
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          val < 10 ? "bg-red-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${(val / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                {Object.keys(dimensions).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Assessment not yet completed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 2. VENTURE TAB */}
      {activeTab === "venture" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              title="Market & Customers"
              icon={<Globe className="w-5 h-5 text-blue-500" />}
            >
              <InfoRow label="Target Audience" value={venture?.targetUsers} />
              <InfoRow
                label="Market Validation"
                value={venture?.marketValidation}
              />
              <InfoRow
                label="TRL Level"
                value={venture?.trlLevel?.replace("trl_", "Level ")}
              />
            </InfoCard>

            <InfoCard
              title="Technology"
              icon={<Award className="w-5 h-5 text-purple-500" />}
            >
              <InfoRow
                label="Core Tech"
                value={venture?.techCategory?.join(", ")}
              />
              <InfoRow
                label="Innovation / USP"
                value={venture?.techInnovation}
              />
              <InfoRow label="Key Risks" value={venture?.keyRisks} />
            </InfoCard>

            <InfoCard
              title="Organization"
              icon={<Building2 className="w-5 h-5 text-gray-500" />}
            >
              <InfoRow label="Legal Entity" value={venture?.legalEntity} />
              <InfoRow
                label="Incorporation Year"
                value={venture?.registrationYear}
              />
              <InfoRow label="Website" value={venture?.website} isLink />
            </InfoCard>

            <InfoCard
              title="Funding"
              icon={<Briefcase className="w-5 h-5 text-green-500" />}
            >
              <InfoRow
                label="Funding Status"
                value={venture?.hasFunding ? "Funded" : "Bootstrapped"}
              />
              <InfoRow label="Details" value={venture?.fundingDetails} />
            </InfoCard>
          </div>
        </div>
      )}

      {/* 3. TEAM TAB */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* Lead Founder */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Lead Founder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Full Name" value={founder?.fullName} />
                <InfoRow label="Email" value={founder?.email} />
                <InfoRow label="Role" value={founder?.currentRole} />
                <InfoRow
                  label="Experience"
                  value={`${founder?.yearsExperience || 0} Years`}
                />
                <InfoRow
                  label="Education"
                  value={`${founder?.educationLevel} - ${founder?.college}`}
                />
                <div className="col-span-1 md:col-span-2 mt-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">
                    Bio
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {founder?.bio}
                  </p>
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-4 mt-2">
                  {founder?.linkedinUrl && (
                    <a
                      href={founder.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn Profile
                    </a>
                  )}
                  {founder?.portfolioUrl && (
                    <a
                      href={founder.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-600 hover:underline"
                    >
                      <Globe className="w-4 h-4" /> Portfolio / Website
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Co-founders List */}
          {applicationData.coFounders &&
            applicationData.coFounders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Co-Founders & Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-gray-100">
                    {applicationData.coFounders.map(
                      (member: any, idx: number) => (
                        <div
                          key={idx}
                          className="py-4 first:pt-0 last:pb-0 flex items-start justify-between"
                        >
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {member.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {member.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="neutral">{member.role}</Badge>
                            <div className="text-xs text-gray-400 mt-1">
                              {member.isFullTime ? "Full-time" : "Part-time"}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      )}
    </div>
  );
}

// --- SUBCOMPONENTS ---

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
        active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
      )}
    </button>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-gray-50">
        <CardTitle className="text-base flex items-center gap-2 text-gray-700">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">{children}</CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  isLink,
}: {
  label: string;
  value: string | undefined;
  isLink?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-900">
        {isLink ? (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function DocButton({
  label,
  url,
  isLink,
}: {
  label: string;
  url: string | null;
  isLink?: boolean;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-md border border-gray-100 group-hover:border-blue-100">
          {isLink ? (
            <Globe className="w-4 h-4 text-blue-500" />
          ) : (
            <FileText className="w-4 h-4 text-red-500" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
          {label}
        </span>
      </div>
      <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
    </a>
  );
}
