import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Textarea } from '../../components/ui/TextArea'; 
import { Input } from '../../components/ui/Input';
import { 
  FileText, Upload, CheckCircle2, AlertTriangle, Calendar, Target, 
  Download, ChevronLeft, Save, DollarSign, ShieldAlert, MessageSquare, Info,
  Plus, Trash2, Clock, TrendingUp, Award, BarChart3, Check, X, ArrowRight,
  Briefcase, Rocket, List
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// Import Data
import { 
    currentQuarterGoals, 
    monthlyReports, 
    quarterlyReports,
    performanceMetrics,
    performanceChartData,
    ReportDetail,
    QuarterlyReport,
    Task,
    PromiseItem
} from '../../data/founderReviewsData';

// IMPORT QUESTIONS FOR DROPDOWN
import { airlQuestions } from '../../data/mockData';

export function FounderReviews() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [selectedQuarterly, setSelectedQuarterly] = useState<QuarterlyReport | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState<Record<string, {title: string, date: string, description: string}>>({});
  const [newCheckpoint, setNewCheckpoint] = useState('');

  // --- Handlers ---

  const handleOpenReport = (report: ReportDetail) => {
    if (report.status === 'Locked') return;
    setSelectedReport(report);
  };

  const handleOpenQuarterly = (report: QuarterlyReport) => {
    setSelectedQuarterly(report);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
    setSelectedQuarterly(null);
    setNewTaskInput({});
    setNewCheckpoint('');
  };

  // --- Unified Project Update Handler ---
  const updateProjectField = (
      reportType: 'monthly' | 'quarterly',
      projectId: string, 
      field: 'highlights' | 'risks', 
      val: string
  ) => {
      if (reportType === 'monthly' && selectedReport) {
          const updated = selectedReport.projectUpdates.map(p => p.projectId === projectId ? { ...p, [field]: val } : p);
          setSelectedReport({ ...selectedReport, projectUpdates: updated });
      } else if (reportType === 'quarterly' && selectedQuarterly) {
          const updated = selectedQuarterly.projectUpdates.map(p => p.projectId === projectId ? { ...p, [field]: val } : p);
          setSelectedQuarterly({ ...selectedQuarterly, projectUpdates: updated });
      }
  };

  // --- Quarterly Handlers ---
  const handleQuarterlyOverallUpdate = (field: 'highlights' | 'risks' | 'strategy', val: string) => {
      if (!selectedQuarterly) return;
      setSelectedQuarterly({ 
          ...selectedQuarterly, 
          overallUpdates: { ...selectedQuarterly.overallUpdates, [field]: val } 
      });
  };

  const handleTogglePromise = (promiseId: string) => {
    if (!selectedQuarterly || selectedQuarterly.status === 'Reviewed') return;
    const updatedGoals = selectedQuarterly.committedGoals.map(g => {
        if (g.id !== promiseId) return g;
        if (g.status === 'Pending') return { ...g, status: 'Met' as const };
        if (g.status === 'Met') return { ...g, status: 'Missed' as const };
        return { ...g, status: 'Pending' as const };
    });
    setSelectedQuarterly({ ...selectedQuarterly, committedGoals: updatedGoals });
  };

  const handleAddCheckpoint = () => {
    if (!selectedQuarterly || !newCheckpoint.trim()) return;
    const newItem: PromiseItem = { id: `np-${Date.now()}`, text: newCheckpoint, status: 'Pending' };
    setSelectedQuarterly({ 
        ...selectedQuarterly, 
        overallUpdates: {
            ...selectedQuarterly.overallUpdates,
            nextQuarterCheckpoints: [...selectedQuarterly.overallUpdates.nextQuarterCheckpoints, newItem]
        }
    });
    setNewCheckpoint('');
  };

  const handleRemoveCheckpoint = (id: string) => {
    if (!selectedQuarterly) return;
    setSelectedQuarterly({ 
        ...selectedQuarterly, 
        overallUpdates: {
            ...selectedQuarterly.overallUpdates,
            nextQuarterCheckpoints: selectedQuarterly.overallUpdates.nextQuarterCheckpoints.filter(i => i.id !== id)
        }
    });
  };

  // --- Monthly Task Handlers ---
  const handleAddTask = (projectId: string) => {
    const input = newTaskInput[projectId];
    if (!input || !input.title || !input.date || !selectedReport) return;
    const newTask: Task = { 
        id: `t-${Date.now()}`, 
        title: input.title, 
        deadline: input.date, 
        description: input.description, // Added description
        status: 'Pending' 
    };
    const updatedProjects = selectedReport.projectUpdates.map(p => 
        p.projectId === projectId ? { ...p, scheduleTasks: [...p.scheduleTasks, newTask] } : p
    );
    setSelectedReport({ ...selectedReport, projectUpdates: updatedProjects });
    setNewTaskInput({ ...newTaskInput, [projectId]: { title: '', date: '', description: '' } });
  };

  const handleRemoveTask = (projectId: string, taskId: string) => {
    if (!selectedReport) return;
    const updatedProjects = selectedReport.projectUpdates.map(p => 
        p.projectId === projectId ? { ...p, scheduleTasks: p.scheduleTasks.filter(t => t.id !== taskId) } : p
    );
    setSelectedReport({ ...selectedReport, projectUpdates: updatedProjects });
  };

  const handleTaskInputChange = (projectId: string, field: 'title' | 'date' | 'description', val: string) => {
    setNewTaskInput({ 
        ...newTaskInput, 
        [projectId]: { 
            ...newTaskInput[projectId], 
            [field]: val 
        } 
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        handleBackToList();
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Reviewed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout role="founder" title="Performance Reviews & Reports">
      
      {/* --- LEVEL 1: LIST VIEWS --- */}
      {!selectedReport && !selectedQuarterly && (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <Tabs 
                    tabs={[
                        { id: 'monthly', label: 'Monthly Updates' },
                        { id: 'quarterly', label: 'Quarterly Deep Dive' },
                        { id: 'performance', label: 'Overall Progress' }
                    ]} 
                    activeTab={activeTab} 
                    onChange={setActiveTab} 
                />
                <div className="text-sm text-gray-500 flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Current Period: <span className="font-semibold text-gray-900 ml-1">Q4 2023</span>
                </div>
            </div>

            {/* TAB 1: MONTHLY */}
            {activeTab === 'monthly' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="lg:col-span-2 space-y-4">
                        {monthlyReports.map((report) => (
                            <Card key={report.reportId} className={`transition-all ${report.status === 'Locked' ? 'opacity-75 bg-gray-50' : 'hover:shadow-md'}`}>
                                <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            report.status === 'Submitted' ? 'bg-green-100 text-green-600' :
                                            report.status === 'Pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">{report.month}</h3>
                                            <p className="text-xs text-gray-500">{report.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        {report.status === 'Submitted' ? (
                                            <div className="flex items-center gap-3">
                                                <Badge variant="success">Submitted</Badge>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenReport(report)}>View Report</Button>
                                            </div>
                                        ) : report.status === 'Pending' ? (
                                            <Button onClick={() => handleOpenReport(report)} leftIcon={<Upload className="w-4 h-4" />}>Submit Update</Button>
                                        ) : (
                                            <Badge variant="neutral">Locked</Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div>
                        <Card className="bg-blue-50 border-blue-100 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center text-blue-800"><Target className="w-5 h-5 mr-2" /> Q4 Promises</CardTitle>
                                <p className="text-xs text-blue-600 mt-1">Updates should reflect progress on these goals.</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {currentQuarterGoals.map((goal, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white p-2.5 rounded-lg border border-blue-100 shadow-sm">
                                        <div className="mt-0.5 min-w-[1.25rem]"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">{idx + 1}</span></div>
                                        <span className="text-sm text-gray-700 font-medium">{goal}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB 2: QUARTERLY LIST */}
            {activeTab === 'quarterly' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    {quarterlyReports.map((q) => (
                        <Card key={q.id} className="overflow-hidden border-l-4" style={{borderLeftColor: q.status === 'Reviewed' ? '#10b981' : '#3b82f6'}}>
                            <CardHeader className="flex flex-row items-start justify-between bg-gray-50/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-gray-900">{q.quarter} Review</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(q.status)}`}>{q.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{q.date} {q.reviewer ? `• Reviewer: ${q.reviewer}` : ''}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleOpenQuarterly(q)} rightIcon={<ArrowRight className="w-4 h-4"/>}>
                                    {q.status === 'Draft' ? 'Edit Report' : 'View Details'}
                                </Button>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 pt-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Strategy Focus</h4>
                                        <p className="text-sm text-gray-700">{q.overallUpdates.strategy || "Pending strategy definition..."}</p>
                                    </div>
                                    {q.feedback ? (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Reviewer Feedback</h4>
                                            <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3">"{q.feedback}"</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-gray-400 italic text-sm"><Info className="w-4 h-4 mr-2"/> No feedback available yet.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* TAB 3: PERFORMANCE */}
            {activeTab === 'performance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card><CardContent className="p-6 text-center"><p className="text-xs text-gray-500 font-bold uppercase mb-2">Promises Met</p><h3 className="text-3xl font-extrabold text-green-600">{performanceMetrics.promisesMetPercentage}%</h3></CardContent></Card>
                        <Card><CardContent className="p-6 text-center"><p className="text-xs text-gray-500 font-bold uppercase mb-2">Submission Rate</p><h3 className="text-3xl font-extrabold text-blue-600">{performanceMetrics.onTimeSubmissionRate}</h3></CardContent></Card>
                        <Card><CardContent className="p-6 text-center"><p className="text-xs text-gray-500 font-bold uppercase mb-2">Growth Streak</p><div className="flex justify-center items-center gap-1 text-3xl font-extrabold text-amber-500">{performanceMetrics.streak} <TrendingUp className="w-6 h-6" /></div></CardContent></Card>
                    </div>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-gray-500"/> Goal Completion Trend</CardTitle></CardHeader>
                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceChartData}>
                                    <defs><linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip formatter={(value: any) => [`${value}0%`, 'Completion']} />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
      )}

      {/* --- LEVEL 2: MONTHLY REPORT DETAIL VIEW --- */}
      {selectedReport && (
        <div className="animate-in fade-in slide-in-from-right-4">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handleBackToList} leftIcon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedReport.month} Report</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{selectedReport.status}</span><span>•</span><span>Budget: {selectedReport.budget.status}</span>
                        </div>
                    </div>
                </div>
                {selectedReport.status !== 'Submitted' && (
                    <Button onClick={handleSave} disabled={isSaving} leftIcon={<Save className="w-4 h-4" />}>{isSaving ? 'Saving...' : 'Submit Report'}</Button>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    {selectedReport.projectUpdates.map((project, index) => (
                        <Card key={project.projectId} className="border-l-4 border-l-blue-500">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{index + 1}</span>
                                        <CardTitle className="text-base">{project.projectName}</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="neutral" className="text-[10px]">Current: AIRL {project.currentAIRL}</Badge>
                                        <div className="px-2 py-0.5 rounded text-[10px] font-bold border text-gray-500 bg-white border-gray-200">System Risk: {project.systemRisk}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-600" /> Highlights</label>
                                        <Textarea className="min-h-[100px] text-sm" placeholder="What went well?" value={project.highlights} onChange={(e) => updateProjectField('monthly', project.projectId, 'highlights', e.target.value)} disabled={selectedReport.status === 'Submitted'} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-amber-600" /> Risks</label>
                                        <Textarea className="min-h-[100px] text-sm" placeholder="Delays?" value={project.risks} onChange={(e) => updateProjectField('monthly', project.projectId, 'risks', e.target.value)} disabled={selectedReport.status === 'Submitted'} />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex justify-between items-center">
                                        <span>Propose Deadlines for Level {project.currentAIRL + 1} Milestones</span>
                                        <span className="text-blue-600 font-normal normal-case text-xs bg-blue-50 px-2 py-1 rounded">Target: AIRL {project.currentAIRL + 1}</span>
                                    </label>
                                    <div className="space-y-2 mb-4">
                                        {project.scheduleTasks.length > 0 ? project.scheduleTasks.map(task => (
                                            <div key={task.id} className="bg-white border border-gray-200 p-3 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3"><List className="w-4 h-4 text-blue-500" /><span className="text-sm font-medium text-gray-700">{task.title}</span></div>
                                                    <div className="flex items-center gap-4"><Badge variant="neutral">{task.deadline}</Badge>{selectedReport.status !== 'Submitted' && <button onClick={() => handleRemoveTask(project.projectId, task.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}</div>
                                                </div>
                                                {task.description && <p className="text-xs text-gray-500 pl-7">{task.description}</p>}
                                            </div>
                                        )) : <p className="text-xs text-gray-400 italic">No milestones set for AIRL {project.currentAIRL + 1}.</p>}
                                    </div>
                                    
                                    {selectedReport.status !== 'Submitted' && (
                                        <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex flex-col md:flex-row gap-3">
                                                <div className="flex-1 w-full">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Select Milestone</label>
                                                    <select 
                                                        className="w-full text-sm border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none h-10"
                                                        value={newTaskInput[project.projectId]?.title || ''}
                                                        onChange={(e) => handleTaskInputChange(project.projectId, 'title', e.target.value)}
                                                    >
                                                        <option value="">-- Select from Assessment Questions --</option>
                                                        {airlQuestions.filter(q => q.airlLevel === project.currentAIRL + 1).map((q) => (
                                                            <option key={q.id} value={q.text}>
                                                                {q.category}: {q.text}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-full md:w-40">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Deadline</label>
                                                    <Input type="date" value={newTaskInput[project.projectId]?.date || ''} onChange={(e) => handleTaskInputChange(project.projectId, 'date', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="flex gap-3 items-end">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Execution Plan (1-2 Sentences)</label>
                                                    <Input 
                                                        placeholder="How do you plan to achieve this milestone?" 
                                                        value={newTaskInput[project.projectId]?.description || ''} 
                                                        onChange={(e) => handleTaskInputChange(project.projectId, 'description', e.target.value)} 
                                                    />
                                                </div>
                                                <Button 
                                                    variant="secondary" 
                                                    onClick={() => handleAddTask(project.projectId)} 
                                                    disabled={!newTaskInput[project.projectId]?.title || !newTaskInput[project.projectId]?.date} 
                                                    leftIcon={<Plus className="w-4 h-4" />}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="space-y-6">
                    <Card><CardHeader className="pb-2 bg-slate-50 border-b border-slate-100"><CardTitle className="flex items-center text-sm font-bold text-gray-600 uppercase"><DollarSign className="w-4 h-4 mr-2" /> Budget (System)</CardTitle></CardHeader><CardContent className="pt-4"><div className="flex justify-between items-end mb-2"><span className="text-2xl font-bold text-gray-900">{selectedReport.budget.utilized}</span><span className="text-xs text-gray-500 mb-1">of {selectedReport.budget.total}</span></div><div className="w-full bg-gray-100 rounded-full h-1.5 mb-2"><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div></div><div className="flex justify-between text-xs"><span className="text-gray-500">Utilized</span><Badge variant={selectedReport.budget.status === 'On Track' ? 'success' : 'danger'}>{selectedReport.budget.status}</Badge></div></CardContent></Card>
                    {selectedReport.artparkRemarks && <Card className="bg-blue-50 border-blue-100"><CardHeader className="pb-2"><CardTitle className="flex items-center text-sm font-bold text-blue-800 uppercase"><MessageSquare className="w-4 h-4 mr-2" /> Reviewer Remarks</CardTitle></CardHeader><CardContent className="pt-2"><p className="text-sm text-blue-900 italic">"{selectedReport.artparkRemarks}"</p></CardContent></Card>}
                </div>
            </div>
        </div>
      )}

      {/* --- LEVEL 2: QUARTERLY REPORT DETAIL VIEW --- */}
      {selectedQuarterly && (
        <div className="animate-in fade-in slide-in-from-right-4">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handleBackToList} leftIcon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedQuarterly.quarter} Review</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusColor(selectedQuarterly.status)}`}>{selectedQuarterly.status}</span>
                            <span>•</span><span>{selectedQuarterly.date}</span>
                        </div>
                    </div>
                </div>
                {selectedQuarterly.status === 'Draft' && (
                    <Button onClick={handleSave} disabled={isSaving} leftIcon={<Save className="w-4 h-4" />}>{isSaving ? 'Saving...' : 'Submit Review'}</Button>
                )}
            </div>

            <div className="space-y-8">
                
                {/* 1. PAST PROMISES */}
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="bg-purple-50/50 border-b border-purple-100">
                        <CardTitle className="flex items-center text-purple-900"><CheckCircle2 className="w-5 h-5 mr-2" /> Promises made for {selectedQuarterly.quarter}</CardTitle>
                        <p className="text-xs text-purple-700 mt-1">Check off the goals you achieved this quarter.</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {selectedQuarterly.committedGoals.map(goal => (
                                <div key={goal.id} onClick={() => handleTogglePromise(goal.id)} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedQuarterly.status === 'Reviewed' ? '' : 'cursor-pointer hover:shadow-sm'} ${goal.status === 'Met' ? 'bg-green-50 border-green-200' : goal.status === 'Missed' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <span className="text-sm font-medium text-gray-700">{goal.text}</span>
                                    {goal.status === 'Met' && <div className="flex items-center text-green-600 text-xs font-bold"><Check className="w-4 h-4 mr-1"/> Met</div>}
                                    {goal.status === 'Missed' && <div className="flex items-center text-red-600 text-xs font-bold"><X className="w-4 h-4 mr-1"/> Missed</div>}
                                    {goal.status === 'Pending' && <div className="flex items-center text-gray-400 text-xs font-bold">Pending</div>}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. OVERALL STARTUP REVIEW */}
                <Card className="border-t-4 border-t-blue-600">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                        <CardTitle className="flex items-center text-blue-900"><Rocket className="w-5 h-5 mr-2" /> Overall Startup Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Quarterly Highlights</label>
                                    <Textarea className="min-h-[100px] text-sm" placeholder="Top achievements across the company?" value={selectedQuarterly.overallUpdates.highlights} onChange={(e) => handleQuarterlyOverallUpdate('highlights', e.target.value)} disabled={selectedQuarterly.status === 'Reviewed'} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Top Risks</label>
                                    <Textarea className="min-h-[100px] text-sm" placeholder="Any major blockers or risks?" value={selectedQuarterly.overallUpdates.risks} onChange={(e) => handleQuarterlyOverallUpdate('risks', e.target.value)} disabled={selectedQuarterly.status === 'Reviewed'} />
                                </div>
                            </div>
                            <div className="space-y-6 border-l pl-8 border-gray-100">
                                <div>
                                    <label className="text-xs font-bold text-blue-600 uppercase mb-2 block">Next Quarter Strategy</label>
                                    <Textarea className="min-h-[100px] text-sm bg-blue-50/30" placeholder="Strategic focus for next quarter..." value={selectedQuarterly.overallUpdates.strategy} onChange={(e) => handleQuarterlyOverallUpdate('strategy', e.target.value)} disabled={selectedQuarterly.status === 'Reviewed'} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-600 uppercase mb-2 block">Next Checkpoints</label>
                                    <div className="space-y-2 mb-3">
                                        {selectedQuarterly.overallUpdates.nextQuarterCheckpoints.map(cp => (
                                            <div key={cp.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                                                <span>{cp.text}</span>
                                                {selectedQuarterly.status !== 'Reviewed' && <button onClick={() => handleRemoveCheckpoint(cp.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3"/></button>}
                                            </div>
                                        ))}
                                    </div>
                                    {selectedQuarterly.status !== 'Reviewed' && (
                                        <div className="flex gap-2">
                                            <Input placeholder="Add checkpoint..." value={newCheckpoint} onChange={(e) => setNewCheckpoint(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCheckpoint()} className="h-8 text-sm"/>
                                            <Button size="sm" variant="secondary" onClick={handleAddCheckpoint} disabled={!newCheckpoint.trim()}><Plus className="w-4 h-4"/></Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. PROJECT-WISE REVIEWS */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-gray-500"/> Project Updates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedQuarterly.projectUpdates.map((project) => (
                            <Card key={project.projectId}>
                                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
                                    <CardTitle className="text-base">{project.projectName}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Project Highlights</label>
                                        <Textarea className="min-h-[80px] text-sm" value={project.highlights} onChange={(e) => updateProjectField('quarterly', project.projectId, 'highlights', e.target.value)} disabled={selectedQuarterly.status === 'Reviewed'} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Project Risks</label>
                                        <Textarea className="min-h-[80px] text-sm" value={project.risks} onChange={(e) => updateProjectField('quarterly', project.projectId, 'risks', e.target.value)} disabled={selectedQuarterly.status === 'Reviewed'} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      )}

    </DashboardLayout>
  );
}