import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Input';
import { airlQuestions as defaultQuestions } from '../../data/mockData';
import { ArrowLeft, Check, X, AlertCircle, FileText, ExternalLink, Lock, Save } from 'lucide-react';

export function AssessmentReview() {
  const navigate = useNavigate();
  const { id } = useParams(); // Task ID
  const location = useLocation();
  
  // 1. DYNAMIC DATA LOADING
  const [taskData, setTaskData] = useState<any>(null);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [questions, setQuestions] = useState(defaultQuestions);
  
  // Evaluation State
  const [evaluations, setEvaluations] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // A. Load Task to get Submission Key
    const allTasks = JSON.parse(localStorage.getItem('mock_reviewer_tasks') || '[]');
    const currentTask = allTasks.find((t: any) => t.id === id);
    
    if (currentTask) {
      setTaskData(currentTask);
      
      // B. Load Submission Data using Key
      if (currentTask.submissionKey) {
        const subData = localStorage.getItem(currentTask.submissionKey);
        if (subData) {
          const parsedSub = JSON.parse(subData);
          setSubmissionData(parsedSub);
        }
      }
    }

    // C. Load Dynamic Questions Config
    const config = localStorage.getItem('airl_framework_config');
    if (config) {
      setQuestions(JSON.parse(config));
    }
  }, [id]);

  // Determine Question Set
  // We need to filter questions based on the submission's target level if available
  // For now, we just assume the submissionData has the relevant IDs, so we find questions that match answers.
  const relevantQuestions = submissionData 
    ? questions.filter(q => Object.keys(submissionData.answers).includes(q.id))
    : [];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const selectedQuestion = relevantQuestions[currentQIndex];

  // --- READ ONLY LOGIC ---
  // Task is read-only if:
  // 1. Explicitly passed in state
  // 2. Assignee ID is not 'me' (assuming current user is 'me')
  // 3. Task status is 'Completed'
  const isReadOnly = location.state?.readOnly || (taskData && taskData.assigneeId !== 'me') || (taskData && taskData.status === 'Completed');

  const handleEvaluation = (key: string, value: any) => {
    if (isReadOnly || !selectedQuestion) return;
    setEvaluations(prev => ({
      ...prev,
      [selectedQuestion.id]: { ...prev[selectedQuestion.id], [key]: value }
    }));
  };

  const handleSaveReview = () => {
    if (!taskData) return;
    
    // 1. Update Task Status
    const allTasks = JSON.parse(localStorage.getItem('mock_reviewer_tasks') || '[]');
    const updatedTasks = allTasks.map((t: any) => 
      t.id === id ? { ...t, status: 'Completed' } : t
    );
    localStorage.setItem('mock_reviewer_tasks', JSON.stringify(updatedTasks));

    // 2. Save Scores (for Dashboard)
    // We save this to a new key 'project_scores' that FounderDashboard will read
    const currentScores = JSON.parse(localStorage.getItem('project_scores') || '{}');
    
    // Calculate simple score: 1 point for Yes, 0.5 for Partial
    let techScore = 0; // Simplified for demo
    relevantQuestions.forEach(q => {
        const rating = evaluations[q.id]?.rating;
        if (rating === 'yes') techScore += 1;
        if (rating === 'partial') techScore += 0.5;
    });

    const projectId = taskData.projectId || 'unknown';
    
    // Update or Create project score entry
    currentScores[projectId] = {
        ...currentScores[projectId],
        'Technology': (currentScores[projectId]?.Technology || 0) + techScore, // Additive for demo
        // In real app, you'd calculate specific categories
    };
    
    localStorage.setItem('project_scores', JSON.stringify(currentScores));

    navigate('/reviewer/dashboard');
  };

  if (!selectedQuestion || !submissionData) return <div className="p-8">Loading submission data...</div>;

  const currentAnswer = submissionData.answers[selectedQuestion.id];
  const currentNote = submissionData.founderNotes[selectedQuestion.id];
  const currentFile = submissionData.evidenceFiles[selectedQuestion.id];

  return (
    <DashboardLayout role="reviewer" title={`Review: ${taskData?.startup || 'Startup'}`}>
      
      {isReadOnly && (
        <div className="bg-amber-50 border-b border-amber-100 p-3 text-center text-sm text-amber-800 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          <strong>Read Only Mode:</strong> You cannot modify this review.
        </div>
      )}

      <div className={`grid grid-cols-12 gap-6 h-[calc(100vh-10rem)]`}>
        
        {/* Left: Question List */}
        <div className="col-span-3 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-900">Questions ({relevantQuestions.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {relevantQuestions.map((q: any, idx: number) => (
                <button 
                  key={q.id} 
                  onClick={() => setCurrentQIndex(idx)} 
                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedQuestion.id === q.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">Q{idx + 1}</span>
                    <Badge variant="neutral" className="text-[10px] px-1.5 py-0">{q.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-2">{q.text}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle: Founder Answer (DYNAMIC) */}
        <div className="col-span-5 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-6 border-b border-gray-100">
              <Badge variant="info" className="mb-2">{selectedQuestion.category}</Badge>
              <h2 className="text-lg font-bold text-gray-900">{selectedQuestion.text}</h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Founder Response</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
                  <div className="flex items-center mb-3">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
                        currentAnswer === 'met' ? 'bg-green-100 text-green-800' :
                        currentAnswer === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                      {currentAnswer === 'met' ? <Check className="w-3 h-3 mr-1"/> : <AlertCircle className="w-3 h-3 mr-1"/>}
                      {currentAnswer ? currentAnswer.toUpperCase() : 'NO RESPONSE'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {currentNote || "No additional notes provided."}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Evidence</h4>
                {currentFile ? (
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                        <FileText className="w-8 h-8 text-blue-500 mr-3" />
                        <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{currentFile}</p>
                        <p className="text-xs text-gray-500">Uploaded by Founder</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No evidence file uploaded.</p>
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
            <div className={`p-6 flex-1 overflow-y-auto ${isReadOnly ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['yes', 'partial', 'no'].map(rating => (
                        <button 
                            key={rating}
                            onClick={() => handleEvaluation('rating', rating)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                evaluations[selectedQuestion.id]?.rating === rating 
                                ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-xs font-medium uppercase">{rating}</span>
                        </button>
                    ))}
                  </div>
                </div>

                <Textarea 
                  label="Reviewer Comments" 
                  placeholder={isReadOnly ? "Read-only mode" : "Provide feedback..."} 
                  rows={4} 
                  disabled={isReadOnly}
                  value={evaluations[selectedQuestion.id]?.comment || ''}
                  onChange={(e) => handleEvaluation('comment', e.target.value)}
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              {isReadOnly ? (
                <div className="text-center text-xs text-gray-500 italic">Read Only</div>
              ) : (
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => {if(currentQIndex < relevantQuestions.length-1) setCurrentQIndex(prev=>prev+1)}}>Next Q</Button>
                    <Button className="flex-1" onClick={handleSaveReview} leftIcon={<Save className="w-4 h-4"/>}>Complete Review</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}