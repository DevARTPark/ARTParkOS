import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { airlQuestions, projects as mockProjects } from '../../data/mockData';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Lock, Upload, 
  Info, Lightbulb, Link, Save, Clock, AlertTriangle, User, FileText, X, CheckCheck, Rocket 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to get today's date string
const getTodayString = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function AIRLAssessment() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 1. CRITICAL FIX: Load ALL Projects from Local Storage (including new ones)
  // If we just use mockProjects, the 3rd project won't show up.
  const [allProjects] = useState(() => {
    const saved = localStorage.getItem('founder_projects');
    return saved ? JSON.parse(saved) : mockProjects;
  });

  // Ensure we select a valid project initially
  const initialProjectId = searchParams.get('projectId') || (allProjects.length > 0 ? allProjects[0].id : '');
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // --- STATE ---
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [founderNotes, setFounderNotes] = useState<Record<string, string>>({});
  const [evidenceLinks, setEvidenceLinks] = useState<Record<string, string>>({});
  const [evidenceFiles, setEvidenceFiles] = useState<Record<string, string>>({});
  
  const [showInfo, setShowInfo] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'submitted'>('draft');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isLockedByReviewer, setIsLockedByReviewer] = useState(false);

  // --- DERIVE CONTEXT ---
  const selectedProject = allProjects.find((p: any) => p.id === selectedProjectId) || allProjects[0];
  
  // Guard clause if no projects exist
  if (!selectedProject) {
    return (
      <DashboardLayout role="founder" title="AIRL Assessment">
        <div className="p-8 text-center text-gray-500">No projects found. Please create a project first.</div>
      </DashboardLayout>
    );
  }

  const isBaseline = selectedProject?.isNew === true;
  const estimatedLevel = selectedProject?.estimatedAIRL || 1;
  const currentOfficialLevel = selectedProject?.currentAIRL || 0;

  // Determine Target Level
  const targetLevel = isBaseline ? estimatedLevel : currentOfficialLevel + 1;

  // FILTER QUESTIONS
  const relevantQuestions = airlQuestions.filter(q => 
    isBaseline 
      ? q.airlLevel <= targetLevel 
      : q.airlLevel === targetLevel
  ).sort((a, b) => a.airlLevel - b.airlLevel);
  
  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const totalQuestions = relevantQuestions.length;
  const progress = totalQuestions > 0 ? (completedQuestions.length / totalQuestions) * 100 : 0;

  // --- 2. LOAD ASSESSMENT DATA ---
  useEffect(() => {
    const modeKey = isBaseline ? 'BASELINE' : 'ROUTINE';
    const storageKey = `artpark_assessment_${selectedProjectId}_AIRL${targetLevel}_${modeKey}`;
    
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAnswers(parsed.answers || {});
      setCompletedQuestions(parsed.completedQuestions || []);
      setFounderNotes(parsed.founderNotes || {});
      setEvidenceLinks(parsed.evidenceLinks || {});
      setEvidenceFiles(parsed.evidenceFiles || {});
      setLastSaved(parsed.timestamp);
      setSubmissionStatus(parsed.status || 'draft');
      
      const storedTaskId = parsed.taskId || null;
      setCurrentTaskId(storedTaskId);

      if (parsed.status === 'submitted' && storedTaskId) {
        checkReviewerStatus(storedTaskId);
      } else {
        setIsLockedByReviewer(false);
      }

    } else {
      setAnswers({});
      setCompletedQuestions([]);
      setFounderNotes({});
      setEvidenceLinks({});
      setEvidenceFiles({});
      setLastSaved(null);
      setSubmissionStatus('draft');
      setCurrentTaskId(null);
      setIsLockedByReviewer(false);
    }

    setCurrentQuestionIndex(0);
  }, [selectedProjectId, targetLevel, isBaseline]);

  const checkReviewerStatus = (taskId: string) => {
    const tasks = JSON.parse(localStorage.getItem('mock_reviewer_tasks') || '[]');
    const task = tasks.find((t: any) => t.id === taskId);
    if (task && task.status !== 'Pending' && task.assigneeId !== null) {
      setIsLockedByReviewer(true);
    } else {
      setIsLockedByReviewer(false);
    }
  };

  const saveToStorage = (status: 'draft' | 'submitted', taskId: string | null = null) => {
    const modeKey = isBaseline ? 'BASELINE' : 'ROUTINE';
    const storageKey = `artpark_assessment_${selectedProjectId}_AIRL${targetLevel}_${modeKey}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const dataToSave = {
      answers, completedQuestions, founderNotes, evidenceLinks, evidenceFiles, timestamp, status, taskId 
    };

    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    setLastSaved(timestamp);
    setSubmissionStatus(status);
    if (taskId) setCurrentTaskId(taskId);
  };

  const handleSaveDraft = () => saveToStorage('draft', currentTaskId);

  // --- FILE HANDLERS ---
  const handleFileClick = () => { if (submissionStatus !== 'submitted' && fileInputRef.current) fileInputRef.current.click(); };
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if(file && currentQuestion) setEvidenceFiles({...evidenceFiles, [currentQuestion.id]: file.name});
  };
  const handleRemoveFile = (e: any) => {
    e.stopPropagation();
    const updated = {...evidenceFiles}; delete updated[currentQuestion.id]; setEvidenceFiles(updated);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- SUBMIT ---
  const handleFinalSubmit = () => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      startup: "GreenField Tech", 
      project: selectedProject.name,
      type: isBaseline ? "Baseline Assessment" : "AIRL Assessment",
      title: isBaseline 
        ? `Baseline Validation (Level 1-${targetLevel}) - ${selectedProject.name}` 
        : `AIRL ${targetLevel} Assessment - ${selectedProject.name}`,
      priority: "High",
      due: isBaseline ? "7 Days" : "3 Days",
      submittedDate: getTodayString(),
      description: isBaseline 
        ? `Initial validation for claimed Level ${targetLevel}. Review all cumulative evidence.`
        : `Validation required for moving to Level ${targetLevel}.`,
      assigneeId: null, 
      status: "Pending"
    };

    const existingPool = JSON.parse(localStorage.getItem('mock_reviewer_tasks') || '[]');
    localStorage.setItem('mock_reviewer_tasks', JSON.stringify([...existingPool, newTask]));

    saveToStorage('submitted', newTaskId);
    setIsLockedByReviewer(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RECALL ---
  const handleRecall = () => {
    if (!currentTaskId) return;
    const existingPool = JSON.parse(localStorage.getItem('mock_reviewer_tasks') || '[]');
    const updatedPool = existingPool.filter((t: any) => t.id !== currentTaskId);
    localStorage.setItem('mock_reviewer_tasks', JSON.stringify(updatedPool));
    saveToStorage('draft', null); 
    setIsLockedByReviewer(false);
  };

  useEffect(() => { setShowInfo(true); }, [currentQuestionIndex]);

  const handleProjectChange = (e: any) => { setSelectedProjectId(e.target.value); setSearchParams({ projectId: e.target.value }); };
  const handleAnswer = (val: string) => {
    if (!currentQuestion || submissionStatus === 'submitted') return;
    setAnswers({ ...answers, [currentQuestion.id]: val });
    if (!completedQuestions.includes(currentQuestion.id)) setCompletedQuestions([...completedQuestions, currentQuestion.id]);
  };
  const handleNoteChange = (val: string) => setFounderNotes({...founderNotes, [currentQuestion?.id]: val});
  const handleLinkChange = (val: string) => setEvidenceLinks({...evidenceLinks, [currentQuestion?.id]: val});
  const handleNext = () => currentQuestionIndex < totalQuestions - 1 && setCurrentQuestionIndex(prev => prev + 1);
  const handlePrev = () => currentQuestionIndex > 0 && setCurrentQuestionIndex(prev => prev - 1);

  return (
    <DashboardLayout role="founder" title={isBaseline ? "Initial Baseline Assessment" : "AIRL Assessment"}>
      
      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Assessing Project</label>
          <Select 
            value={selectedProjectId}
            onChange={handleProjectChange}
            options={allProjects.map((p: any) => ({ value: p.id, label: p.name }))}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Status</p>
            {isBaseline ? <Badge variant="warning">Unverified</Badge> : <p className="font-bold text-gray-900">AIRL {currentOfficialLevel}</p>}
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className="text-right">
            <p className="text-xs text-blue-600 font-bold">{isBaseline ? "Claimed Level" : "Target"}</p>
            <Badge variant="info" className="text-lg px-3">AIRL {targetLevel}</Badge>
          </div>
        </div>
      </div>

      {isBaseline && submissionStatus === 'draft' && (
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex items-start gap-4">
          <Rocket className="w-8 h-8 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg">Validate Your Stage: Level 1 to {targetLevel}</h3>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
              Since this is a new project, please complete the baseline assessment covering all criteria up to your estimated stage.
            </p>
            <div className="mt-3 inline-flex items-center bg-white/20 px-3 py-1 rounded text-xs font-medium border border-white/30">
              <Clock className="w-3 h-3 mr-1.5" />
              Deadline: {selectedProject.baselineDeadline || "7 Days"}
            </div>
          </div>
        </div>
      )}

      {submissionStatus === 'submitted' ? (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isLockedByReviewer ? 'bg-blue-100' : 'bg-green-100'}`}>
            {isLockedByReviewer ? <CheckCheck className="w-10 h-10 text-blue-600" /> : <Clock className="w-10 h-10 text-green-600" />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{isLockedByReviewer ? "Assessment Accepted" : "Awaiting Review"}</h2>
          <p className="text-gray-500 max-w-lg mb-8">
            {isLockedByReviewer 
              ? `A Reviewer has accepted your submission. The evaluation is currently in progress.` 
              : `Your assessment is in the task pool. You can recall it for edits until a reviewer picks it up.`
            }
          </p>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 max-w-md w-full text-left mb-8">
            <h4 className="text-sm font-bold text-gray-700 uppercase mb-4">Submission Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Project:</span><span className="font-medium">{selectedProject.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Questions Answered:</span><span className="font-medium text-green-600">{totalQuestions}/{totalQuestions}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Status:</span><Badge variant={isLockedByReviewer ? 'info' : 'warning'}>{isLockedByReviewer ? 'Accepted' : 'Pending'}</Badge></div>
            </div>
          </div>
          {isLockedByReviewer ? (
            <div className="flex items-center text-blue-700 text-sm bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 font-medium">
              <Lock className="w-4 h-4 mr-2" /> Accepted by reviewer. Changes locked.
            </div>
          ) : (
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={handleRecall}>Recall Submission (Edit)</Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row h-auto min-h-[600px] gap-6">
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col shadow-md border-0 h-full">
              {relevantQuestions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No questions available.</p>
                </div>
              ) : (
                <>
                  <div className="p-8 flex-1">
                    <AnimatePresence mode="wait">
                      <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                              {isBaseline && <Badge variant="outline">Level {currentQuestion.airlLevel}</Badge>}
                              <Badge variant="neutral">{currentQuestion.category}</Badge>
                            </div>
                            <button onClick={() => setShowInfo(!showInfo)} className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                              <Info className="w-5 h-5" />
                            </button>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{currentQuestion.text}</h2>
                          <AnimatePresence>
                            {showInfo && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                                  <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm"><Lightbulb className="w-4 h-4" /> Expectations</div>
                                  <ul className="list-disc list-inside space-y-1">
                                    {currentQuestion.expectations?.map((point, i) => (<li key={i} className="text-sm text-blue-700 leading-relaxed">{point}</li>)) || <li className="text-sm text-gray-500">No guidance.</li>}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-8">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">Compliance Status</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {['met', 'partial', 'not_met'].map((status) => (
                                <button key={status} onClick={() => handleAnswer(status)} className={`py-3 px-4 rounded-lg border-2 transition-all capitalize font-bold text-sm ${answers[currentQuestion.id] === status ? (status === 'met' ? 'border-green-600 bg-green-50 text-green-700' : status === 'partial' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-red-500 bg-red-50 text-red-700') : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                  {status.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>

                          <Textarea label="Founder Notes / Context" rows={3} value={founderNotes[currentQuestion.id] || ''} onChange={(e) => setFounderNotes({...founderNotes, [currentQuestion.id]: e.target.value})} />
                          
                          <div className="relative">
                            <Input label="Evidence Link" placeholder="https://..." value={evidenceLinks[currentQuestion.id] || ''} onChange={(e) => setEvidenceLinks({...evidenceLinks, [currentQuestion.id]: e.target.value})} />
                            <Link className="absolute right-3 top-9 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>

                          {/* Evidence Upload */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Evidence File
                          </label>
                          
                          {/* Hidden Input */}
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            onChange={handleFileChange}
                          />

                          {/* Dropzone / Display Area */}
                          <div 
                            onClick={handleFileClick}
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                              evidenceFiles[currentQuestion.id] 
                                ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {evidenceFiles[currentQuestion.id] ? (
                              <>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                  <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 break-all px-4">
                                  {evidenceFiles[currentQuestion.id]}
                                </p>
                                <div className="mt-2 flex gap-2">
                                  <span className="text-xs text-green-600 font-bold uppercase">Uploaded</span>
                                  <button 
                                    onClick={handleRemoveFile} 
                                    className="z-10 p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-500"
                                    title="Remove File"
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
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between items-center mt-auto">
                    <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0} leftIcon={<ArrowLeft className="w-4 h-4" />}>Previous</Button>
                    <div className="text-sm text-gray-500 font-medium">Question {currentQuestionIndex + 1} of {totalQuestions}</div>
                    <Button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1}>Next <ArrowRight className="ml-2 w-4 h-4" /></Button>
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="w-full lg:w-80 flex flex-col">
            <Card className="h-full flex flex-col border-0 shadow-md">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                <h3 className="font-bold text-lg">{isBaseline ? `Baseline (L1-${targetLevel})` : `AIRL ${targetLevel}`}</h3>
                <p className="text-blue-100 text-sm mt-1">{selectedProject.name}</p>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="p-6 border-b border-gray-100"><ProgressBar value={progress} showLabel /></div>
                <div className="divide-y divide-gray-100">
                  {relevantQuestions.map((q, idx) => (
                    <button key={q.id} onClick={() => setCurrentQuestionIndex(idx)} className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${idx === currentQuestionIndex ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}>
                      <div className={`mt-0.5 flex-shrink-0 ${completedQuestions.includes(q.id) ? 'text-green-500' : 'text-gray-300'}`}>{completedQuestions.includes(q.id) ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}</div>
                      <div>
                        <div className="flex items-center gap-2"><p className={`text-sm font-medium ${completedQuestions.includes(q.id) ? 'text-gray-900' : 'text-gray-500'}`}>{q.category}</p>{isBaseline && <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500">L{q.airlLevel}</span>}</div>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{q.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg space-y-3">
                <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" onClick={handleSaveDraft} leftIcon={<Save className="w-4 h-4" />}>Save Draft</Button>
                {lastSaved && <p className="text-[10px] text-center text-gray-400">Last saved: {lastSaved}</p>}
                <Button className="w-full" disabled={relevantQuestions.length === 0 || completedQuestions.length < totalQuestions} leftIcon={<Lock className="w-4 h-4" />} onClick={handleFinalSubmit}>Submit</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}