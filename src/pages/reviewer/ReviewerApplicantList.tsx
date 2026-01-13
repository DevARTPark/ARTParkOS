import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  Calendar,
  User,
  BarChart3,
  Inbox,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

// MOCK DATA (With Team Aggregates Pre-calculated)
const MOCK_APPLICANTS = [
  {
    id: "user_1",
    startupName: "AgriSense AI",
    founderName: "Rahul Verma",
    track: "startup",
    submittedAt: "2023-10-25",
    teamScore: 82,
    teamTier: "GREEN",
  },
  {
    id: "user_3",
    startupName: "BuildBot",
    founderName: "Amit Roy",
    track: "startup",
    submittedAt: "2023-10-26",
    teamScore: 88,
    teamTier: "YELLOW",
  }, // Yellow because maybe 1 dim < 10
  {
    id: "user_2",
    startupName: "NeuroHeal",
    founderName: "Dr. Sarah Khan",
    track: "researcher",
    submittedAt: "2023-10-24",
    teamScore: 65,
    teamTier: "YELLOW",
  },
  {
    id: "user_4",
    startupName: "WeakTech Solutions",
    founderName: "John Doe",
    track: "innovator",
    submittedAt: "2023-10-20",
    teamScore: 55,
    teamTier: "RED",
  },
];

export default function ReviewerApplicantList() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);

  useEffect(() => {
    // SORTING LOGIC: Green > Yellow > Red, then Score High > Low
    const sorted = [...MOCK_APPLICANTS].sort((a, b) => {
      const tierRank: Record<string, number> = { GREEN: 3, YELLOW: 2, RED: 1 };
      const rankDiff = tierRank[b.teamTier] - tierRank[a.teamTier];
      if (rankDiff !== 0) return rankDiff;
      return b.teamScore - a.teamScore;
    });
    setApplicants(sorted);
  }, []);

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "GREEN":
        return "bg-green-100 text-green-800 border-green-200 ring-1 ring-green-200";
      case "YELLOW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 ring-1 ring-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200 ring-1 ring-red-200";
    }
  };

  return (
    <DashboardLayout role="reviewer">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Incoming Applications
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Review, validate, and assign experts to new startups.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* LIST CARD */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                <th className="p-5 pl-6">Startup / Founder</th>
                <th className="p-5">Track</th>
                <th className="p-5">Submitted</th>
                <th className="p-5">Team Tier</th>
                <th className="p-5 text-right">Team Score</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applicants.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-indigo-50/30 cursor-pointer group transition-all duration-200"
                  onClick={() => navigate(`/reviewer/applications/${app.id}`)}
                >
                  <td className="p-5 pl-6">
                    <div>
                      <div className="font-bold text-gray-900 text-base">
                        {app.startupName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <User className="w-3 h-3" /> {app.founderName}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <Badge
                      variant="outline"
                      className="capitalize px-2 py-1 bg-white"
                    >
                      {app.track}
                    </Badge>
                  </td>
                  <td className="p-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />{" "}
                      {app.submittedAt}
                    </div>
                  </td>
                  <td className="p-5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wide ${getTierStyle(
                        app.teamTier
                      )}`}
                    >
                      {app.teamTier} Tier
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                      <span className="font-bold text-gray-900 text-lg">
                        {app.teamScore}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right text-gray-400">
                    <ChevronRight className="w-5 h-5 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
