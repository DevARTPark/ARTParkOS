import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Tabs } from "../../components/ui/Tabs";
import { Calendar } from "lucide-react";

// Import Data
import {
  currentQuarterGoals,
  monthlyReports as initialMonthlyReports,
  quarterlyReports as initialQuarterlyReports,
  performanceMetrics,
  performanceChartData,
  ReportDetail as BaseReportDetail,
  QuarterlyReport,
  Task,
  PromiseItem,
  Expense as BaseExpense,
} from "../../data/founderReviewsData";

// IMPORT QUESTIONS FOR DROPDOWN
import { airlQuestions } from "../../data/mockData";

// --- SUB-PAGES IMPORTS ---
import { MonthlyReports } from "./MonthlyReports";
import { QuarterlyReports } from "./QuarterlyReports";
import { BudgetSheet } from "./BudgetSheet";
import { OverallPerformance } from "./OverallPerformance";

// --- CONSTANTS ---
export const RE_CATEGORIES = [
  "Others",
  "Salaries",
  "Subscriptions",
  "Cloud Costs",
  "Office Expenses",
  "Maintenance",
  "Marketing",
];

export const NRE_CATEGORIES = [
  "Others",
  "Hardware Purchase",
  "Prototyping",
  "R&D Setup",
  "Software Build",
  "Legal & IP",
  "Office Setup",
];

export const PROJECT_COLORS = [
  "#4f46e5",
  "#f97316",
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f43f5e",
];

// --- LOCAL TYPES ---
export interface Expense extends BaseExpense {
  type: "RE" | "NRE";
  category?: string;
  periodicity?: "Monthly" | "Quarterly" | "Yearly";
}

export interface StartupUpdate {
  highlights: string;
  risks: string;
  scheduleTasks: Task[];
  expenses: Expense[];
}

export interface ReportDetail extends Omit<BaseReportDetail, "projectUpdates"> {
  projectUpdates: (BaseReportDetail["projectUpdates"][0] & {
    expenses: Expense[];
  })[];
  startupUpdates: StartupUpdate;
}

export interface ExpenseInput {
  item: string;
  amount: string;
  type: "RE" | "NRE";
  category: string;
  periodicity: "Monthly" | "Quarterly" | "Yearly";
}

// Helper to adapt/migrate data
const adaptReports = (reports: any[]): ReportDetail[] => {
  if (!Array.isArray(reports)) return [];
  return reports.map((r) => ({
    ...r,
    projectUpdates: r.projectUpdates
      ? r.projectUpdates.map((p: any) => ({
          ...p,
          expenses: p.expenses
            ? p.expenses.map((e: any) => ({
                ...e,
                type: e.type || "NRE",
                category: e.category || "Others",
              }))
            : [],
        }))
      : [],
    startupUpdates: r.startupUpdates
      ? {
          ...r.startupUpdates,
          expenses: r.startupUpdates.expenses
            ? r.startupUpdates.expenses.map((e: any) => ({
                ...e,
                type: e.type || "NRE",
                category: e.category || "Others",
              }))
            : [],
        }
      : {
          highlights: "",
          risks: "",
          scheduleTasks: [],
          expenses: [],
        },
  }));
};

export function FounderReviews() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [selectedQuarterly, setSelectedQuarterly] = useState<QuarterlyReport | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE FOR PERSISTENCE ---
  const [reports, setReports] = useState<ReportDetail[]>(() => {
    try {
      const saved = localStorage.getItem("founder_monthly_reports");
      return saved
        ? adaptReports(JSON.parse(saved))
        : adaptReports(initialMonthlyReports);
    } catch (e) {
      console.error("Failed to load reports", e);
      return adaptReports(initialMonthlyReports);
    }
  });

  const [qReports, setQReports] = useState<QuarterlyReport[]>(() => {
    try {
      const saved = localStorage.getItem("founder_quarterly_reports");
      return saved ? JSON.parse(saved) : initialQuarterlyReports;
    } catch (e) {
      return initialQuarterlyReports;
    }
  });

  useEffect(() => {
    localStorage.setItem("founder_monthly_reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("founder_quarterly_reports", JSON.stringify(qReports));
  }, [qReports]);

  // --- INPUT STATES ---
  const [newTaskInput, setNewTaskInput] = useState<
    Record<string, { title: string; date: string; description: string }>
  >({});
  
  const [newExpenseInput, setNewExpenseInput] = useState<
    Record<string, ExpenseInput>
  >({});
  
  const [newPointInput, setNewPointInput] = useState<Record<string, string>>({}); 

  // Startup Level Inputs
  const [newStartupTaskInput, setNewStartupTaskInput] = useState<{
    title: string;
    date: string;
    description: string;
  }>({ title: "", date: "", description: "" });
  
  const [newStartupExpenseInput, setNewStartupExpenseInput] = useState<ExpenseInput>({
      item: "",
      amount: "",
      type: "NRE",
      category: "Others",
      periodicity: "Monthly",
  });
  
  const [newStartupPointInput, setNewStartupPointInput] = useState<{
    highlights: string;
    risks: string;
  }>({ highlights: "", risks: "" });

  const [newCheckpoint, setNewCheckpoint] = useState("");

  // --- DATE HELPERS ---
  const getMonthDate = (monthYear: string) => {
    const [month, year] = monthYear.split(" ");
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return { monthIndex: months.indexOf(month), year: parseInt(year) };
  };

  const getAbsMonth = (monthYear: string) => {
    const { monthIndex, year } = getMonthDate(monthYear);
    return year * 12 + monthIndex;
  };

  const getDeadlineForMonth = (monthYearStr: string) => {
    const { monthIndex, year } = getMonthDate(monthYearStr);
    const date = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
    return date;
  };

  const getStartDateForMonth = (monthYearStr: string) => {
    const { monthIndex, year } = getMonthDate(monthYearStr);
    return new Date(year, monthIndex, 1);
  };

  const isReportLocked = (report: ReportDetail) => {
    const deadline = getDeadlineForMonth(report.month);
    const now = new Date();
    return now > deadline;
  };

  const isReportFuture = (report: ReportDetail) => {
    const start = getStartDateForMonth(report.month);
    const now = new Date();
    return now < start;
  };

  const getReportDisplayStatus = (report: ReportDetail) => {
    const locked = isReportLocked(report);
    if (locked) {
      if (report.status === "Submitted") return "Reviewed";
      if (report.status === "Pending") return "Auto-Submitted";
      return report.status;
    }
    return report.status;
  };

  // --- HANDLERS ---
  const handleOpenReport = (report: ReportDetail) => {
    if (isReportFuture(report)) {
      alert("This report is for a future month and cannot be started yet.");
      return;
    }
    setSelectedReport(report);
  };

  const handleOpenQuarterly = (report: QuarterlyReport) => {
    setSelectedQuarterly(report);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
    setSelectedQuarterly(null);
    setNewTaskInput({});
    setNewExpenseInput({});
    setNewPointInput({});
    setNewStartupTaskInput({ title: "", date: "", description: "" });
    setNewStartupExpenseInput({
      item: "",
      amount: "",
      type: "NRE",
      category: "Others",
      periodicity: "Monthly",
    });
    setNewStartupPointInput({ highlights: "", risks: "" });
    setNewCheckpoint("");
  };

  const handleSaveReport = () => {
    if (!selectedReport) return;
    setIsSaving(true);
    const updatedReports = reports.map((r) =>
      r.reportId === selectedReport.reportId ? selectedReport : r
    );
    setReports(updatedReports);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const handleSubmitReport = () => {
    if (!selectedReport) return;
    const updatedReport = { ...selectedReport, status: "Submitted" as const };
    setSelectedReport(updatedReport);
    const updatedReports = reports.map((r) =>
      r.reportId === selectedReport.reportId ? updatedReport : r
    );
    setReports(updatedReports);
    handleSaveReport();
  };

  // --- POINTERS HANDLERS ---
  const getPoints = (text: string) => {
    if (!text) return [];
    return text.split("\n").filter((line) => line.trim() !== "");
  };

  const handleAddPoint = (projectId: string, field: "highlights" | "risks") => {
    const key = `${projectId}_${field}`;
    const textToAdd = newPointInput[key]?.trim();
    if (!textToAdd || !selectedReport) return;

    const project = selectedReport.projectUpdates.find(
      (p) => p.projectId === projectId
    );
    if (!project) return;

    const currentText = project[field] || "";
    const newText = currentText ? `${currentText}\n${textToAdd}` : textToAdd;

    updateProjectField(projectId, field, newText);
    setNewPointInput({ ...newPointInput, [key]: "" });
  };

  const handleRemovePoint = (
    projectId: string,
    field: "highlights" | "risks",
    indexToRemove: number
  ) => {
    if (!selectedReport) return;
    const project = selectedReport.projectUpdates.find(
      (p) => p.projectId === projectId
    );
    if (!project) return;

    const currentPoints = getPoints(project[field]);
    const newPoints = currentPoints.filter((_, idx) => idx !== indexToRemove);
    updateProjectField(projectId, field, newPoints.join("\n"));
  };

  const updateProjectField = (
    projectId: string,
    field: "highlights" | "risks",
    val: string
  ) => {
    if (!selectedReport) return;
    const updated = selectedReport.projectUpdates.map((p) =>
      p.projectId === projectId ? { ...p, [field]: val } : p
    );
    setSelectedReport({ ...selectedReport, projectUpdates: updated });
  };

  const handleAddStartupPoint = (field: "highlights" | "risks") => {
    const textToAdd = newStartupPointInput[field]?.trim();
    if (!textToAdd || !selectedReport) return;

    const currentText = selectedReport.startupUpdates[field] || "";
    const newText = currentText ? `${currentText}\n${textToAdd}` : textToAdd;

    const updatedReport = {
      ...selectedReport,
      startupUpdates: {
        ...selectedReport.startupUpdates,
        [field]: newText,
      },
    };
    setSelectedReport(updatedReport);
    setNewStartupPointInput({ ...newStartupPointInput, [field]: "" });
  };

  const handleRemoveStartupPoint = (
    field: "highlights" | "risks",
    indexToRemove: number
  ) => {
    if (!selectedReport) return;
    const currentPoints = getPoints(selectedReport.startupUpdates[field]);
    const newPoints = currentPoints.filter((_, idx) => idx !== indexToRemove);

    const updatedReport = {
      ...selectedReport,
      startupUpdates: {
        ...selectedReport.startupUpdates,
        [field]: newPoints.join("\n"),
      },
    };
    setSelectedReport(updatedReport);
  };

  // --- QUARTERLY HANDLERS ---
  const handleQuarterlyOverallUpdate = (
    field: "highlights" | "risks" | "strategy",
    val: string
  ) => {
    if (!selectedQuarterly) return;
    setSelectedQuarterly({
      ...selectedQuarterly,
      overallUpdates: { ...selectedQuarterly.overallUpdates, [field]: val },
    });
  };

  const handleTogglePromise = (promiseId: string) => {
    if (!selectedQuarterly || selectedQuarterly.status === "Reviewed") return;
    const updatedGoals = selectedQuarterly.committedGoals.map((g) => {
      if (g.id !== promiseId) return g;
      if (g.status === "Pending") return { ...g, status: "Met" as const };
      if (g.status === "Met") return { ...g, status: "Missed" as const };
      return { ...g, status: "Pending" as const };
    });
    setSelectedQuarterly({
      ...selectedQuarterly,
      committedGoals: updatedGoals,
    });
  };

  const handleAddCheckpoint = () => {
    if (!selectedQuarterly || !newCheckpoint.trim()) return;
    const newItem: PromiseItem = {
      id: `np-${Date.now()}`,
      text: newCheckpoint,
      status: "Pending",
    };
    setSelectedQuarterly({
      ...selectedQuarterly,
      overallUpdates: {
        ...selectedQuarterly.overallUpdates,
        nextQuarterCheckpoints: [
          ...selectedQuarterly.overallUpdates.nextQuarterCheckpoints,
          newItem,
        ],
      },
    });
    setNewCheckpoint("");
  };

  const handleRemoveCheckpoint = (id: string) => {
    if (!selectedQuarterly) return;
    setSelectedQuarterly({
      ...selectedQuarterly,
      overallUpdates: {
        ...selectedQuarterly.overallUpdates,
        nextQuarterCheckpoints:
          selectedQuarterly.overallUpdates.nextQuarterCheckpoints.filter(
            (i) => i.id !== id
          ),
      },
    });
  };

  // --- MONTHLY TASK HANDLERS ---
  const handleAddTask = (projectId: string) => {
    const input = newTaskInput[projectId];
    if (!input || !input.title || !input.date || !selectedReport) return;
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: input.title,
      deadline: input.date,
      description: input.description,
      status: "Pending",
    };
    const updatedProjects = selectedReport.projectUpdates.map((p) =>
      p.projectId === projectId
        ? { ...p, scheduleTasks: [...p.scheduleTasks, newTask] }
        : p
    );
    setSelectedReport({ ...selectedReport, projectUpdates: updatedProjects });
    setNewTaskInput({
      ...newTaskInput,
      [projectId]: { title: "", date: "", description: "" },
    });
  };

  const handleRemoveTask = (projectId: string, taskId: string) => {
    if (!selectedReport) return;
    const updatedProjects = selectedReport.projectUpdates.map((p) =>
      p.projectId === projectId
        ? {
            ...p,
            scheduleTasks: p.scheduleTasks.filter((t) => t.id !== taskId),
          }
        : p
    );
    setSelectedReport({ ...selectedReport, projectUpdates: updatedProjects });
  };

  const handleTaskInputChange = (
    projectId: string,
    field: "title" | "date" | "description",
    val: string
  ) => {
    setNewTaskInput({
      ...newTaskInput,
      [projectId]: {
        ...newTaskInput[projectId],
        [field]: val,
      },
    });
  };

  const handleAddStartupTask = () => {
    const input = newStartupTaskInput;
    if (!input.title || !input.date || !selectedReport) return;
    const newTask: Task = {
      id: `st-${Date.now()}`,
      title: input.title,
      deadline: input.date,
      description: input.description,
      status: "Pending",
    };
    const updatedReport = {
      ...selectedReport,
      startupUpdates: {
        ...selectedReport.startupUpdates,
        scheduleTasks: [
          ...selectedReport.startupUpdates.scheduleTasks,
          newTask,
        ],
      },
    };
    setSelectedReport(updatedReport);
    setNewStartupTaskInput({ title: "", date: "", description: "" });
  };

  const handleRemoveStartupTask = (taskId: string) => {
    if (!selectedReport) return;
    const updatedReport = {
      ...selectedReport,
      startupUpdates: {
        ...selectedReport.startupUpdates,
        scheduleTasks: selectedReport.startupUpdates.scheduleTasks.filter(
          (t) => t.id !== taskId
        ),
      },
    };
    setSelectedReport(updatedReport);
  };

  // --- EXPENSE LOGIC ---
  const genId = () => `e-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const addExpenseWithPropagation = (
    reportId: string,
    projectId: string | null,
    input: ExpenseInput
  ) => {
    let safeAmount = parseFloat(input.amount);
    if (isNaN(safeAmount)) safeAmount = 0;

    const type = input.type || "NRE";
    const category = input.category || "Others";
    const periodicity = input.periodicity || "Monthly";

    const newExpense: Expense = {
      id: genId(),
      item: input.item,
      amount: safeAmount,
      date: new Date().toISOString().split("T")[0],
      type: type,
      category: category,
      periodicity: type === "RE" ? periodicity : undefined,
    };

    const selectedReportLocal = reports.find((r) => r.reportId === reportId);
    if (!selectedReportLocal) return;

    const currentAbsMonth = getAbsMonth(selectedReportLocal.month);

    const updatedReports = reports.map((report) => {
      // A. Update Current Report
      if (report.reportId === reportId) {
        if (projectId) {
          return {
            ...report,
            projectUpdates: report.projectUpdates.map((p) =>
              p.projectId === projectId
                ? { ...p, expenses: [...(p.expenses || []), newExpense] }
                : p
            ),
          };
        } else {
          return {
            ...report,
            startupUpdates: {
              ...report.startupUpdates,
              expenses: [...report.startupUpdates.expenses, newExpense],
            },
          };
        }
      }

      // B. Future Propagation
      if (type === "RE") {
        const targetAbsMonth = getAbsMonth(report.month);
        if (targetAbsMonth > currentAbsMonth) {
          const diff = targetAbsMonth - currentAbsMonth;
          let shouldAdd = false;
          if (periodicity === "Monthly") shouldAdd = true;
          else if (periodicity === "Quarterly" && diff % 3 === 0)
            shouldAdd = true;
          else if (periodicity === "Yearly" && diff % 12 === 0)
            shouldAdd = true;

          if (shouldAdd) {
            const propagatedExpense = {
              ...newExpense,
              id: genId(),
              date: getStartDateForMonth(report.month)
                .toISOString()
                .split("T")[0],
            };

            if (projectId) {
              return {
                ...report,
                projectUpdates: report.projectUpdates.map((p) =>
                  p.projectId === projectId
                    ? {
                        ...p,
                        expenses: [...(p.expenses || []), propagatedExpense],
                      }
                    : p
                ),
              };
            } else {
              return {
                ...report,
                startupUpdates: {
                  ...report.startupUpdates,
                  expenses: [
                    ...report.startupUpdates.expenses,
                    propagatedExpense,
                  ],
                },
              };
            }
          }
        }
      }
      return report;
    });

    setReports(updatedReports);
    const updatedSelected = updatedReports.find((r) => r.reportId === reportId);
    if (updatedSelected) setSelectedReport(updatedSelected);
  };

  const handleAddProjectExpense = (projectId: string) => {
    if (!selectedReport) return;
    const input = newExpenseInput[projectId];
    if (!input || !input.item || !input.amount) return;

    addExpenseWithPropagation(selectedReport.reportId, projectId, input);
    setNewExpenseInput({
      ...newExpenseInput,
      [projectId]: {
        item: "",
        amount: "",
        type: "NRE",
        category: "Others",
        periodicity: "Monthly",
      },
    });
  };

  const handleAddStartupExpense = () => {
    if (!selectedReport) return;
    const input = newStartupExpenseInput;
    if (!input.item || !input.amount) return;

    addExpenseWithPropagation(selectedReport.reportId, null, input);
    setNewStartupExpenseInput({
      item: "",
      amount: "",
      type: "NRE",
      category: "Others",
      periodicity: "Monthly",
    });
  };

  const handleRemoveExpense = (projectId: string | null, expenseId: string) => {
    if (!selectedReport) return;

    const updatedReports = reports.map((r) => {
      if (r.reportId === selectedReport.reportId) {
        if (projectId) {
          return {
            ...r,
            projectUpdates: r.projectUpdates.map((p) =>
              p.projectId === projectId
                ? {
                    ...p,
                    expenses: (p.expenses || []).filter(
                      (e) => e.id !== expenseId
                    ),
                  }
                : p
            ),
          };
        } else {
          return {
            ...r,
            startupUpdates: {
              ...r.startupUpdates,
              expenses: r.startupUpdates.expenses.filter(
                (e) => e.id !== expenseId
              ),
            },
          };
        }
      }
      return r;
    });

    setReports(updatedReports);
    const updatedSelected = updatedReports.find(
      (r) => r.reportId === selectedReport.reportId
    );
    if (updatedSelected) setSelectedReport(updatedSelected);
  };

  const handleExpenseInputChange = (
    projectId: string,
    field: keyof ExpenseInput,
    val: string
  ) => {
    if (field === "type") {
      const newType = val as "RE" | "NRE";
      const defaultCat = "Others";
      setNewExpenseInput({
        ...newExpenseInput,
        [projectId]: {
          ...newExpenseInput[projectId],
          type: newType,
          category: defaultCat,
          periodicity: newExpenseInput[projectId]?.periodicity || "Monthly",
        },
      });
      return;
    }

    setNewExpenseInput({
      ...newExpenseInput,
      [projectId]: {
        ...newExpenseInput[projectId],
        type: newExpenseInput[projectId]?.type || "NRE",
        category: newExpenseInput[projectId]?.category || "Others",
        periodicity: newExpenseInput[projectId]?.periodicity || "Monthly",
        [field]: val,
      },
    });
  };

  const handleStartupExpenseInputChange = (
    field: keyof ExpenseInput,
    val: string
  ) => {
    if (field === "type") {
      const newType = val as "RE" | "NRE";
      setNewStartupExpenseInput({
        ...newStartupExpenseInput,
        type: newType,
        category: "Others",
      });
      return;
    }
    setNewStartupExpenseInput({ ...newStartupExpenseInput, [field]: val });
  };

  // --- HELPER: getExpenseTotal ---
  const getExpenseTotal = (expenses: Expense[]) => {
    return (expenses || []).reduce((sum, item) => {
      let val =
        typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      if (isNaN(val)) val = 0;
      return sum + val;
    }, 0);
  };

  // --- BUDGET SHEET DATA (MEMOIZED) ---
  const budgetSheetData = useMemo(() => {
    if (!reports) return [];

    const data = reports.map((report) => {
      let totalRE = 0;
      let totalNRE = 0;
      const breakdowns: { name: string; total: number }[] = [];

      // 1. Calculate Project Expenses
      report.projectUpdates.forEach((p) => {
        let pTotal = 0;
        (p.expenses || []).forEach((e: any) => {
          let val = parseFloat(e.amount);
          if (isNaN(val)) val = 0;
          if (e.type === "RE") totalRE += val;
          else totalNRE += val;
          pTotal += val;
        });
        breakdowns.push({ name: p.projectName, total: pTotal });
      });

      // 2. Calculate Startup Expenses
      let startupTotal = 0;
      (report.startupUpdates?.expenses || []).forEach((e: any) => {
        let val = parseFloat(e.amount);
        if (isNaN(val)) val = 0;
        if (e.type === "RE") totalRE += val;
        else totalNRE += val;
        startupTotal += val;
      });
      if (startupTotal > 0 || report.startupUpdates?.expenses?.length > 0) {
        breakdowns.unshift({ name: "Startup Level", total: startupTotal });
      }

      return {
        month: report.month,
        status: report.status,
        totalRE,
        totalNRE,
        total: totalRE + totalNRE,
        breakdown: breakdowns,
      };
    });

    return data;
  }, [reports]);

  // --- PROJECT WISE EXPENSE DATA ---
  const projectWiseExpenseData = useMemo(() => {
    if (!reports) return [];
    const totals: Record<string, number> = {};

    reports.forEach((report) => {
      if (report.startupUpdates?.expenses) {
        const sum = getExpenseTotal(report.startupUpdates.expenses);
        totals["Startup Level"] = (totals["Startup Level"] || 0) + sum;
      }
      if (report.projectUpdates) {
        report.projectUpdates.forEach((p) => {
          const sum = getExpenseTotal(p.expenses);
          totals[p.projectName] = (totals[p.projectName] || 0) + sum;
        });
      }
    });

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [reports]);

  return (
    <DashboardLayout role="founder" title="Performance Reviews & Reports">
      {/* LOGIC: 
        If no report is selected (Detail View is inactive), show the Tabs.
        If a report is selected, the specific Sub-Component (MonthlyReports) will handle the Detail View rendering.
      */}
      {!selectedReport && !selectedQuarterly && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <Tabs
              tabs={[
                { id: "monthly", label: "Monthly Updates" },
                { id: "quarterly", label: "Quarterly Deep Dive" },
                { id: "budget", label: "Budget Sheet" },
                { id: "performance", label: "Overall Performance" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <div className="text-sm text-gray-500 flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Today:{" "}
              <span className="font-semibold text-gray-900 ml-1">
                {new Date().toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </>
      )}

      {/* --- PAGE 1: MONTHLY REPORTS (List & Detail) --- */}
      {/* Renders if tab is monthly OR if we are in detailed view (selectedReport) */}
      {(activeTab === "monthly" || selectedReport) && !selectedQuarterly && (
        <MonthlyReports
          reports={reports}
          selectedReport={selectedReport}
          currentQuarterGoals={currentQuarterGoals}
          isSaving={isSaving}
          airlQuestions={airlQuestions}
          // Handlers
          onSelectReport={handleOpenReport}
          onBack={handleBackToList}
          onSave={handleSaveReport}
          onSubmit={handleSubmitReport}
          // Input State
          inputs={{
             newTaskInput,
             newExpenseInput,
             newPointInput,
             newStartupTaskInput,
             newStartupExpenseInput,
             newStartupPointInput
          }}
          // Action Handlers
          actions={{
             handleAddTask,
             handleRemoveTask,
             handleTaskInputChange,
             handleAddStartupTask,
             handleRemoveStartupTask,
             handleAddProjectExpense,
             handleAddStartupExpense,
             handleRemoveExpense,
             handleExpenseInputChange,
             handleStartupExpenseInputChange,
             handleAddPoint,
             handleRemovePoint,
             handleAddStartupPoint,
             handleRemoveStartupPoint
          }}
          // Helpers
          helpers={{
             getDeadlineForMonth,
             getStartDateForMonth,
             isReportLocked,
             isReportFuture,
             getReportDisplayStatus,
             getPoints,
             getExpenseTotal
          }}
        />
      )}

      {/* --- PAGE 2: QUARTERLY REPORTS --- */}
      {(activeTab === "quarterly" || selectedQuarterly) && !selectedReport && (
        <QuarterlyReports
          reports={qReports}
          selectedQuarterly={selectedQuarterly}
          onSelect={handleOpenQuarterly}
          onBack={handleBackToList}
          // Pass necessary handlers/state for quarterly
          inputs={{ newCheckpoint }}
          setNewCheckpoint={setNewCheckpoint}
          actions={{
            handleQuarterlyOverallUpdate,
            handleTogglePromise,
            handleAddCheckpoint,
            handleRemoveCheckpoint
          }}
        />
      )}

      {/* --- PAGE 3: BUDGET SHEET --- */}
      {activeTab === "budget" && !selectedReport && !selectedQuarterly && (
        <BudgetSheet 
          data={budgetSheetData}
          projectExpenses={projectWiseExpenseData}
        />
      )}

      {/* --- PAGE 4: OVERALL PERFORMANCE --- */}
      {activeTab === "performance" && !selectedReport && !selectedQuarterly && (
        <OverallPerformance 
          metrics={performanceMetrics}
          chartData={performanceChartData}
        />
      )}

    </DashboardLayout>
  );
}