import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  CheckCircle2,
  UserCheck,
  Building2,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

// Mock Data - In real app, fetch from /api/admin/ready-for-onboarding
const MOCK_APPROVED = [
  {
    id: "user_789",
    founderName: "Vikram Singh",
    startupName: "DroneLogistics",
    track: "startup",
    innovationScore: 88,
    endorsedBy: "Dr. Ramesh Rao",
    endorsedDate: "2023-10-27",
    status: "EXPERT_APPROVED",
  },
  {
    id: "user_101",
    founderName: "Ananya Gupta",
    startupName: "BioPlast",
    track: "innovator_residence",
    innovationScore: 79,
    endorsedBy: "Prof. Sarah Jenkins",
    endorsedDate: "2023-10-26",
    status: "EXPERT_APPROVED",
  },
];

export default function AdminApprovedList() {
  const navigate = useNavigate();
  const [applicants] = useState(MOCK_APPROVED);

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ready for Onboarding
          </h1>
          <p className="text-gray-500">
            Startups endorsed by experts, awaiting final approval.
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
              placeholder="Search..."
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
                  Startup
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Innovation Score
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Endorsed By
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
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
                  onClick={() => navigate(`/admin/onboarding/${app.id}`)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {app.startupName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app.founderName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-gray-900">
                      {app.innovationScore}
                    </span>
                    <span className="text-gray-400 text-xs">/100</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit">
                      <UserCheck className="w-4 h-4" />
                      {app.endorsedBy}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {app.endorsedDate}
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
