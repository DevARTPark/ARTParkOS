import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Input, Textarea } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Upload,
  Info,
  Lightbulb,
  Link as LinkIcon,
  Save,
  Clock,
  FileText,
  X,
  CheckCheck,
  ShieldCheck, // Added for Locked Status icon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config";

export function AIRLAssessment() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. State Management ---
  const [questions, setQuestions] = useState<any[]>([]); // Dynamic Questions from API
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userStr = localStorage.getItem("artpark_user");
  const user = userStr ? JSON.parse(userStr) : null;

  // --- 2. Fetch Initial Data (Projects & Questions) ---
  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [projectsRes, questionsRes] = await Promise.all([
          fetch(`${API_URL}/api/projects?userId=${user.id}`),
          fetch(`${API_URL}/api/assessment/questions`),
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (Array.isArray(projectsData)) {
            setAllProjects(projectsData);
            if (projectsData.length > 0 && !searchParams.get("projectId")) {
              setSearchParams({ projectId: projectsData[0].id });
              setSelectedProjectId(projectsData[0].id);
            }
          }
        }

        if (questionsRes.ok) {
          const questionsData = await questionsRes.json();
          setQuestions(questionsData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const initialProjectId = searchParams.get("projectId") || "";
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

  useEffect(() => {
    const pid = searchParams.get("projectId");
    if (pid) setSelectedProjectId(pid);
  }, [searchParams]);

  // Logic State
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

  // Submission & Locking State
  const [submissionStatus, setSubmissionStatus] = useState<
    "draft" | "submitted"
  >("draft");
  const [isLockedByReviewer, setIsLockedByReviewer] = useState(false);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(
    null
  );

  const selectedProject =
    allProjects.find((p: any) => p.id === selectedProjectId) || allProjects[0];

  // --- 3. Check Submission Status & Load Drafts ---
  useEffect(() => {
    if (!selectedProject) return;
    const targetLevel = (selectedProject.currentAIRL || 0) + 1;

    // Check Backend Status
    const checkStatus = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/assessment/submission?projectId=${selectedProjectId}&targetLevel=${targetLevel}`
        );
        if (res.ok) {
          const sub = await res.json();
          if (sub) {
            setCurrentSubmissionId(sub.id);
            if (sub.status === "IN_REVIEW" || sub.status === "COMPLETED") {
              setIsLockedByReviewer(true);
              setSubmissionStatus("submitted");
            } else if (sub.status === "SUBMITTED") {
              setIsLockedByReviewer(false);
              setSubmissionStatus("submitted");
            } else {
              setIsLockedByReviewer(false);
              setSubmissionStatus("draft");
            }
          } else {
            setSubmissionStatus("draft");
            setIsLockedByReviewer(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkStatus();

    // Load Local Storage Drafts (Preserving your logic)
    const storageKey = `artpark_assessment_${selectedProjectId}_AIRL${targetLevel}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAnswers(parsed.answers || {});
      setCompletedQuestions(parsed.completedQuestions || []);
      setFounderNotes(parsed.founderNotes || {});
      setEvidenceLinks(parsed.evidenceLinks || {});
      setEvidenceFiles(parsed.evidenceFiles || {});
    } else {
      setAnswers({});
      setCompletedQuestions([]);
      setFounderNotes({});
      setEvidenceFiles({});
    }
    setCurrentQuestionIndex(0);
  }, [selectedProjectId, selectedProject?.currentAIRL]);

  // --- 4. Handlers ---

  const saveToStorage = (status: "draft" | "submitted") => {
    if (!selectedProject) return;
    const targetLevel = (selectedProject.currentAIRL || 0) + 1;
    const storageKey = `artpark_assessment_${selectedProjectId}_AIRL${targetLevel}`;
    const dataToSave = {
      answers,
      completedQuestions,
      founderNotes,
      evidenceLinks,
      evidenceFiles,
      status,
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    setSubmissionStatus(status);
  };

  const handleFinalSubmit = async () => {
    // API Submit Logic
    const payload = {
      projectId: selectedProjectId,
      targetLevel: (selectedProject.currentAIRL || 0) + 1,
      answers,
      founderNotes,
      evidenceLinks,
      evidenceFiles,
    };

    try {
      const res = await fetch(`${API_URL}/api/assessment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.submissionId) setCurrentSubmissionId(data.submissionId);

        saveToStorage("submitted"); // Keep local sync
        setSubmissionStatus("submitted");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("Failed to submit.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleRecall = async () => {
    if (!currentSubmissionId) return;
    if (
      !window.confirm(
        "Recall submission? This will pull it back from the Reviewer Pool."
      )
    )
      return;

    try {
      const res = await fetch(`${API_URL}/api/assessment/recall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: currentSubmissionId }),
      });

      if (res.ok) {
        setSubmissionStatus("draft");
        saveToStorage("draft"); // Update local state
      } else {
        alert("Cannot recall. A reviewer might have already accepted it.");
        window.location.reload();
      }
    } catch (err) {
      alert("Error recalling.");
    }
  };

  const handleAnswer = (val: string) => {
    if (submissionStatus === "submitted") return;
    const qId = questions[currentQuestionIndex]?.id;
    if (!qId) return;

    setAnswers({ ...answers, [qId]: val });
    if (!completedQuestions.includes(qId))
      setCompletedQuestions([...completedQuestions, qId]);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file && questions[currentQuestionIndex]) {
      setEvidenceFiles({
        ...evidenceFiles,
        [questions[currentQuestionIndex].id]: file.name,
      });
    }
  };

  const handleRemoveFile = (e: any) => {
    e.stopPropagation();
    const updated = { ...evidenceFiles };
    const qId = questions[currentQuestionIndex]?.id;
    if (qId) delete updated[qId];
    setEvidenceFiles(updated);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileClick = () => {
    if (submissionStatus !== "submitted" && fileInputRef.current)
      fileInputRef.current.click();
  };

  // --- 5. Render Guards ---
  if (isLoading)
    return (
      <DashboardLayout role="founder" title="Assessment">
        <div className="p-8 text-center text-gray-500">Loading...</div>
      </DashboardLayout>
    );
  if (allProjects.length === 0)
    return (
      <DashboardLayout role="founder" title="Assessment">
        <div className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
          <Button onClick={() => navigate("/founder/projects")}>
            Create Project
          </Button>
        </div>
      </DashboardLayout>
    );
  if (!selectedProject)
    return (
      <DashboardLayout role="founder" title="Assessment">
        <div className="p-8">Select a project</div>
      </DashboardLayout>
    );

  // --- Derived State ---
  const currentOfficialLevel = selectedProject.currentAIRL || 0;
  const targetLevel = currentOfficialLevel + 1;
  const relevantQuestions = questions
    .filter((q: any) => q.airlLevel === targetLevel)
    .sort((a: any, b: any) => a.airlLevel - b.airlLevel);
  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const totalQuestions = relevantQuestions.length;
  const progress =
    totalQuestions > 0 ? (completedQuestions.length / totalQuestions) * 100 : 0;

  return (
    <DashboardLayout role="founder" title="AIRL Assessment">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* HEADER */}
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

      {/* --- STATUS VIEW (The nice "Submitted" screen) --- */}
      {submissionStatus === "submitted" ? (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center animate-in fade-in zoom-in duration-500">
          {/* Dynamic Icon based on Review Status */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              isLockedByReviewer ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            {isLockedByReviewer ? (
              <ShieldCheck className="w-12 h-12 text-blue-600" />
            ) : (
              <Clock className="w-12 h-12 text-green-600" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLockedByReviewer ? "Assessment Accepted" : "Awaiting Review"}
          </h2>

          <p className="text-gray-500 max-w-lg mb-8 text-lg">
            {isLockedByReviewer
              ? "A reviewer has accepted your assessment and is currently evaluating it. Editing is disabled."
              : `Your assessment for AIRL ${targetLevel} has been submitted. It is waiting in the reviewer pool.`}
          </p>

          {/* Recall Button (Only if NOT locked) */}
          {!isLockedByReviewer && (
            <Button
              variant="outline"
              onClick={handleRecall}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              Recall Submission (Edit)
            </Button>
          )}

          {isLockedByReviewer && (
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Locked by Reviewer</span>
            </div>
          )}
        </div>
      ) : (
        /* --- FORM VIEW (Kept your original 2-column layout) --- */
        <div className="flex flex-col lg:flex-row h-auto min-h-[600px] gap-6">
          {/* LEFT: QUESTION CARD */}
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
                  {currentQuestion && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col"
                      >
                        {/* Question Header */}
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

                          {/* Expectations Dropdown */}
                          <AnimatePresence>
                            {showInfo && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                                  <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
                                    <Lightbulb className="w-4 h-4" />{" "}
                                    Expectations
                                  </div>
                                  <ul className="list-disc list-inside space-y-1">
                                    {currentQuestion.expectations?.map(
                                      (e: string, i: number) => (
                                        <li
                                          key={i}
                                          className="text-sm text-blue-700"
                                        >
                                          {e}
                                        </li>
                                      )
                                    ) || (
                                      <li className="text-sm text-gray-500">
                                        No guidance.
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-8 flex-1">
                          {/* Answer Buttons */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">
                              Compliance Status
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {["met", "partial", "not_met"].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleAnswer(st)}
                                  className={`py-3 px-4 rounded-lg border-2 font-bold text-sm capitalize ${
                                    answers[currentQuestion.id] === st
                                      ? "border-blue-600 bg-blue-50 text-blue-700"
                                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {st.replace("_", " ")}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Notes */}
                          <Textarea
                            label="Founder Notes / Context"
                            rows={3}
                            value={founderNotes[currentQuestion.id] || ""}
                            onChange={(e) =>
                              setFounderNotes({
                                ...founderNotes,
                                [currentQuestion.id]: e.target.value,
                              })
                            }
                          />

                          {/* Link */}
                          <div className="relative">
                            <Input
                              label="Evidence Link"
                              placeholder="https://..."
                              value={evidenceLinks[currentQuestion.id] || ""}
                              onChange={(e) =>
                                setEvidenceLinks({
                                  ...evidenceLinks,
                                  [currentQuestion.id]: e.target.value,
                                })
                              }
                            />
                            <LinkIcon className="absolute right-3 top-9 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>

                          {/* File Upload */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                              Evidence File
                            </label>
                            <div
                              onClick={handleFileClick}
                              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer ${
                                evidenceFiles[currentQuestion.id]
                                  ? "border-green-300 bg-green-50 hover:bg-green-100"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {evidenceFiles[currentQuestion.id] ? (
                                <>
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                    <FileText className="w-5 h-5 text-green-600" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-900 px-4 break-all">
                                    {evidenceFiles[currentQuestion.id]}
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                    <span className="text-xs text-green-600 font-bold uppercase">
                                      Uploaded
                                    </span>{" "}
                                    <button
                                      onClick={handleRemoveFile}
                                      className="z-10 p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-500"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                    <Upload className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    PDF, DOCX, JPG up to 10MB
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Navigation */}
                          <div className="flex justify-between pt-6 mt-4 border-t border-gray-100">
                            <Button
                              variant="outline"
                              disabled={currentQuestionIndex === 0}
                              onClick={() =>
                                setCurrentQuestionIndex((i) =>
                                  Math.max(0, i - 1)
                                )
                              }
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
                                setCurrentQuestionIndex((i) =>
                                  Math.min(totalQuestions - 1, i + 1)
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
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT: SIDEBAR */}
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
                  {relevantQuestions.map((q: any, i: number) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${
                        i === currentQuestionIndex
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
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
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
