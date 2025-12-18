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

export function AIRLAssessment() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine initial project
  const initialProjectId =
    searchParams.get("projectId") || projects[0]?.id || "";

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);

  // Derive project data
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Target AIRL level
  const targetLevel = selectedProject ? selectedProject.currentAIRL + 1 : 1;

  // Filter questions
  const relevantQuestions = airlQuestions.filter(
    (q) => q.airlLevel === targetLevel
  );

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setCompletedQuestions([]);
  }, [selectedProjectId, targetLevel]);

  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const totalQuestions = relevantQuestions.length;
  const progress =
    totalQuestions > 0 ? (completedQuestions.length / totalQuestions) * 100 : 0;

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedProjectId(newId);
    setSearchParams({ projectId: newId });
  };

  const handleAnswer = (value: string) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    if (!completedQuestions.includes(currentQuestion.id)) {
      setCompletedQuestions((prev) => [...prev, currentQuestion.id]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    }
  };

  return (
    <DashboardLayout role="founder" title="AIRL Assessment">
      {/* Project selector */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
            Assessing Project
          </label>
          <Select
            value={selectedProjectId}
            onChange={handleProjectChange}
            options={projects.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Status</p>
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
        {/* Question pane */}
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
                  There are no questions defined for AIRL {targetLevel}.
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
                      <Badge variant="neutral" className="mb-4">
                        {currentQuestion.category}
                      </Badge>

                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {currentQuestion.text}
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                        <button
                          onClick={() => handleAnswer("met")}
                          className="py-3 px-4 rounded-lg border-2"
                        >
                          Fully Met
                        </button>
                        <button
                          onClick={() => handleAnswer("partial")}
                          className="py-3 px-4 rounded-lg border-2"
                        >
                          Partially Met
                        </button>
                        <button
                          onClick={() => handleAnswer("not_met")}
                          className="py-3 px-4 rounded-lg border-2"
                        >
                          Not Met
                        </button>
                      </div>

                      <Textarea
                        label="Founder Notes / Context"
                        placeholder="Add context..."
                        rows={4}
                      />

                      <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto mb-2" />
                        <p className="text-sm">Upload evidence</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-6 border-t flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>

                  <Button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
          <Card className="h-full shadow-md border-0">
            <CardHeader className="bg-blue-600 text-white">
              AIRL {targetLevel} Progress
            </CardHeader>

            <CardContent>
              <ProgressBar value={progress} showLabel />
            </CardContent>

            <div className="p-6 border-t">
              <Button
                className="w-full"
                disabled={completedQuestions.length < totalQuestions}
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
