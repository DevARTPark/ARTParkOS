import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Textarea } from "../../components/ui/Input";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  FileText,
  ExternalLink,
  Lock,
  Save,
  Loader2,
} from "lucide-react";
import { API_URL } from "../../config";

export function AssessmentReview() {
  const navigate = useNavigate();
  const { id } = useParams(); // This is the Submission ID passed from URL
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data from Backend
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [subRes, qRes] = await Promise.all([
          fetch(`${API_URL}/api/reviewer/submission/${id}`),
          fetch(`${API_URL}/api/assessment/questions`),
        ]);

        if (subRes.ok && qRes.ok) {
          const subData = await subRes.json();
          const qData = await qRes.json();

          setSubmission(subData);
          setQuestions(qData);

          // Pre-fill evaluations if they exist (for read-only or resume)
          const initialEvals: any = {};
          if (subData.answers) {
            subData.answers.forEach((ans: any) => {
              // Only pre-fill if Reviewer has actually graded it
              if (ans.rating || ans.comments) {
                initialEvals[ans.questionId] = {
                  rating: ans.rating,
                  comment: ans.comments,
                };
              }
            });
          }
          setEvaluations(initialEvals);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error loading review data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 2. Derived Data Logic
  // Filter questions that are actually present in the submission answers
  const relevantQuestions = submission?.answers
    ? questions.filter((q) =>
        submission.answers.some((a: any) => a.questionId === q.id)
      )
    : [];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const selectedQuestion = relevantQuestions[currentQIndex];

  // Logic: Read Only if status is Completed
  const isReadOnly =
    location.state?.readOnly ||
    (submission && submission.status === "COMPLETED");

  // Helper to get Founder's Answer data for the current question
  const getCurrentAnswer = (qId: string) =>
    submission?.answers.find((a: any) => a.questionId === qId);

  // 3. Handlers
  const handleEvaluation = (key: string, value: any) => {
    if (isReadOnly || !selectedQuestion) return;
    setEvaluations((prev) => ({
      ...prev,
      [selectedQuestion.id]: { ...prev[selectedQuestion.id], [key]: value },
    }));
  };

  const handleSaveReview = async () => {
    if (
      !window.confirm("Complete review? This will update the project's status.")
    )
      return;
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${API_URL}/api/reviewer/submission/${id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evaluations,
            status: "COMPLETED",
          }),
        }
      );

      if (res.ok) {
        navigate("/reviewer/dashboard");
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      alert("Error submitting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Render Guards
  if (isLoading)
    return (
      <DashboardLayout role="reviewer" title="Assessment Review">
        <div className="flex h-[60vh] justify-center items-center flex-col gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading Submission...</p>
        </div>
      </DashboardLayout>
    );

  if (!selectedQuestion)
    return (
      <DashboardLayout role="reviewer" title="Assessment Review">
        <div className="p-8 text-center text-gray-500">
          No questions found for this submission.
        </div>
      </DashboardLayout>
    );

  const answerData = getCurrentAnswer(selectedQuestion.id);

  return (
    <DashboardLayout
      role="reviewer"
      title={`Review: ${submission?.project?.startup?.name || "Startup"} - ${
        submission?.project?.name
      }`}
    >
      {isReadOnly && (
        <div className="bg-amber-50 border-b border-amber-100 p-3 text-center text-sm text-amber-800 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          <strong>Read Only Mode:</strong> This review has been completed.
        </div>
      )}

      <div className={`grid grid-cols-12 gap-6 h-[calc(100vh-10rem)]`}>
        {/* Left: Question List */}
        <div className="col-span-3 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-900">
                Questions ({relevantQuestions.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {relevantQuestions.map((q: any, idx: number) => {
                const isAnswered = evaluations[q.id]?.rating;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      selectedQuestion.id === q.id
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500">
                        Q{idx + 1}
                      </span>
                      {isAnswered && (
                        <Check className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {q.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Middle: Founder Answer (Read Only) */}
        <div className="col-span-5 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-6 border-b border-gray-100">
              <Badge variant="info" className="mb-2">
                {selectedQuestion.category}
              </Badge>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedQuestion.text}
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Founder Response
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
                  <div className="flex items-center mb-3">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
                        answerData?.response === "met"
                          ? "bg-green-100 text-green-800"
                          : answerData?.response === "partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {answerData?.response === "met" ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {answerData?.response
                        ? answerData.response.toUpperCase()
                        : "NO RESPONSE"}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {answerData?.notes || "No additional notes provided."}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Evidence
                </h4>
                {answerData?.evidenceFile || answerData?.evidenceUrl ? (
                  <div className="space-y-2">
                    {answerData?.evidenceFile && (
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FileText className="w-8 h-8 text-blue-500 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {answerData.evidenceFile}
                          </p>
                          <p className="text-xs text-gray-500">File Upload</p>
                        </div>
                      </div>
                    )}
                    {answerData?.evidenceUrl && (
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <ExternalLink className="w-8 h-8 text-blue-500 mr-3" />
                        <div className="flex-1">
                          <a
                            href={answerData.evidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline truncate block w-48"
                          >
                            {answerData.evidenceUrl}
                          </a>
                          <p className="text-xs text-gray-500">External Link</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No evidence provided.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Reviewer Input */}
        <div className="col-span-4 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-4 border-b border-gray-100 bg-blue-50/30 rounded-t-lg">
              <h3 className="font-semibold text-gray-900">Your Evaluation</h3>
            </div>
            <div
              className={`p-6 flex-1 overflow-y-auto ${
                isReadOnly ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Did they meet this criteria?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["yes", "partial", "no"].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleEvaluation("rating", rating)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                          evaluations[selectedQuestion.id]?.rating === rating
                            ? "bg-blue-100 border-blue-500 text-blue-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-xs font-medium uppercase">
                          {rating}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Comments / Feedback"
                  placeholder={
                    isReadOnly
                      ? "Read-only mode"
                      : "Provide detailed feedback regarding their answer..."
                  }
                  rows={6}
                  disabled={isReadOnly}
                  value={evaluations[selectedQuestion.id]?.comment || ""}
                  onChange={(e) => handleEvaluation("comment", e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              {isReadOnly ? (
                <div className="text-center text-xs text-gray-500 italic">
                  Review Completed
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (currentQIndex < relevantQuestions.length - 1)
                        setCurrentQIndex((prev) => prev + 1);
                    }}
                  >
                    Next Question
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSaveReview}
                    disabled={
                      isSubmitting ||
                      Object.keys(evaluations).length < relevantQuestions.length
                    }
                    leftIcon={
                      isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )
                    }
                  >
                    {isSubmitting ? "Saving..." : "Complete Review"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
