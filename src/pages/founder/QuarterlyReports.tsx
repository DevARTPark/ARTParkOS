import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Textarea } from "../../components/ui/TextArea";
import { Input } from "../../components/ui/Input";
import {
  ArrowRight,
  Info,
  ChevronLeft,
  Target,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  Flag
} from "lucide-react";

// Import types
import { QuarterlyReport } from "../../data/founderReviewsData";

interface QuarterlyReportsProps {
  reports: QuarterlyReport[];
  selectedQuarterly: QuarterlyReport | null;
  onSelect: (report: QuarterlyReport) => void;
  onBack: () => void;

  // Inputs
  inputs: {
    newCheckpoint: string;
  };
  setNewCheckpoint: (val: string) => void;

  // Actions
  actions: {
    handleQuarterlyOverallUpdate: (
      field: "highlights" | "risks" | "strategy",
      val: string
    ) => void;
    handleTogglePromise: (promiseId: string) => void;
    handleAddCheckpoint: () => void;
    handleRemoveCheckpoint: (id: string) => void;
  };
}

export function QuarterlyReports({
  reports,
  selectedQuarterly,
  onSelect,
  onBack,
  inputs,
  setNewCheckpoint,
  actions,
}: QuarterlyReportsProps) {
  
  // Helper to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reviewed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // --- LIST VIEW ---
  if (!selectedQuarterly) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        {reports.map((q) => (
          <Card
            key={q.id}
            className="overflow-hidden border-l-4"
            style={{
              borderLeftColor: q.status === "Reviewed" ? "#10b981" : "#3b82f6",
            }}
          >
            <CardHeader className="flex flex-row items-start justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {q.quarter} Review
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(
                      q.status
                    )}`}
                  >
                    {q.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {q.date} {q.reviewer ? `• Reviewer: ${q.reviewer}` : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelect(q)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {q.status === "Draft" ? "Edit Report" : "View Details"}
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Strategy Focus
                  </h4>
                  <p className="text-sm text-gray-700">
                    {q.overallUpdates.strategy ||
                      "Pending strategy definition..."}
                  </p>
                </div>
                {q.feedback ? (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Reviewer Feedback
                    </h4>
                    <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3">
                      "{q.feedback}"
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400 italic text-sm">
                    <Info className="w-4 h-4 mr-2" /> No feedback available yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // --- DETAIL VIEW ---
  const isEditable = selectedQuarterly.status !== "Reviewed";

  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {selectedQuarterly.quarter} Strategic Review
            </h2>
            <div className="flex items-center gap-2">
                <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(
                        selectedQuarterly.status
                    )}`}
                >
                    {selectedQuarterly.status}
                </span>
                {isEditable && <span className="text-xs text-gray-400">• Unsaved Changes</span>}
            </div>
          </div>
        </div>
        {isEditable && (
             <Button leftIcon={<Save className="w-4 h-4" />} size="sm">
                 Save Draft
             </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: STRATEGY & REFLECTION */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. STRATEGY INPUT */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600"/> Quarter Strategy
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isEditable ? (
                    <Textarea 
                        className="min-h-[120px]"
                        placeholder="Define your core focus and strategy for this quarter..."
                        value={selectedQuarterly.overallUpdates.strategy}
                        onChange={(e) => actions.handleQuarterlyOverallUpdate("strategy", e.target.value)}
                    />
                ) : (
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedQuarterly.overallUpdates.strategy}</p>
                )}
            </CardContent>
          </Card>

          {/* 2. HIGHLIGHTS & RISKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-t-4 border-t-green-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-2"/> Highlights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditable ? (
                        <Textarea 
                            className="min-h-[150px] text-sm"
                            placeholder="- Key win 1&#10;- Key win 2"
                            value={selectedQuarterly.overallUpdates.highlights}
                            onChange={(e) => actions.handleQuarterlyOverallUpdate("highlights", e.target.value)}
                        />
                    ) : (
                         <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedQuarterly.overallUpdates.highlights}</p>
                    )}
                </CardContent>
             </Card>

             <Card className="border-t-4 border-t-red-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-red-700">
                        <AlertTriangle className="w-4 h-4 mr-2"/> Risks & Lowlights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditable ? (
                        <Textarea 
                            className="min-h-[150px] text-sm"
                            placeholder="- Risk 1&#10;- Blocker 2"
                            value={selectedQuarterly.overallUpdates.risks}
                            onChange={(e) => actions.handleQuarterlyOverallUpdate("risks", e.target.value)}
                        />
                    ) : (
                         <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedQuarterly.overallUpdates.risks}</p>
                    )}
                </CardContent>
             </Card>
          </div>

          {/* 3. PROMISES / OKRs */}
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                          <Flag className="w-5 h-5 mr-2 text-indigo-600" /> Committed Goals (Promises)
                      </div>
                      <Badge variant="neutral">
                          {selectedQuarterly.committedGoals.filter(g => g.status === 'Met').length} / {selectedQuarterly.committedGoals.length} Met
                      </Badge>
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                      {selectedQuarterly.committedGoals.map((goal) => (
                          <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <span className={`text-sm font-medium ${goal.status === 'Met' ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {goal.text}
                              </span>
                              <div className="flex items-center gap-2">
                                  {isEditable ? (
                                      <button 
                                        onClick={() => actions.handleTogglePromise(goal.id)}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                            goal.status === 'Met' 
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                            : goal.status === 'Missed'
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                      >
                                          {goal.status}
                                      </button>
                                  ) : (
                                      <Badge variant={goal.status === 'Met' ? 'success' : goal.status === 'Missed' ? 'danger' : 'warning'}>
                                          {goal.status}
                                      </Badge>
                                  )}
                              </div>
                          </div>
                      ))}
                      {selectedQuarterly.committedGoals.length === 0 && (
                          <p className="text-sm text-gray-400 italic">No specific goals committed for this quarter.</p>
                      )}
                  </div>
              </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PLANNING & CHECKPOINTS */}
        <div className="space-y-6">
            {/* NEXT QUARTER CHECKPOINTS */}
            <Card className="h-full border-l-4 border-l-purple-500">
                <CardHeader className="bg-purple-50 border-b border-purple-100">
                    <CardTitle className="text-purple-900 text-base">Next Quarter Checkpoints</CardTitle>
                    <p className="text-xs text-purple-600">These will appear in your monthly reports.</p>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <ul className="space-y-2">
                        {selectedQuarterly.overallUpdates.nextQuarterCheckpoints?.map((cp) => (
                            <li key={cp.id} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded shadow-sm border border-gray-100">
                                <span className="text-purple-500 font-bold mt-0.5">•</span>
                                <span className="flex-1">{cp.text}</span>
                                {isEditable && (
                                    <button onClick={() => actions.handleRemoveCheckpoint(cp.id)} className="text-gray-300 hover:text-red-500">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    {isEditable && (
                        <div className="flex gap-2 pt-2">
                            <Input 
                                placeholder="New Checkpoint..." 
                                className="h-8 text-xs"
                                value={inputs.newCheckpoint}
                                onChange={(e) => setNewCheckpoint(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && actions.handleAddCheckpoint()}
                            />
                            <Button 
                                size="sm" variant="secondary" className="h-8 w-8 p-0"
                                onClick={actions.handleAddCheckpoint}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* FEEDBACK DISPLAY */}
            {selectedQuarterly.feedback && (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                        <CardTitle className="text-yellow-800 text-sm">Reviewer Remarks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-yellow-900 italic">"{selectedQuarterly.feedback}"</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}