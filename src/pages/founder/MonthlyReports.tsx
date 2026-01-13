import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import {
  Calendar,
  Target,
  ChevronLeft,
  Upload,
  MessageSquare,
  AlertCircle,
  Building2,
  CheckCircle2,
  X,
  Plus,
  ArrowDownCircle,
  Trash2,
  CreditCard,
  RefreshCw,
  Lock,
  Unlock,
  DollarSign,
  Info
} from "lucide-react";

// Import Constants from Parent
import { 
  RE_CATEGORIES, 
  NRE_CATEGORIES, 
  FUNDING_SOURCES, 
  ReportDetail, 
  ExpenseInput,
} from "./FounderReviews";

interface MonthlyReportsProps {
  reports: ReportDetail[];
  selectedReport: ReportDetail | null;
  currentQuarterGoals: string[];
  isSaving: boolean;
  airlQuestions: any[];

  // Handlers
  onSelectReport: (report: ReportDetail) => void;
  onBack: () => void;
  onSave: () => void;
  onSubmit: () => void;

  // Inputs State
  inputs: {
    newTaskInput: Record<string, { title: string; date: string; description: string }>;
    newExpenseInput: Record<string, ExpenseInput>;
    newPointInput: Record<string, string>;
    newStartupTaskInput: { title: string; date: string; description: string };
    newStartupExpenseInput: ExpenseInput;
    newStartupPointInput: { highlights: string; risks: string };
  };

  // Action Handlers
  actions: {
    handleAddTask: (projectId: string) => void;
    handleRemoveTask: (projectId: string, taskId: string) => void;
    handleTaskInputChange: (projectId: string, field: "title" | "date" | "description", val: string) => void;
    
    handleAddStartupTask: () => void;
    handleRemoveStartupTask: (taskId: string) => void;
    handleStartupTaskInputChange?: (field: "title" | "date" | "description", val: string) => void; // Optional if you add it to parent
    
    handleAddProjectExpense: (projectId: string) => void;
    handleAddStartupExpense: () => void;
    handleRemoveExpense: (projectId: string | null, expenseId: string) => void;
    
    handleExpenseInputChange: (projectId: string, field: keyof ExpenseInput, val: string) => void;
    handleStartupExpenseInputChange: (field: keyof ExpenseInput, val: string) => void;
    
    handleAddPoint: (projectId: string, field: "highlights" | "risks") => void;
    handleRemovePoint: (projectId: string, field: "highlights" | "risks", indexToRemove: number) => void;
    
    handleAddStartupPoint: (field: "highlights" | "risks") => void;
    handleRemoveStartupPoint: (field: "highlights" | "risks", indexToRemove: number) => void;
    // ADDED: Handler for typing in the startup points input
    handleStartupPointInputChange?: (field: "highlights" | "risks", val: string) => void;
  };

  // Helpers
  helpers: {
    getDeadlineForMonth: (monthYear: string) => Date;
    isReportLocked: (report: ReportDetail) => boolean;
    isReportFuture: (report: ReportDetail) => boolean;
    getReportDisplayStatus: (report: ReportDetail) => string;
    getPoints: (text: string) => string[];
    getExpenseTotal: (expenses: any[]) => number;
    getQuarterlyPromises?: (month: string) => string[]; 
  };
}

export function MonthlyReports({
  reports,
  selectedReport,
  currentQuarterGoals,
  isSaving,
  onSelectReport,
  onBack,
  onSave,
  onSubmit,
  inputs,
  actions,
  helpers
}: MonthlyReportsProps) {
  
  const {
    getDeadlineForMonth,
    isReportLocked,
    isReportFuture,
    getReportDisplayStatus,
    getPoints,
    getExpenseTotal
  } = helpers;

  const isLockedForEditing = selectedReport ? isReportLocked(selectedReport) : false;

  // --- RENDER LIST VIEW ---
  if (!selectedReport) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="lg:col-span-2 space-y-4">
          {reports.map((report) => {
            const locked = isReportLocked(report);
            const future = isReportFuture(report);
            const displayStatus = getReportDisplayStatus(report);
            const deadline = getDeadlineForMonth(report.month);

            return (
              <Card
                key={report.reportId}
                className={`transition-all ${
                  locked
                    ? "bg-gray-50"
                    : future
                    ? "opacity-60"
                    : "hover:shadow-md border-l-4 border-l-blue-400"
                }`}
              >
                <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        displayStatus === "Reviewed"
                          ? "bg-green-100 text-green-600"
                          : displayStatus === "Submitted"
                          ? "bg-blue-100 text-blue-600"
                          : locked
                          ? "bg-purple-100 text-purple-600"
                          : future
                          ? "bg-gray-100 text-gray-300"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {locked ? (
                        <Lock className="w-5 h-5" />
                      ) : future ? (
                        <Calendar className="w-5 h-5" />
                      ) : (
                        <Unlock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {report.month}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Deadline: {deadline.toLocaleDateString()} 11:59 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Badge
                      variant={
                        displayStatus === "Reviewed" ||
                        displayStatus === "Submitted"
                          ? "success"
                          : displayStatus === "Auto-Submitted"
                          ? "neutral"
                          : future
                          ? "neutral"
                          : "warning"
                      }
                    >
                      {displayStatus}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectReport(report)}
                      disabled={future}
                    >
                      {locked
                        ? "View Report"
                        : displayStatus === "Submitted"
                        ? "Edit / View"
                        : "Start Report"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div>
          <Card className="bg-blue-50 border-blue-100 h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Target className="w-5 h-5 mr-2" /> Current Focus
              </CardTitle>
              <p className="text-xs text-blue-600 mt-1">
                Checkpoints from Quarterly Strategy
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuarterGoals.map((goal, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-white p-2.5 rounded-lg border border-blue-100 shadow-sm"
                >
                  <div className="mt-0.5 min-w-[1.25rem]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                      {idx + 1}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {goal}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- RENDER DETAIL VIEW ---
  return (
    <div className="animate-in fade-in slide-in-from-right-4">
      {/* STICKY HEADER */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedReport.month} Report
              </h2>
              {isLockedForEditing && <Lock className="w-4 h-4 text-gray-400" />}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge variant={isLockedForEditing ? "neutral" : "success"}>
                {getReportDisplayStatus(selectedReport)}
              </Badge>
              <span>•</span>
              <span
                className={
                  isLockedForEditing
                    ? "text-red-500 font-medium"
                    : "text-blue-600"
                }
              >
                {isLockedForEditing
                  ? "Submissions Closed"
                  : `Editable until ${getDeadlineForMonth(
                      selectedReport.month
                    ).toLocaleDateString()} 11:59 PM`}
              </span>
            </div>
          </div>
        </div>
        {!isLockedForEditing && (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={onSubmit}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              {selectedReport.status === "Submitted"
                ? "Update Submission"
                : "Submit Report"}
            </Button>
          </div>
        )}
      </div>

      {/* REVIEWER COMMENTS SECTION */}
      {isLockedForEditing && (
        <Card className="mb-8 border-l-4 border-l-purple-500 bg-purple-50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-900">
              <MessageSquare className="w-5 h-5 mr-2" /> Reviewer Feedback &
              Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReport.artparkRemarks ? (
              <div className="prose prose-sm text-purple-900">
                <p className="italic mb-4 text-lg">
                  "{selectedReport.artparkRemarks}"
                </p>
                <div className="p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
                  <h5 className="font-bold text-xs uppercase text-purple-700 mb-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Action Items /
                    Gaps Identified
                  </h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Update financial projections for next month.</li>
                    <li>
                      Clarify risk mitigation strategy for supply chain
                      delays.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic flex items-center">
                <Info className="w-4 h-4 mr-2" /> No reviewer feedback
                available yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
        <div className="xl:col-span-2 space-y-8">
          {/* --- STARTUP LEVEL UPDATES --- */}
          <Card className="border-l-4 border-l-indigo-600 shadow-sm">
            <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-indigo-700" />
                  </div>
                  <CardTitle className="text-lg text-indigo-900">
                    Startup Level Updates
                  </CardTitle>
                </div>
                <Badge variant="neutral" className="bg-white">
                  General
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlights */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />{" "}
                    Highlights
                  </label>
                  <div className="bg-white rounded-md border border-gray-200 p-2 space-y-1 min-h-[80px]">
                    {getPoints(selectedReport.startupUpdates.highlights).length > 0 ? (
                      getPoints(selectedReport.startupUpdates.highlights).map(
                        (point, i) => (
                          <div
                            key={i}
                            className="flex items-start group text-sm p-1 hover:bg-gray-50 rounded"
                          >
                            <span className="text-green-500 mr-2 mt-1">•</span>
                            <span className="flex-1 text-gray-800">{point}</span>
                            {!isLockedForEditing && (
                              <button
                                onClick={() => actions.handleRemoveStartupPoint("highlights", i)}
                                className="text-gray-300 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-xs text-gray-400 italic p-2">
                        No highlights.
                      </p>
                    )}
                    {!isLockedForEditing && (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                        <Input
                          className="h-7 text-xs"
                          placeholder="Add highlight..."
                          value={inputs.newStartupPointInput.highlights}
                          onChange={(e) => {
                            if (actions.handleStartupPointInputChange) {
                              actions.handleStartupPointInputChange("highlights", e.target.value);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => actions.handleAddStartupPoint("highlights")}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Lowlights */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <ArrowDownCircle className="w-3 h-3 text-red-600" />{" "}
                    Lowlights
                  </label>
                  <div className="bg-white rounded-md border border-gray-200 p-2 space-y-1 min-h-[80px]">
                    {getPoints(selectedReport.startupUpdates.risks).length > 0 ? (
                      getPoints(selectedReport.startupUpdates.risks).map(
                        (point, i) => (
                          <div
                            key={i}
                            className="flex items-start group text-sm p-1 hover:bg-gray-50 rounded"
                          >
                            <span className="text-red-500 mr-2 mt-1">•</span>
                            <span className="flex-1 text-gray-800">{point}</span>
                            {!isLockedForEditing && (
                              <button
                                onClick={() => actions.handleRemoveStartupPoint("risks", i)}
                                className="text-gray-300 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-xs text-gray-400 italic p-2">
                        No lowlights.
                      </p>
                    )}
                    {!isLockedForEditing && (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                        <Input
                          className="h-7 text-xs"
                          placeholder="Add lowlight..."
                          value={inputs.newStartupPointInput.risks}
                          onChange={(e) => {
                            if (actions.handleStartupPointInputChange) {
                              actions.handleStartupPointInputChange("risks", e.target.value);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => actions.handleAddStartupPoint("risks")}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Startup Milestones & Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                {/* Milestones */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">
                    Startup Milestones
                  </label>
                  <div className="space-y-2 mb-4">
                    {selectedReport.startupUpdates.scheduleTasks.length > 0 ? (
                      selectedReport.startupUpdates.scheduleTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white border border-gray-200 p-3 rounded-lg"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {task.title}
                            </span>
                            <Badge variant="neutral" className="text-[10px]">
                              {task.deadline}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-end">
                            <p className="text-xs text-gray-500 italic flex-1 mr-2">
                              {task.description}
                            </p>
                            {!isLockedForEditing && (
                              <button
                                onClick={() => actions.handleRemoveStartupTask(task.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No milestones set.
                      </p>
                    )}
                  </div>
                  {!isLockedForEditing && (
                    <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <Input
                        placeholder="Milestone Title"
                        className="h-7 text-xs"
                        value={inputs.newStartupTaskInput.title}
                        onChange={(e) => actions.handleStartupTaskInputChange && actions.handleStartupTaskInputChange("title", e.target.value)}
                      />
                      <Input
                        type="date"
                        className="h-7 text-xs"
                        value={inputs.newStartupTaskInput.date}
                        onChange={(e) => actions.handleStartupTaskInputChange && actions.handleStartupTaskInputChange("date", e.target.value)}
                      />
                      <Input
                        placeholder="Description"
                        className="h-7 text-xs"
                        value={inputs.newStartupTaskInput.description}
                        onChange={(e) => actions.handleStartupTaskInputChange && actions.handleStartupTaskInputChange("description", e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full h-7 text-xs mt-1"
                        onClick={actions.handleAddStartupTask}
                        disabled={!inputs.newStartupTaskInput.title}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>

                {/* Expenses */}
                <div className="border-l border-gray-100 pl-6">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-3 h-3 mr-1.5" /> Startup Expense
                      Sheet
                    </div>
                    <Badge variant="neutral">
                      Total: ₹
                      {getExpenseTotal(selectedReport.startupUpdates.expenses)}
                    </Badge>
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                          <th className="px-3 py-2 text-left">Item / Category</th>
                          <th className="px-2 py-2 text-center">Type / Source</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          {!isLockedForEditing && (
                            <th className="px-2 py-2 w-6"></th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(selectedReport.startupUpdates.expenses || []).length >
                        0 ? (
                          selectedReport.startupUpdates.expenses.map((exp) => (
                            <tr key={exp.id} className="bg-white">
                              <td className="px-3 py-2">
                                <div className="text-gray-900 font-medium">
                                  {exp.item}
                                </div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-2">
                                  <span>{exp.category}</span>
                                  {exp.type === "RE" && exp.periodicity && (
                                    <span className="bg-indigo-50 text-indigo-700 px-1 rounded flex items-center">
                                      <RefreshCw className="w-2 h-2 mr-1" />{" "}
                                      {exp.periodicity}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-2 text-center">
                                <div className="flex flex-col gap-1 items-center">
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                      exp.type === "RE"
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "bg-orange-50 text-orange-700"
                                    }`}
                                  >
                                    {exp.type}
                                  </span>
                                  <span className="text-[10px] font-medium text-gray-500 border border-gray-200 px-1 rounded bg-gray-50">
                                    {exp.fundingSource}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-right font-mono">
                                ₹{exp.amount}
                              </td>
                              {!isLockedForEditing && (
                                <td className="px-2 py-2 text-center">
                                  <button
                                    onClick={() =>
                                      actions.handleRemoveExpense(null, exp.id)
                                    }
                                    className="text-gray-300 hover:text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-3 py-4 text-center text-gray-400 italic"
                            >
                              No expenses recorded.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {!isLockedForEditing && (
                    <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Item Name"
                          className="h-7 text-xs flex-1"
                          value={inputs.newStartupExpenseInput.item}
                          onChange={(e) => actions.handleStartupExpenseInputChange("item", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="₹ Amount"
                          className="h-7 text-xs w-24"
                          value={inputs.newStartupExpenseInput.amount}
                          onChange={(e) => actions.handleStartupExpenseInputChange("amount", e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        {/* Type Selector */}
                        <select
                          className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-16"
                          value={inputs.newStartupExpenseInput.type}
                          onChange={(e) => actions.handleStartupExpenseInputChange("type", e.target.value)}
                        >
                          <option value="NRE">NRE</option>
                          <option value="RE">RE</option>
                        </select>

                        {/* Source Selector (NEW) */}
                        <select
                          className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-16"
                          value={inputs.newStartupExpenseInput.fundingSource}
                          onChange={(e) => actions.handleStartupExpenseInputChange("fundingSource", e.target.value)}
                        >
                          {FUNDING_SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
                        </select>

                        {/* Category Selector */}
                        <select
                          className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none flex-1"
                          value={inputs.newStartupExpenseInput.category}
                          onChange={(e) => actions.handleStartupExpenseInputChange("category", e.target.value)}
                        >
                           {(inputs.newStartupExpenseInput.type === "RE"
                              ? RE_CATEGORIES
                              : NRE_CATEGORIES
                            ).map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 text-xs px-3"
                          onClick={actions.handleAddStartupExpense}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- PROJECT UPDATES --- */}
          {selectedReport.projectUpdates.map((project, index) => (
            <Card
              key={project.projectId}
              className="border-l-4 border-l-blue-500 shadow-sm"
            >
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {index + 1}
                    </span>
                    <CardTitle className="text-base">
                      {project.projectName}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" className="text-[10px]">
                      Current: AIRL {project.currentAIRL}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Highlights */}
                   <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />{" "}
                          Highlights
                        </label>
                        <div className="bg-white rounded-md border border-gray-200 p-2 space-y-1 min-h-[100px]">
                          {getPoints(project.highlights).length > 0 ? (
                            getPoints(project.highlights).map((point, i) => (
                              <div
                                key={i}
                                className="flex items-start group text-sm p-1 hover:bg-gray-50 rounded"
                              >
                                <span className="text-green-500 mr-2 mt-1">
                                  •
                                </span>
                                <span className="flex-1 text-gray-800">
                                  {point}
                                </span>
                                {!isLockedForEditing && (
                                  <button
                                    onClick={() => actions.handleRemovePoint(project.projectId,"highlights", i)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic p-2">
                              No highlights added yet.
                            </p>
                          )}
                           {!isLockedForEditing && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                               <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                onClick={() => actions.handleAddPoint(project.projectId, "highlights")}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                           )}
                        </div>
                   </div>
                   {/* Lowlights */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <ArrowDownCircle className="w-3 h-3 text-red-600" />{" "}
                          Lowlights
                        </label>
                        <div className="bg-white rounded-md border border-gray-200 p-2 space-y-1 min-h-[100px]">
                           {getPoints(project.risks).map((point, i) => (
                              <div key={i} className="flex items-start text-sm p-1">
                                 <span className="text-red-500 mr-2">•</span>
                                 <span>{point}</span>
                              </div>
                           ))}
                           <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                onClick={() => actions.handleAddPoint(project.projectId, "risks")}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                        </div>
                   </div>
                </div>
                
                {/* Milestones & Project Expenses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex justify-between items-center">
                          <span>Milestones</span>
                        </label>
                        {/* Task List */}
                         <div className="space-y-2 mb-4">
                            {project.scheduleTasks.map(task => (
                                <div key={task.id} className="bg-white border border-gray-200 p-3 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{task.title}</span>
                                        <Badge variant="neutral" className="text-[10px]">{task.deadline}</Badge>
                                    </div>
                                    {!isLockedForEditing && (
                                        <button onClick={() => actions.handleRemoveTask(project.projectId, task.id)}>
                                            <Trash2 className="w-3 h-3 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            ))}
                         </div>
                         {/* Add Task Form */}
                         {!isLockedForEditing && (
                            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <Input 
                                    placeholder="Title" 
                                    className="h-7 text-xs"
                                    value={inputs.newTaskInput[project.projectId]?.title || ""}
                                    onChange={(e) => actions.handleTaskInputChange(project.projectId, "title", e.target.value)}
                                />
                                <Button 
                                    size="sm" variant="secondary" className="w-full h-7 text-xs mt-1"
                                    onClick={() => actions.handleAddTask(project.projectId)}
                                >
                                    Add Milestone
                                </Button>
                            </div>
                         )}
                    </div>

                    <div className="border-l border-gray-100 pl-6">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="w-3 h-3 mr-1.5" /> Expense Sheet
                          </div>
                          <Badge variant="neutral">
                            Total: ₹{getExpenseTotal(project.expenses || [])}
                          </Badge>
                        </label>
                        {/* Expenses Table */}
                         <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Item / Category</th>
                                        <th className="px-2 py-2 text-center">Type / Source</th>
                                        <th className="px-3 py-2 text-right">Amount</th>
                                        {!isLockedForEditing && <th className="px-2 py-2 w-6"></th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(project.expenses || []).map(exp => (
                                        <tr key={exp.id} className="bg-white">
                                            <td className="px-3 py-2">
                                                <div className="text-gray-900 font-medium">{exp.item}</div>
                                                <div className="text-[10px] text-gray-400">{exp.category}</div>
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${exp.type === 'RE' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'}`}>
                                                        {exp.type}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-gray-500 border border-gray-200 px-1 rounded bg-gray-50">
                                                        {exp.fundingSource}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-right font-mono">₹{exp.amount}</td>
                                            {!isLockedForEditing && (
                                                <td className="px-2 py-2 text-center">
                                                    <button onClick={() => actions.handleRemoveExpense(project.projectId, exp.id)} className="text-gray-300 hover:text-red-500">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                         {/* Add Expense Form */}
                         {!isLockedForEditing && (
                             <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                 <div className="flex gap-2">
                                     <Input 
                                        placeholder="Item" className="h-7 text-xs flex-1"
                                        value={inputs.newExpenseInput[project.projectId]?.item || ""}
                                        onChange={(e) => actions.handleExpenseInputChange(project.projectId, "item", e.target.value)}
                                     />
                                     <Input 
                                        placeholder="Amount" className="h-7 text-xs w-24"
                                        value={inputs.newExpenseInput[project.projectId]?.amount || ""}
                                        onChange={(e) => actions.handleExpenseInputChange(project.projectId, "amount", e.target.value)}
                                     />
                                 </div>
                                 <div className="flex gap-2 items-center">
                                     <select 
                                        className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-16"
                                        value={inputs.newExpenseInput[project.projectId]?.type || "NRE"}
                                        onChange={(e) => actions.handleExpenseInputChange(project.projectId, "type", e.target.value)}
                                     >
                                        <option value="NRE">NRE</option>
                                        <option value="RE">RE</option>
                                     </select>
                                     <select 
                                        className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-16"
                                        value={inputs.newExpenseInput[project.projectId]?.fundingSource || "DST"}
                                        onChange={(e) => actions.handleExpenseInputChange(project.projectId, "fundingSource", e.target.value)}
                                     >
                                        {FUNDING_SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
                                     </select>
                                     <Button 
                                        size="sm" variant="secondary" className="h-7 text-xs px-3"
                                        onClick={() => actions.handleAddProjectExpense(project.projectId)}
                                     >
                                        <Plus className="w-3 h-3" />
                                     </Button>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2 bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center text-sm font-bold text-gray-600 uppercase">
                <DollarSign className="w-4 h-4 mr-2" /> Budget (System)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  {selectedReport.budget.utilized}
                </span>
                <span className="text-xs text-gray-500 mb-1">
                  of {selectedReport.budget.total}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Utilized</span>
                <Badge
                  variant={
                    selectedReport.budget.status === "On Track"
                      ? "success"
                      : "danger"
                  }
                >
                  {selectedReport.budget.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}