import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { AIRLRadarChart } from "../../components/charts/AIRLRadarChart";
// Keep mock data for Action Items, Facilities etc.
import {
  actionItems,
  facilities,
  mentors,
  reviews,
  currentUser,
} from "../../data/mockData";
import { ArrowRight, Clock, Plus, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { API_URL } from "../../config";

export function FounderDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("open");
  const [showActionModal, setShowActionModal] = useState(false);

  // --- 1. Fetch Real Projects ---
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const userStr = localStorage.getItem("artpark_user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API_URL}/api/projects?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllProjects(data);
      })
      .catch((err) => console.error("Dashboard project fetch error:", err));
  }, [user?.id]);

  const [myActions, setMyActions] = useState(() => {
    const savedActions = localStorage.getItem("founder_actions");
    return savedActions ? JSON.parse(savedActions) : actionItems;
  });

  const [chartSelection, setChartSelection] = useState<string>("all");

  const [newAction, setNewAction] = useState({
    title: "",
    priority: "medium",
    dueDate: "",
  });

  const categories = [
    "Technology",
    "Product",
    "Market Research",
    "Organisation",
    "Target Market",
  ];

  // Mock scores for visualization (Backend does not serve scores yet)
  const projectScores: Record<string, Record<string, number>> = {};

  const currentChartData = useMemo(() => {
    if (chartSelection === "all") {
      const assessedProjects = allProjects; // Simplified for now
      if (assessedProjects.length === 0)
        return categories.map((cat) => ({ subject: cat, A: 0, fullMark: 9 }));

      return categories.map((cat) => ({ subject: cat, A: 3, fullMark: 9 })); // Mock Average
    } else {
      return categories.map((cat) => ({ subject: cat, A: 4, fullMark: 9 })); // Mock Single
    }
  }, [chartSelection, allProjects]);

  const displayLevel = useMemo(() => {
    if (chartSelection === "all") {
      if (allProjects.length === 0) return 0;
      const totalAIRL = allProjects.reduce(
        (sum: number, p: any) => sum + (p.currentAIRL || 0),
        0
      );
      return Math.ceil(totalAIRL / allProjects.length);
    } else {
      const project = allProjects.find((p: any) => p.id === chartSelection);
      return project ? project.currentAIRL : 0;
    }
  }, [chartSelection, allProjects]);

  const currentProject =
    chartSelection === "all"
      ? allProjects[0]
      : allProjects.find((p: any) => p.id === chartSelection) || allProjects[0];

  // --- Handlers ---
  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    const action: any = {
      id: `new-${Date.now()}`,
      title: newAction.title,
      status: "open",
      priority: newAction.priority,
      dueDate: newAction.dueDate || new Date().toISOString().split("T")[0],
    };

    const updatedActions = [action, ...myActions];
    setMyActions(updatedActions);
    localStorage.setItem("founder_actions", JSON.stringify(updatedActions));

    setShowActionModal(false);
    setNewAction({ title: "", priority: "medium", dueDate: "" });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedActions = myActions.map((action: any) =>
      action.id === id ? { ...action, status: newStatus } : action
    );
    setMyActions(updatedActions);
    localStorage.setItem("founder_actions", JSON.stringify(updatedActions));
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (!currentProject && allProjects.length === 0)
    return (
      <DashboardLayout role="founder" title="Dashboard">
        <div className="p-12 text-center text-gray-500">
          <p className="mb-4">You haven't added any projects yet.</p>
          <Button onClick={() => navigate("/founder/projects")}>
            Create Your First Project
          </Button>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout role="founder" title={`Welcome back`}>
      {/* Project Selector Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentProject ? currentProject.name : "Your Projects"}
            </h2>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Last updated recently
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-right mr-4">
            <p className="text-sm text-gray-500">Current Level</p>
            <p className="text-3xl font-bold text-blue-600">
              AIRL {currentProject ? currentProject.currentAIRL : 0}
            </p>
          </div>
          {currentProject && (
            <Button
              onClick={() =>
                navigate(`/founder/assessment?projectId=${currentProject.id}`)
              }
            >
              Continue Assessment <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* AIRL Status Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>AIRL Status Overview</CardTitle>
              <div className="w-48">
                <select
                  className="w-full text-xs bg-white border border-gray-200 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-gray-700"
                  value={chartSelection}
                  onChange={(e) => setChartSelection(e.target.value)}
                >
                  <option value="all">Startup Aggregate (Avg)</option>
                  <option disabled>──────────</option>
                  {allProjects.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2">
                  <AIRLRadarChart data={currentChartData} />
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0 pl-0 md:pl-6">
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-1 tracking-wider">
                      {chartSelection === "all"
                        ? "Aggregate Spiral AIRL"
                        : "Project Maturity"}
                    </p>
                    <div className="flex items-end gap-2">
                      <h3 className="text-3xl font-bold text-blue-900">
                        AIRL {displayLevel}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Action Items</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActionModal(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs
                tabs={[
                  { id: "open", label: "Open" },
                  { id: "in_progress", label: "In Progress" },
                  { id: "done", label: "Done" },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="mb-4"
              />

              <div className="space-y-3">
                {myActions
                  .filter((i: any) => i.status === activeTab)
                  .map((action: any) => (
                    <div
                      key={action.id}
                      className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              action.status === "done"
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {action.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due: {action.dueDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            action.priority === "high"
                              ? "danger"
                              : action.priority === "medium"
                              ? "warning"
                              : "success"
                          }
                        >
                          {action.priority}
                        </Badge>
                        {activeTab === "open" && (
                          <button
                            onClick={() =>
                              handleStatusChange(action.id, "in_progress")
                            }
                            className="p-1.5 rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {activeTab === "in_progress" && (
                          <button
                            onClick={() =>
                              handleStatusChange(action.id, "done")
                            }
                            className="p-1.5 rounded-full hover:bg-green-100 text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Facilities & Mentors (Static Mock) */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facilities & Labs</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/founder/facilities")}
              >
                Book New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilities.slice(0, 2).map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg"
                  >
                    <img
                      src={facility.image}
                      alt={facility.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {facility.name}
                      </h4>
                      <Badge
                        variant={
                          facility.availability === "available"
                            ? "success"
                            : "neutral"
                        }
                      >
                        {facility.availability}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mentors</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/founder/mentors")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentors.slice(0, 2).map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {mentor.name}
                        </h4>
                        <p className="text-xs text-gray-500">{mentor.domain}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Add Action Item"
        size="sm"
      >
        <form onSubmit={handleAddAction} className="space-y-4">
          <Input
            label="Action Description"
            value={newAction.title}
            onChange={(e) =>
              setNewAction({ ...newAction, title: e.target.value })
            }
            required
          />
          <Select
            label="Priority"
            value={newAction.priority}
            onChange={(e) =>
              setNewAction({ ...newAction, priority: e.target.value })
            }
            options={[
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />
          <Input
            label="Deadline"
            type="date"
            value={newAction.dueDate}
            onChange={(e) =>
              setNewAction({ ...newAction, dueDate: e.target.value })
            }
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowActionModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Action</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
