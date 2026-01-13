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

export const FUNDING_SOURCES = ["DST", "GoK"];

export const PROJECT_COLORS = [
  "#4f46e5",
  "#f97316",
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f43f5e",
];

// Mock Budget Limits
const MOCK_BUDGET_LIMITS = {
  DST: 3000, // Lakhs
  GoK: 500,   // Lakhs
};

// --- LOCAL TYPES ---
export interface Expense extends BaseExpense {
  id: string;
  type: "RE" | "NRE";
  category?: string;
  fundingSource: "DST" | "GoK";
  periodicity?: "Monthly" | "Quarterly" | "Yearly";
  recurringGroupId?: string; // Links expenses across months
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
  fundingSource: "DST" | "GoK";
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
                fundingSource: e.fundingSource || "DST",
                recurringGroupId: e.recurringGroupId || undefined,
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
                fundingSource: e.fundingSource || "DST",
                recurringGroupId: e.recurringGroupId || undefined,
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

  // --- STATE WITH AUTO-GENERATION ---
  const [reports, setReports] = useState<ReportDetail[]>(() => {
    let loaded: ReportDetail[] = [];
    try {
      const saved = localStorage.getItem("founder_monthly_reports");
      loaded = saved ? adaptReports(JSON.parse(saved)) : adaptReports(initialMonthlyReports);
    } catch (e) {
      console.error("Failed to load reports", e);
      loaded = adaptReports(initialMonthlyReports);
    }

    const now = new Date();
    const currentMonthStr = now.toLocaleDateString("default", { month: "long", year: "numeric" });
    
    const exists = loaded.find(r => r.month === currentMonthStr);
    
    if (!exists) {
      const previousReport = loaded.length > 0 ? loaded[0] : null;
      
      const newReport: ReportDetail = {
        reportId: `auto-${Date.now()}`,
        month: currentMonthStr,
        status: "Pending",
        budget: {
           utilized: "0",
           total: previousReport ? previousReport.budget.total : "50L",
           status: "On Track"
        },
        projectUpdates: previousReport 
          ? previousReport.projectUpdates.map(p => ({
              ...p,
              currentAIRL: p.currentAIRL,
              highlights: "",
              risks: "",
              scheduleTasks: [],
              expenses: [] // Do we copy recurring expenses here? 
              // NOTE: If we want strict recursion from previous month even on auto-gen, we'd copy here.
              // For now, relying on "Add Expense" propagation logic.
            }))
          : [],
        startupUpdates: {
          highlights: "",
          risks: "",
          scheduleTasks: [],
          expenses: []
        },
        artparkRemarks: ""
      };
      return [newReport, ...loaded];
    }
    return loaded;
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
      fundingSource: "DST",
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
      fundingSource: "DST",
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

  // --- CONTENT HANDLERS ---
  const getPoints = (text: string) => { if (!text) return []; return text.split("\n").filter((line) => line.trim() !== ""); };
  
  const handleAddPoint = (projectId: string, field: "highlights" | "risks") => {
    const key = `${projectId}_${field}`; const textToAdd = newPointInput[key]?.trim(); if (!textToAdd || !selectedReport) return;
    const project = selectedReport.projectUpdates.find((p) => p.projectId === projectId); if (!project) return;
    const currentText = project[field] || ""; const newText = currentText ? `${currentText}\n${textToAdd}` : textToAdd;
    updateProjectField(projectId, field, newText); setNewPointInput({ ...newPointInput, [key]: "" });
  };
  
  const handleRemovePoint = (projectId: string, field: "highlights" | "risks", indexToRemove: number) => {
    if (!selectedReport) return; const project = selectedReport.projectUpdates.find((p) => p.projectId === projectId); if (!project) return;
    const currentPoints = getPoints(project[field]); const newPoints = currentPoints.filter((_, idx) => idx !== indexToRemove);
    updateProjectField(projectId, field, newPoints.join("\n"));
  };
  
  const updateProjectField = (projectId: string, field: "highlights" | "risks", val: string) => {
    if (!selectedReport) return; const updated = selectedReport.projectUpdates.map((p) => p.projectId === projectId ? { ...p, [field]: val } : p);
    setSelectedReport({ ...selectedReport, projectUpdates: updated });
  };

  // --- STARTUP POINTS HANDLERS ---
  const handleStartupPointInputChange = (field: "highlights" | "risks", val: string) => {
    setNewStartupPointInput(prev => ({ ...prev, [field]: val }));
  };

  const handleAddStartupPoint = (field: "highlights" | "risks") => {
    const textToAdd = newStartupPointInput[field]?.trim(); 
    if (!textToAdd || !selectedReport) return;
    
    const currentText = selectedReport.startupUpdates[field] || ""; 
    const newText = currentText ? `${currentText}\n${textToAdd}` : textToAdd;
    
    const updatedReport = { ...selectedReport, startupUpdates: { ...selectedReport.startupUpdates, [field]: newText } };
    setSelectedReport(updatedReport); 
    setNewStartupPointInput(prev => ({ ...prev, [field]: "" }));
  };
  
  const handleRemoveStartupPoint = (field: "highlights" | "risks", indexToRemove: number) => {
    if (!selectedReport) return; const currentPoints = getPoints(selectedReport.startupUpdates[field]);
    const newPoints = currentPoints.filter((_, idx) => idx !== indexToRemove);
    const updatedReport = { ...selectedReport, startupUpdates: { ...selectedReport.startupUpdates, [field]: newPoints.join("\n") } };
    setSelectedReport(updatedReport);
  };

  const handleQuarterlyOverallUpdate = (field: "highlights" | "risks" | "strategy", val: string) => {
    if (!selectedQuarterly) return; setSelectedQuarterly({ ...selectedQuarterly, overallUpdates: { ...selectedQuarterly.overallUpdates, [field]: val } });
  };
  const handleTogglePromise = (promiseId: string) => {
    if (!selectedQuarterly || selectedQuarterly.status === "Reviewed") return;
    const updatedGoals = selectedQuarterly.committedGoals.map((g) => { if (g.id !== promiseId) return g; if (g.status === "Pending") return { ...g, status: "Met" as const }; if (g.status === "Met") return { ...g, status: "Missed" as const }; return { ...g, status: "Pending" as const }; });
    setSelectedQuarterly({ ...selectedQuarterly, committedGoals: updatedGoals });
  };
  const handleAddCheckpoint = () => {
    if (!selectedQuarterly || !newCheckpoint.trim()) return;
    const newItem: PromiseItem = { id: `np-${Date.now()}`, text: newCheckpoint, status: "Pending" };
    setSelectedQuarterly({ ...selectedQuarterly, overallUpdates: { ...selectedQuarterly.overallUpdates, nextQuarterCheckpoints: [ ...selectedQuarterly.overallUpdates.nextQuarterCheckpoints, newItem ] } });
    setNewCheckpoint("");
  };
  const handleRemoveCheckpoint = (id: string) => {
    if (!selectedQuarterly) return;
    setSelectedQuarterly({ ...selectedQuarterly, overallUpdates: { ...selectedQuarterly.overallUpdates, nextQuarterCheckpoints: selectedQuarterly.overallUpdates.nextQuarterCheckpoints.filter((i) => i.id !== id) } });
  };
  const handleAddTask = (projectId: string) => {
    const input = newTaskInput[projectId]; if (!input || !input.title || !input.date || !selectedReport) return;
    const newTask: Task = { id: `t-${Date.now()}`, title: input.title, deadline: input.date, description: input.description, status: "Pending" };
    const updatedProjects = selectedReport.projectUpdates.map((p) => p.projectId === projectId ? { ...p, scheduleTasks: [...p.scheduleTasks, newTask] } : p);
    setSelectedReport({ ...selectedReport, projectUpdates: updatedProjects });
    setNewTaskInput({ ...newTaskInput, [projectId]: { title: "", date: "", description: "" } });
  };
  const handleRemoveTask = (projectId: string, taskId: string) => {
    if (!selectedReport) return;
    const updatedProjects = selectedReport.projectUpdates.map((p) => p.projectId === projectId ? { ...p, scheduleTasks: p.scheduleTasks.filter((t) => t.id !== taskId) } : p);
    setSelectedReport({ ...selectedReport, projectUpdates: updatedProjects });
  };
  const handleTaskInputChange = (projectId: string, field: "title" | "date" | "description", val: string) => {
    setNewTaskInput({ ...newTaskInput, [projectId]: { ...newTaskInput[projectId], [field]: val } });
  };
  
  // Startup Tasks Input Handlers
  const handleStartupTaskInputChange = (field: "title" | "date" | "description", val: string) => {
    setNewStartupTaskInput(prev => ({...prev, [field]: val}));
  };

  const handleAddStartupTask = () => {
    const input = newStartupTaskInput; if (!input.title || !input.date || !selectedReport) return;
    const newTask: Task = { id: `st-${Date.now()}`, title: input.title, deadline: input.date, description: input.description, status: "Pending" };
    const updatedReport = { ...selectedReport, startupUpdates: { ...selectedReport.startupUpdates, scheduleTasks: [ ...selectedReport.startupUpdates.scheduleTasks, newTask ] } };
    setSelectedReport(updatedReport); setNewStartupTaskInput({ title: "", date: "", description: "" });
  };
  const handleRemoveStartupTask = (taskId: string) => {
    if (!selectedReport) return;
    const updatedReport = { ...selectedReport, startupUpdates: { ...selectedReport.startupUpdates, scheduleTasks: selectedReport.startupUpdates.scheduleTasks.filter((t) => t.id !== taskId) } };
    setSelectedReport(updatedReport);
  };

  // --- EXPENSE LOGIC (ADD / EDIT / REMOVE PROPAGATION) ---
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
    const source = input.fundingSource || "DST";
    const periodicity = input.periodicity || "Monthly";
    
    // Generate a group ID if recurring, to link future instances
    const recurringGroupId = type === "RE" ? `rg-${Date.now()}` : undefined;

    const newExpense: Expense = {
      id: genId(),
      item: input.item,
      amount: safeAmount,
      date: new Date().toISOString().split("T")[0],
      type: type,
      category: category,
      fundingSource: source,
      periodicity: type === "RE" ? periodicity : undefined,
      recurringGroupId: recurringGroupId,
    };

    const selectedReportLocal = reports.find((r) => r.reportId === reportId);
    if (!selectedReportLocal) return;

    const currentAbsMonth = getAbsMonth(selectedReportLocal.month);

    const updatedReports = reports.map((report) => {
      const reportAbsMonth = getAbsMonth(report.month);

      // 1. ADD TO CURRENT REPORT
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

      // 2. PROPAGATE TO FUTURE REPORTS (If RE)
      if (type === "RE" && reportAbsMonth > currentAbsMonth) {
        const diff = reportAbsMonth - currentAbsMonth;
        let shouldAdd = false;
        if (periodicity === "Monthly") shouldAdd = true;
        else if (periodicity === "Quarterly" && diff % 3 === 0) shouldAdd = true;
        else if (periodicity === "Yearly" && diff % 12 === 0) shouldAdd = true;

        if (shouldAdd) {
          const propagatedExpense = {
            ...newExpense,
            id: genId(), // New Unique ID
            date: getStartDateForMonth(report.month).toISOString().split("T")[0],
            // Keep the same recurringGroupId to link them
          };

          if (projectId) {
            return {
              ...report,
              projectUpdates: report.projectUpdates.map((p) =>
                p.projectId === projectId
                  ? { ...p, expenses: [...(p.expenses || []), propagatedExpense] }
                  : p
              ),
            };
          } else {
            return {
              ...report,
              startupUpdates: {
                ...report.startupUpdates,
                expenses: [...report.startupUpdates.expenses, propagatedExpense],
              },
            };
          }
        }
      }
      return report;
    });

    setReports(updatedReports);
    // Update currently selected view
    const updatedSelected = updatedReports.find((r) => r.reportId === reportId);
    if (updatedSelected) setSelectedReport(updatedSelected);
  };

  const handleEditExpense = (
    reportId: string,
    projectId: string | null,
    expenseId: string,
    newValues: Partial<Expense>
  ) => {
    // 1. Find the original expense to check for recurringGroupId
    const selectedReportLocal = reports.find(r => r.reportId === reportId);
    if (!selectedReportLocal) return;

    let originalExpense: Expense | undefined;
    if (projectId) {
      const proj = selectedReportLocal.projectUpdates.find(p => p.projectId === projectId);
      originalExpense = proj?.expenses.find(e => e.id === expenseId);
    } else {
      originalExpense = selectedReportLocal.startupUpdates.expenses.find(e => e.id === expenseId);
    }

    if (!originalExpense) return;

    const currentAbsMonth = getAbsMonth(selectedReportLocal.month);
    const recurringGroupId = originalExpense.recurringGroupId;

    const updatedReports = reports.map(report => {
      const reportAbsMonth = getAbsMonth(report.month);

      // Only affect current and future months
      if (reportAbsMonth < currentAbsMonth) return report;

      // Check if we need to update this report
      const shouldUpdate = 
        (report.reportId === reportId) || // Always update current
        (recurringGroupId && reportAbsMonth > currentAbsMonth); // Update future if linked

      if (!shouldUpdate) return report;

      // Function to update expense list
      const updateList = (list: Expense[]) => {
        return list.map(e => {
          // If it's the specific expense ID (current month) 
          // OR it shares the recurringGroupId (future month propagation)
          if (e.id === expenseId || (recurringGroupId && e.recurringGroupId === recurringGroupId)) {
             return { ...e, ...newValues };
          }
          return e;
        });
      };

      if (projectId) {
        return {
          ...report,
          projectUpdates: report.projectUpdates.map(p => 
            p.projectId === projectId ? { ...p, expenses: updateList(p.expenses) } : p
          )
        };
      } else {
        return {
          ...report,
          startupUpdates: {
            ...report.startupUpdates,
            expenses: updateList(report.startupUpdates.expenses)
          }
        };
      }
    });

    setReports(updatedReports);
    const updatedSelected = updatedReports.find((r) => r.reportId === reportId);
    if (updatedSelected) setSelectedReport(updatedSelected);
  };

  const handleRemoveExpense = (projectId: string | null, expenseId: string) => {
    if (!selectedReport) return;

    // 1. Find the expense to check recurringGroupId
    let expenseToDelete: Expense | undefined;
    if (projectId) {
      const p = selectedReport.projectUpdates.find(p => p.projectId === projectId);
      expenseToDelete = p?.expenses.find(e => e.id === expenseId);
    } else {
      expenseToDelete = selectedReport.startupUpdates.expenses.find(e => e.id === expenseId);
    }

    const recurringGroupId = expenseToDelete?.recurringGroupId;
    const currentAbsMonth = getAbsMonth(selectedReport.month);

    const updatedReports = reports.map((r) => {
      const reportAbsMonth = getAbsMonth(r.month);
      
      // If this report is older than the current one, do nothing
      if (reportAbsMonth < currentAbsMonth) return r;

      // Determine if we should delete from this report
      // 1. It's the current report
      // 2. It's a future report AND the expense has the same recurringGroupId
      const shouldProcess = (r.reportId === selectedReport.reportId) || (reportAbsMonth > currentAbsMonth);

      if (!shouldProcess) return r;

      if (projectId) {
        return {
          ...r,
          projectUpdates: r.projectUpdates.map((p) =>
            p.projectId === projectId
              ? {
                  ...p,
                  expenses: (p.expenses || []).filter(
                    (e) => {
                      // Logic: 
                      // If exact ID match, delete.
                      // If recurringGroupId matches, delete.
                      if (e.id === expenseId) return false;
                      if (recurringGroupId && e.recurringGroupId === recurringGroupId) return false;
                      return true;
                    }
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
              (e) => {
                if (e.id === expenseId) return false;
                if (recurringGroupId && e.recurringGroupId === recurringGroupId) return false;
                return true;
              }
            ),
          },
        };
      }
    });

    setReports(updatedReports);
    const updatedSelected = updatedReports.find(
      (r) => r.reportId === selectedReport.reportId
    );
    if (updatedSelected) setSelectedReport(updatedSelected);
  };

  const handleAddProjectExpense = (projectId: string) => {
    const input = newExpenseInput[projectId];
    if (input?.item && input?.amount) {
      addExpenseWithPropagation(selectedReport!.reportId, projectId, input);
      setNewExpenseInput({
        ...newExpenseInput,
        [projectId]: {
          item: "",
          amount: "",
          type: "NRE",
          category: "Others",
          fundingSource: "DST",
          periodicity: "Monthly",
        },
      });
    }
  };

  const handleAddStartupExpense = () => {
    if (newStartupExpenseInput.item && newStartupExpenseInput.amount) {
      addExpenseWithPropagation(selectedReport!.reportId, null, newStartupExpenseInput);
      setNewStartupExpenseInput({
        item: "",
        amount: "",
        type: "NRE",
        category: "Others",
        fundingSource: "DST",
        periodicity: "Monthly",
      });
    }
  };

  const handleExpenseInputChange = (
    projectId: string,
    field: keyof ExpenseInput,
    val: string
  ) => {
    const currentInput = newExpenseInput[projectId] || {
        item: "", amount: "", type: "NRE", category: "Others", fundingSource: "DST", periodicity: "Monthly"
    };
    setNewExpenseInput({
      ...newExpenseInput,
      [projectId]: { ...currentInput, [field]: val },
    });
  };

  const handleStartupExpenseInputChange = (
    field: keyof ExpenseInput,
    val: string
  ) => {
    setNewStartupExpenseInput({ ...newStartupExpenseInput, [field]: val });
  };

  // --- HELPER: getExpenseTotal ---
  const getExpenseTotal = (expenses: Expense[]) => {
    return (expenses || []).reduce((sum, item) => {
      let val = typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      if (isNaN(val)) val = 0;
      return sum + val;
    }, 0);
  };

  // --- BUDGET SHEET DATA AGGREGATION ---
  const budgetSheetData = useMemo(() => {
    if (!reports) return [];

    const data = reports.map((report) => {
      let dstRE = 0, dstNRE = 0, gokRE = 0, gokNRE = 0;

      const processExpense = (e: Expense) => {
        let val = parseFloat(e.amount as any);
        if (isNaN(val)) val = 0;
        
        if (e.fundingSource === "GoK") {
            if (e.type === "RE") gokRE += val;
            else gokNRE += val;
        } else {
            if (e.type === "RE") dstRE += val;
            else dstNRE += val;
        }
      };

      report.projectUpdates.forEach((p) => {
        (p.expenses || []).forEach(processExpense);
      });
      (report.startupUpdates?.expenses || []).forEach(processExpense);

      return {
        month: report.month,
        status: report.status,
        dstRE, dstNRE, gokRE, gokNRE,
        totalDST: dstRE + dstNRE,
        totalGoK: gokRE + gokNRE,
        total: dstRE + dstNRE + gokRE + gokNRE,
      };
    });

    return data;
  }, [reports]);

  return (
    <DashboardLayout role="founder" title="Performance Reviews & Reports">
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

      {/* --- PAGE 1: MONTHLY REPORTS --- */}
      {(activeTab === "monthly" || selectedReport) && !selectedQuarterly && (
        <MonthlyReports
          reports={reports}
          selectedReport={selectedReport}
          currentQuarterGoals={currentQuarterGoals}
          isSaving={isSaving}
          airlQuestions={airlQuestions}
          onSelectReport={handleOpenReport}
          onBack={handleBackToList}
          onSave={handleSaveReport}
          onSubmit={handleSubmitReport}
          inputs={{
             newTaskInput,
             newExpenseInput,
             newPointInput,
             newStartupTaskInput,
             newStartupExpenseInput,
             newStartupPointInput
          }}
          actions={{
             handleAddTask,
             handleRemoveTask,
             handleTaskInputChange,
             handleAddStartupTask,
             handleRemoveStartupTask,
             handleStartupTaskInputChange,
             handleAddProjectExpense,
             handleAddStartupExpense,
             handleRemoveExpense,
             handleEditExpense, // New Handler
             handleExpenseInputChange,
             handleStartupExpenseInputChange,
             handleAddPoint,
             handleRemovePoint,
             handleAddStartupPoint,
             handleRemoveStartupPoint,
             handleStartupPointInputChange
          }}
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
          budgetLimits={MOCK_BUDGET_LIMITS}
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