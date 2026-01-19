import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { API_URL } from "../../config";
import ApplicationFullView from "../../components/common/ApplicationFullView";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/TextArea";

export default function ExpertReviewPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Data State
  const [appData, setAppData] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [expertName, setExpertName] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(
    null,
  );
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing access token. Please check the link in your email.");
      setIsLoading(false);
      return;
    }

    const fetchReviewContext = async () => {
      try {
        const res = await fetch(`${API_URL}/api/expert/context?token=${token}`);

        if (!res.ok) {
          if (res.status === 404)
            throw new Error("This review link is invalid or expired.");
          if (res.status === 403)
            throw new Error("This review has already been submitted.");
          throw new Error("Unable to load application data.");
        }

        const data = await res.json();

        // Safety Check: ensure objects exist
        setAppData(data.application || {});
        setAssessments(Array.isArray(data.assessments) ? data.assessments : []);
        setExpertName(data.expertName || "Expert");
      } catch (err: any) {
        console.error("Expert Load Error:", err);
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
      alert(
        "Please provide more detailed feedback for rejection (min 20 chars).",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/expert/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, decision, comments }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setIsSuccess(true);
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">
          Loading Application Context...
        </p>
      </div>
    );
  }

  // --- ERROR ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full p-8 text-center shadow-xl border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  // --- SUCCESS ---
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-lg w-full p-10 text-center shadow-xl border-green-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Review Submitted
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you, <strong>{expertName}</strong>. Your expert assessment has
            been securely recorded.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "https://artpark.in")}
          >
            Return to ARTPARK Website
          </Button>
        </Card>
      </div>
    );
  }

  // --- MAIN VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-lg">
              AP
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Expert Review Portal
              </h1>
              <p className="text-xs text-gray-500">Confidential Evaluation</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 hidden sm:block">
            Reviewing as{" "}
            <span className="font-semibold text-gray-900">{expertName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Application Content */}
        <div className="lg:col-span-3">
          <ApplicationFullView
            applicationData={appData}
            assessments={assessments}
          />
        </div>

        {/* Decision Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28 border-indigo-100 shadow-xl overflow-hidden">
            <div className="bg-indigo-900 p-4 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" /> Final Verdict
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDecision("APPROVED")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    decision === "APPROVED"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <CheckCircle
                    className={`w-6 h-6 ${
                      decision === "APPROVED"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="text-sm font-bold">Endorse</span>
                </button>
                <button
                  onClick={() => setDecision("REJECTED")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    decision === "REJECTED"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <XCircle
                    className={`w-6 h-6 ${
                      decision === "REJECTED" ? "text-red-600" : "text-gray-400"
                    }`}
                  />
                  <span className="text-sm font-bold">Reject</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Expert Comments
                </label>
                <Textarea
                  placeholder={
                    decision === "APPROVED"
                      ? "Reason for endorsement (optional)..."
                      : "Reason for rejection (required)..."
                  }
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={5}
                  className="resize-none text-sm"
                />
              </div>

              <Button
                className={`w-full py-6 font-bold text-lg shadow-lg ${
                  decision === "APPROVED"
                    ? "bg-green-600 hover:bg-green-700"
                    : decision === "REJECTED"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-400"
                }`}
                disabled={!decision || isSubmitting}
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                Submit Decision
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
