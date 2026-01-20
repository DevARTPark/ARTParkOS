import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import { API_URL } from "../../config";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";

export default function AdminApprovedList() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/approved-list`);
        if (res.ok) {
          setCandidates(await res.json());
        }
      } catch (error) {
        console.error("Failed to load approved list", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApproved();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Ready for Onboarding
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Startups that have passed expert validation gates.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-xl">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : candidates.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No approved applications pending onboarding.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <th className="p-5 pl-6">Startup Details</th>
                  <th className="p-5">Innovation Score</th>
                  <th className="p-5">Endorsed By</th>
                  <th className="p-5">Validation Date</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => navigate(`/admin/onboarding/${app.id}`)}
                    className="hover:bg-green-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="p-5 pl-6">
                      <div className="font-bold text-gray-900 text-base">
                        {app.startupName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {app.founderName}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <span className="font-bold text-green-700">
                          {app.score}
                        </span>
                        <span className="text-green-400 text-xs">/100</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <UserCheck className="w-4 h-4 text-indigo-500" />{" "}
                        {app.endorsedBy}
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-500">{app.date}</td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-indigo-600 font-medium text-sm group-hover:underline">
                        Final Review <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
