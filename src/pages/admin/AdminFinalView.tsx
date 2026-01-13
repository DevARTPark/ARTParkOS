import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Quote } from "lucide-react";
import { API_URL } from "../../config";
import ApplicationFullView from "../../components/common/ApplicationFullView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function AdminFinalView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appData, setAppData] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [expertReview, setExpertReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        // 1. Fetch Application & Assessment
        const appRes = await fetch(
          `${API_URL}/api/onboarding/application?userId=${id}`
        );
        const appJson = await appRes.json();
        setAppData(appJson);

        // 2. Fetch Expert Review Data (Mock for now)
        // In real backend: fetch from /api/admin/expert-reviews?applicantId=...
        setExpertReview({
          expertName: "Dr. Ramesh Rao",
          decision: "APPROVED",
          comments:
            "This startup has a very solid technical foundation. The team is capable, and the market need is clear. Strongly recommend for incubation.",
          date: "Oct 27, 2023",
        });
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFinalDecision = async (status: "APPROVED" | "REJECTED") => {
    if (!window.confirm(`Are you sure you want to ${status} this startup?`))
      return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          status: status,
        }),
      });

      if (!response.ok) throw new Error("Action failed");

      alert(
        status === "APPROVED"
          ? "Startup Onboarded Successfully!"
          : "Application Rejected."
      );
      navigate("/admin/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert("Error processing request.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Final Onboarding Review
            </h2>
            <p className="text-xs text-gray-500">Decision Gate</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => handleFinalDecision("REJECTED")}
            disabled={isProcessing}
          >
            <XCircle className="w-4 h-4 mr-2" /> Reject Application
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleFinalDecision("APPROVED")}
            isLoading={isProcessing}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Approve & Onboard
          </Button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* --- LEFT: MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">
          <ApplicationFullView
            applicationData={appData}
            assessmentData={assessmentData}
          />
        </div>

        {/* --- RIGHT: EXPERT FEEDBACK & SUMMARY --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Expert Endorsement Card */}
          <Card className="border-green-200 bg-green-50/30 sticky top-24 shadow-md">
            <CardHeader className="border-b border-green-100 pb-3">
              <CardTitle className="text-green-800 flex items-center gap-2 text-base">
                <CheckCircle className="w-5 h-5" /> Expert Endorsement
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                  Reviewer
                </p>
                <p className="font-semibold text-gray-900">
                  {expertReview?.expertName}
                </p>
                <p className="text-xs text-gray-500">{expertReview?.date}</p>
              </div>

              <div className="relative pl-4 border-l-4 border-green-300">
                <Quote className="w-4 h-4 text-green-400 absolute -top-1 -left-6" />
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "{expertReview?.comments}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Summary Card (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" /> Innovation
                Score {">"} 75
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" /> Documents
                Verified
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" /> Expert
                Approval Received
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
