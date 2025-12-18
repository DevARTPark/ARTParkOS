import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Textarea } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { airlQuestions, projects } from "../../data/mockData";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Import the new Chart Component
import { AIRLRadarChart } from "../../components/charts/AIRLRadarChart";

export function AIRLAssessment() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Determine Initial Project
  const initialProjectId =
    searchParams.get("projectId") || projects[0]?.id || "";

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);

  // 2. Derive Project Data
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  
  // 3. Calculate Target Level (Current + 1)
  // Example: If project is AIRL 3, we show AIRL 4 questions
  const targetLevel = selectedProject ? selectedProject.currentAIRL + 1 : 1;

  // 4. Filter Questions for Target Level
  const relevantQuestions = airlQuestions.filter(q => q.airlLevel === targetLevel);
  
  // Reset index when project/level changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    // Optional: Reset answers or fetch saved draft for this project
    setCompletedQuestions([]); 
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  // 3. Calculate Target Level
  const targetLevel = selectedProject ? selectedProject.currentAIRL + 1 : 1;

  // 4. Filter Questions
  const relevantQuestions = airlQuestions.filter(
    (q) => q.airlLevel === targetLevel
  );

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setCompletedQuestions([]);
  }, [selectedProjectId, targetLevel]);

  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const totalQuestions = relevantQuestions.length;
  const progress = totalQuestions > 0 ? (completedQuestions.length / totalQuestions) * 100 : 0;

  // Handle Project Switch
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedProjectId(newId);
    setSearchParams({ projectId: newId }); // Update URL
  const progress =
    totalQuestions > 0 ? (completedQuestions.length / totalQuestions) * 100 : 0;

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedProjectId(newId);
    setSearchParams({ projectId: newId });
  };

  const handleAnswer = (value: string) => {
    if (!currentQuestion) return;
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
    setAnswers({ ...answers, [currentQuestion.id]: value });
    if (!completedQuestions.includes(currentQuestion.id)) {
      setCompletedQuestions([...completedQuestions, currentQuestion.id]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <DashboardLayout role="founder" title="AIRL Assessment">
      {/* Project Selector & Context Header */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
            Assessing Project
          </label>
          <Select
            value={selectedProjectId}
            onChange={handleProjectChange}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Status</p>
            <p className="font-bold text-gray-900">AIRL {selectedProject.currentAIRL}</p>
            <p className="font-bold text-gray-900">
              AIRL {selectedProject.currentAIRL}
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

      <div className="flex flex-col lg:flex-row h-[calc(100vh-14rem)] gap-6">
        {/* Left Pane: Question View */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col shadow-md border-0">
            {relevantQuestions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  No Assessment Pending
                </h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  There are no questions defined for{" "}
                  <strong>AIRL {targetLevel}</strong> yet.
                </p>
              </div>
            ) : (
              <>
                <div className="p-8 flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <Badge variant="neutral" className="mb-4">
                          {currentQuestion.category}
                        </Badge>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                          {currentQuestion.text}
                        </h2>
                      </div>

                      <div className="space-y-8">
                        {/* 3-State Response */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700 block">
                            Compliance Status
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                              onClick={() => handleAnswer("met")}
                              className={`py-3 px-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center ${
                                answers[currentQuestion.id] === "met"
                                  ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                                  : "border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600"
                              }`}
                            >
                              <span className="font-bold text-sm">
                                Fully Met
                              </span>
                            </button>
                            <button
                              onClick={() => handleAnswer("partial")}
                              className={`py-3 px-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center ${
                                answers[currentQuestion.id] === "partial"
                                  ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                                  : "border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-600"
                              }`}
                            >
                              <span className="font-bold text-sm">
                                Partially Met
                              </span>
                            </button>
                            <button
                              onClick={() => handleAnswer("not_met")}
                              className={`py-3 px-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center ${
                                answers[currentQuestion.id] === "not_met"
                                  ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                                  : "border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600"
                              }`}
                            >
                              <span className="font-bold text-sm">Not Met</span>
                            </button>
                          </div>
                        </div>

                        {/* Notes */}
                        <Textarea
                          label="Founder Notes / Context"
                          placeholder="Add any additional context or explanation here..."
                          rows={4}
                        />

                        {/* Link Box */}
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700 block">
                            Supporting Link
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-400 text-xs">
                                https://
                              </span>
                            </div>
                            <input
                              type="text"
                              className="block w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="github.com/repo or drive.google.com/..."
                            />
                          </div>
                        </div>

                        {/* Evidence Upload */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Evidence
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                              <Upload className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOCX, JPG up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-gray-500 font-medium">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </div>
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                  >
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Right Pane: Checklist Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col border-0 shadow-md">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <h3 className="font-bold text-lg">AIRL {targetLevel} Progress</h3>
              <p className="text-blue-100 text-sm mt-1">
                {selectedProject.name}
              </p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {/* Added Radar Chart Here */}
              <div className="p-4 border-b border-gray-100">
                <AIRLRadarChart />
              </div>

              <div className="p-6 border-b border-gray-100">
                <ProgressBar value={progress} showLabel />
              </div>

              <div className="divide-y divide-gray-100">
                {relevantQuestions.length === 0 ? (
                  <p className="p-6 text-sm text-gray-500 text-center italic">
                    No questions available.
                  </p>
                ) : (
                  relevantQuestions.map((q, idx) => {
                    const isCompleted = completedQuestions.includes(q.id);
                    const isActive = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${
                          isActive ? "bg-blue-50" : ""
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex-shrink-0 ${
                            isCompleted ? "text-green-500" : "text-gray-300"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isCompleted ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {q.category}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {q.text}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <Button
                className="w-full"
                disabled={
                  relevantQuestions.length === 0 ||
                  completedQuestions.length < totalQuestions
                }
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Submit for AIRL {targetLevel}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}