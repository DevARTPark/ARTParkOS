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
  assessments: Assessment[];
}

const DIMENSIONS = [
  { id: "strategy", label: "Strategy", icon: BrainCircuit },
  { id: "culture", label: "Culture", icon: Users },
  { id: "operations", label: "Ops", icon: Settings },
  { id: "mindset", label: "Mindset", icon: Lightbulb },
  { id: "tactics", label: "Tactics", icon: Crosshair },
];

export default function ApplicationFullView({
  applicationData,
  assessments = [],
}: ApplicationFullViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "venture" | "team">(
    "overview"
  );
  const { founder, venture, innovator, uploads } = applicationData || {};

  // --- CORE LOGIC: TEAM AGGREGATE (MAX CAPABILITY) ---
  const teamStats = useMemo(() => {
    if (!assessments.length) return null;

    // 1. Calculate Max Score per Dimension across all members
    const teamDims: Record<string, number> = {
      strategy: 0,
      culture: 0,
      operations: 0,
      mindset: 0,
      tactics: 0,
    };

    assessments.forEach((a) => {
      DIMENSIONS.forEach((dim) => {
        const score = a.dimensionScores?.[dim.id] || 0;
        if (score > teamDims[dim.id]) {
          teamDims[dim.id] = score;
        }
      });
    });

    // 2. Calculate Team Total (Sum of Max Dimensions)
    const teamTotal = Object.values(teamDims).reduce(
      (sum, val) => sum + val,
      0
    );

    // 3. Determine Team Tier (PDF Logic)
    const dimsBelow10 = Object.values(teamDims).filter((v) => v < 10).length;
    let tier = "RED";

    // Logic:
    // - Green: Score >= 75 AND No Weakness (<10)
    // - Yellow: Score 60-74 OR (High Score but 1 Weakness)
    // - Red: Score < 60 OR (2+ Weaknesses)
    if (teamTotal >= 75 && dimsBelow10 === 0) tier = "GREEN";
    else if (
      (teamTotal >= 60 && teamTotal <= 74) ||
      (teamTotal >= 75 && dimsBelow10 === 1)
    )
      tier = "YELLOW";
    else tier = "RED";

    return { score: teamTotal, dimensions: teamDims, tier };
  }, [assessments]);

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
        return <Badge variant="outline">Pending</Badge>;
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
      {/* --- HEADER SECTION --- */}
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
            <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
              <Globe className="w-4 h-4 text-gray-700" />
              {venture?.vertical || "Deep Tech"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {assessments.length} Member{assessments.length !== 1 && "s"}
            </span>
          </div>
        </div>

        {/* TEAM SCORE DISPLAY */}
        {teamStats && (
          <div
            className={`px-8 py-5 rounded-2xl border flex flex-col items-center shadow-sm ${getScoreColor(
              teamStats.score
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

      {/* --- TABS --- */}
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
        </nav>
      </div>

      {/* --- TAB 1: SCORE ANALYSIS (MATRIX) --- */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* 1. TEAM CAPABILITY MATRIX */}
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
                        Total Score
                      </th>
                      {DIMENSIONS.map((dim) => (
                        <th
                          key={dim.id}
                          className="px-3 py-4 text-center text-xs uppercase tracking-wider text-gray-400"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <dim.icon className="w-4 h-4 opacity-50" />{" "}
                            {dim.label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {/* INDIVIDUAL ROWS */}
                    {assessments.map((a, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900">
                            {a.user?.userProfile?.fullName || a.userId}
                          </div>
                          {idx === 0 && (
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                              Lead
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-gray-700 border-l border-gray-100 bg-gray-50/30">
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

                    {/* TEAM AGGREGATE ROW (HIGHLIGHTED) */}
                    {teamStats && (
                      <tr className="bg-indigo-50 border-t-2 border-indigo-100 shadow-inner">
                        <td className="px-5 py-5 text-indigo-900 font-bold flex items-center gap-2">
                          <Users className="w-5 h-5" /> Team Max Potential
                        </td>
                        <td className="px-4 py-5 text-center text-xl font-extrabold text-indigo-700 border-l border-indigo-200 bg-white/50">
                          {teamStats.score}
                        </td>
                        {DIMENSIONS.map((dim) => {
                          const val = teamStats.dimensions[dim.id];
                          const isStrong = val >= 15;
                          const isWeak = val < 10;
                          return (
                            <td
                              key={dim.id}
                              className={`px-3 py-5 text-center font-bold text-lg border-l border-indigo-100/50 ${
                                isWeak
                                  ? "text-red-500"
                                  : isStrong
                                  ? "text-green-600"
                                  : "text-indigo-900"
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-200 flex items-center gap-2">
                <Target className="w-3 h-3" />
                <span>
                  Team Score is calculated using the{" "}
                  <strong>maximum capability</strong> across all members for
                  each dimension.
                </span>
              </div>
            </Card>

            {/* EXECUTIVE SUMMARY */}
            <Card>
              <CardHeader>
                <CardTitle>The Pitch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Problem Statement
                  </h4>
                  <p className="text-gray-800 text-base leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {venture?.problemStatement || "Not provided"}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Proposed Solution
                  </h4>
                  <p className="text-gray-800 text-base leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {venture?.solutionDescription || "Not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: STRENGTH PROFILE */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="h-fit border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Strength Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {teamStats &&
                  DIMENSIONS.map((dim) => {
                    const val = teamStats.dimensions[dim.id];
                    return (
                      <div key={dim.id}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <dim.icon className="w-4 h-4 text-gray-400" />{" "}
                            {dim.label}
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              val < 10 ? "text-red-600" : "text-gray-900"
                            }`}
                          >
                            {val}/20
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              val < 10
                                ? "bg-red-500"
                                : val >= 15
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                            style={{ width: `${(val / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <DocButton label="Pitch Deck" url={uploads?.pitchDeck} />
                <DocButton label="Budget Plan" url={uploads?.budgetDoc} />
                <DocButton label="Demo Video" url={uploads?.demoVideo} isLink />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* --- TAB 2: VENTURE DETAILS --- */}
      {activeTab === "venture" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard
            title="Market & Validation"
            icon={<Globe className="w-5 h-5 text-blue-600" />}
          >
            <InfoRow label="Target Users" value={venture?.targetUsers} />
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
            title="Technology & Risks"
            icon={<Crosshair className="w-5 h-5 text-purple-600" />}
          >
            <InfoRow
              label="Core Tech"
              value={venture?.techCategory?.join(", ")}
            />
            <InfoRow label="Innovation (USP)" value={venture?.techInnovation} />
            <InfoRow label="Key Risks" value={venture?.keyRisks} />
          </InfoCard>
          <InfoCard
            title="Legal & Funding"
            icon={<Building2 className="w-5 h-5 text-gray-600" />}
          >
            <InfoRow label="Legal Entity" value={venture?.legalEntity} />
            <InfoRow label="Incorporation" value={venture?.registrationYear} />
            <InfoRow label="Funding Details" value={venture?.fundingDetails} />
          </InfoCard>
        </div>
      )}

      {/* --- TAB 3: TEAM INFO --- */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Founder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <InfoRow label="Full Name" value={founder?.fullName} />
                <InfoRow label="Role" value={founder?.currentRole} />
                <InfoRow label="Email" value={founder?.email} />
                <InfoRow label="LinkedIn" value={founder?.linkedinUrl} isLink />
                <div className="col-span-2">
                  <InfoRow label="Bio" value={founder?.bio} />
                </div>
              </div>
            </CardContent>
          </Card>
          {applicationData.coFounders?.map((cf: any, i: number) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Co-Founder {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <InfoRow label="Name" value={cf.name} />
                  <InfoRow label="Email" value={cf.email} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
          : "border-transparent text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}
function InfoCard({ title, icon, children }: any) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="flex gap-2 text-base text-gray-800">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">{children}</CardContent>
    </Card>
  );
}
function InfoRow({ label, value, isLink }: any) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-900 break-words leading-relaxed">
        {isLink ? (
          <a
            href={value}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
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
function DocButton({ label, url, isLink }: any) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-indigo-50 rounded text-indigo-600">
          <Download className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700">
          {label}
        </span>
      </div>
    </a>
  );
}
