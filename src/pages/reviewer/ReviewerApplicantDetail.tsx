import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { API_URL } from "../../config";
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
  const { id } = useParams(); // This is the userId of the applicant
  const navigate = useNavigate();

  const [appData, setAppData] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
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
        // 1. Fetch Application Data (Founder Profile, Venture Details)
        // Note: Using existing endpoint you have
        const appRes = await fetch(
          `${API_URL}/api/onboarding/application?userId=${id}`
        );
        const appJson = await appRes.json();
        setAppData(appJson);

        // 2. Fetch Assessment Data (Scores)
        // Note: You will need to create this endpoint later: /api/innovation/assessment?userId=...
        // For now, we mock it if it fails
        try {
          const scoreRes = await fetch(
            `${API_URL}/api/innovation/assessment?userId=${id}`
          );
          if (scoreRes.ok) {
            const scoreJson = await scoreRes.json();
            setAssessmentData(scoreJson);
          } else {
            // Mock data for display until backend is ready
            setAssessmentData({
              totalScore: 78,
              bucket: "GREEN",
              dimensionScores: {
                strategy: 18,
                culture: 15,
                operations: 15,
                mindset: 15,
                tactics: 15,
              },
            });
          }
        } catch (e) {
          console.warn("Assessment fetch failed, using fallback");
        }
      } catch (error) {
        console.error("Failed to load application", error);
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
      // Call the backend to generate token and send email
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
      // Optional: Update local status
    } catch (error) {
      alert("Error sending invite. Please try again.");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading application...</div>;
  if (!appData)
    return <div className="p-10 text-center">Application not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Application Review
          </h2>
          <p className="text-xs text-gray-500">ID: {id}</p>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT: MAIN APPLICATION VIEW (2/3 width) --- */}
        <div className="lg:col-span-2">
          {/* Reuse the component from Phase 1 */}
          <ApplicationFullView
            applicationData={appData}
            assessmentData={assessmentData}
          />
        </div>

        {/* --- RIGHT: ACTIONS & DELEGATION (1/3 width) --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Action Card */}
          <Card className="border-indigo-100 shadow-lg sticky top-24">
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
              <CardTitle className="text-indigo-900 flex items-center gap-2">
                <Send className="w-5 h-5" /> Assign to Expert
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!inviteSent ? (
                <form onSubmit={handleAssignExpert} className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Route this application to a subject matter expert for
                    validation. They will receive a secure, one-time review
                    link.
                  </p>

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

                  <Button className="w-full mt-2" isLoading={isSending}>
                    Send Review Invite
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Invite Sent!
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    An email has been sent to <strong>{expertEmail}</strong>.
                    <br />
                    You will be notified once they submit their decision.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 w-full"
                    onClick={() => setInviteSent(false)}
                  >
                    Assign Another Expert
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[100px]"
                placeholder="Add private notes for the admin team..."
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" variant="secondary">
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
