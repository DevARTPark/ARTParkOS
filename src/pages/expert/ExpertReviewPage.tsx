import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { API_URL } from "../../config";
import ApplicationFullView from "../../components/common/ApplicationFullView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/TextArea";

type Decision = "APPROVED" | "REJECTED" | null;

export default function ExpertReviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Data State
  const [appData, setAppData] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [expertName, setExpertName] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState<Decision>(null);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing review token.");
      setIsLoading(false);
      return;
    }

    const fetchReviewContext = async () => {
      try {
        // Backend endpoint to validate token and return ONLY this specific app's data
        // (You will implement this backend route in the next step)
        const res = await fetch(`${API_URL}/api/expert/context?token=${token}`);

        if (!res.ok) {
          if (res.status === 403)
            throw new Error("This link has expired or has already been used.");
          throw new Error("Invalid review link.");
        }

        const data = await res.json();
        setAppData(data.application);
        setAssessmentData(data.assessment);
        setExpertName(data.expertName); // Personalize the greeting
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewContext();
  }, [token]);

  const handleSubmit = async () => {
    if (!decision) return;
    if (decision === "REJECTED" && comments.length < 20) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/expert/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          decision,
          comments,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      setIsSuccess(true);
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER: LOADING / ERROR ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  // --- RENDER: SUCCESS STATE ---
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Review Submitted
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you, <strong>{expertName}</strong>. Your feedback has been
            recorded securely. The ARTPARK team will take it from here.
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "https://artpark.in")}
          >
            Return to ARTPARK Website
          </Button>
        </Card>
      </div>
    );
  }

  // --- RENDER: MAIN REVIEW PAGE ---
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* You can replace this with the Logo image */}
            <div className="bg-blue-600 text-white p-1.5 rounded font-bold text-sm">
              AP
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Expert Review Portal
              </h1>
              <p className="text-xs text-gray-500">
                Evaluating: {appData?.venture?.organizationName}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 hidden sm:block">
            Reviewing as{" "}
            <span className="font-semibold text-gray-900">{expertName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Application Content */}
        <div className="lg:col-span-2">
          <ApplicationFullView
            applicationData={appData}
            assessmentData={assessmentData}
          />
        </div>

        {/* RIGHT: Decision Panel (Sticky) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-indigo-100 shadow-xl overflow-hidden">
            <div className="bg-indigo-900 p-4 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Your Decision
              </h3>
              <p className="text-indigo-200 text-xs mt-1 opacity-90">
                Your endorsement is critical for this startup's incubation
                journey.
              </p>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Decision Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDecision("APPROVED")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    decision === "APPROVED"
                      ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500"
                      : "border-gray-200 hover:border-green-200 hover:bg-green-50/50 text-gray-600"
                  }`}
                >
                  <CheckCircle
                    className={`w-6 h-6 ${
                      decision === "APPROVED"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-bold text-sm">Endorse</span>
                </button>

                <button
                  onClick={() => setDecision("REJECTED")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    decision === "REJECTED"
                      ? "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500"
                      : "border-gray-200 hover:border-red-200 hover:bg-red-50/50 text-gray-600"
                  }`}
                >
                  <XCircle
                    className={`w-6 h-6 ${
                      decision === "REJECTED" ? "text-red-600" : "text-gray-400"
                    }`}
                  />
                  <span className="font-bold text-sm">Reject</span>
                </button>
              </div>

              {/* Feedback Area */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Expert Comments{" "}
                  {decision === "REJECTED" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <Textarea
                  placeholder={
                    decision === "APPROVED"
                      ? "Why do you recommend this startup? (Optional but helpful)"
                      : "What are the key reasons for rejection? (Required)"
                  }
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                className={`w-full py-6 text-lg shadow-lg transition-all ${
                  decision === "APPROVED"
                    ? "bg-green-600 hover:bg-green-700 shadow-green-200"
                    : decision === "REJECTED"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!decision || isSubmitting}
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
