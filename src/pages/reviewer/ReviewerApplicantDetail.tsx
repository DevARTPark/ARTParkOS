import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle, Mail } from "lucide-react";
import { API_URL } from "../../config";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import ApplicationFullView from "../../components/common/ApplicationFullView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function ReviewerApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appData, setAppData] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delegation State
  const [expertName, setExpertName] = useState("");
  const [expertEmail, setExpertEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);

        // 1. Fetch Application Data
        const appRes = await fetch(
          `${API_URL}/api/onboarding/application?userId=${id}`,
        );
        if (!appRes.ok) throw new Error("Failed to load application");
        const appJson = await appRes.json();
        setAppData(appJson);

        // 2. Fetch Team Assessments (REAL DATA ONLY)
        try {
          const scoreRes = await fetch(
            `${API_URL}/api/innovation/team-assessments?userId=${id}`,
          );

          if (scoreRes.ok) {
            const scoreJson = await scoreRes.json();
            // ✅ FIX: Use real data. If array is empty, show empty.
            // Do NOT fall back to mock data.
            setAssessments(Array.isArray(scoreJson) ? scoreJson : []);
          } else {
            console.warn(
              "Assessment API returned non-200. Defaulting to empty.",
            );
            setAssessments([]); // Set empty, not mock
          }
        } catch (e) {
          console.error("Assessment fetch failed", e);
          setAssessments([]); // Set empty, not mock
        }
      } catch (error) {
        console.error("Failed to load application context", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAssignExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertEmail || !expertName) return;

    setIsSending(true);
    try {
      const response = await fetch(`${API_URL}/api/reviewer/assign-expert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantUserId: id,
          expertName,
          expertEmail,
        }),
      });

      if (!response.ok) throw new Error("Failed to send invite");

      setInviteSent(true);
    } catch (error) {
      alert("Error sending invite. Please try again.");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading)
    return (
      <DashboardLayout role="reviewer">
        <div className="p-10 text-center text-gray-500">
          Loading application data...
        </div>
      </DashboardLayout>
    );
  if (!appData)
    return (
      <DashboardLayout role="reviewer">
        <div className="p-10 text-center text-red-500">
          Application not found.
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout role="reviewer">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Application Review
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-600">
                ID: {id}
              </span>
              {appData.status && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                  {appData.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT: MAIN APPLICATION VIEW (2/3 width) --- */}
          <div className="lg:col-span-2">
            <ApplicationFullView
              applicationData={appData}
              assessments={assessments}
            />
          </div>

          {/* --- RIGHT: ACTIONS & DELEGATION (1/3 width) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Assign Expert Card */}
            <Card className="border-indigo-100 shadow-lg sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="w-5 h-5" /> Assign to Expert
                </CardTitle>
                <p className="text-indigo-100 text-xs mt-1">
                  Send a secure magic link for domain validation.
                </p>
              </div>

              <CardContent className="pt-6">
                {!inviteSent ? (
                  <form onSubmit={handleAssignExpert} className="space-y-4">
                    <div className="space-y-3">
                      <Input
                        label="Expert Name"
                        placeholder="e.g. Dr. Ramesh Rao"
                        value={expertName}
                        onChange={(e) => setExpertName(e.target.value)}
                        required
                      />
                      <Input
                        label="Expert Email"
                        type="email"
                        placeholder="expert@university.edu"
                        value={expertEmail}
                        onChange={(e) => setExpertEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      isLoading={isSending}
                    >
                      <Mail className="w-4 h-4 mr-2" /> Send Review Invite
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Invite Sent!
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 px-4">
                      An email has been sent to <strong>{expertEmail}</strong>.
                      You will be notified once they submit their decision.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 w-full"
                      onClick={() => {
                        setInviteSent(false);
                        setExpertEmail("");
                      }}
                    >
                      Assign Another Expert
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px] resize-none"
                  placeholder="Add private notes for the admin team..."
                />
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="secondary">
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
