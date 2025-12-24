import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Input, Textarea } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { airlQuestions as defaultQuestions } from "../../data/mockData";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Upload,
  Info,
  Lightbulb,
  Link,
  Save,
  Clock,
  CheckCheck,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config";

const getTodayString = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function AIRLAssessment() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [questions] = useState(defaultQuestions);

  // --- 1. Fetch Real Projects for Dropdown ---
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const userStr = localStorage.getItem("artpark_user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API_URL}/api/projects?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllProjects(data);
          // If no ID selected, select first
          if (!searchParams.get("projectId")) {
            setSearchParams({ projectId: data[0].id });
            setSelectedProjectId(data[0].id);
          }
        }
      })
      .catch((err) => console.error("Assessment fetch error:", err));
  }, [user?.id]);

  const initialProjectId = searchParams.get("projectId") || "";
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

  // Ensure selectedProjectId updates if URL changes externally
  useEffect(() => {
    const pid = searchParams.get("projectId");
    if (pid) setSelectedProjectId(pid);
  }, [searchParams]);

  // Standard Logic
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [founderNotes, setFounderNotes] = useState<Record<string, string>>({});
  const [evidenceLinks, setEvidenceLinks] = useState<Record<string, string>>(
    {}
  );
  const [evidenceFiles, setEvidenceFiles] = useState<Record<string, string>>(
    {}
  );
  const [showInfo, setShowInfo] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "draft" | "submitted"
  >("draft");
  const [isLockedByReviewer, setIsLockedByReviewer] = useState(false);

  const selectedProject =
    allProjects.find((p: any) => p.id === selectedProjectId) || allProjects[0];

  if (!selectedProject && allProjects.length === 0)
    return (
      <DashboardLayout role="founder" title="Assessment">
        <div>Loading...</div>
      </DashboardLayout>
    );
  if (!selectedProject)
    return (
      <DashboardLayout role="founder" title="Assessment">
        <div>Select a project</div>
      </DashboardLayout>
    );

  // Logic for Levels (Using Real Project Data)
  const currentOfficialLevel = selectedProject.currentAIRL || 0;
  const targetLevel = currentOfficialLevel + 1; // Always aim for next level

  const relevantQuestions = questions
    .filter((q: any) => q.airlLevel === targetLevel)
    .sort((a: any, b: any) => a.airlLevel - b.airlLevel);
  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const totalQuestions = relevantQuestions.length;
  const progress =
    totalQuestions > 0 ? (completedQuestions.length / totalQuestions) * 100 : 0;

  // --- SAVE/LOAD Logic (Local for now) ---
  useEffect(() => {
    const storageKey = `artpark_assessment_${selectedProjectId}_AIRL${targetLevel}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAnswers(parsed.answers || {});
      setCompletedQuestions(parsed.completedQuestions || []);
      setSubmissionStatus(parsed.status || "draft");
    } else {
      setAnswers({});
      setCompletedQuestions([]);
      setSubmissionStatus("draft");
    }
    setCurrentQuestionIndex(0);
  }, [selectedProjectId, targetLevel]);

  const saveToStorage = (status: "draft" | "submitted") => {
    const storageKey = `artpark_assessment_${selectedProjectId}_AIRL${targetLevel}`;
    const dataToSave = {
      answers,
      completedQuestions,
      founderNotes,
      evidenceLinks,
      status,
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    setSubmissionStatus(status);
  };

  // Handlers
  const handleAnswer = (val: string) => {
    if (!currentQuestion || submissionStatus === "submitted") return;
    setAnswers({ ...answers, [currentQuestion.id]: val });
    if (!completedQuestions.includes(currentQuestion.id))
      setCompletedQuestions([...completedQuestions, currentQuestion.id]);
  };

  const handleFinalSubmit = () => {
    saveToStorage("submitted");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file && currentQuestion) {
      setEvidenceFiles({ ...evidenceFiles, [currentQuestion.id]: file.name });
    }
  };

  return (
    <DashboardLayout role="founder" title="AIRL Assessment">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
            Assessing Project
          </label>
          <Select
            value={selectedProjectId}
            onChange={(e: any) => {
              setSelectedProjectId(e.target.value);
              setSearchParams({ projectId: e.target.value });
            }}
            options={allProjects.map((p: any) => ({
              value: p.id,
              label: p.name,
            }))}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Status</p>
            <p className="font-bold text-gray-900">
              AIRL {currentOfficialLevel}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className="text-right">
            <p className="text-xs text-blue-600 font-bold">Target</p>
            <Badge variant="info" className="text-lg px-3">
              AIRL {targetLevel}
            </Badge>
          </div>
        </div>
      </div>

      {submissionStatus === "submitted" ? (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center animate-in fade-in zoom-in duration-500">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-green-100`}
          >
            <Clock className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Awaiting Review
          </h2>
          <p className="text-gray-500 max-w-lg mb-8">
            Your assessment for AIRL {targetLevel} has been submitted.
          </p>
          <Button variant="outline" onClick={() => saveToStorage("draft")}>
            Recall Submission (Edit)
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row h-auto min-h-[600px] gap-6">
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col shadow-md border-0 h-full">
              {relevantQuestions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    No questions configured for this level.
                  </p>
                </div>
              ) : (
                <div className="p-8 flex-1 flex flex-col">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="neutral">
                            {currentQuestion.category}
                          </Badge>
                          <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                          {currentQuestion.text}
                        </h2>
                      </div>

                      <div className="space-y-8 flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {["met", "partial", "not_met"].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleAnswer(status)}
                              className={`py-3 px-4 rounded-lg border-2 transition-all capitalize font-bold text-sm ${
                                answers[currentQuestion.id] === status
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {status.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                        <Textarea
                          label="Notes"
                          rows={3}
                          value={founderNotes[currentQuestion.id] || ""}
                          onChange={(e) =>
                            setFounderNotes({
                              ...founderNotes,
                              [currentQuestion.id]: e.target.value,
                            })
                          }
                        />

                        <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setCurrentQuestionIndex((p) => Math.max(0, p - 1))
                            }
                            disabled={currentQuestionIndex === 0}
                            leftIcon={<ArrowLeft className="w-4 h-4" />}
                          >
                            Previous
                          </Button>
                          <div className="text-sm text-gray-500 font-medium">
                            Question {currentQuestionIndex + 1} of{" "}
                            {totalQuestions}
                          </div>
                          <Button
                            onClick={() =>
                              setCurrentQuestionIndex((p) =>
                                Math.min(totalQuestions - 1, p + 1)
                              )
                            }
                            disabled={
                              currentQuestionIndex === totalQuestions - 1
                            }
                          >
                            Next <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </Card>
          </div>
          <div className="w-full lg:w-80 flex flex-col">
            <Card className="h-full flex flex-col border-0 shadow-md">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                <h3 className="font-bold text-lg">AIRL {targetLevel}</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedProject.name}
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="p-6 border-b border-gray-100">
                  <ProgressBar value={progress} showLabel />
                </div>
                <div className="divide-y divide-gray-100">
                  {relevantQuestions.map((q: any, idx: number) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${
                        idx === currentQuestionIndex
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex-shrink-0 ${
                          completedQuestions.includes(q.id)
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      >
                        {completedQuestions.includes(q.id) ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {q.category}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {q.text}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => saveToStorage("draft")}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Draft
                </Button>
                <Button
                  className="w-full"
                  disabled={completedQuestions.length < totalQuestions}
                  leftIcon={<Lock className="w-4 h-4" />}
                  onClick={handleFinalSubmit}
                >
                  Submit
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
