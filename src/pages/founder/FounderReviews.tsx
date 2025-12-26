import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Tabs } from "../../components/ui/Tabs";
import { Textarea } from "../../components/ui/TextArea";
import { Input } from "../../components/ui/Input";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Target,
  ChevronLeft,
  Save,
  DollarSign,
  MessageSquare,
  Info,
  Plus,
  Trash2,
  TrendingUp,
  BarChart3,
  Check,
  X,
  ArrowRight,
  Briefcase,
  Rocket,
  CreditCard,
  Lock,
  Unlock,
  AlertCircle,
  ArrowDownCircle,
  RefreshCw,
  PieChart,
  Building2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";

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

// --- CONSTANTS ---
const RE_CATEGORIES = [
  "Others",
  "Salaries",
  "Subscriptions",
  "Cloud Costs",
  "Office Expenses",
  "Maintenance",
  "Marketing",
];

const NRE_CATEGORIES = [
  "Others",
  "Hardware Purchase",
  "Prototyping",
  "R&D Setup",
  "Software Build",
  "Legal & IP",
  "Office Setup",
];

const PROJECT_COLORS = [
  "#4f46e5",
  "#f97316",
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f43f5e",
];

// --- LOCAL TYPES ---
interface Expense extends BaseExpense {
  type: "RE" | "NRE";
  category?: string;
  periodicity?: "Monthly" | "Quarterly" | "Yearly";
}

interface StartupUpdate {
  highlights: string;
  risks: string; // Used for Lowlights
  scheduleTasks: Task[];
  expenses: Expense[];
}

interface ReportDetail extends Omit<BaseReportDetail, "projectUpdates"> {
  projectUpdates: (BaseReportDetail["projectUpdates"][0] & {
    expenses: Expense[];
  })[];
  startupUpdates: StartupUpdate;
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
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(
    null
  );
  const [selectedQuarterly, setSelectedQuarterly] =
    useState<QuarterlyReport | null>(null);
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

  // Project Inputs
  const [newTaskInput, setNewTaskInput] = useState<
    Record<string, { title: string; date: string; description: string }>
  >({});
  interface ExpenseInput {
    item: string;
    amount: string;
    type: "RE" | "NRE";
    category: string;
    periodicity: "Monthly" | "Quarterly" | "Yearly";
  }
  const [newExpenseInput, setNewExpenseInput] = useState<
    Record<string, ExpenseInput>
  >({});
  const [newPointInput, setNewPointInput] = useState<Record<string, string>>(
    {}
  ); // Key: projectId_field

  // Startup Level Inputs
  const [newStartupTaskInput, setNewStartupTaskInput] = useState<{
    title: string;
    date: string;
    description: string;
  }>({ title: "", date: "", description: "" });
  const [newStartupExpenseInput, setNewStartupExpenseInput] =
    useState<ExpenseInput>({
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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
    projectId: string | null, // null means Startup Level
    input: ExpenseInput
  ) => {
    let safeAmount = parseFloat(input.amount);
    if (isNaN(safeAmount)) safeAmount = 0;

    const type = input.type || "NRE";
    // Default to "Others" if not specified
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
    // Logic to reset category when switching type
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

  // --- HELPER: getExpenseTotal (for calculations) ---
  const getExpenseTotal = (expenses: Expense[]) => {
    return (expenses || []).reduce((sum, item) => {
      let val =
        typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      if (isNaN(val)) val = 0;
      return sum + val;
    }, 0);
  };

  // --- BUDGET SHEET DATA (MEMOIZED & SAFE) ---
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

  // --- PROJECT WISE EXPENSE DATA (NEW GRAPH) ---
  const projectWiseExpenseData = useMemo(() => {
    if (!reports) return [];
    const totals: Record<string, number> = {};

    reports.forEach((report) => {
      // Startup Expenses
      if (report.startupUpdates?.expenses) {
        const sum = getExpenseTotal(report.startupUpdates.expenses);
        totals["Startup Level"] = (totals["Startup Level"] || 0) + sum;
      }
      // Project Expenses
      if (report.projectUpdates) {
        report.projectUpdates.forEach((p) => {
          const sum = getExpenseTotal(p.expenses);
          totals[p.projectName] = (totals[p.projectName] || 0) + sum;
        });
      }
    });

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0) // Only show active projects
      .sort((a, b) => b.value - a.value); // Sort by spend
  }, [reports]);

  // --- HELPERS ---
  const getQuarterlyPromises = (reportMonthYear: string) => {
    const month = reportMonthYear.split(" ")[0];
    let targetQuarter = "";

    if (["January", "February", "March"].includes(month)) targetQuarter = "Q4";
    else if (["April", "May", "June"].includes(month)) targetQuarter = "Q1";
    else if (["July", "August", "September"].includes(month))
      targetQuarter = "Q2";
    else targetQuarter = "Q3";

    const qReport = qReports.find((q) => q.quarter.startsWith(targetQuarter));

    if (qReport && qReport.overallUpdates.nextQuarterCheckpoints) {
      return qReport.overallUpdates.nextQuarterCheckpoints.map((cp) => cp.text);
    }
    return [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reviewed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Auto-Submitted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isLockedForEditing = selectedReport
    ? isReportLocked(selectedReport)
    : false;

  return (
    <DashboardLayout role="founder" title="Performance Reviews & Reports">
      {/* --- LEVEL 1: LIST VIEWS --- */}
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

          {/* TAB 1: MONTHLY */}
          {activeTab === "monthly" && (
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
                            onClick={() => handleOpenReport(report)}
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
          )}

          {/* TAB 2: QUARTERLY LIST */}
          {activeTab === "quarterly" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              {qReports.map((q) => (
                <Card
                  key={q.id}
                  className="overflow-hidden border-l-4"
                  style={{
                    borderLeftColor:
                      q.status === "Reviewed" ? "#10b981" : "#3b82f6",
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
                      onClick={() => handleOpenQuarterly(q)}
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
                          <Info className="w-4 h-4 mr-2" /> No feedback
                          available yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 3: BUDGET SHEET */}
          {activeTab === "budget" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              {/* 1. TABLE (TOP) */}
              <Card className="border-t-4 border-t-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-emerald-900">
                      <DollarSign className="w-5 h-5 mr-2" /> Monthly Budget
                      Sheet
                    </CardTitle>
                    <p className="text-xs text-emerald-600 mt-1">
                      Consolidated view of RE & NRE expenses across Startup
                      Level & Projects.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    leftIcon={<Upload className="w-4 h-4 rotate-180" />}
                  >
                    Export Sheet
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left">Month</th>
                          <th className="px-4 py-3 text-left">Breakdown</th>
                          <th className="px-4 py-3 text-right text-indigo-600">
                            Recurring (RE)
                          </th>
                          <th className="px-4 py-3 text-right text-orange-600">
                            Non-Recurring (NRE)
                          </th>
                          <th className="px-4 py-3 text-right text-gray-900">
                            Total Spent
                          </th>
                          <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {budgetSheetData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-4 py-4 font-bold text-gray-800">
                              {row.month}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                {row.breakdown.map((b, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between text-xs text-gray-500 w-full max-w-[200px]"
                                  >
                                    <span
                                      className={
                                        b.name === "Startup Level"
                                          ? "font-bold text-indigo-900"
                                          : ""
                                      }
                                    >
                                      {b.name}:
                                    </span>
                                    <span>₹{b.total}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right font-mono text-indigo-600">
                              ₹{row.totalRE}
                            </td>
                            <td className="px-4 py-4 text-right font-mono text-orange-600">
                              ₹{row.totalNRE}
                            </td>
                            <td className="px-4 py-4 text-right font-mono font-bold text-gray-900">
                              ₹{row.total}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <Badge
                                variant={
                                  row.status === "Submitted"
                                    ? "success"
                                    : row.status === "Pending"
                                    ? "warning"
                                    : "neutral"
                                }
                              >
                                {row.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* 2. GRAPHS (MIDDLE ROW) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GRAPH 1: RE vs NRE Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Expense Trend (RE vs NRE)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {/* Use a copy for reversing to avoid mutating the memoized data */}
                      <BarChart data={[...budgetSheetData].reverse()}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" hide />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="totalRE"
                          name="Recurring"
                          stackId="a"
                          fill="#4f46e5"
                        />
                        <Bar
                          dataKey="totalNRE"
                          name="Non-Recurring"
                          stackId="a"
                          fill="#f97316"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* GRAPH 2: Project Wise Spend (NEW) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Project-wise Spending (Total)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={projectWiseExpenseData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={{ fontSize: 11 }}
                          interval={0}
                        />
                        <Tooltip
                          formatter={(value) => `₹${value}`}
                          cursor={{ fill: "transparent" }}
                        />
                        <Bar
                          dataKey="value"
                          name="Total Spend"
                          barSize={20}
                          radius={[0, 4, 4, 0]}
                        >
                          {projectWiseExpenseData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                PROJECT_COLORS[index % PROJECT_COLORS.length]
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* 3. BUDGET UTILIZATION (BOTTOM ROW) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48 text-gray-400 text-sm italic">
                  <PieChart className="w-8 h-8 mr-2" /> Detailed budget vs
                  actuals analytics coming soon...
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                      Promises Met
                    </p>
                    <h3 className="text-3xl font-extrabold text-green-600">
                      {performanceMetrics.promisesMetPercentage}%
                    </h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                      Submission Rate
                    </p>
                    <h3 className="text-3xl font-extrabold text-blue-600">
                      {performanceMetrics.onTimeSubmissionRate}
                    </h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                      Growth Streak
                    </p>
                    <div className="flex justify-center items-center gap-1 text-3xl font-extrabold text-amber-500">
                      {performanceMetrics.streak}{" "}
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-gray-500" /> Goal
                    Completion Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        fillOpacity={1}
                      />
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
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToList}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedReport.month} Report
                  </h2>
                  {isLockedForEditing && (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
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
                  onClick={handleSaveReport}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleSubmitReport}
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
              {/* --- STARTUP LEVEL UPDATES (NEW SECTION) --- */}
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
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />{" "}
                        Highlights
                      </label>
                      <div className="bg-white rounded-md border border-gray-200 p-2 space-y-1 min-h-[80px]">
                        {getPoints(selectedReport.startupUpdates.highlights)
                          .length > 0 ? (
                          getPoints(
                            selectedReport.startupUpdates.highlights
                          ).map((point, i) => (
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
                                  onClick={() =>
                                    handleRemoveStartupPoint("highlights", i)
                                  }
                                  className="text-gray-300 hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))
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
                              value={newStartupPointInput.highlights}
                              onChange={(e) =>
                                setNewStartupPointInput({
                                  ...newStartupPointInput,
                                  highlights: e.target.value,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleAddStartupPoint("highlights")
                              }
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleAddStartupPoint("highlights")
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <ArrowDownCircle className="w-3 h-3 text-red-600" />{" "}
                        Lowlights
                      </label>
                      <div className="bg-white rounded-md border border-gray-200 p-2 space-y-1 min-h-[80px]">
                        {getPoints(selectedReport.startupUpdates.risks).length >
                        0 ? (
                          getPoints(selectedReport.startupUpdates.risks).map(
                            (point, i) => (
                              <div
                                key={i}
                                className="flex items-start group text-sm p-1 hover:bg-gray-50 rounded"
                              >
                                <span className="text-red-500 mr-2 mt-1">
                                  •
                                </span>
                                <span className="flex-1 text-gray-800">
                                  {point}
                                </span>
                                {!isLockedForEditing && (
                                  <button
                                    onClick={() =>
                                      handleRemoveStartupPoint("risks", i)
                                    }
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
                              value={newStartupPointInput.risks}
                              onChange={(e) =>
                                setNewStartupPointInput({
                                  ...newStartupPointInput,
                                  risks: e.target.value,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleAddStartupPoint("risks")
                              }
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => handleAddStartupPoint("risks")}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    {/* STARTUP MILESTONES */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">
                        Startup Milestones
                      </label>
                      <div className="space-y-2 mb-4">
                        {selectedReport.startupUpdates.scheduleTasks.length >
                        0 ? (
                          selectedReport.startupUpdates.scheduleTasks.map(
                            (task) => (
                              <div
                                key={task.id}
                                className="bg-white border border-gray-200 p-3 rounded-lg"
                              >
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {task.title}
                                  </span>
                                  <Badge
                                    variant="neutral"
                                    className="text-[10px]"
                                  >
                                    {task.deadline}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-end">
                                  <p className="text-xs text-gray-500 italic flex-1 mr-2">
                                    {task.description}
                                  </p>
                                  {!isLockedForEditing && (
                                    <button
                                      onClick={() =>
                                        handleRemoveStartupTask(task.id)
                                      }
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          )
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
                            value={newStartupTaskInput.title}
                            onChange={(e) =>
                              setNewStartupTaskInput({
                                ...newStartupTaskInput,
                                title: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="date"
                            className="h-7 text-xs"
                            value={newStartupTaskInput.date}
                            onChange={(e) =>
                              setNewStartupTaskInput({
                                ...newStartupTaskInput,
                                date: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Description"
                            className="h-7 text-xs"
                            value={newStartupTaskInput.description}
                            onChange={(e) =>
                              setNewStartupTaskInput({
                                ...newStartupTaskInput,
                                description: e.target.value,
                              })
                            }
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full h-7 text-xs mt-1"
                            onClick={handleAddStartupTask}
                            disabled={!newStartupTaskInput.title}
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* STARTUP EXPENSES */}
                    <div className="border-l border-gray-100 pl-6">
                      <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="w-3 h-3 mr-1.5" /> Startup
                          Expense Sheet
                        </div>
                        <Badge variant="neutral">
                          Total: ₹
                          {getExpenseTotal(
                            selectedReport.startupUpdates.expenses
                          )}
                        </Badge>
                      </label>
                      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                              <th className="px-3 py-2 text-left">
                                Item / Category
                              </th>
                              <th className="px-2 py-2 text-center">Type</th>
                              <th className="px-3 py-2 text-right">Amount</th>
                              {!isLockedForEditing && (
                                <th className="px-2 py-2 w-6"></th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {(selectedReport.startupUpdates.expenses || [])
                              .length > 0 ? (
                              selectedReport.startupUpdates.expenses.map(
                                (exp) => (
                                  <tr key={exp.id} className="bg-white">
                                    <td className="px-3 py-2">
                                      <div className="text-gray-900 font-medium">
                                        {exp.item}
                                      </div>
                                      <div className="text-[10px] text-gray-400 flex items-center gap-2">
                                        <span>{exp.category}</span>
                                        {exp.type === "RE" &&
                                          exp.periodicity && (
                                            <span className="bg-indigo-50 text-indigo-700 px-1 rounded flex items-center">
                                              <RefreshCw className="w-2 h-2 mr-1" />{" "}
                                              {exp.periodicity}
                                            </span>
                                          )}
                                      </div>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                          exp.type === "RE"
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "bg-orange-50 text-orange-700"
                                        }`}
                                      >
                                        {exp.type}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-right font-mono">
                                      ₹{exp.amount}
                                    </td>
                                    {!isLockedForEditing && (
                                      <td className="px-2 py-2 text-center">
                                        <button
                                          onClick={() =>
                                            handleRemoveExpense(null, exp.id)
                                          }
                                          className="text-gray-300 hover:text-red-500"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                )
                              )
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
                              value={newStartupExpenseInput.item}
                              onChange={(e) =>
                                handleStartupExpenseInputChange(
                                  "item",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              type="number"
                              placeholder="₹ Amount"
                              className="h-7 text-xs w-24"
                              value={newStartupExpenseInput.amount}
                              onChange={(e) =>
                                handleStartupExpenseInputChange(
                                  "amount",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="flex gap-2 items-center">
                            <select
                              className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-20"
                              value={newStartupExpenseInput.type}
                              onChange={(e) =>
                                handleStartupExpenseInputChange(
                                  "type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="NRE">NRE</option>
                              <option value="RE">RE</option>
                            </select>

                            <select
                              className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none flex-1"
                              value={newStartupExpenseInput.category}
                              onChange={(e) =>
                                handleStartupExpenseInputChange(
                                  "category",
                                  e.target.value
                                )
                              }
                            >
                              {(newStartupExpenseInput.type === "RE"
                                ? RE_CATEGORIES
                                : NRE_CATEGORIES
                              ).map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>

                            {newStartupExpenseInput.type === "RE" && (
                              <select
                                className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-24"
                                value={newStartupExpenseInput.periodicity}
                                onChange={(e) =>
                                  handleStartupExpenseInputChange(
                                    "periodicity",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                              </select>
                            )}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 text-xs px-3"
                              onClick={handleAddStartupExpense}
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
                        <div className="px-2 py-0.5 rounded text-[10px] font-bold border text-gray-500 bg-white border-gray-200">
                          System Risk: {project.systemRisk}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* COL 1: HIGHLIGHTS (Pointers) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />{" "}
                          Highlights
                        </label>

                        {/* POINTERS LIST */}
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
                                    onClick={() =>
                                      handleRemovePoint(
                                        project.projectId,
                                        "highlights",
                                        i
                                      )
                                    }
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

                          {/* ADD INPUT */}
                          {!isLockedForEditing && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                              <Input
                                className="h-8 text-xs border-transparent focus:border-blue-200 bg-gray-50"
                                placeholder="Add highlight..."
                                value={
                                  newPointInput[
                                    `${project.projectId}_highlights`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setNewPointInput({
                                    ...newPointInput,
                                    [`${project.projectId}_highlights`]:
                                      e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleAddPoint(
                                      project.projectId,
                                      "highlights"
                                    );
                                }}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                onClick={() =>
                                  handleAddPoint(
                                    project.projectId,
                                    "highlights"
                                  )
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* COL 2: LOWLIGHTS (Pointers) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <ArrowDownCircle className="w-3 h-3 text-red-600" />{" "}
                          Lowlights
                        </label>

                        {/* POINTERS LIST */}
                        <div className="bg-white rounded-md border border-gray-200 p-2 space-y-1 min-h-[100px]">
                          {getPoints(project.risks).length > 0 ? (
                            getPoints(project.risks).map((point, i) => (
                              <div
                                key={i}
                                className="flex items-start group text-sm p-1 hover:bg-gray-50 rounded"
                              >
                                <span className="text-red-500 mr-2 mt-1">
                                  •
                                </span>
                                <span className="flex-1 text-gray-800">
                                  {point}
                                </span>
                                {!isLockedForEditing && (
                                  <button
                                    onClick={() =>
                                      handleRemovePoint(
                                        project.projectId,
                                        "risks",
                                        i
                                      )
                                    }
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic p-2">
                              No lowlights added yet.
                            </p>
                          )}

                          {/* ADD INPUT */}
                          {!isLockedForEditing && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                              <Input
                                className="h-8 text-xs border-transparent focus:border-blue-200 bg-gray-50"
                                placeholder="Add lowlight..."
                                value={
                                  newPointInput[`${project.projectId}_risks`] ||
                                  ""
                                }
                                onChange={(e) =>
                                  setNewPointInput({
                                    ...newPointInput,
                                    [`${project.projectId}_risks`]:
                                      e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleAddPoint(project.projectId, "risks");
                                }}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                onClick={() =>
                                  handleAddPoint(project.projectId, "risks")
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      {/* COL 1: MILESTONES */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex justify-between items-center">
                          <span>Milestones & Promises</span>
                          <span className="text-blue-600 font-normal normal-case text-xs bg-blue-50 px-2 py-1 rounded">
                            Target: AIRL {project.currentAIRL + 1}
                          </span>
                        </label>
                        <div className="space-y-2 mb-4">
                          {project.scheduleTasks.length > 0 ? (
                            project.scheduleTasks.map((task) => (
                              <div
                                key={task.id}
                                className="bg-white border border-gray-200 p-3 rounded-lg"
                              >
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {task.title}
                                  </span>
                                  <Badge
                                    variant="neutral"
                                    className="text-[10px]"
                                  >
                                    {task.deadline}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-end">
                                  <p className="text-xs text-gray-500 italic flex-1 mr-2">
                                    {task.description}
                                  </p>
                                  {!isLockedForEditing && (
                                    <button
                                      onClick={() =>
                                        handleRemoveTask(
                                          project.projectId,
                                          task.id
                                        )
                                      }
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
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                              Add New Milestone
                            </label>
                            <select
                              className="w-full text-xs border-gray-300 rounded-md p-1.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                              value={
                                newTaskInput[project.projectId]?.title || ""
                              }
                              onChange={(e) =>
                                handleTaskInputChange(
                                  project.projectId,
                                  "title",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">-- Select Milestone --</option>
                              <optgroup label="Previous Quarter Promises">
                                {getQuarterlyPromises(selectedReport.month).map(
                                  (p, i) => (
                                    <option key={i} value={p}>
                                      {p}
                                    </option>
                                  )
                                )}
                              </optgroup>
                              <optgroup
                                label={`AIRL ${
                                  project.currentAIRL + 1
                                } Assessment Criteria`}
                              >
                                {airlQuestions
                                  .filter(
                                    (q) =>
                                      q.airlLevel === project.currentAIRL + 1
                                  )
                                  .map((q) => (
                                    <option key={q.id} value={q.text}>
                                      {q.text}
                                    </option>
                                  ))}
                              </optgroup>
                            </select>
                            <Input
                              type="date"
                              className="h-7 text-xs"
                              value={
                                newTaskInput[project.projectId]?.date || ""
                              }
                              onChange={(e) =>
                                handleTaskInputChange(
                                  project.projectId,
                                  "date",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              placeholder="Plan (1-2 sentences)"
                              className="h-7 text-xs"
                              value={
                                newTaskInput[project.projectId]?.description ||
                                ""
                              }
                              onChange={(e) =>
                                handleTaskInputChange(
                                  project.projectId,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full h-7 text-xs mt-1"
                              onClick={() => handleAddTask(project.projectId)}
                              disabled={!newTaskInput[project.projectId]?.title}
                            >
                              Add Milestone
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* COL 2: EXPENSES SHEET */}
                      <div className="border-l border-gray-100 pl-6">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="w-3 h-3 mr-1.5" /> Expense
                            Sheet
                          </div>
                          <Badge variant="neutral">
                            Total: ₹{getExpenseTotal(project.expenses || [])}
                          </Badge>
                        </label>

                        {/* Ledger Table Style */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                              <tr>
                                <th className="px-3 py-2 text-left">
                                  Item / Category
                                </th>
                                <th className="px-2 py-2 text-center">Type</th>
                                <th className="px-3 py-2 text-right">Amount</th>
                                {!isLockedForEditing && (
                                  <th className="px-2 py-2 w-6"></th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {(project.expenses || []).length > 0 ? (
                                (project.expenses as any[]).map((exp) => (
                                  <tr key={exp.id} className="bg-white">
                                    <td className="px-3 py-2">
                                      <div className="text-gray-900 font-medium">
                                        {exp.item}
                                      </div>
                                      <div className="text-[10px] text-gray-400 flex items-center gap-2">
                                        <span>{exp.category}</span>
                                        {exp.type === "RE" &&
                                          exp.periodicity && (
                                            <span className="bg-indigo-50 text-indigo-700 px-1 rounded flex items-center">
                                              <RefreshCw className="w-2 h-2 mr-1" />{" "}
                                              {exp.periodicity}
                                            </span>
                                          )}
                                      </div>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                          exp.type === "RE"
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "bg-orange-50 text-orange-700"
                                        }`}
                                      >
                                        {exp.type}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-right font-mono">
                                      ₹{exp.amount}
                                    </td>
                                    {!isLockedForEditing && (
                                      <td className="px-2 py-2 text-center">
                                        <button
                                          onClick={() =>
                                            handleRemoveExpense(
                                              project.projectId,
                                              exp.id
                                            )
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
                                    No expenses recorded this month.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                              <tr>
                                <td
                                  colSpan={2}
                                  className="px-3 py-2 text-gray-600"
                                >
                                  Total
                                </td>
                                <td className="px-3 py-2 text-right text-gray-900">
                                  ₹{getExpenseTotal(project.expenses || [])}
                                </td>
                                {!isLockedForEditing && <td></td>}
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {!isLockedForEditing && (
                          <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Item Name"
                                className="h-7 text-xs flex-1"
                                value={
                                  newExpenseInput[project.projectId]?.item || ""
                                }
                                onChange={(e) =>
                                  handleExpenseInputChange(
                                    project.projectId,
                                    "item",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                type="number"
                                placeholder="₹ Amount"
                                className="h-7 text-xs w-24"
                                value={
                                  newExpenseInput[project.projectId]?.amount ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleExpenseInputChange(
                                    project.projectId,
                                    "amount",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="flex gap-2 items-center">
                              <select
                                className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-20"
                                value={
                                  newExpenseInput[project.projectId]?.type ||
                                  "NRE"
                                }
                                onChange={(e) =>
                                  handleExpenseInputChange(
                                    project.projectId,
                                    "type",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="NRE">NRE</option>
                                <option value="RE">RE</option>
                              </select>

                              <select
                                className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none flex-1"
                                value={
                                  newExpenseInput[project.projectId]
                                    ?.category || "Others"
                                }
                                onChange={(e) =>
                                  handleExpenseInputChange(
                                    project.projectId,
                                    "category",
                                    e.target.value
                                  )
                                }
                              >
                                {(newExpenseInput[project.projectId]?.type ===
                                "RE"
                                  ? RE_CATEGORIES
                                  : NRE_CATEGORIES
                                ).map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>

                              {/* Periodicity Selector (Only if RE) */}
                              {newExpenseInput[project.projectId]?.type ===
                                "RE" && (
                                <select
                                  className="h-7 text-xs border border-gray-300 rounded px-1 bg-white focus:outline-none w-24"
                                  value={
                                    newExpenseInput[project.projectId]
                                      ?.periodicity || "Monthly"
                                  }
                                  onChange={(e) =>
                                    handleExpenseInputChange(
                                      project.projectId,
                                      "periodicity",
                                      e.target.value
                                    )
                                  }
                                  title="Auto-adds to future reports"
                                >
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Yearly">Yearly</option>
                                </select>
                              )}

                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-7 text-xs px-3"
                                onClick={() =>
                                  handleAddProjectExpense(project.projectId)
                                }
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
      )}
    </DashboardLayout>
  );
}
