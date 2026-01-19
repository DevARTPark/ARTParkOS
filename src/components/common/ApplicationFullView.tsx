import React, { useState, useMemo } from "react";
import {
  Building2,
  Globe,
  Download,
  Users,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BrainCircuit,
  Settings,
  Lightbulb,
  Crosshair,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

// --- TYPES ---
interface Assessment {
  userId: string;
  user?: { userProfile?: { fullName?: string } };
  totalScore: number;
  dimensionScores: Record<string, number>;
}

interface ApplicationFullViewProps {
  applicationData: any;
  assessments?: Assessment[]; // Array of team assessments
  assessmentData?: any; // Fallback for single object legacy data
}

// ✅ FIX: Map the readable IDs to the actual Lap IDs from your data
const DIMENSIONS = [
  { id: "lap1", label: "Strategy", icon: BrainCircuit },
  { id: "lap2", label: "Culture", icon: Users },
  { id: "lap3", label: "Ops", icon: Settings },
  { id: "lap4", label: "Mindset", icon: Lightbulb },
  { id: "lap5", label: "Tactics", icon: Crosshair },
];

export default function ApplicationFullView({
  applicationData,
  assessments = [],
  assessmentData,
}: ApplicationFullViewProps) {
  // 1. UPDATE STATE TO INCLUDE 'documents'
  const [activeTab, setActiveTab] = useState<
    "overview" | "venture" | "team" | "documents"
  >("overview");

  // 1. DATA NORMALIZATION & SAFETY
  // If applicationData is missing, don't crash, just wait or show empty state
  const { founder, venture, innovator, uploads } = applicationData || {};

  // Combine array (assessments) and legacy single object (assessmentData) to ensure we have data
  const safeAssessments = useMemo(() => {
    if (assessments && assessments.length > 0) return assessments;
    if (assessmentData) return [assessmentData];
    return [];
  }, [assessments, assessmentData]);

  // 2. CORE LOGIC: TEAM AGGREGATE
  const teamStats = useMemo(() => {
    if (!safeAssessments.length) return null;

    // Calculate Max Score per Dimension
    const teamDims: Record<string, number> = {
      lap1: 0,
      lap2: 0,
      lap3: 0,
      lap4: 0,
      lap5: 0,
    };

    safeAssessments.forEach((a) => {
      // The backend returns 'dimensionScores' with keys like 'lap1', 'lap2'
      const scores = a.dimensionScores as Record<string, number>;

      DIMENSIONS.forEach((dim) => {
        const score = scores?.[dim.id] || 0;
        if (score > teamDims[dim.id]) {
          teamDims[dim.id] = score;
        }
      });
    });

    // Calculate Team Total
    const teamTotal = Object.values(teamDims).reduce(
      (sum, val) => sum + val,
      0,
    );

    // Determine Tier
    const dimsBelow10 = Object.values(teamDims).filter((v) => v < 10).length;
    let tier = "RED";

    if (teamTotal >= 75 && dimsBelow10 === 0) tier = "GREEN";
    else if (
      (teamTotal >= 60 && teamTotal <= 74) ||
      (teamTotal >= 75 && dimsBelow10 === 1)
    )
      tier = "YELLOW";
    else tier = "RED";

    return { score: teamTotal, dimensions: teamDims, tier };
  }, [safeAssessments]);

  // --- SAFE GUARD RENDER ---
  if (!applicationData) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Application details unavailable.</p>
      </div>
    );
  }

  // --- UI HELPERS ---
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "GREEN":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Green Tier
          </Badge>
        );
      case "YELLOW":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Yellow Tier
          </Badge>
        );
      case "RED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Red Tier
          </Badge>
        );
      default:
        return <Badge variant="neutral">Pending</Badge>;
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 75)
      return "text-green-700 bg-green-50 border-green-200 ring-4 ring-green-50/50";
    if (s >= 60)
      return "text-yellow-700 bg-yellow-50 border-yellow-200 ring-4 ring-yellow-50/50";
    return "text-red-700 bg-red-50 border-red-200 ring-4 ring-red-50/50";
  };

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {venture?.organizationName ||
                innovator?.teamName ||
                "Untitled Venture"}
            </h1>
            {teamStats && getTierBadge(teamStats.tier)}
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
              <Building2 className="w-4 h-4 text-gray-700" />
              {venture?.track === "startup"
                ? "Startup Track"
                : "Innovator Track"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {safeAssessments.length} Team Member(s)
            </span>
          </div>
        </div>

        {/* TEAM SCORE */}
        {teamStats && (
          <div
            className={`px-8 py-5 rounded-2xl border flex flex-col items-center shadow-sm ${getScoreColor(
              teamStats.score,
            )}`}
          >
            <div className="flex items-center gap-2 mb-1 opacity-90">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Team Potential
              </span>
            </div>
            <span className="text-5xl font-extrabold tracking-tighter">
              {teamStats.score}
              <span className="text-2xl opacity-60 font-medium text-gray-400">
                /100
              </span>
            </span>
          </div>
        )}
      </div>

      {/* TABS */}
      <div>
        <nav className="flex gap-8 border-b border-gray-200">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Score Analysis
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
            Team Profiles
          </TabButton>
          {/* NEW TAB BUTTON */}
          <TabButton
            active={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </TabButton>
        </nav>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        // REMOVED GRID: Now it's a simple vertical stack taking full width
        <div className="space-y-8">
          {/* SCORE MATRIX */}
          <Card className="overflow-hidden border-indigo-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <BarChart3 className="w-5 h-5 text-indigo-600" /> Team
                Capability Matrix
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-4 min-w-[160px]">Team Member</th>
                    <th className="px-4 py-4 text-center border-l border-gray-200">
                      Total
                    </th>
                    {DIMENSIONS.map((dim) => (
                      <th
                        key={dim.id}
                        className="px-3 py-4 text-center text-xs uppercase"
                      >
                        {dim.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {safeAssessments.map((a: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/80">
                      <td className="px-5 py-4 font-bold text-gray-900">
                        {a.user?.userProfile?.fullName || a.userId || "Founder"}
                        {idx === 0 && (
                          <span className="ml-2 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            Lead
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center font-bold border-l border-gray-100 bg-gray-50/30">
                        {a.totalScore}
                      </td>
                      {DIMENSIONS.map((dim) => (
                        <td
                          key={dim.id}
                          className="px-3 py-4 text-center text-gray-500"
                        >
                          {a.dimensionScores?.[dim.id] || 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {safeAssessments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-400">
                        No assessment data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* PITCH */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Problem Statement
                </h4>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {venture?.problemStatement || "Not provided"}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Proposed Solution
                </h4>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {venture?.solutionDescription || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* VENTURE TAB */}
      {activeTab === "venture" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard title="Market" icon={<Globe className="w-5 h-5" />}>
            <InfoRow label="Target Users" value={venture?.targetUsers} />
            <InfoRow label="Validation" value={venture?.marketValidation} />
          </InfoCard>
          <InfoCard title="Technology" icon={<Crosshair className="w-5 h-5" />}>
            <InfoRow label="Innovation" value={venture?.techInnovation} />
            <InfoRow label="Risks" value={venture?.keyRisks} />
          </InfoCard>
        </div>
      )}

      {/* TEAM TAB */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Founder</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Name" value={founder?.fullName} />
              <InfoRow label="Bio" value={founder?.bio} />
            </CardContent>
          </Card>
          {applicationData.coFounders?.map((cf: any, i: number) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Co-Founder {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="Name" value={cf.name} />
                <InfoRow label="Email" value={cf.email} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* NEW: DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocButton label="Pitch Deck" url={uploads?.pitchDeck} />
            <DocButton label="Budget Plan" url={uploads?.budgetDoc} />
            <DocButton label="Demo Video" url={uploads?.demoVideo} isLink />
            <DocButton label="Other Documents" url={uploads?.otherDocs} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- SUBCOMPONENTS ---
function TabButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-2 border-b-2 text-sm font-bold transition-all ${
        active
          ? "border-indigo-600 text-indigo-600"
          : "border-transparent text-gray-500"
      }`}
    >
      {children}
    </button>
  );
}
function InfoCard({ title, icon, children }: any) {
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-gray-100">
        <CardTitle className="flex gap-2 text-base">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">{children}</CardContent>
    </Card>
  );
}
function InfoRow({ label, value }: any) {
  return value ? (
    <div>
      <dt className="text-[11px] font-bold text-gray-400 uppercase mb-1">
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  ) : null;
}
function DocButton({ label, url, isLink }: any) {
  return url ? (
    <a
      href={url}
      target="_blank"
      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all"
    >
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <Download className="w-4 h-4 text-gray-400" />
    </a>
  ) : null;
}
