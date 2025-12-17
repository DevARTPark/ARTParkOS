import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Textarea } from '../../components/ui/Input';
import { airlQuestions } from '../../data/mockData';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Lock, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function AIRLAssessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const currentQuestion = airlQuestions[currentQuestionIndex];
  const totalQuestions = airlQuestions.length;
  const progress = completedQuestions.length / totalQuestions * 100;
  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
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
  return <DashboardLayout role="founder" title="AIRL Assessment">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
        {/* Left Pane: Question View */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col shadow-md border-0">
            <div className="p-8 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div key={currentQuestion.id} initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -20
              }} transition={{
                duration: 0.3
              }}>
                  <div className="mb-6">
                    <Badge variant="info" className="mb-4">
                      {currentQuestion.category}
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                      {currentQuestion.text}
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {/* Yes/No Radio */}
                    {/* Status Selection: Met / Partially Met / Not Met */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 block">
                        Compliance Status
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button 
                          onClick={() => handleAnswer('met')} 
                          className={`py-3 px-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center ${
                            answers[currentQuestion.id] === 'met' 
                              ? 'border-green-600 bg-green-50 text-green-700 shadow-sm' 
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600'
                          }`}
                        >
                          <span className="font-bold text-sm">Fully Met</span>
                        </button>
                        
                        <button 
                          onClick={() => handleAnswer('partial')} 
                          className={`py-3 px-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center ${
                            answers[currentQuestion.id] === 'partial' 
                              ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' 
                              : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-600'
                          }`}
                        >
                          <span className="font-bold text-sm">Partially Met</span>
                        </button>
                        
                        <button 
                          onClick={() => handleAnswer('not_met')} 
                          className={`py-3 px-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center ${
                            answers[currentQuestion.id] === 'not_met' 
                              ? 'border-red-500 bg-red-50 text-red-700 shadow-sm' 
                              : 'border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600'
                          }`}
                        >
                          <span className="font-bold text-sm">Not Met</span>
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    <Textarea label="Founder Notes / Context" placeholder="Add any additional context or explanation here..." rows={4} />
                    {/* NEW LINK BOX */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 block">
                        Supporting Link
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-xs">https://</span>
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="github.com/project/repo or drive.google.com/..."
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
              <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Previous
              </Button>
              <div className="text-sm text-gray-500 font-medium">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              <Button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1}>
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Pane: Checklist Sidebar */}
        <div className="w-full lg:w-80 flex flex-col">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <h3 className="font-bold text-lg">AIRL 1 Progress</h3>
              <p className="text-blue-100 text-sm mt-1">
                Answer all items to unlock AIRL 2
              </p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="p-6 border-b border-gray-100">
                <ProgressBar value={progress} showLabel />
              </div>
              <div className="divide-y divide-gray-100">
                {airlQuestions.map((q, idx) => {
                const isCompleted = completedQuestions.includes(q.id);
                const isActive = idx === currentQuestionIndex;
                return <button key={q.id} onClick={() => setCurrentQuestionIndex(idx)} className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${isActive ? 'bg-blue-50' : ''}`}>
                      <div className={`mt-0.5 flex-shrink-0 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                          {q.category}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {q.text}
                        </p>
                      </div>
                    </button>;
              })}
              </div>
            </CardContent>
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <Button className="w-full" disabled={completedQuestions.length < totalQuestions} leftIcon={<Lock className="w-4 h-4" />}>
                Unlock AIRL 2
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>;
}