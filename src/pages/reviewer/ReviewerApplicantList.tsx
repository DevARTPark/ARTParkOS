import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { API_URL } from "../../config";

// Mock Data (Replace with API call later)
const MOCK_APPLICANTS = [
  {
    id: "user_123",
    founderName: "Rahul Verma",
    startupName: "AgriSense AI",
    track: "startup",
    submittedAt: "2023-10-25T10:00:00Z",
    innovationScore: 82,
    bucket: "GREEN",
    status: "SUBMITTED",
  },
  {
    id: "user_456",
    founderName: "Dr. Sarah Khan",
    startupName: "NeuroHeal",
    track: "researcher",
    submittedAt: "2023-10-24T14:30:00Z",
    innovationScore: 65,
    bucket: "YELLOW",
    status: "SUBMITTED",
  },
];

export default function ReviewerApplicantList() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Connect to Backend
  // useEffect(() => {
  //   const fetchApplicants = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await fetch(`${API_URL}/api/reviewer/applicants`); // Need to create this route
  //       if (res.ok) {
  //         const data = await res.json();
  //         setApplicants(data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch applicants", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchApplicants();
  // }, []);

  const getScoreBadge = (score: number, bucket: string) => {
    let color = "bg-gray-100 text-gray-800";
    if (bucket === "GREEN") color = "bg-green-100 text-green-800";
    if (bucket === "YELLOW") color = "bg-yellow-100 text-yellow-800";
    if (bucket === "RED") color = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
        {score}/100
      </span>
    );
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incoming Applications
          </h1>
          <p className="text-gray-500">
            Review and delegate new startup submissions.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicants..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Startup / Founder
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Track
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Innovation Score
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applicants.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/reviewer/applications/${app.id}`)}
                >
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {app.startupName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <User className="w-3 h-3" /> {app.founderName}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="neutral" className="capitalize">
                      {app.track}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    {getScoreBadge(app.innovationScore, app.bucket)}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-indigo-600">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
